import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import { createRequestLog } from '@agentage/observability';
import { getRouters } from './routers/index.js';
import { log } from './common/logger.js';
import type { Db } from 'mongodb';

const HEALTH_PATHS = new Set(['/health', '/hc', '/api/health']);

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

  // One wide event per request, mounted before every route so 404s are counted too.
  const requestLog = createRequestLog(log);
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Docker HEALTHCHECK hits /health every 30s (plus its /hc and /api/health
    // aliases) - probe noise, not traffic.
    if (HEALTH_PATHS.has(req.path)) return next();
    return requestLog(req, res, next);
  });

  onAppInit(app);

  app.set('query parser', 'simple');
  app.use(helmet());
  app.use(cors());
  app.use(timeout('10s'));
  app.use(bodyParser.json({ limit: '1000kb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1000kb' }));

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
