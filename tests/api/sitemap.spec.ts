import { test, expect } from '../fixtures/index.js';

test.describe('Sitemap', () => {
  test('GET /sitemap.xml returns valid XML', async ({ apiClient }) => {
    const res = await apiClient.getSitemap();
    expect(res.ok()).toBeTruthy();
    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain('xml');
    const body = await res.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('sitemapindex');
  });
});
