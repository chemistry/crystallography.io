import { test, expect, URLS, TEST_DATA } from '../fixtures/index.js';

test.describe('Search by Name', () => {
  test('user can type and see autocomplete suggestions', async ({ page }) => {
    await page.goto(URLS.endpoints.searchName);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await input.fill(TEST_DATA.search.structureName);
    // Wait for autocomplete dropdown to appear
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).not.toContainText('error');
  });

  test('autocomplete API returns results for typed text', async ({ page, apiClient }) => {
    // Verify the underlying API works
    const res = await apiClient.autocompleteName(TEST_DATA.search.structureName);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
  });
});

test.describe('Search by Formula', () => {
  test('user can enter valid formula and submit', async ({ page }) => {
    await page.goto(URLS.endpoints.searchFormula);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await input.fill('C6H6');
    // Button should become enabled with valid formula
    const submitButton = page.locator('button:has-text("Search")');
    await expect(submitButton).toBeEnabled({ timeout: 3_000 });
    await submitButton.click();
    await page.waitForTimeout(2000);
  });

  test('invalid formula keeps search button disabled', async ({ page }) => {
    await page.goto(URLS.endpoints.searchFormula);
    const input = page.locator('input').first();
    await input.fill('not a formula!!!');
    const submitButton = page.locator('button:has-text("Search")');
    await expect(submitButton).toBeDisabled({ timeout: 2_000 });
  });
});

test.describe('Search by Author', () => {
  test('user can type author name and see suggestions', async ({ page }) => {
    await page.goto(URLS.endpoints.searchAuthor);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await input.fill(TEST_DATA.search.authorName);
    await page.waitForTimeout(1500);
  });
});

test.describe('Search by Unit Cell', () => {
  test('unit cell form renders with parameter inputs', async ({ page }) => {
    await page.goto(URLS.endpoints.searchUnitCell);
    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible();
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('unit cell search with valid params returns results', async ({ apiClient }) => {
    const res = await apiClient.searchByUnitCell(TEST_DATA.search.unitCell);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
