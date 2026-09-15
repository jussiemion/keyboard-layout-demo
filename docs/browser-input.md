# Browser input

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

Input controllers translate keyboard gestures into demo actions. They do not
change the operating system’s keyboard layout or Caps Lock state.

## Language gestures

- Tap and release <kbd>Caps Lock</kbd> (**S0**) to switch between the configured
  pair of languages.
- Hold <kbd>Caps Lock</kbd> and press <kbd>J</kbd>, <kbd>K</kbd>, <kbd>L</kbd>
  or <kbd>;</kbd> (**S1–S4**) to select a language slot immediately. Releasing
  Caps Lock afterward does not switch again.
- After selecting a language outside the pair, S0 returns to the last used
  member of the pair.
- Press both <kbd>Ctrl</kbd> keys together, then release both, to toggle
  typography. Separate taps, autorepeat and combinations with other keys do not
  trigger the toggle.

The default mapping uses English/Russian for S0 and Polish, Portuguese, Spanish
and German for S1–S4, independently of browser or interface language. Saved
mappings require two distinct S0 languages and four valid slots; direct slots
may repeat. Invalid or unsupported settings fall back to defaults.

## Browser boundaries

The input filter respects composition, shortcuts, dialogs and ordinary keyboard
activation of controls. A remapped event whose `key` is `CapsLock` is normalized
to Caps Lock; an ordinary F24 event is unchanged. Caret restoration keeps the
page stationary while revealing the end of the text field, including RTL input.

Native-layout detection observes trusted keyboard events and requires two
distinct matches between physical keys, typography modes and emitted symbols.
Pasted symbols, generated demo input and ordinary AltGr/Option chords are not
sufficient evidence. A subsequent ordinary Alt → C sequence can clear detection.
This detects characteristic input, not whether a layout is installed; it cannot
identify an OS-consumed key event that never reaches the browser.

## Source files

| File                                                            | Responsibility                                     |
| --------------------------------------------------------------- | -------------------------------------------------- |
| [language-switching.ts](../lib/language-switching.ts)           | S0–S4 gestures and remembered pair language        |
| [typography-toggle.ts](../lib/typography-toggle.ts)             | Two-Control toggle gesture                         |
| [settings.ts](../lib/settings.ts)                               | Validate, store and subscribe to language mappings |
| [window-typing.ts](../lib/window-typing.ts)                     | Normalize key identity and filter window input     |
| [native-layout-detection.ts](../lib/native-layout-detection.ts) | Recognize native typography output                 |
| [input-caret.ts](../lib/input-caret.ts)                         | Restore focus, selection and horizontal scrolling  |

Run `bun run test`, `bun run typecheck` and `bun run lint`. Controller tests use
event sequences and browser stubs; actual OS remapping still needs manual
browser verification.

## Search and cheat-sheet shortcuts

See the [agreed search and cheat-sheet shortcuts](planned-shortcuts.md): Ctrl +
F/H and Caps Lock + F/H in the web demo; only Caps Lock + F/H in the native
layout. The web shortcuts are implemented; the native shortcuts remain planned.
