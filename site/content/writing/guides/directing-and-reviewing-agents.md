---
title: Directing and Reviewing AI Coding Agents
subtitle: Say what matters, then check what happened.
description: How to brief a coding agent with outcomes and constraints, keep accepted product context intact, and review its work against evidence instead of its own report.
date: 2026-11-19
order: 2
---

Capable coding agents have changed where the work is. Writing the code is often the fast part. The slow, valuable parts are deciding what the code should achieve, telling an agent clearly enough that it builds that, and checking afterwards that it did. This guide covers the two ends: directing and reviewing.

None of it depends on special phrasing. There are no magic words that reliably make a model better, and this guide does not offer any. What helps is the same thing that helps a capable colleague: knowing the goal, the constraints and their reasons, and what you will check at the end.

## Direct with outcomes and constraints

A good brief says what should be true when the work is done and what must not change on the way. It leaves the method to the agent unless the method is itself a constraint.

Compare:

```text
Add a useEffect in Settings.tsx that calls /api/prefs, store the result in
state, add a loading spinner, then add a toggle component for each pref and
call PATCH /api/prefs on change.
```

```text
Users should be able to change their notification preferences from the
Settings page, and the change should persist across sessions.

Constraints:
- Use the existing /api/prefs endpoints; the backend is out of scope for this
  change.
- Follow the form patterns already in app/settings/ so the page stays
  consistent.
- No new dependencies.

Done when a preference changed in the UI survives a reload, and the existing
settings tests still pass. Report what you changed, what you ran to check it,
and anything you could not verify.
```

The first is a set of steps. If one of them is wrong (perhaps prefs are already loaded server-side), the agent will either follow the wrong step faithfully or quietly deviate, and you will not know which until you read the diff. The second states the outcome, the boundaries and the evidence you expect. The agent can find the right implementation, and you have a definition of done to review against.

Prescribe the method when it genuinely matters: a migration that must be reversible, an API that must stay backward compatible, a library the team has standardized on. Then say why. A constraint with its reason lets the agent handle the case you did not anticipate; a bare rule only covers the cases you did.

## Explain what matters, not every step

Most of what a brief needs is information the agent cannot discover from the repository:

- The goal, and what it serves.
- What done looks like, in terms you can check.
- Decisions already made, and approaches already ruled out.
- Constraints, each with its reason.
- What is out of scope.
- What to report back.

Leave out what the agent can find (file locations, conventions visible in the code) or does well by default (writing idiomatic code, running the test suite it can see). Every sentence spent on those is a sentence the agent has to weigh against the ones that matter.

When the brief rests on an assumption that would change the goal if it were wrong, say so, and ask the agent to stop and report rather than work around it:

```text
This assumes invoices are always in a single currency. If you find
multi-currency invoices in the data model, stop and tell me before changing
anything; that would change the scope.
```

That one paragraph prevents a common failure: an agent meets a surprise, makes a reasonable local decision about it, and buries a product decision inside an implementation.

## Preserve accepted product context

Agents start each session without your history. Decisions that were settled last week (who the product is for, what is deliberately out of scope, which tradeoff you chose) are invisible unless they are written down somewhere the agent reads.

Keep those decisions in the repository: a `CLAUDE.md` for working conventions, and product or design documents for direction. Keel uses `PRODUCT.md` and `DESIGN.md`. Then brief against them instead of restating them:

```text
Before
Make the onboarding flow better. Maybe add a tour, or a checklist, or
whatever you think is best.
```

```text
After
Read PRODUCT.md first; the audience and non-goals there are settled.
New users currently drop off before connecting their first data source.
Reduce the steps between sign-up and a connected source. A guided tour is
out of scope (we decided against tours; see Non-goals). If the best fix
needs a product change beyond onboarding, propose it in your report instead
of building it.
```

