import { test, expect, URLS } from '../fixtures/index.js';

test.describe('Search Results Page', () => {
  test('results page renders without React errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Navigate to a search results page (uses a finished search with 0 results)
    await page.goto('/results/69b875f9195a94ba278914b3/1');
    await page.waitForTimeout(3000);

    expect(errors, `Unexpected JS errors: ${errors.join(', ')}`).toHaveLength(0);
    // Page should render the Results header (not be blank from a crash)
    await expect(page.locator('h2:has-text("Results")')).toBeVisible();
  });

  test('results page shows total results count', async ({ page }) => {
    await page.goto('/results/69b875f9195a94ba278914b3/1');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Total Results')).toBeVisible();
  });

  test('main page (structure search) loads MolPad editor', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto(URLS.endpoints.home);
    await page.waitForTimeout(2000);

    // The main page is the structure search page with MolPad and a Search button
    await expect(page.locator('h2:has-text("Crystal Structure Search")')).toBeVisible();
    await expect(page.locator('button:has-text("Search")')).toBeVisible();

    expect(errors, `Unexpected JS errors on home: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('formula search navigates to results without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto(URLS.endpoints.searchFormula);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await input.fill('C6 H6');

    const submitButton = page.locator('button:has-text("Search")');
    await expect(submitButton).toBeEnabled({ timeout: 3_000 });
    await submitButton.click();

    // Wait for results to load (formula search renders inline results)
    await page.waitForTimeout(3000);

    expect(errors, `Unexpected JS errors: ${errors.join(', ')}`).toHaveLength(0);
  });
});
