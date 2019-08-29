'use strict';

/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'script'
  },
  overrides: [{
    files: ['client/**'],
    parserOptions: {
      sourceType: 'module'
    },
    rules: {
      'sort-imports': ['error', { ignoreCase: true }]
    }
  }],
  extends: ['semistandard'],
  rules: {
    strict: ['error', 'safe'],
    // NOTE: Do NOT enforce indentation level for multiline property chains.
    //       See: https://eslint.org/docs/rules/indent#memberexpression
    indent: ['error', 2, {
      SwitchCase: 1,
      MemberExpression: 'off'
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    'arrow-parens': ['error', 'as-needed']
  }
};
