import globals from 'globals'
import cypress from 'eslint-plugin-cypress'

export default [
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      cypress,
    },
    rules: {
      quotes: ['error', 'single'],
      indent: ['error', 2],
      semi: ['error', 'never'],
      'eol-last': ['error', 'always'],
    },
  },
  {
    plugins: {
      cypress,
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
    },
  },
]