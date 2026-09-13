import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { lint } from 'markdownlint/sync';
import { applyFixes } from 'markdownlint';
import rules from '../tools/markdownlint-rules.mjs';

function check(text: string) {
  return lint({
    strings: { document: text },
    config: { default: false, GHA001: true },
    customRules: rules,
  }).document;
}

for (const source of [
  '> [!NOTE] Keep this text.',
  '> [!TIP]\n> Keep this text.',
]) {
  void test(`repair alert layout: ${source}`, () => {
    const errors = check(source);
    assert.equal(errors.length, 1);
    const fixed = applyFixes(source, errors);
    assert.match(fixed, /^> \[!(NOTE|TIP)\]\n>\n> Keep this text\.$/);
    assert.equal(check(fixed).length, 0);
    const formatted = execFileSync(
      'node_modules/.bin/oxfmt',
      ['--stdin-filepath', 'README.md'],
      { input: fixed, encoding: 'utf8' },
    );
    assert.equal(check(formatted).length, 0);
    assert.match(formatted, /^> \[!(NOTE|TIP)\]\n>\n> Keep this text\./);
  });
}

void test('valid alerts and quoted code examples remain untouched', () => {
  assert.equal(check('> [!WARNING]\n>\n> Read this.').length, 0);
  assert.equal(check('```md\n> [!NOTE] Example only.\n```').length, 0);
});
