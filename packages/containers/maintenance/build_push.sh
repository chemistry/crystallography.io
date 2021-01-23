#!/bin/sh

docker build -t gcr.io/crystallography-api/maintenance .
docker push gcr.io/crystallography-api/maintenance
