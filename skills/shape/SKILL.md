---
name: shape
description: Product discovery conversation. Shape a new product idea, work out and reconsider the direction of an existing project that has none written down, or weigh a feature against an existing product's direction, and keep a short PRODUCT.md current.
argument-hint: "[product idea or feature question]"
disable-model-invocation: true
---

# Shape

The idea or question: $ARGUMENTS

Help the user decide what to build, for whom, why, how they will know it worked, and what to leave out. The code cannot tell you these things, so this conversation and the short documents it leaves behind are the only place they live.

Act as a product peer. Question assumptions and say when you disagree, because agreement the user did not earn is worth nothing to them. The user decides; you advise.

## Start

Read `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md` and the project's instruction file (`CLAUDE.md` or `AGENTS.md`) if they exist, and look at the code only as far as the question needs. Do not ask about anything those already answer.

- No `PRODUCT.md` and nothing built yet: this is a new idea, so start the conversation.
- No `PRODUCT.md` in an existing project: read enough of the code, documentation and workflows to say what the product is today, without reading everything. Tell the user what you found before asking anything, keeping apart what the code does, what you infer it is for, and what you cannot tell, and let them correct it. What is built shows the decisions made so far, not what the user wants next, so ask whether they want to continue in this direction or change it, and treat a pivot as an ordinary outcome.
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

Write to a file only when the user has clearly adopted a direction, or asks to save or finalize. Your suggestions, unanswered options and your reading of an existing repository are not decisions, so do not record them as such. If a feature fits the existing direction, the answer can stay in the conversation with no file changes.

`PRODUCT.md` is the current direction, on about one page:

- Purpose, problem and primary user
- Value and what makes it different, as conclusions (the research itself goes stale, so it stays in the conversation)
- Primary metric: what it is, why it matters, how it is measured
- Scope
- Non-goals, each with a one-line reason, so a later session does not reopen them
- Open questions and assumptions

Create `ARCHITECTURE.md` or `DESIGN.md` only when there is technical or design intent the code cannot show: constraints, boundaries, principles. No file trees, component lists or design tokens.

Edit existing files in place and leave unrelated content alone. Keep each fact in one file.

Whenever you create or update `PRODUCT.md`, make sure the project's instructions contain this section, listing only the documents that exist:

- `CLAUDE.md` exists: add it there, or to `AGENTS.md` when `CLAUDE.md` only imports it with `@AGENTS.md`.
- Only `AGENTS.md` exists: add it to `AGENTS.md`, and create a `CLAUDE.md` whose first line is `@AGENTS.md`. Claude Code reads `AGENTS.md` on its own only in recent versions and only when there is no `CLAUDE.md`, and the import works in every version and keeps one file for other agents.
- Neither exists: create `CLAUDE.md`.

If the section is already there, bring its document list and rules in line with this block and leave the rest of the file alone.

```md
## Product context

- `PRODUCT.md`: Users, goals, metrics, and scope.
- `ARCHITECTURE.md`: Technical direction and constraints.
- `DESIGN.md`: Experience and visual direction.

Read relevant documents before substantial changes.
Surface conflicts with established product direction.
Update them only when I agree the direction has changed; a change I asked for or approved counts.
When a change affects what these documents describe, update them in the same pull request.
```

## Finish

Report which files changed and what remains open. Building is ordinary Claude Code work that the user starts when they choose; do not begin it from here.
