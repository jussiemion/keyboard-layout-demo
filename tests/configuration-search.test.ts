import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSymbolMap } from '../lib/symbol-map.ts';
import { searchSymbolItems } from '../lib/symbol-search-index.ts';

void test('search bindings follow remaps, removals and accents on either layer', () => {
  const keys = resolveSymbolMap({
    AC03: { primary: { text: '🧑‍💻' } },
    AB03: { primary: {}, secondary: {} },
    AC01: { primary: { dead: 'acute' } },
  });
  assert.equal(
    searchSymbolItems('🧑‍💻', 'en', keys)[0]?.item.bindings[0].keyCode,
    'KeyD',
  );
  assert.ok(
    !searchSymbolItems('©', 'en', keys).some(({ item }) => item.symbol === '©'),
  );
  assert.ok(
    searchSymbolItems('´', 'en', keys)[0]?.item.bindings.some(
      (binding) =>
        binding.keyCode === 'KeyA' &&
        binding.mode === 1 &&
        binding.finishWithSpace,
    ),
  );
  assert.equal(searchSymbolItems('©', 'en')[0]?.item.symbol, '©');
});
