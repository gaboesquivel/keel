#!/usr/bin/env bash
set -eu
# Shelf with its product direction and nothing built.
"$(dirname "$0")/../../fixtures/shelf/setup.sh" "$PWD" 0
