---
title: Review the Decision, Not Just the Diff
summary: When reviewing agent output, ask whether the change should exist and what it commits the product to, not only whether the code is correct.
topic: agents
byline: keel
origin: keel
keywords: [code review, pull requests, agent output, design review, scope, commitments]
sources:
  - title: What to look for in a code review
    author: Google
    work: Google Engineering Practices Documentation
    kind: documentation
    url: https://google.github.io/eng-practices/review/reviewer/looking-for.html
    checked: 2026-11-20
    status: live
    archive: https://web.archive.org/web/20261118015504/https://google.github.io/eng-practices/review/reviewer/looking-for.html
    note: Informs the idea that review covers design and fit with the system, not only correctness. The guide is about human code review generally, not agent output.
relations:
  builds-on: [humans-direct-agents-execute]
  related: [small-vertical-slices, code-is-a-liability, product-drift, decision-records]
---

## The idea

A diff can be correct and still be a mistake. When an agent hands back a change, the first question is whether this change should exist, and what it commits the product to: new behavior users will depend on, a dependency to keep current, a service to operate, a direction implied. Correctness comes second because a correct answer to the wrong question still has to be maintained.

## Where it comes from

The framing is keel's. It draws on a long-standing view of code review as more than bug-hunting. Google's [engineering practices guide](https://google.github.io/eng-practices/review/reviewer/looking-for.html) asks reviewers to look at design before details: whether the change belongs in the codebase or elsewhere, whether it fits the rest of the system, whether now is the right time to add the functionality, and whether it is more general than the problem requires. The guide is written for human reviewers of human changes; it does not address agents, and keel's emphasis on product commitments is its own extension.

## Keel's perspective

Agent output tends to pass the checks reviewers are used to. It compiles, tests exist and pass, the style matches, the edge cases are handled. That makes line-by-line review feel complete when the real question was never asked. And because agents produce changes quickly and in volume, the habit of approving clean diffs scales into [Product Drift](/library/product-drift).

So review in two passes. First the decision: what problem this solves, for whom, whether it was asked for, what it adds to the surface area of the product, what it makes harder later, and whether a smaller change would do. Every line merged is something to own (see [Code Is a Liability](/library/code-is-a-liability)). Only if the decision holds, review the implementation.

Small changes make this possible. A thin [vertical slice](/library/small-vertical-slices) carries one decision you can see; a sprawling change hides several inside it. When an agent's change bundles a requested fix with an unrequested feature, split them and decide each on its own.

## When to use it

- Any agent change that adds a dependency, a setting, a background process, a public API or user-visible behavior.
- Changes larger than the task that prompted them.
- Pull requests whose description explains how but not why.
- Reviewing your own agent sessions before merging, not only someone else's.

## Example

For example, an agent fixing a date-formatting bug also adds a locale picker to settings, with translations for three languages and tests for each. The code is clean. Reviewed as a diff, it passes. Reviewed as a decision, it commits the product to supporting those locales, keeping translations current and answering support questions in languages nobody on the team speaks. The reviewer keeps the fix, drops the picker, and notes the idea in case users ask for it.

## Limitations

Not every change carries a decision; renames, dependency bumps and mechanical refactors mostly do not, and treating them as if they did wastes review time. The decision pass also needs context the reviewer may not have, which is why recorded direction matters. And it does not replace careful reading of the code: a well-chosen change can still be wrong, and security and data-handling bugs hide in diffs that look routine.
