import request from 'supertest';
import { createHealthApp } from './health.js';
import type { WorkerFacts } from './health.js';

// Matches docker-compose.yaml, where the kit's `service` default reads this.
const origServiceName = process.env.OTEL_SERVICE_NAME;
beforeAll(() => {
  process.env.OTEL_SERVICE_NAME = 'crystallography-searchworker';
});
afterAll(() => {
  process.env.OTEL_SERVICE_NAME = origServiceName;
});

describe('searchworker /health', () => {
  it('reports ok + 200 under the estate service name, with lastRunAt + jobsProcessed facts', async () => {
    const facts: WorkerFacts = { lastRunAt: '2026-08-09T12:00:00.000Z', jobsProcessed: 3 };
    const res = await request(createHealthApp(() => facts)).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.service).toBe('crystallography-searchworker');
    expect(res.body.data.facts).toEqual(facts);
  });

  it('reports facts as null/zero before any job has completed', async () => {
    const facts: WorkerFacts = { lastRunAt: null, jobsProcessed: 0 };
    const res = await request(createHealthApp(() => facts)).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.data.facts).toEqual(facts);
  });
});
