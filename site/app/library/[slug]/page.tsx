import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Prose } from "@/components/prose";
import { ArrowUpRight, Container } from "@/components/ui";
import type { Concept, ConceptLink } from "@/lib/content";
import { conceptRoute, concepts, conceptsIn, getConcept, getTopic, questionRoute, questionsFor, sourceLine, topicRoute } from "@/lib/library";
import { indexMetadata } from "@/lib/writing-metadata";

export const dynamicParams = false;
export const generateStaticParams = () => concepts.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getConcept((await params).slug);
  return c ? indexMetadata(conceptRoute(c), c.title, c.summary) : {};
}

const checkedDate = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

function ConnectionGroup({ label, sign, items }: { label: string; sign: string; items: ConceptLink[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="label-mono flex items-center gap-2">
        <span aria-hidden="true" className="text-lavender">
          {sign}
        </span>
        {label}
      </h3>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((r) => {
          const c = getConcept(r.slug);
          if (!c) return null;
          return (
            <li key={r.slug}>
              <Link href={conceptRoute(c)} className="group block">
                <span className="font-semibold tracking-[-0.015em] text-fg transition-colors group-hover:text-lavender-soft">{c.title}</span>
                {r.note ? <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{r.note}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Connections({ concept }: { concept: Concept }) {
  const { buildsOn, builtOnBy, tension, related } = concept.connections;
  const answers = questionsFor(concept.slug);
  if (!buildsOn.length && !builtOnBy.length && !tension.length && !related.length && !answers.length) return null;
  return (
    <nav aria-labelledby="connections-heading" className="space-y-7">
      <h2 id="connections-heading" className="eyebrow">
        Connections
      </h2>
      <ConnectionGroup label="Builds on" sign="→" items={buildsOn} />
      <ConnectionGroup label="In tension with" sign="↔" items={tension} />
      <ConnectionGroup label="Built on by" sign="←" items={builtOnBy} />
      <ConnectionGroup label="Related" sign="·" items={related} />
      {answers.length ? (
        <div>
          <h3 className="label-mono flex items-center gap-2">
            <span aria-hidden="true" className="text-lavender">
              ?
            </span>
            Helps answer
          </h3>
          <ul className="mt-2.5 space-y-2.5">
            {answers.map((q) => (
              <li key={q.slug}>
                <Link href={questionRoute(q)} className="text-fg-muted transition-colors hover:text-fg">
                  {q.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}

/** Section treatments: the idea reads as a lead; the source's claims and keel's reading are visibly different voices. */
function ConceptSection({ concept, section }: { concept: Concept; section: Concept["sections"][number] }) {
  const headingId = `section-${section.id}`;
  if (section.id === "idea")
    return (
      <section aria-labelledby={headingId}>
        <h2 id={headingId} className="label-mono">
          {section.title}
        </h2>
        <Prose html={section.html} className="prose-reading prose-lead mt-4" />
      </section>
    );
  if (section.id === "source" || section.id === "origin")
    return (
      <section aria-labelledby={headingId} className="border-l-2 border-periwinkle/50 pl-5 sm:pl-7">
        <h2 id={headingId} className="label-mono text-periwinkle">
          {section.title}
        </h2>
        <p className="mt-1.5 text-sm text-fg-subtle">{section.id === "source" ? `As argued by ${concept.byline.split(" · ")[0]}` : "An idea keel holds, and what informed it"}</p>
        <Prose html={section.html} className="prose-reading mt-4" />
      </section>
    );
  if (section.id === "perspective")
    return (
      <section aria-labelledby={headingId} className="border-l-2 border-pink/50 pl-5 sm:pl-7">
        <h2 id={headingId} className="label-mono text-pink">
          {section.title}
        </h2>
        <p className="mt-1.5 text-sm text-fg-subtle">keel’s interpretation, not the source’s claim</p>
        <Prose html={section.html} className="prose-reading mt-4" />
      </section>
    );
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="label-mono">
        {section.title}
      </h2>
      <Prose html={section.html} className="prose-reading mt-4" />
    </section>
  );
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const concept = getConcept((await params).slug);
  if (!concept) notFound();
  const topic = getTopic(concept.topic);
  const siblings = conceptsIn(concept.topic);
  const i = siblings.findIndex((c) => c.slug === concept.slug);
  const prev = siblings[(i - 1 + siblings.length) % siblings.length] as Concept;
  const next = siblings[(i + 1) % siblings.length] as Concept;

  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      <nav aria-label="Breadcrumb" className="label-mono">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <li>
            <Link href="/library" className="hover:text-fg">
              Library
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{topic ? <Link href={topicRoute(topic)} className="hover:text-fg">{topic.title}</Link> : concept.topic}</li>
        </ol>
      </nav>

      <article className="mt-12 sm:mt-16">
        <header className="max-w-[46rem]">
          <h1 className="headline text-[clamp(2.4rem,5.4vw,4rem)] text-fg">{concept.title}</h1>
          <p className="mt-5 font-mono text-sm tracking-[0.02em] text-lavender">{concept.byline}</p>
          <p className="mt-7 max-w-[40rem] text-xl font-medium leading-snug tracking-[-0.015em] text-fg-muted sm:text-2xl">{concept.summary}</p>
        </header>

        <div className="mt-12 grid gap-x-20 gap-y-16 border-t border-line pt-10 sm:mt-16 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 space-y-14">
            {concept.sections.map((s) => (
              <ConceptSection key={s.id} concept={concept} section={s} />
            ))}

            {concept.sources.length ? (
              <section aria-labelledby="sources-heading" className="max-w-[42rem] border-t border-line-strong pt-8">
                <h2 id="sources-heading" className="label-mono">
                  Original sources
                </h2>
                <ul className="mt-5 space-y-6">
                  {concept.sources.map((s) => (
                    <li key={s.url}>
                      <p className="font-semibold text-fg">{s.title}</p>
                      <p className="mt-1 text-sm text-fg-muted">{sourceLine(s)}</p>
                      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        {s.status === "live" ? (
                          <a href={s.url} rel="noopener" className="inline-flex items-center gap-1 font-semibold text-lavender hover:text-lavender-soft">
                            Original <ArrowUpRight className="size-3" />
                          </a>
                        ) : (
                          <span className="text-fg-subtle">Original no longer online</span>
                        )}
                        {s.archive ? (
                          <a href={s.archive} rel="noopener" className="inline-flex items-center gap-1 font-semibold text-lavender hover:text-lavender-soft">
                            Archived copy <ArrowUpRight className="size-3" />
                          </a>
                        ) : null}
                        <span className="label-mono self-center normal-case tracking-[0.02em]">Checked {checkedDate(s.checked)}</span>
                      </p>
                      {s.note ? <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{s.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <p className="max-w-[42rem] border-t border-line-strong pt-8 text-sm text-fg-subtle">An idea keel holds; there is no single external source to cite.</p>
            )}
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-8">
            <div className="lg:sticky lg:top-24">
              <Connections concept={concept} />
            </div>
          </aside>
        </div>
      </article>

      {siblings.length > 1 && topic ? (
        <nav aria-label={`More in ${topic.title}`} className="mt-24 grid gap-px border-t border-line-strong sm:grid-cols-2">
          {[
            { label: "Previous", c: prev },
            { label: "Next", c: next },
          ].map(({ label, c }) => (
            <Link key={label} href={conceptRoute(c)} className={`group block py-6 ${label === "Next" ? "sm:text-right" : ""}`}>
              <span className="label-mono">
                {label} in {topic.title}
              </span>
              <span className="mt-1.5 block text-xl font-semibold tracking-[-0.025em] text-fg transition-colors group-hover:text-lavender-soft">{c.title}</span>
            </Link>
          ))}
        </nav>
      ) : null}
    </Container>
  );
}
