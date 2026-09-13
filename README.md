# Typographic Layout by Semyon Yushkevich

A typographic keyboard layout for punctuation, symbols, diacritics and language switching, with an interactive browser demo.

Created by **Semyon Yushkevich**. The shared symbol map builds on [Ilya Birman’s Typography Layout](https://ilyabirman.ru/typography-layout/).

## Run locally

Use Node.js 24 (the recommended version is in `.node-version`) and Bun 1.4.0.

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:6699](http://127.0.0.1:6699).

| Command | Purpose |
| --- | --- |
| `bun run test` | Run engine and input-controller tests |
| `bun run lint` | Check source code with Oxlint |
| `bun run typecheck` | Check TypeScript types |
| `bun run format` | Format source files with Oxfmt |
| `bun run build` | Generate the static application in `dist/client` |
| `bun run preview` | Serve the static build locally on port 6699 |
| `bun run build:pages` | Build and validate the GitHub Pages export; does not deploy |

Stop the development server before starting the preview; both use port 6699 by default. Use `PORT=6700 bun run preview` to preview on another port.

## Typing engine

See the [engine guide](docs/typing-engine.md) for modes, data sources and validation.

## Browser input

See the [input guide](docs/browser-input.md) for language gestures, saved mappings and native-layout detection.

## Contributing

Read the [contribution guide](CONTRIBUTING.md). Explain the problem, keep changes focused and include relevant validation.

## License

Original contributions are available under the [MIT license](LICENSE). Preserve copyright and license notices when using or distributing them. [Third-party materials](THIRD_PARTY_NOTICES.md) retain their own terms.
