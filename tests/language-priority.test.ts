import test from 'node:test';
import assert from 'node:assert/strict';
import { languageComparator } from '../lib/language-priority.ts';
import {
  KEYBOARD_LOCALES,
  LANGUAGES,
  keyboardLabel,
  keyboardLanguage,
  type KeyboardLocale,
} from '../lib/keyboard-locales.ts';

const assigned = ['en', 'ru', 'pl', 'pt', 'es', 'de'] as const;

void test('S0 and S1–S4 precede geographical groups without dropping variants', () => {
  const result = KEYBOARD_LOCALES.toSorted(
    languageComparator('en', assigned, (locale) => keyboardLabel(locale, 'en')),
  );
  assert.deepEqual(result.slice(0, 6), assigned);
  assert.deepEqual(result.slice(-4), ['ar', 'he', 'tr', 'vi']);
  assert.equal(new Set(result).size, KEYBOARD_LOCALES.length);
  assert.ok(result.indexOf('en-AU') >= 6);
});

void test('custom assignments override geography and ignore duplicate slots', () => {
  const priority: KeyboardLocale[] = ['vi', 'ar', 'de-CH', 'vi', 'en', 'ar'];
  const compare = languageComparator('he', priority, (locale) =>
    keyboardLabel(locale, 'he'),
  );
  assert.deepEqual(KEYBOARD_LOCALES.toSorted(compare).slice(0, 4), [
    'vi',
    'ar',
    'de-CH',
    'en',
  ]);
  assert.deepEqual(priority, ['vi', 'ar', 'de-CH', 'vi', 'en', 'ar']);
});

void test('interface priorities collapse regional assignments to base languages', () => {
  const priority: KeyboardLocale[] = ['en-AU', 'en-US', 'pt-BR', 'de-CH'];
  const result = LANGUAGES.toSorted(
    languageComparator('en', priority.map(keyboardLanguage), (locale) =>
      keyboardLabel(locale, 'en'),
    ),
  );
  assert.deepEqual(result.slice(0, 3), ['en', 'pt', 'de']);
});

void test('unassigned languages retain localized alphabetical order within groups', () => {
  const values: KeyboardLocale[] = ['vi', 'he', 'fr', 'ar', 'de', 'tr'];
  assert.deepEqual(
    values.toSorted(
      languageComparator('en', [], (locale) => keyboardLabel(locale, 'en')),
    ),
    ['fr', 'de', 'ar', 'he', 'tr', 'vi'],
  );
});
