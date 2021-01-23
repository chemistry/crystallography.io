#!/bin/sh

docker build -t gcr.io/crystallography-api/c14-web .
docker push gcr.io/crystallography-api/c14-web
