import { helpMessages } from '../lib/help-messages.ts';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import {
  detectUiLocale,
  getInitialKeyboardLocale,
  getServerUiLocale,
  getUiLocale,
  localeBootstrap,
  parseUiLocale,
  setUiLocale,
  subscribeToUiLocale,
  UI_LOCALE_STORAGE_KEY,
} from '../lib/i18n.ts';
import {
  accentMessageKeys,
  formatMessage,
  messages,
  UI_LOCALES,
} from '../lib/messages.ts';
import { accents } from '../lib/typing-engine.ts';
import {
  getResolvedTheme,
  getServerResolvedTheme,
  setThemePreference,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
} from '../lib/theme.ts';
import {
  preferencesBootstrap,
  PREFERENCES_READY_EVENT,
  revealInitialPreferences,
} from '../lib/preferences.ts';

function browserFixture(
  languages = ['ru-RU'],
  saved?: string,
  blocked = false,
  savedTheme?: string,
  prefersDark = false,
) {
  const values = new Map<string, string>();
  if (saved) values.set(UI_LOCALE_STORAGE_KEY, saved);
  if (savedTheme) values.set(THEME_STORAGE_KEY, savedTheme);
  const classes = new Set<string>();
  const root = {
    dataset: {} as Record<string, string>,
    lang: 'en',
    dir: 'ltr',
    classList: {
      toggle(name: string, enabled: boolean) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
    },
  };
  const query = Object.assign(new EventTarget(), { matches: prefersDark });
  const matchMedia = () => query;
  const description = {
    content: '',
    setAttribute(name: string, value: string) {
      assert.equal(name, 'content');
      this.content = value;
    },
  };
  const browser = {
    window: Object.assign(new EventTarget(), { matchMedia }),
    matchMedia,
    navigator: { languages, language: languages[0] ?? 'en' },
    document: {
      documentElement: root,
      title: '',
      querySelector(selector: string) {
        assert.equal(selector, 'meta[name="description"]');
        return description;
      },
    },
    localStorage: {
      getItem(key: string) {
        if (blocked) throw new Error('Storage blocked');
        return values.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        if (blocked) throw new Error('Storage blocked');
        values.set(key, value);
      },
    },
  };
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(browser)) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  return {
    ...browser,
    values,
    classes,
    query,
    root,
    description,
    bootstrap: () => runInNewContext(localeBootstrap, browser),
    bootstrapPreferences: () => runInNewContext(preferencesBootstrap, browser),
    storage(key: string | null, newValue: string | null) {
      if (key === null) values.clear();
      else if (newValue === null) values.delete(key);
      else values.set(key, newValue);
      const event = new Event('storage');
      Object.defineProperties(event, {
        key: { value: key },
        newValue: { value: newValue },
      });
      browser.window.dispatchEvent(event);
    },
    restore() {
      for (const [name, descriptor] of originals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else Reflect.deleteProperty(globalThis, name);
      }
    },
  };
}

await test('all catalogs have complete messages, matching placeholders and every accent name', () => {
  const keys = Object.keys(messages.en).sort();
  const tokens = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
  for (const locale of UI_LOCALES) {
    const catalog = messages[locale];
    assert.deepEqual(Object.keys(catalog).sort(), keys);
    for (const [key, value] of Object.entries(catalog)) {
      assert.ok(value.trim(), `${locale}.${key}`);
      assert.deepEqual(
        tokens(value),
        tokens(messages.en[key as keyof typeof catalog]),
        `${locale}.${key}`,
      );
    }
    for (const key of Object.values(accentMessageKeys)) assert.ok(catalog[key]);
  }
  assert.deepEqual(
    Object.keys(accentMessageKeys).sort(),
    Object.keys(accents).sort(),
  );
});

