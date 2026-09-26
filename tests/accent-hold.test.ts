import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import {
  TypingEngine,
  replaceSelection,
  baseKey,
  diacriticVariants,
  layout,
} from '../lib/typing-engine.ts';
import profiles from '../lib/diacritic-profiles.ts';
import {
  KEYBOARD_LOCALES,
  keyboardLanguage,
  type KeyboardLocale,
} from '../lib/keyboard-locales.ts';
import type { useAccentHold } from '../components/use-accent-hold.ts';

function setup(letter = 'z', code = 'KeyZ', locale: KeyboardLocale = 'pl') {
  const engine = new TypingEngine();
  engine.handle(
    {
      code,
      key: letter,
      down: true,
      context: { value: '', start: 0, end: 0 },
    },
    locale,
  );
  const field = { value: letter, selectionStart: 1, selectionEnd: 1 };
  const slots: unknown[] = [];
  let cursor = 0;
  let now = 0;
  let id = 0;
  const timers = new Map<number, { callback: () => void; due: number }>();
  const compiled = ts.transpileModule(
    readFileSync(
      new URL('../components/use-accent-hold.ts', import.meta.url),
      'utf8',
    ),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    },
  ).outputText;
  const exports: { useAccentHold?: typeof useAccentHold } = {};
  runInNewContext(compiled, {
    exports,
    document: { activeElement: field },
    setTimeout(callback: () => void, delay: number) {
      timers.set(++id, { callback, due: now + delay });
      return id;
    },
    clearTimeout(key: number) {
      timers.delete(key);
    },
    require() {
      return {
        useEffect() {},
        useRef(value: unknown) {
          const index = cursor++;
          return (slots[index] ??= { current: value });
        },
        useState(value: unknown) {
          const index = cursor++;
          if (!(index in slots)) {
            slots[index] = value;
          }
          return [
            slots[index],
            (next: unknown) => {
              slots[index] =
                typeof next === 'function' ? next(slots[index]) : next;
            },
          ];
        },
      };
    },
  });
  function render() {
    cursor = 0;
    return exports.useAccentHold!(
      { current: field as HTMLInputElement },
      { current: engine },
      (text, replacement) => {
        const next = replaceSelection(
          field.value,
          replacement.start,
          replacement.end,
          text,
        );
        field.value = next.value;
        field.selectionStart = field.selectionEnd = next.caret;
      },
    );
  }
  function event(code: string, repeat = false) {
    return {
      code,
      repeat,
      timeStamp: now,
      preventDefault() {},
    } as KeyboardEvent;
  }
  function advance(ms: number) {
    const end = now + ms;
    while (true) {
      const next = Array.from(timers.entries())
        .filter(([, value]) => value.due <= end)
        .sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) {
        break;
      }
      now = next[1].due;
      timers.delete(next[0]);
      next[1].callback();
    }
    now = end;
  }
  function key(code: string, down: boolean, key = '') {
    if (render().before(event(code), down)) {
      return;
    }
    const result = engine.handle(
      {
        code,
        key,
        down,
        timeStamp: now,
        previewDiacritic: true,
        context: {
          value: field.value,
          start: field.selectionStart,
          end: field.selectionEnd,
        },
      },
      locale,
    );
    if (result.route === 'accent-menu') {
      render().open(code === 'ShiftRight' ? -1 : 1);
    }
  }
  function tap(code: string) {
    key(code, true);
    advance(50);
    key(code, false);
  }
  return {
    render,
    key,
    tap,
    field,
    engine,
    event,
    hold() {
      advance(250);
    },
    advance,
  };
}

