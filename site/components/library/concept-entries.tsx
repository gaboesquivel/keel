import Link from "next/link";

import type { Concept } from "@/lib/content";
import { conceptRoute } from "@/lib/library";

/** Editorial list of concepts: title, byline and summary, separated by fine rules. `why` adds a curated reason per entry. */
export function ConceptEntries({ items, numbered = false }: { items: { concept: Concept; why?: string }[]; numbered?: boolean }) {
  return (
    <ol className="border-t border-line-strong">
      {items.map(({ concept: c, why }, i) => (
        <li key={c.slug}>
          <Link href={conceptRoute(c)} className={`group grid gap-x-8 gap-y-2 border-b border-line py-7 ${numbered ? "sm:grid-cols-[3rem_minmax(0,1fr)]" : ""}`}>
            {numbered ? <span className="label-mono pt-2">{String(i + 1).padStart(2, "0")}</span> : null}
            <span>
              <span className="block text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg transition-colors group-hover:text-lavender-soft">{c.title}</span>
              <span className="mt-1.5 block font-mono text-xs tracking-[0.02em] text-lavender">{c.byline}</span>
              {why ? <span className="mt-3 block leading-relaxed text-fg">{why}</span> : null}
              <span className={`mt-2 block leading-relaxed ${why ? "text-fg-subtle text-[0.95rem]" : "text-fg-muted"}`}>{c.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
