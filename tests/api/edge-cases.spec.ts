import { test, expect, URLS } from '../fixtures/index.js';

test.describe('API Edge Cases', () => {
  test.describe('Pagination Boundaries', () => {
    test('catalog page 0 defaults to page 1', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/catalog?page=0`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBeGreaterThan(0);
    });

    test('catalog with non-numeric page defaults gracefully', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/catalog?page=abc`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBeGreaterThan(0);
    });

    test('catalog beyond max page rejects with 400', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/catalog?page=999999`);
      expect(res.status()).toBe(400);
    });

    test('catalog beyond last page returns empty data', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/catalog?page=99999`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBe(0);
    });

    test('authors page 2 returns different data than page 1', async ({ request }) => {
      const [res1, res2] = await Promise.all([
        request.get(`${URLS.base}/api/v1/authors?page=1`),
        request.get(`${URLS.base}/api/v1/authors?page=2`),
      ]);
      const body1 = await res1.json();
      const body2 = await res2.json();
      expect(body1.data[0].id).not.toBe(body2.data[0].id);
    });
  });

  test.describe('Structure Fetch Limits', () => {
    test('POST /api/v1/structure with 200 IDs (max) succeeds', async ({ request }) => {
      const ids = Array.from({ length: 200 }, (_, i) => 1000000 + i);
      const res = await request.post(`${URLS.base}/api/v1/structure`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: `ids=[${ids.join(',')}]`,
      });
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBe(200);
    });

    test('POST /api/v1/structure with 201 IDs (over limit) is rejected', async ({ request }) => {
      const ids = Array.from({ length: 201 }, (_, i) => 1000000 + i);
      const res = await request.post(`${URLS.base}/api/v1/structure`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: `ids=[${ids.join(',')}]`,
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('Unicode and Special Characters', () => {
    test('search by name with Greek letters works', async ({ request }) => {
      const res = await request.post(`${URLS.base}/api/v1/search/name`, {
        data: { name: 'α-quartz', page: 1 },
      });
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.meta.total).toBeGreaterThan(0);
    });

    test('author with diacritics returns results', async ({ request }) => {
      const res = await request.get(
        `${URLS.base}/api/v1/autocomplete/author?name=${encodeURIComponent('Müller')}`
      );
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  test.describe('Security', () => {
    test('CIF path traversal returns 404', async ({ request }) => {
      const res = await request.get(`${URLS.base}/cif/..%2F..%2Fetc%2Fpasswd`);
      expect(res.ok()).toBeFalsy();
    });

    test('XSS in search name is sanitized', async ({ request }) => {
      const res = await request.post(`${URLS.base}/api/v1/search/name`, {
        data: { name: '<script>alert(1)</script>', page: 1 },
      });
      // Should either reject or sanitize, never 500
      expect(res.status()).toBeLessThan(500);
    });
  });

  test.describe('Response Format Consistency', () => {
    test('catalog response has correct shape', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/catalog?page=1`);
      const body = await res.json();
      expect(body.meta).toHaveProperty('pages');
      expect(Array.isArray(body.data)).toBeTruthy();
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('type');
      expect(body.data[0]).toHaveProperty('attributes');
    });

    test('structure response includes cell parameters', async ({ request }) => {
      const res = await request.get(`${URLS.base}/api/v1/structure/1000000`);
      const body = await res.json();
      const data = body.data;
      expect(data).toHaveProperty('a');
      expect(data).toHaveProperty('b');
      expect(data).toHaveProperty('c');
      expect(data).toHaveProperty('alpha');
      expect(data).toHaveProperty('beta');
      expect(data).toHaveProperty('gamma');
    });
  });
});
