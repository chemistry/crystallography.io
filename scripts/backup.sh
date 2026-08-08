#!/bin/bash
# Back up the crystallography mongo to the Hetzner Storage Box.
#
# Runs ON the side host, invoked by .github/workflows/backup.yml over ssh.
# Storage Box access is the host's own root ssh key plus the `storagebox-backup`
# alias in /root/.ssh/config, both provisioned by agentage/infrastructure - so
# no backup credential is passed in from the workflow and none is stored here.
#
# NOT BACKED UP: /mnt/data/cif, the 111GB CIF store. It is rebuildable from COD
# upstream via .github/workflows/sync-cod.yml, which is the documented recovery
# path. This dump is the derived index over those files - restoring it without
# the CIFs gives you a searchable catalogue whose structure files are missing,
# so a full recovery is: re-run sync-cod, then restore this dump.
#
# History comes from the Storage Box's 10 automated daily snapshots, which no
# VM can reach or delete. That is why one "latest" artifact is kept rather than
# a dated series that would need its own prune.
set -euo pipefail

STACK="${STACK:-crystallography-io}"
SERVICE="${SERVICE:-mongo}"
SPOOL="${SPOOL:-/var/backups/crystallography-io}"
REMOTE="${REMOTE:-storagebox-backup}"
REMOTE_DIR="${REMOTE_DIR:-repo/crystallography/mongo}"
MARKER_DIR="${MARKER_DIR:-/var/lib/backup-status}"
# Guards against shipping a truncated archive as if it were good. The dump sat
# at ~2.0GB compressed on 2026-08-08; an order of magnitude under that means
# the dump died early.
MIN_BYTES="${MIN_BYTES:-1000000000}"

log() { printf '%s %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
fail() {
  log "FAILED: $*"
  echo "result: failed"
  exit 1
}

# The box's restricted shell rejects a compound --rsync-path (exit 12), so
# parent directories are pre-created over sftp instead. The '-' prefix makes
# sftp continue past an already-exists error; without it the batch aborts on the
# first existing parent and the leaf is never created.
ensure_remote_dir() {
  local acc=""
  local IFS='/'
  for part in $1; do
    [ -n "$part" ] || continue
    acc="${acc}${part}/"
    printf -- '-mkdir %s\n' "$acc"
  done | sftp -q -b - "$REMOTE" >/dev/null 2>&1 || true
}

# Collected first, then filtered: piping straight into `grep -m1` lets grep exit
# on the first match and SIGPIPE the producer, which under `set -o pipefail`
# fails the whole command.
running="$(docker ps --format '{{.Names}}')"
container="$(printf '%s\n' "$running" | grep -m1 "^${STACK}_${SERVICE}\." || true)"
[ -n "$container" ] || fail "no running container matching ${STACK}_${SERVICE}"
log "source container: ${container}"

# 2GB of archive plus whatever else lives here - refuse early rather than fill
# the root filesystem and take the site down with it.
avail="$(df --output=avail -k / | tail -1)"
[ "$avail" -ge 6000000 ] || fail "only ${avail}KB free on / - refusing to spool a ~2GB dump"

mkdir -p "$SPOOL"
out="$SPOOL/mongo-latest.archive.gz"

# WHY a sidecar container and not `docker exec`: exec runs mongodump inside
# mongod's own cgroup, so its buffers count against the service memory limit.
# `--network container:` shares only the network namespace, so the dump gets its
# own memory budget.
img="$(docker inspect "$container" --format '{{.Config.Image}}')"
MONGO_U="$(docker inspect "$container" --format '{{range .Config.Env}}{{println .}}{{end}}' |
  sed -n 's/^MONGO_INITDB_ROOT_USERNAME=//p' | head -1)"
MONGO_P="$(docker inspect "$container" --format '{{range .Config.Env}}{{println .}}{{end}}' |
  sed -n 's/^MONGO_INITDB_ROOT_PASSWORD=//p' | head -1)"
export MONGO_U MONGO_P

log "mongodump ${container} -> ${out}"
# Credentials are passed by NAME to `docker -e` so the values never appear on a
# command line or in the process table.
docker run --rm --network "container:${container}" --memory 512m \
  -e MONGO_U -e MONGO_P "$img" \
  sh -c 'set -- --host 127.0.0.1 --numParallelCollections=1 --archive --gzip;
         [ -n "$MONGO_U" ] && set -- "$@" --username "$MONGO_U" --password "$MONGO_P" --authenticationDatabase admin;
         exec mongodump "$@"' >"${out}.tmp"

size="$(stat -c %s "${out}.tmp")"
[ "$size" -ge "$MIN_BYTES" ] || fail "archive is ${size} bytes, under the ${MIN_BYTES} floor - dump likely truncated"

# gzip integrity: a torn archive still has a plausible size.
gzip -t "${out}.tmp" 2>/dev/null || fail "archive fails gzip integrity check"

mv -f "${out}.tmp" "$out"
log "dump ok, ${size} bytes"

ensure_remote_dir "$REMOTE_DIR"
log "rsync ${SPOOL}/ -> ${REMOTE}:${REMOTE_DIR}/"
rsync -az --delete -e ssh "$SPOOL/" "${REMOTE}:${REMOTE_DIR}/" || fail "rsync failed"

# Read by the host-side staleness watchdog, which is what catches "the workflow
# silently stopped running" - a failure mode a workflow cannot report on itself.
mkdir -p "$MARKER_DIR"
printf '%s bytes=%s remote=%s\n' \
  "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$size" "${REMOTE_DIR}" \
  >"${MARKER_DIR}/crystallography-mongo"

# Asserted by the workflow. Keep the format stable.
echo "result: ok artifacts=1 bytes=${size}"