The second version does three things the first does not: it points at the accepted context, it names the problem the change should solve, and it says what to do when the agent's judgment runs into the product's boundaries. That last instruction is the one that prevents drift. An agent asked to "make it better" will improve something; whether it improves the thing you care about depends on whether you said what that was.

## Steering language that works

Steering is not a vocabulary. It is a handful of habits that make intent legible:

- **State the goal before the task.** "So that new users reach a connected source sooner" lets the agent make sensible tradeoffs. "Change the onboarding form" does not.
- **Give reasons with constraints.** "Do not change the public API, because two customers call it directly" is more robust than "do not change the public API".
- **Say what to do at the edges.** Stop and report, propose instead of building, leave a TODO: pick one, and say which.
- **Ask for evidence, not reassurance.** "Report the commands you ran and their output" gets you something to check. "Make sure it works" gets you a sentence saying it does.
- **Use plain emphasis sparingly.** If everything is marked important, nothing is. Capable current models generally follow a calm, clear instruction; shouting it rarely adds anything.

Frontier models do not need ceremony: role-play preambles, long rule lists copied between projects, or elaborate templates for small tasks. Those are tools. Use a role or an example when it demonstrably improves the result, and drop it when it does not. A two-line follow-up in a session that already holds the context is often the best brief you can write.

```text
Before
You are a world-class senior staff engineer with 20 years of experience.
You always write perfect, clean, production-ready code. Think step by step.
Fix the bug in the date picker.
```

```text
After
The date picker in app/booking/ shows the previous day for users west of
UTC (reported on bookings made after 6pm Pacific). Find the cause and fix
it. Add a test that fails without the fix. Tell me where the timezone
conversion was going wrong.
```

The difference is not tone. The second gives the symptom, where to look, a way to prove the fix, and what to explain.

## What a good implementation handoff contains

When the agent finishes, its report is a handoff to you or to a reviewer. Ask for it in the brief so it arrives in a useful shape:

- **What changed**, at the level of behaviour and files, not a narrated diff.
- **How it was checked**: the commands run and their results, and what was looked at in the running app.
- **What was not checked**, and why.
- **Decisions made along the way** that were not in the brief, especially anything that touches product behaviour.
- **Anything out of scope** that was noticed and left alone.

```text
When you finish, report:
1. What changed and why, in a few lines.
2. Commands you ran to verify it, with pass/fail.
3. What you could not verify.
4. Any decision you made that I did not specify.
Do not summarize the diff; I will read it.
```

A handoff that separates "verified" from "assumed" is worth more than one that sounds confident. If the agent cannot tell which is which, that is useful information too.

## Review claims against evidence

An agent's report is a claim about the work, not the work. Review against what was asked, and check the claims against the code and the behaviour.

Proportion matters: a typo fix does not need the same scrutiny as a change to billing. But when the stakes justify it, look at the evidence directly:

- **Read the diff**, not just the summary. `git diff --stat origin/main...HEAD` shows quickly whether the change stayed in scope.
- **Run the checks yourself** when you can. A test suite that passed in the agent's session may not pass on a clean checkout or a rebased branch.
- **Look at the rendered result** for anything a user sees. Many UI bugs are invisible in the code and obvious on the screen: overflow at narrow widths, a focus state that disappeared, a dark mode that was never tried.
- **Check the tests themselves.** If tests changed in the same diff as the code, read what changed. A test edited so that it passes is a common way for a wrong change to look right.

The gaps worth hunting for are consistent:

- Work reported as done but never actually verified.
- Tests weakened, skipped or rewritten to match new behaviour.
- An easier problem solved in place of the one asked.
- Changes outside the requested scope, including "while I was here" refactors.

## Independent second opinions

The agent that wrote a change is not the best judge of it. It shares the assumptions that produced the change, and it has a natural tendency to describe its own work favourably. A second opinion from a session that did not write the code, and that is asked to evaluate rather than to agree, catches a different class of problem.

