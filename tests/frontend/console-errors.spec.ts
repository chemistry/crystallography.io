import { test, expect, URLS } from '../fixtures/index.js';

// Known issues that are not application bugs
const KNOWN_ERRORS = [
  'ServiceWorker', // SSL cert mismatch in CI/test environments
];

const isKnownError = (msg: string) => KNOWN_ERRORS.some((known) => msg.includes(known));

test.describe('No Console Errors', () => {
  const criticalPages = [
    { name: 'homepage', path: URLS.endpoints.home },
    { name: 'catalog', path: URLS.endpoints.catalog },
    { name: 'authors', path: URLS.endpoints.authors },
    { name: 'structure detail', path: URLS.endpoints.structure },
    { name: 'search name', path: URLS.endpoints.searchName },
    { name: 'search results', path: '/results/69b875f9195a94ba278914b3/1' },
    { name: 'about', path: URLS.endpoints.about },
  ];

  for (const { name, path } of criticalPages) {
    test(`${name} page has no unexpected JS errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        if (!isKnownError(error.message)) {
          errors.push(error.message);
        }
      });

      await page.goto(path);
      await page.waitForTimeout(2000);

      expect(errors, `Unexpected JS errors on ${name}: ${errors.join(', ')}`).toHaveLength(0);
    });
  }
});
