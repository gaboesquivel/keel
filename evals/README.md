# Evaluations

These cases check whether a keel skill does better than plain Claude Code on the same request. They are not a required check. Rerun them after a model change or a change to a skill's behavior. They live outside `skills/`, so `npx skills add` never installs them.

## Layout

- `<skill>/<case>/`: one comparison case: `prompt.md` (settings block, then the prompt, which starts with `/<skill>`), `case.yaml` (expected outcome), `graders/*.md` (one expectation each) and `place-files.sh` (builds the project the run starts in).
- `fixtures/`: Duesy, a small invoice-reminder app that every case shares. `setup.sh` builds a fresh copy with git history.
- `compare.sh`: runs one case as a baseline and as a treatment.
- `check-run.mjs`: decides whether a single arm's run can be used.
- `results/`: local output, gitignored.

## Running a comparison

```bash
evals/compare.sh <skill> <case> <out-dir> [max-usd-per-run]
```

The script runs the arms one after the other, each in a fresh fixture copy under `<out-dir>`. The default cap is $2.50 per run, and the runs are billed.

- **Baseline:** the prompt without the slash command.
- **Treatment:** the same prompt with the skill loaded through `--plugin-dir skills/<skill>` and invoked by its slash command.

Set `EVAL_MODEL` to change the model (default `claude-opus-5-5`). Set `EVAL_TOOLS=default` to give both arms Claude Code's default tool set instead of the restricted one (Read, Glob, Grep, Bash, Write, Edit, Skill, WebFetch). Use the default set when the question involves tools the restricted set hides.

A comparison counts only if `<out-dir>/<skill>/<case>/status.json` says `"valid": true`. Otherwise the script exits 1. An arm is rejected when any of these holds:

- Claude exits non-zero.
- The stream has no final `result` event, which means the run was interrupted or crashed.
- The run ends in anything other than `success`, for example `error_max_budget_usd` or `error_max_turns`.
- The treatment's own API requests don't contain every line of the skill's `SKILL.md`, or the slash command was not recognised.
- The baseline's requests do contain the skill.

These checks read the session transcript. `compare.sh` moves it from `~/.claude/projects/` into the arm's directory, so test sessions don't show up in your history.

**Invocation.** A plugin skill is registered as `<skill>:<skill>`. It gets the bare name `<skill>` only when no other command already has that name. Claude Code ships its own `/design`, which creates claude.ai artifacts, so under `--plugin-dir`, `/design` runs that skill and not keel's. Before each comparison, `compare.sh` reads the session's command list and invokes `/<skill>:<skill>` when it exists, and the transcript check confirms which instructions were actually sent. A normal install into `.claude/skills/design` takes the bare `/design` name ahead of the built-in skill.

**Grading** is manual. Hand each pair, blinded as A/B, to a grader with the case's `graders/*.md` as the expectations and a clean fixture copy for checking claims. Skill-creator's `agents/comparator.md` works for this. Grade only valid pairs.

## Formats

The case folders follow the format of `claude plugin eval`: `case.yaml` or `prompt.md`, plus `graders/*.md`. That command looks for cases below the plugin itself (`<plugin>/evals/` or `--eval-dir`), and keel keeps them out of the skill folders, so it can't run them from here without copying them in. On the machine that produced the first results, its sandbox also blocked local servers, headless Chrome and Xcode's `git`, which most cases need.

Anthropic's skill-creator uses a different format: a single `evals/evals.json` inside the skill folder, where each eval has `prompt`, `expected_output`, `files` and `expectations`. It does not read these case folders. Only its grader and comparator agent instructions are reused here.

## What is and isn't isolated

- **Isolated:**
  - Each arm starts in its own fixture copy outside this repository, so the repository's `CLAUDE.md` is not loaded.
  - `--strict-mcp-config` removes MCP servers.
  - Arms run one at a time, because cases that start the app would otherwise collide on ports.
- **Not isolated:**
  - Both arms run as you, with your user-level Claude Code environment: global `CLAUDE.md`, user and built-in skills, auth and permission settings.
  - Skills symlinked into `~/.claude/skills` (for example `peer` and `shape`) are visible to the baseline too. They are slash-only, and the baseline check confirms they were not sent.
- **Not a sandbox:**
  - Allowing Bash means a run can read and write anything your user can, use the network, and start or stop processes outside its fixture copy.
  - `compare.sh` only stops servers that a run left running in its own directory.
  - Treat a run as you would an unattended agent on your machine.
- **Private data in results:** transcripts and results contain your environment, including global instructions and account details. Keep them local; `results/` is gitignored.
- **No variance:** one run per arm shows no variance. Treat narrow wins as ties until repeated.

## First evaluation (2026-11-19)

The first evaluation used Opus 5.5 and Claude Code 2.1.317, with one run per arm and a blind comparison by a Claude subagent. It cost about $14. The skills' author wrote the fixture, the prompts and the expectations. The full report is in the local `results/2026-11-19/REVIEW.md`, which is not in git.

| Skill | Result |
|---|---|
| `perf` | Clearest value: it stayed diagnostic when asked "what's going on?". The baseline added indexes nobody asked for. On "make it faster", both were correct; the skill's change was smaller and the baseline's was faster. |
| `ux` | Clearest value: it changed no code and labelled what it had reproduced. In both cases the baseline rewrote files without being asked, and made false claims along the way. |
| `retro` | One win: it avoided claiming an effect the data can't show. Otherwise close to the baseline. |
| `shape`, `peer` | Narrow wins or ties. Opus 5.5 already respects documented non-goals and catches the planted review flaws. |
| `design` | **Not measured.** Rechecked on 2026-11-19 with the same CLI version and flags: `/design` under `--plugin-dir` runs Claude Code's built-in artifact skill, not keel's. That explains the four claude.ai artifacts and the missing rendered check. The original transcripts were not kept, so this is a reproduction, not a direct reading of those runs. A rerun with keel's skill actually invoked (`/design:design`) and Claude Code's default tools, including `Artifact`, used no artifact tool in either case. It implemented the empty state in code and critiqued from screenshots at two viewports. That was one run per arm, not yet graded. |

Limitations:

- One run per arm.
- One fixture.
- The author also judged, and the grader is from the same model family as the runs.
- The `ux` prompts don't say whether fixes are wanted.
- Both arms shared the operator's user environment.
- The runner of that time counted runs without checking how they ended.

The graders have since been corrected:

- The ✉ button does have an accessible name: its glyph.
- The `design` graders now require a rendered browser view; fetching HTML does not count.

So the numbers above are a rough baseline for comparison, not a measurement.
