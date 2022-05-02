#!/bin/sh

docker build -t gcr.io/crystallography-io/crystallography-io-api .
docker push gcr.io/crystallography-io/crystallography-io-api
