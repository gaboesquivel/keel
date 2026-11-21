import { describe, expect, it } from "vitest";

import { createRenderer, createSiteRoutes, parseWriting, readingStats, sortWriting, WRITING_KINDS } from "@/scripts/content-lib.mjs";

const source = "site/content/writing/essays/the-art.md";
const doc = (front: string, body = "## First\n\nText.\n") => `---\n${front}\n---\n\n${body}`;
const parse = (text: string, slug = "the-art") => parseWriting({ kind: "essay", slug, route: `/essays/${slug}`, source, text });

describe("parseWriting", () => {
  it("publishes the contract fields, reading stats and the body", () => {
    const { entry, problems } = parse(doc("title: The Art\nsubtitle: A subtitle.\ndescription: One sentence.\ndate: 2026-11-19\norder: 2"));
    expect(problems).toEqual([]);
    expect(entry).toMatchObject({
      kind: "essay",
      slug: "the-art",
      route: "/essays/the-art",
      source,
      title: "The Art",
      subtitle: "A subtitle.",
      description: "One sentence.",
      date: "2026-11-19",
      order: 2,
      readingMinutes: 1,
    });
    expect(entry?.body).toContain("## First");
  });

  it("treats subtitle and order as optional", () => {
    const { entry } = parse(doc("title: T\ndescription: D.\ndate: 2026-01-02"));
    expect(entry).toMatchObject({ subtitle: null, order: null });
  });

  it.each([
    ["no front matter", "## Body\n", "missing front matter"],
    ["no title", doc("description: D.\ndate: 2026-11-19"), 'no "title"'],
    ["no description", doc("title: T\ndate: 2026-11-19"), 'no "description"'],
    ["a folded description", doc("title: T\ndescription: >\n  folded\ndate: 2026-11-19"), "single line"],
    ["a long description", doc(`title: T\ndescription: ${"x".repeat(161)}\ndate: 2026-11-19`), "exceeds 160 characters"],
    ["no date", doc("title: T\ndescription: D."), 'no "date"'],
    ["a malformed date", doc("title: T\ndescription: D.\ndate: 19/11/2026"), "YYYY-MM-DD"],
    ["an impossible date", doc("title: T\ndescription: D.\ndate: 2026-02-30"), "YYYY-MM-DD"],
    ["a non-numeric order", doc("title: T\ndescription: D.\ndate: 2026-11-19\norder: first"), "whole number"],
    ["duplicate keys", doc("title: T\ntitle: U\ndescription: D.\ndate: 2026-11-19"), "duplicate front matter keys: title"],
    ["an empty body", doc("title: T\ndescription: D.\ndate: 2026-11-19", ""), "no body"],
    ["an h1 in the body", doc("title: T\ndescription: D.\ndate: 2026-11-19", "# T\n\n## A\n"), "level-1 heading"],
  ])("fails clearly, naming the file, on %s", (_, text, reason) => {
    const { entry, problems } = parse(text);
    expect(entry).toBeNull();
    expect(problems.join("\n")).toContain(source);
    expect(problems.join("\n")).toContain(reason);
  });

  it("allows # inside fenced code", () => {
    const { problems } = parse(doc("title: T\ndescription: D.\ndate: 2026-11-19", "## A\n\n```bash\n# a comment\n```\n"));
    expect(problems).toEqual([]);
  });

  it("requires a kebab-case file name", () => {
    expect(parse(doc("title: T\ndescription: D.\ndate: 2026-11-19"), "The_Art").problems.join()).toContain("kebab-case");
  });
});

describe("readingStats", () => {
  it("counts words outside code and rounds minutes, with at least one", () => {
    expect(readingStats("one two three\n\n```js\nignored code here\n```\n")).toEqual({ words: 3, readingMinutes: 1 });
    expect(readingStats(Array(460).fill("word").join(" ")).readingMinutes).toBe(2);
  });
});

describe("sortWriting", () => {
  const e = (kind: string, title: string, extra: Record<string, unknown> = {}) => ({ kind, title, date: "2026-01-01", order: null, ...extra });
  it("puts essays newest first, then guides by order then title", () => {
    const sorted = sortWriting([
      e("guide", "B"),
      e("guide", "Z", { order: 2 }),
      e("essay", "Old", { date: "2025-01-01" }),
      e("guide", "A", { order: 1 }),
      e("essay", "New", { date: "2026-06-01" }),
    ]);
    expect(sorted.map((w: { title: string }) => w.title)).toEqual(["New", "Old", "A", "Z", "B"]);
  });

  it("knows the published kinds and their routes", () => {
    expect(WRITING_KINDS.map((k: { route: string }) => k.route)).toEqual(["/essays", "/guides"]);
  });
});

describe("rendering writing", () => {
  const options = { repoUrl: "https://github.com/gaboesquivel/keel", branch: "main", siteRouteFor: createSiteRoutes(["shape"]) };

  it("keeps root-relative links as site routes and marks external links noopener", () => {
    const { render } = createRenderer({ ...options, rootLinksAreRoutes: true });
    const { html } = render("[p](/library) [s](/skills/shape#use) [g](/guides/parallel-agent-sessions) [x](https://example.com) [o](//evil.example)", source);
    expect(html).toContain('href="/library"');
    expect(html).toContain('href="/skills/shape#use"');
    expect(html).toContain('href="/guides/parallel-agent-sessions"');
    expect(html).toContain('href="https://example.com" rel="noopener"');
    expect(html).not.toContain("evil.example");
  });

  it("keeps the text but drops the link for routes not published in this build", () => {
    const { render } = createRenderer({ ...options, rootLinksAreRoutes: true, hiddenRoutes: ["/essays"] });
    const { html } = render("[e](/essays) [a](/essays/the-art#x) [b](/essays#y) [g](/guides) [n](/essaysx)", source);
    expect(html).not.toMatch(/href="\/essays["/#]/u);
    expect(html).toContain("<p>e a b ");
    expect(html).toContain('href="/guides"');
    expect(html).toContain('href="/essaysx"');
  });

  it("leaves skill rendering unchanged: root-relative links still resolve against the source file", () => {
    const { rewriteHref } = createRenderer(options);
    expect(rewriteHref("/principles", "skills/shape/SKILL.md")).toBe("https://github.com/gaboesquivel/keel/tree/main/skills/shape/principles");
  });
});
