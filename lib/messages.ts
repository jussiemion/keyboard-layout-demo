import { en } from './locales/en.ts';
import { ru } from './locales/ru.ts';
import { pl } from './locales/pl.ts';
import { fr } from './locales/fr.ts';
import { de } from './locales/de.ts';
import { es } from './locales/es.ts';
import { pt } from './locales/pt.ts';
import { it } from './locales/it.ts';
import { ro } from './locales/ro.ts';
import { he } from './locales/he.ts';
import { ar } from './locales/ar.ts';
import { tr } from './locales/tr.ts';
import { vi } from './locales/vi.ts';
import { nl } from './locales/nl.ts';

export { en, ru, pl };
export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

export const messages = {
  en,
  ru,
  pl,
  fr,
  de,
  es,
  pt,
  it,
  ro,
  he,
  ar,
  tr,
  vi,
  nl,
} satisfies Record<import('./keyboard-locales.ts').Locale, Messages>;
export type UiLocale = keyof typeof messages;
export const UI_LOCALES: UiLocale[] = [
  'ru',
  'en',
  'pl',
  'fr',
  'de',
  'es',
  'pt',
  'it',
  'ro',
  'he',
  'ar',
  'tr',
  'vi',
  'nl',
];
export const nativeLanguageNames: Record<UiLocale, string> = {
  ru: 'Русский',
  en: 'English',
  pl: 'Polski',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  ro: 'Română',
  he: 'עברית',
  ar: 'العربية',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  nl: 'Nederlands',
};
export const languageMessageKeys = {
  ru: 'languageRu',
  en: 'languageEn',
  pl: 'languagePl',
  fr: 'languageFr',
  de: 'languageDe',
  es: 'languageEs',
  pt: 'languagePt',
  it: 'languageIt',
  ro: 'languageRo',
  he: 'languageHe',
} as const;
export const accentMessageKeys: Record<string, MessageKey> = {
  grave: 'accentGrave',
  circumflex: 'accentCircumflex',
  breve: 'accentBreve',
  ring: 'accentRing',
  doubleacute: 'accentDoubleacute',
  diaeresis: 'accentDiaeresis',
  cedilla: 'accentCedilla',
  caron: 'accentCaron',
  tilde: 'accentTilde',
  acute: 'accentAcute',
};
export const keyMessageKeys: Record<string, MessageKey> = {
  Backspace: 'keyBackspace',
  Tab: 'keyTab',
  CapsLock: 'keyCapsLock',
  Enter: 'keyEnter',
  ShiftLeft: 'keyShift',
  ShiftRight: 'keyShift',
  ControlLeft: 'keyCtrl',
  ControlRight: 'keyCtrl',
  MetaLeft: 'keyMeta',
  MetaRight: 'keyMeta',
  AltLeft: 'keyAlt',
  AltRight: 'keyAlt',
  ContextMenu: 'keyMenu',
  Space: 'space',
  ArrowLeft: 'keyArrowLeft',
  ArrowRight: 'keyArrowRight',
  ArrowUp: 'keyArrowUp',
  ArrowDown: 'keyArrowDown',
};

export function formatMessage(
  message: string,
  values: Record<string, string> = {},
) {
  return message.replace(
    /\{(\w+)\}/g,
    (token, key: string) => values[key] ?? token,
  );
}
