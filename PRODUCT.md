# keel

## Purpose

A lean, opinionated collection of independent skills for building better software with capable AI coding agents. Agents increasingly work out how to implement things. What remains is deciding what deserves building, why, for whom, whether it worked, and what should change. keel supplies focused judgment, context and evidence that agents don't reliably produce on their own. Like a keel, it provides stability against drift without preventing movement or a deliberate change of course.

## Audience

Technical solopreneurs, independent product builders and small technical teams building products with AI coding agents, starting with Claude Code.

## Problems

- Product drift: agents build well without questioning whether it serves the goals.
- Lost intent: decisions about users, scope and direction vanish between sessions.
- Premature implementation: idea straight to code, unexamined.
- Repeated decisions: new sessions reopen what was settled.
- Ceremony: existing frameworks add documents and stages capable agents don't need.

Today this is ad hoc: chat, READMEs, agents inferring intent from code, or heavy frameworks.

## Principles

- Intent over implementation: set what matters, let agents handle how.
- Judgment over ceremony: improve decisions without adding steps or documents.
- Evidence over assumptions: challenge claims, inspect existing work, learn from alternatives, reuse before building.
- Focus over accumulation: resist scope creep and drift. Change direction only deliberately.
- Humans direct, agents execute.
- Complement native capabilities; don't duplicate them.
- Independent and composable: no required order, chaining or lifecycle.
- Every instruction must earn its place by changing behavior.

These govern keel's own decisions about its skills. The principles published on the website are broader guidance for people directing AI-powered product development: the two should agree, but need not match.

## Scope

A small set of independent skills, each with a clear, distinct responsibility. Today: `shape` (what to build, scope, preserved intent), `slice` (the next smallest useful end-to-end increment, reassessed against what is already delivered and learned), `peer` (an independent second opinion for directing and evaluating coding agents), `retro` (looking back at whether what was delivered was worth building that way), `align` (whether accepted intent, documents and implementation still agree, telling intentional evolution from drift), `perf` (measured diagnosis of where time and resources go in web apps, mobile apps, backends and APIs, and MCP servers, and whether a change helped), `ux` (user journeys, interaction flows, usability, friction, feedback, accessibility and task completion) and `design` (visual language, typography, layout, hierarchy, consistency and aesthetics).

A skill belongs only if it:

- adds distinct value over native Claude Code, including through focused, specialized investigation (for example performance or design),
- has a responsibility no other keel skill covers,
- justifies its maintenance cost.

Skills may be changed, merged or removed.

The website supports the skills: it presents them and publishes principles, essays and guides that share the thinking behind them and serve as a reference for product and engineering judgment. The writing is not a methodology the skills depend on, and it need not list every skill.

## Primary metric

In dogfooding on real projects, how often a skill changes a decision or surfaces something plain Claude Code wouldn't, judged right on later review. Evaluated selectively, by comparing against baseline Claude Code on real work, not by logging every use. No baseline yet. Weakness: the author is also the judge.

## Non-goals

- No methodology, mandatory lifecycle, sequence or automatic chaining: that is the ceremony keel exists to avoid.
- No replacing or wrapping native agent features.
- No generic implementation workflows, which agents already do well. Specialized work (for example profiling or design critique) is not excluded.
- No growth in skill count for its own sake: each skill costs upkeep.
- No fixed roadmap: candidate skills are explored, not committed.

## Open questions

- Does this add value over plain Claude Code? One single-run comparison so far ([evals/README.md](evals/README.md)): clearest for `perf` and `ux`, narrow or tied for the rest, `design`, `slice` and `align` not yet measured.
- Is there evidence of these problems beyond the author's own experience?
- How much does it overlap with existing tools (for example the AgentOps `product` skill)? Not checked.
