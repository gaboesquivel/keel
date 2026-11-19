#!/usr/bin/env bash
set -eu
# Builds the shared Duesy fixture (evals/fixtures) in the run directory.
"$(dirname "$0")/../../fixtures/setup.sh" "$PWD"
