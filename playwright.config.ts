import { defineConfig } from '@playwright/test';

// eslint-disable-next-line
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'html',
  fullyParallel: true,
  use: {
    baseURL: process.env.BASE_URL || 'https://crystallography.io',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      ...(process.env.HOST_HEADER ? { Host: process.env.HOST_HEADER } : {}),
    },
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { browserName: 'chromium' },
    },
    {
      name: 'frontend',
      testDir: './tests/frontend',
      use: { browserName: 'chromium' },
    },
  ],
});
