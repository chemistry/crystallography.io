#!/bin/sh

export GOOGLE_APPLICATION_CREDENTIALS=/app/creds.json
echo $GCP_SA_KEY | base64 -d >> /app/creds.json
npm start

