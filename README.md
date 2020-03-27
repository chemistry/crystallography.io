# Crystallography API
[![Release version](https://img.shields.io/github/v/release/chemistry/crystallography-api?color=green.svg)](https://github.com/chemistry/crystallography-api/releases)
[![Codecov](https://codecov.io/gh/chemistry/crystallography-api/branch/master/graph/badge.svg)](https://codecov.io/gh/chemistry/crystallography-api)
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

API Support [COD Web UI](http://crystallography-online.com/)

## Include Packages:
### Containers:
  * [@chemistry/cod-to-gcs-sync](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/cod-to-gcs-sync) - Synchronize COD with Google Cloud Storage
  * [@chemistry/gcp-api-endpoints](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/gcp-api-endpoints) - API Endpoint that execute cloud functions
  * [@chemistry/application-web-manager](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/application-web-manager) - Main Application Host that serve applications

### Functions:
  * [@chemistry/cod-sync-start-instance](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/cod-sync-start-instance) - Start VM for COD Synchronization execution (labels.codsync eq true)
  * [@chemistry/cod-sync-stop-instance](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/cod-sync-stop-instance) - Stop VM for what finished Synchronization execution
  * [@chemistry/gcs-to-database](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/gcs-to-database) - Read CIF file from storage and save to database;
  * [@chemistry/api-get-structures-list](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/api-get-structures-list) - API Get Structures List
  * [@chemistry/api-releases-get](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/api-releases-get) - API Get Last Application Releases

### Libraries:
  * [@chemistry/common-functions](https://github.com/chemistry/crystallography-api/tree/master/packages/libraries/common-functions) - Common code shared across cloud function
  * [@chemistry/cif-2-json](https://github.com/chemistry/crystallography-api/tree/master/packages/libraries/cif-2-json) - Library for conversion of CIF to JSON

### Applications:
  * [@chemistry/cod-search](https://github.com/chemistry/crystallography-api/tree/master/packages/applications/cod-search) - Cod Search Web Application

## Technical description:
* MonoRepo build with lerna
* Auto Release Script
* Typescript 3.7
* Isomorphic (for Node & browsers)
* Auto tests with JEST
* ~100% code coverage

## Development Quick Start
```bash
npm install
npm run bootstrap
npm run build
```

## Delivery
### Libraries
- Released on tag push
 ```bash
 git tag v0.1.0
 git push --tags
 ```
### Cloud functions
- Continuous deployment to Google Cloud on push to master

### Containers
- Continuous push to Google Cloud Artifactory

## Commands:
  * Run unit tests: `npm run test`
  * Start TDD flow: `npm run tdd`
  * Run linter verification: `npm run lint`
  * Run linter verification & fix: `npm run lintfix`
  * Build project: `npm run build`

## License
  This project is licensed under the MIT license, Copyright (c) 2020 Volodymyr Vreshch.
  For more information see [LICENSE.md](https://github.com/chemistry/crystallography-api/blob/master/LICENSE.md).
