import { searchSymbolItems } from '../lib/symbol-search-index.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LANGUAGES,
  KEYBOARD_LOCALES,
  keyboardLanguage,
  keyboardLabel,
  parseKeyboardLocale,
  isRtl,
} from '../lib/keyboard-locales.ts';
import {
  baseKey,
  nextDiacritic,
  nationalKeyAction,
  TypingEngine,
} from '../lib/typing-engine.ts';
import { messages, UI_LOCALES } from '../lib/messages.ts';
import { helpMessages } from '../lib/help-messages.ts';
import { tourMessages } from '../lib/tour-messages.ts';
import { parseSettings, defaultLanguageMapping } from '../lib/settings.ts';
import { LanguageSwitchController } from '../lib/language-switching.ts';
import { getKeyboardRows } from '../lib/keyboard.ts';

function flattenMessages(object: object): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object).flatMap(([key, value]) =>
      typeof value === 'string'
        ? [[key, value]]
        : Object.entries(flattenMessages(value)).map(([nestedKey, text]) => [
            `${key}.${nestedKey}`,
            text,
          ]),
    ),
  );
}

void test('14 UI languages and 24 distinct selectable keyboard identifiers', () => {
  assert.equal(LANGUAGES.length, 14);
  assert.deepEqual(UI_LOCALES, [...LANGUAGES]);
  assert.equal(new Set(KEYBOARD_LOCALES).size, 24);
  for (const ui of LANGUAGES) {
    const labels = KEYBOARD_LOCALES.map((keyboard) =>
      keyboardLabel(keyboard, ui),
    );
    assert.equal(new Set(labels).size, 24, ui);
    assert.equal(isRtl(ui), ui === 'he' || ui === 'ar');
  }
});
const catalogs = [
  { name: 'interface', data: messages },
  { name: 'help', data: helpMessages },
  { name: 'tour', data: tourMessages },
];
const translationScenarios = catalogs.flatMap(({ name, data }) => {
  const english = flattenMessages(data.en);
  return LANGUAGES.map((locale) => ({
    name,
    locale,
    english,
    translated: flattenMessages(data[locale]),
  }));
});
for (const { name, locale, english, translated } of translationScenarios) {
  void test(`${locale}: ${name} catalog keys and placeholders`, () => {
    assert.deepEqual(
      Object.keys(translated).sort(),
      Object.keys(english).sort(),
    );
    for (const [key, value] of Object.entries(english)) {
      assert.ok(translated[key].trim(), key);
      if (['ar', 'tr', 'vi', 'nl'].includes(locale)) {
        assert.deepEqual(
          [...new Set(translated[key].match(/\{\w+\}/g))].sort(),
          [...new Set(value.match(/\{\w+\}/g))].sort(),
          key,
        );
      }
    }
  });
}

void test('product names and page titles consistently identify the author', () => {
  assert.equal(
    messages.en.productName,
    'Typographic Layout by Semyon Yushkevich',
  );
  for (const locale of LANGUAGES) {
    const catalog = messages[locale];
    assert.equal(catalog.pageTitle, catalog.productName, locale);
    const author =
      locale === 'ru'
        ? 'Семёна Юшкевича'
        : locale === 'pl'
          ? 'Szymona Juszkiewicza'
          : 'Semyon Yushkevich';
    assert.ok(catalog.productName.includes(author), locale);
  }
});

void test('regional options preserve their base-language diacritic profiles', () => {
  for (const locale of KEYBOARD_LOCALES.filter((value) =>
    value.includes('-'),
  )) {
    assert.equal(
      parseKeyboardLocale(locale.toLowerCase().replace('-', '_')),
      locale,
    );
    assert.equal(
      nextDiacritic('a', locale),
      nextDiacritic('a', keyboardLanguage(locale)),
    );
  }
  assert.equal(parseKeyboardLocale('fr-BE'), null);
  assert.equal(parseKeyboardLocale({}), null);
  for (const locale of [
    'en-AU',
    'en-NG',
    'en-NZ',
    'en-SG',
    'en-US',
    'en-ZW',
  ] as const) {
    for (const code of ['KeyA', 'KeyY', 'Digit2', 'Quote', 'Backslash']) {
      assert.equal(baseKey(code, locale), baseKey(code, 'en'));
      assert.equal(baseKey(code, locale, true), baseKey(code, 'en', true));
    }
  }
});

