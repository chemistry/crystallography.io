#!/bin/sh

docker build -t gcr.io/crystallography-io/search-router .
docker push gcr.io/crystallography-io/search-router
