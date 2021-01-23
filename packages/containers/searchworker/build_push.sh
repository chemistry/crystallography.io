#!/bin/sh

docker build -t gcr.io/crystallography-api/searchworker .
docker push gcr.io/crystallography-api/searchworker
