module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: true,
    it: true,
    module: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'no-unused-vars': 1,
    'react/no-direct-mutation-state': 1,
    'react/jsx-key': 1,
    'react/no-children-prop': 1,
    'react/display-name': 1,
    'no-async-promise-executor': 1,
    'react/no-deprecated': 1,
  },
};