await test('automatic detection honors preference order and regional language tags', () => {
  assert.equal(detectUiLocale(['de-DE', 'pl-PL', 'ru']), 'de');
  assert.equal(detectUiLocale(['en-GB', 'ru-RU']), 'en');
  assert.equal(detectUiLocale(['RU-ru']), 'ru');
  assert.equal(detectUiLocale(['pl_PL']), 'pl');
  assert.equal(detectUiLocale(['uk-UA', 'ja']), 'en');
  for (const tag of [
    'fr-FR',
    'de-DE',
    'es-ES',
    'pt-PT',
    'it-IT',
    'fr-CA',
    'pt-BR',
    'ro-RO',
    'ro-MD',
  ]) {
    assert.equal(detectUiLocale(['ja', tag]), tag.slice(0, 2));
  }
  assert.equal(detectUiLocale([]), 'en');
  assert.equal(getServerUiLocale(), 'en');
  for (const value of ['system', 'ja', 'ru-RU', '', undefined, null, 7]) {
    assert.equal(parseUiLocale(value), null);
  }
});

await test('formatting keeps repeated values, Unicode and visitor text literal', () => {
  assert.equal(
    formatMessage(messages.ru.keyDetailHelp, { alt: 'Alt' }),
    'Нажмите Alt для символьного режима. Дважды Alt — расширенный режим.',
  );
  assert.equal(
    formatMessage(messages.pl.entered, { symbol: 'ą́ {alt} <test>' }),
    'Wpisano: ą́ {alt} <test>',
  );
});

for (const locale of UI_LOCALES) {
  await test(`bootstrap and runtime agree on automatic ${locale} and document metadata`, () => {
    const browser = browserFixture(['ja', `${locale}-XX`]);
    try {
      browser.bootstrap();
      assert.equal(getUiLocale(), locale);
      assert.equal(browser.root.lang, locale);
      assert.equal(
        browser.root.dir,
        ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr',
      );
      assert.equal(browser.root.dataset.uiLocalePreference, 'auto');
      assert.equal(browser.document.title, messages[locale].pageTitle);
      assert.equal(
        browser.description.content,
        messages[locale].pageDescription,
      );
      const unsubscribe = subscribeToUiLocale(() => {});
      assert.equal(getUiLocale(), locale);
      assert.equal(browser.values.size, 0);
      unsubscribe();
    } finally {
      browser.restore();
    }
  });
}

await test('automatic locale follows browser changes and falls back to navigator.language', () => {
  const browser = browserFixture([]);
  try {
    browser.navigator.language = 'pl-PL';
    browser.bootstrap();
    let changes = 0;
    const unsubscribe = subscribeToUiLocale(() => {
      changes++;
    });
    assert.equal(getUiLocale(), 'pl');
    browser.navigator.languages = ['ru-RU'];
    browser.window.dispatchEvent(new Event('languagechange'));
    assert.equal(getUiLocale(), 'ru');
    assert.equal(browser.root.lang, 'ru');
    const before = changes;
    unsubscribe();
    browser.navigator.languages = ['en'];
    browser.window.dispatchEvent(new Event('languagechange'));
    assert.equal(changes, before);
    assert.equal(browser.values.size, 0);
  } finally {
    browser.restore();
  }
});

await test('manual choice persists on reload and takes priority over browser language', () => {
  const browser = browserFixture(['ru-RU']);
  try {
    browser.bootstrap();
    const unsubscribe = subscribeToUiLocale(() => {});
    setUiLocale('pl');
    assert.equal(browser.values.get(UI_LOCALE_STORAGE_KEY), 'pl');
    assert.equal(browser.document.title, messages.pl.pageTitle);
    assert.equal(browser.description.content, messages.pl.pageDescription);
    browser.navigator.languages = ['en'];
    browser.window.dispatchEvent(new Event('languagechange'));
    assert.equal(getUiLocale(), 'pl');
    browser.root.dataset = {};
    browser.bootstrap();
    assert.equal(getUiLocale(), 'pl');
    setUiLocale('unknown');
    assert.equal(getUiLocale(), 'pl');
    unsubscribe();
  } finally {
    browser.restore();
  }
});

