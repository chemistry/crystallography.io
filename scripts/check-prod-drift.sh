#!/usr/bin/env bash
# Emits drift=true when live prod serves a different commit than master HEAD.
# Closes the path-filter gap: root-only commits never fire deploy.yml on push.
set -euo pipefail

head=$(git rev-parse HEAD)
live=$(curl -sf --max-time 15 "https://crystallography.io/hc" | jq -r '.data.version // empty') || true

if [ -z "$live" ]; then
  # unreachable prod is a deploy problem, not a quiet week - let deploy.yml surface it
  echo "prod /hc unreachable - treating as drift" >&2
  echo "drift=true"
  exit 0
fi

if [ "$live" = "$head" ]; then
  echo "prod on-commit (${live:0:8})" >&2
  echo "drift=false"
else
  echo "prod serves ${live:0:8}, master is ${head:0:8}" >&2
  echo "drift=true"
fi
