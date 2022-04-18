# @chemistry/searchrouter

[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Search Router for Substructure Search; Will preform finger prints filtering & job scheduling;
Updates available via redis pubs/sub interface;

## Local development

* Start application: `npm start`
* Build app: `npm run build`
* Run nodemon: `npm run nodemon`
* Run tests: `npm test`
* Run coverage: `npm run coverage`
* Run lint: `npm run lint`
* Run lintfix: `npm run lintfix`

## Running app

* Run mongo `(docker stop mongo || true) && (docker rm mongo || true) && docker run -d --restart unless-stopped -p 27017:27017 --name mongo -v ~/data/mongo:/data/db mongo`
* Run redis `(docker stop redis || true) && (docker rm redis || true) && docker run -d --restart unless-stopped --name redis -p 6379:6379 redis:latest`

## Technical description

* Express
* Typescript 2.1 (export typings)
* Dependency to mongo & redis

## Local Commands

* Run project: `npm start`
