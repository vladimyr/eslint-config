'use strict';

const { CLIEngine } = require('eslint');
const config = require('.');
const dedent = require('dedent');
const test = require('tape');

const [esmConfig] = config.overrides;
const linter = new CLIEngine({
  ...config,
  parserOptions: {
    ...config.parserOptions,
    ...esmConfig.parserOptions
  },
  rules: {
    ...config.rules,
    ...esmConfig.rules
  }
});

const code = str => dedent(str) + '\n';

test('require semicolons', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    console.log('hello world')
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, 'Missing semicolon.');
});

test('check indent', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    const foo = {
      bar: 1,
    baz: 2
    };
    console.log(foo);
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, 'Expected indentation of 2 spaces but found 0.');
});

test('prefer `const`', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    let foo = 'bar';
    console.log(foo);
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, "'foo' is never reassigned. Use 'const' instead.");
});

test('require space before anonymous functions', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    setTimeout(function() {
      log('hello world');
    }, 2000);

    function log(message) {
      console.log(message);
    }
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, 'Missing space before function parentheses.');
});

test('disallow unnecessary arrow parens', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    const identity = (arg) => arg;
    console.log(identity('hello world'));
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, 'Unexpected parentheses around single function argument.');
});

test('require imports to be sorted alphabetically', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    import os from 'os';
    import { inspect } from 'util';

    console.log(inspect(os.EOL));
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, 'Imports should be sorted alphabetically.');
});
