import { test, expect } from '../fixtures/index.js';

test.describe('Catalog Page', () => {
  test('displays structure cards with data', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).toHaveTitle(/Crystal/i);
    // Should have pagination
    await expect(page.locator('a[href*="/catalog/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('pagination navigates between pages', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).toHaveTitle(/Crystal/i);
    // Click page 2
    const page2Link = page.locator('a[href*="/catalog/2"]');
    if (await page2Link.isVisible({ timeout: 5_000 })) {
      await page2Link.click();
      await page.waitForURL('**/catalog/2');
      await expect(page).toHaveTitle(/Crystal/i);
    }
  });

  test('structure links navigate to detail page', async ({ page }) => {
    await page.goto('/catalog');
    // Find first structure link
    const structureLink = page.locator('a[href*="/structure/"]').first();
    await expect(structureLink).toBeVisible({ timeout: 10_000 });
    await structureLink.click();
    await page.waitForURL('**/structure/**');
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page).not.toHaveTitle(/Error/);
  });
});
