#!/bin/sh

docker build -t docker push gcr.io/crystallography-io/graphql-api . && docker push gcr.io/crystallography-io/graphql-api
