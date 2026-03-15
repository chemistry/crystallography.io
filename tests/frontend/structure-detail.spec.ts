import { test, expect, TEST_DATA, URLS } from '../fixtures/index.js';

test.describe('Structure Detail Page', () => {
  test('displays structure information with title', async ({ page }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('shows crystallographic data fields', async ({ page }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    await expect(page).not.toHaveTitle(/Error/);
    // Page should contain unit cell parameters or formula
    const body = await page.locator('body').textContent();
    // Structure pages typically show cell parameters
    expect(body).toBeTruthy();
    expect(body!.length).toBeGreaterThan(1000);
  });

  test('has CIF download link', async ({ page }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    await expect(page).not.toHaveTitle(/Error/);
    const downloadLink = page.locator('a[href*="cif"]').first();
    await expect(downloadLink).toBeVisible({ timeout: 10_000 });
  });

  test('CIF download link returns valid file', async ({ page, request }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    await expect(page).not.toHaveTitle(/Error/);
    const downloadLink = page.locator('a[href*="cif"]').first();
    const href = await downloadLink.getAttribute('href');
    expect(href).toBeTruthy();

    const res = await request.get(`${URLS.base}${href}`);
    expect(res.ok()).toBeTruthy();
    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain('chemical/x-cif');
  });
});
