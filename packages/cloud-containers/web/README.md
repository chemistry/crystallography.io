# @chemistry/web
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Web UI for Crystallography Database Search [crystallography.io](https://crystallography.io/)
Cloud version

## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-io/web .
```

Execute container
```bash
docker run --rm --name api gcr.io/crystallography-io/web
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/web
```

## Commands:
  * Serve project: `npm run serve`
  * Build project: `npm run build`
