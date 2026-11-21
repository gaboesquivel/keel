import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConceptEntries } from "@/components/library/concept-entries";
import { Container, Eyebrow } from "@/components/ui";
import type { Concept } from "@/lib/content";
import { getConcept, getQuestion, questionRoute, questions } from "@/lib/library";
import { indexMetadata } from "@/lib/writing-metadata";

export const dynamicParams = false;
export const generateStaticParams = () => questions.map((q) => ({ slug: q.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const q = getQuestion((await params).slug);
  return q ? indexMetadata(questionRoute(q), q.title, q.framing.slice(0, 155)) : {};
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const question = getQuestion((await params).slug);
  if (!question) notFound();
  const items = question.concepts.map((c) => ({ concept: getConcept(c.slug) as Concept, why: c.why })).filter((x) => x.concept);
  const others = questions.filter((q) => q.slug !== question.slug);

  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      <nav aria-label="Breadcrumb" className="label-mono">
        <Link href="/library" className="hover:text-fg">
          Library
        </Link>{" "}
        <span aria-hidden="true">/</span> Start with a problem
      </nav>
      <header className="mt-12 max-w-[48rem] sm:mt-16">
        <Eyebrow>A problem to start from</Eyebrow>
        <h1 className="headline mt-6 text-[clamp(2.4rem,5.4vw,4rem)] text-fg">{question.title}</h1>
        <p className="mt-8 max-w-[42rem] text-[1.0625rem] leading-[1.75] text-fg-muted sm:text-lg">{question.framing}</p>
      </header>

      <section aria-labelledby="ideas-heading" className="mt-14 max-w-[52rem]">
        <h2 id="ideas-heading" className="label-mono">
          Ideas that help, in a sensible reading order
        </h2>
        <div className="mt-5">
          <ConceptEntries items={items} numbered />
        </div>
      </section>

      <nav aria-labelledby="more-heading" className="mt-20 max-w-[52rem]">
        <h2 id="more-heading" className="eyebrow">
          Other problems
        </h2>
        <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
          {others.map((q) => (
            <li key={q.slug}>
              <Link href={questionRoute(q)} className="group flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                <span className="font-semibold tracking-[-0.015em] text-fg transition-colors group-hover:text-lavender-soft">{q.title}</span>
                <span aria-hidden="true" className="text-fg-subtle group-hover:text-lavender">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
