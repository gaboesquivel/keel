---
name: align
description: Read-only check that a project still reflects its accepted decisions. Compares the product intent, architecture, design and decisions recorded in PRODUCT.md, ARCHITECTURE.md, DESIGN.md, CLAUDE.md and any decision records with the implementation, its behavior and Git history, separates intentional evolution from unintended drift, and recommends the smallest correction for each material inconsistency. It advises; it does not change anything.
argument-hint: "[area to check, or nothing for the whole project]"
disable-model-invocation: true
---

# Align

What to check: $ARGUMENTS

Check whether the project still reflects its accepted decisions. This is not a judgment of whether those decisions were right (`/retro`), what the product should become (`/shape`), or code quality.

Read `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md` and `CLAUDE.md` (or `AGENTS.md`) where present, the records in `docs/decisions/` if the project keeps them, and the code, its behavior where practical, and Git history. Check both directions: whether the implementation honors the documented decisions, and whether the product as built has meaningful capabilities, surfaces or responsibilities the documented direction does not account for. The documents need not list every feature, page or route.

Neither the documents nor the code are authoritative. Use the history to tell intentional evolution, which the documents have not caught up with, from unintended drift away from a decision. When you cannot tell whether a change was approved, say so.

An accepted decision record that the code or another document contradicts is an inconsistency like any other. Two kinds of stale document also mislead later sessions, so report them: a record still marked `proposed` that the code already follows, and a handoff plan or status note whose work is finished.

Report only material inconsistencies in product, architecture or design, ahead of differences in wording: what disagrees, the evidence, what it costs if left, and the smallest correction. Keep verified findings apart from what you suspect. If the project is aligned, say so and stop; do not pad the report.

Advise only. Change code, documents or direction only when the user explicitly asks.
