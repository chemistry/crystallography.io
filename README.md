# Crystallography API
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

API support for Alternative [COD Web UI](http://crystallography-online.com/)

## Include Packages:
### Functions:
  * [@chemistry/functions/cod-sync-start-instance](https://github.com/chemistry/crystallography-api/tree/master/packages/functions/cod-sync-start-instance) - Start VM for COD Synchronization execution (labels.codsync eq true)

### Libraries:
  * [@chemistry/common-functions](https://github.com/chemistry/crystallography-api/tree/master/packages/libraries/common-functions) - Common code shared across cloud function

### Containers:
  * [@chemistry/cod-to-git-sync](https://github.com/chemistry/crystallography-api/tree/master/packages/containers/cod-to-git-sync)

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
  This project is licensed under the MIT license, Copyright (c) 2019 Volodymyr Vreshch.
  For more information see [LICENSE.md](https://github.com/chemistry/crystallography-api/blob/master/LICENSE.md).
