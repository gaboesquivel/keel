#!/usr/bin/env bash
# Builds a disposable copy of the Shelf fixture with git history, for skill evaluations.
# Usage: setup.sh <dest> <stage> [--notes]
#   stage 0: product direction only, nothing built
#   stage 1: browsing tools and tool details shipped
#   stage 2: borrow requests shipped as well, with the earlier delivery plan in docs/plan.md
#   --notes: adds pilot notes with usage evidence (ops/notes.md)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="$1"; stage="$2"; shift 2
notes=0
for arg in "$@"; do
  case "$arg" in
    --notes) notes=1 ;;
    *) echo "unknown option $arg" >&2; exit 2 ;;
  esac
done
case "$stage" in 0|1|2) ;; *) echo "stage must be 0, 1 or 2" >&2; exit 2 ;; esac

mkdir -p "$dest"; cd "$dest"
export GIT_AUTHOR_NAME="Shelf Dev" GIT_AUTHOR_EMAIL="dev@example.test" GIT_COMMITTER_NAME="Shelf Dev" GIT_COMMITTER_EMAIL="dev@example.test"
commit() { git add -A; GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -qm "$2"; }
git init -q -b main .
cp -R "$here/direction/." .
commit "2026-09-28T10:00:00" "docs: product direction for Shelf"
if [ "$stage" -ge 1 ]; then
  cp -R "$here/browse/." .
  commit "2026-10-13T10:00:00" "feat: browse tools on Alder Street and open a tool's details"
fi
if [ "$stage" -ge 2 ]; then
  cp -R "$here/borrow/." .
  commit "2026-10-27T10:00:00" "feat: ask to borrow a tool; lenders see requests on /requests"
fi
if [ "$notes" = 1 ]; then
  cp -R "$here/notes/." .
  commit "2026-11-17T10:00:00" "docs(ops): pilot notes after three weeks of borrow requests"
fi
