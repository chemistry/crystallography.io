import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('Structure Detail Page', () => {
  test('displays structure information', async ({ page }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    await expect(page).toHaveTitle(/Crystal/i);
    // Page should load without timeout
    await expect(page.locator('body')).not.toContainText('503');
    await expect(page.locator('body')).not.toContainText('Service Unavailable');
  });

  test('has CIF download link', async ({ page }) => {
    await page.goto(`/structure/${TEST_DATA.knownStructureId}`);
    // Look for a download link or button
    const downloadLink = page.locator('a[href*="cif"], button:has-text("Download"), a:has-text("CIF")');
    // The link should exist even if download is broken
    await expect(downloadLink.first()).toBeVisible({ timeout: 10_000 });
  });
});
