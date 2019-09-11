module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "react-app",
    "airbnb",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "import/prefer-default-export": 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'object-curly-newline': 0,
  },
};
