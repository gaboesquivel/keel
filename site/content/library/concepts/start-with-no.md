---
title: Start With No
summary: Make every proposed feature earn its place. The default answer is "not now", and only requests that keep returning get serious consideration.
topic: simplicity
byline: 37signals · Getting Real
origin: source
keywords: [saying no, feature creep, scope creep, product focus, feature requests, prioritization]
sources:
  - title: Start With No
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/05.3-start-with-no
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261111004755/https://basecamp.com/gettingreal/05.3-start-with-no
    note: The online edition is credited to 37signals/Basecamp; the three named authors are the commonly listed authors of the 2006 book.
  - title: Hidden Costs
    author: Jason Fried, David Heinemeier Hansson, Matthew Linderman
    work: Getting Real
    publisher: 37signals
    year: 2006
    kind: book-chapter
    url: https://basecamp.com/gettingreal/05.4-hidden-costs
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260420133119/https://basecamp.com/gettingreal/05.4-hidden-costs
relations:
  related: [forget-feature-requests, build-less, half-not-half-assed, product-drift, code-is-a-liability]
---

## The idea

A feature is not a one-time cost. Once it ships, it has to be designed around, tested, supported and explained for as long as the product lives, and removing it later angers the people who came to rely on it. So the starting answer to any new feature, including the team's own ideas, is no. A feature gets real consideration only after it has proven it keeps coming back.

## What the source says

In Getting Real, 37signals present saying no as the mechanism behind their broader advice to build half a product rather than a half-done one. They compare accepting a feature to adopting a child: it has to be carried through design, implementation and testing, and afterwards you are responsible for it indefinitely. Their practice is to listen to every request, act on none immediately, and answer "not now". If the same request keeps arriving, that persistence is the signal to look at it seriously.

They apply the rule to internal ideas as much as to customer requests, and they suggest that when customers complain about a refusal, the honest response is that the product is liked precisely because it declines to do everything. The next chapter, Hidden Costs, extends the argument: features tend to spawn further features, and each one also touches help text, marketing pages, pricing and promises made to customers.

## Keel's perspective

The original argument rested partly on the cost of building. When an agent can implement a feature in an afternoon, that part of the cost shrinks, and "yes" becomes tempting. The rest of the cost does not shrink: every feature still widens the surface users must understand, the states the system can reach, the cases future changes must respect and the story the product tells about itself. Cheap building makes the no more important, not less, because the friction that used to filter weak ideas is gone.

A useful refinement is to separate the request from the problem behind it. "Not now" applies to the proposed solution. The underlying problem is worth writing down and understanding, because it may be better solved by something smaller or by nothing at all.

## When to use it

- A stream of feature requests is starting to set the roadmap.
- The team is adding things because they are easy, not because they matter.
- A product's core use is getting harder to see in the interface.
- Before committing to a feature whose maintenance and support cost nobody has named.

## Example

For example, a small invoicing tool receives a request for custom fields on invoices. The team replies that it is not planned, notes the problem the customer described, and moves on. Over two months, several more customers ask, and in each case the real need is a purchase-order number. The team adds a single optional PO field rather than a general custom-field system, which would have brought configuration screens, validation rules and export questions with it.

## Limitations

A reflexive no can become arrogance. Some requests point at a real gap in the product's purpose, and waiting for repetition is slow when the customer base is small or quiet. In enterprise or regulated markets, a missing capability can lose a deal outright, and a standing no may simply mean losing that market. The rule also assumes a clear product vision to say no in favor of; without one, it becomes arbitrary refusal rather than focus.
