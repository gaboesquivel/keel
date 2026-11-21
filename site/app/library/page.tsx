import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LibraryFinder } from "@/components/library/finder";
import { Container, Eyebrow } from "@/components/ui";
import { concepts, conceptsIn, getConcept, getTopic, questionRoute, questions, topicRoute, topics } from "@/lib/library";
import { indexMetadata } from "@/lib/writing-metadata";

const DESCRIPTION = "A curated collection of ideas about building products, startups and software, each summarized, sourced and connected to the ideas around it.";

export const metadata: Metadata = indexMetadata("/library", "Library", DESCRIPTION);

export default function LibraryPage() {
  if (!concepts.length) notFound();
  const docs = concepts.map((c) => ({
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    topic: c.topic,
    topicTitle: getTopic(c.topic)?.title ?? c.topic,
    byline: c.byline,
    keywords: c.keywords,
    // The opening section is short and carries the vocabulary a reader might type; the rest stays out of the page.
    text: c.sections.find((s) => s.id === "idea")?.text ?? "",
  }));
  const index = concepts.slice().sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      <p className="label-mono">
        <Link href="/" className="hover:text-fg">
          keel
        </Link>{" "}
        <span aria-hidden="true">/</span> Library
      </p>

      <header className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
        <h1 className="headline text-[clamp(2.8rem,7vw,5.2rem)] text-fg">
          Good ideas
          <br />
          <span className="text-prism">for better decisions.</span>
        </h1>
        <div className="max-w-[30rem] space-y-4 text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg">
          <p className="text-fg">A curated collection of ideas about building products, startups and software.</p>
          <p>
            Each idea is explained in keel’s own words, kept apart from what its source actually says, linked to the original, and connected to the ideas it builds on or argues with.
          </p>
          <p className="label-mono normal-case tracking-[0.02em]">
            {concepts.length} ideas · {topics.length} topics · {questions.length} problems to start from
          </p>
        </div>
      </header>

      <div className="mt-14 max-w-[52rem] sm:mt-20">
        <LibraryFinder docs={docs} />
      </div>

      <section aria-labelledby="problems-heading" className="mt-24 sm:mt-32">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div>
            <Eyebrow>Start with a problem</Eyebrow>
            <h2 id="problems-heading" className="mt-5 max-w-[22rem] text-2xl font-semibold leading-snug tracking-[-0.03em] text-fg sm:text-3xl">
              Don’t know the term? Start from the question.
            </h2>
          </div>
          <ol className="border-t border-line-strong">
            {questions.map((q, i) => (
              <li key={q.slug}>
                <Link href={questionRoute(q)} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-line py-5">
                  <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-[-0.025em] text-fg transition-colors group-hover:text-lavender-soft">{q.title}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-fg-subtle">
                      {q.concepts
                        .slice(0, 4)
                        .map((c) => getConcept(c.slug)?.title)
                        .join(" · ")}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-lavender">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="topics-heading" className="mt-24 sm:mt-32">
        <Eyebrow>Explore by topic</Eyebrow>
        <h2 id="topics-heading" className="sr-only">
          Topics
        </h2>
        <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t, i) => {
            const inTopic = conceptsIn(t.slug);
            return (
              <li key={t.slug} className="border-t border-line-strong">
                <Link href={topicRoute(t)} className="group block py-7 pr-2">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-2xl font-semibold tracking-[-0.03em] text-fg transition-colors group-hover:text-lavender-soft">{t.title}</span>
                    <span className="label-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-3 block leading-relaxed text-fg-muted">{t.description}</span>
                  <span className="label-mono mt-5 block normal-case tracking-[0.02em]">
                    {inTopic.length} ideas · {inTopic
                      .slice(0, 3)
                      .map((c) => c.title)
                      .join(", ")}
                    {inTopic.length > 3 ? "…" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="ideas-heading" className="mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Ideas to explore</Eyebrow>
            <h2 id="ideas-heading" className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-3xl">
              Every idea in the Library
            </h2>
          </div>
          <p className="label-mono">A–Z</p>
        </div>
        <ul className="mt-8 grid gap-x-12 border-t border-line-strong md:grid-cols-2">
          {index.map((c) => (
            <li key={c.slug}>
              <Link href={`/library/${c.slug}`} className="group flex items-baseline justify-between gap-6 border-b border-line py-3.5">
                <span className="font-semibold tracking-[-0.015em] text-fg transition-colors group-hover:text-lavender-soft">{c.title}</span>
                <span className="label-mono shrink-0 text-right">{getTopic(c.topic)?.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
