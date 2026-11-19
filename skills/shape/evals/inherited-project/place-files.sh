#!/usr/bin/env bash
set -eu
# Builds the shared Duesy fixture (evals/fixtures) in the run directory.
"$(dirname "$0")/../../../../evals/fixtures/setup.sh" "$PWD" --no-product-doc
