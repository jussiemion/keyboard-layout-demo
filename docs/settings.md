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

Open **Menu → Settings** to choose appearance, interface and keyboard languages,
assign S-keys, edit the symbol map, or transfer a configuration.

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
- **Cancel** or closing the dialog discards the draft. <kbd>Esc</kbd> first
  deselects the edited key; another press closes the dialog.
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

## Custom symbol map

Click a key on the keyboard in Settings, then edit its **`M1`** and **`M2`**
assignments. Use text (including emoji), a dead accent, or an empty field for no
action. Enable **Also type the M1 symbol while holding the Alt key** to type
that assignment while holding <kbd>Alt</kbd> and pressing the chosen key.
**Restore defaults** in the key editor restores only the selected key; the
button in the dialog footer resets the whole draft. **Save** applies changes.

**Custom text** is the default editing option. Open its picker to browse a
searchable symbol palette, or type your own text directly (up to 16 Unicode code
points). The palette includes Unicode symbols and emoji, category filters, and a
separate group of dead accents. Picking a symbol replaces that mode's
assignment; it does not append to the existing text.

Search accepts a symbol, Unicode code, name or keyword in any of the 14
interface languages, regardless of the current UI language. It shares the main
search's accent folding, aliases and spelling correction. Conversational
associations include approval, thanks, laughter and other everyday reactions in
all 14 languages, including emoji skin-tone variants. An exact character match
ranks first without hiding related names and prefixes (for example, `Я` also
finds `ѣ`). CLDR supplies translated names and keywords where available; rare
characters may have English Unicode names only. Combining marks have a
dotted-circle preview, and spaces have a visible placeholder; those preview
markers are never inserted into the assignment.

The picker opens immediately on **Popular** using a small bundled collection.
Searching or choosing another category loads the full catalog; searches then run
in a background worker. **All symbols** is the last category. No query or
configuration is sent to a search service. Arrow keys navigate the symbol grid,
Enter chooses a symbol, and Esc closes only the picker.

Changes affect physical typing, screen keys, symbol search and cheat-sheet
examples. National M0 letters and Shift cycles stay unchanged. The guided tour
always teaches the original map, independently of custom assignments. Your saved
map remains unchanged and is used outside the tour. A dedicated tour step
introduces the editor and configuration links without requiring changes. The
standalone typography reference continues to document the standard map.

## Transfer all settings

Choose **Copy configuration link** to export the current draft: symbol map,
S0–S4, interface language, keyboard language, theme and platform. The link
stores the data in its fragment, without an account or server. It is not
encrypted.

The **Configuration URL** field is generated automatically and is read-only.
Copy an incoming link to the clipboard and choose **Import from clipboard**, or
open the link in the demo. Clipboard access is requested only on click. Review
the draft, then **Save**. Invalid or unsupported links leave current settings
unchanged. **Cancel** discards imported changes. If clipboard access is
unavailable, open the incoming link in the demo to import it. If copying an
export fails, select and copy the generated URL from the field manually.

The format is designed for a future compatible desktop importer; the current OS
implementation does not import it yet. See the versioned
[configuration protocol](configuration-protocol.md).

For catalog updates, follow the regeneration steps in the
[symbol localization checklist](symbol-localization.md). The
[bundled font guide](fonts.md#symbol-palette) describes glyph coverage and
system-font limitations.
