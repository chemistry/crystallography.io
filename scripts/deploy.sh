#!/bin/bash
set -euo pipefail

# Deploy crystallography.io stack to Docker Swarm
# Usage: ./scripts/deploy.sh [--seed]
#
# Prerequisites:
#   - SSH access to DEPLOY_HOST
#   - Docker Swarm initialized with traefik-public network
#   - /mnt/data volume mounted with CIF files
#   - .env file at /opt/crystallography.io/.env

DEPLOY_HOST="${DEPLOY_HOST:-116.203.122.153}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/showcase_ed25519}"
REMOTE_DIR="/opt/crystallography.io"
STACK_NAME="crystallography-io"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Parse arguments
RUN_SEED=false
for arg in "$@"; do
  case $arg in
    --seed) RUN_SEED=true ;;
  esac
done

ssh_cmd() {
  ssh -i "$SSH_KEY" "root@$DEPLOY_HOST" "$1"
}

# Step 1: Prepare server directory
log "Preparing server directory..."
ssh_cmd "mkdir -p $REMOTE_DIR"

# Step 2: Copy docker-compose.yaml to server
log "Copying docker-compose.yaml..."
scp -i "$SSH_KEY" docker-compose.yaml "root@$DEPLOY_HOST:$REMOTE_DIR/docker-compose.yaml"

# Step 3: Verify prerequisites
log "Verifying prerequisites..."
ssh_cmd "
  echo '=== Volume ===' && \
  mountpoint -q /mnt/data && echo '/mnt/data: mounted' || (echo 'ERROR: /mnt/data not mounted' && exit 1) && \
  echo '=== CIF files ===' && \
  CIF_COUNT=\$(find /mnt/data/cif -name '*.cif' 2>/dev/null | wc -l) && \
  echo \"CIF files: \$CIF_COUNT\" && \
  echo '=== .env ===' && \
  [ -f $REMOTE_DIR/.env ] && echo '.env: exists' || (echo 'ERROR: $REMOTE_DIR/.env missing' && exit 1) && \
  echo '=== Traefik network ===' && \
  docker network ls | grep -q traefik-public && echo 'traefik-public: exists' || (echo 'ERROR: traefik-public network missing' && exit 1) && \
  echo '=== Disk ===' && \
  df -h /mnt/data && \
  df -h /
"

# Step 4: Pull latest images and deploy stack
log "Deploying stack..."
ssh_cmd "
  cd $REMOTE_DIR && \
  docker stack deploy -c docker-compose.yaml $STACK_NAME --with-registry-auth
"

# Step 5: Wait for services to start
log "Waiting for services to stabilize..."
sleep 15

# Step 6: Check service status
log "Service status:"
ssh_cmd "docker stack services $STACK_NAME"

# Step 7: Run seed import if requested
if [ "$RUN_SEED" = true ]; then
  log "Running seed import..."
  scp -i "$SSH_KEY" scripts/seed-import.sh "root@$DEPLOY_HOST:$REMOTE_DIR/seed-import.sh"
  ssh_cmd "chmod +x $REMOTE_DIR/seed-import.sh"

  ssh_cmd "
    docker run --rm \
      --network ${STACK_NAME}_net \
      -v /mnt/data:/home/data \
      -v $REMOTE_DIR/seed-import.sh:/seed-import.sh \
      -e RABBITMQ_HOST=rabbitmq \
      -e RABBITMQ_PORT=5672 \
      -e DATA_PATH=/home/data/cif \
      node:22-alpine sh -c 'apk add --no-cache curl python3 && sh /seed-import.sh'
  "
fi

log "Deployment complete!"
log "Stack: $STACK_NAME"
log "Services: $(ssh_cmd "docker stack services $STACK_NAME --format '{{.Name}}' | wc -l") running"
