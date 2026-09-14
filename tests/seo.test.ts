import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { localeBootstrap, localeFromPath } from '../lib/i18n.ts';
import { UI_LOCALES } from '../lib/messages.ts';
import {
  pageMetadata,
  referenceMetadata,
  languageAlternates,
} from '../lib/seo.ts';

for (const locale of UI_LOCALES) {
  await test(`${locale}: demo and reference have distinct canonical URLs and reciprocal alternates`, () => {
    const demo = pageMetadata(locale);
    const reference = referenceMetadata(locale);
    assert.notEqual(demo.alternates.canonical, reference.alternates.canonical);
    assert.notEqual(demo.description, reference.description);
    assert.equal(demo.alternates.languages[locale], demo.alternates.canonical);
    assert.equal(
      reference.alternates.languages[locale],
      reference.alternates.canonical,
    );
    assert.equal(
      Object.keys(languageAlternates()).length,
      UI_LOCALES.length + 1,
    );
    assert.equal(
      localeFromPath(`/keyboard-layout-demo/${locale}/reference/`),
      locale,
    );
  });
}

await test('explicit reference URL wins over saved/browser locale without replacing reference metadata', () => {
  const root = { dataset: {} as Record<string, string>, lang: '', dir: '' };
  const document = {
    documentElement: root,
    title: '',
    querySelector: () => ({ setAttribute() {} }),
  };
  runInNewContext(localeBootstrap, {
    window: { location: { pathname: '/keyboard-layout-demo/ar/reference/' } },
    document,
    localStorage: { getItem: () => 'ru' },
    navigator: { languages: ['en-US'] },
  });
  assert.equal(root.lang, 'ar');
  assert.equal(root.dir, 'rtl');
  assert.equal(root.dataset.keyboardLocale, 'ar');
  assert.equal(document.title, referenceMetadata('ar').title);
});
