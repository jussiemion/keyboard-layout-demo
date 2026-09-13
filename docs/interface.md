# Interactive demo

[app/page.tsx](../app/page.tsx) connects the typing engine and input controllers
to the text field and on-screen keyboard. [app/layout.tsx](../app/layout.tsx)
applies initial preferences and loads bundled fonts;
[globals.css](../app/globals.css) defines themes, responsive layouts and RTL
styling.

## Components

| Component                                                  | Responsibility                                            |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| [header-menu.tsx](../components/header-menu.tsx)           | Header actions and menu                                   |
| [symbol-search.tsx](../components/symbol-search.tsx)       | Search and insert symbols                                 |
| [help-content.tsx](../components/help-content.tsx)         | Keyboard cheat sheet                                      |
| [settings-dialog.tsx](../components/settings-dialog.tsx)   | S0 pair, S1–S4 slots and hints                            |
| [guided-tour.tsx](../components/guided-tour.tsx)           | Step controls and optional final challenge                |
| [stable-hint-area.tsx](../components/stable-hint-area.tsx) | Reserve hint space so hovering does not move the keyboard |
| [brand-mark.tsx](../components/brand-mark.tsx)             | Static Y mark and favicon                                 |

Changing the interface language also selects its keyboard language. Keyboard
language changes leave the interface language unchanged. The tour remembers
declined and completed choices; completed steps stay available through Next and
Enter. The final challenge is optional.

Only UI primitives used by the demo are included in `components/ui`. Direct
dependency versions and the resolved dependency graph are pinned in
`package.json` and `bun.lock`.

## Validation

Run `bun run test`, `bun run typecheck`, `bun run lint` and `bun run build`. Use
`bun run preview` to inspect the static output. `bun run build:pages` also
checks the export with its GitHub Pages path prefix.

Browser review should cover physical and on-screen typing, menu and dialog
focus, search insertion, language settings, tour progression, light/dark themes,
mobile widths and RTL. Controller tests cannot reproduce operating-system
remapping or every browser’s native keyboard behavior.
