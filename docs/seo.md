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
2. Verify ownership using the HTML tag method. The supplied
   `google-site-verification` meta tag is already in `app/layout.tsx` and is
   included in the published homepage.
3. Open **Sitemaps**, submit `sitemap.xml` for this property and check that its
   status becomes **Success**. The full URL is
   `https://jussiemion.github.io/keyboard-layout-demo/sitemap.xml`. It includes
   29 pages: the homepage, 14 localized trainers and 14 localized references,
   with language alternates. Both production builds regenerate it automatically;
   no manual XML updates are needed.
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

## Audience content

The trainer and reference include visible, localized sections for writers and
editors, graphic and UI/UX designers, and polyglots and translators. The same
use cases appear in all README translations. `lib/audience-copy.json` owns the
website copy; localized page descriptions feed the HTML, social metadata and
application schema. Titles retain the product name.

Describe actual tasks: em dashes and guillemets without numeric Alt codes,
copying currency and trademark symbols into designs, and cycling diacritics with
Shift after a base letter. Do not promise automatic quotation conversion, a
Figma plugin, system-wide input from the web demo, or 24 distinct languages: the
demo provides 24 keyboard options across 14 interface languages. Diacritics
depend on the selected language. Non-European support remains experimental.

The export checks that audience sections exist in the prerendered HTML for every
locale. They are visible to readers and crawlers alike. No separate bot-only
content or keyword stuffing is used. Google documents the same SEO fundamentals
for its
[AI search features](https://developers.google.com/search/docs/appearance/ai-features);
no ranking or AI citation is guaranteed.

## Localized benefits and FAQ

`lib/audience-details.json` contains the English and Russian benefit lists.
`lib/faq-copy.json` contains six FAQ answers for all 14 interface languages.
`SeoContent` renders them as visible headings, lists and paragraphs on both the
trainer and reference pages. The corresponding README sections use the same
copy; keep them in sync when editing. Other locales keep their translated
audience introductions alongside the complete FAQ.

The application schema includes the benefit labels as `featureList`, a stable
application identifier and the browser operating environment. Existing
canonical, Open Graph, Twitter and language alternate metadata remain in place.
English and Russian titles stay within 60 characters and descriptions within 160
characters. The export verifies those limits and checks the visible FAQ answers
in every language on both the trainer and reference pages.

README uses Markdown FAQ headings. It does not embed executable JSON-LD. Google
discontinued FAQ rich results in 2026; this content answers reader questions
without promising enhanced snippets or AI citations. See the
[Google Search documentation updates](https://developers.google.com/search/updates).

`SeoContent` is shared by the trainer and reference. It includes the layout
overview, features, audience scenarios, FAQ and attribution. Its `page` prop
links to the reference from the trainer and back to the trainer from the
reference.