void test('holding opens the menu at 250 ms and applies the first accent only once', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(249);
  assert.equal(s.render().menu, null);
  s.advance(1);
  assert.equal(s.render().menu?.index, 1);
  s.advance(10000);
  assert.equal(s.field.value, 'ż');
  s.render().before(s.event('KeyZ'), false);
  s.advance(100);
  assert.equal(s.render().menu?.index, 1);
  assert.equal(s.field.value, 'ż');
});
void test('short taps remain ordinary input', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(60);
  s.render().before(s.event('KeyZ'), false);
  s.advance(100);
  assert.equal(s.field.value, 'z');
});
void test('a single variant is applied once without further cycling', () => {
  for (const [base, variant] of [
    ['a', 'ą'],
    ['A', 'Ą'],
  ]) {
    const s = setup(base, 'KeyA');
    s.render().arm('KeyA');
    s.advance(10000);
    assert.equal(s.field.value, variant);
    assert.equal(s.render().before(s.event('KeyA', true), true), true);
    s.render().before(s.event('KeyA'), false);
    s.advance(100);
    s.render().choose(1);
    assert.equal(s.field.value, variant);
  }
});
void test('Linux repeat pairs preserve the timer without inserting extra letters', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(247);
  for (let i = 0; i < 20; i++) {
    s.render().before(s.event('KeyZ'), false);
    assert.equal(s.render().before(s.event('KeyZ'), true), true);
    s.advance(25);
  }
  assert.equal(s.field.value, 'ż');
  s.render().before(s.event('KeyZ'), false);
  s.advance(100);
  assert.equal(s.field.value, 'ż');
});
void test('new input and changed caret cancel the cycle', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(500);
  s.render().before(s.event('KeyB'), true);
  s.advance(100);
  assert.equal(s.field.value, 'ż');
  const moved = setup();
  moved.render().arm('KeyZ');
  moved.field.selectionStart = 0;
  moved.advance(1000);
  assert.equal(moved.field.value, 'z');
});

void test('digit selects immediately and stops cycling and native repeats', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(250);
  assert.equal(s.render().before(s.event('Digit3'), true), true);
  assert.equal(s.field.value, 'ź');
  assert.equal(s.render().menu, null);
  assert.equal(s.render().before(s.event('Digit3', true), true), true);
  assert.equal(s.render().before(s.event('Digit3'), false), true);
  assert.equal(s.render().before(s.event('KeyZ', true), true), true);
  s.advance(100);
  assert.equal(s.field.value, 'ź');
});

void test('first Shift applies the first accent and opens the menu', () => {
  const s = setup();
  const context = { value: 'z', start: 1, end: 1 };
  s.engine.handle({ code: 'KeyZ', down: false, context }, 'pl');
  s.engine.handle({ code: 'ShiftLeft', down: true, context }, 'pl');
  const result = s.engine.handle(
    { code: 'ShiftLeft', down: false, previewDiacritic: true, context },
    'pl',
  );
  assert.equal(result.route, 'accent-menu');
  assert.equal(result.text, undefined);
  s.render().open();
  assert.equal(s.render().menu?.index, 1);
  assert.equal(s.field.value, 'ż');
  s.tap('ShiftLeft');
  assert.equal(s.render().menu?.index, 2);
  assert.equal(s.field.value, 'ź');
  s.render().before(s.event('Escape'), true);
  assert.equal(s.render().menu, null);
  assert.equal(s.field.value, 'ź');
});
void test('new input closes the menu and preserves the last replacement', () => {
  const s = setup();
  s.render().open();
  s.key('ShiftLeft', true);
  s.key('ShiftLeft', false);
  s.render().before(s.event('KeyB'), true);
  assert.equal(s.render().menu, null);
  assert.equal(s.field.value, 'ź');
});
void test('digits before menu or outside variants remain ordinary', () => {
  for (const kind of ['early', 'missing']) {
    const s = setup();
    s.render().arm('KeyZ');
    if (kind !== 'early') {
      s.advance(250);
    }
    if (kind === 'release') {
      s.render().before(s.event('KeyZ'), false);
    }
    assert.equal(
      s
        .render()
        .before(s.event(kind === 'missing' ? 'Digit9' : 'Digit1'), true),
      false,
    );
    s.advance(100);
    assert.equal(s.field.value, kind === 'early' ? 'z' : 'ż');
  }
});

void test('blur/reset clears consumed modifier state', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(250);
  s.key('ShiftLeft', true);
  s.render().cancel();
  assert.equal(s.render().before(s.event('ShiftLeft'), true), false);
  s.advance(100);
  assert.equal(s.render().menu, null);
  assert.equal(s.field.value, 'ż');
});

