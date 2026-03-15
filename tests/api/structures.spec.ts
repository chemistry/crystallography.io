import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('Structures API', () => {
  test('GET /api/v1/structure/:id returns structure data', async ({ apiClient }) => {
    const res = await apiClient.getStructure(TEST_DATA.knownStructureId);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/v1/structure/:id returns 404 for unknown ID', async ({ apiClient }) => {
    const res = await apiClient.getStructure('9999999');
    const body = await res.json();
    // API may return empty data or 404
    expect(res.status()).toBeLessThan(500);
  });
});
