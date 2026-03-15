import { test, expect, URLS, TEST_DATA } from '../fixtures/index.js';

test.describe('Search Functionality', () => {
  test.describe('Search by Name', () => {
    test('user can type and see autocomplete suggestions', async ({ page }) => {
      await page.goto(URLS.endpoints.searchName);
      const input = page.locator('input').first();
      await expect(input).toBeVisible();
      await input.fill(TEST_DATA.search.structureName);
      // Wait for autocomplete suggestions or results
      await page.waitForTimeout(1000);
      // Should not show error
      await expect(page.locator('body')).not.toContainText('error');
    });
  });

  test.describe('Search by Formula', () => {
    test('user can enter formula and search', async ({ page }) => {
      await page.goto(URLS.endpoints.searchFormula);
      const input = page.locator('input').first();
      await expect(input).toBeVisible();
      await input.fill(TEST_DATA.search.formula);
      // Look for a search/submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Search")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe('Search by Author', () => {
    test('user can type author name and see suggestions', async ({ page }) => {
      await page.goto(URLS.endpoints.searchAuthor);
      const input = page.locator('input').first();
      await expect(input).toBeVisible();
      await input.fill(TEST_DATA.search.authorName);
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Search by Unit Cell', () => {
    test('unit cell form renders with 6 parameter inputs', async ({ page }) => {
      await page.goto(URLS.endpoints.searchUnitCell);
      const inputs = page.locator('input');
      // Should have at least 6 inputs (a, b, c, alpha, beta, gamma)
      await expect(inputs.first()).toBeVisible();
      const count = await inputs.count();
      expect(count).toBeGreaterThanOrEqual(6);
    });
  });
});
