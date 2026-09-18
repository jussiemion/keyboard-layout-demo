import {
  SYMBOL_CATEGORIES,
  isEmoji,
  type SymbolCategory,
} from './symbol-search-categories.ts';
import { isPopularSymbol } from './symbol-popular.ts';

export const PALETTE_TABS = ['popular'].concat(
  SYMBOL_CATEGORIES.filter((category) => category !== 'other'),
  '',
);

export function matchesPaletteCategory(
  symbol: string,
  category: string,
  categoryOf: (symbol: string) => SymbolCategory,
) {
  if (!category) {
    return true;
  }
  if (category === 'popular') {
    return isPopularSymbol(symbol);
  }
  if (category === 'emoji') {
    return isEmoji(symbol);
  }
  return categoryOf(symbol) === category;
}
