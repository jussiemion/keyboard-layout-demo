import diacritics from './diacritic-profiles.ts';
import {
  keyboardLanguage,
  type Locale,
  type KeyboardLocale,
} from './keyboard-locales';

export function helpExamples(keyboard: KeyboardLocale) {
  const locale = keyboardLanguage(keyboard);
  // English's broad international input profile is not a native alphabet.
  const language =
    locale !== 'en' &&
    locale !== 'he' &&
    locale !== 'ar' &&
    diacritics.profiles[locale]?.length
      ? locale
      : 'pl';
  const letters = Array.from(diacritics.profiles[language][0]);
  const letter = letters[0];
  const variant = {
    en: 'ą',
    pl: 'ą',
    ru: 'ё',
    fr: 'â',
    de: 'ä',
    es: 'ü',
    pt: 'ã',
    it: 'è',
    ro: 'ă',
    tr: 'ü',
    vi: 'ă',
    nl: 'ë',
  }[language];
  return {
    language,
    cycle: letters.join(' → '),
    letter,
    stressed: (letter + '\u0301').normalize('NFC'),
    stressedVariant: `${variant} → ${(variant + '\u0301').normalize('NFC')}`,
  };
}

export function exampleLanguageName(language: Locale, uiLocale: Locale) {
  if (uiLocale === 'ru') {
    return {
      en: 'в английском',
      ru: 'в русском',
      pl: 'в польском',
      fr: 'во французском',
      de: 'в немецком',
      es: 'в испанском',
      pt: 'в португальском',
      it: 'в итальянском',
      ro: 'в румынском',
      he: 'в иврите',
      ar: 'в арабском',
      tr: 'в турецком',
      vi: 'во вьетнамском',
      nl: 'в нидерландском',
    }[language];
  }
  return (
    new Intl.DisplayNames([uiLocale], { type: 'language' }).of(language) ||
    language
  );
}
