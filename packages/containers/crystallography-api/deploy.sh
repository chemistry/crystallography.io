#!/bin/bash

docker build -t gcr.io/crystallography-api/crystallography-api -f Dockerfile ../../../
docker push gcr.io/crystallography-api/crystallography-api
gcloud run deploy crystallography-api \
    --project crystallography-api \
    --image gcr.io/crystallography-api/crystallography-api \
    --allow-unauthenticated \
    --set-env-vars ES_KEY=$(echo $ES_KEY),GCP_SA_KEY=$(echo $GCP_SA_KEY),GCP_BOTO_KEY=$(echo $GCP_BOTO_KEY) \
    --region europe-west1 \
    --concurrency 20 \
    --timeout 10s \
    --platform managed
