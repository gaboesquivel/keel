#!/usr/bin/env bash
set -eu
# Shelf with its product direction, nothing built, and a layer-by-layer plan from an agent.
"$(dirname "$0")/../../fixtures/shelf/setup.sh" "$PWD" 0
mkdir -p docs
cat > docs/agent-plan.md <<'PLAN'
# Implementation plan

Phase 1. Database: schema and migrations for users, households, tools, categories, photos, loans, messages, notifications and reviews.
Phase 2. API: REST endpoints for every entity, with authentication, pagination and filtering.
Phase 3. Frontend: all screens (onboarding, tool list, search, tool details, lending dashboard, messages, profile, settings).
Phase 4. Integration: connect the frontend to the API, end-to-end tests, then launch the pilot.
PLAN
git add docs && GIT_AUTHOR_NAME='Shelf Dev' GIT_AUTHOR_EMAIL=dev@example.test GIT_COMMITTER_NAME='Shelf Dev' GIT_COMMITTER_EMAIL=dev@example.test git commit -qm 'docs: implementation plan proposed by the agent'
