# Bundled fonts

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

The typing area, keyboard, interface, tooltips, and dialogs share one local font
stack. No `local()` source or external font service is used.

| Family              | Upstream font                 | Purpose                                                                                                       |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Layout Mono         | Noto Sans Mono                | Main monospaced text, English, Polish, Russian, historical Cyrillic, fractions, and all ten combining accents |
| Layout Symbols      | Noto Sans Symbols / Symbols 2 | ⌀ ⌃ ⇧ ⌘ ⌥ ⍽ ✓                                                                                                 |
| Layout Hebrew       | Noto Sans Hebrew              | Hebrew letters, niqqud and RTL shaping                                                                        |
| Layout Runic        | Noto Sans Runic               | Supplemental glyph coverage for ᛉ (U+16C9)                                                                    |
| Layout Apple Symbol | Font Awesome Brands           | Apple character  (U+F8FF)                                                                                    |

The main font keeps all upstream characters and the variable weight axis
(100–900). Its width axis is fixed at normal width to reduce the download. Small
symbol subsets use Unicode ranges so they only participate for the listed
characters. All modified fonts have new family names. Every WOFF2 is preloaded
and uses `font-display: swap`.

Letters and combining marks are provided together by the main font, including
double acute U+030B. OpenType accent composition and mark positioning remain
enabled. Discretionary/contextual ligatures and automatic fractions are disabled
in the typing area and key legends to preserve literal sequences. The map’s
`¹⁄₂`, `¹⁄₃`, and `¹⁄₄` remain their exact three code points.

U+F8FF is a private-use character. A single licensed Font Awesome Apple glyph is
remapped from U+F179 to U+F8FF inside the fallback font; neither the layout map
nor the typed text is changed. Copying this character into another application
requires that application to have its own suitable font.

## Sources and licenses

Noto sources come from [Google Fonts](https://github.com/google/fonts); the
Apple glyph comes from
[Font Awesome Brands](https://github.com/FortAwesome/Font-Awesome/tree/7.x/webfonts).
Font files are licensed under SIL OFL 1.1. Complete upstream notices are
included alongside them in `public/fonts/`. These font licenses are separate
from the MIT license for the demo’s original contributions and do not grant
trademark rights.

[`public/fonts/fonts.json`](../public/fonts/fonts.json) records exact source
URLs, SHA-256 checksums, modifications, output sizes, and per-file license
names. The main font is delivered as `layout-mono.woff2`; the remaining manifest
entries provide supplemental symbols and Arabic/Hebrew shaping.

## Verification and rebuilding

Normal site builds use the checked-in WOFF2 files and require no font tooling.
To verify them separately:

```sh
bun run check:fonts
```

This requires Python 3, fontTools, `woff2_decompress`, and the native HarfBuzz
library. The checker reads the canonical snapshot in `lib/layout.json` and the
actual shipped WOFF2 files. It validates checksums, CSS font declarations,
nonempty glyph outlines, and HarfBuzz shaping for all mapped outputs and ten
accents on every English, Polish, and Russian alphabet letter, in NFC and
combining forms. UI symbols and spacing accents are included. This is a
programmatic font check; it does not claim testing on every browser/OS.

To rebuild, place the source files from the manifest and the matching license
notices in a separate directory. Preserve their listed names and check their
SHA-256 values before rebuilding. `build-fonts.py` also requires
`woff2_compress`; it reads those explicit local inputs without downloading
updates:

```sh
python3 tools/build-fonts.py /path/to/font-sources
bun run check:fonts
```

The Hebrew fallback is rebuilt separately after the base fonts:

```sh
python3 tools/build-hebrew-font.py /path/to/NotoSansHebrew.ttf /path/to/OFL.txt
```

Use the exact source file and license recorded in the font manifest. The command
rewrites the bundled Hebrew font and its manifest entry; run
`bun run check:fonts` afterwards and review the resulting changes.

## Arabic fallback

`layout-arabic.woff2` is a renamed Noto Sans Arabic variable font, bundled with
its SIL Open Font License. It retains the full shaping tables and weight/width
axes. `fonts.json` records the upstream URL and source/output SHA-256 checksums.
Rebuild explicitly with:

```sh
python3 tools/build-arabic-font.py /path/to/NotoSansArabic.ttf /path/to/OFL.txt
bun run check:fonts
```

The Arabic fallback follows Layout Mono in the stack and handles Arabic blocks.
Arabic UI text disables letter spacing so joining is preserved. Font checks
include Arabic marks and lam-alef, Turkish dotted/dotless i, and Vietnamese tone
combinations. No remote font requests are made by the application.
