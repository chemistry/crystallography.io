import * as Sentry from '@sentry/node';
import cluster from 'cluster';
import os from 'node:os';

import type { SearchStatisticsModel } from './models/index.js';
import { startWorker } from './server.js';
import { checkConnection } from './common/utils.js';
import { createHealthApp } from './health.js';
import type { WorkerFacts } from './health.js';
import { applyJobProcessedMessage } from './health-facts.js';

const numCPUs = os.cpus().length;
const HEALTH_PORT = process.env.HEALTH_PORT ? Number(process.env.HEALTH_PORT) : 8090;

if (cluster.isPrimary) {
  (async () => {
    try {
      await checkConnection();

      const _statistics: SearchStatisticsModel[] = [];
      console.log(
        `${new Date().toLocaleString()} searchworker:master started with pid ${process.pid} on ${numCPUs} cpus`
      );

      let facts: WorkerFacts = { lastRunAt: null, jobsProcessed: 0 };

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

      // Forks do the actual queue consuming (server.ts); the primary only aggregates.
      cluster.on('message', (_worker, message: unknown) => {
        facts = applyJobProcessedMessage(facts, message);
      });

      createHealthApp(() => facts).listen(HEALTH_PORT, '0.0.0.0', () => {
        console.log(`searchworker health listening on :${HEALTH_PORT}`);
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
