---
name: retro
description: Product and engineering retrospective on a delivered feature, release or product. Recovers the original intent and decisions, compares them with what was built and with the available evidence of use and outcomes, and answers whether we would build the same thing the same way, with at most three ranked keep, change, remove or explore recommendations. It advises; it does not implement.
argument-hint: "[feature, release or product to look back on]"
disable-model-invocation: true
---

# Retro

What to look back on: $ARGUMENTS

Answer one question: knowing what we know now, would we build the same product the same way? This looks back at the product and the engineering decisions behind it. It is not a retrospective on the coding session, agent instructions, tooling or process.

If nothing is named, propose the most recent substantial feature or release from the history and confirm it before going further.

## Recover the intent

Read `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `CLAUDE.md`, and the relevant history (pull requests, commit messages, issues, decision notes) as far as the question needs. Reconstruct who it was for, the problem, the expected outcome, the constraints, and the decisions made, including alternatives that were rejected. Where intent was never written down, say what you infer and from what. Ask the user only for what would change the conclusion.

## Recover what happened

Look at the behaviour as built, in the running product when you can, and gather what evidence exists: usage, outcomes, feedback, incidents, operating cost, and maintenance load (for example how often the area needed fixes). Ask the user for evidence you cannot see, such as analytics or what users said; "unknown" is an acceptable answer.

Keep three claims apart, because each needs its own evidence:

- **Delivered:** it exists and works.
- **Used:** people actually use it.
- **Outcome:** it produced the value it was built for.

A missing metric is unknown, not failure. A metric that moved after release is a correlation, so name what else changed in the same period before attributing it.

## Reconsider

Examine only the decisions that matter, across:

- **Product:** did it solve the intended problem for the intended user, or drift toward someone else's needs; did users get the expected value; and what was unnecessary, missing, or better served by an existing alternative?
- **Experience:** where is there avoidable friction or confusion, and what did the original design overlook? Keep what was observed apart from what is hypothesised.
- **Engineering:** are the important abstractions, dependencies and boundaries still justified, where does complexity cause a concrete maintenance or operating cost, and did we build more than the problem needed?

Judge each decision first by what was known when it was made, then by what is known now. A decision can be sound then and still sound, sound then but overtaken by changed circumstances or evidence, or a mistake even at the time. Complexity that real constraints justify stays; name the constraint. Do not reopen a sound decision because newer technology exists, and do not recommend a refactor for elegance alone: name the cost it removes.

Leaving it alone is always a candidate. Another iteration costs time and attention that may be worth more elsewhere.

## Answer

Lead with the answer to the question: yes, mostly, or no, and why in a sentence or two. Then:

- **Keep:** decisions worth keeping, with the reason, so later sessions do not reopen them.
- **Priorities:** at most three, ranked by expected impact, confidence and effort. For each, recommend keep, change, remove or explore; give the evidence and say whether it was observed or inferred; say whether the change is justified now or needs more evidence first, and which evidence would settle it; and name the smallest worthwhile next action.
- **Unknowns** that would change the answer.

Fewer than three priorities is fine, and none is a valid result. Do not pad.

## Boundaries

Recommend; do not act. Do not implement changes, create tickets, or edit project documents unless the user asks. If the user adopts a new direction and asks to record it, edit the relevant document in place.
