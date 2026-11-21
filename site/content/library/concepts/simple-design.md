---
title: Simple Design and YAGNI
summary: Build only what today's tests require, in code that states its intent with no duplication and few parts, and defer speculative features until they are needed.
topic: software-design
byline: Kent Beck · Martin Fowler · Extreme Programming
origin: source
keywords: [four rules of simple design, you aren't gonna need it, extreme programming, xp, evolutionary design, presumptive features, speculative generality]
sources:
  - title: BeckDesignRules
    author: Martin Fowler
    publisher: martinfowler.com
    year: 2015
    kind: post
    url: https://martinfowler.com/bliki/BeckDesignRules.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261103211402/https://martinfowler.com/bliki/BeckDesignRules.html
    note: Fowler's summary of the rules Kent Beck formulated for Extreme Programming in the late 1990s; he points to the first edition of Extreme Programming Explained as the most authoritative statement.
  - title: Yagni
    author: Martin Fowler
    publisher: martinfowler.com
    year: 2015
    kind: post
    url: https://martinfowler.com/bliki/Yagni.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261109223654/https://www.martinfowler.com/bliki/Yagni.html
relations:
  in-tension-with:
    - concept: strategic-programming
      note: XP defers design to the moment a need is real and relies on refactoring, while Ousterhout argues for investing ahead of the immediate task; deferral wins under uncertain requirements, up-front thought wins when the concept is well understood.
  related: [refactoring, earn-your-abstractions, build-less, code-is-a-liability]
---

## The idea

Design for the requirements you have, not the ones you imagine. Code is simple when it passes its tests, makes its intent clear, says each thing once, and has no parts beyond those. Features and flexibility added for a predicted future usually cost more than they return, so wait until the need is real and let refactoring keep the code ready to change.

## What the source says

Kent Beck formulated the rules of simple design while creating Extreme Programming in the late 1990s. Martin Fowler's 2015 bliki entry, BeckDesignRules, gives them in priority order: the code passes the tests, reveals intention, has no duplication, and has the fewest elements. Passing the tests comes first. Fowler sees no fixed order between revealing intention and removing duplication, since working on one tends to improve the other. Fewest elements comes last: once the first three hold, remove anything that does not need to be there.

YAGNI, "you aren't gonna need it," is the matching rule for scope. Fowler traces it to the C3 project, where Kent Beck answered a list of soon-to-be-needed capabilities from Chet Hendrickson with that phrase each time. In his 2015 entry Fowler breaks down what a presumptive feature costs: the cost of building it, the cost of delaying something that was needed, the cost of carrying extra complexity in every later change, and the cost of repairing it when the guess turns out wrong. He is explicit about what YAGNI does not forbid. Refactoring, self-testing code and continuous delivery are what make it safe to defer, and future-proofing that adds no complexity is outside its scope.

## Keel's perspective

The rules are short enough to apply in review, which is their real value. Most over-built code fails the last one: abstractions, options and layers that pass the tests and reveal nothing, kept because they might be useful. YAGNI gives a team permission to delete them.

The part most often dropped is the condition attached. Deferring design is only sensible when the code stays easy to change, which means tests and the habit of refactoring. Without those, YAGNI turns into tactical programming with a principled name. With agents generating code quickly, that condition matters more: cheap generation makes presumptive features tempting, and a good test suite is what lets you leave them out now and add them safely later.

## When to use it

- Scoping a feature and noticing options, settings or extension points nobody has asked for.
- Reviewing code that adds an interface with one implementation or a parameter with one value.
- Finishing a change: with the tests green, check intent, duplication and surplus parts.
- Pushing back on "while we're in here" additions.

## Example

For example, a team building invoice export is asked for PDF. A developer proposes a plugin system so CSV and XML can be added later. Under YAGNI the team ships PDF only, with tests, and clearly named code. If CSV arrives, they refactor the PDF path into a shared shape with two real cases to guide it, rather than one real case and two guesses.

## Limitations

YAGNI is about features and speculative flexibility; it is often misread as "never think ahead." Some decisions, such as public APIs, data formats and security boundaries, are expensive to change and deserve thought before they are needed. John Ousterhout has argued that the XP and TDD approach, applied in very small increments, tends toward tactical code; see [Strategic Programming](/library/strategic-programming). "Fewest elements" can also be over-applied, compressing code until intent is lost, which is why it ranks last.
