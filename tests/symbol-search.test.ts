import { LANGUAGES } from '../lib/keyboard-locales.ts';
import {
  groupSymbolSearchResults,
  symbolCategory,
  SYMBOL_CATEGORIES,
  symbolCategoryNames,
} from '../lib/symbol-search-categories.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAllSymbolSearchItems,
  searchSymbolItems,
  scoreSearchTerm,
  normalizeSearchTerm,
} from '../lib/symbol-search-index.ts';
import { accents, layout } from '../lib/typing-engine.ts';
import { symbolSearchMessages } from '../lib/symbol-search-messages.ts';

const items = getAllSymbolSearchItems();
const printableBindings = layout
  .flatMap((key) => [
    { code: key.code, mode: 1, action: key.primary },
    { code: key.code, mode: 2, action: key.secondary },
  ])
  .filter(({ action }) => action.text);
void test('indexes every printable M1/M2 result with canonical bindings', () => {
  for (const { code, mode, action } of printableBindings) {
    const item = items.find((item) => item.symbol === action.text);
    assert.ok(item, `Missing ${code} M${mode}`);
    assert.ok(
      item.bindings.some(
        (binding) => binding.mode === mode && binding.keyCode === code,
      ),
      `${code} M${mode}`,
    );
  }
});
for (const locale of LANGUAGES) {
  void test(`${locale}: every printable result has complete localization`, () => {
    assert.ok(Object.values(symbolSearchMessages[locale]).every(Boolean));
    for (const { action } of printableBindings) {
      const item = items.find((item) => item.symbol === action.text)!;
      assert.ok(
        item.names[locale] && item.names[locale] !== item.symbol,
        `${item.symbol} name`,
      );
      assert.ok(item.description[locale], `${item.symbol} description`);
      assert.ok(item.aliases[locale]?.length, `${item.symbol} aliases`);
    }
  });
  void test(`${locale}: searches localized names independently of UI language`, () => {
    for (const item of items) {
      const results = searchSymbolItems(item.names[locale], 'en');
      assert.ok(
        results.some((result) => result.item.symbol === item.symbol),
        item.names[locale],
      );
    }
  });
}
void test('finds dollar through multilingual and colloquial associations', () => {
  for (const query of [
    'деньги',
    'баксы',
    'dollar',
    'cash',
    'зеленые',
    'зелёные',
    'gotowka',
    'argent',
    'Geld',
    'dinero',
    'dinheiro',
    'soldi',
    'bani',
    'כסף',
  ]) {
    assert.ok(
      searchSymbolItems(query, 'he').some(
        (result) => result.item.symbol === '$',
      ),
      query,
    );
  }
  for (const query of ['баксы', 'зеленые', 'dollar'])
    assert.equal(searchSymbolItems(query, 'ru')[0].item.symbol, '$');
});
void test('orders exact, prefix, word boundary, substring, and non-contiguous matches', () => {
  const candidates = [
    'dollar',
    'dollars',
    'us dollar',
    'petrodollar',
    'd o l l a r',
  ];
  const scores = candidates.map((value) => scoreSearchTerm(value, 'dollar')!);
  assert.ok(scores.every((score, i) => i === 0 || score > scores[i - 1]));
  assert.equal(scoreSearchTerm('dollar', 'xyz'), null);
  assert.equal(searchSymbolItems('dlr', 'en')[0].item.symbol, '$');
});
void test('matches multiple terms across fields and handles empty and absent results', () => {
  assert.ok(
    searchSymbolItems('dollar деньги', 'fr').some(
      (result) => result.item.symbol === '$',
    ),
  );
  assert.equal(searchSymbolItems('dollar zzzzzzzzzz', 'en').length, 0);
  assert.equal(searchSymbolItems('   ', 'en').length, items.length);
  assert.equal(new Set(items.map((item) => item.symbol)).size, items.length);
});
void test('preserves literal symbols, nonbreaking spaces, fractions and Unicode lookups', () => {
  for (const symbol of ['$', '¹', '¹⁄₂', '\u00a0', 'ѣ', 'Ѣ']) {
    assert.deepEqual(
      searchSymbolItems(symbol, 'en').map((result) => result.item.symbol),
      [symbol],
    );
  }
  assert.equal(searchSymbolItems('U+0024', 'en')[0].item.symbol, '$');
  assert.equal(normalizeSearchTerm('ZIELONE ŁÓDŹ'), 'zielone lodz');
  assert.equal(normalizeSearchTerm('зелёные'), 'зеленые');
});
void test('only the four base chords are marked as simultaneous shortcuts', () => {
  assert.deepEqual(
    items
      .filter((item) => item.bindings.some((binding) => binding.quick))
      .map((item) => item.symbol)
      .sort(),
    ['—', '…', '«', '»'].sort(),
  );
});

void test('indexes dead-key accents with the Space step for standalone output', () => {
  for (const key of layout) {
    if (!key.secondary.dead) continue;
    const symbol = accents[key.secondary.dead].spacing;
    const item = items.find((item) => item.symbol === symbol);
    assert.ok(
      item?.bindings.some(
        (binding) =>
          binding.keyCode === key.code &&
          binding.mode === 2 &&
          binding.finishWithSpace,
      ),
    );
    assert.ok(
      searchSymbolItems('diacritic', 'ru').some(
        (result) => result.item.symbol === symbol,
      ),
    );
  }
});

