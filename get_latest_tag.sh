#!/bin/bash
# Based on https://github.com/GoogleCloudPlatform/serverless-expeditions/blob/main/terraform-serverless/scripts/get_latest_tag.sh

PROJECT=$1
IMAGE=$2

# deep JSON is invalid for terraform, so serve flat value
LATEST=$(gcloud container images describe gcr.io/${PROJECT}/${IMAGE}:latest  --format="value(image_summary.fully_qualified_digest)" | tr -d '\n')
echo "{\"image\": \"${LATEST}\"}"