void test('release preserves the menu and stops cycling; Shift does not restart it', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(500);
  s.render().before(s.event('KeyZ'), false);
  s.advance(100);
  assert.equal(s.field.value, 'ż');
  assert.equal(s.render().menu?.index, 1);
  s.key('ShiftLeft', true);
  s.key('ShiftLeft', false);
  s.advance(100);
  assert.equal(s.field.value, 'ź');
  assert.equal(s.render().menu?.index, 2);
  assert.equal(s.render().before(s.event('Digit3'), true), true);
  assert.equal(s.field.value, 'ź');
  assert.equal(s.render().menu, null);
});
void test('choice immediately after release and clicking a persistent menu work', () => {
  for (const click of [false, true]) {
    const s = setup();
    s.render().arm('KeyZ');
    s.advance(250);
    s.render().before(s.event('KeyZ'), false);
    if (click) {
      s.advance(100);
      s.render().choose(1);
    } else {
      assert.equal(s.render().before(s.event('Digit2'), true), true);
    }
    s.advance(100);
    assert.equal(s.field.value, 'ż');
    assert.equal(s.render().menu, null);
  }
});

void test('reopening advances from the chosen accent while preserving digit assignments', () => {
  for (const [base, first, second] of [
    ['z', 'ż', 'ź'],
    ['Z', 'Ż', 'Ź'],
  ]) {
    const s = setup(base);
    const choices = [base, first, second];
    for (const index of [1, 2, 0]) {
      s.render().open();
      s.render().choose(index);
      assert.equal(s.field.value, choices[index]);
      s.render().open();
      assert.deepEqual(Array.from(s.render().menu!.choices), choices);
      assert.equal(s.render().menu?.index, (index + 1) % 3);
      assert.equal(s.field.value, choices[(index + 1) % 3]);
      s.render().choose((index + 1) % 3);
    }
  }
});

void test('digits include the base in slot one, including after reopening', () => {
  const s = setup();
  for (const [digit, expected] of [
    ['Digit2', 'ż'],
    ['Digit3', 'ź'],
    ['Digit1', 'z'],
  ]) {
    s.render().open();
    assert.equal(s.render().before(s.event(digit), true), true);
    s.render().before(s.event(digit), false);
    assert.equal(s.field.value, expected);
  }
});

void test('Shift wraps in both directions without closing the menu', () => {
  const s = setup();
  s.render().open();
  for (const [code, expected, index] of [
    ['ShiftLeft', 'ź', 2],
    ['ShiftLeft', 'z', 0],
    ['ShiftRight', 'ź', 2],
    ['ShiftRight', 'ż', 1],
  ] as const) {
    s.tap(code);
    assert.equal(s.field.value, expected);
    assert.equal(s.render().menu?.index, index);
  }
});

void test('menu persists indefinitely after releasing all keys', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.advance(5000);
  s.render().before(s.event('KeyZ'), false);
  s.advance(10000);
  assert.ok(s.render().menu);
  assert.equal(s.field.value, 'ż');
});

void test('Shift plus another key cancels delayed opening and keeps uppercase input', () => {
  const s = setup();
  const context = { value: 'z', start: 1, end: 1 };
  s.engine.handle({ code: 'KeyZ', down: false, context }, 'pl');
  s.key('ShiftLeft', true);
  s.engine.handle({ code: 'ShiftLeft', down: true, context }, 'pl');
  s.advance(100);
  s.render().before(s.event('KeyB'), true);
  s.advance(1000);
  assert.equal(s.render().menu, null);
  assert.equal(s.field.value, 'z');
});

