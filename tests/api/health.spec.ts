import { test, expect } from '../fixtures/index.js';

test.describe('Health Checks', () => {
  test('web /hc returns OK with version info', async ({ apiClient }) => {
    const res = await apiClient.getHealth();
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('OK');
    expect(body.commit).toBeDefined();
    expect(body.buildTime).toBeDefined();
  });

  test('API root returns OK', async ({ apiClient }) => {
    const res = await apiClient.getApiRoot();
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('OK');
  });
});
