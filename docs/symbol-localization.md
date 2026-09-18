# Symbol-name localization checklist

The palette contains 11,362 source records. Search keywords and display names
are separate: localized names support search and accessible labels. The footer
uses official English Unicode character names or Unicode emoji sequence names.
Other sequences list the names of their constituent characters; private-use
characters without an official name are identified by their code point.

The [per-symbol audit](symbol-localization-audit.csv) lists every source symbol,
its code points, category, Unicode name, and the source of its name in each of
the fourteen interface languages. `MISSING` means that localized search names
still fall back to English. A nonempty fallback is **not** counted as a
translation.

## Work queue

<!-- source-queue:start -->

| Order | Source category        |   Records | Missing localized names |
| ----- | ---------------------- | --------: | ----------------------: |
| 1     | Currencies             |        41 |                       0 |
| 2     | Punctuation and spaces |       327 |                     244 |
| 3     | Diacritics             |       308 |                     275 |
| 4     | Letters                |      2407 |                     917 |
| 5     | Mathematics            |      1062 |                     875 |
| 6     | Arrows                 |       589 |                     487 |
| 7     | Keyboard symbols       |       207 |                     186 |
| 8     | Other symbols          |      6421 |                    2187 |
|       | **Total**              | **11362** |                **5171** |

<!-- source-queue:end -->

This is a localization work queue grouped by **source-data category**, not a
list of palette tabs. The source categories partition the 11,362 records;
`other` includes miscellaneous symbols and many emoji. They are also distinct
from Unicode blocks. Mathematical letters may belong to `letters` or `math`.

## Palette tabs

<!-- palette-tabs:start -->

| Tab                    | Matching symbols |
| ---------------------- | ---------------: |
| Popular                |              143 |
| Emoji                  |             3953 |
| Currencies             |               41 |
| Diacritics             |              313 |
| Mathematics            |             1070 |
| Punctuation and spaces |              323 |
| Arrows                 |              587 |
| Letters                |             2407 |
| Keyboard symbols       |              208 |
| All symbols            |            11370 |

<!-- palette-tabs:end -->

This table uses the same tab list and matching function as the palette. It
includes the eight additional curated records, giving 11,370 selectable items.
Popular symbols and emoji overlap other tabs, so **tab counts must not be added
together**. The palette opens on Popular; All symbols is last. There is no Other
symbols tab, but those records remain available under All symbols and through
search.

The audit tool regenerates both tables and the CSV. Missing-name counts refer to
localized search/accessibility labels, not the official English footer names.

## Completed supplemental passes

- Names for the five currencies absent from the existing translations.
- Common punctuation and mathematical operators; Hebrew punctuation and selected
  vowel points. Gershayim punctuation and the similarly named cantillation mark
  are deliberately distinct.
- Common combining accents, including familiar alternative names for search.
- Canonically decomposable Latin letters with the supported accents. Names
  retain case and every accent; no accents are silently discarded.
- Basic Greek letters and supported accent combinations.
- Mathematical alphabet styles whose base letter and style can be identified
  exactly. Unsupported variants remain in the queue.
- All 256 Braille cells, including the blank cell and dot numbers.

These passes fill **1,831 previously incomplete records**. They do not imply
that all remaining names, or every possible colloquial keyword, are covered.
Translations should still receive native-speaker review, especially uncommon
transliterations and specialist terminology.

## Review each remaining symbol

1. Identify the actual Unicode character, distinguishing lookalikes and
   punctuation from combining marks.
2. Provide its common name in every supported language. Where no conventional
   name exists, use a precise localized description and retain the specialist
   term as a search alias.
3. Add common spelling variants, synonyms and use-case keywords. Keep these
   aliases separate from the footer's standard Unicode name.
4. Check the search result, case, accent, direction and variant. Add regression
   coverage for ambiguous names and generated families.
5. Regenerate the initial palette and the audit. Do not mark an English
   fallback, machine-translation draft or generic category label as complete.

## Maintenance

Supplemental terminology lives in `lib/symbol-localization-terms.json` and its
explicit character mappings and bounded templates in
`lib/symbol-localization.ts`. The catalog consumes these without changing the
upstream Unicode/CLDR data. Existing curated names and CLDR translations take
precedence; supplemental names also enter the search index as aliases.

Raw Unicode/CLDR records are stored in `lib/symbol-catalog-data/`, grouped by
source category and divided into files of at most 128 KiB before formatting.
Standard English names live in `lib/symbol-standard-names/` with the same size
limit. Each directory has a manifest and a generated loader with explicit
asynchronous imports. Small dictionaries remain together.

The initial palette contains 256 display-only records, including all 143 popular
symbols. It omits search aliases, tags, descriptions and bindings. Opening
Popular does not load the full catalog. Searching or choosing another tab loads
all catalog parts once through cached modules, preserving search across all 14
languages. The worker receives the index when the catalog changes, not on every
keystroke. If loading fails, Popular remains usable.

```sh
node tools/build-symbol-standard-names.mjs
node tools/audit-symbol-localization.mjs
node tools/build-symbol-initial.mjs
bunx oxfmt lib/symbol-catalog-data lib/symbol-standard-names lib/symbol-catalog-initial.json docs/symbol-localization.md
node --test tests/symbol-localization.test.ts tests/symbol-catalog.test.ts
```

The CSV sources are `curated`, `CLDR`, `supplemental`, `Unicode` (English only)
and `MISSING`. They indicate provenance, not independent linguistic validation.
