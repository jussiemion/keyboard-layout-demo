import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LanguageSwitchController,
  LANGUAGE_SLOT_CODES,
  languageSlotForKey,
} from '../lib/language-switching.ts';
import {
  DEFAULT_SETTINGS,
  defaultLanguageMapping,
  parseSettings,
  getSettings,
  saveSettings,
  subscribeToSettings,
  SETTINGS_STORAGE_KEY,
  type UserSettings,
} from '../lib/settings.ts';

const custom: UserSettings = {
  version: 1,
  languageMapping: { order: ['he', 'fr'], slots: ['de', 'it', 'he', 'de'] },
  showHints: false,
};

void test('custom mappings round-trip, including Hebrew and repeated direct slots', () => {
  assert.deepEqual(parseSettings(JSON.stringify(custom)), custom);
});

void test('missing, malformed, and future settings safely use defaults', () => {
  for (const raw of [null, '', '{', 'null', '[]', '{"version":2}']) {
    assert.deepEqual(parseSettings(raw), DEFAULT_SETTINGS);
  }
});

void test('invalid mappings cannot create a broken S0 pair or incomplete slots', () => {
  for (const languageMapping of [
    { order: ['en', 'en'], slots: ['pl', 'pt', 'es', 'fr'] },
    { order: ['en'], slots: ['pl', 'pt', 'es', 'fr'] },
    { order: ['en', 'xx'], slots: ['pl', 'pt', 'es', 'fr'] },
    { order: ['en', 'he'], slots: ['pl'] },
    { order: ['en', 'he'], slots: ['pl', 'pt', 'es', null] },
  ]) {
    const result = parseSettings(
      JSON.stringify({ ...custom, languageMapping }),
    );
    assert.equal(result.languageMapping, null);
    assert.equal(result.showHints, false);
  }
  assert.equal(
    parseSettings('{"version":1,"showHints":"false"}').showHints,
    true,
  );
});

void test('default mappings follow the native language with exactly two distinct S0 languages', () => {
  assert.deepEqual(defaultLanguageMapping('he').order, ['en', 'he']);
  assert.deepEqual(defaultLanguageMapping('en').order, ['en', 'ru']);
  assert.deepEqual(defaultLanguageMapping('ru').slots, [
    'pl',
    'pt',
    'es',
    'de',
  ]);
  assert.equal(defaultLanguageMapping('fr').slots.length, 4);
});

void test('saved S0 and all four direct assignments drive physical keyboard gestures', () => {
  const { order, slots } = parseSettings(
    JSON.stringify(custom),
  ).languageMapping!;
  const controller = new LanguageSwitchController();
  controller.handle({ code: 'CapsLock', down: true }, 'he', order, slots);
  assert.equal(
    controller.handle({ code: 'CapsLock', down: false }, 'he', order, slots)
      .locale,
    'fr',
  );
  for (let i = 0; i < 4; i++) {
    controller.handle({ code: 'CapsLock', down: true }, 'fr', order, slots);
    const result = controller.handle(
      { code: LANGUAGE_SLOT_CODES[i], down: true },
      'fr',
      order,
      slots,
    );
    assert.equal(result.locale, slots[i]);
    controller.handle(
      { code: LANGUAGE_SLOT_CODES[i], down: false },
      slots[i],
      order,
      slots,
    );
    assert.equal(
      controller.handle(
        { code: 'CapsLock', down: false },
        slots[i],
        order,
        slots,
      ).locale,
      undefined,
    );
    assert.equal(
      languageSlotForKey(LANGUAGE_SLOT_CODES[i], slots)?.locale,
      slots[i],
    );
  }
});

void test('saving publishes a stable snapshot, syncs storage changes, and handles blocked storage', () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage',
  );
  const target = new EventTarget();
  const values = new Map<string, string>();
  let blocked = false;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: target,
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (blocked) {
          throw new Error('Storage unavailable');
        }
        values.set(key, value);
      },
    },
  });
  let notifications = 0;
  const unsubscribe = subscribeToSettings(() => notifications++);
  try {
    assert.equal(saveSettings(custom), true);
    assert.deepEqual(parseSettings(values.get(SETTINGS_STORAGE_KEY)!), custom);
    assert.equal(getSettings(), getSettings());
    assert.equal(notifications, 1);
    const storageEvent = new Event('storage');
    Object.assign(storageEvent, { key: SETTINGS_STORAGE_KEY, newValue: null });
    target.dispatchEvent(storageEvent);
    assert.deepEqual(getSettings(), DEFAULT_SETTINGS);
    blocked = true;
    assert.equal(saveSettings(custom), false);
    assert.deepEqual(getSettings(), custom);
    assert.equal(notifications, 3);
  } finally {
    unsubscribe();
    if (oldWindow) {
      Object.defineProperty(globalThis, 'window', oldWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
    if (oldStorage) {
      Object.defineProperty(globalThis, 'localStorage', oldStorage);
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  }
});
