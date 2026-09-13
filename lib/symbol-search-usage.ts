import type { SymbolSearchItem } from './symbol-search-index.ts';
import { LANGUAGES, type Locale } from './keyboard-locales.ts';

// Curated examples, not exclusive national ownership or an exhaustive style guide.
// Quote pairs: Unicode 16 §6.2 and CLDR 48 common/main/{locale}.xml.
// See docs/symbol-search.md for sources and scope.
const usageText = {
  opening: {
    tr: 'Açılış tırnağı',
    nl: 'Aanhalingsteken openen',
    vi: 'Ngoặc kép mở',
    ar: 'علامة اقتباس افتتاحية',
    en: 'Opening quotation mark',
    ru: 'Открывающая кавычка',
    pl: 'Cudzysłów otwierający',
    fr: 'Guillemet ouvrant',
    de: 'Öffnendes Anführungszeichen',
    es: 'Comilla de apertura',
    pt: 'Aspas de abertura',
    it: 'Virgoletta di apertura',
    ro: 'Ghilimea de deschidere',
    he: 'מירכאות פותחות',
  },
  closing: {
    tr: 'Kapanış tırnağı',
    nl: 'Aanhalingsteken sluiten',
    vi: 'Ngoặc kép đóng',
    ar: 'علامة اقتباس ختامية',
    en: 'Closing quotation mark',
    ru: 'Закрывающая кавычка',
    pl: 'Cudzysłów zamykający',
    fr: 'Guillemet fermant',
    de: 'Schließendes Anführungszeichen',
    es: 'Comilla de cierre',
    pt: 'Aspas de fecho',
    it: 'Virgoletta di chiusura',
    ro: 'Ghilimea de închidere',
    he: 'מירכאות סוגרות',
  },
  example: {
    tr: 'Kullanım örnekleri',
    nl: 'Gebruiksvoorbeelden',
    vi: 'Ví dụ sử dụng',
    ar: 'أمثلة الاستخدام',
    en: 'Examples of use',
    ru: 'Примеры использования',
    pl: 'Przykłady użycia',
    fr: 'Exemples d’utilisation',
    de: 'Verwendungsbeispiele',
    es: 'Ejemplos de uso',
    pt: 'Exemplos de utilização',
    it: 'Esempi d’uso',
    ro: 'Exemple de utilizare',
    he: 'דוגמאות שימוש',
  },
  apostrophe: {
    tr: 'Tipografik kesme işareti olarak da kullanılır: don’t, l’été.',
    nl: 'Ook een typografische apostrof: don’t, l’été.',
    vi: 'Cũng là dấu nháy đơn kiểu chữ: don’t, l’été.',
    ar: 'يُستخدم فاصلة علوية طباعية أيضًا: don’t، l’été.',
    en: 'Also a typographic apostrophe: don’t, l’été.',
    ru: 'Также типографский апостроф: don’t, l’été.',
    pl: 'Także apostrof typograficzny: don’t, l’été.',
    fr: 'Aussi une apostrophe typographique : don’t, l’été.',
    de: 'Auch typografischer Apostroph: don’t, l’été.',
    es: 'También apóstrofo tipográfico: don’t, l’été.',
    pt: 'Também apóstrofo tipográfico: don’t, l’été.',
    it: 'Anche apostrofo tipografico: don’t, l’été.',
    ro: 'Și apostrof tipografic: don’t, l’été.',
    he: 'משמש גם כאפוסטרוף טיפוגרפי: don’t, l’été.',
  },
  backtick: {
    tr: 'Ters tırnak Markdown kodunu ve JavaScript şablon dizelerini sınırlar. Kesme işaretinden farklıdır.',
    nl: 'Een backtick begrenst code in Markdown en sjabloonstrings in JavaScript. Het is geen apostrof.',
    vi: 'Dấu nháy ngược bao quanh mã Markdown và chuỗi mẫu JavaScript. Khác dấu nháy đơn.',
    ar: 'تحدّد علامة الاقتباس المعكوسة الكود في Markdown والقوالب النصية في JavaScript. تختلف عن الفاصلة العلوية.',
    en: 'A backtick delimits code in Markdown and template literals in JavaScript. It is distinct from an apostrophe.',
    ru: 'Обратная кавычка выделяет код в Markdown и шаблонные строки в JavaScript. Это не апостроф.',
    pl: 'Odwrócony apostrof oznacza kod w Markdown i szablony tekstowe w JavaScript. Różni się od apostrofu.',
    fr: 'L’accent grave délimite le code en Markdown et les littéraux de gabarit en JavaScript. Il diffère de l’apostrophe.',
    de: 'Der Backtick begrenzt Code in Markdown und Template-Literale in JavaScript. Er ist kein Apostroph.',
    es: 'El acento grave delimita código en Markdown y plantillas en JavaScript. No es un apóstrofo.',
    pt: 'O acento grave delimita código em Markdown e modelos de texto em JavaScript. Não é um apóstrofo.',
    it: 'L’accento grave delimita codice in Markdown e template literal in JavaScript. Non è un apostrofo.',
    ro: 'Accentul grav delimitează cod în Markdown și șabloane în JavaScript. Nu este apostrof.',
    he: 'גרש הפוך תוחם קוד ב־Markdown ומחרוזות תבנית ב־JavaScript. הוא שונה מאפוסטרוף.',
  },
} satisfies Record<string, Record<Locale, string>>;

