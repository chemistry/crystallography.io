import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('Search API', () => {
  test.describe('Search by Name', () => {
    test('autocomplete name returns suggestions', async ({ apiClient }) => {
      const res = await apiClient.autocompleteName(TEST_DATA.search.structureName);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBeTruthy();
    });

    test('POST search by name returns results', async ({ apiClient }) => {
      const res = await apiClient.searchByName(TEST_DATA.search.structureName);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
    });
  });

  test.describe('Search by Formula', () => {
    test('POST search by formula returns results', async ({ apiClient }) => {
      const res = await apiClient.searchByFormula(TEST_DATA.search.formula);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
    });
  });

  test.describe('Search by Unit Cell', () => {
    test('POST search by unit cell returns results', async ({ apiClient }) => {
      const res = await apiClient.searchByUnitCell(TEST_DATA.search.unitCell);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
    });
  });
});
