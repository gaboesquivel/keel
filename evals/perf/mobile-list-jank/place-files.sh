#!/usr/bin/env bash
set -eu
# Builds the shared Duesy fixture, then adds the Expo mobile client as a later commit. Its
# dependencies are not installed and no device is attached, so scrolling cannot be measured here.
here="$(cd "$(dirname "$0")" && pwd)"
"$here/../../fixtures/setup.sh" "$PWD"
cp -R "$here/files/." .
export GIT_AUTHOR_NAME="Duesy Dev" GIT_AUTHOR_EMAIL="dev@example.test" GIT_COMMITTER_NAME="Duesy Dev" GIT_COMMITTER_EMAIL="dev@example.test"
git add mobile
GIT_AUTHOR_DATE="2026-11-12T10:00:00" GIT_COMMITTER_DATE="2026-11-12T10:00:00" git commit -qm "feat(mobile): overdue list in the Expo app"
