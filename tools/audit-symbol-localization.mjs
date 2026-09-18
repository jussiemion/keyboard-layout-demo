import {
  PALETTE_TABS,
  matchesPaletteCategory,
} from '../lib/symbol-palette-categories.ts';
import { symbolCatalog, catalogCategory } from '../lib/symbol-catalog.ts';
import { symbolCategoryNames } from '../lib/symbol-search-categories.ts';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadData } from '../lib/symbol-catalog-data/index.ts';
const data = await loadData();
import { UI_LOCALES } from '../lib/messages.ts';
import { getAllSymbolSearchItems } from '../lib/symbol-search-index.ts';
import { supplementalSymbolNames } from '../lib/symbol-localization.ts';

const curated = new Map(
  getAllSymbolSearchItems().map((item) => [item.symbol, item]),
);
const counts = new Map();
const rows = [
  [
    'Unicode',
    'Symbol',
    'Category',
    'Unicode name',
    ...UI_LOCALES,
    'Missing localized names',
  ],
];
for (const [symbol, [category, name, labels]] of Object.entries(data)) {
  const supplemental = supplementalSymbolNames(symbol, name);
  const sources = UI_LOCALES.map((locale) => {
    if (curated.get(symbol)?.names[locale]) {
      return 'curated';
    }
    if (labels[locale]?.[0]) {
      return 'CLDR';
    }
    if (supplemental?.[locale]) {
      return 'supplemental';
    }
    return locale === 'en' ? 'Unicode' : 'MISSING';
  });
  const missing = UI_LOCALES.filter((_, index) => sources[index] === 'MISSING');
  const group = counts.get(category) ?? { total: 0, missing: 0 };
  group.total++;
  if (missing.length) {
    group.missing++;
  }
  counts.set(category, group);
  rows.push([
    Array.from(
      symbol,
      (char) => `U+${char.codePointAt(0).toString(16).toUpperCase()}`,
    ).join(' '),
    symbol,
    category,
    name,
    ...sources,
    missing.join(' '),
  ]);
}
writeFileSync(
  new URL('../docs/symbol-localization-audit.csv', import.meta.url),
  rows
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','),
    )
    .join('\n') + '\n',
);
console.log(Object.fromEntries(counts));

const documentation = new URL(
  '../docs/symbol-localization.md',
  import.meta.url,
);
let prose = readFileSync(documentation, 'utf8');
const sourceOrder = [
  'currency',
  'punctuation',
  'diacritics',
  'letters',
  'math',
  'arrows',
  'keyboard',
  'other',
];
const sourceRows = sourceOrder.map((category, index) => {
  const { total, missing } = counts.get(category);
  return `| ${index + 1} | ${symbolCategoryNames.en[category]} | ${total} | ${missing} |`;
});
sourceRows.push(
  `| | **Total** | **${Object.keys(data).length}** | **${Array.from(counts.values()).reduce((sum, group) => sum + group.missing, 0)}** |`,
);
const tabRows = PALETTE_TABS.map((category) => {
  const matching = symbolCatalog.filter((item) =>
    matchesPaletteCategory(item.symbol, category, catalogCategory),
  );
  const name =
    category === 'popular'
      ? 'Popular'
      : category
        ? symbolCategoryNames.en[category]
        : 'All symbols';
  return `| ${name} | ${matching.length} |`;
});
prose = prose.replace(
  /<!-- source-queue:start -->[\s\S]*?<!-- source-queue:end -->/u,
  [
    '<!-- source-queue:start -->',
    '',
    '| Order | Source category | Records | Missing localized names |',
    '| --- | --- | ---: | ---: |',
  ]
    .concat(sourceRows, ['', '<!-- source-queue:end -->'])
    .join('\n'),
);
prose = prose.replace(
  /<!-- palette-tabs:start -->[\s\S]*?<!-- palette-tabs:end -->/u,
  [
    '<!-- palette-tabs:start -->',
    '',
    '| Tab | Matching symbols |',
    '| --- | ---: |',
  ]
    .concat(tabRows, ['', '<!-- palette-tabs:end -->'])
    .join('\n'),
);
writeFileSync(documentation, prose);