// The order is opening, closing. Identical glyphs can have different roles.
const quotePairs: { pair: string; languages: string[] }[] = [
  { pair: '„”', languages: ['pl', 'ro', 'hu'] },
  { pair: '„“', languages: ['de', 'cs', 'sk', 'ru'] },
  { pair: '“”', languages: ['en', 'pt', 'es', 'it', 'tr', 'vi'] },
  { pair: '«»', languages: ['ru', 'fr', 'es', 'it', 'pl', 'ro'] },
  { pair: '»«', languages: ['de'] },
  { pair: '‹›', languages: ['fr'] },
  { pair: '›‹', languages: ['de'] },
  { pair: '‚‘', languages: ['de', 'cs', 'sk'] },
  { pair: '””', languages: ['he'] },
  { pair: '”“', languages: ['ar'] },
  { pair: '’‘', languages: ['ar'] },
  { pair: '’’', languages: ['he'] },
  { pair: '‘’', languages: ['en', 'pt', 'es', 'it', 'tr', 'vi', 'nl'] },
];

// These examples describe language usage, not a promise that every combination
// is present in the current dead-key table.
const examples: Record<string, Record<string, string>> = {
  '^': {
    fr: 'â, ê, î, ô, û',
    pt: 'â, ê, ô',
    ro: 'â, î',
    tr: 'â, î, û',
    vi: 'â, ê, ô',
  },
  '˘': { ro: 'ă', tr: 'ğ', vi: 'ă' },
  '˚': { sv: 'å', da: 'å', nb: 'å', cs: 'ů' },
  '˝': { hu: 'ő, ű' },
  '¨': {
    de: 'ä, ö, ü',
    fr: 'ë, ï, ü',
    es: 'ü',
    fi: 'ä, ö',
    sv: 'ä, ö',
    tr: 'ö, ü',
    nl: 'ë, ï',
  },
  '¸': { fr: 'ç', pt: 'ç', tr: 'ç, ş' },
  ˇ: { cs: 'č, ř, š, ž', sk: 'č, ď, š, ž' },
  '~': { es: 'ñ', pt: 'ã, õ', vi: 'ã, ẽ, ĩ, õ, ũ, ỹ' },
  '´': {
    pl: 'ć, ń, ó, ś, ź',
    vi: 'á, é, í, ó, ú, ý',
    nl: 'é',
    es: 'á, é, í, ó, ú',
    fr: 'é',
    pt: 'á, é, í, ó, ú',
  },
  '\u00a0': { fr: '«\u00a0…\u00a0»' },
  ß: { de: 'Straße' },
  ẞ: { de: 'STRAẞE' },
  і: { uk: 'і', be: 'і' },
  І: { uk: 'І', be: 'І' },
  '¡': { es: '¡Hola!' },
  '¿': { es: '¿Qué tal?' },
};
const regions: Record<string, string> = {
  en: 'GB',
  ru: 'RU',
  pl: 'PL',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  pt: 'PT',
  it: 'IT',
  ro: 'RO',
  he: 'IL',
  cs: 'CZ',
  sk: 'SK',
  tr: 'TR',
  vi: 'VN',
  nl: 'NL',
  sv: 'SE',
  da: 'DK',
  nb: 'NO',
  hu: 'HU',
  fi: 'FI',
  uk: 'UA',
  be: 'BY',
};
const currencyRegions: Record<string, string[]> = {
  $: ['US'],
  '£': ['GB'],
  '₽': ['RU'],
  '€': ['EU'],
};

