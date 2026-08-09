import type { WorkerFacts } from './health.js';

export interface JobProcessedMessage {
  type: 'job-processed';
  at: number;
}

export const isJobProcessedMessage = (message: unknown): message is JobProcessedMessage =>
  typeof message === 'object' &&
  message !== null &&
  (message as { type?: unknown }).type === 'job-processed';

// Pure reducer so the cluster-IPC wiring in index.ts stays a thin, untested shell.
export const applyJobProcessedMessage = (facts: WorkerFacts, message: unknown): WorkerFacts => {
  if (!isJobProcessedMessage(message)) {
    return facts;
  }
  return { lastRunAt: new Date(message.at).toISOString(), jobsProcessed: facts.jobsProcessed + 1 };
};
