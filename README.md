# keel — Move fast. Stay on course.

A keel keeps a sailboat from drifting sideways without preventing it from changing course. AI coding agents provide the speed. Humans decide where to go. Keel helps keep the work aligned with what matters.

**Independent agent skills for product and engineering judgment.** Built for Claude Code and capable frontier models. No orchestration. No mandatory workflow. Just focused judgment when you need it.

Website: [keel.gaboesquivel.com](https://keel.gaboesquivel.com), which also publishes principles, essays and guides on directing AI-powered product development.

## Skills

| Skill | What it helps you do |
| --- | --- |
| [`/shape`](skills/shape/SKILL.md) | Decide what to build, for whom, why, and what to leave out. Preserve adopted product direction. |
| [`/slice`](skills/slice/SKILL.md) | Find the next smallest useful increment from where the product stands today, with clear boundaries, and reassess as it evolves. |
| [`/peer`](skills/peer/SKILL.md) | Get an independent second opinion, challenge assumptions, and better direct coding agents. |
| [`/design`](skills/design/SKILL.md) | Shape visual direction, critique interfaces, explore prototypes, and verify rendered designs. |
| [`/ux`](skills/ux/SKILL.md) | Walk real user journeys, uncover friction, and identify improvements supported by evidence. |
| [`/perf`](skills/perf/SKILL.md) | Measure performance across web, mobile, APIs and MCP servers, identify bottlenecks, and verify improvements. |
| [`/retro`](skills/retro/SKILL.md) | Revisit delivered product decisions, compare intent with outcomes, and decide what should change. |
| [`/align`](skills/align/SKILL.md) | Check that accepted product, architecture and design decisions, the documents and the code still agree, and tell intentional evolution from drift. |

Each skill works independently. Invoke whichever one you need, whenever you need it. No required order or automatic chaining.

## Keeping the project on course

`/shape` establishes the foundation. It helps define what deserves building and preserves accepted product direction so future coding sessions don't have to reconstruct the intent.

Keel uses a few small project documents to maintain that context:

- **`PRODUCT.md`** — Purpose, users, goals, success metrics, scope, and non-goals. Created and maintained by `/shape` when you adopt a direction.
- **`ARCHITECTURE.md`** — Lasting technical direction, boundaries, and constraints that aren't obvious from the code. Created only when needed.
- **`DESIGN.md`** — Accepted experience and visual direction. Created when needed and kept current by `/design` or ordinary development work.
- **`CLAUDE.md`** — Directs Claude Code to the project context and helps prevent unintended changes in direction. `/shape` establishes or updates this guidance when recording product intent, in `AGENTS.md` when the project keeps its agent instructions there.

These aren't mandatory documents to generate upfront. Decisions are recorded when adopted, not merely proposed. The code remains the source of truth for routine implementation details.

### Optional: the reasons and the evidence

The documents above say what is true now. Some projects also want to remember why, and what the evidence was. Keel has one convention for that, and no skill requires it:

```text
docs/
  decisions/NNNN-short-name.md     Why, and what was turned down. proposed, accepted or superseded.
  research/<topic>.md              Dated evidence with sources. Goes stale. Never a decision.
  experiments/YYYY-MM-DD-name.md   An assumption and what would count, written before; the result, after.
  ROADMAP.md                       Ordered intentions, not commitments.
```

- A file exists because it has something in it. Nothing is scaffolded, and no folder is created empty.
- A decision record is `accepted` only when you said so. One an agent writes on its own stays `proposed` until you accept it. A replaced record stays in place, marked `superseded`.
- Research and experiments keep what was observed apart from what was inferred.
- Skills read these when they exist. `/shape` writes a decision record when you adopt a direction in a project that keeps them, `/retro` supersedes a record instead of rewriting it, `/align` checks accepted records against the code and flags stale ones, and `/slice`, `/perf` and `/ux` save there when you ask them to keep a result.

Other skills complement this foundation. `/retro`, for example, looks back at what shipped and whether it achieved its intended outcomes. It may recommend changing direction, but doesn't rewrite accepted decisions without your approval. `/align` checks whether these documents and the code still agree, and recommends the smallest correction where they don't.

The goal is to preserve intent, prevent product drift and scope creep, and still allow deliberate changes of course.

## Install

Install using the [skills CLI](https://github.com/vercel-labs/skills).

**All skills, globally:**

```bash
npx skills@latest add gaboesquivel/keel -g -y
```

**One skill, in your project:**

```bash
npx skills@latest add gaboesquivel/keel --skill shape -y
```

**List available skills:**

```bash
npx skills@latest add gaboesquivel/keel --list
```

For manual Claude Code installation, copy a skill directory into `~/.claude/skills/` (global) or `.claude/skills/` (project).

## Built for Claude Code

Keel is designed primarily for [Claude Code](https://code.claude.com/docs/en/skills), complementing its native capabilities instead of replacing them.

Skills are explicitly invoked using slash commands, such as `/shape [idea]` or `/peer`. They don't run automatically in Claude Code.

Keel uses the portable [Agent Skills](https://agentskills.io) format, but equivalent behavior across other coding agents hasn't yet been fully validated.

The skills are informed by [Anthropic's skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) and refined through real product use. They are deliberately lean: every instruction should provide distinct value beyond what capable models already do.

Keel focuses on **what matters and why**, leaving implementation to the coding agent.

## Working across models

I build with Claude Code and use separate advisory conversations, often with ChatGPT, to explore ideas, challenge assumptions, and review decisions.

Separating independent judgment from implementation helps preserve coding-agent usage and keeps speculative context from unnecessarily influencing execution.

For example, combining a $20/month ChatGPT Plus subscription with a $100/month Claude Max plan can be a practical way to separate exploration from implementation.

I'm also exploring **model asymmetry**: whether different models, contexts, and harnesses can uncover blind spots that a single agent might miss. It's an experiment, not a requirement.

The goal is better judgment, not more agents.

## Influences

- **[Anthropic — Claude Code Skills](https://code.claude.com/docs/en/skills)** and **[Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)** — Native capabilities, focused instructions, and model-aware skill design.
- **[Google Labs — DESIGN.md](https://github.com/google-labs-code/design.md)** — An influence on maintaining durable, agent-readable design context. Keel does not claim conformance to its specification.

---

Created by [Gabo Esquivel](https://gaboesquivel.com).

[Contributing](CLAUDE.md) · [MIT License](LICENSE)
