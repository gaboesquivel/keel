import { afterEach, describe, expect, it } from "vitest";

import { askConfigured, isOwner, ownerToken, retrieve, secretMatches, validate } from "@/lib/ask";
import { concepts } from "@/lib/library";

const [a, b] = concepts as [(typeof concepts)[number], (typeof concepts)[number]];

describe("Ask access", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it("is absent unless both the Gateway key and a long owner secret are set", () => {
    process.env.AI_GATEWAY_API_KEY = "";
    process.env.KEEL_ASK_SECRET = "x".repeat(32);
    expect(askConfigured()).toBe(false);
    process.env.AI_GATEWAY_API_KEY = "key";
    process.env.KEEL_ASK_SECRET = "short";
    expect(askConfigured()).toBe(false);
  });

  it("accepts only the owner secret and a cookie derived from it, never the secret itself", () => {
    process.env.AI_GATEWAY_API_KEY = "key";
    process.env.KEEL_ASK_SECRET = "s".repeat(32);
    expect(secretMatches("s".repeat(32))).toBe(true);
    expect(secretMatches("s".repeat(31))).toBe(false);
    expect(isOwner(ownerToken())).toBe(true);
    expect(isOwner("s".repeat(32))).toBe(false);
    expect(isOwner(undefined)).toBe(false);
    process.env.KEEL_ASK_SECRET = "t".repeat(32);
    expect(isOwner(ownerToken())).toBe(true);
  });
});

describe("Ask grounding", () => {
  it("retrieves relevant entries for a natural-language problem", () => {
    expect(retrieve("Am I adding too many features? How do I say no to feature requests?").map((c) => c.slug)).toContain("start-with-no");
    const validation = retrieve("I'm building new features faster than I can validate them. How should I decide what to work on?").map((c) => c.slug);
    expect(validation).toEqual(expect.arrayContaining(["validated-learning", "riskiest-assumption-first"]));
  });

  it("drops citations to entries that weren't supplied or don't exist, and never shows unsupported evidence", () => {
    const answer = validate(
      {
        supported: true,
        headline: "H",
        paragraphs: [
          { kind: "grounded", text: "Cited.", cites: [a.slug, "made-up-entry", b.slug] },
          { kind: "grounded", text: "Only invalid citations.", cites: ["made-up-entry"] },
          { kind: "interpretation", text: "Reading.", cites: [] },
        ],
        ideas: [
          { slug: a.slug, why: "W" },
          { slug: a.slug, why: "dup" },
          { slug: "made-up-entry", why: "W" },
          { slug: b.slug, why: "not supplied" },
        ],
        gaps: null,
      },
      new Set([a.slug]),
    );
    expect(answer.paragraphs.map((p) => [p.kind, p.cites.map((c) => c.slug)])).toEqual([
      ["grounded", [a.slug]],
      ["interpretation", []],
      ["interpretation", []],
    ]);
    expect(answer.ideas.map((i) => i.slug)).toEqual([a.slug]);
    expect(answer.supported).toBe(true);
    expect(validate({ supported: true, headline: "H", paragraphs: [], ideas: [], gaps: "None." }, new Set()).gaps).toBeNull();
  });

  it("is unsupported when nothing valid is cited, whatever the model claims", () => {
    const answer = validate({ supported: true, headline: "H", paragraphs: [{ kind: "grounded", text: "x", cites: ["nope"] }], ideas: [], gaps: null }, new Set([a.slug]));
    expect(answer.supported).toBe(false);
  });
});
