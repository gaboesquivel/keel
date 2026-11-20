# Experiment: parallel agent sessions for keel's editorial library

Date: 2026-11-19. Contributor B drafted this record and the lead finalized it after integration. It is a candid account of a single run, not a benchmark.

**Observed** marks what the lead or a contributor saw directly. **Expected** marks a prediction made beforehand. Nothing here is human feedback: the reviews were written by AI contributors and are critique, not validation.

## Objective

1. Publish keel's first editorial content on the site: the Principles page, the essay *The Art of Building with Agents*, and two guides.
2. Learn how several AI coding sessions collaborate on one repository using Git branches, worktrees, cross-review and deliberate integration, with a lead session directing.

## Setup

**Observed**

- **Sessions:** one lead and three contributors, all in a single Claude Code session in the desktop app. The human set the direction and authorized the run, then was away.
- **Harness:**
  - Claude Code's experimental agent teams feature was not available in this environment; no team tools were exposed. The fallback was the native Agent tool with `isolation: worktree`: three background subagents, each in its own worktree under `.claude/worktrees/`.
  - Cross-review and follow-up fixes used `SendMessage` to resume the same subagent, so it kept its context.
  - No custom agent definitions, orchestration packages or persistent configuration were created.
- **Contributors:** all three used the general-purpose agent type on the default model.

| Contributor | Role | Branch | Owned files |
| --- | --- | --- | --- |
| A | Product philosopher, editorial author | `docs/keel-principles` | `site/content/writing/principles.md`, `site/content/writing/essays/the-art-of-building-with-agents.md` |
| B | Engineering educator | `docs/keel-agent-guides` | `site/content/writing/guides/*.md`, this file |
| C | Editorial web engineer | `feat/site-editorial-library` | site code, `site/README.md`, the Website section of `CLAUDE.md`, one note in `DESIGN.md` |

- **Worktree branches:** the harness created each worktree on an auto-named branch (`worktree-agent-<id>`). Each contributor then created its own branch from it, as instructed.

## The shared contract

Before launching anyone, the lead read `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`, `site/README.md` and the site's content pipeline. It then wrote one short brief that every contributor received. The brief held:

- the product direction,
- the boundaries: no changes to `skills/**`, `evals/**`, `skills.sh.json`, `PRODUCT.md`, CI or Vercel config,
- the content contract: Markdown under `site/content/writing/`, flat frontmatter (`title`, `subtitle`, `description`, `date`, `order`), no h1, root-relative internal links, and fixed slugs.

Contributor C built the renderer against that contract without ever seeing the real writing. It tested with throwaway samples pointed to by `KEEL_WRITING_DIR`, and never wrote into `site/content/writing/`.

**Expected:** the split by file path would mean no text conflicts. Any risk would come from cross-links and from mismatches between the contract and the renderer.

## Cross-review

The lead asked each author to critique the other's work from a different perspective, read-only. Then each author applied the findings the lead accepted to its own files. The lead did the product-founder pass itself.

- **A reviewed B's guides as editorial reviewer.** 10 findings plus cross-link suggestions.
  - Accepted:
    - A real bug: the rebase example ran `git switch` to a branch that was already checked out in another worktree, and that command fails.
    - Lowercase "keel", which the guides had capitalized.
    - A misstatement: /peer does not remove write access.
    - Softer wording on several frequency claims that had no evidence behind them.
    - Removing a "20 years of experience" strawman prompt that could read as mocking the author.
    - Cross-links to the principles and the essay.
  - Partly accepted: A asked B to re-verify its Claude Code claims. B had already checked them against the docs, so the lead accepted only the wording changes ("environment variable", "as of November 2026").
  - Rejected: merging two overlapping sections. It was a nit and not worth a restructure.
- **B reviewed A's principles and essay as staff engineer.** 12 findings, none must-fix.
  - Accepted:
    - Toning down claims about agent speed ("in minutes, tested and documented").
    - Rewording "agents verify" to "verify when given a check to run". Unqualified, the claim contradicted the essay's own evidence principle.
    - Hedging a trait the drafts presented four times as if all agents always over-engineer.
    - Missing skill links.
    - A clause for builders who don't have users yet.
  - Rejected: re-checking chapter URLs that A had already fetched.
