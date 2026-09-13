# Settings

> [!NOTE] The layout primarily targets European languages. Support for other
> languages, including Arabic, Hebrew, Turkish and Vietnamese, is experimental:
> character coverage and typing conventions may be incomplete. This status
> concerns keyboard input and typography, independently of interface
> translation. See [language support](national-layouts.md).

[Overview](../README.md) · [National maps](national-layouts.md)

Open **Menu → Settings** to assign languages and show or hide typing hints.

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

- **Save** applies changes to physical input, screen keys, hints and the cheat
  sheet.
- **Cancel**, <kbd>Esc</kbd> or closing the dialog discards the draft.
- **Restore defaults** resets the draft and enables hints; **Save** is still
  required.
- Hiding hints leaves typography and accent warnings visible.

## Defaults

The main pair is English and the native browser language, with English/Russian
as fallback. The four direct slots take the first candidates outside that pair
from `PL → PT → ES → DE → FR → IT → RO → RU → EN`. For English/Russian, they are
Polish, Portuguese, Spanish and German.

## Persistence

`lib/settings.ts` validates versioned data in `keyboard-layout-demo.settings`.
Invalid mappings fall back to native defaults. Regional identifiers such as
`pt-BR` remain compatible with version 1.

Changes synchronize across tabs and reset pending gestures. If storage is
blocked, settings apply to the current tab with a notice that they will not
survive reload. [Tests](../tests/settings.test.ts) cover validation, storage
failures, synchronization and custom gestures.
