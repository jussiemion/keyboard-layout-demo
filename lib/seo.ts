import copy from './seo-copy.json' with { type: 'json' };
import audienceDetails from './audience-details.json' with { type: 'json' };
import { messages, UI_LOCALES, type UiLocale } from './messages.ts';

export const SITE_URL = 'https://jussiemion.github.io/keyboard-layout-demo/';
export const SITE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const REPOSITORY_URL =
  'https://github.com/jussiemion/keyboard-layout-demo';

export function localePath(locale: UiLocale) {
  return `${SITE_PATH}/${locale}/`;
}

export function localeUrl(locale?: UiLocale) {
  return locale ? `${SITE_URL}${locale}/` : SITE_URL;
}

export function referencePath(locale: UiLocale) {
  return `${localePath(locale)}reference/`;
}
export function referenceUrl(locale: UiLocale) {
  return `${localeUrl(locale)}reference/`;
}

export function languageAlternates(reference = false) {
  return Object.fromEntries([
    ['x-default', reference ? referenceUrl('en') : SITE_URL],
    ...UI_LOCALES.map((locale) => [
      locale,
      reference ? referenceUrl(locale) : localeUrl(locale),
    ]),
  ]);
}

export function pageMetadata(locale: UiLocale = 'en', root = false) {
  const m = messages[locale];
  const url = localeUrl(root ? undefined : locale);
  return {
    title: m.pageTitle,
    description: m.pageDescription,
    alternates: { canonical: url, languages: languageAlternates() },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website' as const,
      locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : locale,
      title: m.pageTitle,
      description: m.pageDescription,
      url,
      siteName: messages.en.productName,
      images: [
        {
          url: `${SITE_URL}social-preview.png`,
          width: 1200,
          height: 630,
          alt: m.productName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: m.pageTitle,
      description: m.pageDescription,
      images: [`${SITE_URL}social-preview.png`],
    },
  };
}

export function applicationSchema(locale: UiLocale, root = false) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${localeUrl(root ? undefined : locale)}#application`,
    ...(locale === 'en' || locale === 'ru'
      ? {
          featureList: audienceDetails[locale].groups.flatMap((group) =>
            group.items.map(([label]) => label),
          ),
        }
      : {}),
    name: messages[locale].productName,
    description: messages[locale].pageDescription,
    url: localeUrl(root ? undefined : locale),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web browser',
    browserRequirements: 'Requires a modern browser with JavaScript',
    isAccessibleForFree: true,
    inLanguage: locale,
    license: `${REPOSITORY_URL}/blob/main/LICENSE`,
    author: {
      '@type': 'Person',
      name: 'Semyon Yushkevich',
      url: 'https://github.com/jussiemion',
    },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function referenceMetadata(locale: UiLocale) {
  const meta = pageMetadata(locale);
  const title = `${copy[locale].referenceTitle} — ${messages[locale].productName}`;
  const description = copy[locale].referenceDescription;
  const url = referenceUrl(locale);
  return {
    ...meta,
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(true) },
    openGraph: { ...meta.openGraph, title, description, url },
    twitter: { ...meta.twitter, title, description },
  };
}
