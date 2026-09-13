# Localization, search and learning

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

These modules provide translated content and behavior for the demo. UI
components consume them without owning the keyboard maps, search rules or tour
progress rules.

## Languages and preferences

The interface supports 14 languages; the keyboard offers 24 language and
regional choices. Regional English choices share the US QWERTY reference. Arabic
and Hebrew use RTL direction.

| Module                                                            | Responsibility                                                         |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [messages.ts](../lib/messages.ts) and [locales](../lib/locales)   | Shared message keys and translations                                   |
| [i18n.ts](../lib/i18n.ts)                                         | Browser language detection, saved UI preference and localized metadata |
| [keyboard-locales.ts](../lib/keyboard-locales.ts)                 | Keyboard identifiers, region labels and map selection                  |
| [keyboard.ts](../lib/keyboard.ts)                                 | Platform-specific keyboard rows, modifier labels and text selection    |
| [theme.ts](../lib/theme.ts) and [platform.ts](../lib/platform.ts) | Theme and platform preferences with browser fallbacks                  |
| [preferences.ts](../lib/preferences.ts)                           | Apply initial preferences before revealing the typing interface        |

UI language and keyboard language are separate values. Initial keyboard language
follows the browser; a saved UI preference does not overwrite it. Explicit
synchronization when selecting an interface language belongs to the UI
integration.

All core dictionaries use `lib/locales/<language>.ts`. English defines the
message keys; each translation uses `satisfies Messages` to check missing or
extra keys. `messages.ts` registers the dictionaries and exports shared types.
Feature-specific catalogs (help, tour and search) also use TypeScript. JSON is
reserved for keyboard reference data, not translation dictionaries.

## Symbol search

Search accepts literal symbols, multilingual names, aliases, usage tags and
Unicode codes. It ranks exact matches before partial matches and spelling
corrections. All words in a query must match; results use the selected language
for display and alphabetical ordering.

Typo correction handles insertions, deletions, substitutions and adjacent
transpositions. It allows one edit for words of at least four letters, or two
when both words have at least eight letters. Short abbreviations, numbers and
Unicode codes are not guessed. Corrections affect matching, not visible tags.

- [symbol-search-index.ts](../lib/symbol-search-index.ts) builds searchable
  bindings and ranks matches.
- [symbol-search-metadata.ts](../lib/symbol-search-metadata.ts) and
  [symbol-names.ts](../lib/symbol-names.ts) provide names, descriptions and
  aliases.
- [symbol-search-usage.ts](../lib/symbol-search-usage.ts) adds language-specific
  usage and discovery terms.
- [symbol-search-categories.ts](../lib/symbol-search-categories.ts) groups
  results.

## Learning model

[tour.ts](../lib/tour.ts) builds exercises for symbols, diacritics, language
switching and demo controls. Users familiar with
[Ilya Birman’s Typography Layout](https://ilyabirman.ru/typography-layout/) skip
the first three introductory exercises. Language exercises follow the user's
configured S0 pair and S1–S4 slots.

Completion is retained for each step even if the user later changes the text or
mode. Declined, started and completed choices are remembered; a session fallback
works when persistent storage is unavailable. An optional final challenge
contains every distinct output from the shared symbol map, including spacing
accents and non-breaking space.

[Tour messages](../lib/tour-messages.ts),
[help messages](../lib/help-messages.ts) and
[help examples](../lib/help-examples.ts) supply localized instructions
separately from the completion rules.

## Validation

Run `bun run test`, `bun run typecheck` and `bun run lint`. Tests cover
translations, regional maps, preference bootstrap scripts, search ranking and
typos, RTL keyboard behavior and tour completion. They do not replace linguistic
review or browser testing of the rendered interface.
