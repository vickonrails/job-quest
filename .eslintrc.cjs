const path = require('path')

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [{
    extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/restrict-plus-operands': 'warn',
      '@typescript-eslint/no-var-requires': 'error'
    },
    parserOptions: {
      project: path.join(__dirname, 'tsconfig.json')
    }
  }],
  root: true,
  parser: '@typescript-eslint/parser',
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
  },
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: path.join(__dirname, 'tsconfig.json')
  },
  settings: {
    web: {
      rootDir: ['apps/web'],
    },
  },
};

module.exports = config;