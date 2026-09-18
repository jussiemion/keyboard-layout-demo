import assert from 'node:assert/strict';
import test from 'node:test';
import groups from '../lib/symbol-search-associations.json' with { type: 'json' };
import { symbolAssociationTerms } from '../lib/symbol-search-associations.ts';
import { UI_LOCALES } from '../lib/messages.ts';
import {
  searchSymbolCollection,
  type SymbolSearchItem,
} from '../lib/symbol-search-index.ts';

void test('association dictionaries cover every interface language with nonempty keys', () => {
  for (const group of groups) {
    assert.deepEqual(Object.keys(group.terms).sort(), [...UI_LOCALES].sort());
    assert.ok(
      Object.values(group.terms).every(
        (terms) => terms.length && terms.every((term) => term.trim()),
      ),
    );
  }
});

const fixtures: SymbolSearchItem[] = ['🐧', '🎰', '🂡', '😀'].map((symbol) => ({
  symbol,
  names: Object.fromEntries(
    UI_LOCALES.map((locale) => [locale, symbol]),
  ) as SymbolSearchItem['names'],
  aliases: {},
  tags: {},
  description: {},
  bindings: [],
}));

for (const locale of UI_LOCALES) {
  void test(`topic keys in ${locale} work independently of the interface locale`, () => {
    const linux = groups.find(
      (group) => 'id' in group && group.id === 'linux',
    )!;
    const casino = groups.find(
      (group) => 'id' in group && group.id === 'casino',
    )!;
    assert.equal(
      searchSymbolCollection(linux.terms[locale][0], 'en', fixtures)[0].item
        .symbol,
      '🐧',
    );
    const matches = searchSymbolCollection(
      casino.terms[locale][0],
      'en',
      fixtures,
    ).map(({ item }) => item.symbol);
    assert.ok(matches.includes('🎰'));
    assert.ok(matches.includes('🂡'));
    assert.ok(!matches.includes('😀'));
  });
}

void test('emoji variants inherit base associations without unrelated topic leakage', () => {
  assert.ok(symbolAssociationTerms('👨🏽‍🍳').includes('готовка'));
  assert.ok(symbolAssociationTerms('👍🏽').includes('класс'));
  assert.ok(symbolAssociationTerms('🐧').includes('линукс'));
  assert.ok(!symbolAssociationTerms('🐧').includes('казино'));
});
