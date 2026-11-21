// Instant search over the Library, shared by the browser (titles, summaries, keywords) and Ask's retrieval (full text).
// Pure and dependency-free so it runs anywhere and stays fast at this collection's size.

export type SearchDoc = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  byline: string;
  keywords: string[];
  /** Optional full text; Ask's retrieval includes it, the browser index leaves it out to stay small. */
  text?: string;
};

export const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/gu, "")
    .toLowerCase()
    .replace(/[–—-]/gu, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();

// Words that carry no meaning for matching; questions are full of them.
const STOP = new Set(
  "a an and are as at be but by can do does for from how i if in into is it its me my of on or should so than that the their them then there these they this to too was we what when where which who why will with without you your am have has had not no more most much many get i'm im ive i've dont don't".split(" "),
);

/** Very light stemming so "validating", "validated" and "validation" meet. */
export const stem = (w: string) => (w.length < 5 ? w : w.replace(/ations?$/u, "at").replace(/(?:ing|ed|es|e|s|ly)$/u, "").replace(/(.)\1$/u, "$1")) || w;

export const terms = (q: string) =>
  fold(q)
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);

type Field = { text: string; weight: number };

/**
 * Score documents against a query. Every query term must match somewhere for keyword search (`all`), or any term for
 * natural-language retrieval (`any`). Title and keyword matches outweigh summary, byline and body matches; a word that
 * starts with the term scores more than one that only contains it. Terms that appear in most documents (such as
 * "build" in a library about building) count for less than distinctive ones (inverse document frequency).
 */
export function search<T extends SearchDoc>(docs: T[], query: string, { mode = "all", limit = 50 }: { mode?: "all" | "any"; limit?: number } = {}) {
  const qs = terms(query);
  if (!qs.length) return [];
  const prepared = docs.map((doc) => {
    const fields: Field[] = [
      { text: doc.title, weight: 6 },
      { text: doc.keywords.join(" "), weight: 4 },
      { text: doc.summary, weight: 2 },
      { text: `${doc.byline} ${doc.topic}`, weight: 2 },
      ...(doc.text ? [{ text: doc.text, weight: 0.35 }] : []),
    ];
    return { doc, words: fields.map((f) => ({ weight: f.weight, words: fold(f.text).split(" ").map(stem) })) };
  });
  const has = (p: (typeof prepared)[number], q: string) => p.words.some((f) => f.words.some((w) => w.startsWith(q)));
  const idf = new Map(qs.map((q) => [q, Math.log(1 + docs.length / Math.max(1, prepared.filter((p) => has(p, q)).length))]));
  const results: { doc: T; score: number }[] = [];
  for (const { doc, words } of prepared) {
    let score = 0;
    let matched = 0;
    for (const q of qs) {
      let best = 0;
      for (const f of words) {
        let hits = 0;
        for (const w of f.words) if (w === q || w.startsWith(q)) hits += w === q ? 1 : 0.7;
        if (hits) best += f.weight * Math.min(3, hits) ** 0.6;
      }
      if (best) matched += 1;
      score += best * (idf.get(q) ?? 1);
    }
    if (!matched || (mode === "all" && matched < qs.length)) continue;
    if (fold(doc.title).includes(fold(query))) score += 10;
    results.push({ doc, score: score * (matched / qs.length) });
  }
  return results.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title)).slice(0, limit);
}
