import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';

const PACKAGES = [
  'libraries/cif-2-json',
  'containers/c14-api',
  'containers/c14-web',
  'containers/cod-to-disk',
  'containers/disk-to-db',
  'containers/maintenance',
  'containers/searchrouter',
  'containers/searchworker',
  'containers/structure-to-index',
];

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        project: [
          './tsconfig.eslint.json',
          ...PACKAGES.map((p) => `./packages/${p}/tsconfig.eslint.json`),
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { '@typescript-eslint': tseslint.plugin, prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'], custom: { regex: '^[A-Z]', match: true } },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: { playwright: playwrightPlugin },
    rules: {
      'playwright/missing-playwright-await': 'error',
      'playwright/no-force-option': 'error',
    },
  }
);
