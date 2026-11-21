---
title: Humans Direct, Agents Execute
summary: People set direction, make the consequential calls and stay accountable for the result; agents do much of the tactical work of building, testing and verifying.
topic: agents
byline: keel
origin: keel
keywords: [human in the loop, delegation, accountability, ai coding agents, oversight, ownership]
sources:
  - title: Building Effective Agents
    author: Erik Schluntz, Barry Zhang
    publisher: Anthropic
    year: 2024
    kind: article
    url: https://www.anthropic.com/research/building-effective-agents
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261120013959/https://www.anthropic.com/research/building-effective-agents
    note: Informed the idea of human checkpoints and review; it is about designing agent systems, not about product ownership. The page credits the authors in its acknowledgements; the original engineering URL now redirects here.
relations:
  related: [intent-over-implementation, review-the-decision, decision-records, outcomes-over-output]
---

## The idea

Split the work by kind, not by volume. People decide what the product is for, which changes deserve to exist and what trade-offs are acceptable, and they answer for the outcome. Agents take on the tactical work: implementing, testing, verifying, exploring options. The agent may do most of the typing; the human still owns the direction.

## Where it comes from

The idea is keel's, drawn from experience directing coding agents on real products. It is informed by Anthropic's [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) (December 2024), which describes agents that work largely on their own once a task is clear, but return to a person for information or judgment, pause for feedback at checkpoints or when blocked, and run under stopping conditions. The article notes that, even when tests pass, human review is still needed to check that a coding agent's solution fits the wider system's requirements. That article is about designing reliable agent systems. It does not make keel's argument about who owns product direction; keel extends the same instinct from system design to product decisions.

## Keel's perspective

A capable agent builds what it is pointed at, competently, and rarely asks whether it should. That is its strength and its limit. It does not carry your users' context, your past commitments or your sense of what the product is for unless you give it those things, and even then it cannot be accountable for the result. Accountability does not transfer with the work.

The practical rule is to delegate the *how* freely and keep the *whether* and the *why*. That is not a call for supervision of every step. Micromanaging an agent wastes the thing it is good at. The human's job is narrower and harder: set direction clearly (see [Intent Over Implementation](/library/intent-over-implementation)), notice when a change commits the product to something new, and decide those commitments on purpose (see [Review the Decision, Not Just the Diff](/library/review-the-decision)).

Cheap implementation makes this division matter more, not less. When building was slow, its cost forced choices. Now the choice has to be made deliberately, by someone who will live with it.

## When to use it

- Briefing an agent on work that touches users, data, pricing or scope.
- Reviewing agent output that adds a dependency, a service, a setting or a new user-facing behavior.
- When an agent proposes a direction change in passing, as part of an unrelated task.
- Deciding how much autonomy to grant: more for reversible, well-tested work; less for anything hard to undo.

## Example

For example, an agent asked to speed up a slow import proposes a background job queue. The implementation is sound and the tests pass. The decision about whether the product should now run a queue, with its monitoring, retries, failure modes and operational cost, is not a coding question. The human weighs it, perhaps against a simpler fix such as batching the writes, and the agent then builds whichever option was chosen.

## Limitations

The line between tactical and consequential is not always visible in advance; a small change can turn out to carry a large commitment. Treating every decision as one the human must make slows work to a crawl and defeats the point of delegating. The principle also assumes a person with the context to direct; when nobody has that context, the right move is discovery, not more oversight. And as agents improve, the boundary will shift. What stays fixed is that someone has to own the result.
