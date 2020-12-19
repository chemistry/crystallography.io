#!/bin/sh
export GOOGLE_APPLICATION_CREDENTIALS="/usr/credentials.json"
echo $GCP_SA_KEY | base64 -d > $GOOGLE_APPLICATION_CREDENTIALS
node /app/packages/swarm/scheduler/dist/index.js
