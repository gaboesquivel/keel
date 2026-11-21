---
title: Intent Over Implementation
summary: Tell an agent what matters and why, including the constraints that are not negotiable, and let it work out how; specify implementation only where it is a real decision.
topic: agents
byline: keel
origin: keel
keywords: [commander's intent, briefing agents, prompting, specifications, delegation, outcomes]
sources:
  - title: Mission command requires sharp commander's intent
    author: Gustave Perna
    publisher: U.S. Army
    year: 2019
    kind: article
    url: https://www.army.mil/article/215297/mission_command_requires_sharp_commanders_intent
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20260517060942/https://www.army.mil/article/215297/mission_command_requires_sharp_commanders_intent
    note: A practitioner article (originally in Army Sustainment, 2019) that cites ADP 6-0 Mission Command. Used as a verifiable public account of commander's intent; the doctrine PDF itself could not be retrieved from armypubs.army.mil during this check.
relations:
  related: [humans-direct-agents-execute, outcomes-over-output, ubiquitous-language, review-the-decision]
---

## The idea

When you hand work to an agent, lead with the outcome, who it is for and the constraints that cannot move. Leave the method open unless the method is itself a decision you have made. Intent ages slowly and survives contact with the code; detailed instructions often encode guesses made without the context the agent will find there.

## Where it comes from

The framing is keel's, but it has a long antecedent in military command. U.S. Army mission command doctrine (ADP 6-0) describes using mission orders to enable disciplined initiative within the commander's intent. In a [2019 article](https://www.army.mil/article/215297/mission_command_requires_sharp_commanders_intent), General Gustave Perna describes intent as the task, purpose, critical factors and envisioned end state behind an action, and argues that leaders should start from the end state and let subordinates work out the ways and means within stated guidance, rather than micromanaging. The Army's concern is people acting under uncertainty when plans break down. keel borrows the shape of the idea, not its context, and applies it to briefing software agents.

## Keel's perspective

An agent reads the codebase more thoroughly than most people writing its instructions. A brief that dictates file names, libraries and step order wastes that, and it breaks the moment the code differs from what the author imagined. A brief that states the purpose lets the agent adapt when it finds something unexpected, and lets it notice when the obvious approach would violate what you care about.

Intent also makes review possible. If the brief said "users must be able to recover a draft after a crash", you can judge any implementation against that. If it said "write the draft to localStorage every five seconds", you can only check that it did so, not whether it should have.

Not everything should be left open. Some implementation choices are real decisions: a security boundary, a data model other systems depend on, a dependency you have deliberately ruled out, a convention the team relies on. State those as constraints, with the reason. The skill is telling those apart from preferences.

## When to use it

- Writing a task for an agent, an issue or a product note that agents will read.
- When you catch yourself specifying steps rather than results.
- When a previous brief produced exactly what was asked and still missed the point.
- Handing off work that will outlive a framework or library choice.

## Example

For example, instead of "add a debounce of 300ms to the search input and cache results in a Map", a brief could say: search should feel instant for the small catalogs our users have, results must never show another account's data, and we do not want a new dependency for this. The agent might debounce, filter client-side, or find that the server query is the real problem. Each option can be judged against the stated intent.

## Limitations

Intent is not vagueness. "Make search better" is not intent; it omits who, what outcome and which constraints. Some work genuinely needs a precise specification: a protocol, a migration, a regulatory requirement, an interface other teams depend on. There the implementation is the intent. Open-ended briefs also give an agent more room to over-build, so they work best paired with explicit limits on scope.
