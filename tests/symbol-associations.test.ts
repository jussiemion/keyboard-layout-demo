import assert from 'node:assert/strict';
import test from 'node:test';
import groups from '../lib/symbol-search-associations.json' with { type: 'json' };
import { UI_LOCALES } from '../lib/messages.ts';
import { symbolAssociationTerms } from '../lib/symbol-search-associations.ts';
import { searchCatalog, symbolCatalog } from '../lib/symbol-catalog.ts';
import { searchCatalogItems } from '../lib/symbol-catalog-search.ts';

const topical = groups.filter((group) => 'id' in group);
const catalogSymbols = new Set(symbolCatalog.map((item) => item.symbol));

void test('every topical group has fourteen languages and valid catalog symbols', () => {
  assert.equal(new Set(topical.map((group) => group.id)).size, topical.length);
  for (const group of topical) {
    assert.deepEqual(
      Object.keys(group.terms).sort(),
      [...UI_LOCALES].sort(),
      group.id,
    );
    assert.equal(new Set(group.symbols).size, group.symbols.length, group.id);
    assert.ok(
      group.symbols.every((symbol) => catalogSymbols.has(symbol)),
      group.id,
    );
    assert.ok(
      Object.values(group.terms).every(
        (terms) => terms.length && terms.every((term) => term.trim()),
      ),
      group.id,
    );
  }
});

for (const locale of UI_LOCALES) {
  void test(`topic queries work in ${locale}, independently of interface language`, () => {
    for (const group of topical) {
      const items = symbolCatalog.filter((item) =>
        group.symbols.includes(item.symbol),
      );
      const matches = searchCatalogItems(group.terms[locale][0], 'en', items);
      assert.equal(matches.length, items.length, group.id);
    }
  });
}

for (const query of ['линукс', 'linux', 'ubuntu', 'тукс']) {
  void test(`${query} finds the Linux penguin`, () => {
    assert.equal(searchCatalog(query, 'ru')[0].symbol, '🐧');
  });
}

void test('gambling reaches playing cards, dice and the slot machine in the full index', () => {
  const matches = new Set(
    searchCatalog('азарт', 'ru').map((item) => item.symbol),
  );
  for (const symbol of ['🎰', '🎲', '🃏', '♠', '♥', '♦', '♣', '🂡', '🂮', '⚅']) {
    assert.ok(matches.has(symbol), symbol);
  }
});

void test('associations inherit skin tones without leaking into unrelated symbols', () => {
  assert.ok(symbolAssociationTerms('👨🏽‍🍳').includes('готовка'));
  assert.ok(!symbolAssociationTerms('😀').includes('linux'));
  assert.ok(!symbolAssociationTerms('🐧').includes('казино'));
});
