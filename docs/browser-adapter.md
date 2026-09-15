# Browser adapter

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

[Project overview](../README.md) · [Development](development.md) ·
[National maps](national-layouts.md)

The browser demo uses checked-in snapshots of the canonical layout and diacritic
data. Its adapter simulates typing in one field; it does not install an OS
layout or change the host input source. The decisions below describe the web
demo, not the behavior of a native adapter.

## Input and editing

Physical printable positions resolve through the selected demo map. The
on-screen keyboard uses the same typing engine. Input is captured within the
page, except other editable fields, open dialogs, menus and keyboard-operated
controls. Outside the typing field, printable input and <kbd>Alt</kbd> gestures
are redirected to it; <kbd>Space</kbd>/<kbd>Enter</kbd> still activate focused
controls. Clipboard shortcuts, IME composition and unrelated
<kbd>Ctrl</kbd>/<kbd>Meta</kbd> shortcuts stay native.

The field is single-line and horizontally scrollable. Native paste strips line
breaks. Virtual <kbd>Backspace</kbd> removes a whole grapheme, <kbd>Tab</kbd>
inserts a tab, and <kbd>Enter</kbd> clears pending state without inserting a
newline. Physical editing retains browser behavior. macOS screen arrows move by
grapheme; <kbd>Shift</kbd> extends selection, and Up/Down move to the start/end.
Insertion reveals the end only when the caret is at the end; editing earlier
text does not force an end scroll.

<kbd>Super</kbd>/Win/<kbd>Command</kbd>, Menu and <kbd>Fn</kbd> are disabled on
screen. Their contextual warnings explain that they have standard system
behavior and no typographic role. <kbd>Tab</kbd>, <kbd>Backspace</kbd>,
<kbd>Enter</kbd> and Backslash remain enabled. No on-screen control issues an OS
shortcut or accesses the clipboard.

<kbd>Escape</kbd>, focus loss, composition, and other interruptions clear
pending gestures. Repeated ordinary keydown events do not consume a prefix a
second time. A standalone <kbd>Alt</kbd> is suppressed inside the typing field
to avoid browser menu activation. The page cannot recover events intercepted
before DOM dispatch.

## Language and platform

The demo supports 14 interface languages and 24 keyboard options, including
regional maps. At load, the keyboard uses the first supported browser language,
falling back to English; the saved interface preference is restored separately.
An explicit interface-language selection in the menu also selects that keyboard
language in the current demo. Keyboard selection alone does not change the
interface. Neither operation rewrites existing text.

The keyboard language controls keycaps, physical and virtual ordinary input,
national <kbd>Alt</kbd> output, text direction and postfix diacritics. Manual
keyboard selection lasts for the page session. Saved UI language, theme,
platform and settings synchronize across tabs where supported. Initial
preferences apply before revealing the interface.

Linux, Windows and macOS select keyboard geometry and modifier names.
<kbd>Option</kbd> means <kbd>Alt</kbd>; <kbd>Command</kbd> means
<kbd>Meta</kbd>. They do not substitute different national maps. ISO reference
layouts are listed in [national-layouts.md](national-layouts.md). The browser
cannot reliably identify the current OS layout.

## Modes and accents

**`M0`** is Basic, **`M1`** is Symbols and **`M2`** is Extended. One released
<kbd>Alt</kbd> tap enters **`M1`**; two enter **`M2`**. There is no timing
threshold. The mode controls immediately select a one-shot prefix. Both
<kbd>Alt</kbd>/<kbd>Option</kbd> keycaps and the toolbar reflect the engine
state. Holding <kbd>Alt</kbd> gives the four quick **`M0`** outputs; Hebrew
right <kbd>Alt</kbd> has national-input priority.

Dead keys compose the next letter using Unicode NFC, preserving combining
sequences when needed. A second dead key replaces the pending accent.
<kbd>Space</kbd> inserts its spacing form; a non-letter cancels the accent and
is retained. Native `Dead` and IME events reset demo state and continue through
native composition. Acute stress previews eligible letters; its warning replaces
ordinary hints while armed.

