import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import {
  BRAND_VIEW_BOX,
  BRAND_MUTED_LIGHT,
  BRAND_MUTED_DARK,
  BRAND_ACCENT_LIGHT,
  BRAND_ACCENT_DARK,
  SOLID_Y_PATH,
  brandSvg,
} from '../lib/brand';

export {
  BRAND_VIEW_BOX,
  BRAND_ACCENT_LIGHT,
  BRAND_ACCENT_DARK,
} from '../lib/brand';

export function BrandMarkIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={BRAND_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('text-primary shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <path d={SOLID_Y_PATH} />
    </svg>
  );
}

export function buildBrandFavicon(color: string, theme = 'vesper_light') {
  const muted = theme === 'vesper' ? BRAND_MUTED_DARK : BRAND_MUTED_LIGHT;
  return `data:image/svg+xml,${encodeURIComponent(brandSvg(color || BRAND_ACCENT_LIGHT, muted, false))}`;
}

export function themeBrandAccent(theme: 'vesper' | 'vesper_light') {
  return theme === 'vesper' ? BRAND_ACCENT_DARK : BRAND_ACCENT_LIGHT;
}
