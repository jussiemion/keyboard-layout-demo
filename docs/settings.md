# Settings

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

[Overview](../README.md) · [National maps](national-layouts.md)

Open **Menu → Settings** to assign keyboard languages.

|   Slot   | Gesture                             | Assignment                                                           |
| :------: | ----------------------------------- | -------------------------------------------------------------------- |
| **`S0`** | Tap <kbd>Caps Lock</kbd>            | Two different keyboard options; the swap button reverses their order |
| **`S1`** | <kbd>Caps Lock</kbd> + <kbd>J</kbd> | Direct language 1                                                    |
| **`S2`** | <kbd>Caps Lock</kbd> + <kbd>K</kbd> | Direct language 2                                                    |
| **`S3`** | <kbd>Caps Lock</kbd> + <kbd>L</kbd> | Direct language 3                                                    |
| **`S4`** | <kbd>Caps Lock</kbd> + <kbd>;</kbd> | Direct language 4                                                    |

All **24 keyboard options** are available. Direct slots may repeat one another
or an **`S0`** option. Regional choices retain their physical map and share
their base language’s accent cycle.

- **Save** applies changes to physical input, screen keys and the cheat sheet.
- **Cancel**, <kbd>Esc</kbd> or closing the dialog discards the draft.
- **Restore defaults** resets the draft; **Save** is still required.

## Defaults

The main pair is English/Russian. S1–S4 use Polish, Portuguese, Spanish and
German, respectively. Defaults do not depend on browser or interface language;
saved custom assignments remain in effect.

## Persistence

`lib/settings.ts` validates versioned data in `keyboard-layout-demo.settings`.
Invalid mappings fall back to native defaults. Regional identifiers such as
`pt-BR` remain compatible with version 1.

Changes synchronize across tabs and reset pending gestures. If storage is
blocked, settings apply to the current tab with a notice that they will not
survive reload. [Tests](../tests/settings.test.ts) cover validation, storage
failures, synchronization and custom gestures.
