# @chemistry/common-functions
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![Travis Build Status](https://travis-ci.com/chemistry/crystallography-api.svg?branch=master)](https://travis-ci.org/chemistry/crystallography-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Common Library part of [crystallography-api project](https://github.com/chemistry/crystallography-api) used to share common interfaces and code across
Cloud Functions implementation across the project

## Install
```bash
npm install @chemistry/common-functions
```

## Interfaces use cases
```javascript
import {
  PubSubEvent,
  PubSubContext,
  CodSyncScheduleInstanceStartPayload,
  extractPayload
} from '@chemistry/common-functions';

export function codSyncStartInstance(
    event: PubSubEvent<CodSyncScheduleInstanceStartPayload>,
    context: PubSubContext
) {
    const payload = extractPayload(event);
  // ...
}
```

## Declarated interfaces:
  * CTopic
  * CTopicPayload

## Commands:
  * Build project: `npm run build`
