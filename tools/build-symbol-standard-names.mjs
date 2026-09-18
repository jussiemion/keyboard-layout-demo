import { writeFileSync } from 'node:fs';
import { loadData } from '../lib/symbol-catalog-data/index.ts';
import { writeSymbolData } from './symbol-data-files.mjs';
const data = await loadData();
import { getAllSymbolSearchItems } from '../lib/symbol-search-index.ts';
import { unicodeLabel } from '../lib/symbol-presentation.ts';

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status}: ${url}`);
  }
  return response.text();
}
const [unicode, emoji] = await Promise.all([
  download('https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt'),
  download('https://www.unicode.org/Public/17.0.0/emoji/emoji-test.txt'),
]);
const characters = new Map();
for (const line of unicode.split('\n')) {
  const [code, name] = line.split(';');
  if (name && !name.startsWith('<')) {
    characters.set(String.fromCodePoint(parseInt(code, 16)), name);
  }
}
const sequences = new Map();
for (const line of emoji.split('\n')) {
  const match = line.match(/^([\dA-F ]+)\s*;[^#]+#\s*\S+\s+E[\d.]+\s+(.+)$/);
  if (match) {
    const symbol = match[1]
      .trim()
      .split(/\s+/)
      .map((code) => String.fromCodePoint(parseInt(code, 16)))
      .join('');
    sequences.set(symbol, match[2].trim());
  }
}
const symbols = new Set([
  ...Object.keys(data),
  ...getAllSymbolSearchItems().map((item) => item.symbol),
]);
const names = Object.fromEntries(
  [...symbols]
    .sort()
    .map((symbol) => [
      symbol,
      characters.get(symbol) ??
        sequences.get(symbol) ??
        Array.from(
          symbol,
          (char) => characters.get(char) ?? unicodeLabel(char),
        ).join(' + '),
    ]),
);
writeSymbolData('symbol-standard-names', names);
console.log(`Wrote ${symbols.size} standard names from Unicode 17.0.0`);

writeFileSync(
  new URL('../lib/symbol-emoji.json', import.meta.url),
  JSON.stringify(
    [...sequences.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    null,
    2,
  ) + '\n',
);
