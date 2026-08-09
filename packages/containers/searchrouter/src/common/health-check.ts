import { Router } from 'express';
import type { Db } from 'mongodb';
import type { Queue } from 'bullmq';
import type { HealthCheck } from '@agentage/observability/health';
import { createHealthHandler } from '@agentage/observability/health';

// Shared with helpers/healthcheck.ts so the top-level alias and the nested
// /api/v1/search/structure/hc route assert mongo + the BullMQ/Redis queue the
// same way. Mirrors the previous mongoCheck + queue.getJobCounts() checks.
export const createChecks = ({ db, queue }: { db: Db; queue: Queue }): HealthCheck[] => [
  { name: 'mongo', run: async () => Boolean((await db.stats()).ok), timeoutMs: 2000 },
  {
    name: 'queue',
    run: async () => {
      await queue.getJobCounts();
      return true;
    },
    timeoutMs: 2000,
  },
];

export const healthCheck = ({ db, queue }: { db: Db; queue: Queue }) => {
  // service defaults to OTEL_SERVICE_NAME (set in docker-compose.yaml) so health
  // and telemetry service.name can't drift apart - see specs/health-endpoints.md.
  const handler = createHealthHandler({ checks: createChecks({ db, queue }) });
  const router = Router();
  router.get('/health', handler);
  router.get('/hc', handler); // legacy alias, wired into the Dockerfile HEALTHCHECK
  return router;
};
