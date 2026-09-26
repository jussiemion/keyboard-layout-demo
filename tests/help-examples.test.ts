import test from 'node:test';
import assert from 'node:assert/strict';
import { helpExamples } from '../lib/help-examples.ts';
import { KEYBOARD_LOCALES } from '../lib/keyboard-locales.ts';
import { nextDiacritic } from '../lib/typing-engine.ts';

for (const locale of KEYBOARD_LOCALES) {
  void test(`cheat-sheet example is typeable in its labelled map: ${locale}`, () => {
    const sample = helpExamples(locale);
    const map =
      sample.language === locale.split('-')[0] ? locale : sample.language;
    const letters = sample.cycle.split(' → ');
    assert.ok(letters.length > 1);
    assert.equal(nextDiacritic(sample.letter, map), letters[1]);
    assert.equal(nextDiacritic(letters[1], map, -1), sample.letter);
  });
}
void test('Russian direct letters use a labelled Polish example instead', () => {
  assert.equal(helpExamples('ru').language, 'pl');
});
