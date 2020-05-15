# @chemistry/crystallography-api
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

API for accessing COD database [crystallography.io](https://crystallography.io/)

# Endpoints path:
 - GET: api/v1/structures?page=x

## Quick Start
  * ```export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"```- Set environment variable
  * ```npm run start``` - Start Application
  * ```npm run build``` - Build Application

## Commands

Execute container
```bash
docker run --rm -e GCP_SA_KEY="..." --name crystallography-api/crystallography-api
```

Prepare $GCP_SA_KEY env varible
```
cat credentials.json | base64 >> credentials.base64.json
```

## Commands:
  * Build project: `npm run build`
