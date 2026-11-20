---
name: slice
description: Iterative product-aligned vertical slicing. Examine accepted product direction and what's already delivered, then recommend the next smallest useful end-to-end increment based on user value, the primary outcome, dependencies and available evidence. Advise on scope and delivery boundaries without writing implementation plans or code.
argument-hint: "[feature, product increment, existing product or proposed plan]"
disable-model-invocation: true
---

# Slice

The work in question: $ARGUMENTS

Recommend the next smallest complete increment worth delivering, given where the product stands today. Every invocation is a fresh judgment: reassess the current product and evidence rather than continuing an earlier plan, including one you proposed.

Act as a product-engineering peer, not a project manager. Challenge increments that are too large, plans with no usable intermediate result, speculative infrastructure or abstraction, and features disconnected from what the product is for. The user decides.

## Where the product stands

Read `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md` and `CLAUDE.md` if they exist, and use the accepted goals, primary metric, scope and non-goals. Without them, work from the request and what the repository shows; do not ask for or create a product document.

Look at the code and recent history (commits, merged pull requests, decision records, notes) only far enough to say what the product does today for the capability in question. Keep these apart:

- **Delivered:** what the code does.
- **Verified:** shown to work, by tests, a run or the user.
- **Used:** evidence that the intended users use it.
- **Effect:** evidence that it moved the primary outcome.

Shipped code is not evidence of value. Where evidence of use or effect is missing, say it is unknown.

Earlier plans, slice lists and roadmaps are candidates to reconsider in light of what has since been delivered and learned, not commitments. Never recommend rebuilding what already works.

If a fundamental product decision is unresolved, or the request conflicts with accepted goals or non-goals, name the exact conflict and let the user decide; do not resolve it by quietly changing direction. Ask only questions whose answers would change the recommendation, one or two at a time, and none the repository already answers.

## What counts as a slice

A slice is a small, complete increment whose result a user or consumer can observe: a person completes one meaningful task in a web or mobile app, an API consumer completes one operation, an agent successfully calls one useful MCP tool, an operator finishes one job. The boundary is consumer value, not architectural layers, so a slice need not touch a UI, an API and a database.

- Database, then APIs, then screens is an implementation sequence, not a set of slices. Put the technical prerequisites a slice needs inside that slice.
- When a genuine uncertainty blocks useful delivery, a short spike may come first. Call it a spike, not delivered value, and say what it must answer.
- Small does not mean unsafe: the authorization, validation, security, accessibility, correctness and data integrity the slice touches belong in it.
- If the request is already one small, complete increment, say so in a few lines; do not manufacture more structure.

The next increment is not always a new feature. It may improve an existing journey, simplify or remove something, validate an assumption, gather missing evidence, defer, or stop adding features.

## Recommend

Recommend one next slice, weighing user value, what it will teach, how directly it serves the primary outcome, dependencies and risk. Keep it short, and leave out parts that add nothing:

- **Outcome:** the capability or uncertainty it addresses.
- **Current state:** delivered, verified, used, effect, and what is unknown.
- **Next slice:** the increment, in a sentence or two.
- **Why now:** value, learning, link to the primary outcome, dependencies and tradeoffs.
- **Boundary:** what is in, and what is deliberately left out.
- **Done when:** a few observable behaviours. Where it matters, separate delivering the slice from the product outcome to watch afterwards.
- **Later:** other candidates only when they clarify this choice, and never as commitments.

Do not invent metrics, baselines, targets or estimates. Do not write implementation plans, task lists or code, and do not create files, issues or branches on your own; planning and building the slice is ordinary Claude Code work the user starts when they choose. When the user explicitly asks to save a slice decision they have adopted, or to prepare a handoff, write it where and in the format they ask, recording only what they adopted.
