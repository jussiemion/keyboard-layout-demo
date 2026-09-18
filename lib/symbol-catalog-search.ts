import { isPopularSymbol, popularSymbolPosition } from './symbol-popular.ts';
import {
  searchSymbolCollection,
  normalizeSearchTerm,
  type SymbolSearchItem,
} from './symbol-search-index.ts';
import type { UiLocale } from './messages.ts';

const partitions = new WeakMap<
  readonly SymbolSearchItem[],
  { popular: SymbolSearchItem[]; remaining: SymbolSearchItem[] }
>();

export function searchCatalogItems(
  query: string,
  locale: UiLocale,
  items: readonly SymbolSearchItem[],
) {
  if (!query) {
    return items.slice();
  }
  // Preserve literal searches for whitespace and combining marks across both groups.
  if (!normalizeSearchTerm(query).trim()) {
    const literal = items.find((item) => item.symbol === query);
    if (literal) {
      return [literal];
    }
  }
  let groups = partitions.get(items);
  if (!groups) {
    groups = { popular: [], remaining: [] };
    for (const item of items) {
      (isPopularSymbol(item.symbol) ? groups.popular : groups.remaining).push(
        item,
      );
    }
    partitions.set(items, groups);
  }
  const collator = new Intl.Collator(locale);
  const letterQuery = /^\p{L}$/u.test(query.trim());
  const rank = (match: { score: number; item: SymbolSearchItem }) =>
    letterQuery &&
    /^\p{L}+$/u.test(match.item.symbol) &&
    match.score >= 100 &&
    match.score < 230
      ? match.score - 50
      : match.score;
  // Search the curated collection first, then broaden to the remaining catalog.
  const popularMatches = searchSymbolCollection(query, locale, groups.popular);
  const remainingMatches = searchSymbolCollection(
    query,
    locale,
    groups.remaining,
  );
  return popularMatches
    .concat(remainingMatches)
    .sort(
      (a, b) =>
        // Literal/exact matches must stay above approximate popular matches.
        Math.floor(rank(a) / 100) - Math.floor(rank(b) / 100) ||
        Number(isPopularSymbol(b.item.symbol)) -
          Number(isPopularSymbol(a.item.symbol)) ||
        rank(a) - rank(b) ||
        (isPopularSymbol(a.item.symbol) && isPopularSymbol(b.item.symbol)
          ? popularSymbolPosition(a.item.symbol) -
            popularSymbolPosition(b.item.symbol)
          : 0) ||
        Array.from(a.item.symbol).length - Array.from(b.item.symbol).length ||
        collator.compare(a.item.names[locale], b.item.names[locale]),
    )
    .map(({ item }) => item);
}
