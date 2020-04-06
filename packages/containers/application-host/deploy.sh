#!/bin/bash

docker build -t gcr.io/crystallography-api/application-host -f Dockerfile ../../../
docker push gcr.io/crystallography-api/application-host
gcloud run deploy application-host \
    --project crystallography-api \
    --image gcr.io/crystallography-api/application-host \
    --allow-unauthenticated \
    --region europe-west1 \
    --concurrency 20 \
    --timeout 10s \
    --platform managed
