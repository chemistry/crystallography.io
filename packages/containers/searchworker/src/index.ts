import * as Sentry from '@sentry/node';
import cluster from 'cluster';
import os from 'node:os';

import type { SearchStatisticsModel } from './models/index.js';
import { startWorker } from './server.js';
import { checkConnection } from './common/utils.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  (async () => {
    try {
      await checkConnection();

      const _statistics: SearchStatisticsModel[] = [];
      console.log(
        `${new Date().toLocaleString()} searchworker:master started with pid ${process.pid} on ${numCPUs} cpus`
      );

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.error(`worker ${worker.process.pid} died`);
      });

      cluster.on('fork', (worker) => {
        console.error(
          `${new Date().toLocaleString()} searchworker:master - fork event; isDead: ${worker.isDead()}`
        );
      });
    } catch (e: unknown) {
      Sentry.captureException(e);
      console.error(String(e));
      process.exit(-1);
    }
  })();
} else {
  startWorker();
}

process.on('uncaughtException', (err) => {
  console.error('uncaughtException: ', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log(`Received SIGINT`);
});

process.on('SIGTERM', () => {
  console.log(`Received SIGTERM`);
});