await test('cross-tab selection updates the UI; removing a preference restores detection', () => {
  const browser = browserFixture(['ru-RU'], 'en');
  try {
    browser.bootstrap();
    const unsubscribe = subscribeToUiLocale(() => {});
    assert.equal(getUiLocale(), 'en');
    browser.storage(UI_LOCALE_STORAGE_KEY, 'pl');
    assert.equal(getUiLocale(), 'pl');
    browser.storage('keyboard-layout-demo.theme', 'vesper');
    assert.equal(getUiLocale(), 'pl');
    browser.storage(UI_LOCALE_STORAGE_KEY, null);
    assert.equal(getUiLocale(), 'ru');
    setUiLocale('en');
    browser.storage(null, null);
    assert.equal(getUiLocale(), 'ru');
    unsubscribe();
  } finally {
    browser.restore();
  }
});

await test('invalid saved values fall back to browser language', () => {
  const browser = browserFixture(['pl-PL'], 'unsupported');
  try {
    browser.bootstrap();
    assert.equal(getUiLocale(), 'pl');
    assert.equal(browser.root.dataset.uiLocalePreference, 'auto');
  } finally {
    browser.restore();
  }
});

await test('blocked local storage still permits automatic and manual selection', () => {
  const browser = browserFixture(['ru-RU'], undefined, true);
  try {
    browser.bootstrap();
    const unsubscribe = subscribeToUiLocale(() => {});
    assert.equal(getUiLocale(), 'ru');
    setUiLocale('pl');
    browser.navigator.languages = ['en'];
    browser.window.dispatchEvent(new Event('languagechange'));
    assert.equal(getUiLocale(), 'pl');
    assert.equal(browser.root.lang, 'pl');
    assert.equal(browser.values.size, 0);
    unsubscribe();
  } finally {
    browser.restore();
  }
});

const themes: ResolvedTheme[] = ['vesper', 'vesper_light'];
const savedPreferences = UI_LOCALES.flatMap((locale) =>
  themes.map((theme) => ({ locale, theme })),
);
for (const { locale, theme } of savedPreferences) {
  await test(`restore saved ${locale}/${theme} before exposing the static fallback`, () => {
    const browser = browserFixture(['en-GB'], locale, false, theme);
    try {
      let reveals = 0;
      browser.window.addEventListener(PREFERENCES_READY_EVENT, () => {
        reveals++;
      });
      browser.bootstrapPreferences();
      assert.equal(getUiLocale(), locale);
      assert.equal(getResolvedTheme(), theme);
      assert.equal(browser.root.lang, locale);
      assert.equal(
        browser.root.dir,
        ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr',
      );
      assert.equal(browser.classes.has('dark'), theme === 'vesper');
      const differs =
        locale !== getServerUiLocale() || theme !== getServerResolvedTheme();
      assert.equal(Boolean(browser.root.dataset.preferencesPending), differs);
      assert.equal(
        revealInitialPreferences(
          getServerUiLocale(),
          getServerResolvedTheme(),
          'linux',
        ),
        !differs,
      );
      assert.equal(revealInitialPreferences(locale, theme, 'linux'), true);
      assert.equal(browser.root.dataset.preferencesPending, undefined);
      revealInitialPreferences(locale, theme, 'linux');
      assert.equal(reveals, differs ? 1 : 0);

      // A new document still uses the saved choice after browser defaults change.
      browser.root.dataset = {};
      browser.navigator.languages = ['ru-RU'];
      browser.query.matches = theme !== 'vesper';
      browser.bootstrapPreferences();
      assert.equal(getUiLocale(), locale);
      assert.equal(getResolvedTheme(), theme);
    } finally {
      browser.restore();
    }
  });
}

const firstVisits = UI_LOCALES.flatMap((locale) => [
  { locale, prefersDark: false },
  { locale, prefersDark: true },
]);
for (const { locale, prefersDark } of firstVisits) {
  await test(`first visit applies browser ${locale} and ${prefersDark ? 'dark' : 'light'} preferences`, () => {
    const browser = browserFixture(
      ['ja-JP', `${locale}-XX`],
      undefined,
      false,
      undefined,
      prefersDark,
    );
    try {
      browser.bootstrapPreferences();
      const theme = prefersDark ? 'vesper' : 'vesper_light';
      assert.equal(getUiLocale(), locale);
      assert.equal(getResolvedTheme(), theme);
      assert.equal(revealInitialPreferences(locale, theme, 'linux'), true);
      assert.equal(browser.root.dataset.preferencesPending, undefined);
      assert.equal(browser.values.size, 0);
    } finally {
      browser.restore();
    }
  });
}

