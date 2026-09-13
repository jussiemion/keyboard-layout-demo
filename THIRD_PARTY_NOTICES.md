# Authorship and third-party materials

The project is created by **Semyon Yushkevich**.

The [MIT license](LICENSE) covers the author's original contributions. It does
not replace third-party copyrights, licenses or other applicable terms, or grant
rights to upstream materials.

## Typographic foundation

The shared symbol map is based on
[Ilya Birman’s Typography Layout 3.9](https://ilyabirman.ru/typography-layout/).
The original author is Ilya Birman.

The upstream distribution is free of charge. Its author's
[FAQ](https://ilyabirman.ru/typography-layout/faq/) discusses derivative layouts
and attribution; this is not an MIT license grant. No authorship of the original
symbol map or endorsement by its author is claimed.

## Additional materials

Third-party code, data, fonts and icons retain their respective terms. Preserve
source references and applicable license notices when including or distributing
these materials.

## Application dependencies

The application uses React, React DOM, Vinext, Vite and Tailwind CSS, with
TypeScript, Oxlint and Oxfmt for development. These packages retain their
upstream copyrights and licenses. Exact direct versions are recorded in
`package.json`; `bun.lock` pins the resolved dependency graph. Refer to the
packages’ distributed license notices for their respective terms.

## National keyboard data

[National key actions](lib/national-layouts.json) are derived from
xkeyboard-config 2.48 through libxkbcommon. The data retains its upstream terms.
The [engine guide](docs/typing-engine.md) describes how the bundled references
are used; the runtime does not change the operating system’s keyboard
configuration.

## UI, icons and fonts

The interface uses Base UI, shadcn/ui and Lucide, with their upstream copyrights
and licenses. Theme colors reference Monkeytype’s Vesper and Vesper Light
themes, as credited in [globals.css](app/globals.css).

Bundled fonts retain their upstream licenses.
[fonts.json](public/fonts/fonts.json) records sources, modifications and
checksums; license texts are included alongside the font files in
[public/fonts](public/fonts). The Apple glyph comes from Font Awesome and
remains subject to its bundled notice; no trademark rights or endorsement are
claimed.
