import { test, expect, URLS } from '../fixtures/index.js';

test.describe('Page Navigation', () => {
  test('homepage loads with search form', async ({ page }) => {
    await page.goto(URLS.endpoints.home);
    await expect(page).toHaveTitle(/Crystal/i);
    // App renders with aside navigation and main content
    await expect(page.locator('.app')).toBeVisible();
  });

  test('catalog page loads with structure list', async ({ page }) => {
    await page.goto(URLS.endpoints.catalog);
    await expect(page).toHaveTitle(/Crystal/i);
    // Should render content, not error
    await expect(page.locator('body')).not.toContainText('503');
    await expect(page.locator('body')).not.toContainText('Service Unavailable');
  });

  test('authors page loads with author list', async ({ page }) => {
    await page.goto(URLS.endpoints.authors);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page.locator('body')).not.toContainText('503');
  });

  test('structure detail page loads', async ({ page }) => {
    await page.goto(URLS.endpoints.structure);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page.locator('body')).not.toContainText('503');
  });

  test('about page loads', async ({ page }) => {
    await page.goto(URLS.endpoints.about);
    await expect(page).toHaveTitle(/About/i);
  });

  test('search pages load', async ({ page }) => {
    for (const path of [
      URLS.endpoints.searchName,
      URLS.endpoints.searchFormula,
      URLS.endpoints.searchAuthor,
      URLS.endpoints.searchUnitCell,
    ]) {
      await page.goto(path);
      await expect(page.locator('body')).not.toContainText('503');
    }
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/nonexistent-route-xyz');
    await expect(page.locator('body')).toContainText(/not found/i);
  });
});
