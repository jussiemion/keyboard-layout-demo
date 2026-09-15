# National keyboard layouts in the demo

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. These
> are project support levels, not language-family classifications.

The interface and user documentation support **14 languages**. Keyboard
selection supports **24 identifiers**: 14 base options and 10 regional options.
`lib/keyboard-locales.ts` separates the UI language from the physical keyboard
reference.

| Keyboard option                                                             | Physical reference                            |
| --------------------------------------------------------------------------- | --------------------------------------------- |
| English; English (Australia, Nigeria, New Zealand, Singapore, US, Zimbabwe) | Shared US QWERTY reference                    |
| Russian                                                                     | Russian ЙЦУКЕН, implemented in the engine     |
| Polish                                                                      | Polish Programmer, implemented in the engine  |
| French (France)                                                             | XKB `fr(basic)`, traditional AZERTY           |
| German (Germany)                                                            | XKB `de(basic)`, QWERTZ                       |
| Spanish (Spain)                                                             | XKB `es(basic)`                               |
| Portuguese (Portugal)                                                       | XKB `pt(basic)`                               |
| Italian (Italy)                                                             | XKB `it(basic)`                               |
| Romanian (Romania)                                                          | XKB `ro(basic)`, Programmer                   |
| Hebrew (Israel)                                                             | XKB `il(basic)`                               |
| Arabic                                                                      | XKB `ara(basic)`                              |
| Turkish                                                                     | XKB `tr(basic)`, Turkish Q                    |
| Vietnamese                                                                  | XKB `vn(basic)`, direct letters and dead keys |
| Dutch                                                                       | XKB `nl(basic)`, Dutch                        |
| Spanish (Mexico)                                                            | XKB `latam(basic)`, Latin American            |
| Portuguese (Brazil)                                                         | XKB `br(abnt2)`                               |
| French (Canada)                                                             | XKB `ca(fr)`, Canadian French                 |
| German (Switzerland)                                                        | XKB `ch(basic)`, Swiss German                 |

English regional entries are explicit aliases, not claims that each country has
a unique physical standard. They remain distinct settings choices. Regional
keyboards share UI translations and documentation with the base language.
Canadian French is not the Canadian Multilingual Standard map, Dutch is not US
International, and Turkish Q is not Turkish F.

