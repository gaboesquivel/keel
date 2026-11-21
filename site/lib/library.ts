import { type Concept, type Question, type Topic, library } from "@/lib/content";

export const concepts = library.concepts;
export const topics = library.topics;
export const questions = library.questions;

export const getConcept = (slug: string) => concepts.find((c) => c.slug === slug);
export const getTopic = (slug: string) => topics.find((t) => t.slug === slug);
export const getQuestion = (slug: string) => questions.find((q) => q.slug === slug);
export const conceptsIn = (topic: string) => concepts.filter((c) => c.topic === topic);
/** Questions that send readers to a concept, for "Helps answer" on its page. */
export const questionsFor = (slug: string) => questions.filter((q) => q.concepts.some((c) => c.slug === slug));

export const conceptRoute = (c: Pick<Concept, "slug">) => `/library/${c.slug}`;
export const topicRoute = (t: Pick<Topic, "slug">) => `/library/topics/${t.slug}`;
export const questionRoute = (q: Pick<Question, "slug">) => `/library/questions/${q.slug}`;

/** "Eric Ries · The Lean Startup · 2011" style line for one source. */
export const sourceLine = (s: Concept["sources"][number]) => [s.author, s.work && s.work !== s.title ? s.work : null, s.publisher && s.publisher !== s.author ? s.publisher : null, s.year].filter(Boolean).join(" · ");
