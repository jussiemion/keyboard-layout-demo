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
