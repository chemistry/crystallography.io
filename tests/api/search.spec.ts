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

    test('POST search by name returns paginated results', async ({ apiClient }) => {
      const res = await apiClient.searchByName(TEST_DATA.search.structureName);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
      expect(body.meta.total).toBeGreaterThan(0);
      expect(body.meta.pages).toBeGreaterThan(0);
    });

    test('search by name rejects short queries', async ({ apiClient }) => {
      const res = await apiClient.searchByName('ab');
      expect(res.status()).toBe(400);
    });
  });

  test.describe('Search by Formula', () => {
    test('POST search by formula returns results', async ({ apiClient }) => {
      const res = await apiClient.searchByFormula(TEST_DATA.search.formula);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data).toBeDefined();
    });

    test('complex formula search works', async ({ apiClient }) => {
      const res = await apiClient.searchByFormula('C6 H6');
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

    test('rejects missing parameters', async ({ apiClient }) => {
      const res = await apiClient.searchByUnitCell({
        a: 5.4,
        b: 0,
        c: 0,
        alpha: 0,
        beta: 0,
        gamma: 0,
        tolerance: 1,
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('Search by Author', () => {
    test('POST search by author returns results with metadata', async ({ apiClient }) => {
      const res = await apiClient.searchByAuthor(TEST_DATA.search.authorName);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.meta).toBeDefined();
      expect(body.meta.authors.length).toBeGreaterThan(0);
    });
  });
});
