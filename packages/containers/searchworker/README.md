# @chemistry/searchworker

Search Worker for Sub Structure Search; Will preform scheduled jobs;

## Local development
  * Start application: `npm start`
  * Build app: `npm run build`
  * Run nodemon: `npm run nodemon`
  * Run tests: `npm test`
  * Run coverage: `npm run coverage`
  * Run lint: `npm run lint`
  * Run lintfix: `npm run lintfix`

## Running app:
  * Run mongo `docker run -d -p 27017:27017 --name mongo -v ~/data/mongo:/data/db mongo`
  * Run redis `docker run -d --name redis -p 6379:6379 redis:latest`

## Technical description :
  * Express
  * Typescript 2.1 (export typings)
  * Dependency to mongo & redis

## Commands:
  * Run project: `npm start`
