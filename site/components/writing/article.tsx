import Link from "next/link";

import { Prose } from "@/components/prose";
import { Breadcrumbs, Container, Eyebrow, TextLink } from "@/components/ui";
import { formatDate, type Heading, type Writing, writing } from "@/lib/content";

const KIND_LABEL = { library: "Library", essay: "Essay", guide: "Guide" } as const;
const SECTION = { essay: { href: "/essays", label: "Essays" }, guide: { href: "/guides", label: "Guides" } } as const;

/** Minimum number of sections before a page gets a table of contents. */
const TOC_MIN = 3;

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-2.5 text-sm leading-snug">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="text-fg-muted transition-colors hover:text-fg">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Pieces to read next: the rest of the same section in order (starting after this one), then the other sections. */
const nextReads = (entry: Writing) => {
  const same = writing.filter((w) => w.kind === entry.kind);
  const i = same.findIndex((w) => w.route === entry.route);
  const after = [...same.slice(i + 1), ...same.slice(0, i)];
  return [...after, ...writing.filter((w) => w.kind !== entry.kind)].slice(0, 4);
};

export function Article({ entry }: { entry: Writing }) {
  const sections = entry.headings.filter((h) => h.depth === 2);
  const showToc = sections.length >= TOC_MIN;
  const section = entry.kind === "library" ? null : SECTION[entry.kind];
  const more = nextReads(entry);

  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      {section ? <Breadcrumbs items={[section, { label: entry.title }]} /> : null}

      <article className={section ? "mt-14 sm:mt-20" : "mt-6 sm:mt-14"}>
        <header className="max-w-[46rem]">
          <Eyebrow>{KIND_LABEL[entry.kind]}</Eyebrow>
          <h1 className="headline mt-6 text-[clamp(2.4rem,5.4vw,4rem)] text-fg">{entry.title}</h1>
          {entry.subtitle ? <p className="mt-6 max-w-[38rem] text-xl font-medium leading-snug tracking-[-0.015em] text-fg-muted sm:text-2xl">{entry.subtitle}</p> : null}
          <p className="label-mono mt-8 flex flex-wrap gap-x-3 gap-y-1">
            {entry.kind !== "library" ? (
              <>
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <span>{entry.readingMinutes} min read</span>
          </p>
        </header>

        <div className="mt-12 grid gap-x-20 border-t border-line pt-10 sm:mt-16 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            {showToc ? (
              <details className="group/toc -mt-4 mb-10 border-b border-line lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  On this page
                  <span aria-hidden="true" className="text-fg-subtle transition-transform group-open/toc:rotate-90">
                    ›
                  </span>
                </summary>
                <nav aria-label="On this page" className="pb-5">
                  <TocList headings={sections} />
                </nav>
              </details>
            ) : null}
            <Prose html={entry.html} className="prose-reading" />
          </div>

          {showToc ? (
            <aside className="hidden lg:block">
              <nav aria-labelledby="toc-heading" className="sticky top-24 border-l border-line pl-6">
                <h2 id="toc-heading" className="label-mono mb-4">
                  On this page
                </h2>
                <TocList headings={sections} />
              </nav>
            </aside>
          ) : null}
        </div>
      </article>

      {more.length ? (
        <nav aria-labelledby="continue-heading" className="mt-24 max-w-[46rem] border-t border-line-strong pt-10">
          <h2 id="continue-heading" className="label-mono">
            Continue reading
          </h2>
          <ul className="mt-4">
            {more.map((w) => (
              <li key={w.route}>
                <Link href={w.route} className="group block border-b border-line py-5">
                  <span className="label-mono">{KIND_LABEL[w.kind]}</span>
                  <span className="mt-1.5 block text-xl font-semibold tracking-[-0.025em] text-fg transition-colors group-hover:text-lavender-soft">{w.title}</span>
                  <span className="mt-1 block leading-relaxed text-fg-muted">{w.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <TextLink href="/skills" className="mt-8">
            Explore the skills
          </TextLink>
        </nav>
      ) : null}
    </Container>
  );
}

/** Editorial list of essays or guides for an index page. */
export function WritingList({ entries, showDate = false }: { entries: Writing[]; showDate?: boolean }) {
  return (
    <ol className="mt-14 max-w-[46rem] border-t border-line-strong">
      {entries.map((w, i) => (
        <li key={w.route}>
          <Link href={w.route} className="group grid gap-x-8 gap-y-2 border-b border-line py-8 sm:grid-cols-[4rem_minmax(0,1fr)]">
            <span className="label-mono pt-1.5">{showDate ? <time dateTime={w.date}>{w.date.slice(0, 4)}</time> : String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg transition-colors group-hover:text-lavender-soft">{w.title}</span>
              {w.subtitle ? <span className="mt-2 block text-lg leading-snug text-fg">{w.subtitle}</span> : null}
              <span className="mt-2 block leading-relaxed text-fg-muted">{w.description}</span>
              <span className="label-mono mt-4 block">{w.readingMinutes} min read</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
