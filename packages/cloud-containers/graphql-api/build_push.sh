#!/bin/sh

docker build -t gcr.io/crystallography-io/graphql-api . && docker push gcr.io/crystallography-io/graphql-api
