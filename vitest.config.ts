import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts'],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
