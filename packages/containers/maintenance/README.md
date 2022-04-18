# @chemistry/maintenance

[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Set of maintenance tasks scheduled regularly (e.g. index recalculation)

## Commands

Build Container

```bash
docker build -t gcr.io/crystallography-io/maintenance .
```

Execute container

```bash
docker run --rm -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD -e MONGO_INITDB_HOST=$MONGO_INITDB_HOST --name maintenance gcr.io/crystallography-io/maintenance
```

Push container to GCP

```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/maintenance
```

## Local Commands

* Build project: `npm run build`
