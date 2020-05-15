#!/bin/sh
export GOOGLE_APPLICATION_CREDENTIALS="/usr/credentials.json"
echo $GCP_SA_KEY | base64 -d > $GOOGLE_APPLICATION_CREDENTIALS
echo $GCP_BOTO_KEY | base64 -d > /root/.boto
npm --prefix packages/containers/crystallography-api start
