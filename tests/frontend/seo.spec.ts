import { test, expect, URLS } from '../fixtures/index.js';

test.describe('SEO & Meta Tags', () => {
  test('homepage has correct meta description', async ({ page }) => {
    await page.goto(URLS.endpoints.home);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(10);
  });

  test('structure detail has title with Crystal', async ({ page }) => {
    await page.goto(URLS.endpoints.structure);
    await expect(page).toHaveTitle(/Crystal/i);
  });

  test('catalog page has proper title', async ({ page }) => {
    await page.goto(URLS.endpoints.catalog);
    await expect(page).toHaveTitle(/Crystal.*List/i);
  });

  test('authors page has proper title', async ({ page }) => {
    await page.goto(URLS.endpoints.authors);
    await expect(page).toHaveTitle(/Crystallographer/i);
  });

  test('sitemap is valid and contains all page types', async ({ request }) => {
    const res = await request.get(`${URLS.base}/sitemap/sitemap_s.xml`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    // Should have all main pages
    expect(body).toContain('crystallography.io/');
    expect(body).toContain('/search/');
    expect(body).toContain('/authors');
    expect(body).toContain('/catalog');
    expect(body).toContain('/about');
  });

  test('PWA manifest is valid JSON', async ({ request }) => {
    const res = await request.get(`${URLS.base}/manifest.webmanifest`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.name).toBeTruthy();
  });
});
