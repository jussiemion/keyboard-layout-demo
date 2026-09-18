import groups from './symbol-search-associations.json' with { type: 'json' };

// Conversational intent supplements CLDR's descriptive names and keywords.
const terms = new Map<string, string[]>();
for (const group of groups) {
  for (const symbol of group.symbols) {
    terms.set(
      symbol,
      Array.from(
        new Set(
          (terms.get(symbol) ?? []).concat(Object.values(group.terms).flat()),
        ),
      ),
    );
  }
}

export function symbolAssociationTerms(symbol: string): readonly string[] {
  const base = symbol.replace(/[\uFE0E\uFE0F]|\p{Emoji_Modifier}/gu, '');
  return terms.get(base) ?? [];
}
