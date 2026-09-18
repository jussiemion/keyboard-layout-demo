import { isEmoji } from '../lib/symbol-search-categories.ts';
import initialCatalog from '../lib/symbol-catalog-initial.json' with { type: 'json' };
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  symbolCatalog,
  searchCatalog,
  symbolPreview,
} from '../lib/symbol-catalog.ts';
import { validAction } from '../lib/symbol-map.ts';
import { UI_LOCALES } from '../lib/messages.ts';

void test('catalog assignments are safe, unique and displayable in every UI locale', () => {
  assert.ok(symbolCatalog.length > 10000);
  assert.equal(
    new Set(symbolCatalog.map((item) => item.symbol)).size,
    symbolCatalog.length,
  );
  for (const item of symbolCatalog) {
    assert.ok(validAction({ text: item.symbol }), item.symbol);
    assert.ok(
      UI_LOCALES.every((locale) => item.names[locale]),
      item.symbol,
    );
  }
});

for (const query of ['сердце', 'heart', 'לב', 'قلب', 'serce', 'cœur']) {
  void test(`finds hearts via ${query} independently of UI locale`, () => {
    assert.ok(
      searchCatalog(query, 'de')
        .slice(0, 120)
        .some((item) => item.symbol === '❤'),
    );
  });
}

void test('retains main search aliases and accepts Unicode codes and literal whitespace', () => {
  assert.ok(searchCatalog('баксы', 'en').some((item) => item.symbol === '$'));
  assert.equal(searchCatalog('U+221E', 'ru')[0].symbol, '∞');
  assert.equal(searchCatalog('\u2009', 'en')[0].symbol, '\u2009');
  assert.equal(searchCatalog('❤', 'en')[0].symbol, '❤');
});

void test('spelling correction works for the extended catalog', () => {
  assert.ok(
    searchCatalog('unicorm', 'en').some((item) => item.symbol === '🦄'),
  );
});

void test('preview markers are not part of the actual assignment', () => {
  assert.equal(symbolPreview('\u0301'), '◌\u0301');
  assert.equal(symbolPreview('\u2009'), '␣');
  assert.ok(symbolCatalog.some((item) => item.symbol === '\u0301'));
});

void test('immediate palette is the stable prefix of the complete catalog', () => {
  assert.equal(initialCatalog.total, symbolCatalog.length);
  assert.deepEqual(
    initialCatalog.items.map(({ symbol, standardName, names }) => ({
      symbol,
      standardName,
      names,
    })),
    symbolCatalog.slice(0, 256).map(({ symbol, standardName, names }) => ({
      symbol,
      standardName,
      names,
    })),
  );
  assert.ok(
    initialCatalog.items.every((item) => !Object.keys(item.aliases).length),
  );
});

for (const query of [
  'класс',
  'awesome',
  'świetnie',
  'klasse',
  'génial',
  'genial',
  'ótimo',
  'ottimo',
  'grozav',
  'geweldig',
  'harika',
  'tuyệt vời',
  'אחלה',
  'رائع',
]) {
  void test(`conversational approval: ${query}`, () => {
    const results = searchCatalog(query, 'en');
    assert.ok(
      results.slice(0, 30).some((item) => item.symbol === '👍'),
      query,
    );
    assert.ok(
      results.some((item) => item.symbol === '👍🏽'),
      query,
    );
  });
}

void test('literal letter stays first without suppressing name and alias matches', () => {
  const results = searchCatalog('Я', 'en');
  assert.equal(results[0].symbol, 'Я');
  assert.ok(results.slice(0, 60).some((item) => item.symbol === 'ѣ'));
  assert.ok(results.some((item) => item.symbol === 'Ѣ'));
  assert.ok(results.some((item) => item.symbol === 'я'));
  const latin = searchCatalog('A', 'ru');
  assert.equal(latin[0].symbol, 'A');
  assert.ok(latin.some((item) => item.symbol === '→'));
});

void test('conversational queries tolerate spelling mistakes and combine tokens', () => {
  assert.ok(
    searchCatalog('спосибо', 'en').some((item) => item.symbol === '🙏'),
  );
  assert.ok(
    searchCatalog('well done', 'ru').some((item) => item.symbol === '👍'),
  );
});

void test('palette footer names use Unicode names rather than localized display labels', () => {
  const names = new Map(
    symbolCatalog.map((item) => [item.symbol, item.standardName]),
  );
  assert.equal(names.get('״'), 'HEBREW PUNCTUATION GERSHAYIM');
  assert.equal(names.get('A'), 'LATIN CAPITAL LETTER A');
  assert.equal(names.get('👍'), 'THUMBS UP SIGN');
  assert.equal(names.get('👍🏽'), 'thumbs up: medium skin tone');
  assert.equal(
    names.get('¹⁄₂'),
    'SUPERSCRIPT ONE + FRACTION SLASH + SUBSCRIPT TWO',
  );
  // Private-use characters have no official Unicode character name.
  assert.equal(names.get(''), 'U+F8FF');
  assert.ok(symbolCatalog.every((item) => item.standardName));
});

void test('emoji category recognizes complete Unicode sequences without ordinary digits', () => {
  for (const symbol of ['👍', '👍🏽', '👨‍👩‍👧‍👦', '🇵🇱', '1️⃣', '❤️']) {
    assert.ok(isEmoji(symbol), symbol);
    assert.ok(
      symbolCatalog.some(
        (item) =>
          item.symbol.replaceAll('\uFE0F', '') ===
          symbol.replaceAll('\uFE0F', ''),
      ),
      symbol,
    );
  }
  for (const symbol of ['1', '#', 'A', '∫']) {
    assert.equal(isEmoji(symbol), false, symbol);
  }
});
