---
title: Developing with Parallel Agent Sessions
subtitle: More agents is a decision about integration, not about speed.
description: When running several AI coding sessions at once helps, when it hurts, and how to keep them apart with worktrees, clear ownership and deliberate integration.
date: 2026-11-19
order: 1
---

Running several coding agents at once is easy to start and easy to regret. Starting a second session takes seconds. Merging what two sessions built, against product decisions that moved while they worked, takes judgment. This guide is about that second part.

The practical default it argues for is modest: short-lived branches, one independent worktree per session, focused pull requests, and integration done deliberately by a person. That is a default, not a lifecycle. Plenty of good work happens in one session, and nothing here says your project needs more than one; [focus over accumulation](/principles#focus-over-accumulation) applies to sessions as much as to features.

## One session or several

Start from the work, not from the tooling. Parallel sessions pay off when the work splits into pieces that:

- touch different files, or at least different regions that will not need the same lines,
- can each be judged on their own (a reviewer can say "this is done" without the other pieces),
- rest on decisions that are already made.

They cost you when the pieces depend on each other's output, when they all need to change the same central file, or when the important decision has not been made yet. In that last case, three sessions will happily make three different versions of the decision, and you will spend the saved time choosing between them.

A useful test before splitting: can you write each session's brief without the phrase "coordinate with the other one"? If you cannot, the work is probably one task, and one session (perhaps with subagents for research) will finish it sooner.

Some signals that parallel work will help:

- A feature and an unrelated bug fix you want to keep in separate pull requests.
- Independent pages, modules or documents with clear owners.
- Several approaches to the same problem that you want to compare, where you intend to keep one and throw the rest away.
- Review or research from different angles, where nothing is written to the main branch.

Signals that it will hurt:

- A refactor that moves shared types, routes or schemas everyone else depends on.
- A product question still open ("should this be a setting or a default?").
- Work small enough that writing the second brief takes longer than doing it.
- You cannot review the output as fast as it arrives. Your review capacity is the real limit on parallelism, not the number of terminals you can open.

## Three shapes of parallel work

Claude Code offers more than one way to run agents side by side. They differ in who coordinates and what is isolated. The descriptions below follow the [Claude Code documentation](https://code.claude.com/docs/en/agent-teams) as of November 2026; check it for current behaviour, because these features change.

| Shape | Who coordinates | What is isolated | Good for |
| --- | --- | --- | --- |
| Subagents | The main session delegates and receives results | Context window; files only if you ask for worktree isolation | Research, focused checks, contained edits where only the result matters |
| Independent sessions | You | Whatever you set up: ideally a worktree and branch each | Separate features or fixes that become separate pull requests |
| Agent teams | A lead session with a shared task list and messaging | Each teammate's context window | Parallel review, competing hypotheses, clearly partitioned new work |

**Subagents** run inside one session. Each gets its own context window and returns a summary to the caller, which keeps the main conversation clean. A custom subagent can be given `isolation: worktree` in its frontmatter so it edits in its own temporary worktree ([worktrees docs](https://code.claude.com/docs/en/worktrees#isolate-subagents-with-worktrees)).

**Independent sessions** are the plainest option: you open two terminals and run Claude Code in two checkouts. Claude Code can create the checkout for you with `claude --worktree <name>` (or `-w`), which by default makes a worktree under `.claude/worktrees/<name>/` on a new branch named `worktree-<name>`. You can also make the worktree yourself with git, as below, and run `claude` inside it.

**Agent teams** are experimental and disabled by default; you enable them with the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable. One session acts as lead, teammates share a task list and can message each other. The documentation is direct about the costs: more coordination overhead, significantly more tokens, and two teammates editing the same file leads to overwrites. It recommends starting with research and review rather than parallel implementation. That is good advice regardless of which tool you use.

If you are unsure, use independent sessions in worktrees. They are the most transparent: every change lands on a branch you can read, diff and throw away with ordinary git.

## Worktrees and isolated branches

A [git worktree](https://git-scm.com/docs/git-worktree) is a second working directory attached to the same repository. Each worktree has its own checked-out branch, its own index and its own files, while sharing history, objects and remotes. Two agents in two worktrees cannot overwrite each other's uncommitted edits, which is the failure you most want to rule out.

Create one worktree per task, each on a fresh branch from an up-to-date main:

```bash
git fetch origin
git worktree add -b feat/billing-page ../app-billing origin/main
git worktree add -b fix/login-redirect ../app-login origin/main
```

See what exists and where:

```bash
git worktree list
```

Remove a worktree when its branch is merged or abandoned:

```bash
git worktree remove ../app-billing
git branch -d feat/billing-page
git worktree prune
```

`git worktree remove` refuses if the worktree has uncommitted changes; that refusal is a feature. Add `--force` only after you have checked there is nothing worth keeping. `git branch -d` likewise refuses to delete a branch that is not merged.

Things a new worktree does not have:

- **Installed dependencies.** `node_modules`, virtual environments and build caches are not shared. Run your install step in each worktree, or expect the agent's first test run to fail.
- **Gitignored local files.** `.env.local` and similar files are absent. Claude Code can copy listed gitignored files into worktrees it creates via a `.worktreeinclude` file; with plain git, copy them yourself.
- **Free ports and databases.** Two dev servers on the same port, or two sessions migrating the same local database, will collide outside git. Give each worktree its own port, or decide in the brief which session owns the database.

A branch can be checked out in only one worktree at a time. If git refuses to check out a branch, `git worktree list` will tell you where it already lives.

## Ownership and shared context

Isolation keeps files apart. It does not keep decisions consistent. Two things do that: clear ownership, and shared context that every session reads.

### Name what each session owns

Give each session an explicit list of files or directories it may change, and say what it must not touch. "You own `app/billing/**` and `lib/billing.ts`; do not edit shared components, the database schema or `PRODUCT.md`" is short and does most of the work. When a session finds it needs to change something it does not own, the right move is to stop and report, not to make the change and mention it later.

Ownership by path is crude but checkable. At integration you can run:

```bash
git diff --stat origin/main...feat/billing-page
```

and see at once whether the branch stayed inside its lane.

### Put shared decisions where every session reads them

Each session starts without your conversation history. What they share is the repository: `CLAUDE.md`, and whatever product and design documents you keep (in keel's case `PRODUCT.md`, `DESIGN.md` and, where one exists, `ARCHITECTURE.md`). Decisions that every session must respect belong there, committed to main before the sessions start, not repeated in five slightly different briefs.

The brief for each session then carries only what is specific: the outcome, the files it owns, the constraints with their reasons, and what to report. [Directing and Reviewing AI Coding Agents](/guides/directing-and-reviewing-agents) covers writing those briefs.

## Shared dependencies and generated files

Some files are touched by almost every change and owned by none: lockfiles, generated types, snapshots, migration sequences, route manifests, changelogs. They are where parallel branches conflict most, and the conflicts are rarely interesting.

Decide up front how each one is handled:

- **Lockfiles.** Prefer that only one session adds or upgrades dependencies. If two branches both change `pnpm-lock.yaml`, do not merge the lockfile by hand. Take main's version and regenerate:

  ```bash
  git checkout origin/main -- pnpm-lock.yaml
  pnpm install
  git add pnpm-lock.yaml
  ```

  The same pattern works for `package-lock.json`, `Cargo.lock`, `poetry.lock` and similar: resolve the manifest, then let the tool rebuild the lock.

- **Generated files.** Regenerate them after integration rather than resolving their conflicts line by line. If they are committed, make regeneration a step in the integration checklist.
- **Migrations and other numbered sequences.** Two branches that each add "the next" migration will both be right in isolation and wrong together. Assign the work that changes the schema to one session, or renumber at integration and rerun the migrations from scratch locally.

## Integrating completed branches

Integration is where parallel work becomes one product again, and it is the step most worth doing slowly. Merge one branch at a time, in an order you choose on purpose: usually the branch others depend on first, then the smallest and least risky, then the rest.

### Rebase onto current main

Before merging, bring each branch up to date with what has already landed. Run this in the branch's own worktree, where it is already checked out (`git switch` to a branch fails while another worktree has it checked out):

```bash
git fetch origin && git rebase origin/main
```

If conflicts appear, git stops at each conflicting commit. Resolve the files, then `git add` them and `git rebase --continue`. `git rebase --abort` returns you to where you started if the resolution is going badly.

Two optional git features help when you resolve the same kinds of conflict repeatedly:

```bash
git config rerere.enabled true
```

`rerere` records how you resolved a conflict and reapplies the resolution when the same conflict appears again, which happens often when you rebase a branch more than once. To preview whether two branches will conflict at all without touching any working tree, recent versions of git (2.38 and later) offer:

```bash
git merge-tree --write-tree origin/main feat/billing-page
```

It prints conflicted files and exits non-zero if the merge would conflict.

### Check what the rebase changed

A rebase rewrites commits. After a difficult one, compare the branch before and after to confirm you changed only what you meant to:

```bash
git range-diff origin/main feat/billing-page@{1} feat/billing-page
```

`feat/billing-page@{1}` is the branch's previous position from the reflog. [`git range-diff`](https://git-scm.com/docs/git-range-diff) pairs up the old and new versions of each commit and shows how their diffs differ. An empty or trivial result means the rebase only moved the work; anything else is a change you should be able to explain.

### Review, then merge

Every branch gets reviewed as its own pull request, against the brief it was given, before it merges. Rebase first, then run the project's checks on the rebased branch, then review. Checks that passed on a stale base say little about the merged result.

Keep pull requests focused: one session's work, one purpose. A reviewer, human or agent, can judge a focused diff. A pull request that bundles three sessions' output asks the reviewer to untangle what the sessions already had separated.

## Changes to product and design documents

`PRODUCT.md`, `DESIGN.md` and `ARCHITECTURE.md` are shared context. They are also where parallel sessions do the most damage, because a conflict there is not about text.

When two branches both change one of these files, git will flag line overlaps, but the real conflict may sit on lines git considers clean: one branch narrows the audience while another adds a feature for the old audience. Text-level merges can succeed and still leave the document contradicting itself.

A few rules hold up:

- **Settle direction before the sessions start.** If a change of scope or audience is under discussion, decide it and commit it to main first ([preserve decisions without making them immutable](/principles#preserve-decisions-without-making-them-immutable)). Parallel sessions should build against settled context, not negotiate it.
- **Let at most one session change a given document.** Others can propose changes in their pull request description or report, for a person to apply.
- **Merge document changes by reading, not by resolving markers.** After integration, read the whole section that changed, not just the hunks.

When two sessions have made incompatible product decisions, no amount of rebasing resolves that. It is a human call: which audience, which tradeoff, which goal comes first. Agents can lay out the options and their consequences. The decision, and the edit to the document that records it, belongs to whoever is accountable for the product.

## Adapting for solo developers and small teams

For a solo developer, the main constraint is attention. A reasonable starting ceiling is the number of diffs you can still read in full; for many solo builders that is two. Beyond that, sessions finish faster than you can review them and either wait or get merged with a glance, which defeats the point.

A pattern that works well solo: one session implementing in a worktree, and a second session that reviews and doesn't edit the feature branch. The second session gives you an independent read on the first one's plan and results. keel's [/peer](/skills/peer) skill is built for that role, though any separate session briefed to review works.

For a small team, map sessions to people. Each person runs their own sessions on their own branches, and the team integrates through ordinary pull requests and review, just as it would without agents. The thing to add is a habit: when an agent's work changes shared context, the pull request says so plainly, so a teammate does not discover it at merge time.

## Failure modes

- **Parallel work on unsettled decisions.** Symptoms: branches that disagree about naming, scope or behaviour. Fix: stop, decide, commit the decision, restart the affected sessions.
- **Ownership drift.** A session "helpfully" edits a shared file. Symptoms: unexpected paths in `git diff --stat`. Fix: send it back, or move the change to the session that owns the file.
- **Stale bases.** Long-lived branches fall behind main and accumulate conflicts. Fix: keep branches short, rebase often, merge soon.
- **Review debt.** Work arrives faster than it is reviewed and gets merged on the strength of its summary. Fix: run fewer sessions. Throughput you cannot review is not throughput; directing, not producing, is [where the work now sits](/essays/the-art-of-building-with-agents#from-implementing-to-directing).
- **Environment collisions.** Shared ports, databases or caches outside git. Fix: per-worktree configuration, or one owner per shared resource.
- **Forgotten worktrees.** Old directories and branches pile up. Fix: `git worktree list` at the end of each integration, then remove what is done.

The underlying tradeoff does not change with the tooling. Parallel sessions buy wall-clock time and pay for it in coordination, integration and review. When the work is genuinely independent and the decisions are settled, that trade is good. When it is not, one focused session usually wins.

## Further reading

- [git-worktree](https://git-scm.com/docs/git-worktree): the reference for creating, listing, locking and removing worktrees.
- [git-range-diff](https://git-scm.com/docs/git-range-diff): how to compare two versions of a branch, for example before and after a rebase.
- [git-rebase](https://git-scm.com/docs/git-rebase) and [git-rerere](https://git-scm.com/docs/git-rerere): replaying commits onto a new base and reusing recorded conflict resolutions.
- [Claude Code: run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees): `--worktree`, `.worktreeinclude`, subagent isolation and cleanup.
- [Claude Code: agent teams](https://code.claude.com/docs/en/agent-teams): the experimental team feature, its comparison with subagents and its stated limitations.
- [Claude Code: common workflows](https://code.claude.com/docs/en/common-workflows): short recipes, including parallel sessions and delegating research to subagents.
