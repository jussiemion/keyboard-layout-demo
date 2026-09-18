export function symbolPreview(symbol: string) {
  if (/^\p{M}/u.test(symbol)) {
    return `◌${symbol}`;
  }
  return /^\p{Z}+$/u.test(symbol) ? '␣' : symbol;
}

export function unicodeLabel(symbol: string) {
  return Array.from(
    symbol,
    (char) =>
      `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
  ).join(' ');
}

// CLDR annotations omit VS16 in keycap keys; selections use fully qualified emoji.
export function qualifyEmojiKeycap(symbol: string) {
  return symbol.replace(/^([#*0-9])\u20e3$/u, '$1\ufe0f\u20e3');
}

export function symbolFontKind(symbol: string) {
  if (/^[\u20e2\u20e3]/u.test(symbol)) {
    return 'symbols2';
  }
  if (symbol.startsWith('\u20e0')) {
    return 'symbols';
  }
  if (/^[\u20d0-\u20ef]/u.test(symbol)) {
    return 'math';
  }
  return undefined;
}
