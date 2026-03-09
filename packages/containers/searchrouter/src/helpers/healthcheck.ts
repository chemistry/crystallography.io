import fs from 'node:fs';
import type { Db } from 'mongodb';
import os from 'node:os';
import path from 'node:path';
import type { Queue } from 'bullmq';

import type { Request, Response } from 'express';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
const { name, version } = packageJSON;

export function healthCheck({
  db,
  queue,
}: {
  db: Db;
  queue: Queue;
}): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const writeFail = () => {
      res
        .status(500)
        .send(
          JSON.stringify(
            {
              status: 'FAIL',
            },
            null,
            4
          )
        )
        .end();
    };
    const writeOK = () => {
      res
        .status(200)
        .send(
          JSON.stringify(
            {
              status: 'OK',
            },
            null,
            4
          )
        )
        .end();
    };

    (async () => {
      try {
        const [, dbStats] = await Promise.all([queue.getJobCounts(), db.stats()]);
        if (dbStats.ok) {
          writeOK();
        } else {
          writeFail();
        }
      } catch (err) {
        console.error(err);
        writeFail();
      }
    })();
  };
}

export function statusCheck({
  db,
  queue,
}: {
  db: Db;
  queue: Queue;
}): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    const writeFail = () => {
      res
        .status(500)
        .send(
          JSON.stringify(
            {
              status: 'FAIL',
            },
            null,
            4
          )
        )
        .end();
    };
    res.header('Content-Type', 'application/json');

    (async () => {
      try {
        const [queueJobCounts] = await Promise.all([queue.getJobCounts(), db.stats()]);

        res
          .status(200)
          .send(
            JSON.stringify(
              {
                status: 'OK',
                name,
                version,
                pid: process.pid,
                memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
                uptime: process.uptime(),
                NODE_ENV: process.env.NODE_ENV,
                hostname: os.hostname(),
                queue: queueJobCounts,
              },
              null,
              4
            )
          )
          .end();
      } catch (err) {
        console.error(err);
        writeFail();
      }
    })();
  };
}
