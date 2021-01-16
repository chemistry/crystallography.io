# @chemistry/structure-to-index
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Triggered on structure change - update all required indexes

## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-api/structure-to-index .
```

Execute container
```bash
docker run --rm --name structure-to-index gcr.io/crystallography-api/structure-to-index
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/structure-to-index
```

## Commands:
  * Build project: `npm run build`
