/** UI languages and physical keyboard references are deliberately separate. */
export const LANGUAGES = [
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
] as const;
export type Locale = (typeof LANGUAGES)[number];
export const KEYBOARD_LOCALES = [
  ...LANGUAGES,
  'en-AU',
  'en-NG',
  'en-NZ',
  'en-SG',
  'en-US',
  'en-ZW',
  'es-MX',
  'pt-BR',
  'fr-CA',
  'de-CH',
] as const;
export type KeyboardLocale = (typeof KEYBOARD_LOCALES)[number];
export function keyboardLanguage(locale: KeyboardLocale): Locale {
  return locale.split('-')[0] as Locale;
}
// Product support scope, not a classification of language families.
export function isExperimentalKeyboard(locale: KeyboardLocale): boolean {
  return ['ar', 'he', 'tr', 'vi'].includes(keyboardLanguage(locale));
}
export function isRtl(locale: string) {
  return /^(he|ar)(-|$)/.test(locale);
}
export function parseKeyboardLocale(value: unknown): KeyboardLocale | null {
  return typeof value === 'string'
    ? (KEYBOARD_LOCALES.find(
        (locale) =>
          locale.toLowerCase() === value.replaceAll('_', '-').toLowerCase(),
      ) ?? null)
    : null;
}
const defaultRegions: Partial<Record<Locale, string>> = {
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  pt: 'PT',
  it: 'IT',
  ro: 'RO',
  he: 'IL',
};
export function keyboardLabel(
  locale: KeyboardLocale,
  uiLocale: Locale,
): string {
  const language = keyboardLanguage(locale);
  const region = locale.split('-')[1] ?? defaultRegions[language];
  const name =
    new Intl.DisplayNames([uiLocale], { type: 'language' }).of(language) ??
    language;
  return region
    ? `${name} (${new Intl.DisplayNames([uiLocale], { type: 'region' }).of(region) ?? region})`
    : name;
}
// English regional choices use the same US QWERTY reference, not a claim
// that a country has only one physical keyboard standard.
export function keyboardMap(locale: KeyboardLocale): string {
  return locale.startsWith('en-') ? 'en' : locale;
}
