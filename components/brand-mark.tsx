import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import {
  BRAND_ACCENT_LIGHT,
  BRAND_ACCENT_DARK,
  BRAND_SYMBOL_PATH,
  BRAND_SYMBOL_VIEW_BOX,
  brandSymbolSvg,
} from '../lib/brand';

export {
  BRAND_SYMBOL_VIEW_BOX as BRAND_VIEW_BOX,
  BRAND_ACCENT_LIGHT,
  BRAND_ACCENT_DARK,
} from '../lib/brand';

export function BrandMarkIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={BRAND_SYMBOL_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('text-primary shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <path d={BRAND_SYMBOL_PATH} />
    </svg>
  );
}

export function buildBrandFavicon(color: string) {
  return `data:image/svg+xml,${encodeURIComponent(brandSymbolSvg(color || BRAND_ACCENT_LIGHT))}`;
}

export function themeBrandAccent(theme: 'vesper' | 'vesper_light') {
  return theme === 'vesper' ? BRAND_ACCENT_DARK : BRAND_ACCENT_LIGHT;
}
