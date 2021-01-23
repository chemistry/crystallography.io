#!/bin/sh

docker build -t gcr.io/crystallography-api/disk-to-db .
docker push gcr.io/crystallography-api/disk-to-db
