'use strict';

const { CLIEngine } = require('eslint');
const configFile = require.resolve('.');
const dedent = require('dedent');
const test = require('tape');

const linter = new CLIEngine({ configFile });

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

test('prefer `const`', t => {
  t.plan(3);
  const { results } = linter.executeOnText(code`
    let foo = 'bar';
    console.log(foo);
  `);
  t.is(results.length, 1);
  t.is(results[0].messages.length, 1);
  t.is(results[0].messages[0].message, `'foo' is never reassigned. Use 'const' instead.`);
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
