import { Router } from 'express';
import type { Db } from 'mongodb';
import { createHealthHandler } from '@agentage/observability/health';

export const healthCheck = ({ db }: { db: Db }) => {
  const handler = createHealthHandler({
    // service defaults to OTEL_SERVICE_NAME (set in docker-compose.yaml) so health
    // and telemetry service.name can't drift apart - see specs/health-endpoints.md.
    // Mirrors the previous mongoCheck; bounded well under HEALTHCHECK --timeout=5s.
    checks: [{ name: 'mongo', run: async () => Boolean((await db.stats()).ok), timeoutMs: 2000 }],
  });
  const router = Router();
  router.get('/health', handler);
  router.get('/hc', handler); // legacy alias, wired into the Dockerfile HEALTHCHECK
  // Traefik forwards PathPrefix('/api'|'/sitemap'|'/cif') to this service unchanged
  // (no strip-prefix) - /health at the app root is unreachable from outside the
  // overlay network without this mount.
  router.get('/api/health', handler);
  return router;
};
