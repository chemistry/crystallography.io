#!/bin/sh

docker build -t gcr.io/crystallography-io/c14-web .
docker push gcr.io/crystallography-io/c14-web
