#!/bin/bash
set -euo pipefail

# Initial server setup for crystallography.io
# Run once to prepare the server before first deployment.
#
# Usage: ./scripts/setup-server.sh

DEPLOY_HOST="${DEPLOY_HOST:-116.203.122.153}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/showcase_ed25519}"
REMOTE_DIR="/opt/crystallography.io"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

ssh_cmd() {
  ssh -i "$SSH_KEY" "root@$DEPLOY_HOST" "$1"
}

# Step 1: Create directory
log "Creating $REMOTE_DIR..."
ssh_cmd "mkdir -p $REMOTE_DIR"

# Step 2: Verify volume mount
log "Checking volume mount..."
ssh_cmd "
  if mountpoint -q /mnt/data; then
    echo '/mnt/data is mounted'
    df -h /mnt/data
  else
    echo 'WARNING: /mnt/data is not mounted'
    echo 'Attempting to mount...'
    mount /mnt/data 2>/dev/null || echo 'Failed to mount. Check fstab and device.'
  fi
"

# Step 3: Create .env file
log "Creating .env file..."
if [ -z "${MONGO_PASSWORD:-}" ]; then
  MONGO_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
  echo "Generated MONGO_PASSWORD: $MONGO_PASSWORD"
fi
if [ -z "${REDIS_PASSWORD:-}" ]; then
  REDIS_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
  echo "Generated REDIS_PASSWORD: $REDIS_PASSWORD"
fi

ssh_cmd "cat > $REMOTE_DIR/.env << 'ENVEOF'
# MongoDB
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD
MONGO_INITDB_HOST=mongo

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# Sentry (optional)
SENTRY_DSN=

# Ports
API_PORT=8070
SEARCH_PORT=8050
WEB_PORT=3000
ENVEOF
chmod 600 $REMOTE_DIR/.env"

log ".env created at $REMOTE_DIR/.env"

# Step 4: Verify traefik-public network
log "Checking traefik-public network..."
ssh_cmd "
  docker network ls | grep -q traefik-public && echo 'traefik-public: exists' || \
  echo 'WARNING: traefik-public network not found. Traefik must be deployed first.'
"

# Step 5: Check CIF files
log "Checking CIF data..."
ssh_cmd "
  if [ -d /mnt/data/cif ]; then
    CIF_COUNT=\$(find /mnt/data/cif -name '*.cif' | wc -l)
    echo \"CIF files found: \$CIF_COUNT\"
    echo \"Disk usage: \$(du -sh /mnt/data/cif | cut -f1)\"
  else
    echo 'WARNING: /mnt/data/cif not found. Run rsync first:'
    echo '  rsync -avz rsync://www.crystallography.net/cif/ /mnt/data/cif/'
  fi
"

# Step 6: Summary
log "Server setup complete!"
echo ""
echo "Next steps:"
echo "  1. Ensure CIF files are synced:  rsync -avz rsync://www.crystallography.net/cif/ /mnt/data/cif/"
echo "  2. Build & push images:          docker compose build && docker compose push"
echo "  3. Deploy stack:                 ./scripts/deploy.sh"
echo "  4. Seed initial data:            ./scripts/deploy.sh --seed"
echo "  5. Monitor:                      ssh root@$DEPLOY_HOST 'docker stack services crystallography-io'"