Postfix diacritics work after a released letter: tap and release either
<kbd>Shift</kbd> to cycle its language-specific variants. The on-screen
<kbd>Shift</kbd> also preserves this candidate. <kbd>Shift</kbd> held with a
letter retains normal capitalization. Case and independent stress survive
cycling, including `á → ą́ → á` and `е́ → ё́ → е́`. A national acute and independent
stress are distinct. Pointer/wheel actions outside the special <kbd>Shift</kbd>
path, navigation, other keys, paste/cut/drop, composition and
language/mode/focus changes cancel the candidate. Replacement validates both
text and collapsed caret.
[Full cycles](national-layouts.md#postfix-diacritic-cycles).

## <kbd>Caps Lock</kbd> and language mapping

**`S0`** is a <kbd>Caps Lock</kbd> tap between two configured languages.
<kbd>Caps Lock</kbd> + J/K/L/Semicolon selects
**`S1`**/**`S2`**/**`S3`**/**`S4`**. While Caps is held, slots can be selected
repeatedly; unrelated keys do not type, and the final Caps release never
switches again after a chord. A tap from outside the **`S0`** pair returns to
its remembered language. Resets keep that pair memory.

[Settings](settings.md) expose both **`S0`** languages and all four direct
slots. The pair must contain two different languages; direct slots may repeat.
Defaults use EN/RU for S0 and PL/PT/ES/DE for S1–S4, independently of browser
and interface language. Saved custom assignments remain in effect.

The browser accepts semantic `key: CapsLock` even when a remapper supplies
`code: F24`. A genuine <kbd>F24</kbd> is not treated as <kbd>Caps Lock</kbd>.
Once Caps is used for switching, the demo preserves its logical letter case
rather than inferring a transition from the OS modifier flag. A webpage cannot
turn off the system Caps LED. If no Caps event arrives at all, normalization
cannot help; use the screen control or language selector.

Both <kbd>Ctrl</kbd> keys, held together then released, toggle demo typography.
Caps language switching remains active while demo typography is off. This is a
browser-specific behavior; do not infer native adapter requirements from it. See
[typography-toggle.md](typography-toggle.md).

## System-layout detection

`lib/native-layout-detection.ts` observes trusted raw keyboard events. It does
not enumerate installed layouts, inspect the OS configuration, use synthetic
on-screen output as evidence, or treat a missing Caps event as proof.

Detection requires **two distinct physical-position/mode matches** where a
recognized <kbd>Alt</kbd> gesture has already become its expected non-ASCII
punctuation or symbol in the incoming event, with <kbd>Alt</kbd> cleared.
Letters, numbers, marks, whitespace, dead keys, composition, repeats and
ordinary <kbd>AltGr</kbd>/<kbd>Option</kbd> chords are excluded. Repeating one
match is insufficient. This is evidence of active matching remapping, not a
universal detector of installed software.

An alert asks the user to disable the system typography layer. While the alert
is visible, a trusted two-<kbd>Ctrl</kbd> gesture dismisses it and is left to
the native adapter without also toggling demo typography. This is an optimistic
dismissal, not confirmation from the OS. The recheck action asks for
<kbd>Alt</kbd> followed by C; an ordinary C-position result clears a detected
state. Subsequent matching input can detect the layer again.

<kbd>Caps Lock</kbd> consumed by the OS produces no reliable browser signal. A
warning cannot appear merely because an unobservable key was pressed. The native
adapter is not modified to emit artificial web-detection markers. Absence of an
alert does not establish that the OS layer is inactive.

Disable system typography before evaluating physical input. Some OS/browser
shortcuts remain reserved even then. Windows <kbd>AltGr</kbd> may expose
synthetic <kbd>Ctrl</kbd>+<kbd>Alt</kbd>; explicitly observed <kbd>Ctrl</kbd> is
passed through. Full cross-platform physical compatibility is not claimed.
Virtual controls remain available.

## Layout, hints and accessibility behavior

The header contains search, the cheat sheet and a menu for language, appearance,
settings, tour and source. Toolbar groups are 36px high at every width; mode
names disappear on narrow screens while their identifiers remain. Controls use
shared mode and **`S0`**–**`S4`** styling in the toolbar, keycaps, hints and
tour. Native `title` tooltips are not used.

Ordinary key hints include the key name and applicable mode outputs, with
localized symbol names. Empty assignments are omitted. **`S1`**–**`S4`** put
their specific language chord first. Hover takes priority over focus; pointer
leave restores focused-key hints. Disabled-key warnings and typography/accent
warnings remain available with ordinary hints turned off. The tour provides its
own guidance.

The hint region retains its largest measured height at the current width so
changing text cannot shrink the scroll range and move keys under the pointer.
The reservation resets on width, UI-language or hint-preference changes. Text is
not clipped and has no nested scrollbar. The document uses an overlay
ScrollArea; the keyboard scales from its 960px reference width. The typing field
uses `inputmode="none"` for the screen keyboard; search fields retain normal
mobile input.

Dialogs restore focus and support <kbd>Escape</kbd>. Search navigation and tour
<kbd>Enter</kbd> handling are described in [symbol-search.md](symbol-search.md)
and [guided-tour.md](guided-tour.md). UI direction follows the interface
language; the field follows its keyboard language. Physical geometry stays LTR,
and inline sequences use bidi isolation. Arabic and Hebrew text use a negative
scroll offset to reveal trailing content.

## Data and validation

Practice text and search queries stay in memory; the application does not
transmit them. Preferences and tour decisions use browser storage. Fonts are
local, including Arabic and Hebrew shaping and the Apple private-use glyph. ⍽ is
a visual label for NBSP, not the inserted character; ◌ is an accent guide.
[Font sources and validation](fonts.md).

Engine tests cover symbol maps, language profiles, modifiers, cancellation,
accents, language switching and editing. Other tests cover settings, search, the
tour, localization and detection. Type checks and a static build are separate
checks; unit tests do not prove native keyboard compatibility.

For the hint regression, use a short viewport, hover <kbd>Caps Lock</kbd>,
scroll to the bottom, then move between ordinary keys,
<kbd>Alt</kbd>/<kbd>Shift</kbd>, disabled <kbd>Meta</kbd>/Menu keys and empty
space. The keyboard and scroll offset must remain stable. Repeat at narrow
widths and with hints disabled. Real-device mobile and OS input checks require
actual hardware events.
