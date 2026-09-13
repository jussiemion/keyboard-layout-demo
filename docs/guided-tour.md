# Guided tour

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

[Overview](../README.md) · [Settings](settings.md)

Start **Menu → Guided tour**. A first-visit invitation appears after four
seconds without taking focus. Declining remembers the choice and points back to
the menu.

## Route

| Stage                                                           | What the user learns                                                                    |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Birman introduction](https://ilyabirman.ru/typography-layout/) | **`M1`**, **`M2`** and composing an accent; skipped if already familiar                 |
| Typing gestures                                                 | Quick chords, mode controls, stress and postfix <kbd>Shift</kbd>                        |
| Languages                                                       | Hebrew <kbd>AltGr</kbd>, **`S0`** and all four configured direct slots                  |
| Demo controls                                                   | Typography on/off, search, settings and the cheat sheet                                 |
| Optional challenge                                              | Type every distinct [Birman symbol](https://ilyabirman.ru/typography-layout/); no timer |

Exercises use the real typing engine and highlight the relevant controls.
Physical and screen input both work; narrow screens offer large task-specific
keys. Normal hover hints are hidden during training.

## Navigation

- A completed step stays complete, even after edits or revisiting it.
- <kbd>Enter</kbd> activates an enabled **Next** button. Held <kbd>Enter</kbd>
  does not skip multiple steps; dialogs and menus suspend this shortcut.
- Exercises can be skipped, retried or revisited.
- The close button exits at any stage, including the optional challenge. It
  restores the original text, caret, keyboard language, letter case and
  typography state. Saved language mappings remain unchanged.

## Implementation

`keyboard-layout-demo.tour.v1` stores `declined`, `started` or `completed`.
Unknown values keep the invitation available. With blocked storage, the choice
lasts for the session; declining explains this limitation.

The challenge derives distinct outputs from `lib/layout.json`, including
standalone accents and NBSP. Comparison uses NFC normalization, marks the first
mismatch and displays NBSP as `⍽`. Language exercises start outside the target
language, including duplicate slot assignments.

[Tests](../tests/tour.test.ts) cover branching, completion, mappings,
restoration-related state, character coverage, normalization, translations and
persistence failures. Browser checks cover physical/virtual input, dialogs,
cancellation, mobile and RTL.
