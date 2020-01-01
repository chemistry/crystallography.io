#!/bin/sh

# @TODO: check difference
# @TODO add iteration loop
docker build -t gcr.io/crystallography-api/containers-cod-to-git-sync -f packages/containers/cod-to-git-sync/Dockerfile .
docker push gcr.io/crystallography-api/containers-cod-to-git-sync
