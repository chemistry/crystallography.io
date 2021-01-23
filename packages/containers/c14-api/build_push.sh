#!/bin/sh

docker build -t gcr.io/crystallography-api/crystallography-io-api .
docker push gcr.io/crystallography-api/crystallography-io-api
