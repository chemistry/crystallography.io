# @chemistry/graphql-api
[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

GraphQL API for Crystallography io website
## Commands
Build Container
```bash
docker build -t gcr.io/crystallography-io/graphql-api .
```

Execute container
```bash
docker run --rm --name api gcr.io/crystallography-io/graphql-api
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/graphql-api
```

## Commands:
  * Build project: `npm run build`
  * Local Development `npm run nodemon`
