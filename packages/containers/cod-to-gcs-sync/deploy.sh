#!/bin/bash

docker build -t gcr.io/crystallography-api/containers-cod-to-gcs-sync -f Dockerfile ../../../
docker push gcr.io/crystallography-api/containers-cod-to-gcs-sync
