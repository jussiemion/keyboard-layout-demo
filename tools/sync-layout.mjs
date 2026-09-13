import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const source = process.argv[2];
if (!source) {
  throw new Error(
    'Usage: bun run sync:layout -- /path/to/keyboard-layout/core/layout.json',
  );
}
const text = await readFile(resolve(source), 'utf8');
const layout = JSON.parse(text);
if (
  layout.schema !== 1 ||
  layout.reference.version !== '3.9' ||
  !Array.isArray(layout.keys)
) {
  throw new Error('Unexpected source schema or Birman reference version');
}
await writeFile(new URL('../lib/layout.json', import.meta.url), text);
console.log(
  `Synced ${layout.keys.length} physical positions from canonical layout.json. Run bun run test.`,
);

const cycles = await readFile(
  resolve(dirname(source), 'diacritics.json'),
  'utf8',
);
const profiles = JSON.parse(cycles);
if (
  profiles.version !== 1 ||
  !profiles.profiles ||
  !profiles.uppercaseOverrides
) {
  throw new Error('Unexpected diacritics schema');
}
await writeFile(new URL('../lib/diacritics.json', import.meta.url), cycles);
console.log('Synced language-specific diacritic cycles.');
