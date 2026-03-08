import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Global settings for all files
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
  },

  // TypeScript files - strict rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',

      // No any - strict typing
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Type safety - catch unsafe assignments
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],

      // General best practices
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
      'no-misleading-character-class': 'off',
    },
  },

  // React files (c14-web)
  {
    files: ['packages/containers/c14-web/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Test file exceptions - relaxed typing
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Config files - relaxed rules
  {
    files: ['*.config.js', '*.config.ts', '**/*.config.js', '**/*.config.ts', '**/*.config.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
  }
);
