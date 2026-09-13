import { detectNativeLocale } from '../lib/i18n.ts';
import { keyboardEventCode } from '../lib/window-typing.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LanguageSwitchController,
  defaultLanguageConfig,
  LANGUAGE_SLOTS,
  LANGUAGE_SLOT_CODES,
  languageSlotForKey,
} from '../lib/language-switching.ts';

const LANGUAGE_ORDER = LANGUAGE_SLOTS;

void test('Caps release cycles the four fallback sources, including wraparound', () => {
  const s = new LanguageSwitchController();
  for (let i = 0; i < LANGUAGE_ORDER.length; i++) {
    const current = LANGUAGE_ORDER[i];
    assert.deepEqual(s.handle({ code: 'CapsLock', down: true }, current), {
      prevent: true,
    });
    assert.equal(
      s.handle({ code: 'CapsLock', down: false }, current).locale,
      LANGUAGE_ORDER[(i + 1) % LANGUAGE_ORDER.length],
    );
  }
});
void test('four physical positions select fixed languages and consume the tap', () => {
  for (const locale of LANGUAGE_ORDER)
    for (let i = 0; i < 4; i++) {
      const s = new LanguageSwitchController();
      s.handle({ code: 'CapsLock', down: true }, locale);
      const result = s.handle(
        { code: LANGUAGE_SLOT_CODES[i], key: 'ж', down: true },
        locale,
      );
      assert.deepEqual(result, { prevent: true, locale: LANGUAGE_SLOTS[i] });
      assert.equal(
        s.handle({ code: LANGUAGE_SLOT_CODES[i], down: false }, locale).prevent,
        true,
      );
      assert.equal(
        s.handle({ code: 'CapsLock', down: false }, locale).locale,
        undefined,
      );
    }
});
void test('repeat, held modifiers, overlap and interruption do not switch', () => {
  for (const code of [
    'AltLeft',
    'AltRight',
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'MetaLeft',
    'KeyA',
  ]) {
    const s = new LanguageSwitchController();
    s.handle({ code, down: true }, 'ru');
    s.handle({ code: 'CapsLock', down: true }, 'ru');
    assert.equal(
      s.handle({ code: 'CapsLock', down: false }, 'ru').locale,
      undefined,
    );
  }
  for (const code of [
    'AltLeft',
    'ShiftLeft',
    'ControlLeft',
    'MetaLeft',
    'Escape',
    'KeyA',
  ]) {
    const s = new LanguageSwitchController();
    s.handle({ code: 'CapsLock', down: true }, 'ru');
    assert.equal(s.handle({ code, down: true }, 'ru').locale, undefined);
    assert.equal(
      s.handle({ code: 'CapsLock', down: false }, 'ru').locale,
      undefined,
    );
  }
  const s = new LanguageSwitchController();
  s.handle({ code: 'CapsLock', down: true }, 'ru');
  assert.equal(
    s.handle({ code: 'CapsLock', down: true, repeat: true }, 'ru').locale,
    undefined,
  );
  s.reset();
  assert.equal(
    s.handle({ code: 'CapsLock', down: false }, 'ru').locale,
    undefined,
  );
});
void test('empty slots, external selection and two-source lists', () => {
  const s = new LanguageSwitchController();
  s.handle({ code: 'CapsLock', down: true }, 'ru');
  assert.deepEqual(
    s.handle({ code: 'Semicolon', down: true }, 'ru', LANGUAGE_ORDER, ['ru']),
    { prevent: true, locale: undefined },
  );
  assert.equal(
    s.handle({ code: 'CapsLock', down: false }, 'ru').locale,
    undefined,
  );
  s.reset();
  s.handle({ code: 'CapsLock', down: true }, 'en');
  assert.equal(s.handle({ code: 'CapsLock', down: false }, 'pl').locale, 'pt');
  s.handle({ code: 'CapsLock', down: true }, 'pl', ['ru', 'pl']);
  assert.equal(
    s.handle({ code: 'CapsLock', down: false }, 'pl', ['ru', 'pl']).locale,
    'ru',
  );
});

