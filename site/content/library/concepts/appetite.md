---
title: Appetite
summary: Decide how much time a problem is worth before designing the solution, then fix that time and let the scope flex so the work fits it.
topic: simplicity
byline: Ryan Singer · Shape Up
origin: source
keywords: [time budget, fixed time variable scope, estimates, timebox, scope hammering, six-week cycles]
sources:
  - title: Set Boundaries
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/1.2-chapter-03
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261117024000/https://basecamp.com/shapeup/1.2-chapter-03
  - title: Decide When to Stop
    author: Ryan Singer
    work: Shape Up
    publisher: Basecamp
    year: 2019
    kind: book-chapter
    url: https://basecamp.com/shapeup/3.5-chapter-14
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261029163545/https://basecamp.com/shapeup/3.5-chapter-14
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
  related: [shaping, half-not-half-assed, outcomes-over-output, build-less, small-vertical-slices]
---

## The idea

An estimate asks how long a given design will take. An appetite asks how much time this problem deserves, and then looks for a design that fits. The time is fixed; the scope is what moves. That turns time from a forecast that is usually wrong into a constraint that forces useful decisions.

## What the source says

In Shape Up, Ryan Singer describes the appetite as the first step of shaping: before discussing solutions, decide how much time and attention an idea is worth. At Basecamp, appetites come in two sizes, a small batch of a week or two for one designer and one or two programmers, or a big batch of a full six-week cycle. If an idea will not fit six weeks, they narrow the problem or carve off a meaningful part that does.

Singer draws the contrast with estimates directly: estimates start from a design and produce a number, appetites start from a number and produce a design. He calls the principle fixed time, variable scope, and argues that a deadline is what makes trade-offs happen; without it there is always more to add. Because the best solution depends on the constraint, a good solution is relative to how much time something is worth.

The principle holds through the build. In the chapter on deciding when to stop, Singer describes scope hammering: repeatedly asking whether each piece is a must-have, what happens without it, and how often a case really occurs, so the work fits the time box. He insists that cutting scope is not lowering quality, and suggests comparing against what customers have today rather than against an ideal.

The idea is older at the same company. Getting Real (2006) advised fixing time and budget and flexing scope, arguing that a smaller, excellent launch beats a mediocre one assembled to hit date, budget and scope at once.

## Keel's perspective

Appetite is a statement of value, made before the work. It forces the conversation that estimates avoid: is this worth six weeks, or only two days? That question ties effort to the outcome it is meant to produce rather than to the size of a feature list.

When agents do much of the building, estimates of implementation time matter less, but appetite does not go away. Review, integration, user attention and product complexity are still limited. An appetite is a budget for all of that, and it is still the clearest way to say how big a change should be.

## When to use it

- A raw idea arrives and the team needs to decide how seriously to take it.
- Estimates keep slipping and projects run long without a decision to stop.
- Briefing someone, or an agent, on how ambitious a solution should be.
- Midway through a project, when new ideas keep adding to the scope.

## Example

For example, customers ask for a reporting export. The team decides the problem is worth about a week, not a quarter. That rules out a configurable report builder and points to a single CSV export of the main table. Halfway through, someone wants date filters; the team asks whether customers can work without them, decides they can filter in a spreadsheet, and ships on time.

## Limitations

Some work has a fixed scope by nature, such as a compliance requirement or a data migration, and cutting it is not an option. Appetites can also be set unrealistically low, producing thin solutions that need repeated follow-ups. The approach depends on a team with authority to cut scope; if every item is non-negotiable, the fixed time box simply becomes a missed deadline.
