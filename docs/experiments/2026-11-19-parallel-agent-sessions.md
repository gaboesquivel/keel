# Experiment: parallel agent sessions for Keel's editorial library

Date: 2026-11-19
Status: draft from contributor B's seat. The lead finalizes it.

Sections marked **Observed** record what contributor B saw directly. **Expected** marks assumptions or plans not yet confirmed. `TODO(lead):` marks what only the integrating lead can fill in.

## Objective

1. Publish Keel's first editorial content (principles, an essay, two guides) on the site.
2. Learn how several AI coding sessions collaborate on one repository through Git branches, worktrees and review, with a human-directed lead integrating.

## Setup

**Observed**

- Three contributor sessions (A, B, C) and one lead session. Contributor B wrote the two guides; A was assigned principles and the essay per the brief. C's assignment was not visible from B's seat.
- Contributor B ran in an isolated git worktree at `.claude/worktrees/agent-ad7385331f52986bd`, starting on branch `worktree-agent-ad7385331f52986bd` at `e34a24e`, and created branch `docs/keel-agent-guides` for its work.
- Contributor B's file ownership, as assigned by the lead:
  - `site/content/writing/guides/parallel-agent-sessions.md` (order 1)
  - `site/content/writing/guides/directing-and-reviewing-agents.md` (order 2)
  - this file
- Instructions to B: commit only owned files with Conventional Commits, do not push or open pull requests, the lead integrates.

## Shared context handed to contributors

**Observed** (from the lead's brief):

- Product direction is accepted and not to be changed: Keel as a free, open-source toolkit for product and engineering judgment, for technical solopreneurs, independent builders and small teams using AI coding agents. Humans direct; agents execute. Not an orchestration framework or mandatory methodology.
- Hard boundaries: no edits to `skills/**`, `skills.sh.json`, `evals/**`, CI, Vercel config or permissions; `PRODUCT.md` is read-only; no invented statistics, testimonials, quotes or achievements.
- Content contract: Markdown under `site/content/writing/`; flat `key: value` frontmatter (`title`, optional `subtitle`, `description` of at most 160 characters, `date`, optional `order`); no h1, sections from `##`; no raw HTML, images or footnotes; root-relative internal links; a closing `## Further reading` or `## Sources` section.
- Fixed slugs and routes: `/principles`, `/essays/the-art-of-building-with-agents`, `/guides/parallel-agent-sessions`, `/guides/directing-and-reviewing-agents`.

**Expected**: because ownership was split by file path and no two contributors share a file, B's branch should not produce text conflicts with A's. Conflicts, if any, are more likely in cross-links (a guide linking to a route another contributor owns) or in site code that renders the content, which B did not touch.

## Contributor B's work

**Observed**

- Read the brief, `PRODUCT.md`, `CLAUDE.md` and `skills/peer/SKILL.md` before writing.
- Verified Claude Code feature descriptions against the official docs (agent teams, worktrees, common workflows, best practices pages on code.claude.com) before stating them. Git commands are described from git's documented behaviour; the git reference pages were linked but not re-fetched.
- Did not build or render the site; the guides have not been checked in the running site from B's seat.
- Cross-links in B's guides point to `/skills/peer`, `/guides/parallel-agent-sessions` and `/guides/directing-and-reviewing-agents`.

## Integration

- TODO(lead): integration order of the contributor branches, and why.
- TODO(lead): conflicts encountered (text, cross-links, contract mismatches) and how each was resolved.
- TODO(lead): checks run on the integrated result (`npm run validate`, `pnpm qa`, `pnpm build` in `site/`, rendered pages) and their outcomes.
- TODO(lead): review findings, including any cross-review between contributors.

## Assessment

- TODO(lead): strengths of the parallel setup, with evidence.
- TODO(lead): weaknesses and failure modes observed.
- TODO(lead): what would be simpler next time (fewer sessions, different split, one session).
- TODO(lead): unknowns that this run could not settle.

No token counts, timings or human feedback are recorded here; none were measured from contributor B's seat.
