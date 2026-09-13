import test from 'node:test';
import assert from 'node:assert/strict';
import maps from '../lib/national-layouts.json' with { type: 'json' };
import {
  TypingEngine,
  baseKey,
  nationalKeyAction,
  actionLabel,
  accentKeyLabel,
  keyMap,
  type Action,
} from '../lib/typing-engine.ts';
import { getKeyboardRows } from '../lib/keyboard.ts';

const variants = Object.keys(maps) as (keyof typeof maps)[];
const fixtures = [
  ['fr', 'KeyQ', 'a', 'A'],
  ['fr', 'KeyW', 'z', 'Z'],
  ['fr', 'Semicolon', 'm', 'M'],
  ['fr', 'Digit2', 'é', '2'],
  ['de', 'KeyY', 'z', 'Z'],
  ['de', 'KeyZ', 'y', 'Y'],
  ['de', 'BracketLeft', 'ü', 'Ü'],
  ['de', 'Minus', 'ß', '?'],
  ['es', 'Semicolon', 'ñ', 'Ñ'],
  ['es', 'Equal', '¡', '¿'],
  ['pt', 'Semicolon', 'ç', 'Ç'],
  ['pt', 'Quote', 'º', 'ª'],
  ['it', 'BracketLeft', 'è', 'é'],
  ['it', 'Quote', 'à', '°'],
] as const;
for (const [locale, code, plain, shifted] of fixtures) {
  void test(`${locale} base positions ${code}`, () => {
    assert.equal(baseKey(code, locale), plain);
    assert.equal(baseKey(code, locale, true), shifted);
  });
}
for (const locale of variants) {
  void test(`${locale} has complete physical positions and every modifier state`, () => {
    for (const code of [...keyMap.keys(), 'IntlBackslash']) {
      const actions = (maps[locale] as Record<string, Action[]>)[code];
      assert.equal(actions.length, 8, code);
      for (const action of actions) {
        if (action.dead) {
          assert.ok(actionLabel(action).startsWith('◌'));
        }
      }
    }
    for (const platform of ['linux', 'windows', 'macos'] as const) {
      const rows = getKeyboardRows(platform, locale);
      assert.equal(
        rows[3].filter((key) => key.code === 'IntlBackslash').length,
        ['he', 'ar', 'vi'].includes(locale) ? 0 : 1,
      );
      assert.equal(
        rows[3].reduce((sum, key) => sum + (key.width || 1), 0),
        getKeyboardRows(platform, 'en')[3].reduce(
          (sum, key) => sum + (key.width || 1),
          0,
        ),
      );
    }
  });
}

const modifierStates = [
  { shift: false, caps: false, index: 2 },
  { shift: true, caps: false, index: 3 },
  { shift: false, caps: true, index: 6 },
  { shift: true, caps: true, index: 7 },
];
const nationalScenarios = variants.flatMap((locale) =>
  modifierStates.flatMap((state) => [
    { locale, ...state, alt: 'AltLeft' },
    { locale, ...state, alt: 'AltRight' },
  ]),
);
for (const { locale, alt, shift, caps, index } of nationalScenarios) {
  void test(`${locale}: national ${alt}, shift=${shift}, caps=${caps}`, () => {
    for (const [code, actions] of Object.entries(maps[locale])) {
      const action: Action = actions[index];
      if (
        (!action.text && !action.dead) ||
        (keyMap.get(code)?.quick && !shift)
      ) {
        continue;
      }
      const engine = new TypingEngine();
      engine.handle({ code: alt, down: true }, locale);
      const result = engine.handle(
        { code, down: true, shiftKey: shift, capsLock: caps },
        locale,
      );
      assert.deepEqual(
        { route: result.route, text: result.text, accent: engine.accent },
        {
          route: 'national',
          text: action.text || '',
          accent: action.dead || null,
        },
        code,
      );
      engine.handle({ code, down: false }, locale);
      engine.handle({ code: alt, down: false }, locale);
      assert.equal(engine.pending, 0, code);
    }
  });
}
const shortcutScenarios = variants.flatMap((locale) => [
  { locale, alt: 'AltLeft' },
  { locale, alt: 'AltRight' },
]);
for (const { locale, alt } of shortcutScenarios) {
  void test(`${locale}: ${alt} shortcuts bypass national output`, () => {
    const engine = new TypingEngine();
    engine.handle({ code: 'ControlLeft', down: true }, locale);
    engine.handle({ code: alt, down: true }, locale);
    const result = engine.handle(
      { code: 'KeyQ', key: 'q', down: true, ctrlKey: true },
      locale,
    );
    assert.equal(result.route, 'pass');
    assert.equal(result.text, undefined);
  });
}
void test('vowel preview supports Western European diacritics without treating й as a vowel', () => {
  for (const letter of 'àâèéêëîïôöùûüÿáíóúãõÀÂÈÉÊËÎÏÔÖÙÛÜŸÁÍÓÚÃÕ') {
    assert.equal(
      accentKeyLabel(letter, 'acute'),
      (letter + '\u0301').normalize('NFC'),
    );
  }
  for (const letter of 'йЙçÇñÑß') {
    assert.equal(accentKeyLabel(letter, 'acute'), letter);
  }
});
void test('national dead keys compose and reset', () => {
  for (const [locale, code, letter, expected] of [
    ['fr', 'BracketLeft', 'e', 'ê'],
    ['es', 'Quote', 'a', 'á'],
    ['pt', 'Backslash', 'a', 'ã'],
  ] as const) {
    const engine = new TypingEngine();
    engine.accent = nationalKeyAction(code, locale).dead!;
    const result = engine.handle(
      { code: 'KeyA', key: letter, down: true },
      locale,
    );
    assert.equal(result.text, expected);
    assert.equal(engine.accent, null);
    engine.reset();
    assert.equal(engine.accent, null);
  }
});

void test('Romanian Programmer has modern comma-below letters in both cases', () => {
  for (const [code, lower, upper] of [
    ['KeyA', 'ă', 'Ă'],
    ['KeyQ', 'â', 'Â'],
    ['KeyI', 'î', 'Î'],
    ['KeyS', 'ș', 'Ș'],
    ['KeyT', 'ț', 'Ț'],
  ]) {
    assert.equal(nationalKeyAction(code, 'ro', false, false, true).text, lower);
    assert.equal(nationalKeyAction(code, 'ro', true, false, true).text, upper);
  }
  assert.equal(baseKey('KeyY', 'ro'), 'y');
  assert.equal(baseKey('KeyZ', 'ro'), 'z');
  assert.equal(/[şţŞŢ]/u.test(JSON.stringify(maps.ro)), false);
  for (const letter of 'ăâîĂÂÎ') {
    assert.equal(
      accentKeyLabel(letter, 'acute'),
      (letter + '\u0301').normalize('NFC'),
    );
  }
});