// Exercise the UI controller for every eligible base on every physical map.
const languageCases = KEYBOARD_LOCALES.flatMap((locale) => {
  const rows =
    (profiles.profiles as Partial<Record<string, string[]>>)[
      keyboardLanguage(locale)
    ] ?? [];
  return rows.flatMap((row) => {
    const letter = Array.from(row)[0];
    const code = layout.find(
      (key) => baseKey(key.code, locale) === letter,
    )?.code;
    const choices = diacriticVariants(letter, locale);
    if (choices.length < 2) {
      return [];
    }
    assert.ok(code, `${locale}: no physical key for ${letter}`);
    const upper = letter.toLocaleUpperCase(keyboardLanguage(locale));
    return [
      { locale, letter, code, choices },
      {
        locale,
        letter: upper,
        code,
        choices: diacriticVariants(upper, locale),
      },
    ];
  });
});
for (const { locale, letter, code, choices } of languageCases) {
  void test(`${locale} ${letter}: hold, directions, numbered choice and persistence`, () => {
    const s = setup(letter, code, locale);
    s.render().arm(code);
    s.advance(249);
    assert.equal(s.render().menu, null);
    s.advance(1);
    assert.deepEqual(Array.from(s.render().menu!.choices), choices);
    assert.equal(s.field.value, choices[1]);
    s.render().before(s.event(code), false);
    s.advance(1000);
    assert.ok(s.render().menu);
    assert.equal(s.field.value, choices[1]);
    s.tap('ShiftLeft');
    assert.equal(s.field.value, choices[2 % choices.length]);
    s.advance(1000);
    assert.equal(s.field.value, choices[2 % choices.length]);
    s.tap('ShiftRight');
    assert.equal(s.field.value, choices[1]);
    s.render().before(s.event('Digit1'), true);
    s.render().before(s.event('Digit1'), false);
    assert.equal(s.field.value, letter);
    assert.equal(s.render().menu, null);
    s.render().open();
    s.render().choose(choices.length - 1);
    assert.equal(s.field.value, choices.at(-1));
    assert.equal(s.render().menu, null);
  });
  void test(`${locale} ${letter}: held Shift never changes text or opens a menu`, () => {
    const s = setup(letter, code, locale);
    s.key(code, false);
    s.key('ShiftLeft', true);
    s.advance(2000);
    assert.equal(s.field.value, letter);
    assert.equal(s.render().menu, null);
    s.key('ShiftLeft', false);
    assert.equal(s.field.value, letter);
    s.tap('ShiftLeft');
    assert.equal(s.field.value, choices[1]);
  });
}

void test('Turkish circumflex menus preserve dotted/dotless case and direct-key exclusions', () => {
  for (const [letter, expected] of [
    ['a', ['a', 'â']],
    ['A', ['A', 'Â']],
    ['i', ['i', 'î']],
    ['İ', ['İ', 'Î']],
    ['u', ['u', 'û']],
    ['U', ['U', 'Û']],
  ] as const) {
    assert.deepEqual(diacriticVariants(letter, 'tr'), expected);
  }
  for (const letter of [
    'c',
    'ç',
    'g',
    'ğ',
    'ı',
    'I',
    'o',
    'ö',
    's',
    'ş',
    'ü',
  ]) {
    assert.deepEqual(diacriticVariants(letter, 'tr'), []);
  }
});
for (const [locale, letter, code] of [
  ['ru', 'е', 'KeyT'],
  ['ru', 'и', 'KeyB'],
  ['de', 'a', 'KeyA'],
  ['de', 'u', 'KeyU'],
  ['tr', 'c', 'KeyC'],
  ['tr', 's', 'KeyS'],
  ['vi', 'd', 'KeyD'],
  ['he', 'ש', 'KeyA'],
  ['ar', 'ش', 'KeyA'],
] as const) {
  void test(`${locale} ${letter}: no empty menu for direct variants or mark layers`, () => {
    const s = setup(letter, code, locale);
    s.render().arm(code);
    s.advance(1500);
    assert.equal(s.render().menu, null);
    assert.equal(s.field.value, letter);
  });
}

for (const shift of ['ShiftLeft', 'ShiftRight']) {
  for (const visible of [false, true]) {
    void test(`${shift}, menu ${visible}: long hold and uppercase/symbol chords preserve text`, () => {
      const s = setup();
      s.key('KeyZ', false);
      if (visible) {
        s.render().open();
      }
      const original = s.field.value;
      s.key(shift, true);
      s.advance(2000);
      assert.equal(s.field.value, original);
      assert.equal(s.render().before(s.event('Digit1'), true), false);
      const result = s.engine.handle(
        {
          code: 'Digit1',
          key: '!',
          down: true,
          shiftKey: true,
          timeStamp: 2000,
          context: {
            value: original,
            start: original.length,
            end: original.length,
          },
        },
        'pl',
      );
      assert.equal(result.route, 'pass');
      s.key('Digit1', false);
      s.key(shift, false);
      assert.equal(s.engine.shiftHeld, false);
      assert.equal(s.field.value, original);
      assert.equal(s.render().menu, null);
    });
  }
}
void test('a short overlapping Shift tap still opens after base release grace', () => {
  const s = setup();
  s.render().arm('KeyZ');
  s.key('KeyZ', false);
  s.tap('ShiftLeft');
  assert.equal(s.field.value, 'ż');
  assert.ok(s.render().menu);
});
