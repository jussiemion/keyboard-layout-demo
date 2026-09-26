# Typing engine

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

The typing engine converts physical key events into text actions without
depending on the DOM or a UI framework. The browser integration applies the
returned actions to its text field.

## Modes

- **`M0`** is ordinary typing. Holding <kbd>Alt</kbd> enables quick typography
  chords.
- Tap and release <kbd>Alt</kbd> to select **`M1`**, then press a symbol key.
- Tap and release <kbd>Alt</kbd> twice to select **`M2`**, then press a symbol
  key.
- <kbd>Esc</kbd> cancels a pending symbol or accent. Prefixes have no timeout.

The shared symbol layers follow
[Ilya Birman’s Typography Layout 3.9](https://ilyabirman.ru/typography-layout/).
National keyboard maps determine ordinary and shifted input; supported languages
can also provide postfix <kbd>Shift</kbd> diacritic cycles. After releasing the
letter key, tap either <kbd>Shift</kbd> to apply the first accent and open its
menu. Further left/right <kbd>Shift</kbd> taps immediately apply the
next/previous option; Shift keeps the menu open; Enter, a digit or a click
closes it. Case and independent stress are preserved. Variants already available
on an ordinary key in the selected national map are excluded, along with their
uppercase equivalents. This does not exclude Alt combinations or dead-key
sequences. For example, Russian е/ё and и/й need no Shift cycle.

## Source files

| File                                                        | Responsibility                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| [typing-engine.ts](../lib/typing-engine.ts)                 | Modes, key handling, composition and text-edit actions     |
| [keyboard-locales.ts](../lib/keyboard-locales.ts)           | Language identifiers and base/regional map selection       |
| [layout.json](../lib/layout.json)                           | Shared typographic symbol assignments and source reference |
| [national-layouts.json](../lib/national-layouts.json)       | National key actions derived from XKB definitions          |
| [diacritics.json](../lib/diacritics.json)                   | Shared accent profiles                                     |
| [national-diacritics.json](../lib/national-diacritics.json) | Additional language profiles                               |
| [diacritic-profiles.ts](../lib/diacritic-profiles.ts)       | Merge shared and language-specific profiles                |

National reference data was exported from xkeyboard-config 2.48 using
libxkbcommon. It is bundled as data; normal application builds do not need
either library installed and do not modify OS keyboard configuration.

## Validation

```sh
bun run test
bun run typecheck
bun run lint
```

The tests cover symbol layers across keyboard options and both Alt keys, quick
chords, cancellation, accent composition, postfix cycles and text edits. These
tests exercise engine behavior; they do not simulate OS keyboard remapping.

## Accent menu timing

Hold an eligible base letter for 250 ms to open its variants and apply item 2.
Holding the letter alone never advances further. If Shift is already held when
the letter opens the menu, selection starts at the base (item 1), preserving
case.

After typing or choosing a character, tap left/right Shift to apply the
next/previous variant and open the menu. Reopening continues from the current
character: z → ż → ź → z. Holding Shift alone for 500 ms also opens the menu and
applies the next/previous variant; continued holding repeats every 500 ms.
Releasing Shift stops repetition without applying an extra step.

The menu stays open indefinitely, including after all keys are released. Enter,
digits 1–9 and clicks select and close it. Escape closes it without undoing the
last replacement. The base letter is always first: z (1), ż (2), ź (3),
including after reopening. Continued typing, cursor movement, focus, language
and composition changes dismiss the menu and cancel its timers. Normal
Shift+letter chords retain uppercase input.
