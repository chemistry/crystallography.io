import type { Express } from 'express';
import { createHealthHandler } from '@agentage/observability/health';

// service defaults to OTEL_SERVICE_NAME (set in docker-compose.yaml) so health and
// telemetry service.name can't drift apart - see specs/health-endpoints.md.
// SSR shell: per the spec's Next.js/API profile, no downstream dependency checks -
// the API it calls has its own probe row.
export const mountHealth = (app: Express) => {
  const handler = createHealthHandler();
  app.get('/health', handler);
  app.get('/hc', handler); // legacy alias, wired into the Dockerfile HEALTHCHECK
};
