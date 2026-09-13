# Contributing

Feedback about typing behavior, gestures and language conventions is welcome.

## Reports and proposals

Explain what you expected and what happened. For keyboard input problems,
include the key sequence, operating system, browser, keyboard map and any active
OS remapper. Remove private text from screenshots and recordings.

For translations or symbol descriptions, identify the language, quote the text
and suggest a correction. Include a reference when a convention is specific to a
language or region.

## Changes and review

- Keep each change focused on one problem or feature.
- Use descriptive commit subjects, such as `feat(input): add language switching`
  or `fix(search): handle misspelled symbol names`.
- Explain the resulting behavior and list the checks actually performed.
- Add regression coverage for changed behavior; inspect visual changes in both
  themes and on narrow screens.
- Pin dependency versions and keep the lockfile consistent with the manifest.
- Keep generated build output, caches and local credentials out of version
  control.

## Attribution

Preserve the [MIT notice](LICENSE) and applicable
[third-party notices](THIRD_PARTY_NOTICES.md). Link mentions of
[Birman’s layout](https://ilyabirman.ru/typography-layout/) to its official
page. Do not imply authorship of upstream work.

## Formatting and commit checks

Run `bun install` to install the local Husky hook. Each commit runs lint-staged:
Oxlint fixes JS/TS, Stylelint fixes CSS, and Oxfmt formats the staged files.
Unstaged hunks are temporarily hidden and restored; failures block the commit.
Only safe lint fixes are enabled.

Use `bun run lint:fix` for a full cleanup and `bun run lint` for read-only
verification. Formatting targets 80 columns; prose is wrapped and long static
utility lists are split into readable fragments. URLs, regular expressions and
translation literals may exceed that width when splitting would change their
meaning.

Keep tokens and document defaults in the CSS foundation. Use static Tailwind
utility lists for simple component layouts; keep compound states,
pseudo-elements and responsive keyboard geometry in the corresponding feature
stylesheet. Preserve stylesheet import order because later rules may
intentionally refine earlier rules.
