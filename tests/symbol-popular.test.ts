import assert from 'node:assert/strict';
import test from 'node:test';
import { popularSymbols, isPopularSymbol } from '../lib/symbol-popular.ts';
import { symbolCatalog, searchCatalog } from '../lib/symbol-catalog.ts';
import initial from '../lib/symbol-catalog-initial.json' with { type: 'json' };
import { searchCatalogItems } from '../lib/symbol-catalog-search.ts';
import { UI_LOCALES } from '../lib/messages.ts';

void test('popular collection is unique, available offline and ordered first', () => {
  assert.equal(new Set(popularSymbols).size, popularSymbols.length);
  assert.deepEqual(
    symbolCatalog.slice(0, popularSymbols.length).map((item) => item.symbol),
    popularSymbols,
  );
  assert.deepEqual(
    initial.items.slice(0, popularSymbols.length).map((item) => item.symbol),
    popularSymbols,
  );
});

void test('popular matches win ties without hiding exact or rare matches', () => {
  const source = symbolCatalog[0];
  const named = (symbol: string, name: string) => ({
    ...source,
    symbol,
    names: Object.fromEntries(
      UI_LOCALES.map((locale) => [locale, name]),
    ) as typeof source.names,
    aliases: {},
    tags: {},
    description: {},
    bindings: [],
  });
  const items = [named('⨌', 'integral'), named('💡', 'integral')];
  assert.deepEqual(
    searchCatalogItems('integral', 'en', items).map((item) => item.symbol),
    ['💡', '⨌'],
  );
  assert.equal(searchCatalogItems('⨌', 'en', items)[0].symbol, '⨌');
  assert.equal(
    searchCatalogItems('integral', 'en', [
      named('💡', 'integrality'),
      items[0],
    ])[0].symbol,
    '⨌',
  );
});

void test('expanded search still finds rare symbols and literal whitespace', () => {
  const rare = searchCatalog('U+2A0C', 'ru')[0];
  assert.equal(rare.symbol, '⨌');
  assert.equal(isPopularSymbol(rare.symbol), false);
  assert.deepEqual(
    searchCatalog('\u00a0', 'ru').map((item) => item.symbol),
    ['\u00a0'],
  );
  assert.deepEqual(searchCatalog('', 'en'), symbolCatalog);
});
