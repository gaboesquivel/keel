import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { search, terms } from "@/lib/library-search";
import * as lib from "@/scripts/library-lib.mjs";

// The library contract is plain JavaScript; the tests read its results loosely.
// biome-ignore lint: test-only loose typing
type Loose = any;
const { connectionsFor, libraryLinks, splitSections, validateLibrary } = lib;
const parseConcept = lib.parseConcept as (input: { slug: string; source: string; text: string }) => { concept: Loose; problems: string[] };
const parseIndex = lib.parseIndex as (input: { source: string; text: string }) => { index: Loose; problems: string[] };

const source = "site/content/library/concepts/start-with-no.md";
const FRONT = `title: Start With No
summary: Make no the default answer to new features.
topic: simplicity
byline: 37signals · Getting Real
origin: source
keywords: [scope, saying no]
sources:
  - title: Start With No
    author: 37signals
    kind: book-chapter
    url: https://basecamp.com/gettingreal/05.3-start-with-no
    checked: 2026-11-20
    status: live
relations:
  related: [build-less]
  in-tension-with:
    - concept: minimum-viable-product
      note: Ship rough to learn, or ship less but well.`;
const BODY = "## The idea\n\nSay no.\n\n## What the source says\n\nThey say no.\n\n## Keel's perspective\n\nWe agree.\n\n## Example\n\nFor example.\n";
const doc = (front = FRONT, body = BODY) => `---\n${front}\n---\n\n${body}`;
const parse = (text: string, slug = "start-with-no") => parseConcept({ slug, source, text });

describe("parseConcept", () => {
  it("publishes fields, sources, labelled relations and sections in order", () => {
    const { concept, problems } = parse(doc());
    expect(problems).toEqual([]);
    expect(concept.title).toBe("Start With No");
    expect(concept.sources[0]).toMatchObject({ author: "37signals", status: "live", archive: null });
    expect(concept.relations["in-tension-with"]).toEqual([{ slug: "minimum-viable-product", note: "Ship rough to learn, or ship less but well." }]);
    expect(concept.sections.map((s: { id: string }) => s.id)).toEqual(["idea", "source", "perspective", "example"]);
  });

  it("requires the source/perspective split and rejects unknown or misordered sections", () => {
    expect(parse(doc(FRONT, "## The idea\n\nX.\n\n## Keel's perspective\n\nY.\n")).problems.join()).toContain('missing section "## What the source says"');
    expect(parse(doc(FRONT, `${BODY}\n## Summary\n\nZ.\n`)).problems.join()).toContain('unexpected section "## Summary"');
    expect(parse(doc(FRONT, "## Keel's perspective\n\nY.\n\n## The idea\n\nX.\n\n## What the source says\n\nZ.\n")).problems.join()).toContain("out of order");
  });

  it("uses 'Where it comes from' for keel's own ideas and allows no sources", () => {
    const front = FRONT.replace("origin: source", "origin: keel").replace(/sources:[\s\S]*?relations:/u, "sources: []\nrelations:");
    const { problems } = parse(doc(front, "## The idea\n\nX.\n\n## Where it comes from\n\nExperience.\n\n## Keel's perspective\n\nY.\n"));
    expect(problems).toEqual([]);
  });

  it("refuses guessed archive URLs, archived-only sources without a snapshot, and missing attribution", () => {
    const bad = FRONT.replace("status: live", "status: archived-only\n    archive: https://example.com/copy");
    const p = parse(doc(bad)).problems.join("\n");
    expect(p).toContain("archive must be a web.archive.org snapshot URL");
    expect(parse(doc(FRONT.replace("    author: 37signals\n", ""))).problems.join()).toContain("needs an author or a publisher");
    expect(parse(doc(FRONT.replace(/sources:[\s\S]*?relations:/u, "sources: []\nrelations:"))).problems.join()).toContain("needs at least one source");
  });

  it("rejects a relation listed twice, self-relations, reserved slugs and invalid YAML", () => {
    expect(parse(doc(FRONT.replace("related: [build-less]", "related: [build-less, minimum-viable-product]"))).problems.join()).toContain("more than one relation");
    expect(parse(doc(FRONT.replace("related: [build-less]", "related: [start-with-no]"))).problems.join()).toContain("relates to itself");
    expect(parse(doc(), "ask").problems.join()).toContain("reserved");
    expect(parse(doc("title: a: b: c")).problems.join()).toContain("not valid YAML");
  });
});

