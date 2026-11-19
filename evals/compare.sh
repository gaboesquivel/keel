#!/usr/bin/env bash
# Runs one eval case twice in fresh copies of its fixture: once as plain Claude Code (baseline, the
# prompt without the slash command) and once with the skill loaded and invoked (treatment).
# Usage: evals/compare.sh <skill> <case> <out-dir> [max-usd-per-run]
# Writes <out-dir>/<skill>/<case>/{baseline,treatment}/{run.jsonl,transcript.jsonl,status.json,changes.diff,project/}
# and <out-dir>/<skill>/<case>/status.json. The comparison is valid only if that file says
# "valid": true; the script exits 1 otherwise. See evals/README.md for what this does not isolate.
# Environment: EVAL_MODEL (default claude-opus-5-5); EVAL_TOOLS=default gives each run Claude
# Code's default tool set instead of the restricted one.
set -euo pipefail
repo="$(cd "$(dirname "$0")/.." && pwd)"
skill="$1"; case_name="$2"; out="$3"; cap="${4:-2.5}"
case_dir="$repo/evals/$skill/$case_name"
plugin="$repo/skills/$skill"
[ -f "$case_dir/prompt.md" ] || { echo "no case $skill/$case_name" >&2; exit 2; }
[ -f "$plugin/SKILL.md" ] || { echo "no skill $skill" >&2; exit 2; }
mkdir -p "$out"; out="$(cd "$out" && pwd)"
case_out="$out/$skill/$case_name"
[ -e "$case_out" ] && { echo "$case_out exists; use a new out-dir" >&2; exit 2; }
mkdir -p "$case_out"
config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

if [ "${EVAL_TOOLS:-}" = default ]; then tools=(--tools default)
else tools=(--tools Read Glob Grep Bash Write Edit Skill WebFetch); fi

# Prompt body: everything after the settings block.
prompt="$(awk 'n>=2{print} /^---$/{n++}' "$case_dir/prompt.md" | sed '/./,$!d')"
baseline_prompt="${prompt#/$skill }"

# Which name invokes this plugin's skill. A plugin skill is registered as <skill>:<skill>, and
# also as <skill> unless another skill already has that name: Claude Code has a built-in /design,
# so /design alone runs that one instead. Read the command list from the session's init event.
command="$(cd "$case_out" && printf 'Reply OK.' | claude -p --model claude-haiku-5-5 \
  --output-format stream-json --verbose --no-session-persistence --strict-mcp-config --tools "" \
  --max-budget-usd 0.05 --plugin-dir "$plugin" 2>/dev/null | head -n1 | node -e '
    const init = JSON.parse(require("fs").readFileSync(0, "utf8"))
    const [skill, plugin] = process.argv.slice(1)
    if (!init.plugins?.some((p) => p.path === plugin)) process.exit(1)
    const cmds = init.slash_commands ?? []
    const name = cmds.includes(`${skill}:${skill}`) ? `${skill}:${skill}` : cmds.includes(skill) ? skill : ""
    if (!name) process.exit(1)
    console.log(name)' "$skill" "$plugin")" || { echo "plugin $plugin did not load" >&2; exit 1; }
treatment_prompt="/$command ${prompt#/$skill }"

# Remove the empty project folder Claude Code creates for each working directory.
forget_project() {
  local p="$config_dir/projects/$(printf '%s' "$1" | sed 's#[^A-Za-z0-9]#-#g')"
  rmdir "$p/memory" "$p" 2>/dev/null || true
}
forget_project "$case_out"

run_arm() {
  local arm="$1" text="$2"; shift 2
  local dir="$case_out/$arm" code=0
  mkdir -p "$dir/project"
  (cd "$dir/project" && "$case_dir/place-files.sh")
  # The prompt goes in on stdin so it never appears in process arguments, where a run's own
  # `pkill -f` could match it. Sessions are persisted so the request log can be checked.
  (cd "$dir/project" && printf '%s' "$text" | claude -p --model "${EVAL_MODEL:-claude-opus-5-5}" \
    --output-format stream-json --verbose --strict-mcp-config "${tools[@]}" \
    --allowedTools Read Glob Grep Bash Write Edit Skill WebFetch \
    --max-budget-usd "$cap" "$@" > "$dir/run.jsonl" 2> "$dir/stderr.txt") || code=$?
  echo "$code" > "$dir/exit-code"
  # Move the session transcript out of the user's history into the run directory.
  local sid
  sid="$(head -n1 "$dir/run.jsonl" | node -e 'try{console.log(JSON.parse(require("fs").readFileSync(0,"utf8")).session_id??"")}catch{}')"
  if [ -n "$sid" ]; then
    for f in "$config_dir"/projects/*/"$sid".jsonl; do [ -f "$f" ] && mv "$f" "$dir/transcript.jsonl"; done
    for d in "$config_dir"/projects/*/"$sid"; do [ -d "$d" ] && mv "$d" "$dir/session"; done
  fi
  forget_project "$dir/project"
  # Stop any server the run left behind in its own project directory.
  for pid in $(pgrep -f "^node server.mjs" || true); do
    [ "$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')" = "$dir/project" ] && kill "$pid" 2>/dev/null || true
  done
  (cd "$dir/project" && git add -A -N . && git diff -- . ':!static/chart-lib.js') > "$dir/changes.diff" || true
  node "$repo/evals/check-run.mjs" "$dir" "$plugin/SKILL.md" "$arm" || return 1
}

# One arm at a time: runs pick their own ports and may stop servers, so concurrent runs interfere.
valid=true
run_arm baseline "$baseline_prompt" || valid=false
run_arm treatment "$treatment_prompt" --plugin-dir "$plugin" || valid=false
node -e '
  const fs = require("fs"), [dir, valid, command] = process.argv.slice(1)
  const arms = ["baseline", "treatment"].map((a) => { try { return JSON.parse(fs.readFileSync(`${dir}/${a}/status.json`, "utf8")) } catch { return { arm: a, ok: false, reasons: ["no status"] } } })
  fs.writeFileSync(`${dir}/status.json`, JSON.stringify({ valid: valid === "true" && arms.every((a) => a.ok), command: `/${command}`, arms }, null, 2) + "\n")' \
  "$case_out" "$valid" "$command"
if [ "$valid" = true ]; then echo "valid comparison: $case_out"; else echo "INVALID comparison, do not grade: $case_out" >&2; exit 1; fi
