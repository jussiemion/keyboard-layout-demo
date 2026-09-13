import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TypingEngine,
  KEYBOARD_LOCALES,
  layout,
  accents,
  baseKey,
  actionLabel,
  accentKeyLabel,
  replaceSelection,
  deleteBackward,
  type KeyboardLocale,
} from '../lib/typing-engine.ts';

function press(
  engine: TypingEngine,
  code: string,
  locale: KeyboardLocale = 'en',
  key = baseKey(code, locale),
) {
  const result = engine.handle({ code, key, down: true }, locale);
  engine.handle({ code, key, down: false }, locale);
  return result;
}
function taps(engine: TypingEngine, count: number, alt = 'AltLeft') {
  for (let i = 0; i < count; i++) {
    press(engine, alt);
  }
}

// Each scenario checks all physical positions against the configured layer.
const prefixScenarios = KEYBOARD_LOCALES.flatMap((locale) => [
  { locale, alt: 'AltLeft', taps: 1, layer: 'primary' as const },
  { locale, alt: 'AltRight', taps: 1, layer: 'primary' as const },
  { locale, alt: 'AltLeft', taps: 2, layer: 'secondary' as const },
  { locale, alt: 'AltRight', taps: 2, layer: 'secondary' as const },
]);
for (const scenario of prefixScenarios) {
  void test(`${scenario.locale}: ${scenario.alt}, ${scenario.layer} layer`, () => {
    for (const entry of layout) {
      const engine = new TypingEngine();
      taps(engine, scenario.taps, scenario.alt);
      const result = press(engine, entry.code, scenario.locale);
      const action = entry[scenario.layer];
      assert.deepEqual(
        {
          text: result.text,
          accent: engine.accent,
          pending: engine.pending,
          prevent: result.prevent,
        },
        {
          text: action.text || '',
          accent: action.dead || null,
          pending: 0,
          prevent: true,
        },
        entry.code,
      );
    }
  });
}

// Independent examples also catch accidental changes to the layout data.
for (const example of [
  { code: 'KeyC', taps: 1, text: '©' },
  { code: 'Minus', taps: 1, text: '—' },
  { code: 'Slash', taps: 2, accent: 'acute' },
]) {
  void test(`reference symbol: ${example.code}, Alt × ${example.taps}`, () => {
    const engine = new TypingEngine();
    taps(engine, example.taps);
    assert.equal(press(engine, example.code).text, example.text ?? '');
    assert.equal(engine.accent, example.accent ?? null);
  });
}
void test('snapshot has 48 unique physical positions and exactly four quick chords', () => {
  assert.equal(layout.length, 48);
  assert.equal(new Set(layout.map((key) => key.code)).size, 48);
  assert.deepEqual(
    layout.filter((key) => key.quick).map((key) => key.code),
    ['Minus', 'Comma', 'Period', 'Slash'],
  );
});
for (const alt of ['AltLeft', 'AltRight']) {
  void test(`${alt}: held chord has priority and cannot arm a prefix`, () => {
    for (const [code, text] of [
      ['Minus', '—'],
      ['Slash', '…'],
      ['Comma', '«'],
      ['Period', '»'],
    ]) {
      const engine = new TypingEngine();
      engine.handle({ code: alt, down: true });
      assert.equal(press(engine, code).text, text);
      engine.handle({ code: alt, down: false });
      assert.equal(engine.pending, 0);
    }
  });
  void test(`${alt}: second Alt may overlap the symbol`, () => {
    const engine = new TypingEngine();
    taps(engine, 1, alt);
    engine.handle({ code: alt, down: true });
    assert.equal(press(engine, 'KeyC').text, '¢');
    engine.handle({ code: alt, down: false });
    assert.equal(engine.pending, 0);
  });
  void test(`${alt}: shortcuts pass through and do not arm`, () => {
    for (const code of ['KeyF', 'Tab', 'ArrowLeft']) {
      const engine = new TypingEngine();
      engine.handle({ code: alt, down: true });
      assert.equal(press(engine, code).prevent, false);
      engine.handle({ code: alt, down: false });
      assert.equal(engine.pending, 0);
    }
  });
}
for (const code of [
  'ControlLeft',
  'ControlRight',
  'MetaLeft',
  'MetaRight',
  'Escape',
  'Tab',
  'Enter',
  'Backspace',
  'ArrowLeft',
  'Home',
]) {
  void test(`${code} cancels prefix and accent, passes through`, () => {
    const engine = new TypingEngine();
    engine.accent = 'acute';
    taps(engine, 1);
    assert.equal(press(engine, code).prevent, false);
    assert.equal(engine.pending, 0);
    assert.equal(engine.accent, null);
  });
}
void test('Shift keys are ordinary; no two-Shift toggle or secondary mode', () => {
  const engine = new TypingEngine();
  engine.handle({ code: 'ShiftLeft', down: true });
  engine.handle({ code: 'ShiftRight', down: true });
  assert.equal(press(engine, 'KeyC').prevent, false);
  taps(engine, 1);
  assert.equal(press(engine, 'KeyC').text, '©');
});
void test('overlapping Alt keys are not separate taps', () => {
  const engine = new TypingEngine();
  for (const down of [true, false]) {
    for (const code of ['AltLeft', 'AltRight']) {
      engine.handle({ code, down });
    }
  }
  assert.equal(engine.pending, 0);
});
void test('autorepeat of an existing key preserves a pending prefix', () => {
  const engine = new TypingEngine();
  engine.handle({ code: 'KeyA', down: true });
  taps(engine, 1);
  assert.equal(
    engine.handle({ code: 'KeyA', down: true, repeat: true }).prevent,
    false,
  );
  assert.equal(engine.pending, 1);
  assert.equal(press(engine, 'KeyC').text, '©');
});
void test('consumed key repeat/release is suppressed', () => {
  const engine = new TypingEngine();
  taps(engine, 1);
  engine.handle({ code: 'KeyC', down: true });
  assert.equal(
    engine.handle({ code: 'KeyC', down: true, repeat: true }).route,
    'suppress',
  );
  assert.equal(engine.handle({ code: 'KeyC', down: false }).prevent, true);
});
void test('prefix survives elapsed time until the next key', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'] });
  const engine = new TypingEngine();
  taps(engine, 1);
  t.mock.timers.tick(60 * 60 * 1000);
  assert.equal(engine.pending, 1);
  assert.equal(press(engine, 'KeyC').text, '©');
});

