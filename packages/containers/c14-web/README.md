# @chemistry/c14-web
[![GitHub Build Status](https://github.com/chemistry/c14-web/workflows/CI/badge.svg)](https://github.com/chemistry/c14-web/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Alternative Web UI for Crystallography Database search [crystallography.io](https://crystallography.io/)

## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-api/containers-crystallography-io-web .
```

Setting up cred environment variable
```bash
GCP_SA_KEY=`cat cred.json | base64 -w 0`
```

Execute container
```bash
docker run --rm -e GCP_SA_KEY=$GCP_SA_KEY -p 8080:8080 --name web gcr.io/crystallography-api/containers-crystallography-io-web
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-crystallography-io-web
```
## Required environment variables
    GCP_SA_KEY

## Commands:
  * Serve project: `npm run serve`
  * Build project: `npm run build`
