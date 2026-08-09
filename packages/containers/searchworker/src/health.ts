import express from 'express';
import type { Express } from 'express';
import { createHealthHandler } from '@agentage/observability/health';

export interface WorkerFacts extends Record<string, unknown> {
  lastRunAt: string | null;
  jobsProcessed: number;
}

// `service` defaults to OTEL_SERVICE_NAME, which docker-compose.yaml already sets
// to crystallography-searchworker for this service - no need to hand-type it here.
// Cluster primary only: it never processes jobs itself, the forks do (server.ts),
// so facts are read from a callback the primary keeps updated via cluster IPC.
export const createHealthApp = (getFacts: () => WorkerFacts): Express => {
  const app = express();
  app.get('/health', createHealthHandler({ facts: getFacts }));
  return app;
};
