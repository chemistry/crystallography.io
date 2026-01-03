# Crystal Structure Search Application

[![Release version](https://img.shields.io/github/v/release/chemistry/crystallography.io?color=green.svg)](https://github.com/chemistry/crystallography.io/releases)
[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Website: [Crystal Structure Search](http://crystallography.io/)

![CrystalStructureSearch](https://github.com/chemistry/crystallography.io/blob/master/crystal-structure-search.png?raw=true)

Application for Desktop [Download](https://github.com/chemistry/crystallography.io/releases)
Supported platforms:

* Windows
* Linux
* MaxOS

## Include Packages

### Application

* [@chemistry/structure-search](https://github.com/chemistry/crystallography.io/tree/master/packages/application/structure-search) - Main Electron Application

### Containers

* [@chemistry/c14-api](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/c14-api)
    Open API for accessing COD+ database
* [@chemistry/c14-graphql-api](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/c14-graphql-api) - GraphQL open API
* [@chemistry/c14-web](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/c14-web) - Alternative Web UI container
* [@chemistry/cod-to-disk](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/cod-to-disk) - Synchronize information from COD database and store to disk
* [@chemistry/disk-to-db](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/disk-to-db) - Get updated structures from disk and store to MongoDB database
* [@chemistry/maintenance](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/maintenance) - Set of maintenance tasks scheduled regularly (e.g. index recalculation)
* [@chemistry/searchrouter](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/searchrouter) - Substructure Search - api delegate results to searchworker
* [@chemistry/searchworker](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/searchworker) - Perform substructure search and return results to router
* [@chemistry/structure-to-index](https://github.com/chemistry/crystallography.io/tree/master/packages/containers/structure-to-index) - monitor structures updates table indexes

### Libraries

* [@chemistry/cif-2-json](https://github.com/chemistry/crystallography.io/tree/master/packages/libraries/cif-2-json) - Library for conversion of CIF to JSON

## Development Quick Start

* `npm install && npm run bootstrap` Install dependencies
* `npm start` Start Development in Local mode

## Setup Infrastructure

* [Swarm Cluster](https://github.com/chemistry/crystallography.io/tree/master/setup)

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

## Technical description

* Microservice /event driven architecture
* RabbitMQ, Redis, MongoDB
* Deploy with Dockers Swart
* Auto Release Script
* Typescript 3.7+
* Isomorphic Application (for Node & browsers)

## Release

* Application and libraries release on tag push
* Libraries: `git tag l0.0.17 &&  git push --tags`
* Applications: `git tag v0.0.18 &&  git push --tags`

### Cloud functions

* Continuous deployment to Google Cloud on push to master


## Commands

* Run unit tests: `npm run test`
* Start TDD flow: `npm run tdd`
* Run linter verification: `npm run lint`
* Run linter verification & fix: `npm run lintfix`
* Build project: `npm run build`

## License

  This project is licensed under the MIT license, Copyright (c) 2020 Volodymyr Vreshch.
  For more information see [LICENSE.md](https://github.com/chemistry/crystallography.io/blob/master/LICENSE).
