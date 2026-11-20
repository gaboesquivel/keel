#!/usr/bin/env bash
set -eu
# Shelf with browsing and borrow requests shipped and the earlier plan, but no usage evidence.
"$(dirname "$0")/../../fixtures/shelf/setup.sh" "$PWD" 2
