import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  configuration,
  decodeConfiguration,
  encodeConfiguration,
  validateConfiguration,
  MAX_CONFIG_LINK_LENGTH,
} from '../lib/configuration-link.ts';
import { DEFAULT_SETTINGS, parseSettings } from '../lib/settings.ts';
import { resolveSymbolMap, validSymbolMap } from '../lib/symbol-map.ts';
import { TypingEngine, layout } from '../lib/typing-engine.ts';

const profile = configuration(
  {
    version: 1,
    languageMapping: {
      order: ['en-AU', 'he'],
      slots: ['pt-BR', 'de-CH', 'pl', 'ru'],
    },
    symbolMap: {
      AC03: {
        primary: { text: '🧑‍💻' },
        secondary: { dead: 'acute' },
        quick: true,
      },
      AE11: { primary: {} },
    },
  },
  { uiLocale: 'ru', keyboardLocale: 'pl', theme: 'system', platform: 'macos' },
);

void test('portable link round-trips Unicode, empty actions, accents and every preference', () => {
  const link = encodeConfiguration(
    profile,
    'https://example.org/demo/ru/?ignored=1#old',
  );
  assert.equal(new URL(link).search, '');
  assert.match(link, /#config=[\w-]+$/u);
  assert.deepEqual(decodeConfiguration(link), profile);
  assert.deepEqual(
    parseSettings(JSON.stringify(profile.settings)),
    profile.settings,
  );
});

void test('default link resolves the actual language map and is independent of browser detection', () => {
  const value = configuration(DEFAULT_SETTINGS, profile.preferences);
  assert.deepEqual(value.settings.languageMapping?.order, ['en', 'ru']);
  assert.deepEqual(value.settings.symbolMap, {});
  assert.deepEqual(
    decodeConfiguration(encodeConfiguration(value, 'https://example.org/')),
    value,
  );
});

const invalidChanges = [
  { version: 2 },
  { base: 'unavailable-base' },
  {
    settings: {
      ...profile.settings,
      symbolMap: { UNKNOWN: { primary: { text: 'a' } } },
    },
  },
  {
    settings: {
      ...profile.settings,
      symbolMap: { AC03: { primary: { dead: 'execute' } } },
    },
  },
  {
    settings: {
      ...profile.settings,
      symbolMap: { AC03: { primary: { text: 'x', dead: 'acute' } } },
    },
  },
  {
    settings: {
      ...profile.settings,
      languageMapping: { order: ['en', 'en'], slots: ['ru'] },
    },
  },
  { preferences: { ...profile.preferences, theme: 'broken' } },
  { execute: 'anything' },
];
for (const [index, change] of invalidChanges.entries()) {
  void test(`invalid portable profile ${index + 1} is rejected atomically`, () => {
    assert.throws(() => validateConfiguration({ ...profile, ...change }));
  });
}
void test('malformed URLs, invalid UTF-8 and oversized input are rejected without fetching', () => {
  for (const link of [
    'javascript:alert(1)',
    'https://example.org/#config=_w',
    'https://example.org/#config=***',
    'x'.repeat(MAX_CONFIG_LINK_LENGTH + 1),
  ]) {
    assert.throws(() => decodeConfiguration(link));
  }
  assert.equal(
    validSymbolMap(JSON.parse('{"__proto__":{"primary":{"text":"x"}}}')),
    false,
  );
  assert.equal(
    validSymbolMap({ AC03: { primary: { text: '\u001b[31m' } } }),
    false,
  );
  assert.equal(
    validSymbolMap({ AC03: { primary: { text: '\ud800' } } }),
    false,
  );
});

function tap(engine: TypingEngine, code: string, key = '') {
  const result = engine.handle({ code, key, down: true }, 'en');
  engine.handle({ code, key, down: false }, 'en');
  return result;
}
void test('custom text, cleared slots, quick chords and dead accents use the same engine map', () => {
  const keys = resolveSymbolMap(profile.settings.symbolMap);
  const engine = new TypingEngine();
  engine.setLayout(keys);
  tap(engine, 'AltLeft');
  assert.equal(tap(engine, 'KeyD').text, '🧑‍💻');
  tap(engine, 'AltLeft');
  assert.equal(tap(engine, 'Minus').text, '');
  engine.handle({ code: 'AltLeft', down: true }, 'en');
  assert.equal(tap(engine, 'KeyD').text, '🧑‍💻');
  engine.handle({ code: 'AltLeft', down: false }, 'en');
  tap(engine, 'AltLeft');
  tap(engine, 'AltLeft');
  tap(engine, 'KeyD');
  assert.equal(engine.accent, 'acute');
  assert.equal(tap(engine, 'KeyA', 'a').text, 'á');
  engine.setLayout(layout);
  tap(engine, 'AltLeft');
  assert.notEqual(tap(engine, 'KeyD').text, '🧑‍💻');
});
void test('custom maps do not leak across engine instances or mutate the canonical layout', () => {
  const first = new TypingEngine();
  first.setLayout(resolveSymbolMap({ AC03: { primary: { text: '🧑‍💻' } } }));
  const second = new TypingEngine();
  tap(second, 'AltLeft');
  assert.notEqual(tap(second, 'KeyD').text, '🧑‍💻');
  assert.notEqual(layout.find((key) => key.key === 'AC03')?.primary.text, '🧑‍💻');
});
