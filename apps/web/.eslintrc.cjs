// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [{
    extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
    parserOptions: {
      project: path.join(__dirname, 'tsconfig.json')
    }
  }],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  },
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['warn', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports'
    }],
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_'
    }],
    'jsx-quotes': ['error', 'prefer-double'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'no-console': 'error',
    '@typescript-eslint/no-misused-promises': [2, {
      'checksVoidReturn': {
        'attributes': false
      }
    }]
  }
};
module.exports = config;