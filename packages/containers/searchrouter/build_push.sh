#!/bin/sh

docker build -t gcr.io/crystallography-api/search-router .
docker push gcr.io/crystallography-api/search-router
