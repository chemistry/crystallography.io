#!/bin/bash

RELEASE_SERVER_URL='https://data.crystallography-online.com/api/v1/releases'
STORAGE_HOST='storage.crystallography-online.com'

# Application meta information
APP_META=`cat ./dist/app.json`

# Get new version via Release API
RELEASE_RESPONSE=`curl -s -d "${APP_META}" -H "Content-Type: application/json" -X POST "${RELEASE_SERVER_URL}"`

echo "Recived response: ${RELEASE_VERSION}"

# Check for errors
RELEASE_VERSION=`echo $RELEASE_RESPONSE | jq -r '.data[0].attributes.version'`
RELEASE_APP=`echo $RELEASE_RESPONSE | jq -r '.data[0].attributes.id'`

if test -z "$RELEASE_VERSION"
then
      echo "${RELEASE_VERSION} not provided"
      exit 1
else
      echo "Releasing ${RELEASE_APP} with version: ${RELEASE_VERSION}"
fi

# Send Artifacts
gsutil cp -r ./dist "gs://${STORAGE_HOST}/${RELEASE_APP}/${RELEASE_VERSION}"

echo "Sucessfully released"
