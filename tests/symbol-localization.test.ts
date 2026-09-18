import assert from 'node:assert/strict';
import test from 'node:test';
import { UI_LOCALES } from '../lib/messages.ts';
import terms from '../lib/symbol-localization-terms.json' with { type: 'json' };
import { supplementalSymbolNames } from '../lib/symbol-localization.ts';
import { searchCatalog, symbolCatalog } from '../lib/symbol-catalog.ts';

void test('every supplemental term covers all fourteen interface languages', () => {
  for (const [term, names] of Object.entries(terms)) {
    assert.deepEqual(Object.keys(names).sort(), [...UI_LOCALES].sort(), term);
    assert.ok(
      Object.values(names).every((name) => name.trim()),
      term,
    );
  }
});

for (const locale of UI_LOCALES) {
  void test(`gershayim is searchable and named in ${locale}`, () => {
    const name = terms.gershayim[locale];
    const item = symbolCatalog.find((entry) => entry.symbol === '״');
    assert.equal(item?.names[locale], name);
    assert.ok(
      searchCatalog(name, locale)
        .slice(0, 10)
        .some((entry) => entry.symbol === '״'),
    );
  });
}

void test('punctuation and cantillation remain distinct', () => {
  assert.equal(searchCatalog('гершаим', 'ru')[0].symbol, '״');
  assert.equal(searchCatalog('гершайим', 'en')[0].symbol, '״');
  assert.equal(supplementalSymbolNames('֞'), undefined);
});

void test('names preserve letter case and every canonical accent', () => {
  assert.equal(
    supplementalSymbolNames('ắ')?.ru,
    'латинская буква a (строчная); кратка; акут',
  );
  assert.equal(
    supplementalSymbolNames('Ą')?.pl,
    'litera łacińska A (wielka); ogonek',
  );
  assert.equal(supplementalSymbolNames('K'), undefined);
  assert.equal(supplementalSymbolNames('👍'), undefined);
});

void test('Braille dot numbers follow Unicode dot order, not visual row order', () => {
  assert.equal(supplementalSymbolNames('⠉')?.ru, 'точки Брайля: 14');
  assert.equal(supplementalSymbolNames('⣿')?.en, 'Braille dots: 12345678');
  assert.equal(supplementalSymbolNames('⠀')?.ru, 'пустая ячейка Брайля');
});

void test('supplemental names participate in search across UI languages', () => {
  assert.ok(searchCatalog('рожок', 'en').some((item) => item.symbol === 'ơ'));
  assert.ok(
    searchCatalog('киргизский сом', 'fr').some((item) => item.symbol === '⃀'),
  );
});

void test('mathematical letter names retain alphabet, case and style', () => {
  const boldAlpha = symbolCatalog.find((item) => item.symbol === '𝛂');
  assert.equal(
    boldAlpha?.names.ru,
    'математический символ; альфа (строчная); полужирный',
  );
  const italicA = symbolCatalog.find((item) => item.symbol === '𝑨');
  assert.equal(
    italicA?.names.ru,
    'математический символ; латинская буква A (прописная); полужирный; курсив',
  );
  assert.equal(supplementalSymbolNames('ς')?.ru, 'конечная сигма (строчная)');
});
