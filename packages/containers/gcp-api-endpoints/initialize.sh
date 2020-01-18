#!/bin/bash
PROJECT_ID='crystallography-api'

gcloud config set run/region europe-west1
gcloud run deploy crystallography-api \
    --image="gcr.io/endpoints-release/endpoints-runtime-serverless:2" \
    --allow-unauthenticated \
    --platform managed \
    --project="${PROJECT_ID}"

gcloud endpoints services deploy openapi-functions.yaml --project crystallography-api

# Service Configuration [2020-01-15r1] uploaded for service [crystallography-api-6q6gddw3pa-ew.a.run.app]
# To manage your API, go to: https://console.cloud.google.com/endpoints/api/crystallography-api-6q6gddw3pa-ew.a.run.app/overview?project=crystallography-api

gcloud services enable servicemanagement.googleapis.com
gcloud services enable servicecontrol.googleapis.com
gcloud services enable endpoints.googleapis.com


./gcloud_build_image.sh -s crystallography-api-6q6gddw3pa-ew.a.run.app -c 2020-01-15r1 -p crystallography-api

gcloud run deploy crystallography-api --image="gcr.io/crystallography-api/endpoints-runtime-serverless:crystallography-api-6q6gddw3pa-ew.a.run.app-2020-01-15r1" --allow-unauthenticated --platform managed --project=crystallography-api

## https://us-central1-crystallography-api.cloudfunctions.net/test-function-1
