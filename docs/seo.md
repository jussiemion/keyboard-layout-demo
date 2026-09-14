# Search discovery

The homepage keeps the interactive trainer compact. Its menu and symbol search
link to the standalone reference; the reference links back to the trainer.
Introductory content lives on the reference page, visible to everyone.

The site serves three uses: **typographic keyboard layout**, **typing trainer**
and **typography reference**. Search copy describes real features: quotation
marks, dashes, special characters, Unicode, accents and diacritics. Translations
use natural local terms, including «справочник типографики», «кавычки-ёлочки»
and «длинное тире». There is no hidden keyword list or invented search-volume
data.

## Pages and content

- `/` is the default demo, with automatic language selection.
- `/<language>/` provides a stable demo URL for each of the 14 interface
  languages.
- `/<language>/reference/` provides the searchable symbol reference.
- Regional keyboard maps share their interface language's page.

Every localized page is exported as HTML. The reference contains the same symbol
names, descriptions, national usage tags and input sequences as the demo's
search. Each symbol has a permanent fragment link. Non-European language support
remains explicitly experimental.

`lib/seo.ts` defines production URLs, canonical links, reciprocal `hreflang`,
Open Graph and Twitter previews. The demo uses `WebApplication` structured data;
the reference uses `DefinedTermSet`. These describe content without claiming
ratings or guaranteed rich results.

`tools/export-seo.mjs` writes the sitemap and checks localized exports during
both builds. It also sets the exported document language because the current
Vinext root layout does not receive descendant route parameters.

## After publishing

1. Add the URL-prefix property
   `https://jussiemion.github.io/keyboard-layout-demo/` to Google Search
   Console.
2. Verify ownership using Google's HTML file method: place the exact supplied
   file in `public/`, then publish it. Do not invent a verification token.
3. Submit `https://jussiemion.github.io/keyboard-layout-demo/sitemap.xml`.
4. Inspect the homepage and a reference URL, then request indexing.
5. Optionally import the verified property into Bing Webmaster Tools and submit
   the same sitemap.

On GitHub Pages, crawlers consult `/robots.txt` at the **host root**. The
generated project-level file does not control that root. A missing root file
does not block crawling; submit the sitemap directly to webmaster tools.

Indexing and rankings are determined by search engines. Track actual queries,
impressions and crawl errors after publication before expanding content.

## Guidance

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google: supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