const displayNames = Object.fromEntries(
  LANGUAGES.map((locale) => [
    locale,
    {
      language: new Intl.DisplayNames([locale], { type: 'language' }),
      region: new Intl.DisplayNames([locale], { type: 'region' }),
    },
  ]),
) as Record<Locale, { language: Intl.DisplayNames; region: Intl.DisplayNames }>;
const apostropheNames: Record<Locale, string> = {
  en: 'apostrophe',
  ru: 'апостроф',
  pl: 'apostrof',
  fr: 'apostrophe',
  de: 'Apostroph',
  es: 'apóstrofo',
  pt: 'apóstrofo',
  it: 'apostrofo',
  ro: 'apostrof',
  he: 'אפוסטרוף',
  tr: 'kesme işareti',
  nl: 'apostrof',
  vi: 'dấu nháy đơn',
  ar: 'فاصلة علوية',
};

export function enrichSymbolUsage(item: SymbolSearchItem): void {
  const quotes = quotePairs.filter(({ pair }) => pair.includes(item.symbol));
  const languageExamples = examples[item.symbol];
  const languages = [
    ...new Set([
      ...quotes.flatMap(({ languages }) => languages),
      ...Object.keys(languageExamples ?? {}),
      ...(item.symbol === '’' ? ['fr'] : []),
    ]),
  ];
  for (const locale of LANGUAGES) {
    const { language: languageNames, region: regionNames } =
      displayNames[locale];
    if (item.symbol === '’') {
      item.aliases[locale] = [
        ...(item.aliases[locale] ?? []),
        apostropheNames[locale],
      ];
    }
    if (locale === 'ru' && '«»‹›'.includes(item.symbol)) {
      item.aliases[locale] = [...(item.aliases[locale] ?? []), 'ёлочки'];
    }
    if (locale === 'ru' && '„“”‘’'.includes(item.symbol)) {
      item.aliases[locale] = [...(item.aliases[locale] ?? []), 'лапки'];
    }
    const sentences: string[] = [];
    if (quotes.length) {
      for (const { pair, languages } of quotes) {
        const role =
          pair[0] === pair[1]
            ? `${usageText.opening[locale]} / ${usageText.closing[locale]}`
            : pair[0] === item.symbol
              ? usageText.opening[locale]
              : usageText.closing[locale];
        sentences.push(
          `${role}: ${pair[0]}…${pair[1]} (${languages.map((l) => languageNames.of(l)).join(', ')}).`,
        );
      }
      if (item.symbol === '’') {
        sentences.push(usageText.apostrophe[locale]);
      }
      item.description[locale] = sentences.join(' ');
    }
    if (item.symbol === '`') {
      item.description[locale] = usageText.backtick[locale];
    }
    if (languageExamples) {
      const examplesText = Object.entries(languageExamples)
        .map(
          ([language, example]) => `${languageNames.of(language)}: ${example}`,
        )
        .join('; ');
      item.description[locale] +=
        ` ${usageText.example[locale]} — ${examplesText}.`;
    }
    item.tags[locale] = [
      ...new Set([
        ...(item.tags[locale] ?? []),
        ...languages.map((l) => languageNames.of(l)!),
        ...languages.flatMap((l) =>
          regions[l] ? [regionNames.of(regions[l])!] : [],
        ),
        ...(currencyRegions[item.symbol] ?? []).map((r) => regionNames.of(r)!),
      ]),
    ];
  }
}
