import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConceptEntries } from "@/components/library/concept-entries";
import { Container, Eyebrow } from "@/components/ui";
import { conceptsIn, getTopic, questionRoute, questions, topicRoute, topics } from "@/lib/library";
import { indexMetadata } from "@/lib/writing-metadata";

export const dynamicParams = false;
export const generateStaticParams = () => topics.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTopic((await params).slug);
  return t ? indexMetadata(topicRoute(t), t.title, t.description) : {};
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const topic = getTopic((await params).slug);
  if (!topic) notFound();
  const items = conceptsIn(topic.slug);
  const slugs = new Set(items.map((c) => c.slug));
  const nearby = questions.filter((q) => q.concepts.some((c) => slugs.has(c.slug)));

  return (
    <Container className="pb-24 pt-10 sm:pb-32">
      <nav aria-label="Breadcrumb" className="label-mono">
        <Link href="/library" className="hover:text-fg">
          Library
        </Link>{" "}
        <span aria-hidden="true">/</span> Topics
      </nav>
      <header className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
        <div>
          <Eyebrow>Topic · {items.length} ideas</Eyebrow>
          <h1 className="headline mt-6 text-[clamp(2.4rem,5.4vw,4rem)] text-fg">{topic.title}</h1>
        </div>
        <p className="max-w-[30rem] text-[1.0625rem] leading-[1.7] text-fg-muted sm:text-lg">{topic.description}</p>
      </header>

      <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
        <ConceptEntries items={items.map((concept) => ({ concept }))} />
        <aside className="space-y-10">
          {nearby.length ? (
            <div>
              <h2 className="eyebrow">Problems it helps with</h2>
              <ul className="mt-4 space-y-3">
                {nearby.map((q) => (
                  <li key={q.slug}>
                    <Link href={questionRoute(q)} className="text-fg-muted transition-colors hover:text-fg">
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <h2 className="eyebrow">Other topics</h2>
            <ul className="mt-4 space-y-3">
              {topics
                .filter((t) => t.slug !== topic.slug)
                .map((t) => (
                  <li key={t.slug}>
                    <Link href={topicRoute(t)} className="text-fg-muted transition-colors hover:text-fg">
                      {t.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}
