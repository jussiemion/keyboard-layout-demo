# Interactive demo

**`S` — Switcher**: language switcher (`S0`–`S4`). **`M` — Modifier**:
typing-mode modifier (`M0`–`M2`).

> [!NOTE]
>
> The layout primarily targets European languages. Support for other languages,
> including Arabic, Hebrew, Turkish and Vietnamese, is experimental: character
> coverage and typing conventions may be incomplete. This status concerns
> keyboard input and typography, independently of interface translation. See
> [language support](national-layouts.md).

[app/page.tsx](../app/page.tsx) connects the typing engine and input controllers
to the text field and on-screen keyboard. [app/layout.tsx](../app/layout.tsx)
applies initial preferences and loads bundled fonts;
[globals.css](../app/globals.css) preserves the import order of the
[foundation and feature stylesheets](../app/styles). Simple layouts use named
Tailwind constants from [layout-classes.ts](../components/layout-classes.ts);
components import only the constants they use.

## Components

| Component                                                | Responsibility                             |
| -------------------------------------------------------- | ------------------------------------------ |
| [header-menu.tsx](../components/header-menu.tsx)         | Header actions and menu                    |
| [symbol-search.tsx](../components/symbol-search.tsx)     | Search and insert symbols                  |
| [help-content.tsx](../components/help-content.tsx)       | Keyboard cheat sheet                       |
| [settings-dialog.tsx](../components/settings-dialog.tsx) | S0 pair and S1–S4 slots                    |
| [guided-tour.tsx](../components/guided-tour.tsx)         | Step controls and optional final challenge |
| [brand-mark.tsx](../components/brand-mark.tsx)           | Static Y mark and favicon                  |

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

## Search and cheat-sheet shortcuts

See the [agreed search and cheat-sheet shortcuts](planned-shortcuts.md): Ctrl +
F/H and Caps Lock + F/H in the web demo; only Caps Lock + F/H in the native
layout. The web shortcuts are implemented; the native shortcuts remain planned.

The trainer has a minimum height of `100dvh`; shared SEO content follows below
it. Available vertical space is distributed above and below the working block in
a 1:2 ratio. Long tour panels and state notifications increase the page height
instead of shrinking the keyboard. Keyboard scaling depends on available width
only. Hover hints have been removed; accessible key labels and state
notifications remain.

The menu groups language, appearance and settings under **Preferences**; the
tour and typography reference under **Learning & reference**; and the source
link under **Project**. Category labels follow the interface language.
