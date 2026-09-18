import terms from './symbol-localization-terms.json' with { type: 'json' };
import { UI_LOCALES, type UiLocale } from './messages.ts';

type Term = keyof typeof terms;
export type LocalizedSymbolNames = Record<UiLocale, string>;

// These names supplement CLDR; they are not inferred from the current UI language.
const namedSymbols: Record<string, Term> = {
  '₠': 'ecu',
  '₯': 'drachma',
  '₻': 'nordic-mark',
  '⃀': 'som',
  '⃁': 'riyal',
  '׳': 'geresh',
  '״': 'gershayim',
  '־': 'maqaf',
  '׃': 'sof-pasuq',
  'ְ': 'sheva',
  'ִ': 'hiriq',
  'ַ': 'patah',
  'ָ': 'qamats',
  'ֹ': 'holam',
  'ּ': 'dagesh',
  '❦': 'fleuron',
  '⁂': 'asterism',
  '‽': 'interrobang',
  '‱': 'permyriad',
  '№': 'numero',
  '¶': 'pilcrow',
  '§': 'section',
  '†': 'dagger',
  '‡': 'double-dagger',
  '←': 'left-arrow',
  '→': 'right-arrow',
  '↑': 'up-arrow',
  '↓': 'down-arrow',
  '∞': 'infinity',
  '∫': 'integral',
  '∬': 'double-integral',
  '∮': 'contour-integral',
  '∑': 'sum',
  '∏': 'product',
  '∂': 'partial',
  '∇': 'nabla',
  '∅': 'empty-set',
  '∈': 'element',
  '∉': 'not-element',
  '∩': 'intersection',
  '∪': 'union',
  '∀': 'forall',
  '∃': 'exists',
  '∄': 'not-exists',
  '≠': 'not-equal',
  '≈': 'approximately',
  '≤': 'less-equal',
  '≥': 'greater-equal',
  '⊥': 'perpendicular',
  '∥': 'parallel',
  '∠': 'angle',
  '√': 'square-root',
  '∛': 'cube-root',
};
const marks: Record<string, Term> = {
  '\u0300': 'grave',
  '\u0301': 'acute',
  '\u0302': 'circumflex',
  '\u0303': 'tilde',
  '\u0304': 'macron',
  '\u0306': 'breve',
  '\u0307': 'dot-above',
  '\u0308': 'diaeresis',
  '\u0309': 'hook-above',
  '\u030A': 'ring',
  '\u030B': 'double-acute',
  '\u030C': 'caron',
  '\u031B': 'horn',
  '\u0323': 'dot-below',
  '\u0326': 'comma-below',
  '\u0327': 'cedilla',
  '\u0328': 'ogonek',
};

const greekLetters: Record<string, Term> = Object.fromEntries(
  Array.from('αβγδεζηθικλμνξοπρςστυφχψω').map((symbol, index) => [
    symbol,
    (
      [
        'alpha',
        'beta',
        'gamma',
        'delta',
        'epsilon',
        'zeta',
        'eta',
        'theta',
        'iota',
        'kappa',
        'lambda',
        'mu',
        'nu',
        'xi',
        'omicron',
        'pi',
        'rho',
        'final-sigma',
        'sigma',
        'tau',
        'upsilon',
        'phi',
        'chi',
        'psi',
        'omega',
      ] as Term[]
    )[index],
  ]),
);
const mathStyles: Term[] = [
  'sans-serif',
  'double-struck',
  'monospace',
  'bold',
  'italic',
  'script',
  'fraktur',
];

function localize(render: (locale: UiLocale) => string): LocalizedSymbolNames {
  return Object.fromEntries(
    UI_LOCALES.map((locale) => [locale, render(locale)]),
  ) as LocalizedSymbolNames;
}

