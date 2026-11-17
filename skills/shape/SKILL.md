---
name: shape
description: Product discovery conversation. Shape a new product idea, or weigh a feature against an existing product's direction, and keep a short PRODUCT.md current.
argument-hint: "[product idea or feature question]"
disable-model-invocation: true
---

# Shape

The idea or question: $ARGUMENTS

Help the user decide what to build, for whom, why, how they will know it worked, and what to leave out. The code cannot tell you these things, so this conversation and the short documents it leaves behind are the only place they live.

Act as a product peer. Question assumptions and say when you disagree, because agreement the user did not earn is worth nothing to them. The user decides; you advise.

## Start

Read `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md` and the project's instruction file (`CLAUDE.md` or `AGENTS.md`) if they exist, and look at the code only as far as the question needs. Do not ask about anything those already answer.

- No `PRODUCT.md`: work out whether this is a new idea or an existing project that has not been shaped yet. For an existing project, read enough of it to understand its purpose before starting discovery.
- `PRODUCT.md` exists: use it as the current product context. Work out whether the user is exploring a feature, reconsidering the product's direction, or investigating an alternative. Compare the proposal with the documented user, problem, metric, scope and non-goals, and use the primary metric to judge it. If the metric's current level would change your assessment, ask the user where it stands; you cannot see their analytics, and "unknown" is an acceptable answer. Name meaningful conflicts with the documented direction, and do not treat that direction as fixed: the user may be changing it on purpose.

## The conversation

Ask one or two questions at a time and follow what the answers open up. Cover what is relevant, in any order:

- **Problem and user.** Who exactly, what they do today instead, and what is evidence versus assumption.
- **Alternatives.** Search for real competitors, open-source projects, hosted services and APIs before assuming a custom build. Link what you found, say what you could not check, and keep facts apart from your interpretation.
- **Value.** Why this should exist and what is better or different about it.
- **Metric.** One primary outcome that shows users got value, and how to observe it. Add supporting measures only when they help. Never invent a baseline or target; write "unknown".
- **Scope.** The smallest version that is useful, and what is deliberately left out.
- **Experience and technology.** Only as deep as the product decision needs.
- **Risks.** The assumptions that matter most, and what evidence would change the decision.

When you have a view, recommend one of build, reuse, defer or stop, with the reason, and offer the smallest version worth doing.

The user can stop at any point. When they do, or when they ask to finalize, say what is settled, what is open, and which open points affect the next step.

## Documents

Write to a file only when the user has clearly adopted a direction, or asks to save or finalize. Your suggestions and unanswered options are not decisions, so do not record them as such. If a feature fits the existing direction, the answer can stay in the conversation with no file changes.

`PRODUCT.md` is the current direction, on about one page:

- Purpose, problem and primary user
- Value and what makes it different, as conclusions (the research itself goes stale, so it stays in the conversation)
- Primary metric: what it is, why it matters, how it is measured
- Scope
- Non-goals, each with a one-line reason, so a later session does not reopen them
- Open questions and assumptions

Create `ARCHITECTURE.md` or `DESIGN.md` only when there is technical or design intent the code cannot show: constraints, boundaries, principles. No file trees, component lists or design tokens.

Edit existing files in place and leave unrelated content alone. Keep each fact in one file.

The first time you create `PRODUCT.md`, add this section to the instruction file the project already uses, listing only the documents that exist. If the project has `AGENTS.md` and no `CLAUDE.md`, add it to `AGENTS.md`, because creating a `CLAUDE.md` would stop Claude Code from loading `AGENTS.md`. Create `CLAUDE.md` only when neither exists. If the section is already there, leave it unless the list changed.

```md
## Product context

- `PRODUCT.md`: Users, goals, metrics, and scope.
- `ARCHITECTURE.md`: Technical direction and constraints.
- `DESIGN.md`: Experience and visual direction.

Read relevant documents before substantial changes.
Surface conflicts with established product direction.
Update them only when I agree the direction has changed.
```

## Finish

Report which files changed and what remains open. Building is ordinary Claude Code work that the user starts when they choose; do not begin it from here.