void test('groups the catalog once per symbol with localized headings and stable category order', () => {
  const groups = groupSymbolSearchResults(searchSymbolItems('', 'ru'), false);
  assert.deepEqual(
    groups.map((group) => group.category),
    [...SYMBOL_CATEGORIES],
  );
  const symbols = groups.flatMap((group) =>
    group.matches.map((result) => result.item.symbol),
  );
  assert.equal(symbols.length, items.length);
  assert.equal(new Set(symbols).size, items.length);
  for (const locale of LANGUAGES)
    for (const category of SYMBOL_CATEGORIES)
      assert.ok(symbolCategoryNames[locale][category]);
  for (const [symbol, category] of [
    ['$', 'currency'],
    ['¨', 'diacritics'],
    ['¹⁄₂', 'math'],
    ['—', 'punctuation'],
    ['→', 'arrows'],
    ['ѣ', 'letters'],
    ['⌘', 'keyboard'],
    ['©', 'other'],
  ]) {
    assert.equal(
      symbolCategory(items.find((item) => item.symbol === symbol)!),
      category,
    );
  }
});
void test('keeps the best matching category first and ranking inside each search group', () => {
  for (const query of ['dollar', 'arrow', 'diacritic', 'клавиша']) {
    const results = searchSymbolItems(query, 'ru');
    const groups = groupSymbolSearchResults(results, true);
    assert.equal(groups[0].matches[0], results[0]);
    for (const group of groups)
      assert.deepEqual(
        group.matches,
        results.filter(
          (result) => symbolCategory(result.item) === group.category,
        ),
      );
  }
  assert.deepEqual(groupSymbolSearchResults([], true), []);
});

void test('tolerates missing, extra, substituted and transposed letters without exposing misspellings', () => {
  for (const [query, symbol] of [
    ['долар', '$'],
    ['долллар', '$'],
    ['доллвр', '$'],
    ['доллра', '$'],
    ['dollra', '$'],
    ['апостраф', '’'],
    ['умляут', '¨'],
    ['кавычкм', '„'],
    ['cudzyslwo', '„'],
    ['guillemtes', '«'],
  ]) {
    assert.ok(
      searchSymbolItems(query, 'he').some((r) => r.item.symbol === symbol),
      query,
    );
    for (const item of items) {
      assert.ok(!Object.values(item.tags).flat().includes(query));
      assert.ok(!Object.values(item.aliases).flat().includes(query));
    }
  }
  assert.ok(
    scoreSearchTerm('dollar', 'dollar')! < scoreSearchTerm('dollar', 'dollra')!,
  );
  assert.equal(scoreSearchTerm('cat', 'cut'), null);
  assert.equal(scoreSearchTerm('0024', '0025'), null);
  assert.equal(scoreSearchTerm('dollar', 'dxxlar'), null);
  assert.equal(searchSymbolItems('U+0025', 'en').length, 0);
});

void test('finds language-specific symbols across UI languages, including countries and inflected queries', () => {
  for (const [query, symbols] of [
    ['польские кавычки', '„”'],
    ['полськие кавычки', '„”'],
    ['Polish quotes', '„”'],
    ['polskie cudzysłowy', '„”'],
    ['немецкие кавычки', '„“'],
    ['французские кавычки', '«»'],
    ['Польша', '´'],
    ['German', 'ßẞ¨'],
    ['испанский', '¡¿~'],
    ['венгерский', '˝'],
    ['Украина', 'іІ'],
    ['Франция', '¸'],
  ]) {
    const found = searchSymbolItems(query, 'he').map((r) => r.item.symbol);
    for (const symbol of symbols)
      assert.ok(found.includes(symbol), `${query}: ${symbol}`);
  }
  assert.ok(!items.find((i) => i.symbol === '“')!.tags.en!.includes('Polish'));
  assert.ok(
    !items.find((i) => i.symbol === '¸')!.tags.en!.includes('Romanian'),
  );
});

void test('explains the actual quotation pair, role and language, with localized examples for accents', () => {
  const bySymbol = (symbol: string) => items.find((i) => i.symbol === symbol)!;
  assert.match(
    bySymbol('„').description.ru!,
    /Открывающая кавычка: „…” \(польский/,
  );
  assert.match(
    bySymbol('”').description.ru!,
    /Закрывающая кавычка: „…” \(польский/,
  );
  assert.match(
    bySymbol('“').description.ru!,
    /Закрывающая кавычка: „…“ \(немецкий/,
  );
  assert.match(
    bySymbol('“').description.en!,
    /Opening quotation mark: “…” \(English/,
  );
  assert.match(
    bySymbol('‘').description.en!,
    /Closing quotation mark: ‚…‘ \(German/,
  );
  for (const locale of LANGUAGES) {
    assert.ok(bySymbol('¨').description[locale]!.includes('ä, ö, ü'));
    assert.ok(bySymbol('´').description[locale]!.includes('ć, ń, ó, ś, ź'));
    assert.ok(bySymbol('’').description[locale]!.includes('don’t'));
    assert.ok(bySymbol('`').description[locale]!.includes('Markdown'));
  }
  assert.equal(searchSymbolItems('апостраф', 'ru')[0].item.symbol, '’');
  assert.ok(!bySymbol('„').aliases.en!.includes('apostrophe'));
  assert.ok(!bySymbol('„').aliases.ru!.includes('ёлочки'));
});
