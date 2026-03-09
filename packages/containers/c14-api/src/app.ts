import * as bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { getRouters } from './routers/index.js';
import type { Db } from 'mongodb';

export interface ApplicationContext {
  logger: {
    trace: (message: string) => void;
    info: (message: string) => void;
    error: (message: string) => void;
  };
  onAppInit: (express: Express) => void;
  onAppInitEnd: (express: Express) => void;
  PORT: number;
  db: Db;
}

export async function startApplication(context: ApplicationContext) {
  const { logger, db, onAppInit, onAppInitEnd } = context;
  logger.trace('application started');

  const app = express();

  onAppInit(app);

  // Add UTF-8 symbols parser
  app.set('query parser', 'simple');

  app.use(cors());

  app.use(timeout('10s'));

  app.use(bodyParser.urlencoded({ extended: true, limit: '1000kb' }));

  // Remove header
  app.disable('x-powered-by');

  // Serve static files
  app.get('/', (req, res) => {
    res.send('api/: OK');
  });

  app.get('/api', (req, res) => {
    res.send('api: OK');
  });

  app.use('/', getRouters({ db }));

  onAppInitEnd(app);

  app.use(
    (err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      if (err) {
        logger.error(err.stack || err.message);
      }
      res.status(500).send('Something broke!');
    }
  );

  return { app };
}