void test('regional physical maps differ where expected', () => {
  assert.equal(baseKey('KeyQ', 'fr'), 'a');
  assert.equal(baseKey('KeyQ', 'fr-CA'), 'q');
  assert.equal(baseKey('Slash', 'fr-CA'), 'é');
  assert.equal(baseKey('Quote', 'es-MX'), '{');
  assert.equal(nationalKeyAction('Quote', 'es').dead, 'acute');
  assert.equal(baseKey('Quote', 'de-CH'), 'ä');
  assert.equal(baseKey('Quote', 'de-CH', true), 'à');
  assert.equal(baseKey('IntlRo', 'pt-BR'), '/');
  assert.equal(baseKey('IntlRo', 'pt-BR', true), '?');
  for (const platform of ['linux', 'windows', 'macos'] as const) {
    const brazil = getKeyboardRows(platform, 'pt-BR')[3];
    assert.equal(brazil.filter((key) => key.code === 'IntlRo').length, 1);
    assert.equal(
      brazil.reduce((sum, key) => sum + (key.width ?? 1), 0),
      15,
    );
  }
});

void test('Turkish dotted and dotless i keep distinct case and postfix cycles', () => {
  assert.equal(baseKey('KeyI', 'tr'), 'ı');
  assert.equal(baseKey('KeyI', 'tr', true), 'I');
  assert.equal(baseKey('Quote', 'tr'), 'i');
  assert.equal(baseKey('Quote', 'tr', true), 'İ');
  assert.equal(baseKey('Quote', 'tr', false, true), 'İ');
  assert.equal(nextDiacritic('İ', 'tr'), 'I');
  assert.equal(nextDiacritic('I', 'tr'), 'İ');
  assert.equal(nextDiacritic('i', 'tr'), 'ı');
});

void test('Arabic uses canonical letters and following vowel marks', () => {
  assert.equal(baseKey('KeyB', 'ar'), 'لا');
  assert.equal(baseKey('KeyB', 'ar', true), 'لآ');
  assert.equal(baseKey('KeyQ', 'ar'), 'ض');
  assert.equal(baseKey('KeyQ', 'ar', true), '\u064e');
  assert.equal(baseKey('KeyA', 'ar', true), '\u0650');
  assert.equal(nextDiacritic('ش', 'ar'), '');
});

void test('Vietnamese direct letters and native dead-key composition', () => {
  assert.equal(baseKey('Digit1', 'vi'), 'ă');
  const engine = new TypingEngine();
  engine.accent = 'hook';
  assert.equal(
    engine.handle({ code: 'KeyA', key: 'ă', down: true }, 'vi').text,
    'ẳ',
  );
  assert.equal(nextDiacritic('ấ', 'vi'), 'ầ');
  assert.equal(nextDiacritic('D', 'vi'), 'Đ');
  assert.equal(nationalKeyAction('Quote', 'nl').dead, 'acute');
});

void test('regional maps survive saved S0 and S1–S4 assignments and gestures', () => {
  const languageMapping = {
    order: ['en-AU', 'fr-CA'],
    slots: ['es-MX', 'pt-BR', 'de-CH', 'vi'],
  } as const;
  const parsed = parseSettings(
    JSON.stringify({ version: 1, languageMapping, showHints: true }),
  );
  assert.deepEqual(parsed?.languageMapping, languageMapping);
  const controller = new LanguageSwitchController();
  controller.handle(
    { code: 'CapsLock', down: true },
    'en-AU',
    languageMapping.order,
    languageMapping.slots,
  );
  assert.equal(
    controller.handle(
      { code: 'CapsLock', down: false },
      'en-AU',
      languageMapping.order,
      languageMapping.slots,
    ).locale,
    'fr-CA',
  );
  controller.handle(
    { code: 'CapsLock', down: true },
    'fr-CA',
    languageMapping.order,
    languageMapping.slots,
  );
  assert.equal(
    controller.handle(
      { code: 'KeyK', down: true },
      'fr-CA',
      languageMapping.order,
      languageMapping.slots,
    ).locale,
    'pt-BR',
  );
  assert.equal(
    controller.handle(
      { code: 'CapsLock', down: false },
      'pt-BR',
      languageMapping.order,
      languageMapping.slots,
    ).locale,
    undefined,
  );
  assert.deepEqual(defaultLanguageMapping('ar').order, ['en', 'ar']);
});

void test('new-language search includes localized names and national associations', () => {
  for (const [locale, query] of [
    ['ar', 'حقوق النشر'],
    ['tr', 'telif hakkı'],
    ['vi', 'bản quyền'],
    ['nl', 'auteursrecht'],
  ] as const) {
    assert.equal(searchSymbolItems(query, locale)[0].item.symbol, '©');
  }
  for (const [locale, query, expected] of [
    ['tr', 'Türkçe', '˘'],
    ['vi', 'Việt', '~'],
    ['nl', 'Nederlands', '¨'],
    ['ar', 'العربية', '“'],
  ] as const) {
    assert.ok(
      searchSymbolItems(query, locale).some(
        (result) => result.item.symbol === expected,
      ),
      query,
    );
  }
});
