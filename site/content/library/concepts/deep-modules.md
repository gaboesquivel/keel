---
title: Deep Modules
summary: The best modules hide a lot of functionality behind a small, simple interface; shallow ones cost nearly as much to learn as they save.
topic: software-design
byline: John Ousterhout · A Philosophy of Software Design
origin: source
keywords: [module depth, shallow modules, classitis, interface design, abstraction, complexity]
sources:
  - title: A Philosophy of Software Design
    author: John Ousterhout
    publisher: Yaknyam Press
    year: 2018
    kind: book
    url: https://web.stanford.edu/~ouster/cgi-bin/book.php
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117232900/https://web.stanford.edu/~ouster/cgi-bin/book.php
    note: Second edition 2021, which reworks the chapter "General-Purpose Modules are Deeper". The author's page lists edition changes; the claims here are the book's widely documented core and are restated in the talk below.
  - title: A Philosophy of Software Design (Talks at Google)
    author: John Ousterhout
    publisher: Talks at Google
    year: 2018
    kind: talk
    url: https://www.youtube.com/watch?v=bmSAYlu0NcY
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261110075847/https://www.youtube.com/watch?v=bmSAYlu0NcY
  - title: A Philosophy of Software Design vs Clean Code
    author: John Ousterhout, Robert C. Martin
    publisher: GitHub
    year: 2025
    kind: article
    url: https://github.com/johnousterhout/aposd-vs-clean-code
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260714114443/https://github.com/johnousterhout/aposd-vs-clean-code
    note: A written debate held between September 2024 and February 2025, covering method length, comments and test-driven development.
relations:
  builds-on: [information-hiding]
  in-tension-with:
    - concept: earn-your-abstractions
      note: Ousterhout pushes for somewhat general interfaces designed ahead of the second use, while Metz and Roberts advise waiting for real duplication; generality wins when the concept is understood, waiting wins when it is still a guess.
  related: [strategic-programming, simple-design, code-is-a-liability]
---

## The idea

A module earns its place by how much it hides relative to how much it asks callers to know. Picture it as a rectangle: the top edge is the interface, the area is the functionality. A deep module has a short top edge and a large area. A shallow module has an interface almost as complicated as what it does, so using it saves little.

## What the source says

John Ousterhout, in *A Philosophy of Software Design* (2018) and his 2018 Talks at Google lecture of the same name, frames software design as the fight against complexity, and treats the interface as the part of a module's complexity that everyone else pays for. Depth is the ratio between the two. His recurring example of a deep interface is Unix file I/O: a handful of calls stand in front of directories, permissions, caching, device drivers and disk layout. His example of a shallow design is the layering of the classic Java I/O classes, where opening a buffered file stream takes several objects that each add little.

He names the habit that produces shallow designs *classitis*: the belief that more, smaller classes are always better. Each small class may look tidy, but every one adds an interface, and the system as a whole gets harder to understand. He argues against decomposing methods purely for length, and has since debated this point at length with Robert C. Martin. He also argues that general-purpose modules tend to be deeper than special-purpose ones: an interface shaped around a somewhat general concept is usually simpler than one built around today's caller, even if it only implements what is needed now. Depth builds on information hiding; a module is deep largely because of what it keeps out of its interface.

## Keel's perspective

Depth is the most practical lens we know for reviewing structure, because it asks a question you can answer by looking: how much does a caller have to understand to use this correctly? Counting classes, files or lines of each says almost nothing about that.

It is also a useful check on agent-written code. Agents readily produce many thin wrappers, pass-through methods and one-use helpers, each defensible on its own. Judged by depth, most of them are cost: more surface, no more capability. Asking an agent to merge shallow pieces into fewer, deeper ones is often the highest-value review comment.

## When to use it

- Reviewing a design that adds several new classes or layers for one feature.
- Choosing what a library or service API should expose.
- Deciding whether to split a long function or a large module.
- Spotting pass-through methods that only forward to another layer.

## Example

For example, a payments integration might be wrapped as a client class, a request builder, a retry policy and a response mapper, each exposed to callers. Every caller then assembles all four. A deeper version offers one call, such as charging a customer an amount, and keeps retries, idempotency keys and error mapping inside. The same code exists; far less of it is anyone else's problem.

## Limitations

Depth is a heuristic, not a measurement, and a module can be "deep" by hiding things callers genuinely need to control. A large module with a small interface is not automatically good; its insides still have to be clear. The preference for general-purpose interfaces can slide into speculative generality if the general concept is not actually understood yet. Robert C. Martin's published exchange with Ousterhout shows that experienced practitioners still disagree about how small methods should be.
