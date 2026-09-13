import profiles from '../lib/diacritic-profiles.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TypingEngine,
  replaceSelection,
  type KeyInput,
  type Locale,
} from '../lib/typing-engine.ts';

function field(locale: Locale = 'pl') {
  const engine = new TypingEngine();
  const state = { value: 'b', start: 1, end: 1 };
  function send(
    code: string,
    down: boolean,
    key = '',
    options: Partial<KeyInput> = {},
  ) {
    const result = engine.handle(
      { code, down, key, ...options, context: { ...state } },
      locale,
    );
    const text =
      result.text ??
      (!result.prevent && down && Array.from(key).length === 1 ? key : '');
    if (text) {
      const next = replaceSelection(
        state.value,
        result.replace?.start ?? state.start,
        result.replace?.end ?? state.end,
        text,
      );
      state.value = next.value;
      state.start = state.end = next.caret;
    }
    return result;
  }
  function tap(code: string, key = '') {
    send(code, true, key);
    return send(code, false, key);
  }
  function acute() {
    tap('AltLeft');
    tap('AltLeft');
    tap('Slash', '/');
  }
  return { engine, state, send, tap, acute };
}

// Walk twice around a cycle to verify every transition, including wraparound.
function assertCycle(locale: Locale, row: string, shift: string, base: string) {
  const f = field(locale);
  f.tap('KeyA', base);
  const start = row.indexOf(base);
  for (let step = 1; step <= row.length * 2; step++) {
    f.tap(shift);
    assert.equal(
      f.state.value,
      'b' + row[(start + step) % row.length],
      `starting at ${base}, Shift tap ${step}`,
    );
  }
}

const polishRows = ['aą', 'cć', 'eę', 'lł', 'nń', 'oó', 'sś', 'zżź'].flatMap(
  (cycle) => [cycle, cycle.toUpperCase()],
);
const polishScenarios = polishRows.flatMap((row) => [
  { row, shift: 'ShiftLeft' },
  { row, shift: 'ShiftRight' },
]);
for (const { row, shift } of polishScenarios) {
  void test(`Polish reference cycle: ${row}, ${shift}`, () => {
    for (const base of row) {
      assertCycle('pl', row, shift, base);
    }
  });
}

const stressRows = [
  { code: 'KeyA', row: 'aą' },
  { code: 'KeyA', row: 'AĄ' },
  { code: 'KeyE', row: 'eę' },
  { code: 'KeyE', row: 'EĘ' },
  { code: 'KeyO', row: 'oó' },
  { code: 'KeyO', row: 'OÓ' },
];
const stressScenarios = stressRows.flatMap((entry) => [
  { ...entry, shift: 'ShiftLeft', national: false },
  { ...entry, shift: 'ShiftRight', national: false },
  { ...entry, shift: 'ShiftLeft', national: true },
  { ...entry, shift: 'ShiftRight', national: true },
]);
for (const { code, row, shift, national } of stressScenarios) {
  void test(`${shift}: stress on ${row}, national=${national}`, () => {
    const f = field();
    f.acute();
    if (national) {
      f.send('AltLeft', true);
    }
    const upper = row === row.toUpperCase();
    if (upper) {
      f.send('ShiftLeft', true);
    }
    f.send(code, true, row[0], { shiftKey: upper });
    f.send(code, false, row[0]);
    if (upper) {
      f.send('ShiftLeft', false);
    }
    if (national) {
      f.send('AltLeft', false);
    }
    for (let step = 0; step < 5; step++) {
      assert.equal(
        f.state.value,
        'b' + (row[(Number(national) + step) % 2] + '\u0301').normalize('NFC'),
        `Shift tap ${step}`,
      );
      f.tap(shift);
    }
  });
}

