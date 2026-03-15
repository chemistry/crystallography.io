import { test, expect } from '../fixtures/index.js';

test.describe('Catalog API', () => {
  test('GET /api/v1/catalog returns paginated data', async ({ apiClient }) => {
    const res = await apiClient.getCatalog(1);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.meta).toBeDefined();
  });

  test('GET /api/v1/catalog page 2 returns data', async ({ apiClient }) => {
    const res = await apiClient.getCatalog(2);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
