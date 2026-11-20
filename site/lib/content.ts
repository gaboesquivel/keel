import raw from "@/content/generated/content.json";

export type Heading = { id: string; text: string; depth: number };

/** One skill: the parsed SKILL.md (frontmatter and rendered body) plus presentation copy from content/skills.mjs. */
export type Skill = {
  name: string;
  description: string;
  argumentHint: string | null;
  frontmatter: string;
  body: string;
  headline: string;
  tagline: string;
  lede: string;
  benefits: string[];
  example: { situation: string; invocation: string };
  install: string;
  invocation: string;
  source: string;
  files: string[];
  html: string;
  headings: Heading[];
};

/** Kinds of authored writing under content/writing/. The list can grow (for example field notes) with its routes. */
export type WritingKind = "library" | "essay" | "guide";

/** One piece of authored writing from content/writing/, rendered at build time. */
export type Writing = {
  kind: WritingKind;
  slug: string;
  route: string;
  source: string;
  title: string;
  subtitle: string | null;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  order: number | null;
  words: number;
  readingMinutes: number;
  html: string;
  headings: Heading[];
};

type Content = {
  generatedAt: string;
  commit: string | null;
  repo: { owner: string; name: string; branch: string; url: string };
  skills: Skill[];
  writing: Writing[];
};

export const content = raw as unknown as Content;
export const repo = content.repo;
/** Skills in display order. The order is presentation only; each skill is independent. */
export const skills = content.skills;
export const getSkill = (name: string) => skills.find((s) => s.name === name);

/** Authored writing in display order. A section with no files is absent, so nothing links to an empty page. */
export const writing = content.writing;
export const library = writing.find((w) => w.kind === "library");
export const essays = writing.filter((w) => w.kind === "essay");
export const guides = writing.filter((w) => w.kind === "guide");
export const getWriting = (kind: WritingKind, slug: string) => writing.find((w) => w.kind === kind && w.slug === slug);

/** Learning pages for navigation; only sections that have content. */
export const learnNav = [
  ...(guides.length ? [{ href: "/guides", label: "Guides" }] : []),
  ...(library ? [{ href: "/library", label: "Library" }] : []),
  ...(essays.length ? [{ href: "/essays", label: "Essays" }] : []),
];

/** "19 November 2026" from YYYY-MM-DD, independent of the build machine's time zone. */
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

/** GitHub URL for a file or directory in this repository. */
export const sourceUrl = (path: string, kind: "blob" | "tree" = "blob") => `${repo.url}/${kind}/${repo.branch}/${path}`;

export const INSTALL = {
  all: `npx skills@latest add ${repo.owner}/${repo.name} -g -y`,
  one: `npx skills@latest add ${repo.owner}/${repo.name} --skill shape -y`,
  list: `npx skills@latest add ${repo.owner}/${repo.name} --list`,
} as const;