for (const shift of ['ShiftLeft', 'ShiftRight']) {
  void test(`${shift}: overlap, chords and two Shifts`, () => {
    const f = field();
    f.send('KeyA', true, 'a');
    f.send(shift, true);
    f.send('KeyA', false);
    f.send(shift, false);
    assert.equal(f.state.value, 'ba');
    f.send(shift, true);
    f.tap('KeyB', 'B');
    f.send(shift, false);
    assert.equal(f.state.value, 'baB');
    f.tap('KeyA', 'a');
    f.send('ShiftLeft', true);
    f.send('ShiftRight', true);
    f.send('ShiftLeft', false);
    f.send('ShiftRight', false);
    assert.equal(f.state.value, 'baBa');
  });
  for (const code of [
    'Space',
    'ArrowLeft',
    'ControlLeft',
    'MetaLeft',
    'AltLeft',
    'CapsLock',
    'Escape',
    'Tab',
  ]) {
    void test(`${shift}: ${code} invalidates stress`, () => {
      const f = field();
      f.acute();
      f.tap('KeyA', 'a');
      f.tap(code);
      f.tap(shift);
      assert.equal(f.state.value, 'bá');
    });
  }
  void test(`${shift}: text, caret and selection verification`, () => {
    for (const mutate of [
      (s: ReturnType<typeof field>['state']) => {
        s.start = s.end = 0;
      },
      (s: ReturnType<typeof field>['state']) => {
        s.start = 0;
      },
      (s: ReturnType<typeof field>['state']) => {
        s.value = 'xx';
      },
    ]) {
      const f = field();
      f.tap('KeyA', 'a');
      mutate(f.state);
      const expected = f.state.value;
      f.tap(shift);
      assert.equal(f.state.value, expected);
    }
  });
}
void test('new letter does not inherit stress; reset cancels candidate', () => {
  const f = field();
  f.acute();
  f.tap('KeyA', 'a');
  f.tap('KeyA', 'a');
  f.tap('ShiftLeft');
  assert.equal(f.state.value, 'báą');
  f.engine.resetPostfix();
  f.tap('ShiftRight');
  assert.equal(f.state.value, 'báą');
});
void test('ordinary repeats and national Alt input do not become extra Shift taps', () => {
  const f = field();
  f.send('KeyA', true, 'a');
  f.send('KeyA', true, 'a', { repeat: true });
  f.send('KeyA', false);
  f.tap('ShiftLeft');
  assert.equal(f.state.value, 'baa');
  f.send('AltLeft', true);
  f.tap('KeyA', 'a');
  f.send('AltLeft', false);
  f.tap('ShiftLeft');
  assert.equal(f.state.value, 'baaa');
});
void test('non-acute composition stays unchanged', () => {
  const f = field();
  f.engine.accent = 'grave';
  f.tap('KeyA', 'a');
  f.tap('ShiftLeft');
  assert.equal(f.state.value, 'bà');
});

// Expand national profiles once; test bodies describe only the interaction.
const nationalRows = Object.entries(profiles.profiles).flatMap(
  ([locale, cycles]) =>
    cycles.flatMap((cycle) => {
      const upper = Array.from(cycle)
        .map(
          (letter) =>
            (profiles.uppercaseOverrides as Record<string, string>)[letter] ||
            letter.toLocaleUpperCase(locale),
        )
        .join('');
      return [cycle, upper].map((row) => ({ locale: locale as Locale, row }));
    }),
);
const nationalScenarios = nationalRows.flatMap((entry) => [
  { ...entry, shift: 'ShiftLeft' },
  { ...entry, shift: 'ShiftRight' },
]);
for (const { locale, row, shift } of nationalScenarios) {
  void test(`${locale}: ${row}, ${shift}`, () => {
    for (const base of row) {
      assertCycle(locale, row, shift, base);
    }
  });
  if (/^[aeiouyеи]$/iu.test(row[0])) {
    void test(`${locale}: stressed ${row}, ${shift}`, () => {
      const f = field(locale);
      f.acute();
      f.tap('KeyA', row[0]);
      for (let step = 0; step <= row.length; step++) {
        assert.equal(
          f.state.value,
          'b' + (row[step % row.length] + '\u0301').normalize('NFC'),
          `Shift tap ${step}`,
        );
        f.tap(shift);
      }
    });
  }
}
