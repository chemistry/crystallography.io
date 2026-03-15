import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('Authors API', () => {
  test('GET /api/v1/authors returns paginated author list', async ({ apiClient }) => {
    const res = await apiClient.getAuthors(1);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.meta).toBeDefined();
  });

  test('autocomplete author returns suggestions', async ({ apiClient }) => {
    const res = await apiClient.autocompleteAuthor(TEST_DATA.search.authorName);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('search by author returns results', async ({ apiClient }) => {
    const res = await apiClient.searchByAuthor(TEST_DATA.search.authorName);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
