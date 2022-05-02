#!/bin/sh

docker build -t gcr.io/crystallography-io/maintenance .
docker push gcr.io/crystallography-io/maintenance
