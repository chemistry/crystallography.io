# @chemistry/c14-api
[![GitHub Build Status](https://github.com/chemistry/c14-api/workflows/CI/badge.svg)](https://github.com/chemistry/c14-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Open API for accessing COD+ database [crystallography.io](https://crystallography.io/)
## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-api/crystallography-io-api .
```

Setting up cred environment variable
```bash
GCP_SA_KEY=`cat cred.json | base64 -w 0`
```

Execute container
```bash
docker run --rm -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD -e GCP_SA_KEY=$GCP_SA_KEY -e MONGO_INITDB_HOST=$MONGO_INITDB_HOST --name api gcr.io/crystallography-api/crystallography-io-api
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/crystallography-io-api
```

## Required environment variables
    MONGO_INITDB_ROOT_USERNAME
    MONGO_INITDB_ROOT_PASSWORD
    MONGO_INITDB_HOST
## Commands:
  * Build project: `npm run build`
  * Local Development `npm run nodemon`
