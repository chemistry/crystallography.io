#!/bin/sh

docker build -t gcr.io/crystallography-api/structure-to-index .
docker push gcr.io/crystallography-api/structure-to-index