That second session can be another Claude Code session, a different model, or a person. Keel's [/peer](/skills/peer) skill packages this role: it advises and reviews without implementing, so it stays independent of the change. It is one option, not a required step.

Brief the reviewer with the original goal and the diff, not with the implementer's conclusions:

```text
Before
The agent says it fixed the timezone bug and all tests pass. Can you confirm
it looks good?
```

```text
After
Goal: bookings made after 6pm Pacific showed the previous day. Review the
diff on fix/booking-timezone against that goal. Check whether the fix
addresses the cause or only the reported case, whether the new test would
fail without the fix, and whether anything outside app/booking/ changed.
Say what you verified and what you are taking on trust.
```

The first invites agreement. The second gives the reviewer the goal and specific things to check, and asks it to separate evidence from assumption.

## Avoiding rubber-stamp reviews

A review that always approves is not a review. Some ways it happens, with agents and with people:

- Reviewing the summary instead of the change.
- Reviewing at the speed work arrives, rather than at the speed review takes.
- Accepting "tests pass" without knowing which tests, or whether they test the change.
- Treating every finding as equally urgent, so the important one is lost among style notes.

The opposite failure is real too. A reviewer, especially an agent asked to "find problems", can invent objections to look rigorous. Hold findings to the same standard as the work: is the problem real, did this change introduce it, and is it not a decision already made? What cannot be confirmed goes back as a question, not as a reason to reject the work. End each review with a clear verdict: accept, send back with a specific follow-up, or a decision only a person can make.

## Evidence and uncertainty

Ask agents to state what they verified and what they assumed, and do the same in your own reviews. "The migration runs on a fresh database; I did not test it against a copy of production data" is a complete, honest status. "Everything works" is not.

When uncertainty matters, turn it into a check rather than a debate. If you are unsure whether a change slows down a page, measure it. If you are unsure whether users will find a setting, that is a product question, and no amount of code review will settle it.

## When to intervene

Let agents work, but step in when:

- **The plan contradicts settled context.** A plan that adds a feature listed as a non-goal should be stopped before it is built, not reviewed after.
- **The agent is solving a different problem.** Signs: its progress notes describe something adjacent to what you asked.
- **It loops.** Repeated attempts at the same failing fix usually mean a wrong assumption. Ask it to stop and explain what it believes is happening.
- **It is about to make an irreversible change**: data migrations, deletions, anything published or sent.
- **It is making a product decision.** Choosing a default, removing a behaviour users depend on, changing copy that sets expectations.

Asking for a plan before implementation, for risky or ambiguous work, gives you a cheap point to intervene. A five-line plan is much easier to correct than a five-hundred-line diff.

## Separate product judgment from implementation technique

Two kinds of question arrive in every review, and they need different people, or at least different hats.

**Implementation questions** have answers you can check: does it work, is it correct, does it follow the project's conventions, is it fast enough. Agents are increasingly good at these, and good at checking each other on them.

**Product questions** are judgments: should this exist, who is it for, is this the right tradeoff, what does it mean for what we said we would not do. An agent can lay out options and consequences, and that is useful. The decision belongs to whoever is accountable for the product.

Keeping the two apart makes both reviews better. Do not let a well-built implementation carry a product decision through review on the strength of its code quality. And do not reopen settled product decisions in a code review unless there is new evidence; that is how projects drift without anyone choosing to.

## Further reading

- [Claude Code: best practices](https://code.claude.com/docs/en/best-practices): Anthropic's guidance, organized around telling Claude what it cannot see from the code and giving it a check to run.
- [Claude Code: common workflows](https://code.claude.com/docs/en/common-workflows): recipes for plan mode, subagents and pull requests.
- [Keel /peer](/skills/peer): an independent second-opinion skill for briefing and reviewing a separate implementing agent.
- [Developing with Parallel Agent Sessions](/guides/parallel-agent-sessions): how to split work across sessions and integrate it again.
