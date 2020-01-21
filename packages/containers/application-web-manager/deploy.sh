#!/bin/bash

docker build -t gcr.io/crystallography-api/application-web-manager -f Dockerfile ../../../
docker push gcr.io/crystallography-api/application-web-manager
gcloud run deploy application-web-manager \
    --project crystallography-api \
    --image gcr.io/crystallography-api/application-web-manager \
    --allow-unauthenticated \
    --region europe-west1 \
    --concurrency 20 \
    --timeout 10s \
    --platform managed
