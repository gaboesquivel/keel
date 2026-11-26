---
title: Build-Measure-Learn
summary: A startup's core loop is turning an idea into something testable, measuring how people respond, and learning whether to change course. Speed through the whole loop is what counts.
topic: lean-startup
byline: Eric Ries · The Lean Startup
origin: source
keywords: [feedback loop, iteration, experiment, learning cycle, lean startup, cycle time]
sources:
  - title: The Lean Startup
    author: Eric Ries
    publisher: Crown Business
    year: 2011
    kind: book
    url: https://theleanstartup.com/book
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118141102/https://theleanstartup.com/book
  - title: The Lean Startup Principles
    author: Eric Ries
    publisher: theleanstartup.com
    kind: documentation
    url: https://theleanstartup.com/principles
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261019180544/https://theleanstartup.com/principles
relations:
  builds-on: [validated-learning]
  in-tension-with:
    - concept: appetite
      note: Ries optimizes for the fastest possible loop, while Shape Up fixes a time budget up front and avoids open-ended iteration; loops win under deep uncertainty, appetites win once the problem is understood well enough to commit.
  related: [minimum-viable-product, pivot-or-persevere, innovation-accounting, shaping]
---

## The idea

Product work under uncertainty is a loop: build something, measure what people do with it, learn from the result, and go around again. The goal is not to make any one step efficient. It is to make the whole circuit short, because each trip is one chance to find out you were wrong.

## What the source says

Eric Ries presents Build-Measure-Learn as the central feedback loop of a startup in *The Lean Startup* (2011). Ideas become products, customer behavior becomes data, and data becomes a decision about whether to pivot or persevere. He argues that the measure of a team is not how fast it builds or how much it ships, but how quickly it gets through the entire loop, and he warns against optimizing one stage in isolation (engineering throughput, say) at the expense of the others.

Ries also says the loop is executed in one order and planned in the reverse. You first decide what you need to learn, then work out what you would have to measure to learn it, and only then decide what to build to produce that measurement. Building is the last thing you plan, not the first.

## Keel's perspective

The reverse-planning point is the part most teams skip, and it matters more now. When an agent can produce a working feature in an afternoon, "build" stops being the slow step, and the temptation is to treat every idea as something to implement. The loop does not get shorter by building faster if nobody decided in advance what the build was supposed to teach. Write the question and the measurement before the prompt.

Cheap building also changes what counts as the bottleneck. Measuring and learning still take real time: users need to show up, behavior needs to accumulate, someone has to interpret the result honestly. Speeding up one side of the loop without the other just produces a backlog of unexamined experiments.

## When to use it

- Early product work, when you cannot yet say who the customer is or why they would care.
- A new feature whose value is a guess rather than a known request.
- Any time a team is shipping steadily but cannot say what it has learned in the last month.

## Example

For example, a solo builder wonders whether freelancers would pay for automatic invoice reminders. Planning in reverse: the thing to learn is whether reminders matter enough to pay for; the measurement is how many trial users connect a real invoicing account and keep reminders on after two weeks; the build is the smallest version that sends real reminders for one invoicing tool. Each design choice that does not serve that measurement waits for a later loop.

## Limitations

The loop assumes you can get meaningful feedback quickly. In regulated domains, hardware, or enterprise sales with long cycles, a single loop can take months, and the advice to "go faster" has limits. It also says little about what to build once the answers are clear. At that point, deliberate design and a fixed budget, as in [shaping](/library/shaping), can serve better than continued iteration. A common misreading treats any shipping cadence as Build-Measure-Learn; without a stated hypothesis and a measurement, it is just shipping.
