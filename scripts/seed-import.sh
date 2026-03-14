#!/bin/bash
set -euo pipefail

# Seed import script for crystallography.io
# Scans existing CIF files on disk and queues them to RabbitMQ
# for processing by disk-to-db workers.
#
# Usage: Run inside a container or on the server with access to
#        RabbitMQ and the CIF data directory.
#
#   docker run --rm --network crystallography-io_net \
#     -v /mnt/data:/home/data \
#     node:22-alpine sh -c "apk add --no-cache curl && /home/data/seed-import.sh"
#
# Or via the dedicated seed-import service:
#   docker stack deploy -c docker-compose.seed.yaml crystallography-io

RABBITMQ_HOST="${RABBITMQ_HOST:-rabbitmq}"
RABBITMQ_PORT="${RABBITMQ_PORT:-5672}"
RABBITMQ_API_PORT="${RABBITMQ_API_PORT:-15672}"
DATA_PATH="${DATA_PATH:-/home/data/cif}"
QUEUE_NAME="COD_FILE_CHANGED"
BATCH_SIZE=50

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Wait for RabbitMQ to be ready
log "Waiting for RabbitMQ at $RABBITMQ_HOST:$RABBITMQ_API_PORT..."
for i in $(seq 1 30); do
  if curl -sf "http://$RABBITMQ_HOST:$RABBITMQ_API_PORT/api/overview" -u guest:guest > /dev/null 2>&1; then
    break
  fi
  sleep 2
done

# Declare queue via RabbitMQ HTTP API
curl -sf -X PUT "http://$RABBITMQ_HOST:$RABBITMQ_API_PORT/api/queues/%2F/$QUEUE_NAME" \
  -u guest:guest \
  -H "Content-Type: application/json" \
  -d '{"durable": true}' > /dev/null

log "Queue $QUEUE_NAME ready"

# Count total files
TOTAL=$(find "$DATA_PATH" -name "*.cif" | wc -l)
log "Found $TOTAL CIF files in $DATA_PATH"

# Process files in batches
COUNT=0
BATCH="[]"
BATCH_COUNT=0

find "$DATA_PATH" -name "*.cif" | sort | while read -r filepath; do
  # Extract COD ID from filename (e.g., /home/data/cif/1/55/28/1552862.cif -> 1552862)
  filename=$(basename "$filepath" .cif)
  relpath=${filepath#"$DATA_PATH/"}

  # Build batch JSON
  if [ "$BATCH_COUNT" -eq 0 ]; then
    BATCH="[{\"fileName\":\"$filepath\",\"codId\":\"$filename\"}"
  else
    BATCH="$BATCH,{\"fileName\":\"$filepath\",\"codId\":\"$filename\"}"
  fi
  BATCH_COUNT=$((BATCH_COUNT + 1))

  if [ "$BATCH_COUNT" -ge "$BATCH_SIZE" ]; then
    BATCH="$BATCH]"

    # Publish to RabbitMQ via HTTP API
    PAYLOAD=$(echo "$BATCH" | python3 -c "
import sys, json, base64
msg = sys.stdin.read()
print(json.dumps({
  'properties': {},
  'routing_key': '$QUEUE_NAME',
  'payload': msg,
  'payload_encoding': 'string'
}))
" 2>/dev/null || echo "{\"properties\":{},\"routing_key\":\"$QUEUE_NAME\",\"payload\":$(echo "$BATCH" | sed 's/"/\\"/g'),\"payload_encoding\":\"string\"}")

    curl -sf -X POST "http://$RABBITMQ_HOST:$RABBITMQ_API_PORT/api/exchanges/%2F/amq.default/publish" \
      -u guest:guest \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD" > /dev/null

    COUNT=$((COUNT + BATCH_SIZE))
    BATCH_COUNT=0
    BATCH="[]"

    if [ $((COUNT % 5000)) -eq 0 ]; then
      log "Queued $COUNT / $TOTAL files ($(( COUNT * 100 / TOTAL ))%)"
    fi
  fi
done

# Send remaining batch
if [ "$BATCH_COUNT" -gt 0 ]; then
  BATCH="$BATCH]"
  PAYLOAD=$(echo "$BATCH" | python3 -c "
import sys, json, base64
msg = sys.stdin.read()
print(json.dumps({
  'properties': {},
  'routing_key': '$QUEUE_NAME',
  'payload': msg,
  'payload_encoding': 'string'
}))
" 2>/dev/null)

  curl -sf -X POST "http://$RABBITMQ_HOST:$RABBITMQ_API_PORT/api/exchanges/%2F/amq.default/publish" \
    -u guest:guest \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" > /dev/null

  COUNT=$((COUNT + BATCH_COUNT))
fi

log "Seed import complete: $COUNT files queued to $QUEUE_NAME"
