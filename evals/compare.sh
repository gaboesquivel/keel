#!/usr/bin/env bash
# Runs one eval case twice in fresh copies of its fixture: once as plain Claude Code (baseline, the
# prompt without the slash command) and once with the skill loaded and invoked (treatment).
# Run one case at a time: cases that start the fixture app interfere when run concurrently.
# Usage: evals/compare.sh <skill> <case> <out-dir> [max-usd-per-run]
# Writes <out-dir>/<skill>/<case>/{baseline,treatment}/{run.jsonl,changes.diff,project/}.
# These are real, billed model runs. Each run gets only file, shell and fetch tools (no MCP servers,
# no publishing tools), so it cannot act outside its fixture copy beyond what Bash allows.
set -euo pipefail
repo="$(cd "$(dirname "$0")/.." && pwd)"
skill="$1"; case_name="$2"; out="$3"; cap="${4:-2.5}"
case_dir="$repo/skills/$skill/evals/$case_name"
[ -f "$case_dir/prompt.md" ] || { echo "no case $skill/$case_name" >&2; exit 2; }

# Prompt body: everything after the settings block.
prompt="$(awk 'n>=2{print} /^---$/{n++}' "$case_dir/prompt.md" | sed '/./,$!d')"
baseline_prompt="${prompt#/$skill }"

run_arm() {
  local arm="$1" text="$2"; shift 2
  local dir="$out/$skill/$case_name/$arm"
  [ -e "$dir" ] && { echo "$dir exists; use a new out-dir" >&2; return 1; }
  mkdir -p "$dir/project"
  (cd "$dir/project" && "$case_dir/place-files.sh")
  # The prompt goes in on stdin so it never appears in process arguments, where a run's own
  # `pkill -f` could match it.
  (cd "$dir/project" && printf '%s' "$text" | claude -p --model "${EVAL_MODEL:-claude-opus-5-5}" \
    --output-format stream-json --verbose --no-session-persistence --strict-mcp-config \
    --tools Read Glob Grep Bash Write Edit Skill WebFetch \
    --allowedTools Read Glob Grep Bash Write Edit Skill WebFetch \
    --max-budget-usd "$cap" "$@" > "$dir/run.jsonl" 2> "$dir/stderr.txt") || true
  # Stop any server the run left behind in its own project directory.
  for pid in $(pgrep -f "^node server.mjs" || true); do
    [ "$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')" = "$dir/project" ] && kill "$pid" 2>/dev/null || true
  done
  (cd "$dir/project" && git add -A -N . && git diff -- . ':!static/chart-lib.js') > "$dir/changes.diff" || true
}

# One arm at a time: runs pick their own ports and may stop servers, so concurrent runs interfere.
run_arm baseline "$baseline_prompt"
run_arm treatment "$prompt" --plugin-dir "$repo/skills/$skill"