`lib/national-layouts.json` is exported from xkeyboard-config 2.48 using
libxkbcommon. The array for each physical code stores ordinary,
<kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Alt</kbd>+<kbd>Shift</kbd>, <kbd>Caps
Lock</kbd>, <kbd>Caps Lock</kbd>+<kbd>Shift</kbd>, <kbd>Caps
Lock</kbd>+<kbd>Alt</kbd>, <kbd>Caps Lock</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>
actions. Both <kbd>Alt</kbd> keys select the national input in the demo.
Unassigned national positions preserve shortcut pass-through. Quick typography
chords retain priority, and typography prefixes always use the unchanged
[shared Birman map](https://ilyabirman.ru/typography-layout/).

ISO reference maps include the extra key beside left <kbd>Shift</kbd>. Brazilian
ABNT2 also includes `IntlRo` beside right <kbd>Shift</kbd> for / and ?. Arabic
and Vietnamese use the ANSI view. Ordinary and shifted keycaps, <kbd>Caps
Lock</kbd>, national <kbd>Alt</kbd> output, and native dead accents are driven
by the same data. Dead accents compose before the next letter. Stress previews
support accented Latin vowels while preserving Russian consonants such as й.

These are reference layouts for browser simulation, not new OS adapters. The
platform selector changes modifier names and keyboard appearance; it does not
substitute Windows or macOS national maps. Physical ordinary typing uses the
selected demo map, so switching inside the demo also changes the inserted text
without changing the OS input source. All 14 UI languages are available
independently of the 24 keyboard choices. Explicit interface-language selection
also selects that language’s base keyboard; selecting a keyboard alone leaves
the UI unchanged. Every regional option can be assigned to **`S0`** or
**`S1`**–**`S4`**, including two distinct regional variants in the **`S0`**
pair.

To regenerate on a machine with the pinned xkeyboard-config and libxkbcommon:

```sh
python3 tools/export-national-layouts.py
bun run test
bun run check:fonts
```

The exporter only reads XKB data and writes the demo JSON. It never loads a
system keymap or changes OS input settings. The shipped JSON is sufficient to
run and build on other operating systems; XKB is not a browser or build
dependency. Review changes before updating the reference version.

Verification covers physical positions, modifier combinations, national dead
accents, shortcut pass-through, all typography assignments across the supported
locales, ISO geometry on all three platform views, and bundled-font shaping.
Native-platform compatibility and native-speaker review have not been claimed.

At opening, both language selectors use the first supported browser locale,
falling back to English. A saved interface preference overrides only the
interface language. Manual keyboard selection is independent and lasts for the
current page session.

Romanian uses the default XKB Programmer map, not the `std` or legacy Windows
variant. <kbd>Alt</kbd>+A/Q/I/S/T inserts ă/â/î/ș/ț; <kbd>Shift</kbd> selects
capitals. Ș/Ț use comma below (U+0218/U+021A), never the legacy cedilla forms.
Standalone <kbd>Shift</kbd> cycles `aăâ`, `iî`, `sș`, `tț`, preserving case and
independent acute stress. Romanian UI and keyboard detection accept ro-RO and
ro-MD. **`S0`** and **`S1`**–**`S4`** assignments are configurable in
[Settings](settings.md); Romanian can occupy any slot.

## Hebrew

Hebrew uses XKB `il(basic)`, the Israeli SI-1452/2013 reference. The right
<kbd>Alt</kbd>/<kbd>AltGr</kbd> selects national symbols and niqqud, taking
priority over overlapping quick typography chords; left <kbd>Alt</kbd> retains
all four quick chords. Both released <kbd>Alt</kbd> prefixes use the shared
**`M1`**/**`M2`** map. Niqqud follows the base letter. There is no Hebrew
<kbd>Shift</kbd>-postfix profile.

The UI accepts `he` and legacy `iw` browser tags. UI and typing-field direction
are separate, while keyboard geometry remains LTR. A bundled Noto Sans Hebrew
fallback provides shaping. See [fonts](fonts.md) and the
[browser adapter](browser-adapter.md).

## Postfix diacritic cycles

Type and release a letter, then tap and release either <kbd>Shift</kbd> to
advance through its profile. The canonical cycles come from
`lib/diacritics.json`; browser additions for Turkish, Vietnamese and Dutch live
in `lib/national-diacritics.json`. `lib/diacritic-profiles.ts` combines them
without modifying the imported native snapshot. Letter case and independently
entered stress are retained. Hebrew and Arabic have no profile. Regional
variants reuse their base-language profile. Each arrow denotes another separate
<kbd>Shift</kbd> tap.

<details>
<summary>Complete cycles: English, Polish, Russian, French, German, Spanish, Portuguese, Italian and Romanian</summary>

| Language | Cycle                                                                                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| en       | `a → á → à → â → ä → ã → å → a`, `c → ç → c`, `e → é → è → ê → ë → e`, `i → í → ì → î → ï → i`, `n → ñ → n`, `o → ó → ò → ô → ö → õ → o`, `u → ú → ù → û → ü → u`, `y → ý → ÿ → y` |
| pl       | `a → ą → a`, `c → ć → c`, `e → ę → e`, `l → ł → l`, `n → ń → n`, `o → ó → o`, `s → ś → s`, `z → ż → ź → z`                                                                         |
| ru       | `е → ё → е`, `и → й → и`                                                                                                                                                           |
| fr       | `a → à → â → ä → a`, `c → ç → c`, `e → é → è → ê → ë → e`, `i → î → ï → i`, `o → ô → ö → o`, `u → ù → û → ü → u`, `y → ÿ → y`                                                      |
| de       | `a → ä → a`, `o → ö → o`, `u → ü → u`, `s → ß → s`                                                                                                                                 |
| es       | `a → á → a`, `e → é → e`, `i → í → i`, `n → ñ → n`, `o → ó → o`, `u → ú → ü → u`                                                                                                   |
| pt       | `a → á → à → â → ã → a`, `c → ç → c`, `e → é → ê → e`, `i → í → i`, `o → ó → ô → õ → o`, `u → ú → u`                                                                               |
| it       | `a → à → a`, `e → è → é → e`, `i → ì → i`, `o → ò → ó → o`, `u → ù → u`                                                                                                            |
| ro       | `a → ă → â → a`, `i → î → i`, `s → ș → s`, `t → ț → t`                                                                                                                             |

</details>

## Arabic, Turkish, Vietnamese and Dutch

Arabic has independent RTL UI and text direction, while physical key geometry
stays LTR. <kbd>Shift</kbd> selects Arabic harakat; enter the letter first and
its mark second. Lam-alef outputs from XKB presentation forms are normalized
with NFKC to canonical letter sequences (`لا`, `لآ`, `لأ`, `لإ`) during export.
A bundled Arabic font retains shaping and mark positioning. **`M2`** acute
stress is not Arabic vocalization.

Turkish Q preserves `i/İ` and `ı/I` through <kbd>Shift</kbd>, Caps state and
locale-aware postfix capitalization. Dutch retains national dead accents.
Vietnamese provides direct XKB letters and dead accents plus the complete
letter/tone cycles below; it is not a Telex/VNI IME and does not place tones by
syllable.

<details>
<summary>Complete cycles: Turkish, Vietnamese and Dutch</summary>

| Language | <kbd>Shift</kbd> cycles                                                                                                                                                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tr       | `c → ç → c`, `g → ğ → g`, `i → ı → i`, `o → ö → o`, `s → ş → s`, `u → ü → u`                                                                                                                                                                                                                                                              |
| vi       | `a → ă → â → á → à → ả → ã → ạ → ắ → ằ → ẳ → ẵ → ặ → ấ → ầ → ẩ → ẫ → ậ → a`, `e → ê → é → è → ẻ → ẽ → ẹ → ế → ề → ể → ễ → ệ → e`, `i → í → ì → ỉ → ĩ → ị → i`, `o → ô → ơ → ó → ò → ỏ → õ → ọ → ố → ồ → ổ → ỗ → ộ → ớ → ờ → ở → ỡ → ợ → o`, `u → ư → ú → ù → ủ → ũ → ụ → ứ → ừ → ử → ữ → ự → u`, `y → ý → ỳ → ỷ → ỹ → ỵ → y`, `d → đ → d` |
| nl       | `a → ä → á → à → â → a`, `e → ë → é → è → ê → e`, `i → ï → í → ì → î → i`, `o → ö → ó → ò → ô → o`, `u → ü → ú → ù → û → u`                                                                                                                                                                                                               |

</details>
