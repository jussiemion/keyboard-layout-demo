import { diacriticVariants } from './typing-engine.ts';
import diacritics from './diacritic-profiles.ts';
import {
  keyboardLanguage,
  type Locale,
  type KeyboardLocale,
} from './keyboard-locales.ts';

export function helpExamples(keyboard: KeyboardLocale) {
  const locale = keyboardLanguage(keyboard);
  // Match the active map's filtering; use an explicitly labelled Polish
  // example when that map has no postfix variants (e.g. Russian or German).
  const profiles = diacritics.profiles as Partial<Record<Locale, string[]>>;
  const available = (profiles[locale] ?? [])
    .map((row) => diacriticVariants(Array.from(row)[0], keyboard))
    .find((row) => row.length > 1);
  const language = available ? locale : 'pl';
  const letters = available ?? diacriticVariants('a', 'pl');
  const letter = letters[0];
  const variant = letters[1];
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
