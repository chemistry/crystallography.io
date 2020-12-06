#!/bin/bash

docker build -t gcr.io/crystallography-api/containers-cod-to-disk -f Dockerfile ../../../
docker push gcr.io/crystallography-api/containers-cod-to-disk
