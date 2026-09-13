import test from 'node:test';
import assert from 'node:assert/strict';
import { capturesWindowKey, keyboardEventCode } from '../lib/window-typing.ts';
const key = {
  key: 'a',
  code: 'KeyA',
  ctrlKey: false,
  metaKey: false,
  isComposing: false,
  defaultPrevented: false,
};
void test('unfocused typing captures letters and typography modifiers', () => {
  for (const [value, code] of [
    ['a', 'KeyA'],
    ['о', 'KeyJ'],
    ['ł', 'KeyL'],
    [' ', 'Space'],
    ['Alt', 'AltLeft'],
    ['AltGraph', 'AltRight'],
    ['Shift', 'ShiftLeft'],
  ]) {
    assert.equal(
      capturesWindowKey({ ...key, key: value, code }, false, false),
      true,
    );
  }
});
void test('window typing respects editors, dialogs, shortcuts, and native navigation', () => {
  assert.equal(capturesWindowKey(key, true, false), false);
  for (const flag of [
    'ctrlKey',
    'metaKey',
    'isComposing',
    'defaultPrevented',
  ]) {
    assert.equal(
      capturesWindowKey({ ...key, [flag]: true }, false, false),
      false,
    );
  }
  for (const value of [
    'Tab',
    'Enter',
    'ArrowLeft',
    'Backspace',
    'Dead',
    'Process',
  ]) {
    assert.equal(
      capturesWindowKey({ ...key, key: value }, false, false),
      false,
    );
  }
  assert.equal(
    capturesWindowKey({ ...key, key: ' ', code: 'Space' }, false, true),
    false,
  );
  assert.equal(capturesWindowKey(key, false, true), true);
});

void test('Caps Lock remapped from F24 is normalized, but real F24 is unchanged', () => {
  for (const code of ['CapsLock', 'F24']) {
    const event = { ...key, key: 'CapsLock', code };
    assert.equal(keyboardEventCode(event), 'CapsLock');
    assert.equal(capturesWindowKey(event, false, false), true);
    assert.equal(capturesWindowKey(event, true, false), false);
  }
  assert.equal(keyboardEventCode({ ...key, key: 'F24', code: 'F24' }), 'F24');
  assert.equal(
    capturesWindowKey({ ...key, key: 'F24', code: 'F24' }, false, false),
    false,
  );
});
