---
title: Refactoring
summary: Improving the internal structure of code through small, behavior-preserving steps, often done first to make the next change easy.
topic: software-design
byline: Martin Fowler · Refactoring
origin: source
keywords: [behavior-preserving change, preparatory refactoring, restructuring, code smells, small steps, technical debt]
sources:
  - title: Refactoring
    author: Martin Fowler
    work: "Refactoring: Improving the Design of Existing Code"
    publisher: Addison-Wesley
    year: 1999
    kind: book
    url: https://refactoring.com/
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118091112/https://www.refactoring.com/
    note: Second edition 2018, with examples in JavaScript instead of Java. refactoring.com is the author's companion site for both editions and its catalog of refactorings.
  - title: Definition Of Refactoring
    author: Martin Fowler
    publisher: martinfowler.com
    year: 2004
    kind: post
    url: https://martinfowler.com/bliki/DefinitionOfRefactoring.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117145118/https://martinfowler.com/bliki/DefinitionOfRefactoring.html
  - title: An example of preparatory refactoring
    author: Martin Fowler
    publisher: martinfowler.com
    year: 2015
    kind: article
    url: https://martinfowler.com/articles/preparatory-refactoring-example.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261024155936/https://martinfowler.com/articles/preparatory-refactoring-example.html
    note: The Kent Beck line quoted in the body is taken as worded on this page, which links it to a 2012 tweet by Beck. The tweet itself was not read during this check.
relations:
  related: [simple-design, strategic-programming, code-is-a-liability, small-vertical-slices]
---

## The idea

Refactoring is changing how code is built without changing what it does. It proceeds in steps small enough that each one is obviously safe, and the system keeps working after every step. Its most useful form is often preparatory: reshape the code first so that the change you actually need becomes simple.

## What the source says

Martin Fowler's *Refactoring* (1999; second edition 2018) gave the practice its working definition and a catalog of named transformations such as extracting a function or moving a field. On his site he defines the noun as a change to a program's internal structure that makes it easier to understand and cheaper to modify, with observable behavior left unchanged. The verb is applying a sequence of such changes.

Fowler stresses that the constraint is the point. Each refactoring is a small transformation, so it is unlikely to break anything, and many of them chained together can produce a large restructuring while the code stays working throughout. Without tool support, he relies on small steps and frequent tests to catch mistakes early. He also distinguishes refactoring from general cleanup: rewriting code in a way that leaves it broken for days is restructuring, not refactoring.

In a 2015 article he works through an example of preparatory refactoring: before adding a feature, he first changes the structure of the existing code so that the feature fits naturally, then adds it. He frames this with a line he attributes to Kent Beck: "make the change easy, then make the easy change". Fowler argues this is often faster overall than forcing the feature into a structure that resists it.

## Keel's perspective

The discipline matters more than the word. "Refactoring" is now used for almost any code change, which hides the one property that makes it cheap: at no point is the system broken, so you can stop at any step and ship.

With coding agents, two separations pay off. First, keep structure changes and behavior changes in different commits or pull requests; a reviewer can check a pure refactor by asking only whether behavior held, and check the feature by reading a small diff. Second, ask for the preparatory step explicitly. An agent left alone tends to bolt a feature onto whatever shape exists, because that is the shortest path to green tests. Asking it to first propose the reshaping that would make the change trivial, then make the change, produces code that is easier to own afterwards.

## When to use it

- Before a feature, when the existing structure fights the change.
- After a feature works, to remove the duplication and awkward names it left.
- When you find yourself explaining code instead of reading it.
- When a review shows the same concept spread across several places.

## Example

For example, a team needs to add a second shipping carrier. Carrier logic is currently inlined in the checkout handler. A preparatory refactor extracts it behind a small carrier interface, with tests showing checkout behaves exactly as before. That change ships on its own. The new carrier then arrives as one additional implementation, and the diff is short enough to review in minutes.

## Limitations

Refactoring depends on a way to know behavior did not change. Without tests or an equivalent check, "small safe steps" is a hope, not a method. It also has no built-in stopping rule: polishing code nobody will change again is cost without return. And it is not a remedy for a wrong design at the level of the product or the data model; some changes really do require behavior to change, and calling them refactoring only blurs the review.
