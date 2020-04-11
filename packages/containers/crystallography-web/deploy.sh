#!/bin/bash

docker build -t gcr.io/crystallography-api/crystallography-web -f Dockerfile ../../../
docker push gcr.io/crystallography-api/crystallography-web
gcloud run deploy crystallography-web \
    --project crystallography-api \
    --image gcr.io/crystallography-api/crystallography-web \
    --allow-unauthenticated \
    --region europe-west1 \
    --concurrency 20 \
    --timeout 10s \
    --platform managed
