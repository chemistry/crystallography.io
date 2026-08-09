import { applyJobProcessedMessage } from './health-facts.js';
import type { WorkerFacts } from './health.js';

describe('applyJobProcessedMessage', () => {
  it('bumps jobsProcessed and stamps lastRunAt on a job-processed message', () => {
    const start: WorkerFacts = { lastRunAt: null, jobsProcessed: 0 };
    const at = Date.parse('2026-08-09T12:00:00.000Z');
    const next = applyJobProcessedMessage(start, { type: 'job-processed', at });
    expect(next).toEqual({ lastRunAt: '2026-08-09T12:00:00.000Z', jobsProcessed: 1 });
  });

  it('accumulates across repeated messages', () => {
    let facts: WorkerFacts = { lastRunAt: null, jobsProcessed: 0 };
    facts = applyJobProcessedMessage(facts, { type: 'job-processed', at: Date.now() });
    facts = applyJobProcessedMessage(facts, { type: 'job-processed', at: Date.now() });
    expect(facts.jobsProcessed).toBe(2);
  });

  it('ignores unrelated or malformed messages', () => {
    const start: WorkerFacts = { lastRunAt: null, jobsProcessed: 0 };
    expect(applyJobProcessedMessage(start, { type: 'something-else' })).toBe(start);
    expect(applyJobProcessedMessage(start, null)).toBe(start);
    expect(applyJobProcessedMessage(start, 'not-an-object')).toBe(start);
  });
});
