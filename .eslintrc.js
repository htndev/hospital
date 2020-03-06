module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-duplicate-imports': 'error',
    'newline-after-var': ['warn', 'always'],
    eqeqeq: ['error', 'always'],
    'no-trailing-spaces': 'error',
    'no-alert': 'error',
    'no-extra-semi': 'warn',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off'
  },

  extends: [
    'plugin:vue/essential',
    '@vue/typescript/recommended',
    '@vue/typescript'
  ]
};
