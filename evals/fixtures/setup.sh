#!/usr/bin/env bash
# Builds a disposable copy of the Duesy fixture with git history, for skill evaluations.
# Usage: setup.sh <dest> [--no-product-doc] [--agent-branch] [--start-server]
# --start-server prints the app URL on stdout; the server stops itself after 45 minutes.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="$1"; shift
no_product=0; agent_branch=0; start_server=0
for arg in "$@"; do
  case "$arg" in
    --no-product-doc) no_product=1 ;;
    --agent-branch) agent_branch=1 ;;
    --start-server) start_server=1 ;;
    *) echo "unknown option $arg" >&2; exit 2 ;;
  esac
done

mkdir -p "$dest"
cp -R "$here/invoice-app/." "$dest/"
cd "$dest"
[ "$no_product" = 1 ] && rm -f PRODUCT.md

# A large vendored script that no page uses yet (loaded with defer).
node -e '
const lines=["/* chart-lib 3.1.0 (vendored). Loaded with defer; not used by any page yet: kept for the planned cash-flow chart. */","(function(g){var registry={};"];
for(let i=0;i<4200;i++) lines.push(`registry["series_${i}"]=function(d){return d.map(function(x,j){return {x:j,y:(x*${(i%97)+1})%1000,label:"point-${i}-"+j}})};`);
lines.push("g.ChartLib={register:function(k,f){registry[k]=f},get:function(k){return registry[k]}}})(window);");
require("fs").writeFileSync("static/chart-lib.js",lines.join("\n")+"\n")'

export GIT_AUTHOR_NAME="Duesy Dev" GIT_AUTHOR_EMAIL="dev@example.test" GIT_COMMITTER_NAME="Duesy Dev" GIT_COMMITTER_EMAIL="dev@example.test"
commit() { GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -qm "$2"; }
git init -q -b main .
git add -A -- . ':!lib' ':!test' ':!docs' ':!ops' ':!jobs'
commit "2026-03-02T10:00:00" "feat: overdue list with one-click email reminders"
git add lib/csv-import.mjs
commit "2026-05-04T10:00:00" "feat: import clients from CSV"
git add lib/reminders test docs jobs
commit "2026-07-06T10:00:00" "feat(reminders): automatic reminders through pluggable channels (ADR 0003)"
git add ops
commit "2026-11-10T10:00:00" "chore(ops): weekly metrics, incidents and usage notes"

if [ "$agent_branch" = 1 ]; then
  git switch -q -c agent/client-rate-limit
  cp -R "$here/agent-branch/." .
  git add -A
  commit "2026-11-18T16:00:00" "feat(reminders): rate limit reminders per client"
  git switch -q main
fi

if [ "$start_server" = 1 ]; then
  nohup node server.mjs > ../"$(basename "$dest")".server.log 2>&1 &
  for _ in $(seq 1 40); do
    url="$(grep -o 'http://[^ ]*' ../"$(basename "$dest")".server.log 2>/dev/null || true)"
    [ -n "$url" ] && { echo "$url"; exit 0; }
    sleep 0.25
  done
  echo "server did not start" >&2; exit 1
fi
