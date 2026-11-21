---
title: Decision Records
summary: Write down consequential decisions, with their context and consequences, where the next person or agent session will find them, and change them deliberately rather than silently.
topic: agents
byline: Michael Nygard · Documenting Architecture Decisions
origin: source
keywords: [adr, architecture decision record, documentation, context, product notes, institutional memory]
sources:
  - title: Documenting Architecture Decisions
    author: Michael Nygard
    publisher: Cognitect
    year: 2011
    kind: post
    url: https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117090209/https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
  - title: Architectural Decision Records
    author: ADR GitHub organization
    kind: documentation
    url: https://adr.github.io/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261108174130/https://adr.github.io/
    note: Community site collecting ADR templates and tooling; credits Nygard's post with popularizing the practice.
relations:
  related: [product-drift, humans-direct-agents-execute, intent-over-implementation, review-the-decision]
---

## The idea

Record each decision that matters, briefly, with the situation that prompted it and what it commits you to. Keep the records next to the work, so whoever comes next can understand why things are as they are. When a decision changes, write a new one rather than quietly editing history.

## What the source says

In [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (2011), Michael Nygard starts from a problem on agile projects: architecture is decided gradually, and the reasons behind decisions fade. Someone arriving later and finding an unexplained decision has two bad options. They can accept it without understanding, and the project accumulates choices nobody dares touch. Or they can reverse it without knowing what it protected, and quietly break something, such as an untested non-functional requirement.

His answer is the architecture decision record: a short text file per architecturally significant decision, kept in the repository and numbered in sequence. Each has a title, the context (the forces at play, stated neutrally), the decision itself in active voice, a status (proposed, accepted, later deprecated or superseded) and the consequences, including the negative and neutral ones. Records stay small, a page or two, because large documents go unread and out of date. A reversed decision is not deleted; it is marked as superseded, because it still matters that it was once the decision. Nygard reports that developers rotating through projects found the context valuable. The [adr.github.io](https://adr.github.io/) site now collects templates and tools built on his format.

## Keel's perspective

Agent sessions arrive the way Nygard's newcomer does: capable, fast and without memory of why anything was decided. Without a record, settled questions get reopened, sometimes inside an unrelated change, and an agent may reverse a decision simply because the reason was invisible. That is one of the main routes to [Product Drift](/library/product-drift).

keel extends the practice beyond architecture to product direction: who the product is for, what is in and out of scope, which outcome matters most. A short, current statement of direction (keel keeps a `PRODUCT.md`) does for those decisions what ADRs do for technical ones, and an agent can read it at the start of every session.

The important half is revisability. A record that cannot be changed hardens into a rulebook nobody believes. A request that conflicts with a recorded decision should prompt a conversation, not an automatic override and not an automatic refusal. If the direction has changed, update the record first, then build.

## When to use it

- A decision that would be expensive or confusing to reverse: a data model, a dependency, an audience, a pricing boundary.
- A question that keeps coming back across sessions or contributors.
- Any time an agent proposes undoing something and nobody remembers why it was done.

## Example

For example, a session suggests adding team accounts. The product notes say the audience is solo builders, and record why: pricing and onboarding assume one person. The right response is to ask whether the audience has changed. If it has, update the notes, including what the change will cost, and then shape the work.

## Limitations

Records cost time, and recording trivial choices buries the important ones. They only help if they are found and read; a folder nobody opens is decoration. Records also go stale, so a product-level document needs pruning as well as additions. keel's extension to product direction and agent sessions is its own reading; Nygard wrote about architecture on human teams.
