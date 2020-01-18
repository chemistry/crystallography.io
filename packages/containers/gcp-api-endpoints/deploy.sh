#!/bin/bash
PROJECT_ID='crystallography-api'
CLOUD_RUN_SERVICE_NAME='crystallography-api'

gcloud config set run/region europe-west1

gcloud endpoints services deploy openapi-functions.yaml --project ${PROJECT_ID} &> ./output1.txt

CLOUD_RUN_HOSTNAME=`cat output1.txt | egrep -o '\[c(.*)p\]'| sed -r 's/\[//g' | sed -r 's/\]//g'`
CONFIG_ID=`cat output1.txt | egrep -o '\[[0-9r-]*\]' | sed -r 's/\[//g' | sed -r 's/\]//g'`

./gcloud_build_image.sh -s "${CLOUD_RUN_HOSTNAME}" -c "${CONFIG_ID}" -p "${PROJECT_ID}"

NEW_IMAGE="gcr.io/${PROJECT_ID}/endpoints-runtime-serverless:${CLOUD_RUN_HOSTNAME}-${CONFIG_ID}"

echo "Deploying image to cloud RUN: ${NEW_IMAGE}"

gcloud run deploy crystallography-api \
  --image="${NEW_IMAGE}" \
  --allow-unauthenticated \
  --platform managed \
  --project="${PROJECT_ID}"
