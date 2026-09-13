import {
  parseKeyboardLocale,
  type KeyboardLocale,
} from './keyboard-locales.ts';
import { messages, UI_LOCALES, type UiLocale } from './messages.ts';

export const UI_LOCALE_STORAGE_KEY = 'keyboard-layout-demo.ui-locale';
const UI_LOCALE_CHANGE_EVENT = 'keyboard-layout-demo:ui-locale-change';

export function parseUiLocale(value: unknown): UiLocale | null {
  return UI_LOCALES.includes(value as UiLocale) ? (value as UiLocale) : null;
}

export function detectUiLocale(languages: readonly string[]): UiLocale {
  for (const language of languages) {
    const locale = parseUiLocale(
      language.toLowerCase().split(/[-_]/)[0].replace(/^iw$/, 'he'),
    );
    if (locale) {
      return locale;
    }
  }
  return 'en';
}

// A primary English locale may still declare a preferred native language.
export function detectNativeLocale(languages: readonly string[]): UiLocale {
  const primary = detectUiLocale(languages);
  if (primary !== 'en') {
    return primary;
  }
  for (const language of languages) {
    const candidate = parseUiLocale(
      language.toLowerCase().split(/[-_]/)[0].replace(/^iw$/, 'he'),
    );
    if (candidate && candidate !== 'en') {
      return candidate;
    }
  }
  return 'en';
}

export function getNativeKeyboardLocale(): UiLocale {
  return detectNativeLocale(browserLanguages());
}

function browserLanguages() {
  return navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
}

// Initial keyboard language follows the browser, independently of saved UI choices.
export function getInitialKeyboardLocale(): KeyboardLocale {
  return (
    parseKeyboardLocale(document.documentElement.dataset.keyboardLocale) ??
    detectUiLocale(browserLanguages())
  );
}

export function subscribeToInitialKeyboardLocale() {
  return () => {};
}

function getPreference(): UiLocale | null {
  const applied = document.documentElement.dataset.uiLocalePreference;
  if (applied) {
    return parseUiLocale(applied);
  }
  try {
    return parseUiLocale(localStorage.getItem(UI_LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getUiLocale(): UiLocale {
  return (
    parseUiLocale(document.documentElement.dataset.uiLocale) ??
    getPreference() ??
    detectUiLocale(browserLanguages())
  );
}

export function getServerUiLocale(): UiLocale {
  return 'en';
}

function applyLocale(preference: UiLocale | null) {
  const locale = preference ?? detectUiLocale(browserLanguages());
  const root = document.documentElement;
  root.dataset.uiLocalePreference = preference ?? 'auto';
  root.dataset.uiLocale = locale;
  root.lang = locale;
  root.dir = ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr';
  document.title = messages[locale].pageTitle;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', messages[locale].pageDescription);
}

export function setUiLocale(value: string) {
  const locale = parseUiLocale(value);
  if (!locale) {
    return;
  }
  applyLocale(locale);
  try {
    localStorage.setItem(UI_LOCALE_STORAGE_KEY, locale);
  } catch {
    // A blocked storage API must not prevent switching in the current tab.
  }
  window.dispatchEvent(new Event(UI_LOCALE_CHANGE_EVENT));
}

export function subscribeToUiLocale(onChange: () => void) {
  const update = () => {
    applyLocale(getPreference());
    onChange();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== UI_LOCALE_STORAGE_KEY && event.key !== null) {
      return;
    }
    applyLocale(parseUiLocale(event.newValue));
    onChange();
  };
  window.addEventListener('languagechange', update);
  window.addEventListener(UI_LOCALE_CHANGE_EVENT, update);
  window.addEventListener('storage', storageChanged);
  update();
  return () => {
    window.removeEventListener('languagechange', update);
    window.removeEventListener(UI_LOCALE_CHANGE_EVENT, update);
    window.removeEventListener('storage', storageChanged);
  };
}

const metadata = Object.fromEntries(
  UI_LOCALES.map((locale) => [
    locale,
    {
      title: messages[locale].pageTitle,
      description: messages[locale].pageDescription,
    },
  ]),
);

// Fixed application code only; no visitor text is interpolated into this script.
export const localeBootstrap = `(() => {
  const supported = ${JSON.stringify(UI_LOCALES)};
  let preference = null;
  try {
    const saved = localStorage.getItem('${UI_LOCALE_STORAGE_KEY}');
    if (supported.includes(saved)) preference = saved;
  } catch {}
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const detected = languages.map(language => language.toLowerCase().split(/[-_]/)[0].replace(/^iw$/, 'he')).find(language => supported.includes(language)) || 'en';
  const locale = preference || detected;
  const root = document.documentElement;
  root.dataset.keyboardLocale = detected;
  root.dataset.uiLocalePreference = preference || 'auto';
  root.dataset.uiLocale = locale;
  root.lang = locale;
  root.dir = ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr';
  const metadata = ${JSON.stringify(metadata)};
  document.title = metadata[locale].title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[locale].description);
})();`;
