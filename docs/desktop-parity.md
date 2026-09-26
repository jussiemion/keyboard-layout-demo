# Web demo and Linux compatibility

The web demo and the installed Omarchy plugin share typing gestures, but are not
interchangeable implementations. This audit compares the current web working
tree with Linux plugin **0.4.18**. A plugin installed for the next login is not
necessarily the version loaded in the current session.

| Area                | Shared behavior or difference                                                                                                                                                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typography          | The default `layout.json` symbol maps are identical; M0 quick chords and M1/M2 prefixes share the same intent.                                                                                                                                                               |
| Accent selection    | Base letter first, numbered from 1; left Shift advances and right Shift reverses, replacing text while keeping the menu open. Reopening continues from the current variant.                                                                                                  |
| Timing              | Base hold: 250 ms, apply item 2 once. If Shift was held before opening, start at item 1. Only standalone Shift taps shorter than 500 ms switch on release; holding Shift does not cycle. No idle dismissal.                                                                  |
| Confirmation        | Digits 1–9, Enter or clicking choose and close. Escape closes without reverting the last replacement.                                                                                                                                                                        |
| Fast typing         | Overlapping printable keys preserve the latest candidate. Shift before a new letter remains ordinary uppercase input.                                                                                                                                                        |
| Direct letters      | Both omit variants already available on an unmodified key, including uppercase counterparts. Actual menus depend on the selected national map.                                                                                                                               |
| Shared profiles     | English, Polish, Russian, French, German, Spanish, Portuguese, Italian and Romanian source profiles match. Russian and German default maps can filter out all their cycles.                                                                                                  |
| Additional profiles | Turkish, Vietnamese and Dutch cycles are implemented in the web demo only. Hebrew and Arabic use their national mark layers instead of postfix cycles.                                                                                                                       |
| National maps       | The demo uses bundled XKB-derived data and offers 24 choices. Linux uses the system XKB data and configured language slots; this is not a guarantee of identical regional maps or installed language sets.                                                                   |
| Language switching  | Caps Lock and S1–S4 switch assigned languages; the enabled-by-default independent S layer can remain active while typography is off. The two applications have separate settings.                                                                                            |
| Settings            | Symbol remapping and share/import URLs are available in the demo. The installed Hyprland plugin does not implement the desktop configuration-URL importer.                                                                                                                   |
| Help and search     | Ctrl+F/Caps Lock+F and Ctrl+H/Caps Lock+H are web controls. Their proposed desktop equivalents are not implemented in the plugin.                                                                                                                                            |
| Text replacement    | The demo controls its own field and selection. Linux replaces text in the focused application and therefore depends on its input behavior. Chrome inline completion has a dedicated verified accessibility path; this is not universal support for all autocomplete widgets. |
| Popup position      | The demo knows its caret position. Linux uses the application's cursor rectangle when available and otherwise centers the popup.                                                                                                                                             |

Both implementations preserve case and separately entered stress where the
profile supports it. They do not use IME preedit for these gestures.

The desktop plugin cannot prevent the OS, browser or another application from
intercepting a shortcut. Disable system typography when testing the demo; an
independently enabled system S layer can still intercept Caps Lock.

## Verification

The latest changes were tested with core/XKB scenarios, real keyboard events in
an isolated Hyprland session, a native GTK field, Chrome's omnibox and a web
input. Tests cover overlapping `e`, `s`, Shift releases, reverse selection,
uppercase chords, persistent menus, held Shift, digit selection, language slots,
stress and stalled helper processes. Browser-engine tests do not prove
compatibility with every desktop application.

See [typing-engine behavior](typing-engine.md),
[national profiles](national-layouts.md) and
[configuration protocol](configuration-protocol.md).
