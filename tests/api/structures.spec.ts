import { test, expect, TEST_DATA, URLS } from '../fixtures/index.js';

test.describe('Structures API', () => {
  test('GET /api/v1/structure/:id returns structure data', async ({ apiClient }) => {
    const res = await apiClient.getStructure(TEST_DATA.knownStructureId);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/v1/structure/:id returns empty for unknown ID', async ({ apiClient }) => {
    const res = await apiClient.getStructure('9999999');
    expect(res.status()).toBeLessThan(500);
  });

  test('POST /api/v1/structure fetches multiple structures', async ({ request }) => {
    const res = await request.post(`${URLS.base}/api/v1/structure`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'ids=[1000000,1000001,1000002]',
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(3);
  });

  test('POST /api/v1/structure validates input', async ({ request }) => {
    const res = await request.post(`${URLS.base}/api/v1/structure`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'ids=[]',
    });
    expect(res.status()).toBe(400);
  });
});
