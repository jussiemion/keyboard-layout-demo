import type { Locale } from './typing-engine.ts';
import type { SymbolSearchItem } from './symbol-search-index.ts';

export const SYMBOL_CATEGORIES = [
  'currency',
  'diacritics',
  'math',
  'punctuation',
  'arrows',
  'letters',
  'keyboard',
  'other',
] as const;
export type SymbolCategory = (typeof SYMBOL_CATEGORIES)[number];

export const symbolCategoryNames: Record<
  Locale,
  Record<SymbolCategory, string>
> = {
  tr: {
    currency: 'Para birimleri',
    diacritics: 'Aksan işaretleri',
    math: 'Matematik',
    punctuation: 'Noktalama ve boşluklar',
    arrows: 'Oklar',
    letters: 'Harfler',
    keyboard: 'Klavye simgeleri',
    other: 'Diğer simgeler',
  },
  nl: {
    currency: 'Valuta',
    diacritics: 'Diakritische tekens',
    math: 'Wiskunde',
    punctuation: 'Leestekens en spaties',
    arrows: 'Pijlen',
    letters: 'Letters',
    keyboard: 'Toetsenbordsymbolen',
    other: 'Andere symbolen',
  },
  vi: {
    currency: 'Tiền tệ',
    diacritics: 'Dấu phụ',
    math: 'Toán học',
    punctuation: 'Dấu câu và khoảng trắng',
    arrows: 'Mũi tên',
    letters: 'Chữ cái',
    keyboard: 'Ký hiệu bàn phím',
    other: 'Ký hiệu khác',
  },
  ar: {
    currency: 'العملات',
    diacritics: 'العلامات الإضافية',
    math: 'الرياضيات',
    punctuation: 'الترقيم والمسافات',
    arrows: 'الأسهم',
    letters: 'الحروف',
    keyboard: 'رموز لوحة المفاتيح',
    other: 'رموز أخرى',
  },

  en: {
    currency: 'Currencies',
    diacritics: 'Diacritics',
    math: 'Mathematics',
    punctuation: 'Punctuation and spaces',
    arrows: 'Arrows',
    letters: 'Letters',
    keyboard: 'Keyboard symbols',
    other: 'Other symbols',
  },
  ru: {
    currency: 'Валюты',
    diacritics: 'Диакритические знаки',
    math: 'Математические символы',
    punctuation: 'Пунктуация и пробелы',
    arrows: 'Стрелки',
    letters: 'Буквы',
    keyboard: 'Клавиатурные символы',
    other: 'Другие символы',
  },
  pl: {
    currency: 'Waluty',
    diacritics: 'Znaki diakrytyczne',
    math: 'Symbole matematyczne',
    punctuation: 'Interpunkcja i spacje',
    arrows: 'Strzałki',
    letters: 'Litery',
    keyboard: 'Symbole klawiatury',
    other: 'Inne symbole',
  },
  fr: {
    currency: 'Devises',
    diacritics: 'Signes diacritiques',
    math: 'Symboles mathématiques',
    punctuation: 'Ponctuation et espaces',
    arrows: 'Flèches',
    letters: 'Lettres',
    keyboard: 'Symboles du clavier',
    other: 'Autres symboles',
  },
  de: {
    currency: 'Währungen',
    diacritics: 'Diakritische Zeichen',
    math: 'Mathematische Zeichen',
    punctuation: 'Satzzeichen und Leerzeichen',
    arrows: 'Pfeile',
    letters: 'Buchstaben',
    keyboard: 'Tastatursymbole',
    other: 'Weitere Symbole',
  },
  es: {
    currency: 'Monedas',
    diacritics: 'Signos diacríticos',
    math: 'Símbolos matemáticos',
    punctuation: 'Puntuación y espacios',
    arrows: 'Flechas',
    letters: 'Letras',
    keyboard: 'Símbolos del teclado',
    other: 'Otros símbolos',
  },
  pt: {
    currency: 'Moedas',
    diacritics: 'Sinais diacríticos',
    math: 'Símbolos matemáticos',
    punctuation: 'Pontuação e espaços',
    arrows: 'Setas',
    letters: 'Letras',
    keyboard: 'Símbolos do teclado',
    other: 'Outros símbolos',
  },
  it: {
    currency: 'Valute',
    diacritics: 'Segni diacritici',
    math: 'Simboli matematici',
    punctuation: 'Punteggiatura e spazi',
    arrows: 'Frecce',
    letters: 'Lettere',
    keyboard: 'Simboli della tastiera',
    other: 'Altri simboli',
  },
  ro: {
    currency: 'Valute',
    diacritics: 'Semne diacritice',
    math: 'Simboluri matematice',
    punctuation: 'Punctuație și spații',
    arrows: 'Săgeți',
    letters: 'Litere',
    keyboard: 'Simboluri de tastatură',
    other: 'Alte simboluri',
  },
  he: {
    currency: 'מטבעות',
    diacritics: 'סימנים דיאקריטיים',
    math: 'סימנים מתמטיים',
    punctuation: 'פיסוק ורווחים',
    arrows: 'חצים',
    letters: 'אותיות',
    keyboard: 'סמלי מקלדת',
    other: 'סימנים אחרים',
  },
};

export function symbolCategory(item: SymbolSearchItem): SymbolCategory {
  if (item.bindings.some((binding) => binding.finishWithSpace)) {
    return 'diacritics';
  }
  if ('$€£₽¢'.includes(item.symbol)) {
    return 'currency';
  }
  if (
    [
      '¹',
      '²',
      '³',
      '¹⁄₂',
      '¹⁄₃',
      '¹⁄₄',
      '‰',
      '≈',
      '≠',
      '±',
      '−',
      '×',
      '·',
      '∞',
      '°',
      '⌀',
      '′',
      '″',
    ].includes(item.symbol)
  ) {
    return 'math';
  }
  if ('←→↑↓'.includes(item.symbol)) {
    return 'arrows';
  }
  if ('⌘⌥⌃⇧'.includes(item.symbol)) {
    return 'keyboard';
  }
  if (/^\p{L}+$/u.test(item.symbol)) {
    return 'letters';
  }
  if ('«»‹›„“”‘’—–…[]{}¡¿§#•\u00a0'.includes(item.symbol)) {
    return 'punctuation';
  }
  return 'other';
}

// Search groups follow their best result; matches retain their rank within each group.
// The empty query uses a stable catalog order instead of a language-dependent first match.
export function groupSymbolSearchResults<T extends { item: SymbolSearchItem }>(
  results: readonly T[],
  searching: boolean,
) {
  const groups = new Map<SymbolCategory, T[]>();
  for (const result of results) {
    const category = symbolCategory(result.item);
    const group = groups.get(category) ?? [];
    group.push(result);
    groups.set(category, group);
  }
  const order = searching ? [...groups.keys()] : SYMBOL_CATEGORIES;
  return order.flatMap((category) => {
    const matches = groups.get(category);
    return matches?.length ? [{ category, matches }] : [];
  });
}
