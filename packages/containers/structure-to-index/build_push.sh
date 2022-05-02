#!/bin/sh

docker build -t gcr.io/crystallography-io/structure-to-index .
docker push gcr.io/crystallography-io/structure-to-index
