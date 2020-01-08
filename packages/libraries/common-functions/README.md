# @chemistry/common-functions
[![npm version](https://badge.fury.io/js/%40chemistry%2Fcommon-functions.svg)](https://badge.fury.io/js/%40chemistry%2Fcommon-functions)
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
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
  CodSyncScheduleInstanceStartPayload,
  PubSubContext,
  extractPayload
  } from '@chemistry/common-functions';
/**
 * Cloud Function that will start COD synronization Instances
 */
export function codSyncStartInstance(
    data: CodSyncScheduleInstanceStartPayload,
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
