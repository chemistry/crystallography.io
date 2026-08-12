#!/usr/bin/env bash
#
# Post-deploy commit-assert: every public HTTP surface must serve the pushed sha.
#
# Env contract:
#   COMMIT_SHA  - required, full 40-char sha the deploy is expected to serve
#   DEPLOY_HOST - required, swarm node IP; TLS SNI stays crystallography.io
#
# Fail-closed: any surface that never reports COMMIT_SHA fails the run.

set -euo pipefail

: "${COMMIT_SHA:?COMMIT_SHA is required (full sha of the deployed commit)}"
: "${DEPLOY_HOST:?DEPLOY_HOST is required (host the deployed stack answers on)}"

ATTEMPTS=30
DELAY=10
SHORT="${COMMIT_SHA:0:8}"

# Every surface bakes COMMIT_SHA into its v1 health envelope
# (specs/health-endpoints.md): .data.version = full sha, .data.commit = 7-char.
verify() {
  local name="$1" path="$2" live=""
  local i
  for ((i = 1; i <= ATTEMPTS; i++)); do
    live=$(curl -sfk --resolve "crystallography.io:443:${DEPLOY_HOST}" \
      "https://crystallography.io${path}" 2>/dev/null | jq -r '.data.version // empty') || true
    if [ "$live" = "$COMMIT_SHA" ]; then
      echo "PASS  ${name} ${path} serving ${SHORT}"
      return 0
    fi
    echo "  attempt ${i}/${ATTEMPTS} ${name}: got ${live:-no response}, want ${SHORT}"
    if [ "$i" -lt "$ATTEMPTS" ]; then sleep "$DELAY"; fi
  done
  echo "::error::FAIL  ${name} ${path} never served ${SHORT}"
  return 1
}

echo "Verifying deployment of ${SHORT} via ${DEPLOY_HOST}..."

fail=0
verify web /hc || fail=1
verify api /api/health || fail=1
verify searchrouter /api/v1/search/health || fail=1

if [ "$fail" -ne 0 ]; then
  echo "::error::Deployment verification FAILED for ${SHORT}"
  exit 1
fi

echo "All surfaces serving ${SHORT}"