export function supplementalSymbolNames(
  symbol: string,
  unicodeName?: string,
): LocalizedSymbolNames | undefined {
  const term = namedSymbols[symbol] ?? marks[symbol];
  if (term) {
    return terms[term];
  }
  if (symbol === 'Ѣ' || symbol === 'ѣ') {
    const letterCase = symbol === 'Ѣ' ? 'upper' : 'lower';
    return localize(
      (locale) => `${terms.yat[locale]} (${terms[letterCase][locale]})`,
    );
  }
  const points = Array.from(symbol);
  if (points.length !== 1) {
    return undefined;
  }
  const code = symbol.codePointAt(0)!;
  if (code >= 0x2800 && code <= 0x28ff) {
    if (code === 0x2800) {
      return terms['braille-blank'];
    }
    const dots = Array.from({ length: 8 }, (_, index) => index)
      .filter((index) => (code - 0x2800) & (1 << index))
      .map((index) => index + 1)
      .join('');
    return localize((locale) => `${terms.braille[locale]}: ${dots}`);
  }
  // Canonical decomposition preserves the actual accents, including stacked ones.
  // Unsupported marks stay in the audit instead of receiving a guessed name.
  if (
    code >= 0x1d400 &&
    code <= 0x1d7ff &&
    unicodeName?.startsWith('mathematical ')
  ) {
    const base = symbol.normalize('NFKD');
    const baseNames =
      base !== symbol ? supplementalSymbolNames(base) : undefined;
    const digit = /^[0-9]$/.test(base);
    const styles = mathStyles.filter((style) => unicodeName.includes(style));
    if ((baseNames || digit) && styles.length) {
      return localize((locale) =>
        [
          terms.math[locale],
          baseNames?.[locale] ?? base,
          ...styles.map((style) => terms[style][locale]),
        ].join('; '),
      );
    }
  }
  const [greekBase, ...greekAccents] = Array.from(symbol.normalize('NFD'));
  const greekTerm = greekLetters[greekBase.toLowerCase()];
  if (greekTerm && greekAccents.every((accent) => marks[accent])) {
    const letterCase =
      greekBase === greekBase.toUpperCase() ? 'upper' : 'lower';
    return localize((locale) =>
      [
        `${terms[greekTerm][locale]} (${terms[letterCase][locale]})`,
        ...greekAccents.map((accent) => terms[marks[accent]][locale]),
      ].join('; '),
    );
  }
  if (!(code <= 0x024f || (code >= 0x1e00 && code <= 0x1eff))) {
    return undefined;
  }
  const [base, ...accents] = Array.from(symbol.normalize('NFD'));
  if (!/^[a-z]$/i.test(base) || !accents.every((accent) => marks[accent])) {
    return undefined;
  }
  const letterCase = base === base.toUpperCase() ? 'upper' : 'lower';
  return localize((locale) =>
    [
      `${terms.latin[locale]} ${base} (${terms[letterCase][locale]})`,
      ...accents.map((accent) => terms[marks[accent]][locale]),
    ].join('; '),
  );
}

export const supplementalSymbolAliases: Record<
  string,
  Partial<Record<UiLocale, string[]>>
> = {
  '״': {
    ru: [
      'гершайим',
      'гершайм',
      'гершейм',
      'еврейские кавычки',
      'двойной гереш',
    ],
    en: ['gershaim', 'gershayim', 'Hebrew double quotation mark'],
    he: ['גרשיים', 'גרש כפול'],
  },
  '׳': {
    ru: ['гереш', 'еврейский апостроф'],
    en: ['Hebrew apostrophe'],
    he: ['גרש'],
  },
  '־': {
    ru: ['макаф', 'макеф', 'еврейский дефис'],
    en: ['maqaf', 'makaf', 'maqqef'],
  },
  '\u0301': {
    ru: ['ударение', 'знак ударения', 'острое ударение'],
    en: ['stress mark'],
  },
  '\u0308': {
    ru: ['умлаут', 'две точки', 'диэрезис'],
    en: ['umlaut', 'diaeresis', 'trema'],
  },
};
