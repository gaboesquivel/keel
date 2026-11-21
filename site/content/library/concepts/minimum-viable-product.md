---
title: Minimum Viable Product
summary: The smallest thing you can put in front of real customers that starts the learning loop, judged by what it teaches rather than by how complete it is.
topic: lean-startup
byline: Eric Ries · The Lean Startup
origin: source
keywords: [mvp, prototype, experiment, concierge, wizard of oz, smoke test, first version]
sources:
  - title: "Minimum Viable Product: a guide"
    author: Eric Ries
    work: Startup Lessons Learned
    year: 2009
    kind: post
    url: http://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261111015018/https://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html
  - title: The Lean Startup
    author: Eric Ries
    publisher: Crown Business
    year: 2011
    kind: book
    url: https://theleanstartup.com/book
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118141102/https://theleanstartup.com/book
  - title: Minimum Viable Product
    author: SyncDev
    publisher: SyncDev
    kind: article
    url: https://www.syncdev.com/minimum-viable-product/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261012052027/https://www.syncdev.com/minimum-viable-product
    note: Frank Robinson of SyncDev is widely credited (for example by Wikipedia and PMI) with coining the term around 2001, but this page does not state that, and no primary 2001 document was found. SyncDev's own definition is framed as maximizing return on risk for vendor and customer.
relations:
  builds-on: [build-measure-learn]
  in-tension-with:
    - concept: half-not-half-assed
      note: 37signals argue for shipping a smaller product done well rather than a rough version of everything; Ries's MVP tolerates roughness when it speeds learning. Polish wins once the core value is known, roughness wins while it is not.
  related: [validated-learning, riskiest-assumption-first, small-vertical-slices, build-less]
---

## The idea

An MVP is an experiment shaped like a product. It is the least you can build, or fake, that lets real customers show you whether a core belief about your business holds. Its quality is measured by what you learn per unit of effort, not by how many features it has.

## What the source says

Eric Ries popularized the term on his blog in 2009 and in *The Lean Startup* (2011). In his "guide" post he defines the MVP as the version of a new product that yields the most validated learning about customers for the least effort. He stresses that this is a judgment about learning, not a release plan, and that it often feels uncomfortably small to the people building it.

In the book Ries gives forms that are barely products at all: a video demonstrating a product that does not exist yet, a "concierge" service where the founders deliver the value by hand, and set-ups where a person quietly does work customers believe is automated. He also argues that the MVP is where the Build-Measure-Learn loop starts, so speed to the first real customer reaction matters more than polish.

Provenance: the phrase predates Ries. Frank Robinson of the product consultancy SyncDev is commonly credited with coining it around 2001. The 2001 attribution is widely repeated but thinly documented in primary sources, so treat it as likely rather than settled.

## Keel's perspective

The common misreading is that an MVP is a crappy version one: the full product with corners cut. That framing keeps the scope of the full vision and only lowers quality, which is the worst of both. The real move is to cut scope down to one question and keep whatever quality that question needs.

Agents make the misreading more tempting. When a complete app is a few days of prompting, it is easy to skip the question and build the whole thing "as the MVP." The cost has moved from building to everything after: maintenance, support, and the false confidence of a product that exists but has not taught you anything. Start from the [riskiest assumption](/library/riskiest-assumption-first) and ask what the smallest test of it is. Often the answer is not software.

## When to use it

- Before committing real time to a product whose demand is unproven.
- When a team argues about features and nobody can say which belief each one tests.
- When you can deliver the value manually to a handful of people before automating it.

## Example

For example, someone wants to build an AI tool that turns meeting recordings into client-ready summaries for consultants. An MVP could be a form where five consultants upload recordings and receive summaries the founder prepares with existing tools and edits by hand. If they come back weekly and ask to pay, the demand belief has evidence behind it. If not, nothing was built that has to be thrown away.

## Limitations

"Viable" is easy to forget. Customers judge what they are given, and a test that is too rough can fail for reasons unrelated to the idea, producing a false negative. In crowded markets, safety-critical domains, or with users who expect polish, the minimum bar is higher. 37signals' argument for building [half a product, not a half-assed product](/library/half-not-half-assed) is a useful counterweight. Finally, "MVP" is now used loosely for any first release, which hides whether a team is actually testing anything.
