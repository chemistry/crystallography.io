import express from 'express';
import request from 'supertest';
import type { Db } from 'mongodb';
import type { Queue } from 'bullmq';
import { healthCheck } from './healthcheck.js';

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

describe('nested /api/v1/search health routes', () => {
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

  it('answers the v1 envelope with the same mongo + queue checks as the alias', async () => {
    const app = express();
    app.get('/api/v1/search/structure/hc', healthCheck({ db: mockDb(), queue: mockQueue() }));
    const res = await request(app).get('/api/v1/search/structure/hc');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-searchrouter');
    expect(res.body.data.checks).toEqual({ mongo: 'ok', queue: 'ok' });
  });

  it('serves the same envelope on the standard /api/v1/search/health route', async () => {
    const app = express();
    app.get('/api/v1/search/health', healthCheck({ db: mockDb(), queue: mockQueue() }));
    const res = await request(app).get('/api/v1/search/health');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-searchrouter');
    expect(res.body.data.checks).toEqual({ mongo: 'ok', queue: 'ok' });
  });

  it('reports unavailable + 503 with data present when a dependency is down', async () => {
    const app = express();
    app.get('/api/v1/search/structure/hc', healthCheck({ db: mockDb(false), queue: mockQueue() }));
    const res = await request(app).get('/api/v1/search/structure/hc');
    expect(res.status).toBe(503);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.checks).toEqual({ mongo: 'down', queue: 'ok' });
  });
});
