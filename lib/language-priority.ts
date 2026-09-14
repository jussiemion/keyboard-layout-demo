import {
  keyboardLanguage,
  type KeyboardLocale,
  type Locale,
} from './keyboard-locales.ts';

// Display groups, not linguistic families. Regional maps follow their language.
function languageGroup(locale: KeyboardLocale): number {
  const language = keyboardLanguage(locale);
  if (language === 'vi') {
    return 2;
  }
  if (['ar', 'he', 'tr'].includes(language)) {
    return 1;
  }
  return 0;
}

export function languageComparator(
  uiLocale: Locale,
  priority: readonly KeyboardLocale[],
  label: (locale: KeyboardLocale) => string,
) {
  const assigned = [...new Set(priority)];
  const collator = new Intl.Collator(uiLocale, { sensitivity: 'base' });
  function rank(locale: KeyboardLocale) {
    const index = assigned.indexOf(locale);
    return index < 0 ? assigned.length + languageGroup(locale) : index;
  }
  return (a: KeyboardLocale, b: KeyboardLocale) =>
    rank(a) - rank(b) || collator.compare(label(a), label(b));
}
