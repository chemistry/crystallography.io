import { startServer } from './app.js';
import * as Sentry from '@sentry/node';
import { getLogger } from './common/express-logger.js';
import { getMongoConnection } from './common/mongo.js';
import { healthCheck, mongoCheck } from './common/health-check.js';

(async () => {
  try {
    await new Promise((res) => setTimeout(res, 20000));
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

    const { db } = await getMongoConnection();
    const { logger, mw } = await getLogger();
    const hc = healthCheck([mongoCheck({ db })]);

    const server = await startServer({ db, mw, hc });

    server.listen(PORT, () => {
      console.log(`${new Date().toLocaleString()} searchrouter - started on port ${PORT}`);
      logger.info(`${new Date().toLocaleString()} searchrouter - started on port ${PORT}`);
    });
    server.on('error', (err: Error) => {
      console.error(err);
      logger.error(String(err));
    });

    process.on('SIGTERM', () => {
      console.log('closing connection');
    });
  } catch (e: unknown) {
    Sentry.captureException(e);
    console.error(e);
    process.exit(-1);
  }
})();

process.on('uncaughtException', (err) => {
  console.error('uncaughtException: ', err.message);
  console.error(err.stack);
});

process.on('SIGINT', () => {
  console.log(`Received SIGINT`);
});

process.on('SIGTERM', () => {
  console.log(`Received SIGTERM`);
});
