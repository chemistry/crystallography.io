# @chemistry/disk-to-db
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Get updated structures from disk and store to MongoDB database

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/cod-to-disk -f packages/containers/disk-to-db/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/disk-to-db
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/disk-to-db
```

## Commands:
  * Build project: `npm run build`
