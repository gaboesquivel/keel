"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { AskAnswer } from "@/lib/ask";

type Status = { configured: boolean; authorized: boolean } | null;
type Result = { question: string; answer: AskAnswer };

const MIN = 8;
const MAX = 600;

export function AskKeel() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q")?.slice(0, MAX) ?? "";
  const [status, setStatus] = useState<Status>(null);
  const [question, setQuestion] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const asked = useRef(false);
  const ids = { q: useId(), secret: useId() };

  useEffect(() => {
    fetch("/api/ask", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ configured: false, authorized: false }));
  }, []);

  const submit = useCallback(
    async (text: string) => {
      const q = text.replace(/\s+/gu, " ").trim();
      if (q.length < MIN) {
        setError(`Describe the situation in at least ${MIN} characters.`);
        return;
      }
      setPending(true);
      setError(null);
      setResult(null);
      router.replace(`/library/ask?q=${encodeURIComponent(q)}`, { scroll: false });
      try {
        const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) setStatus((s) => (s ? { ...s, authorized: false } : s));
        if (!res.ok) setError(body.message ?? "Ask couldn’t answer just now. The Library itself is unaffected.");
        else setResult(body as Result);
      } catch {
        setError("Ask couldn’t be reached. Check your connection; the Library itself works offline from search.");
      } finally {
        setPending(false);
      }
    },
    [router],
  );

  // A question handed over from the Library's search box is asked once, on arrival.
  useEffect(() => {
    if (status?.authorized && initial && !asked.current) {
      asked.current = true;
      void submit(initial);
    }
  }, [status, initial, submit]);

  if (!status) return <p className="label-mono mt-16">Checking Ask…</p>;

  if (!status.configured)
    return (
      <Intro>
        <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-fg-muted">
          Ask is a private experiment and isn’t available on this site. Everything in the Library is: start from a problem, a topic or a search on the{" "}
          <Link href="/library" className="font-semibold text-lavender hover:text-lavender-soft">
            Library
          </Link>
          .
        </p>
      </Intro>
    );

  if (!status.authorized) return <Unlock id={ids.secret} onUnlocked={() => setStatus({ configured: true, authorized: true })} />;

  return (
    <>
      <Intro />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(question);
        }}
        className="mt-10 max-w-[52rem] rounded-[18px] border border-line-strong bg-panel/70 p-2 focus-within:border-lavender/60"
      >
        <label htmlFor={ids.q} className="block px-4 pb-1 pt-4 text-lg font-semibold tracking-[-0.02em] text-fg sm:px-5">
          What are you trying to figure out?
        </label>
        <textarea
          id={ids.q}
          value={question}
          onChange={(e) => setQuestion(e.target.value.slice(0, MAX))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void submit(question);
            }
          }}
          rows={3}
          placeholder="I’m building features faster than I can validate them. How should I decide what to work on?"
          className="w-full resize-y bg-transparent px-4 pb-3 pt-2 text-[1.0625rem] leading-relaxed text-fg placeholder:text-fg-subtle focus:outline-none sm:px-5"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
          <p className="label-mono normal-case tracking-[0.02em]">
            {question.length}/{MAX} · ⌘↵ to ask · one question, one answer
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-lavender-soft px-4 text-sm font-semibold text-ink transition-colors hover:bg-lavender disabled:opacity-60"
          >
            {pending ? "Reading the Library…" : "Ask Keel"}
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-14 max-w-[52rem]">
        {pending ? <p className="label-mono">Reading the relevant entries and writing a perspective. This takes a few seconds.</p> : null}
        {error ? <p className="border-l-2 border-pink/60 pl-5 text-fg">{error}</p> : null}
        {result ? <Answer result={result} /> : null}
      </div>
    </>
  );
}

function Intro({ children }: { children?: React.ReactNode }) {
  return (
    <header className="mt-12 max-w-[48rem] sm:mt-16">
      <h1 className="headline text-[clamp(2.4rem,5.4vw,4rem)] text-fg">
        Ask <span className="text-prism">Keel</span>
      </h1>
      {children ?? (
        <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg">
          Describe a real situation. Keel answers once, using only the Library’s entries, shows which ideas it relied on, and says when the Library can’t support an answer.
        </p>
      )}
    </header>
  );
}

