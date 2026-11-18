# keel

## Purpose

A lean, opinionated collection of independent skills for building better software with capable AI coding agents. Agents increasingly work out how to implement things. What remains is deciding what deserves building, why, for whom, whether it worked, and what should change. keel supplies the judgment, context and evidence agents can't reliably infer from code. Like a keel, it gives direction without stopping movement or a change of course.

## Audience

Solo developers building products with Claude Code. Other agents may work.

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

## Scope

A small set of independent skills, each with a clear, distinct responsibility. Today: `shape` (what to build, scope, preserved intent) and `peer` (an independent second opinion for directing and evaluating coding agents).

A skill belongs only if it:

- addresses judgment, context or evidence agents can't infer from code,
- doesn't duplicate native Claude Code,
- has a responsibility no other keel skill covers,
- shows it adds value over unmodified Claude Code, in dogfooding.

Skills may be changed, merged or removed.

## Primary metric

In dogfooding on real projects, the share of skill uses that change a decision or surface something plain Claude Code wouldn't, and are judged right on later review. Logged per use, spot-checked against unmodified Claude Code. No baseline yet. Weakness: the author is also the judge.

## Non-goals

- No methodology, mandatory lifecycle, sequence or automatic chaining: that is the ceremony keel exists to avoid.
- No replacing or wrapping native agent features.
- No implementation work, which agents already do well.
- No growth in skill count for its own sake: each skill costs upkeep.
- No fixed roadmap: candidate skills are explored, not committed.

## Open questions

- Does this add value over plain Claude Code? Unmeasured so far.
- Is there evidence of these problems beyond the author's own experience?
- How much does it overlap with existing tools (for example the AgentOps `product` skill)? Not checked.
