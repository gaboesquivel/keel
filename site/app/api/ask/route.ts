import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ask, askConfigured, COOKIE, isOwner, LIMITS } from "@/lib/ask";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** Model errors carry the finish reason and raw text, which is what diagnosing a failed answer needs. */
const detail = (error: unknown) => {
  const e = error as { finishReason?: unknown; text?: unknown };
  return { finishReason: e?.finishReason ?? null, text: typeof e?.text === "string" ? e.text.slice(0, 800) : null };
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Whether Ask exists here and whether this browser may use it. Says nothing else, so it is safe to call publicly. */
export async function GET() {
  const configured = askConfigured();
  return json({ configured, authorized: configured && isOwner((await cookies()).get(COOKIE)?.value) });
}

/** One question, one grounded answer. Owner only; bounded input, context, output and time. */
export async function POST(request: Request) {
  if (!askConfigured()) return json({ error: "unavailable" }, 404);
  if (!isOwner((await cookies()).get(COOKIE)?.value)) return json({ error: "unauthorized" }, 401);
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: "forbidden" }, 403);

  let question = "";
  try {
    const body = (await request.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question.replace(/\s+/gu, " ").trim() : "";
  } catch {
    return json({ error: "invalid", message: "Send JSON with a question." }, 400);
  }
  if (question.length < LIMITS.questionMin || question.length > LIMITS.questionMax)
    return json({ error: "invalid", message: `Ask in ${LIMITS.questionMin}–${LIMITS.questionMax} characters.` }, 400);

  try {
    const started = Date.now();
    const { answer, retrieved, usage } = await ask(question, { abortSignal: request.signal });
    // The lightweight record PRODUCT.md asks for: what was asked, what was supplied and cited, and what it cost. Owner-only, so no visitor data.
    console.log(
      JSON.stringify({
        event: "keel-ask",
        question,
        retrieved,
        cited: answer.ideas.map((i) => i.slug),
        supported: answer.supported,
        model: answer.model,
        usage,
        ms: Date.now() - started,
      }),
    );
    return json({ question, answer });
  } catch (error) {
    console.error(JSON.stringify({ event: "keel-ask-error", question, error: error instanceof Error ? error.message : String(error), ...detail(error) }));
    return json({ error: "failed", message: "Ask couldn’t produce an answer just now. The Library itself is unaffected." }, 502);
  }
}
