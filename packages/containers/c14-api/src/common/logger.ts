import { createLogger } from '@agentage/observability';

// service reads OTEL_SERVICE_NAME (set in docker-compose.yaml) so logs and traces
// can't drift apart - same rule as the health handler in health-check.ts.
export const log = createLogger({
  service: process.env.OTEL_SERVICE_NAME || 'crystallography-api',
});
