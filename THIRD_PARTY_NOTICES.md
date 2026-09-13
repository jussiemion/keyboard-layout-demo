# Authorship and third-party materials

The Semyon Yushkevich Typographic Keyboard Layout (Типографская раскладка Семёна Юшкевича)
is a project by **Semyon Yushkevich (jussiemion)**:
https://github.com/jussiemion/keyboard-layout-demo.

The project's original contributions in this repository are available under
[the MIT License](LICENSE). This notice identifies the project and its author;
it does not require modified versions to retain the original product name or
claim that their changes were made or endorsed by the original author.

The MIT grant covers the author's own contributions. It does not replace
third-party copyrights, licenses or other applicable terms, and does not claim
authority to relicense upstream materials.

## Ilya Birman's Typography Layout

The shared typography symbol map is based on **Ilya Birman's Typography Layout,
version 3.9**. The original author is **Ilya Birman**.

- Project: https://ilyabirman.ru/typography-layout/
- Reference archive: https://ilyabirman.ru/typography-layout/download/ilya-birman-typolayout-3.9-mac.zip
- Reference metadata and symbol assignments: `lib/layout.json`.

Semyon Yushkevich's additions include sequential mode entry, language-switching
controls, language-specific diacritic cycling and the interactive browser demo.
These additions do not imply authorship of Birman's original symbol map or
endorsement by Ilya Birman.

The upstream distribution is free of charge. In his
[FAQ](https://ilyabirman.ru/typography-layout/faq/), Ilya Birman explains his
position on creating a layout based on his work: a new layout may have its own
name, but his work must not be passed off as someone else's and its source
should be acknowledged. This statement is not an MIT license grant; this
project's MIT notice does not relicense his original materials.

## National keyboard data and Unicode references

`lib/national-layouts.json` is exported from xkeyboard-config. Its source and
reference variants are documented in `docs/national-layouts.md`; the exporter
is `tools/export-national-layouts.py`. Upstream terms remain applicable.

Symbol descriptions use references from Unicode and CLDR. The reference links
and scope are documented in `docs/symbol-search.md`. These references are not a
claim of endorsement by Unicode or the Unicode Consortium.

## Fonts and icons

Bundled fonts retain their upstream licenses. Notices are shipped in `fonts/`
in the static site and in `public/fonts/` in the source repository.
`public/fonts/fonts.json` identifies the sources, modifications and license
files; `docs/fonts.md` explains the font build.

The Apple glyph represents Apple and remains subject to the upstream Font
Awesome notice. No trademark rights or endorsement are claimed.

## UI components and dependencies

The UI uses third-party components and packages, including React, Base UI,
shadcn/ui and Lucide. These retain their respective upstream copyrights and
licenses. Dependency versions are recorded in `package.json` and `bun.lock`;
package license notices are included in their upstream distributions.

The theme palettes reference Monkeytype's Vesper and Vesper Light themes, as
credited in `app/globals.css`.

### Noto Sans Arabic

The bundled `public/fonts/layout-arabic.woff2` is derived from [Noto Sans Arabic](https://github.com/google/fonts/tree/main/ofl/notosansarabic), renamed to Layout Arabic with full shaping retained. Copyright and SIL Open Font License text: [NotoSansArabic-OFL.txt](public/fonts/NotoSansArabic-OFL.txt). Source and output checksums are recorded in [fonts.json](public/fonts/fonts.json).
