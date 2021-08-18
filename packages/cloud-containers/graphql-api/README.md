# @chemistry/graphql-api
[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-io/graphql-api .
```

Setting up cred environment variable
```bash
GCP_SA_KEY=`cat cred.json | base64 -w 0`
```

Execute container
```bash
docker run --rm -e GCP_SA_KEY=$GCP_SA_KEY --name api gcr.io/crystallography-io/graphql-api
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/graphql-api
```

## Required environment variables

    GCP_SA_KEY

## Commands:
  * Build project: `npm run build`
  * Local Development `npm run nodemon`
