#!/usr/bin/env bash
set -eu
# Builds the shared Duesy fixture, then commits a micro-optimisation of the dashboard rows with
# before-and-after timings whose difference is within the run-to-run variation.
here="$(cd "$(dirname "$0")" && pwd)"
"$here/../../fixtures/setup.sh" "$PWD"
node -e '
const fs = require("fs")
let s = fs.readFileSync("server.mjs", "utf8")
const start = s.indexOf("  const rows = items.map((i) => `<tr>")
const end = s.indexOf("`).join(\x27\x27)\n", start) + "`).join(\x27\x27)\n".length
if (start < 0 || end < start) throw new Error("dashboard rows not found")
const body = s.slice(start, end).replace("  const rows = items.map((i) => `<tr>", "  let rows = \x27\x27\n  for (const i of items) {\n    rows += `<tr>").replace(/`\)\.join\(\x27\x27\)\n$/, "`\n  }\n")
fs.writeFileSync("server.mjs", s.slice(0, start) + body + s.slice(end))'
cp -R "$here/files/." .
export GIT_AUTHOR_NAME="Duesy Dev" GIT_AUTHOR_EMAIL="dev@example.test" GIT_COMMITTER_NAME="Duesy Dev" GIT_COMMITTER_EMAIL="dev@example.test"
git add server.mjs ops/perf-dashboard.md
GIT_AUTHOR_DATE="2026-11-17T10:00:00" GIT_COMMITTER_DATE="2026-11-17T10:00:00" git commit -qm "perf(dashboard): build rows in a for loop"
