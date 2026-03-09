import fs from 'node:fs';
import path from 'node:path';
import * as Sentry from '@sentry/node';
import type { Express } from 'express';
import { AppContextType, getApplication } from '../common/index.js';
import type { ApplicationContext } from '../common/index.js';
import { startApplication } from './application.js';
import { getLogger } from './common/logger.js';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.time('Context Prepare');

const htmlContent = fs.readFileSync(path.join(__dirname, '/../static/index.html'), 'utf8');

const appContext: ApplicationContext = {
  type: AppContextType.backend,
};

const getPort = () => {
  const port = process.env.PORT;
  if (port && isFinite(parseInt(port, 10)) && parseInt(port, 10) > 0) {
    return parseInt(port, 10);
  }
  return 8080;
};

const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 1.0,
  });
};

const getContext = async () => {
  const { mw, logger } = await getLogger();
  const PORT = getPort();

  return {
    logger: {
      trace: (message: string) => {
        console.log(message);
        logger.trace(message);
      },
      info: (message: string) => {
        console.log(message);
        logger.info(message);
      },
      error: (message: string) => {
        console.error(message);
        logger.error(message);
      },
    },
    PORT,
    onAppInit: (app: Express) => {
      initSentry();
      app.get('/hc', (req, res) => res.json({ status: 'OK' }));
      app.use(mw);
    },
    onAppInitEnd: (_app: Express) => {
      // Sentry error handler placeholder
    },
    appFactory: getApplication,
    htmlContent,
    appContext,
  };
};

console.timeEnd('Context Prepare');

console.time('App Start');
(async () => {
  try {
    const context = await getContext();
    const { PORT, logger } = context;
    const { app } = await startApplication(context);

    await new Promise<void>((resolve) => {
      app.listen(PORT, '0.0.0.0', resolve);
    });

    logger.trace(`Application Started on port: ${PORT}`);
    console.timeEnd('App Start');
  } catch (e: unknown) {
    Sentry.captureException(e);
    console.error(e);
    process.exit(-1);
  }
})();
