#!/bin/sh

docker build -t gcr.io/crystallography-io/searchworker .
docker push gcr.io/crystallography-io/searchworker
