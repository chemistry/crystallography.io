#!/bin/sh

docker build -t gcr.io/crystallography-io/c14-next-web .
docker push gcr.io/crystallography-io/c14-next-web
