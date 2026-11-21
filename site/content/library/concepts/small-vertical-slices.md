---
title: Small Vertical Slices
summary: Deliver work as thin end-to-end slices that cut through every layer and do something usable, rather than finishing one layer at a time.
topic: software-design
byline: Bill Wake · Alistair Cockburn
origin: source
keywords: [vertical slicing, walking skeleton, invest, elephant carpaccio, story splitting, incremental delivery, tracer bullets]
sources:
  - title: INVEST in Good Stories, and SMART Tasks
    author: Bill Wake
    publisher: xp123.com
    year: 2003
    kind: article
    url: https://xp123.com/invest-in-good-stories-and-smart-tasks/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261110135304/https://xp123.com/invest-in-good-stories-and-smart-tasks/
  - title: Walking skeleton
    author: Alistair Cockburn
    publisher: alistair.cockburn.us
    year: 2004
    kind: article
    url: http://alistair.cockburn.us/Walking+skeleton
    checked: 2026-11-20
    status: archived-only
    archive: https://web.archive.org/web/20140329201356/http://alistair.cockburn.us/Walking+skeleton
    note: The original page is gone (404). The archived page reproduces the description from Cockburn's Crystal Clear (2004); he says he found the pattern around 1994 and named it by 1997. Later snapshots of the URL show unrelated content, so this earlier one is used.
  - title: Elephant Carpaccio exercise
    author: Alistair Cockburn
    publisher: alistair.cockburn.us
    year: 2010
    kind: article
    url: http://alistair.cockburn.us/Elephant+Carpaccio+exercise
    checked: 2026-11-20
    status: archived-only
    archive: https://web.archive.org/web/20140329203352/http://alistair.cockburn.us/Elephant+Carpaccio+exercise
    note: The original page is gone (404). Henrik Kniberg's facilitation guide for the exercise is live at blog.crisp.se (2013).
relations:
  related: [build-measure-learn, find-the-epicenter, review-the-decision, minimum-viable-product, refactoring]
---

## The idea

Split work so that each piece runs end to end: interface, logic and storage together, however thin. A slice should do something a person can see and judge. Building a whole database layer, then a whole API, then a whole interface delays the first moment anyone learns whether the thing is right.

## What the source says

Bill Wake's INVEST checklist (2003) says a good story is Independent, Negotiable, Valuable, Estimable, Small and Testable. Under "Valuable" he uses a layered cake: network, persistence, logic and presentation. He argues stories should be cut vertically through all the layers, so each slice gives the customer a working piece of the whole, and warns that a finished layer on its own, such as a complete database layer, is worth little to the customer.

Alistair Cockburn's walking skeleton applies the same shape to the start of a project. It is a tiny implementation that performs one small end-to-end function and connects the main architectural parts, even if crudely. Once those parts are linked, they stay linked, and architecture and functionality can then grow in parallel. He contrasts it with a spike, which is thrown away. In his Elephant Carpaccio exercise (2010), teams cut a small application into many slices of a few minutes' programming each, every one demonstrable, then build them in very short timed iterations. His stated aim is to show that work which people believe cannot be split below a day can be split far finer.

## Keel's perspective

Slices are a learning device first and a delivery device second. Each one closes a loop: build, see it work, judge it, decide the next slice. The thinner the slice, the faster that loop.

Coding agents change the economics in a way that makes this more important. A large change now costs about as little to generate as a small one, so the old natural brake on batch size is gone. Review and understanding did not get cheaper. A thousand-line diff touching every layer is hard to read, hard to verify and hard to learn from, and when it is wrong you cannot tell which decision was wrong. Asking an agent for one thin slice at a time keeps each diff reviewable and keeps you deciding direction. Give every slice a way to check itself, such as a test, a script or a page to load, so the agent can confirm its own work before you look.

## When to use it

- Starting a new product or feature, to get one path working end to end first.
- Planning agent tasks, so each task ends in something runnable and reviewable.
- When a plan lists work by layer ("backend first, then UI").
- When a feature is too uncertain to estimate.

## Example

For example, a team adding saved searches could build the full data model, then the API, then the interface. Sliced vertically, the first slice saves one hard-coded search for the current user and lists it on a page. The next adds naming. The next adds deletion. After the first slice, someone can already use it and say whether "saved searches" is even the right idea.

## Limitations

Some work does not slice cleanly: a schema migration, a security model or a platform change may need a horizontal investment before any slice can stand. Very thin slices can also accumulate shortcuts if no one reshapes the code between them. And "end to end" is not the same as "valuable"; a slice nobody would use is just a smaller batch. Cockburn himself notes the skeleton is a start, not a design, and needs incremental rearchitecture as it grows.
