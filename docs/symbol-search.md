# Symbol search

[Overview](../README.md) · [Browser behavior](browser-adapter.md)

Open the magnifier, <kbd>Ctrl</kbd> + <kbd>F</kbd> or <kbd>Ctrl</kbd> +
<kbd>K</kbd>. Search a character, name, `U+0024`, language or country. Matching
covers all **14 languages**, independently of the interface. Queries stay in the
browser.

Results explain how to type the symbol and where it is used. On desktop, details
appear beside the list; on mobile, the back button restores the query and list
position. Changing the selected symbol resets only the detail pane’s scroll.

## Catalog and ranking

The typing engine derives distinct printable **`M1`/`M2`** outputs and
standalone dead accents from `lib/layout.json`. Each symbol retains its
available bindings. Standalone accents finish with <kbd>Space</kbd>; quick
**`M0`** chords appear only where the canonical map marks them as quick.

Matches rank in this order:

1. Literal symbol or exact term.
2. Prefix, word boundary or substring.
3. Ordered subsequence.
4. Spelling correction.

Names and specific aliases outrank broad tags. Every query word must match.
Accent folding supports queries such as `gotowka` and `diametre`; literal
comparison happens first so case, superscripts and NBSP remain distinct. Locale
collation breaks ties. Descriptions are displayed but not indexed.

Typo correction uses whole-word optimal-string-alignment distance: one edit for
4–7 letters, two for 8 or more; an adjacent transposition counts as one. Short
tokens, numbers and Unicode codes are excluded. Corrections never appear as
tags. Per-query caching avoids repeated comparisons.

Empty searches use fixed category order. Otherwise, the category with the
strongest match comes first; empty categories disappear.

## Source files

| File in `lib/`                | Responsibility                                            |
| ----------------------------- | --------------------------------------------------------- |
| `symbol-search-index.ts`      | Curated aliases and matching                              |
| `symbol-search-metadata.ts`   | Symbol families and descriptions                          |
| `symbol-search-usage.ts`      | Language-specific usage and country/language associations |
| `symbol-search-messages.ts`   | Search UI translations                                    |
| `symbol-search-categories.ts` | Localized result groups                                   |

Attach an association to the narrowest relevant symbol or family. Include a
regression in [search tests](../tests/symbol-search.test.ts). A country tag is a
search aid, not a claim of exclusive usage. Quote descriptions identify the pair
and each symbol’s opening/closing role; conventions can vary by publication and
region.

## Input and accessibility

Dialog/<kbd>Command</kbd> primitives handle focus, <kbd>Esc</kbd> and list
navigation. Item identifiers encode code points because cmdk trims values. RTL
prose is independent of pane arrangement; key sequences and Unicode codes remain
LTR.

Opening or closing search resets transient key state without changing text or
language. Search shortcuts use physical key positions and exclude
<kbd>Shift</kbd>, <kbd>Alt</kbd>/<kbd>AltGr</kbd>, <kbd>Meta</kbd> and
composition events. A repeated shortcut focuses the search field.

## Usage references

- [Unicode 16, §6.2.6–6.2.7](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-6/):
  quotation marks and apostrophes.
- CLDR 48 delimiters and exemplar characters:
  [Polish](https://github.com/unicode-org/cldr/blob/release-48/common/main/pl.xml),
  [German](https://github.com/unicode-org/cldr/blob/release-48/common/main/de.xml),
  [Romanian](https://github.com/unicode-org/cldr/blob/release-48/common/main/ro.xml),
  [French](https://github.com/unicode-org/cldr/blob/release-48/common/main/fr.xml).
  `↑↑↑` indicates inheritance.

The catalog also covers Arabic, Turkish, Vietnamese and Dutch usage. No single
country is assigned to Arabic. Examples are curated references, not universal
style rules.