for (const [code, letter] of Object.entries({
  KeyA: 'ą',
  KeyC: 'ć',
  KeyE: 'ę',
  KeyL: 'ł',
  KeyN: 'ń',
  KeyO: 'ó',
  KeyS: 'ś',
  KeyX: 'ź',
  KeyZ: 'ż',
})) {
  void test(`Polish national ${letter}, both Alt keys and cases`, () => {
    for (const alt of ['AltLeft', 'AltRight']) {
      for (const shiftKey of [false, true]) {
        const engine = new TypingEngine();
        engine.handle({ code: alt, down: true });
        assert.equal(
          engine.handle({ code, down: true, shiftKey }, 'pl').text,
          shiftKey ? letter.toUpperCase() : letter,
        );
      }
    }
  });
}
for (const [accent, value] of Object.entries(accents)) {
  for (const letter of 'aeiouyаеёиоуыэюяАЕЁИОУЫЭЮЯąęóĄĘÓ') {
    void test(`${accent} before ${letter}`, () => {
      const engine = new TypingEngine();
      taps(engine, 2);
      const entry = layout.find((key) => key.secondary.dead === accent)!;
      press(engine, entry.code);
      assert.equal(
        press(engine, 'KeyA', 'ru', letter).text,
        (letter + value.mark).normalize('NFC'),
      );
      assert.equal(engine.accent, null);
    });
  }
}
void test('acute followed by Polish national letters', () => {
  for (const [code, text] of [
    ['KeyA', 'ą́'],
    ['KeyE', 'ę́'],
    ['KeyO', 'ó́'],
  ]) {
    const engine = new TypingEngine();
    taps(engine, 2);
    press(engine, 'Slash');
    engine.handle({ code: 'AltLeft', down: true });
    assert.equal(press(engine, code, 'pl').text, text);
  }
});
void test('fractions retain all three code points and NBSP is exact', () => {
  for (const [code, points] of [
    ['Digit2', [0xb9, 0x2044, 0x2082]],
    ['Digit3', [0xb9, 0x2044, 0x2083]],
    ['Digit4', [0xb9, 0x2044, 0x2084]],
  ] as const) {
    const engine = new TypingEngine();
    taps(engine, 2);
    assert.deepEqual(
      Array.from(press(engine, code).text!, (c) => c.codePointAt(0)),
      points,
    );
  }
  const engine = new TypingEngine();
  taps(engine, 1);
  assert.equal(press(engine, 'Space').text, '\u00a0');
});
void test('focus/source/session reset clears held keys and pending accents', () => {
  const engine = new TypingEngine();
  taps(engine, 2);
  press(engine, 'Slash');
  engine.handle({ code: 'AltLeft', down: true });
  engine.reset();
  engine.handle({ code: 'AltLeft', down: false });
  assert.equal(engine.pending, 0);
  assert.equal(engine.accent, null);
  assert.equal(engine.held.size, 0);
});
void test('synthetic events do not affect state', () => {
  const engine = new TypingEngine();
  engine.handle({ code: 'AltLeft', down: true, synthetic: true });
  assert.equal(engine.held.size, 0);
});
void test('ordinary input is passed to browser, empty assignments consume without inserting', () => {
  const engine = new TypingEngine();
  assert.equal(press(engine, 'KeyA', 'ru', 'ф').prevent, false);
  taps(engine, 1);
  assert.equal(press(engine, 'KeyQ').text, '');
  assert.equal(engine.pending, 0);
});
void test('virtual letters use selected language and Shift/CapsLock', () => {
  assert.equal(baseKey('KeyC', 'ru'), 'с');
  assert.equal(baseKey('KeyC', 'en'), 'c');
  assert.equal(baseKey('KeyC', 'pl', true), 'C');
  assert.equal(baseKey('KeyC', 'ru', true, true), 'с');
  assert.equal(baseKey('Digit3', 'ru', true), '№');
  assert.equal(baseKey('Space', 'ru'), ' ');
  assert.equal(actionLabel({ dead: 'acute' }), '◌́');
});
void test('insertion replaces only the selection and preserves exact Unicode', () => {
  assert.deepEqual(replaceSelection('abc', 1, 2, '¹⁄₂'), {
    value: 'a¹⁄₂c',
    caret: 4,
  });
  assert.deepEqual(deleteBackward('о́', 2, 2), { value: '', caret: 0 });
  assert.deepEqual(deleteBackward('a🙂', 3, 3), { value: 'a', caret: 1 });
});

