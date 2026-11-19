import raw from "@/content/generated/content.json";

export type Heading = { id: string; text: string; depth: number };

/** One skill: the parsed SKILL.md (frontmatter and rendered body) plus presentation copy from content/skills.mjs. */
export type Skill = {
  name: string;
  description: string;
  argumentHint: string | null;
  frontmatter: string;
  body: string;
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

type Content = {
  generatedAt: string;
  commit: string | null;
  repo: { owner: string; name: string; branch: string; url: string };
  skills: Skill[];
};

export const content = raw as unknown as Content;
export const repo = content.repo;
/** Skills in display order. The order is presentation only; each skill is independent. */
export const skills = content.skills;
export const getSkill = (name: string) => skills.find((s) => s.name === name);

/** GitHub URL for a file or directory in this repository. */
export const sourceUrl = (path: string, kind: "blob" | "tree" = "blob") => `${repo.url}/${kind}/${repo.branch}/${path}`;

export const INSTALL = {
  all: `npx skills@latest add ${repo.owner}/${repo.name} -g -y`,
  one: `npx skills@latest add ${repo.owner}/${repo.name} --skill shape -y`,
  list: `npx skills@latest add ${repo.owner}/${repo.name} --list`,
} as const;
