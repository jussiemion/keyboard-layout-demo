import {
  getServerUiLocale,
  getUiLocale,
  getInitialKeyboardLocale,
  localeBootstrap,
} from './i18n.ts';
import {
  getResolvedTheme,
  getServerResolvedTheme,
  themeBootstrap,
  type ResolvedTheme,
} from './theme.ts';
import type { UiLocale } from './messages.ts';
import {
  getPlatform,
  getServerPlatform,
  platformBootstrap,
  type Platform,
} from './platform.ts';

export const PREFERENCES_READY_EVENT = 'keyboard-layout-demo:preferences-ready';

// Inline critical CSS: a cached preference must never expose the static fallback.
export const preferencesGuardCss =
  'html[data-preferences-pending] .document-scroll-area { visibility: hidden; }';

// Stored preferences are read before the body can paint. Matching static
// markup stays visible; otherwise the typing page reveals its committed UI.
export const preferencesBootstrap = `${themeBootstrap}\n${localeBootstrap}\n${platformBootstrap}\n(() => {
  const root = document.documentElement;
  if (root.dataset.keyboardLocale !== '${getServerUiLocale()}' || root.dataset.uiLocale !== '${getServerUiLocale()}' || root.dataset.theme !== '${getServerResolvedTheme()}' || root.dataset.platform !== '${getServerPlatform()}') {
    root.dataset.preferencesPending = 'true';
  }
})();`;

export function revealInitialPreferences(
  locale: UiLocale,
  theme: ResolvedTheme,
  platform: Platform,
  keyboardLocale?: import('./keyboard-locales.ts').KeyboardLocale,
) {
  if (
    (keyboardLocale !== undefined &&
      keyboardLocale !== getInitialKeyboardLocale()) ||
    locale !== getUiLocale() ||
    theme !== getResolvedTheme() ||
    platform !== getPlatform()
  )
    return false;
  const root = document.documentElement;
  if (root.dataset.preferencesPending) {
    delete root.dataset.preferencesPending;
    window.dispatchEvent(new Event(PREFERENCES_READY_EVENT));
  }
  return true;
}
