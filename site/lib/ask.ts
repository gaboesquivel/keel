// Ask Keel, server side only: owner access, retrieval from the Library, one bounded model call through Vercel AI Gateway,
// and validation of the answer against the real entries. Never import this from a client component.
import { createHmac, timingSafeEqual } from "node:crypto";

import { generateText, Output } from "ai";
import { z } from "zod";

import type { Concept } from "@/lib/content";
import { concepts, getConcept, getTopic, questions, questionsFor } from "@/lib/library";
import { search } from "@/lib/library-search";

/** One place to change the model. Sonnet: faithful synthesis over a few thousand words of context at modest cost. */
export const ASK_MODEL = "anthropic/claude-sonnet-5.5";

export const LIMITS = {
  questionMin: 8,
  questionMax: 600,
  /** Full entries sent per question; the rest of the Library goes as titles and summaries only. */
  entries: 16,
  /** The answer is ~400 tokens; the rest is headroom for the model's reasoning so structured output isn't cut off. */
  maxOutputTokens: 3000,
  timeoutMs: 45_000,
} as const;

export const COOKIE = "keel_ask";
const COOKIE_PURPOSE = "keel-ask-owner-v1";

/** Ask exists only where both the Gateway key and the owner secret are configured. */
export const askConfigured = () => concepts.length > 0 && Boolean(process.env.AI_GATEWAY_API_KEY && process.env.KEEL_ASK_SECRET && process.env.KEEL_ASK_SECRET.length >= 24);

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** The cookie holds a MAC of a fixed purpose under the secret, never the secret itself. Rotating the secret signs everyone out. */
export const ownerToken = () => createHmac("sha256", process.env.KEEL_ASK_SECRET ?? "").update(COOKIE_PURPOSE).digest("base64url");
export const secretMatches = (candidate: string) => askConfigured() && safeEqual(candidate, process.env.KEEL_ASK_SECRET ?? "");
export const isOwner = (cookieValue: string | undefined) => askConfigured() && Boolean(cookieValue) && safeEqual(cookieValue ?? "", ownerToken());

// ---------- retrieval ----------

const conceptText = (c: Concept) => c.sections.map((s) => `${s.title}: ${s.text}`).join("\n");

/**
 * Pick the entries most relevant to a question. First the curated problems ("What should I validate first?") that best
 * match the reader's words contribute their concepts, because that curation already maps everyday language to the
 * Library's terms; then local keyword scoring over titles, keywords, summaries and full text fills the rest. At this
 * collection size that is fast, free and inspectable; embeddings wait for evidence that it fails.
 */
export const retrieve = (question: string, limit: number = LIMITS.entries) => {
  const viaQuestions = search(
    questions.map((q) => ({ slug: q.slug, title: q.title, summary: q.framing, topic: "", byline: "", keywords: q.concepts.map((c) => c.why) })),
    question,
    { mode: "any", limit: 2 },
  ).flatMap((r) => questions.find((q) => q.slug === r.doc.slug)?.concepts.map((c) => c.slug) ?? []);
  const viaSearch = searchConcepts(question).map((r) => r.doc.slug);
  return [...new Set([...viaQuestions, ...viaSearch])].slice(0, limit).map((slug) => getConcept(slug) as Concept);
};

const searchConcepts = (question: string) =>
  search(
    concepts.map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      topic: getTopic(c.topic)?.title ?? c.topic,
      byline: c.byline,
      // The curated problems an entry helps with are the best bridge from a reader's words to the Library's terms.
      keywords: [...c.keywords, ...questionsFor(c.slug).flatMap((q) => [q.title, q.concepts.find((x) => x.slug === c.slug)?.why ?? ""])],
      text: conceptText(c),
    })),
    question,
    { mode: "any", limit: LIMITS.entries },
  );

// ---------- generation ----------

const answerSchema = z.object({
  supported: z.boolean().describe("false when the supplied entries do not contain enough to answer responsibly"),
  headline: z.string().describe("One sentence that reframes the reader's situation. No more than 25 words."),
  paragraphs: z
    .array(
      z.object({
        kind: z.enum(["grounded", "interpretation"]).describe("grounded = restates what the cited entries say; interpretation = keel applying them to this reader's situation"),
        text: z.string(),
        cites: z.array(z.string()).describe("slugs of supplied entries this paragraph relies on"),
      }),
    )
    .max(5),
  ideas: z.array(z.object({ slug: z.string(), why: z.string().describe("one sentence: why this idea matters for this question") })).max(5),
  gaps: z.string().nullable().describe("what the Library does not cover that the question needs, or null"),
});

export type AskAnswer = {
  supported: boolean;
  headline: string;
  paragraphs: { kind: "grounded" | "interpretation"; text: string; cites: { slug: string; title: string }[] }[];
  ideas: { slug: string; title: string; why: string; byline: string; sources: { title: string; url: string; archive: string | null }[] }[];
  gaps: string | null;
  model: string;
};

