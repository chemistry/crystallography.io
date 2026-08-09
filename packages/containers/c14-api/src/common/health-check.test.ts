import express from 'express';
import request from 'supertest';
import type { Db } from 'mongodb';
import { healthCheck } from './health-check.js';

const mockDb = (up = true) =>
  ({
    stats: async () => {
      if (!up) throw new Error('mongo down');
      return { ok: 1 };
    },
  }) as unknown as Db;

const buildApp = (db: Db) => {
  const app = express();
  app.use('/', healthCheck({ db }));
  return app;
};

describe('crystallography-api /health', () => {
  // service comes from OTEL_SERVICE_NAME (docker-compose.yaml), not a hand-typed
  // constant - stub it per test so this suite doesn't leak into others.
  const original = process.env.OTEL_SERVICE_NAME;
  beforeEach(() => {
    process.env.OTEL_SERVICE_NAME = 'crystallography-api';
  });
  afterEach(() => {
    // `= undefined` would coerce to the string "undefined", not unset it.
    if (original === undefined) delete process.env.OTEL_SERVICE_NAME;
    else process.env.OTEL_SERVICE_NAME = original;
  });

  it('reports ok + 200 with mongo up, under the estate service name', async () => {
    const res = await request(buildApp(mockDb(true))).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.service).toBe('crystallography-api');
    expect(res.body.data.checks).toEqual({ mongo: 'ok' });
  });

  it('reports unavailable + 503 with data present when mongo is down', async () => {
    const res = await request(buildApp(mockDb(false))).get('/health');
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.status).toBe('unavailable');
    expect(res.body.data.checks).toEqual({ mongo: 'down' });
  });

  it('keeps /hc answering as an alias', async () => {
    const res = await request(buildApp(mockDb(true))).get('/hc');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-api');
  });

  it('answers on /api/health - the only path Traefik forwards to this service', async () => {
    const res = await request(buildApp(mockDb(true))).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-api');
    expect(res.body.data.checks).toEqual({ mongo: 'ok' });
  });

  it('falls back to the loud "unknown" when OTEL_SERVICE_NAME is unset', async () => {
    delete process.env.OTEL_SERVICE_NAME;
    const res = await request(buildApp(mockDb(true))).get('/health');
    expect(res.body.data.service).toBe('unknown');
  });
});
