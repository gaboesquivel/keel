"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { type SearchDoc, search } from "@/lib/library-search";

type Doc = SearchDoc & { topicTitle: string };

/**
 * The Library's one question box. Typing searches the local index instantly; for the owner, "Ask Keel" sends the same
 * text to Ask. The Ask button exists only when the server says Ask is configured and this browser is unlocked, so
 * public visitors never see a broken or teasing entry point.
 */
export function LibraryFinder({ docs }: { docs: Doc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canAsk, setCanAsk] = useState(false);
  const inputId = useId();
  const resultsId = useId();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/ask", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { authorized?: boolean } | null) => live && setCanAsk(Boolean(s?.authorized)))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  // "/" focuses the box from anywhere on the page, as in most reference tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/u.test(t.tagName)))) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim();
  const results = useMemo(() => (q ? search(docs, q, { limit: 12 }) : []), [docs, q]);
  // A sentence-like query that matches nothing by keyword is probably a question; say so instead of a dead end.
  const looksLikeQuestion = q.split(/\s+/u).length >= 5 || q.endsWith("?");
  const loose = useMemo(() => (q && !results.length ? search(docs, q, { mode: "any", limit: 5 }) : []), [docs, q, results.length]);

  const ask = () => {
    if (q) router.push(`/library/ask?q=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      <search>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canAsk && looksLikeQuestion) ask();
          else {
            const first = results[0];
            if (first) router.push(`/library/${first.doc.slug}`);
          }
        }}
        className="group/finder rounded-[18px] border border-line-strong bg-panel/70 p-2 transition-colors focus-within:border-lavender/60"
      >
        <label htmlFor={inputId} className="block px-4 pb-1 pt-4 text-lg font-semibold tracking-[-0.02em] text-fg sm:px-5 sm:text-xl">
          What are you trying to figure out?
        </label>
        <input
          ref={input}
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={canAsk ? "Search, or describe a problem" : "Search ideas, authors, topics"}
          autoComplete="off"
          spellCheck={false}
          aria-controls={resultsId}
          aria-describedby={`${inputId}-hint`}
          className="w-full bg-transparent px-4 pb-4 pt-2 text-[1.0625rem] text-fg placeholder:text-fg-subtle focus:outline-none sm:px-5 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
          <p id={`${inputId}-hint`} className="label-mono normal-case tracking-[0.02em]">
            {q ? `${results.length} ${results.length === 1 ? "idea" : "ideas"}` : "Search ideas · press / to focus"}
          </p>
          {canAsk ? (
            <button
              type="button"
              onClick={ask}
              disabled={!q}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-lavender-soft px-4 text-sm font-semibold text-ink transition-colors hover:bg-lavender disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ask Keel <span aria-hidden="true">↗</span>
            </button>
          ) : null}
        </div>
      </form>
      </search>

      <div id={resultsId} aria-live="polite">
        {q ? (
          results.length ? (
            <ol className="mt-6 border-t border-line-strong">
              {results.map(({ doc }) => (
                <li key={doc.slug}>
                  <Link href={`/library/${doc.slug}`} className="group grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                    <span>
                      <span className="block text-lg font-semibold tracking-[-0.02em] text-fg transition-colors group-hover:text-lavender-soft">{doc.title}</span>
                      <span className="mt-1 block text-[0.95rem] leading-relaxed text-fg-muted">{doc.summary}</span>
                    </span>
                    <span className="label-mono sm:pt-1.5 sm:text-right">{doc.topicTitle}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 border-t border-line-strong pt-6">
              <p className="text-fg">
                No idea matches all of “{q}”.{" "}
                {canAsk && looksLikeQuestion ? (
                  <>
                    It reads like a question:{" "}
                    <button type="button" onClick={ask} className="font-semibold text-lavender underline-offset-4 hover:underline">
                      ask Keel instead
                    </button>
                    .
                  </>
                ) : (
                  "Try a single word, or start with a problem below."
                )}
              </p>
              {loose.length ? (
                <>
                  <p className="label-mono mt-6">Closest ideas</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {loose.map(({ doc }) => (
                      <li key={doc.slug}>
                        <Link href={`/library/${doc.slug}`} className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-muted transition-colors hover:border-lavender/50 hover:text-fg">
                          {doc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
