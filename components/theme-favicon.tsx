'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { buildBrandFavicon } from '@/components/brand-mark';
import {
  getResolvedTheme,
  getServerResolvedTheme,
  subscribeToTheme,
} from '@/lib/theme';

function syncThemeFavicon(theme: string) {
  // Read the palette only after this theme has been applied to the document.
  if (document.documentElement.dataset.theme !== theme) {
    return;
  }
  const primaryColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim() || '#fb7100';
  const icon = buildBrandFavicon(primaryColor);
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (existing) {
    existing.type = 'image/svg+xml';
    existing.href = icon;
    return;
  }
  const created = document.createElement('link');
  created.rel = 'icon';
  created.type = 'image/svg+xml';
  created.href = icon;
  document.head.appendChild(created);
}

export function ThemeFavicon() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getResolvedTheme,
    getServerResolvedTheme,
  );
  useEffect(() => {
    syncThemeFavicon(theme);
  }, [theme]);
  return null;
}
