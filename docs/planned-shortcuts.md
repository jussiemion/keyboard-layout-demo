# Search and cheat-sheet shortcuts

Status: implemented in the web demo; agreed design for the native layout.

## Assignments

| Action               | Web demo                                                              | Native layout (Linux, Windows, macOS) |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| Search symbols       | <kbd>Ctrl</kbd> + <kbd>F</kbd> or <kbd>Caps Lock</kbd> + <kbd>F</kbd> | <kbd>Caps Lock</kbd> + <kbd>F</kbd>   |
| Open the cheat sheet | <kbd>Ctrl</kbd> + <kbd>H</kbd> or <kbd>Caps Lock</kbd> + <kbd>H</kbd> | <kbd>Caps Lock</kbd> + <kbd>H</kbd>   |

Hold Caps Lock and press F or H; these are chords, not consecutive taps. F
stands for Find and H for Help. Both aliases in the web demo open the same
existing search or cheat-sheet dialog.

Ctrl + H replaces Ctrl + K for the web cheat sheet. The native utility shortcuts
remain planned and are not implemented by this web repository.

## Gesture behavior

- Caps Lock + F/H is active only while the typographic layout is enabled. With
  the native layout disabled, Caps Lock retains its standard behavior.
- Consuming either chord must suppress the standalone Caps Lock language switch
  when Caps Lock is released. F/H must not also enter text.
- Keep the S0 language pair and S1–S4 assignments unchanged. In particular, Caps
  Lock + K remains S2, not a help shortcut.
- Trigger the action once per press, not repeatedly through key autorepeat.
- Keep existing focus and keyboard-navigation behavior of search and help.
  Closing a dialog must not leave Caps Lock logically held or cause a delayed
  language switch.

## Platform boundaries

The web demo handles Ctrl + F/H only inside its own page. Ctrl + H can overlap
with browser history: browser behavior and shortcut delivery must be checked on
each supported platform before shipping. Do not register either Ctrl chord as a
global operating-system shortcut.

The native layout exposes only Caps Lock + F/H. Its companion utility opens
search or the cheat sheet; the tray or macOS menu-bar entries remain available
when the layout is disabled or a shortcut cannot be delivered.

Use physical F/H key positions consistently with the existing S1–S4 gestures, so
switching the selected language does not change the shortcut positions. A
browser cannot handle a Caps Lock event already consumed by the native layout:
in that situation, the native utility owns the chord.

## Implementation checks

Verify both actions, their web aliases, unchanged S0/S1–S4 behavior, disabled
layout behavior, held-key cleanup after opening and closing a dialog, and single
activation under autorepeat. Test real keyboard delivery on Linux (Omarchy),
Windows and macOS, with the native layout both enabled and disabled.
