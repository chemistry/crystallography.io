import { test, expect } from '../fixtures/index.js';

test.describe('Health Checks', () => {
  test('web /hc returns the v1 envelope with version info', async ({ apiClient }) => {
    const res = await apiClient.getHealth();
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
    expect(body.data.service).toBe('crystallography-web');
    expect(body.data.commit).toBeDefined();
    expect(body.data.buildTime).toBeDefined();
  });

  test('API root returns OK', async ({ apiClient }) => {
    const res = await apiClient.getApiRoot();
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('OK');
  });
});
