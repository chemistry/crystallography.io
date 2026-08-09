import express from 'express';
import request from 'supertest';
import { mountHealth } from './health.js';

const buildApp = () => {
  const app = express();
  mountHealth(app);
  return app;
};

describe('crystallography-web /health', () => {
  // service comes from OTEL_SERVICE_NAME (docker-compose.yaml), not a hand-typed
  // constant - stub it per test so this suite doesn't leak into others.
  const original = process.env.OTEL_SERVICE_NAME;
  beforeEach(() => {
    process.env.OTEL_SERVICE_NAME = 'crystallography-web';
  });
  afterEach(() => {
    // `= undefined` would coerce to the string "undefined", not unset it.
    if (original === undefined) delete process.env.OTEL_SERVICE_NAME;
    else process.env.OTEL_SERVICE_NAME = original;
  });

  it('reports ok + 200 under the estate service name, no dependency checks', async () => {
    const res = await request(buildApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.service).toBe('crystallography-web');
    expect(res.body.data.checks).toBeUndefined();
  });

  it('keeps /hc answering as an alias', async () => {
    const res = await request(buildApp()).get('/hc');
    expect(res.status).toBe(200);
    expect(res.body.data.service).toBe('crystallography-web');
  });
});
