import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import unicorn from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import securityPlugin from 'eslint-plugin-security';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // Base ESLint recommended
  js.configs.recommended,

  // Next.js configs (includes React, JSX A11y, React Hooks, TypeScript, and more)
  ...nextConfig,
  ...nextCoreWebVitals,

  // SonarJS
  {
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      ...sonarjsPlugin.configs.recommended.rules,
    },
  },

  // Security
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
    },
  },

  // Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },

  // Use unicorn's non-deprecated flat recommended config
  unicorn.configs.recommended,
  // Core config translated via compat.config (without global TS parser)
  ...compat.config({
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    plugins: ['import-helpers', 'unused-imports', 'react-compiler'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'unicorn/no-await-expression-member': 'off',
      'jsx-a11y/no-redundant-roles': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'spaced-comment': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'security/detect-object-injection': 'off',
      'import/no-extraneous-dependencies': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'no-underscore-dangle': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-global-this': 'off',
      'react/no-danger': 'off',
      'sonarjs/mouse-events-a11y': 'off',
      'sonarjs/media-has-caption': 'off',
      'consistent-return': 'off',
      'import/no-cycle': 'off',
      'sonarjs/no-unstable-nested-components': 'off',
      'react/no-unstable-nested-components': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'sonarjs/jsx-no-useless-fragment': 'off',
      'no-irregular-whitespace': 'off',
      'react-compiler/react-compiler': 'error',

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
        },
      ],

      'unicorn/no-null': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            props: false,
            ref: false,
          },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../**/*', './**/*'],
        },
      ],
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: ['module', '/^@/', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
    overrides: [],
  }),
  // Global ignores, including your requested patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '**/*.css',
      'src/components/ui/**',
      'eslint.config.mjs',
      'postcss.config.mjs',
      'src/lib/utils.ts',
    ],
  },
];
