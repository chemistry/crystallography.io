import * as Sentry from '@sentry/node';

import { app } from './app.js';
import type { AppContext } from './app.js';
import { getLogger } from './common/logger.js';
import { getMongoConnection } from './common/mongo.js';
import { getChanel } from './common/rabbitmq.js';

const QUEUE_NAME = 'STRUCTURE_CHANGED';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
});

const getContext = async (): Promise<AppContext> => {
  const [mongo, chanel, logger] = await Promise.all([
    getMongoConnection(),
    getChanel(QUEUE_NAME),
    getLogger(),
  ]);

  process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
  });

  return {
    logger,
    chanel,
    db: mongo.db,
    QUEUE_NAME,
  };
};

(async () => {
  try {
    console.time('application start');

    const context = await getContext();
    await app(context);

    console.timeEnd('application start');
  } catch (e: unknown) {
    Sentry.captureException(e);
    console.error(e);
    process.exit(-1);
  }
})();