function Unlock({ id, onUnlocked }: { id: string; onUnlocked: () => void }) {
  const [secret, setSecret] = useState("");
  const [failed, setFailed] = useState(false);
  return (
    <Intro>
      <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-fg-muted">Ask is a private experiment for now. The rest of the Library is open to everyone.</p>
      <form
        className="mt-8 flex max-w-[30rem] flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/ask/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret }) }).catch(() => null);
          if (res?.ok) onUnlocked();
          else setFailed(true);
        }}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="label-mono">
            Owner key
          </label>
          <input
            id={id}
            type="password"
            autoComplete="current-password"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              setFailed(false);
            }}
            className="mt-2 w-full rounded-lg border border-line-strong bg-panel px-3.5 py-2.5 text-fg focus:border-lavender/60 focus:outline-none"
          />
        </div>
        <button type="submit" className="inline-flex min-h-11 items-center rounded-lg border border-line-strong bg-panel-raised px-5 text-sm font-semibold text-fg hover:border-lavender/50">
          Unlock
        </button>
        {failed ? <p className="w-full text-sm text-pink">That key didn’t match.</p> : null}
      </form>
      <p className="mt-10">
        <Link href="/library" className="text-sm font-semibold text-lavender hover:text-lavender-soft">
          ← Back to the Library
        </Link>
      </p>
    </Intro>
  );
}

function Answer({ result }: { result: Result }) {
  const { answer } = result;
  return (
    <article aria-labelledby="answer-heading">
      <p className="eyebrow">Keel’s perspective</p>
      <h2 id="answer-heading" className="mt-5 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em] text-fg">
        {answer.headline}
      </h2>
      <p className="label-mono mt-4 normal-case tracking-[0.02em]">On: “{result.question}”</p>

      {answer.paragraphs.length ? (
        <div className="mt-8 space-y-6">
          {answer.paragraphs.map((p, i) => (
            <div key={i} className={`border-l-2 pl-5 sm:pl-6 ${p.kind === "grounded" ? "border-periwinkle/50" : "border-pink/50"}`}>
              <p className={`label-mono ${p.kind === "grounded" ? "text-periwinkle" : "text-pink"}`}>{p.kind === "grounded" ? "From the Library" : "Keel’s reading of your situation"}</p>
              <p className="mt-2 text-[1.0625rem] leading-[1.75] text-fg sm:text-lg">{p.text}</p>
              {p.cites.length ? (
                <p className="mt-2 text-sm text-fg-subtle">
                  {p.cites.map((c, n) => (
                    <span key={c.slug}>
                      {n ? " · " : ""}
                      <Link href={`/library/${c.slug}`} className="hover:text-lavender">
                        {c.title}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {answer.gaps ? (
        <div className="mt-8 rounded-xl border border-line bg-panel/60 p-5">
          <p className="label-mono">{answer.supported ? "What the Library doesn’t cover" : "The Library can’t fully answer this"}</p>
          <p className="mt-2 leading-relaxed text-fg-muted">{answer.gaps}</p>
        </div>
      ) : null}

      {answer.ideas.length ? (
        <section aria-labelledby="ideas-behind" className="mt-12">
          <h3 id="ideas-behind" className="eyebrow">
            Ideas behind this answer
          </h3>
          <ol className="mt-5 border-t border-line-strong">
            {answer.ideas.map((idea) => (
              <li key={idea.slug} className="border-b border-line py-5">
                <Link href={`/library/${idea.slug}`} className="group inline-flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-[-0.025em] text-fg transition-colors group-hover:text-lavender-soft">{idea.title}</span>
                  <span aria-hidden="true" className="text-fg-subtle group-hover:text-lavender">
                    ↗
                  </span>
                </Link>
                <p className="mt-1 font-mono text-xs tracking-[0.02em] text-lavender">{idea.byline}</p>
                <p className="mt-2 leading-relaxed text-fg-muted">{idea.why}</p>
                {idea.sources.length ? (
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {idea.sources.map((s) => (
                      <a key={s.url} href={s.url} rel="noopener" className="text-fg-subtle hover:text-lavender">
                        {s.title} ↗
                      </a>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <p className="label-mono mt-10 normal-case tracking-[0.02em]">Generated by {answer.model} from Library entries only. Check the entries before relying on it.</p>
    </article>
  );
}
