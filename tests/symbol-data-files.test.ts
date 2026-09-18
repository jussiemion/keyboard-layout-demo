import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { symbolCatalog, catalogCategory } from '../lib/symbol-catalog.ts';
import {
  PALETTE_TABS,
  matchesPaletteCategory,
} from '../lib/symbol-palette-categories.ts';

for (const directory of ['symbol-catalog-data', 'symbol-standard-names']) {
  void test(`${directory} has bounded, disjoint source files`, () => {
    const root = new URL(`../lib/${directory}/`, import.meta.url);
    const manifest: string[] = JSON.parse(
      readFileSync(new URL('manifest.json', root), 'utf8'),
    );
    const symbols = new Set<string>();
    for (const name of manifest) {
      const file = new URL(name, root);
      assert.ok(statSync(file).size <= 128 * 1024, name);
      for (const symbol of Object.keys(
        JSON.parse(readFileSync(file, 'utf8')),
      )) {
        assert.ok(!symbols.has(symbol), symbol);
        symbols.add(symbol);
      }
    }
    assert.equal(
      symbols.size,
      directory === 'symbol-catalog-data' ? 11362 : 11370,
    );
  });
}

void test('documented tabs follow the actual palette filters, including overlapping collections', () => {
  assert.equal(PALETTE_TABS[0], 'popular');
  assert.equal(PALETTE_TABS.at(-1), '');
  assert.ok(!PALETTE_TABS.includes('other'));
  const count = (category: string) =>
    symbolCatalog.filter((item) =>
      matchesPaletteCategory(item.symbol, category, catalogCategory),
    ).length;
  assert.equal(count('popular'), 143);
  assert.equal(count(''), 11370);
  assert.ok(matchesPaletteCategory('©', 'emoji', catalogCategory));
  assert.ok(matchesPaletteCategory('©', 'popular', catalogCategory));
  const doc = readFileSync(
    new URL('../docs/symbol-localization.md', import.meta.url),
    'utf8',
  );
  assert.match(doc, /Popular\s*\|\s*143/);
  assert.match(doc, /All symbols\s*\|\s*11370/);
});
