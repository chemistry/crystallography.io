#!/bin/sh

docker build -t gcr.io/crystallography-io/web . && docker push gcr.io/crystallography-io/web