void test('a repeated slot never retriggers selection; several slots can share one hold', () => {
  const s = new LanguageSwitchController();
  s.handle({ code: 'CapsLock', down: true }, 'it');
  assert.equal(s.handle({ code: 'KeyJ', down: true }, 'it').locale, 'en');
  assert.deepEqual(s.handle({ code: 'KeyJ', down: true, repeat: true }, 'ru'), {
    prevent: true,
  });
  s.handle({ code: 'KeyJ', down: false }, 'ru');
  assert.equal(s.handle({ code: 'KeyL', down: true }, 'ru').locale, 'pl');
  assert.equal(
    s.handle({ code: 'CapsLock', down: false }, 'pl').locale,
    undefined,
  );
});

void test('remapped Caps is held for highlighting, switches repeatedly and releases cleanly', () => {
  const controller = new LanguageSwitchController();
  let locale = LANGUAGE_ORDER[0];
  for (let i = 1; i <= LANGUAGE_ORDER.length * 2; i++) {
    const code = keyboardEventCode({ code: 'F24', key: 'CapsLock' });
    assert.equal(controller.handle({ code, down: true }, locale).prevent, true);
    assert.equal(controller.held.has('CapsLock'), true);
    assert.equal(controller.held.has('F24'), false);
    const result = controller.handle({ code, down: false }, locale);
    assert.equal(controller.held.has('CapsLock'), false);
    assert.equal(result.locale, LANGUAGE_ORDER[i % LANGUAGE_ORDER.length]);
    locale = result.locale!;
  }
});

void test('four switch labels; unassigned Quote is captured during Caps', () => {
  for (const [code, label, locale] of [
    ['KeyJ', 'S1', 'en'],
    ['KeyK', 'S2', 'ru'],
    ['KeyL', 'S3', 'pl'],
    ['Semicolon', 'S4', 'pt'],
  ])
    assert.deepEqual(languageSlotForKey(code), { label, locale });
  assert.equal(languageSlotForKey('Quote'), undefined);
  assert.equal(LANGUAGE_SLOTS.length, 4);
  const s = new LanguageSwitchController();
  s.handle({ code: 'CapsLock', down: true }, 'en');
  assert.deepEqual(s.handle({ code: 'Quote', down: true }, 'en'), {
    prevent: true,
  });
  s.handle({ code: 'Quote', down: false }, 'en');
  assert.equal(
    s.handle({ code: 'CapsLock', down: false }, 'en').locale,
    undefined,
  );
});

void test('independent pair and slots cover six languages and restore the last pair member', () => {
  for (const native of [
    'en',
    'ru',
    'pl',
    'fr',
    'de',
    'es',
    'pt',
    'it',
    'ro',
  ] as const) {
    const { order, slots } = defaultLanguageConfig(native);
    assert.deepEqual(order, ['en', native === 'en' ? 'ru' : native]);
    assert.equal(new Set([...order, ...slots]).size, 6);
    for (const remembered of order) {
      const s = new LanguageSwitchController();
      s.handle({ code: 'CapsLock', down: true }, remembered, order, slots);
      let current = remembered;
      for (let i = 0; i < 4; i++) {
        const code = LANGUAGE_SLOT_CODES[i];
        const result = s.handle({ code, down: true }, current, order, slots);
        assert.equal(result.locale, slots[i]);
        current = result.locale!;
        assert.equal(
          s.handle({ code, down: false }, current, order, slots).prevent,
          true,
        );
        for (const blocked of [
          'KeyA',
          'Space',
          'AltLeft',
          'ControlLeft',
          'Quote',
        ]) {
          assert.deepEqual(
            s.handle({ code: blocked, down: true }, current, order, slots),
            { prevent: true },
          );
          assert.deepEqual(
            s.handle({ code: blocked, down: false }, current, order, slots),
            { prevent: true },
          );
        }
      }
      assert.equal(
        s.handle({ code: 'CapsLock', down: false }, current, order, slots)
          .locale,
        undefined,
      );
      s.reset(); // UI resets must retain pair history.
      assert.equal(s.nextLanguage(current, order), remembered);
      assert.equal(
        s.nextLanguage(remembered, order),
        order.find((value) => value !== remembered),
      );
    }
  }
});

void test('native defaults use locale preferences, including secondary non-English locales', () => {
  assert.equal(detectNativeLocale(['fr-CA', 'en-US']), 'fr');
  assert.equal(detectNativeLocale(['en-US', 'ro-RO']), 'ro');
  assert.equal(detectNativeLocale(['en-US', 'en-GB']), 'en');
  assert.equal(detectNativeLocale(['xx-ZZ']), 'en');
  assert.equal(detectNativeLocale(['pt_BR', 'ru']), 'pt');
});
