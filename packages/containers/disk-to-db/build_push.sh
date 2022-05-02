#!/bin/sh

docker build -t gcr.io/crystallography-io/disk-to-db .
docker push gcr.io/crystallography-io/disk-to-db
