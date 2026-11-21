---
title: Product Drift
summary: A product moving away from its purpose one reasonable change at a time; with agents, the cost that used to slow that accumulation is mostly gone.
topic: agents
byline: keel
origin: keel
keywords: [scope creep, feature creep, accretion, focus, product direction, bloat]
sources: []
relations:
  related: [build-less, start-with-no, decision-records, outcomes-over-output, review-the-decision]
---

## The idea

Products rarely lose their way in one bad decision. They drift: each change is sensible on its own terms, each serves some user or some goal, and together they move the product somewhere nobody chose. Drift is the sum of reasonable steps taken without reference to a direction.

## Where it comes from

This is keel's name for a problem it was built around, observed while directing coding agents on real products. It is close kin to scope creep and feature creep, long familiar in project and product work, and to the warnings in [Start With No](/library/start-with-no) and [Build Less](/library/build-less) about the ongoing cost of every addition. What keel adds is attention to the mechanism: drift does not need a bad decision, only the absence of a deliberate one.

## Keel's perspective

When implementation was expensive, its cost acted as a brake. You could not build everything, so you had to choose, and the choosing kept the product pointed somewhere. Agents remove most of that brake. A settings page, an export, a second sign-in provider or a caching layer can each arrive within a session, with tests. Nothing in the work itself pushes back.

Agents also drift in a particular way. They tend to be thorough: asked for a feature, they add configuration, edge-case handling and extension points nobody requested, each defensible in isolation. They start each session fresh, so a question settled last week can be reopened in the middle of an unrelated change. And they optimize for the request in front of them, not for a purpose they were never told.

The counterweight is not refusing change. A product that never changes direction is also failing. The difference is between deliberate evolution, where someone decides the direction has moved and says so, and drift, where the direction moves without anyone deciding. That requires a direction written down somewhere the next session will see it (see [Decision Records](/library/decision-records)), an outcome to judge work against (see [Outcomes Over Output](/library/outcomes-over-output)), and the habit of asking, before accepting a change, what it commits the product to. keel's [align skill](/skills/align) looks for exactly this gap between accepted intent and what was built.

## When to use it

- Reviewing a run of agent-built changes, not just the latest one.
- When the product has become hard to describe in one sentence.
- When a request is easy to build but serves a user the product was not designed for.
- At a retrospective, comparing what shipped against what the product said it was for.

## Example

For example, a tool for solo writers gains, over a few months: shared folders because one user asked, comments because shared folders made them natural, roles and permissions because comments needed them, and an admin page because roles did. Every step was small and well built. The product is now a weak team-collaboration tool, and its onboarding, pricing and support reflect two audiences. Nobody decided to target teams. A short written direction ("for solo writers") would have turned the first request into a conversation about audience instead of a ticket.

## Limitations

Drift is easy to see in hindsight and hard to see in the moment, so the label can be misused to block any change someone dislikes. Some of the best product changes look like drift at first: a side feature users adopt becomes the product. The test is not whether the change departs from the plan, but whether someone noticed and chose it. Written direction only helps if it is kept current; a stale document produces false alarms and is soon ignored.
