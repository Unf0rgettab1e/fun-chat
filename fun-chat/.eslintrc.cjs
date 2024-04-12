module.exports = {
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 2,
    'import/extensions': 0,
  },
};
