#!/bin/bash
# Back up the crystallography mongo to the estate backup disk at /backup.
#
# Runs ON the side host, invoked by .github/workflows/backup.yml over ssh.
# /backup is the estate's shared Storage Box, CIFS-mounted read-write on every
# VM by agentage/infrastructure - so no backup credential is passed in from the
# workflow and none is stored here.
#
# The layout, the mount guard, the manifest and the summary line are the estate
# backup contract (agentage/infrastructure docs/backup-contract.md). Only the
# dump command below is specific to this repo.
#
# NOT BACKED UP: /mnt/data/cif, the 111GB CIF store. It is rebuildable from COD
# upstream via .github/workflows/sync-cod.yml, which is the documented recovery
# path. This dump is the derived index over those files - restoring it without
# the CIFs gives you a searchable catalogue whose structure files are missing,
# so a full recovery is: re-run sync-cod, then restore this dump.
#
# History is the dated directories on /backup, pruned centrally by
# infrastructure, plus the Storage Box's 10 daily snapshots, which no VM can
# reach or delete. This script only ever adds - it deletes nothing on /backup.
set -euo pipefail

STACK="${STACK:-crystallography-io}"
SERVICE="${SERVICE:-mongo}"
BACKUP_SERVICE="${BACKUP_SERVICE:-crystallography-mongo}"
BACKUP_ROOT="${BACKUP_ROOT:-/backup}"
DATASET_DB="${DATASET_DB:-crystallography}"
SPOOL="${SPOOL:-/var/backups/crystallography-io}"
# Guards against shipping a truncated archive as if it were good. The dump sat
# at ~2.0GB compressed on 2026-08-08; an order of magnitude under that means
# the dump died early.
MIN_BYTES="${MIN_BYTES:-1000000000}"

started="$(date -u +%s)"

log() { printf '%s %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
fail() {
  log "FAILED: $*"
  echo "backup failed service=${BACKUP_SERVICE}"
  exit 1
}

# THE FIRST LINE OF WORK IS THE MOUNT GUARD. An unmounted /backup is an ordinary
# empty directory on the root filesystem: a backup would write there, report
# success, fill the root disk and be gone on the next boot. `mountpoint -q` is
# not enough - /backup is an autofs point, so it answers 0 even while the CIFS
# mount is down.
ls "$BACKUP_ROOT" >/dev/null 2>&1 || true # first access wakes the automount
findmnt -t cifs --mountpoint "$BACKUP_ROOT" >/dev/null ||
  { echo "::error::${BACKUP_ROOT} cifs mount is down"; exit 1; }

date_utc="$(date -u +%F)"
dest="${BACKUP_ROOT}/${date_utc}/${BACKUP_SERVICE}"
archive_name="mongo.archive.gz"

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
out="$SPOOL/${archive_name}"
dumplog="$SPOOL/mongodump.log"

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
# stderr goes to a file rather than a pipe because it is read back for the
# per-collection counts; it is echoed afterwards so the run log still has it.
docker run --rm --log-driver none --network "container:${container}" --memory 512m \
  -e MONGO_U -e MONGO_P "$img" \
  sh -c 'set -- --host 127.0.0.1 --numParallelCollections=1 --archive --gzip;
         [ -n "$MONGO_U" ] && set -- "$@" --username "$MONGO_U" --password "$MONGO_P" --authenticationDatabase admin;
         exec mongodump "$@"' >"${out}.tmp" 2>"$dumplog" || {
  cat "$dumplog" >&2
  fail "mongodump failed"
}
cat "$dumplog" >&2

size="$(stat -c %s "${out}.tmp")"
[ "$size" -ge "$MIN_BYTES" ] || fail "archive is ${size} bytes, under the ${MIN_BYTES} floor - dump likely truncated"

# gzip integrity: a torn archive still has a plausible size.
gzip -t "${out}.tmp" 2>/dev/null || fail "archive fails gzip integrity check"

mv -f "${out}.tmp" "$out"
log "dump ok, ${size} bytes"

# The counts mongodump already reports, kept as the manifest's `records`. A dump
# against an empty database produces plausible files and sizes - only the counts
# say the data is gone.
# mongodump quotes the namespace in backticks, so they are stripped first.
counts="$(tr -d '`' <"$dumplog" |
  sed -n 's/.*done dumping \([^ ]*\)[[:space:]]*(\([0-9][0-9]*\) document.*/\1 \2/p')"
collections="$(printf '%s' "$counts" | grep -c . || true)"
[ "$collections" -gt 0 ] || fail "mongodump reported no collections - refusing to record an empty backup"

# Counted for the dataset's own database, not across every namespace: the dump
# also carries admin.system.*, whose handful of documents would otherwise mask a
# crystallography database that came back empty.
docs="$(printf '%s\n' "$counts" | awk -v db="${DATASET_DB}." '
  index($1, db) == 1 { t += $2 } END { print t + 0 }')"
[ "$docs" -gt 0 ] || fail "mongodump found no documents in ${DATASET_DB} across ${collections} collection(s)"
log "dumped ${collections} collection(s), ${docs} document(s) in ${DATASET_DB}"

sha_src="$(sha256sum "$out" | cut -d' ' -f1)"

mkdir -p "$dest"
log "copy ${out} -> ${dest}/${archive_name}"
cp -f "$out" "${dest}/${archive_name}" || fail "copy to ${dest} failed"

# Read back from the backup disk, not from the spool: this is the only check
# that the bytes which survived the CIFS write are the bytes that were dumped.
dest_size="$(stat -c %s "${dest}/${archive_name}")"
[ "$dest_size" = "$size" ] || fail "copy is ${dest_size} bytes on /backup, dumped ${size}"
sha_dest="$(sha256sum "${dest}/${archive_name}" | cut -d' ' -f1)"
[ "$sha_dest" = "$sha_src" ] || fail "sha256 on /backup does not match the dump"
log "verified on ${BACKUP_ROOT}: ${dest_size} bytes, sha256 ${sha_dest}"

# manifest.json is written LAST and is the success marker: a directory without
# one is a failed run, so it must not appear until everything above has passed.
# Keyed by the full db.collection namespace: the dump spans more than one
# database, and bare collection names would collide across them.
records="$(printf '%s\n' "$counts" | awk 'NF { printf "    \"%s\": %s,\n", $1, $2 }')"
cat >"${dest}/manifest.json" <<JSON
{
  "schema": 1,
  "service": "${BACKUP_SERVICE}",
  "at": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "host": "$(hostname)",
  "files": [
    { "name": "${archive_name}", "bytes": ${dest_size}, "sha256": "${sha_dest}" }
  ],
  "bytes": ${dest_size},
  "records": {
${records}
    "collections": ${collections}
  },
  "duration_s": $(($(date -u +%s) - started))
}
JSON
log "manifest written: ${dest}/manifest.json"

# Asserted by the workflow. Keep the format stable.
echo "backup ok service=${BACKUP_SERVICE} date=${date_utc} bytes=${dest_size} files=1"
