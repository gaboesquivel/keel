#!/usr/bin/env bash
set -eu
# Builds the shared Duesy fixture, then adds the Duesy MCP server as a later commit.
here="$(cd "$(dirname "$0")" && pwd)"
"$here/../../fixtures/setup.sh" "$PWD"
cp -R "$here/files/." .
export GIT_AUTHOR_NAME="Duesy Dev" GIT_AUTHOR_EMAIL="dev@example.test" GIT_COMMITTER_NAME="Duesy Dev" GIT_COMMITTER_EMAIL="dev@example.test"
git add mcp-server.mjs lib/crm.mjs
GIT_AUTHOR_DATE="2026-11-14T10:00:00" GIT_COMMITTER_DATE="2026-11-14T10:00:00" git commit -qm "feat(mcp): overdue_summary tool for AI assistants"
