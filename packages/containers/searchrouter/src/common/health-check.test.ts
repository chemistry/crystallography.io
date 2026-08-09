import express from 'express';
import request from 'supertest';
import type { Db } from 'mongodb';
import type { Queue } from 'bullmq';
import { healthCheck } from './health-check.js';

const mockDb = (up = true) =>
  ({
    stats: async () => {
      if (!up) throw new Error('mongo down');
      return { ok: 1 };
    },
  }) as unknown as Db;

const mockQueue = (up = true) =>
  ({
    getJobCounts: async () => {
      if (!up) throw new Error('queue down');
      return {};
    },
  }) as unknown as Queue;

const buildApp = (db: Db, queue: Queue) => {
  const app = express();
  app.use('/', healthCheck({ db, queue }));
  return app;
};

describe('crystallography-searchrouter /health', () => {
  // service comes from OTEL_SERVICE_NAME (docker-compose.yaml), not a hand-typed
  // constant - stub it per test so this suite doesn't leak into others.
  const original = process.env.OTEL_SERVICE_NAME;
  beforeEach(() => {
    process.env.OTEL_SERVICE_NAME = 'crystallography-searchrouter';
  });
  afterEach(() => {
    // `= undefined` would coerce to the string "undefined", not unset it.
    if (original === undefined) delete process.env.OTEL_SERVICE_NAME;
    else process.env.OTEL_SERVICE_NAME = original;
  });

  it('reports ok + 200 with mongo + queue up, under the estate service name', async () => {
    const res = await request(buildApp(mockDb(), mockQueue())).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.service).toBe('crystallography-searchrouter');
    expect(res.body.data.checks).toEqual({ mongo: 'ok', queue: 'ok' });
  });

  it('reports unavailable + 503 with data present when mongo is down', async () => {
    const res = await request(buildApp(mockDb(false), mockQueue())).get('/health');
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.status).toBe('unavailable');
    expect(res.body.data.checks).toEqual({ mongo: 'down', queue: 'ok' });
  });

  it('reports unavailable + 503 with data present when the queue is down', async () => {
    const res = await request(buildApp(mockDb(), mockQueue(false))).get('/health');
    expect(res.status).toBe(503);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.checks).toEqual({ mongo: 'ok', queue: 'down' });
  });

  it('keeps /hc answering as an alias', async () => {
    const res = await request(buildApp(mockDb(), mockQueue())).get('/hc');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-searchrouter');
  });
});