await test('a partial hydration must not reveal the wrong locale or theme icon', () => {
  const browser = browserFixture(['en'], 'ru', false, 'vesper');
  try {
    browser.bootstrapPreferences();
    assert.equal(
      revealInitialPreferences('ru', 'vesper_light', 'linux'),
      false,
    );
    assert.equal(revealInitialPreferences('en', 'vesper', 'linux'), false);
    assert.equal(browser.root.dataset.preferencesPending, 'true');
    assert.equal(revealInitialPreferences('ru', 'vesper', 'linux'), true);
    assert.equal(browser.root.dataset.preferencesPending, undefined);
  } finally {
    browser.restore();
  }
});

await test('a preference change during startup cannot reveal a stale snapshot', () => {
  const browser = browserFixture(['en'], 'ru', false, 'vesper');
  try {
    browser.bootstrapPreferences();
    setUiLocale('pl');
    setThemePreference('vesper_light');
    assert.equal(revealInitialPreferences('ru', 'vesper', 'linux'), false);
    assert.equal(browser.root.dataset.preferencesPending, 'true');
    assert.equal(revealInitialPreferences('pl', 'vesper_light', 'linux'), true);
    assert.equal(browser.values.get(UI_LOCALE_STORAGE_KEY), 'pl');
    assert.equal(browser.values.get(THEME_STORAGE_KEY), 'vesper_light');
  } finally {
    browser.restore();
  }
});

await test('a blocked cache still reveals matching automatic preferences', () => {
  const browser = browserFixture(['pl-PL'], undefined, true, undefined, true);
  try {
    browser.bootstrapPreferences();
    assert.equal(getUiLocale(), 'pl');
    assert.equal(getResolvedTheme(), 'vesper');
    assert.equal(revealInitialPreferences('pl', 'vesper', 'linux'), true);
    assert.equal(browser.root.dataset.preferencesPending, undefined);
  } finally {
    browser.restore();
  }
});

await test('invalid cached preferences use browser defaults without trapping the page', () => {
  const browser = browserFixture(['ru-RU'], 'invalid', false, 'invalid', false);
  try {
    browser.bootstrapPreferences();
    assert.equal(getUiLocale(), 'ru');
    assert.equal(getResolvedTheme(), 'vesper_light');
    assert.equal(revealInitialPreferences('ru', 'vesper_light', 'linux'), true);
    assert.equal(browser.root.dataset.preferencesPending, undefined);
  } finally {
    browser.restore();
  }
});

for (const locale of UI_LOCALES) {
  await test(`initial keyboard locale ${locale} is independent of saved and changed UI language`, () => {
    const browser = browserFixture(['ja-JP', `${locale}-XX`], 'ru');
    try {
      browser.bootstrap();
      assert.equal(getInitialKeyboardLocale(), locale);
      assert.equal(getUiLocale(), 'ru');
      setUiLocale('pl');
      assert.equal(getInitialKeyboardLocale(), locale);
      assert.equal(getUiLocale(), 'pl');
    } finally {
      browser.restore();
    }
  });
}

await test('initial keyboard language falls back to English for unsupported browser locales', () => {
  const browser = browserFixture(['ja-JP'], 'ru');
  try {
    browser.bootstrap();
    assert.equal(getInitialKeyboardLocale(), 'en');
    assert.equal(getUiLocale(), 'ru');
  } finally {
    browser.restore();
  }
});

await test('all localized help tabs are complete, including Romanian', () => {
  for (const locale of UI_LOCALES) {
    assert.deepEqual(
      Object.keys(helpMessages[locale]).sort(),
      Object.keys(helpMessages.en).sort(),
    );
    for (const value of Object.values(helpMessages[locale]))
      assert.ok(value.trim());
  }
  assert.equal(messages.ro.inputPlaceholder, 'Scrie ceva…');
  assert.equal(parseUiLocale('ro'), 'ro');
});

void test('Hebrew modern and legacy locale tags select Hebrew', () => {
  assert.equal(detectUiLocale(['he-IL']), 'he');
  assert.equal(detectUiLocale(['iw_IL']), 'he');
});
