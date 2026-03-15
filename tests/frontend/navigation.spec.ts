import { test, expect, URLS } from '../fixtures/index.js';

test.describe('Page Navigation', () => {
  test('homepage loads with search form', async ({ page }) => {
    await page.goto(URLS.endpoints.home);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page.locator('.app')).toBeVisible();
  });

  test('catalog page loads with structure list', async ({ page }) => {
    await page.goto(URLS.endpoints.catalog);
    // SSR error pages have title "Error" — verify we get the real page
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('authors page loads with author list', async ({ page }) => {
    await page.goto(URLS.endpoints.authors);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('structure detail page loads', async ({ page }) => {
    await page.goto(URLS.endpoints.structure);
    await expect(page).toHaveTitle(/Crystal/i);
    await expect(page).not.toHaveTitle(/Error/);
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
      await expect(page).not.toHaveTitle(/Error/);
    }
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/nonexistent-route-xyz');
    await expect(page.locator('body')).toContainText(/not found/i);
  });
});