const SYSTEM = `You are Ask Keel, the question feature of the Keel Library: a curated collection of ideas about building products, startups and software.
A reader describes a real situation. Give them a concise, useful perspective drawn ONLY from the Library entries supplied below.

Rules:
- Use only the supplied entries. Do not add facts, authors, books, studies or advice from outside them. If they are not enough, set supported to false, say so plainly in the headline and gaps, and keep paragraphs short.
- Each entry separates "What the source says" (the original author's claims) from "Keel's perspective" (keel's interpretation). Keep that distinction: never attribute keel's perspective to the original author.
- Mark each paragraph: "grounded" when it restates what the cited entries say, "interpretation" when it applies them to this reader's situation. Interpretation is welcome; label it honestly.
- Cite only slugs from the FULL ENTRIES section. Every grounded paragraph needs at least one citation.
- Where entries disagree (an "in tension with" relation), say so rather than picking a side silently.
- Write for a capable builder: plain, specific, calm. 2 to 4 short paragraphs, under 260 words in total. No preamble, no greeting, no bullet-point dumps, no hype, no rhetorical questions.
- "ideas" lists the 2 to 5 entries that matter most for this question, most important first, each with one sentence on why.`;

const entryBlock = (c: Concept) =>
  [
    `### ${c.slug} — ${c.title}`,
    `Byline: ${c.byline}`,
    `Summary: ${c.summary}`,
    ...c.sections.map((s) => `${s.title}:\n${s.text}`),
    c.connections.tension.length ? `In tension with: ${c.connections.tension.map((t) => `${t.slug}${t.note ? ` (${t.note})` : ""}`).join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

/** Ask one question. Throws on model or transport errors; the route turns those into an honest unavailable state. */
export async function ask(question: string, options: { abortSignal?: AbortSignal } = {}): Promise<{ answer: AskAnswer; retrieved: string[]; usage: unknown }> {
  const picked = retrieve(question);
  if (!picked.length) {
    return {
      answer: {
        supported: false,
        headline: "The Library doesn’t cover this yet.",
        paragraphs: [],
        ideas: [],
        gaps: "No entry matched the question. Try describing the decision you face in different words, or browse by topic.",
        model: "none",
      },
      retrieved: [],
      usage: null,
    };
  }
  const pickedSlugs = new Set(picked.map((c) => c.slug));
  const catalog = concepts.filter((c) => !pickedSlugs.has(c.slug)).map((c) => `- ${c.slug}: ${c.title} — ${c.summary}`);

  const { output, usage } = await generateText({
    model: ASK_MODEL,
    system: SYSTEM,
    prompt: `FULL ENTRIES (the only material you may rely on and cite):\n\n${picked.map(entryBlock).join("\n\n")}\n\nOTHER ENTRIES IN THE LIBRARY (titles only; do not cite):\n${catalog.join("\n")}\n\nREADER'S QUESTION:\n${question}`,
    output: Output.object({ schema: answerSchema }),
    maxOutputTokens: LIMITS.maxOutputTokens,
    temperature: 0.3,
    maxRetries: 1,
    timeout: LIMITS.timeoutMs,
    abortSignal: options.abortSignal,
    providerOptions: { gateway: { tags: ["keel-ask"] } },
  });

  return { answer: validate(output, pickedSlugs), retrieved: [...pickedSlugs], usage };
}

/**
 * Keep only citations to entries that exist and were supplied. A "grounded" paragraph left with no valid citation is
 * relabelled as interpretation rather than shown as evidence it doesn't have.
 */
export function validate(raw: z.infer<typeof answerSchema>, supplied: Set<string>): AskAnswer {
  const ok = (slug: string) => supplied.has(slug) && Boolean(getConcept(slug));
  const paragraphs = raw.paragraphs
    .filter((p) => p.text.trim())
    .map((p) => {
      const cites = [...new Set(p.cites.filter(ok))].map((slug) => ({ slug, title: (getConcept(slug) as Concept).title }));
      return { kind: p.kind === "grounded" && !cites.length ? ("interpretation" as const) : p.kind, text: p.text.trim(), cites };
    });
  const ideas = raw.ideas
    .filter((i, n, all) => ok(i.slug) && all.findIndex((x) => x.slug === i.slug) === n)
    .map((i) => {
      const c = getConcept(i.slug) as Concept;
      return { slug: c.slug, title: c.title, why: i.why.trim(), byline: c.byline, sources: c.sources.map((s) => ({ title: s.title, url: s.url, archive: s.archive })) };
    });
  const supported = raw.supported && ideas.length > 0 && paragraphs.some((p) => p.kind === "grounded");
  return { supported, headline: raw.headline.trim(), paragraphs, ideas, gaps: /^(?:none|n\/a|null)?\.?$/iu.test(raw.gaps?.trim() ?? "") ? null : (raw.gaps?.trim() ?? null), model: ASK_MODEL };
}
