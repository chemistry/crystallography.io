import { test, expect } from '../fixtures/index.js';

test.describe('Authors Page', () => {
  test('displays author list with structure counts', async ({ page }) => {
    await page.goto('/authors');
    await expect(page).toHaveTitle(/Crystal/i);
    // Should have author links
    const authorLink = page.locator('a[href*="/author/"]').first();
    await expect(authorLink).toBeVisible({ timeout: 10_000 });
  });

  test('author detail page shows structures', async ({ page }) => {
    await page.goto('/authors');
    const authorLink = page.locator('a[href*="/author/"]').first();
    await expect(authorLink).toBeVisible({ timeout: 10_000 });
    await authorLink.click();
    await page.waitForURL('**/author/**');
    await expect(page).toHaveTitle(/Structures/i);
    await expect(page).not.toHaveTitle(/Error/);
  });
});
