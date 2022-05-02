#!/bin/sh

docker build -t gcr.io/crystallography-io/cod-to-disk .
docker push gcr.io/crystallography-io/cod-to-disk
