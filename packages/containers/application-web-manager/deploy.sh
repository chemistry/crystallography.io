#!/bin/bash

docker build -t gcr.io/crystallography-api/application-web-manager -f Dockerfile ../../../
docker push gcr.io/crystallography-api/application-web-manager
gcloud beta run deploy application-web-manager --image gcr.io/crystallography-api/application-web-manager:latest --region europe-west1 --concurrency 20 --timeout 10s --platform managed --quiet
