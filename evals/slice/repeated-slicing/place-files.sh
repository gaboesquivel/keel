#!/usr/bin/env bash
set -eu
# Shelf with browsing and borrow requests shipped, the earlier plan, and pilot notes.
"$(dirname "$0")/../../fixtures/shelf/setup.sh" "$PWD" 2 --notes
