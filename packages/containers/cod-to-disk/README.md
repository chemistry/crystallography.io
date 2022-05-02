# @chemistry/cod-to-disk

[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Synchronize information from COD database and store to disk

## Commands

Build Container

```bash
cd ../../../ && docker build -t gcr.io/crystallography-io/cod-to-disk -f packages/containers/cod-to-disk/Dockerfile .
```

Execute container

```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-io/cod-to-disk
```

Push container to GCP

```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/cod-to-disk
```

## Local Commands

* Build project: `npm run build`
