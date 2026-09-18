import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { UI_LOCALES } from '../lib/messages.ts';
import {
  SITE_URL,
  localeUrl,
  referenceUrl,
  languageAlternates,
  pageMetadata,
  referenceMetadata,
} from '../lib/seo.ts';

import faqCopy from '../lib/faq-copy.json' with { type: 'json' };

const output = 'dist/client';
const escapeXml = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
const entries = [
  { url: SITE_URL, reference: false },
  ...UI_LOCALES.flatMap((locale) => [
    { url: localeUrl(locale), reference: false },
    { url: referenceUrl(locale), reference: true },
  ]),
];
const urls = entries
  .map(
    ({ url, reference }) =>
      `<url><loc>${escapeXml(url)}</loc>${Object.entries(
        languageAlternates(reference),
      )
        .map(
          ([lang, href]) =>
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`,
        )
        .join('')}</url>`,
  )
  .join('\n');
writeFileSync(
  join(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>\n`,
);
writeFileSync(
  join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`,
);
// Vinext's root layout receives no descendant params. Set the static document
// language to match the already-localized page and hydration provider.
for (const locale of UI_LOCALES) {
  for (const suffix of ['', 'reference']) {
    const file = join(output, locale, suffix, 'index.html');
    if (!existsSync(file)) {
      throw new Error(`Missing localized export: ${file}`);
    }
    const html = readFileSync(file, 'utf8').replace(/<html\b[^>]*>/, (tag) =>
      tag
        .replace(/lang="[^"]*"/, `lang="${locale}"`)
        .replace(
          /dir="[^"]*"/,
          `dir="${['ar', 'he'].includes(locale) ? 'rtl' : 'ltr'}"`,
        )
        .replace(
          /data-rendered-locale="[^"]*"/,
          `data-rendered-locale="${locale}"`,
        ),
    );
    const meta = suffix ? referenceMetadata(locale) : pageMetadata(locale);
    if (
      !html.includes(`href="${meta.alternates.canonical}"`) ||
      !html.includes('id="audience-heading"') ||
      !html.toLowerCase().includes(`hreflang="${locale}"`) ||
      (suffix && (html.match(/<article\b/g)?.length ?? 0) < 70)
    ) {
      throw new Error(`Incomplete SEO content: ${file}`);
    }
    {
      const visibleHtml = html.replace(
        /<script\b[^>]*>[\s\S]*?<\/script>/g,
        '',
      );
      for (const [question, answer] of faqCopy[locale].items) {
        if (
          !visibleHtml.includes(escapeXml(question)) ||
          !visibleHtml.includes(escapeXml(answer))
        ) {
          throw new Error(`Missing visible FAQ content: ${file}`);
        }
      }
      if (
        (locale === 'en' || locale === 'ru') &&
        !suffix &&
        (meta.title.length > 60 || meta.description.length > 160)
      ) {
        throw new Error(
          `SEO title or description exceeds its length budget: ${file}`,
        );
      }
    }
    writeFileSync(file, html);
  }
}
console.log(
  `SEO export: ${entries.length} canonical URLs, language alternates and robots.txt`,
);
