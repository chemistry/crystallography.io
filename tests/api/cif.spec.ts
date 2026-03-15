import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('CIF Download', () => {
  test('GET /cif/:id returns CIF file', async ({ apiClient }) => {
    const res = await apiClient.downloadCif(TEST_DATA.knownStructureId);
    expect(res.ok()).toBeTruthy();
    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain('chemical/x-cif');
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /cif/:id returns 404 for unknown ID', async ({ apiClient }) => {
    const res = await apiClient.downloadCif('0000000');
    expect(res.ok()).toBeFalsy();
  });
});
