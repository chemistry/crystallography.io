#!/bin/sh

docker build -t gcr.io/crystallography-api/cod-to-disk .
docker push gcr.io/crystallography-api/cod-to-disk
