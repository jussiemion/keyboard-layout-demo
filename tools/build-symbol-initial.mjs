import { writeFileSync } from 'node:fs';
import { symbolCatalog, catalogCategory } from '../lib/symbol-catalog.ts';

// Keep the immediately available viewport identical to the full catalog prefix.
const items = symbolCatalog.slice(0, 256).map((item) => ({
  symbol: item.symbol,
  standardName: item.standardName,
  names: item.names,
  aliases: {},
  tags: {},
  description: {},
  bindings: [],
}));
writeFileSync(
  new URL('../lib/symbol-catalog-initial.json', import.meta.url),
  JSON.stringify(
    {
      total: symbolCatalog.length,
      items,
      categories: Object.fromEntries(
        items.map((item) => [item.symbol, catalogCategory(item.symbol)]),
      ),
    },
    null,
    2,
  ) + '\n',
);
