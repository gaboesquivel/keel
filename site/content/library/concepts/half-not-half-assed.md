---
title: Half a Product, Not a Half-Assed Product
summary: When you cannot do everything well, cut the scope rather than the quality. Ship a smaller product that is excellent at its core instead of a weak version of everything.
topic: simplicity
byline: 37signals · Getting Real
origin: source
keywords: [scope, quality, feature cutting, essential features, product focus, launch scope]
sources:
  - title: Half, Not Half-Assed
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/05.1-half-not-half-assed
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261022043923/https://basecamp.com/gettingreal/05.1-half-not-half-assed
    note: The chapter title in the online edition is "Half, Not Half-Assed".
  - title: Fix Time and Budget, Flex Scope
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/02.4-fix-time-and-budget-flex-scope
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261103035911/https://basecamp.com/gettingreal/02.4-fix-time-and-budget-flex-scope
relations:
  in-tension-with:
    - concept: minimum-viable-product
      note: An MVP may be deliberately rough because its job is learning; 37signals want a smaller but finished product, and the MVP wins when the question is whether anyone wants it at all, while this wins once the core need is clear.
  related: [start-with-no, build-less, find-the-epicenter, appetite]
---

## The idea

A product that tries to include every good idea ends up doing all of them poorly. The better trade is to keep quality fixed and cut the feature list, repeatedly, until only the essentials remain, then make those essentials genuinely good. Smaller and complete beats broad and shaky.

## What the source says

37signals warn in Getting Real against the kitchen-sink approach, where every reasonable idea goes in and the result is mediocre everywhere. Their advice is to decide what the product should be, cut it in half, pare it down to essentials, and then cut again. Good ideas are not discarded, only deferred. As evidence they describe launching Basecamp with just its messages section, which they considered the heart of the app, and leaving milestones and to-do lists for later, so that what came next could be decided from real usage rather than guesses.

The same contrast appears earlier in the book, in the chapter on fixing time and budget: when everything will not fit, pull back scope rather than extending the schedule or accepting something full of holes. The authors argue that launching something great but smaller beats launching something mediocre to hit an arbitrary combination of date, budget and scope.

## Keel's perspective

The idea is a statement about which variable to sacrifice. Under pressure, teams usually keep the feature list and let quality slip quietly, because missing features are visible and weak ones are not. This principle reverses that: make the cut visible and keep the quality.

It also gives a test for any release. Each thing in it should be something you would be glad for a user to rely on. If a feature is present but half-working, it costs trust and support time and teaches users that the product is unreliable, often more than its absence would have cost.

The phrase is easy to misread as a case against early releases. It is not. Basecamp's first version was small and early. The argument is against breadth at the expense of finish, not against shipping soon.

## When to use it

- A launch date is fixed and the list does not fit.
- A product is growing sideways and every area feels a little unfinished.
- Planning a first version and deciding what belongs in it.
- Reviewing agent-built work where many features exist but few have been hardened.

## Example

For example, a team building a recipe app plans search, meal planning, shopping lists, nutrition data and sharing for launch. Halving the list leaves recipe saving and search; halving again leaves saving recipes from any website cleanly. They ship only that, make the import reliable across many sites, and add the rest as usage shows which is wanted next.

## Limitations

What counts as essential is a judgment, and teams can cut the wrong half. Some markets expect a baseline set of features before a product is even considered, and a beautifully made half may not clear that bar. Eric Ries's minimum viable product makes a different trade: an early product may be crude on purpose when the goal is learning whether to build at all. The two fit together when the MVP stage tests demand and this principle governs what you ship to people expected to depend on it.