describe("library index and cross-references", () => {
  const concept = (slug: string, topic: string, relations: Record<string, unknown> = {}) =>
    parseConcept({ slug, source: `${slug}.md`, text: doc(FRONT.replace("topic: simplicity", `topic: ${topic}`).replace(/relations:[\s\S]*$/u, `relations: ${JSON.stringify(relations)}`)) }).concept;
  const index = parseIndex({
    source: "library.yaml",
    text: "topics:\n  - {slug: simplicity, title: Simplicity, description: D.}\nquestions:\n  - slug: q\n    title: Q?\n    framing: F.\n    concepts:\n      - {concept: a, why: W.}\n      - {concept: b, why: W.}\n",
  });

  it("parses topics and questions", () => {
    expect(index.problems).toEqual([]);
    expect(index.index.questions[0].concepts.map((c: { slug: string }) => c.slug)).toEqual(["a", "b"]);
  });

  it("fails on unknown topics, relations, question concepts and in-text links", () => {
    const a = concept("a", "simplicity", { "builds-on": ["missing"] });
    const b = concept("c", "nowhere");
    const problems = validateLibrary({ concepts: [a, b], index: index.index, indexSource: "library.yaml" }).join("\n");
    expect(problems).toContain('builds-on "missing" is not a concept');
    expect(problems).toContain('topic "nowhere" is not defined');
    expect(problems).toContain('lists "b", which is not a concept');
    expect(libraryLinks("See [x](/library/deep-modules) and [y](/library/ask#top).")).toEqual(["deep-modules", "ask"]);
  });

  it("shows relations from both sides: builds-on becomes built-on-by, tension is mutual", () => {
    const a = concept("a", "simplicity", { "builds-on": ["b"] });
    const b = concept("b", "simplicity", { "in-tension-with": [{ concept: "c", note: "N." }] });
    const c = concept("c", "simplicity", { related: ["a"] });
    expect(connectionsFor("b", [a, b, c]).builtOnBy.map((x: { slug: string }) => x.slug)).toEqual(["a"]);
    expect(connectionsFor("c", [a, b, c]).tension).toEqual([{ slug: "b", note: "N." }]);
    expect(connectionsFor("a", [a, b, c]).related.map((x: { slug: string }) => x.slug)).toEqual(["c"]);
  });

  it("splits sections without treating headings inside code as sections", () => {
    expect(splitSections("## A\n\n```\n## not\n```\n\n## B\n\nx").sections.map((s: { title: string }) => s.title)).toEqual(["A", "B"]);
  });
});

describe("the published collection", () => {
  const dir = path.resolve(import.meta.dirname, "../content/library/concepts");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const parsed = files.map((f) => parseConcept({ slug: f.replace(/\.md$/u, ""), source: f, text: readFileSync(path.join(dir, f), "utf8") }));
  const index = parseIndex({ source: "library.yaml", text: readFileSync(path.resolve(dir, "../library.yaml"), "utf8") });

  it("meets the contract and every cross-reference resolves", () => {
    expect(parsed.flatMap((p) => p.problems)).toEqual([]);
    expect(index.problems).toEqual([]);
    expect(validateLibrary({ concepts: parsed.map((p) => p.concept), index: index.index, indexSource: "library.yaml" })).toEqual([]);
  });

  it("states every tension with a reason and quotes sources sparingly and briefly", () => {
    for (const { concept } of parsed) {
      for (const t of concept.relations["in-tension-with"]) expect(t.note.length).toBeGreaterThan(20);
      // Quotations attributed to a source live in its section: at most one sentence-length quote, under 15 words.
      const sourceText = concept.sections
        .filter((s: { id: string }) => s.id === "source" || s.id === "origin")
        .map((s: { markdown: string }) => s.markdown)
        .join(" ");
      const quotes = (sourceText.match(/“[^”]+”|"[^"]+"/gu) ?? []).filter((q: string) => q.split(/\s+/u).length >= 6);
      expect(quotes.length, `${concept.slug} quotes`).toBeLessThanOrEqual(1);
      for (const q of quotes) expect(q.split(/\s+/u).length, `${concept.slug}: ${q}`).toBeLessThan(15);
    }
  });
});

describe("search", () => {
  const docs = [
    { slug: "start-with-no", title: "Start With No", summary: "Make no the default answer to feature requests.", topic: "Simplicity", byline: "37signals", keywords: ["scope", "saying no"] },
    { slug: "deep-modules", title: "Deep Modules", summary: "Hide a lot behind a small interface.", topic: "Software Design", byline: "John Ousterhout", keywords: ["abstraction", "interfaces"] },
    { slug: "validated-learning", title: "Validated Learning", summary: "Progress is what you learned to be true.", topic: "Lean Startup", byline: "Eric Ries", keywords: ["validation", "experiments"] },
  ];

  it("matches titles, keywords, authors and word stems, best first", () => {
    expect(search(docs, "deep")[0]?.doc.slug).toBe("deep-modules");
    expect(search(docs, "ousterhout")[0]?.doc.slug).toBe("deep-modules");
    expect(search(docs, "validating")[0]?.doc.slug).toBe("validated-learning");
    expect(search(docs, "abstractions")[0]?.doc.slug).toBe("deep-modules");
  });

  it("requires every term for keyword search but any term for questions", () => {
    expect(search(docs, "deep validation")).toEqual([]);
    expect(search(docs, "How should I handle feature requests and validation?", { mode: "any" }).map((r) => r.doc.slug).sort()).toEqual(["start-with-no", "validated-learning"]);
    expect(terms("What should I do?")).toEqual([]);
  });
});

describe("stemming", () => {
  it("brings verb and noun forms together", async () => {
    const { stem } = await import("@/lib/library-search");
    expect(new Set(["validate", "validated", "validation", "validates"].map(stem)).size).toBe(1);
    expect(stem("features")).toBe(stem("feature"));
    expect(stem("api")).toBe("api");
  });
});
