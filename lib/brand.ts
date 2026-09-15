export const BRAND_ACCENT_LIGHT = '#fb7100';
export const BRAND_ACCENT_DARK = '#ffc799';

// Original polygon coordinates; the viewBox matches their exact outer bounds.
export const BRAND_SYMBOL_VIEW_BOX = '0 0 51.01 54.26';
export const BRAND_SYMBOL_PATH =
  'M5.05 13.78L19.81 24.18V50.24L14.52 46.51V26.92L0 16.68V0L5.05 3.56ZM28.15 22.59V46.12L31.2 43.93V24.18H31.21L51.01 10.21V16.68L36.48 26.92V46.51L31.2 50.24L28.15 52.39L25.5 54.26L22.85 52.39V22.59L8.13 12.21V5.74L25.5 17.99L51.01 0V6.47Z';

export function brandSymbolSvg(active: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_SYMBOL_VIEW_BOX}" fill="${active}"><path d="${BRAND_SYMBOL_PATH}"/></svg>\n`;
}
