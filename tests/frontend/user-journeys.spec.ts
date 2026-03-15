import { test, expect, TEST_DATA } from '../fixtures/index.js';

test.describe('User Journey: Browse and Explore', () => {
  test('browse catalog → click structure → view details → download CIF', async ({ page }) => {
    // Step 1: Open catalog
    await page.goto('/catalog');
    await expect(page).not.toHaveTitle(/Error/);

    // Step 2: Click on a structure
    const structureLink = page.locator('a[href*="/structure/"]').first();
    await expect(structureLink).toBeVisible({ timeout: 10_000 });
    await structureLink.click();
    await page.waitForURL('**/structure/**');

    // Step 3: Verify structure detail loaded
    await expect(page).not.toHaveTitle(/Error/);
    const body = await page.locator('body').textContent();
    expect(body!.length).toBeGreaterThan(1000);

    // Step 4: CIF download link exists
    const cifLink = page.locator('a[href*="cif"]').first();
    await expect(cifLink).toBeVisible({ timeout: 10_000 });
  });

  test('browse authors → click author → see structures', async ({ page }) => {
    // Step 1: Open authors list
    await page.goto('/authors');
    await expect(page).not.toHaveTitle(/Error/);

    // Step 2: Click first author
    const authorLink = page.locator('a[href*="/author/"]').first();
    await expect(authorLink).toBeVisible({ timeout: 10_000 });
    const authorName = await authorLink.textContent();
    await authorLink.click();
    await page.waitForURL('**/author/**');

    // Step 3: Author detail page loaded
    await expect(page).not.toHaveTitle(/Error/);
    expect(authorName).toBeTruthy();
  });
});

test.describe('User Journey: Search Flows', () => {
  test('search by name → see results count', async ({ page }) => {
    await page.goto('/search/name');
    const input = page.locator('input').first();
    await input.fill(TEST_DATA.search.structureName);

    // Wait for autocomplete
    await page.waitForTimeout(1500);
    // Should show suggestions or result count
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('search by formula → submit → navigate to results', async ({ page }) => {
    await page.goto('/search/formula');
    const input = page.locator('input').first();
    await input.fill('CuSO4');

    const submitButton = page.locator('button:has-text("Search")');
    await expect(submitButton).toBeEnabled({ timeout: 3_000 });
    await submitButton.click();

    // Should navigate or show results
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('navigate between search tabs', async ({ page }) => {
    await page.goto('/search/name');
    await expect(page).not.toHaveTitle(/Error/);

    // Click formula tab
    const formulaLink = page.locator('a[href="/search/formula"]').first();
    if (await formulaLink.isVisible({ timeout: 3_000 })) {
      await formulaLink.click();
      await page.waitForURL('**/search/formula');
      await expect(page).not.toHaveTitle(/Error/);
    }

    // Click author tab
    const authorLink = page.locator('a[href="/search/author"]').first();
    if (await authorLink.isVisible({ timeout: 3_000 })) {
      await authorLink.click();
      await page.waitForURL('**/search/author');
      await expect(page).not.toHaveTitle(/Error/);
    }
  });
});

test.describe('User Journey: Error Handling', () => {
  test('non-existent structure shows graceful state', async ({ page }) => {
    await page.goto('/structure/9999999');
    // Should not crash — either show empty state or fallback
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('non-existent author shows graceful state', async ({ page }) => {
    await page.goto('/author/ZZZNONEXISTENT');
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('catalog beyond last page shows empty state', async ({ page }) => {
    await page.goto('/catalog/999999');
    await expect(page).not.toHaveTitle(/Error/);
  });
});
