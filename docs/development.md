# Development

[Overview](../README.md) · [Contributing](../CONTRIBUTING.md)

Use **Node.js 24** and **Bun 1.4.0**. Bun manages dependencies and package
scripts; Vinext/Vite builds the static site.

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:6699](http://127.0.0.1:6699).

## Commands

| <kbd>Command</kbd>      | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `bun run test`          | Node tests for engine and application logic                  |
| `bun run typecheck`     | TypeScript                                                   |
| `bun run lint`          | JS/TS, accessibility, CSS and formatting checks              |
| `bun run check:python`  | Python lint and format checks (requires uv)                  |
| `bun run format:python` | Format Python maintenance scripts with pinned Ruff           |
| `bun run lint:fix`      | Apply safe fixes and format files                            |
| `bun run check:fonts`   | Glyph coverage and shaping                                   |
| `bun audit`             | Known dependency vulnerabilities                             |
| `bun run build`         | Static export to `dist/client/`                              |
| `bun run preview`       | Serve the export on port 6699; stop dev first                |
| `bun run build:pages`   | Export for `/keyboard-layout-demo/` and validate asset paths |

`start` is an alias for `preview`. Builds do **not** publish. GitHub Pages
serves the `gh-pages` branch; its prefixed export is not suitable for the plain
local preview server. The Pages build includes the license and third-party
notices.

`bun install` installs the Husky pre-commit hook. It runs lint-staged with safe
JS/TS and CSS fixes, class-list wrapping and formatting. Unstaged hunks are
preserved; remaining errors block the commit. See
[contribution rules](../CONTRIBUTING.md).

## Dependencies

Direct versions are exact; `bun.lock` pins transitive versions and integrity
hashes. Commit both together. Use `bun add` / `bun remove` for intentional
changes; do not add another lockfile or regenerate dependencies during
deployment.

After an update, run audit, tests, type checking, lint and the Pages build.
Treat major-version migrations as compatibility work. A past clean audit is not
a guarantee about future advisories.

## Repository map

| Path                                                        | Responsibility                                            |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| `app/page.tsx`, `components/`                               | Demo, controls, dialogs and shared UI                     |
| `lib/typing-engine.ts`                                      | Ordinary and typographic input                            |
| `lib/layout.json`, `lib/diacritics.json`                    | Canonical snapshots                                       |
| `lib/national-layouts.json`                                 | National physical key maps                                |
| `lib/national-diacritics.json`, `lib/diacritic-profiles.ts` | Browser accent additions and profile merging              |
| `lib/keyboard-locales.ts`                                   | Interface languages and regional keyboard identifiers     |
| `lib/language-switching.ts`, `lib/settings.ts`              | **`S0`–`S4`** and saved mappings                          |
| `lib/native-layout-detection.ts`                            | Conservative detection from raw events                    |
| `lib/symbol-search-*.ts`                                    | Search, names, descriptions and associations              |
| `lib/messages.ts`, `lib/locales/*.ts`                       | Typed translation dictionaries                            |
| `app/styles/`, `components/layout-classes.ts`               | Ordered feature stylesheets and named Tailwind class sets |
| `tests/`, `tools/`                                          | Tests, builds, data and font tooling                      |
| `public/fonts/`                                             | Bundled fonts, manifest and licenses                      |

## Import canonical data

The demo builds without the separate canonical repository. To import an
intentional update:

```sh
bun run sync:layout -- /path/to/keyboard-layout/core/layout.json
bun run test
bun run check:fonts
```

The command validates the schema and
[Birman reference](https://ilyabirman.ru/typography-layout/), then copies the
symbol map and adjacent diacritic file. Review the diff. Browser-only accent
additions remain separate and survive synchronization.

[National-map export](national-layouts.md) and [font rebuilding](fonts.md) are
optional maintenance tasks, not normal build requirements.

## Verify behavior

Use real physical input with OS typography disabled when changing keyboard
behavior: synthetic events bypass OS remapping. Compare with screen keys and
record the OS/browser. For UI changes, check both themes, narrow/short screens,
RTL and keyboard navigation. The
[browser reference](browser-adapter.md#data-and-validation) includes the
stable-hint regression.

## Documentation media

| Files in `docs/assets/`           | Content                                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `demo-dark.png`, `demo-light.png` | 1280 × 820 screenshots, English, Linux, captured directly from the current production demo with the sample text      |
| `demo-dark.mp4`, `demo-light.mp4` | Continuous tab recordings, 1280 × 820, 30 fps, about 20 seconds, no audio                                            |
| `demo-dark.gif`, `demo-light.gif` | 960 × 615, 15 fps conversions of those recordings for inline README playback                                         |
| `logo-dark.svg`, `logo-light.svg` | One-shot 5 × 5 T → L → S → Y animation, ending in a solid Y on a transparent background; solid Y with reduced motion |

Refresh both themes after visible changes. Use the actual app styles, dismiss
the tour and keep the pointer off controls. Example text:
`“Good typography” — one keystroke closer. ©`.

For videos, record a live tab stream while sending key-down and key-up events.
Type punctuation through its real gestures; do not insert the final string or
assemble a slideshow. Leave time to see modifier states and the finished text.

The main README uses `<picture>` with theme-specific GIFs and links to the MP4
recordings for playback controls. Localized guides use the matching still images
and the same videos. Regenerate GIFs from the final recordings; do not record a
separate synthetic animation.

The logo geometry and animation live in `lib/brand.ts`. Generate README SVGs
with `brandSvg(activeColor, mutedColor)`; use `brandSymbolSvg(activeColor)` for
the static demo asset and favicon.

## README badges and statistics

The README uses public Shields.io badges for stars, recent activity,
contributors, forks and issues. They require no repository token or local
dependency. Values follow the published GitHub repository, not unpushed local
changes. Links and language inventories remain readable without the badges.

The README includes the configured public Repobeats activity card. Badge and
card URLs belong to this repository; update them if the project moves. No access
token is stored in the repository.

## Continuous integration

[CI](../.github/workflows/ci.yml) runs the same lint, Python, type, test and
build commands on pull requests, pushes to `main`/`master`, and manual dispatch.
CI disables local Git hooks because it runs the checks explicitly. It has
read-only repository permissions and no deployment steps or publishing
credentials.

The font checker remains an optional local check requiring fontTools, WOFF2 and
HarfBuzz. Run it when changing bundled fonts or keyboard symbols.
