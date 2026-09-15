import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ReferenceShortcuts } from '../lib/reference-shortcuts.ts';
import {
  LanguageSwitchController,
  defaultLanguageConfig,
} from '../lib/language-switching.ts';

for (const [code, action] of [
  ['KeyF', 'search'],
  ['KeyH', 'help'],
] as const) {
  void test(`${code}: Ctrl works even with typography disabled; repeats do not reopen`, () => {
    const shortcuts = new ReferenceShortcuts();
    const key = { code, key: 'ф', ctrlKey: true };
    assert.deepEqual(shortcuts.handle(key, true, false), {
      prevent: true,
      action,
    });
    assert.deepEqual(shortcuts.handle({ ...key, repeat: true }, true, false), {
      prevent: true,
    });
    assert.deepEqual(shortcuts.handle(key, false, false), { prevent: true });
  });
  void test(`${code}: Caps opens a dialog without a subsequent language switch`, () => {
    const shortcuts = new ReferenceShortcuts();
    const language = new LanguageSwitchController();
    const { order, slots } = defaultLanguageConfig();
    const caps = { code: 'CapsLock', key: 'CapsLock' };
    shortcuts.handle(caps, true, true);
    language.handle({ code: 'CapsLock', down: true }, 'en', order, slots);
    assert.deepEqual(shortcuts.handle({ code, key: 'ф' }, true, true), {
      prevent: true,
      action,
    });
    language.reset(); // Dialog opening uses the demo's existing resetState.
    assert.deepEqual(shortcuts.handle(caps, false, true), { prevent: true });
    assert.equal(
      language.handle({ code: 'CapsLock', down: false }, 'en', order, slots)
        .locale,
      undefined,
    );
    assert.equal(language.held.size, 0);
  });
}
void test('Caps requires an enabled layout, a held key, and an unmodified chord', () => {
  for (const enabled of [false, true]) {
    const s = new ReferenceShortcuts();
    s.handle({ code: 'CapsLock', key: 'CapsLock' }, true, enabled);
    assert.equal(
      s.handle({ code: 'KeyF', key: 'f', shiftKey: true }, true, enabled)
        .prevent,
      false,
    );
    s.reset();
    s.handle({ code: 'CapsLock', key: 'CapsLock' }, true, enabled);
    s.handle({ code: 'CapsLock', key: 'CapsLock' }, false, enabled);
    assert.equal(
      s.handle({ code: 'KeyH', key: 'h' }, true, enabled).prevent,
      false,
    );
  }
  const s = new ReferenceShortcuts();
  s.handle({ code: 'CapsLock', key: 'CapsLock' }, true, false);
  assert.equal(
    s.handle({ code: 'KeyF', key: 'f' }, true, false).prevent,
    false,
  );
});
void test('S2 and browser Ctrl+K are not reference shortcuts; blur clears Caps', () => {
  const s = new ReferenceShortcuts();
  s.handle({ code: 'CapsLock', key: 'CapsLock' }, true, true);
  assert.equal(s.handle({ code: 'KeyK', key: 'k' }, true, true).prevent, false);
  s.reset();
  assert.equal(
    s.handle({ code: 'KeyK', key: 'k', ctrlKey: true }, true, true).prevent,
    false,
  );
  s.reset();
  assert.equal(s.handle({ code: 'KeyH', key: 'h' }, true, true).prevent, false);
});
