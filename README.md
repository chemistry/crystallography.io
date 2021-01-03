# Crystal Structure Search Application
[![Release version](https://img.shields.io/github/v/release/chemistry/crystallography-api?color=green.svg)](https://github.com/chemistry/crystallography-api/releases)
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Website: [Crystal Structure Search](http://crystallography.io/)
Application for Desktop (Windows, Linux, MacOS): [Download](https://github.com/chemistry/crystallography.io/releases)

## Development Quick Start
  * `npm install && npm run bootstrap` Install dependencies
  * `npm start` Start Development in Local mode

## Setup Infrastructure
 * [Swarm Cluster](https://github.com/chemistry/crystallography-api/tree/master/setup)

## Local development
 * Setup env file
```bash
source ./.env
```
 * Start application
```bash
docker-compose down -v && docker-compose up --build -d
```
 * View Application Logs
```bash
docker-compose logs
```
 * Deploy to swarm cluster
```bash
docker stack deploy -c docker-stack.yml --with-registry-auth "crystallography-io"
```
## Deploy changes to swarm cluster


## Include Packages:
### Application:
  * [@chemistry/structure-search](https://github.com/chemistry/crystallography-api/tree/master/packages/application/structure-search) - Main Electron Application

### Containers:
  * [@chemistry/cod-to-gcs-sync](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/cod-to-gcs-sync) - Synchronize COD with Google Cloud Storage
  * [@chemistry/gcp-api-endpoints](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/gcp-api-endpoints) - API Endpoint that execute cloud functions
  * [@chemistry/crystallography-web](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/crystallography-web) - Application Web Container
  * [@chemistry/crystallography-api](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/crystallography-api) - Application Endpoints

### Functions:
  * [@chemistry/cod-sync-start-instance](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/cod-sync-start-instance) - Start VM for COD Synchronization execution (labels.codsync eq true)
  * [@chemistry/cod-sync-stop-instance](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/cod-sync-stop-instance) - Stop VM for what finished Synchronization execution
  * [@chemistry/gcs-to-database](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/gcs-to-database) - Read CIF file from storage and save to database;

  * [@chemistry/structures-to-index](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/structures-to-index) - Store information about document in Elastic search for further processing

### Libraries:
  * [@chemistry/common-functions](https://github.com/chemistry/crystallography-api/tree/master/packages/libraries/common-functions) - Common code shared across cloud function
  * [@chemistry/cif-2-json](https://github.com/chemistry/crystallography-api/tree/master/packages/libraries/cif-2-json) - Library for conversion of CIF to JSON

## Technical description:
* MonoRepo build with lerna
* Auto Release Script
* Typescript 3.7
* Isomorphic (for Node & browsers)
* Auto tests with JEST
* ~100% code coverage

## Release
- Application and libraries release on tag push
* Libraries: `git tag l0.0.17 &&  git push --tags`
* Applications: `git tag v0.0.18 &&  git push --tags`

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