void test('mode selection and reset follow the three typing states', () => {
  const engine = new TypingEngine();
  assert.equal(engine.mode, 0);
  engine.selectMode(1);
  assert.equal(engine.mode, 1);
  engine.selectMode(2);
  assert.equal(engine.mode, 2);
  engine.reset();
  assert.equal(engine.mode, 0);
});

void test('Polish keycap labels show national letters while Alt is held', () => {
  const letters = {
    KeyA: 'ą',
    KeyC: 'ć',
    KeyE: 'ę',
    KeyL: 'ł',
    KeyN: 'ń',
    KeyO: 'ó',
    KeyS: 'ś',
    KeyX: 'ź',
    KeyZ: 'ż',
  };
  for (const [code, letter] of Object.entries(letters)) {
    assert.equal(baseKey(code, 'pl', false, false, true), letter);
    assert.equal(baseKey(code, 'pl', true, false, true), letter.toUpperCase());
    assert.equal(baseKey(code, 'pl', false, true, true), letter.toUpperCase());
    assert.equal(baseKey(code, 'pl', true, true, true), letter);
    assert.equal(
      baseKey(code, 'pl', false, false, false),
      code.slice(3).toLowerCase(),
    );
  }
  assert.equal(baseKey('KeyQ', 'pl', false, false, true), 'q');
  assert.equal(baseKey('KeyL', 'en', false, false, true), 'l');
  assert.equal(baseKey('KeyL', 'ru', false, false, true), 'д');
});

void test('armed acute previews vowels in both cases without consuming the accent', () => {
  const engine = new TypingEngine();
  taps(engine, 2);
  press(engine, 'Slash');
  assert.equal(engine.accent, 'acute');
  for (const vowel of 'aeiouyąęóаеёиоуыэюя') {
    for (const letter of [vowel, vowel.toUpperCase()]) {
      assert.equal(
        accentKeyLabel(letter, engine.accent),
        (letter + '\u0301').normalize('NFC'),
      );
    }
  }
  assert.equal(engine.accent, 'acute');
  for (const text of ['b', 'ł', 'й', 'ь', '1', 'Alt', '']) {
    assert.equal(accentKeyLabel(text, engine.accent), text);
  }
  assert.equal(accentKeyLabel('о', 'grave'), 'о');
  assert.equal(press(engine, 'KeyJ', 'ru', 'о').text, 'о́');
  assert.equal(accentKeyLabel('о', engine.accent), 'о');
  taps(engine, 2);
  press(engine, 'Slash');
  engine.reset();
  assert.equal(accentKeyLabel('а', engine.accent), 'а');
});

void test('acute keycaps follow Shift case', () => {
  for (const locale of KEYBOARD_LOCALES) {
    if (locale === 'he' || locale === 'ar') {
      assert.equal(accentKeyLabel('ם', 'acute'), 'ם');
      continue;
    }
    const code = locale === 'ru' ? 'KeyJ' : 'KeyO';
    for (const shift of [false, true]) {
      const letter = baseKey(code, locale, shift);
      assert.equal(
        accentKeyLabel(letter, 'acute'),
        (letter + '\u0301').normalize('NFC'),
      );
    }
  }
});