- **Where the perspectives differed:** the editorial reviewer pushed on tone, brand casing, and claims that sound like data. The staff-engineer reviewer pushed on overstatements of what agents do. Neither found invented quotes or statistics. The two reviews didn't contradict each other. Each found things the other perspective would probably have missed.
- **Lead's product-founder pass:** both pieces state their intent and audience clearly. The repeated Statement / Why / In practice / Example labels on the Principles page risk feeling formulaic. They were kept because the brief asked for that structure.

## Integration

**Observed**

- **Order:**
  1. Site (C): it builds with no writing present, so it could merge first and make every later step renderable.
  2. Principles and essay (A).
  3. Guides and this record (B). B's links point at A's anchors, so A had to land first.
- **Local rehearsal:** before opening any PR, the lead merged all three branches onto a scratch branch from `main` and ran every check there.
- **Conflicts:** none in text. No two branches touched the same file. The cross-links B added to A's anchors (`/principles#evidence-over-assumptions` and others) resolved on the first try, because the lead gave B the exact slug rule in the fix request. A browser check confirmed every internal link and `#anchor` across the four pieces.
- **The contract held.** All four pieces passed C's strict build validation on the first build: required fields, at most 160-character descriptions, no h1, a valid date.
- **Checks on the integrated result:**
  - `npm run validate`: Catalog OK, 7 skills.
  - `npm test`: passing.
  - `pnpm qa` in `site/`: lint, types, 39 tests.
  - `pnpm build`: 23 static pages.
- **Rendered checks** (the lead, built-in browser, `next start`):
  - Every new route returns 200 and has exactly one h1.
  - Canonical URLs are present.
  - No horizontal overflow at 375px on any new page or the homepage.
  - Screenshots were inspected at 1440px (essay; principles anchor jump), 390px (guide with code blocks) and 375px (homepage section and mobile menu).
  - The skip link receives the first keyboard focus, with a visible outline.
- **PRs:** [#21](https://github.com/gaboesquivel/keel/pull/21) (site), [#22](https://github.com/gaboesquivel/keel/pull/22) (principles and essay), and a third for the guides and this record. They were squash-merged in that order.

## Usage and time

Source: the harness's task-completion notifications for each subagent. Caveats:

- The token figures appear cumulative per subagent across resumes. Durations appear to be per run for some notifications and cumulative for others, so treat them as rough.
- The lead session's own usage was not reported and is not included.
- These are subscription usage figures, not billing.

| Contributor | Tokens (last notification) | Tool uses | Last reported duration |
| --- | --- | --- | --- |
| A | 109,875 | 25 | 338 s |
| B | 144,343 | 6 (last run) | 97 s (last run; first run 189 s) |
| C | 160,362 | 81 | 467 s |

Wall clock (lead's shell `date`):

- 21:32 CST: contributors launched.
- About 21:40: integrated checks running.
- 21:41: first PR opened.

## Assessment

**What worked**

- Splitting ownership by file path, plus a contract written before launch, removed merge conflicts entirely. The engineer built the renderer blind and the content fit.
- The writing and the site code ran truly in parallel. The longest contributor (C) set the critical path, at about 8 minutes.
- Resuming the same subagent for cross-review, and then for fixes, was cheap. Each review took one run, and the reviewer already knew the brief.
- Read-only cross-review found a real bug (the `git switch` in a worktree) and several overclaims that the authors hadn't caught.

**What was weak**

- The independence was limited. All three contributors were the same model with the same brief, so this was "different prompts", not different people.
- The reviews were AI critique. No human has validated the writing.
- Cross-linking needed a lead round-trip. B couldn't see A's headings until A finished, so the lead relayed the slug rule. A shared list of anchor names in the contract would have avoided it.
- The harness's auto-named worktree branches (`worktree-agent-<id>`) were left behind next to the named branches, which adds clutter.
- Contributor C's copy (the homepage section, index-page descriptions) got no cross-review, only the lead's look.

**Simpler next time**

- Two contributors would have been enough: one writer for all four pieces, and the site engineer. The two writers' styles needed to match anyway, and the cross-review could have been one read-only reviewer.
- Put the heading/anchor plan for linked pieces into the contract up front.
- Skip the local integration rehearsal when the file sets are provably disjoint. Merging the PRs in order gives the same signal.

**Unknowns**

- Whether readers find the writing useful. No readers have seen it yet.
- Whether the same split holds up when contributors must change shared files (navigation, `PRODUCT.md`). This run avoided that by design.
- How the token cost compares with one session doing all of it. Nothing was measured for that baseline.
