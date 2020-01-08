# @chemistry/cif-2-json
[![GitHub Build Status](https://github.com/chemistry/crystallography-api/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography-api/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Library that Convert CIF file to JSON and support manipulations

## Contains following tools:
- cif to json
- filter json (omit some fields)
- find loop by type
- normalize string
- preform basic check
- library of unit cells

## How to Use
```javascript
import { parse } from '@chemistry/cif-2-json';
const jcif = parse(cifContent);
console.log(JSON.strngify(jcif, null, 4));
```

## Technical details:
  * Zero Dependency
  * Performance optimizations

## Commands:
  * Build project: `npm run build`

## Libraries used
  * [typescript](http://www.typescriptlang.org/)
  * [webpack](https://webpack.github.io/)
  * [Jasmine](http://jasmine.github.io/)
  * [Karma](http://karma-runner.github.io/)

## Contacts
  * Volodymyr Vreshch vreshch@gmail.com
