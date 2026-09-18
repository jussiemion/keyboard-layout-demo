import { searchCatalogItems } from './symbol-catalog-search';
import type { SymbolSearchItem } from './symbol-search-index';
import type { UiLocale } from './messages';

let items: SymbolSearchItem[] = [];
self.onmessage = (
  event: MessageEvent<
    { items: SymbolSearchItem[] } | { query: string; locale: UiLocale }
  >,
) => {
  if ('items' in event.data) {
    items = event.data.items;
    return;
  }
  const { query, locale } = event.data;
  self.postMessage({
    query,
    locale,
    symbols: searchCatalogItems(query, locale, items).map(
      (item) => item.symbol,
    ),
  });
};
