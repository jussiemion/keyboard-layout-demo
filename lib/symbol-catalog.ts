import { qualifyEmojiKeycap } from './symbol-presentation.ts';
import { isPopularSymbol, popularSymbolPosition } from './symbol-popular.ts';
import { loadData as loadStandardNames } from './symbol-standard-names/index.ts';
import { searchCatalogItems } from './symbol-catalog-search.ts';
import { loadData as loadRecords } from './symbol-catalog-data/index.ts';
import { UI_LOCALES, type UiLocale } from './messages.ts';
import {
  supplementalSymbolNames,
  supplementalSymbolAliases,
} from './symbol-localization.ts';
import { validAction } from './symbol-map.ts';
import {
  getAllSymbolSearchItems,
  type SymbolSearchItem,
} from './symbol-search-index.ts';
import {
  symbolCategory,
  isEmoji,
  symbolCategoryNames,
  type SymbolCategory,
} from './symbol-search-categories.ts';

type CatalogRecord = [
  SymbolCategory,
  string,
  Partial<Record<UiLocale, [string, string]>>,
];

const [data, standardNames] = await Promise.all([
  loadRecords(),
  loadStandardNames(),
]);
const standardNameBySymbol = standardNames as Record<string, string>;
const categories = new Map<string, SymbolCategory>();
const records = data as unknown as Record<string, CatalogRecord>;
const items = new Map<string, SymbolSearchItem>();
for (const [
  sourceSymbol,
  [category, unicodeName, translations],
] of Object.entries(records).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
  const symbol = qualifyEmojiKeycap(sourceSymbol);
  if (!validAction({ text: symbol })) {
    continue;
  }
  const resolvedCategory =
    category === 'other' && isEmoji(symbol) ? 'emoji' : category;
  categories.set(symbol, resolvedCategory);
  const supplemental = supplementalSymbolNames(symbol, unicodeName);
  const names = Object.fromEntries(
    UI_LOCALES.map((locale) => [
      locale,
      translations[locale]?.[0] ||
        supplemental?.[locale] ||
        translations.en?.[0] ||
        unicodeName ||
        symbol,
    ]),
  ) as Record<UiLocale, string>;
  items.set(symbol, {
    symbol,
    standardName:
      standardNameBySymbol[symbol] ?? standardNameBySymbol[sourceSymbol],
    names,
    aliases: Object.fromEntries(
      UI_LOCALES.map((locale) => [
        locale,
        (
          translations[locale]?.[1].split('|').map((term) => term.trim()) ?? []
        ).concat(
          locale === 'en' && unicodeName ? [unicodeName] : [],
          supplemental ? [supplemental[locale]] : [],
          supplementalSymbolAliases[symbol]?.[locale] ?? [],
        ),
      ]),
    ),
    tags: Object.fromEntries(
      UI_LOCALES.map((locale) => [
        locale,
        [symbolCategoryNames[locale][resolvedCategory]],
      ]),
    ),
    description: {},
    bindings: [],
  });
}
// Preserve the hand-curated synonyms, national usage and misspelling support.
for (const item of getAllSymbolSearchItems()) {
  const existing = items.get(item.symbol);
  categories.set(item.symbol, symbolCategory(item));
  items.set(item.symbol, {
    ...item,
    standardName: standardNameBySymbol[item.symbol],
    aliases: Object.fromEntries(
      UI_LOCALES.map((locale) => [
        locale,
        (existing?.aliases[locale] ?? []).concat(item.aliases[locale] ?? []),
      ]),
    ),
  });
}

const standardSymbols = new Set(
  getAllSymbolSearchItems().map((item) => item.symbol),
);
const catalogItems = Array.from(items.values());
export const symbolCatalog = catalogItems
  .filter((item) => isPopularSymbol(item.symbol))
  .sort(
    (a, b) => popularSymbolPosition(a.symbol) - popularSymbolPosition(b.symbol),
  )
  .concat(
    catalogItems.filter(
      (item) =>
        !isPopularSymbol(item.symbol) && standardSymbols.has(item.symbol),
    ),
    catalogItems.filter(
      (item) =>
        !isPopularSymbol(item.symbol) && !standardSymbols.has(item.symbol),
    ),
  );
export const catalogCategory = (symbol: string) =>
  categories.get(symbol) ?? 'other';

export function searchCatalog(query: string, locale: UiLocale) {
  return searchCatalogItems(query, locale, symbolCatalog);
}

export { symbolPreview, unicodeLabel } from './symbol-presentation.ts';
