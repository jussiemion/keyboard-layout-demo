import test from 'node:test';
import assert from 'node:assert/strict';
import { NativeLayoutDetector } from '../lib/native-layout-detection.ts';
const base = {
  isTrusted: true,
  isComposing: false,
  repeat: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
};
function prefix(d: NativeLayoutDetector, taps = 1) {
  for (let i = 0; i < taps; i++) {
    d.observe({ ...base, code: 'AltLeft', key: 'Alt', altKey: true }, true);
    d.observe({ ...base, code: 'AltLeft', key: 'Alt' }, false);
  }
}
function symbol(d: NativeLayoutDetector, key: string, taps = 1) {
  prefix(d, taps);
  return d.observe({ ...base, code: 'KeyC', key }, true);
}
void test('recorded native single/double Alt signatures require distinct evidence', () => {
  const d = new NativeLayoutDetector();
  assert.equal(symbol(d, '©'), null);
  assert.equal(symbol(d, '©'), null);
  assert.equal(symbol(d, '¢', 2), 'detected');
  assert.equal(symbol(d, 'c'), 'inactive');
  assert.equal(symbol(d, '©'), null);
});
void test('ordinary keyboards, real/remapped Caps, pasted symbols and virtual input do not trigger', () => {
  const d = new NativeLayoutDetector();
  for (const key of ['c', 'с', 'C', 'С']) {
    assert.equal(symbol(d, key), null);
  }
  for (const [code, key] of [
    ['F24', 'CapsLock'],
    ['CapsLock', 'CapsLock'],
    ['KeyC', '©'],
    ['KeyC', '¢'],
  ]) {
    assert.equal(d.observe({ ...base, code, key }, true), null);
  }
  prefix(d);
  assert.equal(
    d.observe({ ...base, code: 'KeyC', key: '©', isTrusted: false }, true),
    null,
  );
});
void test('held Alt/Option and AltGr chords, shortcuts, IME and focus interruptions are excluded', () => {
  for (const flag of [
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'isComposing',
  ] as const) {
    const d = new NativeLayoutDetector();
    prefix(d);
    assert.equal(
      d.observe({ ...base, code: 'KeyC', key: '©', [flag]: true }, true),
      null,
    );
    assert.equal(symbol(d, '¢', 2), null);
  }
  const d = new NativeLayoutDetector();
  d.observe({ ...base, code: 'AltLeft', key: 'Alt', altKey: true }, true);
  assert.equal(
    d.observe({ ...base, code: 'KeyC', key: '©', altKey: true }, true),
    null,
  );
  d.observe({ ...base, code: 'AltRight', key: 'AltGraph' }, true);
  d.observe({ ...base, code: 'AltRight', key: 'AltGraph' }, false);
  assert.equal(d.observe({ ...base, code: 'KeyC', key: '©' }, true), null);
  prefix(d);
  d.interrupt();
  assert.equal(d.observe({ ...base, code: 'KeyC', key: '©' }, true), null);
  assert.equal(symbol(d, '¢', 2), null);
});

void test('recheck accepts the physical C position in Hebrew without assuming the UI language', () => {
  const d = new NativeLayoutDetector();
  symbol(d, '©');
  assert.equal(symbol(d, '¢', 2), 'detected');
  assert.equal(symbol(d, 'ב'), 'inactive');
});

void test('detection works again after confirming that the OS layout was disabled', () => {
  const d = new NativeLayoutDetector();
  for (let cycle = 0; cycle < 3; cycle++) {
    assert.equal(symbol(d, '©'), null);
    assert.equal(symbol(d, '¢', 2), 'detected');
    assert.equal(symbol(d, 'c'), 'inactive');
  }
});

void test('native extended mode permits holding the second Alt, as the layout does', () => {
  const d = new NativeLayoutDetector();
  assert.equal(symbol(d, '©'), null);
  prefix(d);
  d.observe({ ...base, code: 'AltLeft', key: 'Alt', altKey: true }, true);
  assert.equal(
    d.observe({ ...base, code: 'KeyC', key: '¢' }, true),
    'detected',
  );
});

void test('native quick symbols have a physical Alt hold but cleared output Alt modifier', () => {
  const d = new NativeLayoutDetector();
  for (const [code, key, result] of [
    ['Minus', '—', null],
    ['Comma', '«', 'detected'],
  ] as const) {
    d.observe({ ...base, code: 'AltLeft', key: 'Alt', altKey: true }, true);
    assert.equal(d.observe({ ...base, code, key }, true), result);
    d.observe({ ...base, code: 'AltLeft', key: 'Alt' }, false);
  }
});

void test('dismissal clears old evidence and permits fresh detection if the OS layout remains active', () => {
  const d = new NativeLayoutDetector();
  symbol(d, '©');
  assert.equal(symbol(d, '¢', 2), 'detected');
  d.dismiss();
  assert.equal(symbol(d, '©'), null);
  assert.equal(symbol(d, '¢', 2), 'detected');
});
