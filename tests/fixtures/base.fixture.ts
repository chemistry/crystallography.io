import { test as base, expect } from '@playwright/test';
import { ApiClient } from './api.client.js';

export interface TestFixtures {
  apiClient: ApiClient;
}

export const test = base.extend<TestFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect };
