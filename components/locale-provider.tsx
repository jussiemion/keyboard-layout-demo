'use client';

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  getServerUiLocale,
  getUiLocale,
  subscribeToUiLocale,
} from '@/lib/i18n';
import {
  getResolvedTheme,
  getServerResolvedTheme,
  subscribeToTheme,
  type ResolvedTheme,
} from '@/lib/theme';
import {
  getPlatform,
  getServerPlatform,
  subscribeToPlatform,
  type Platform,
} from '@/lib/platform';
import {
  formatMessage,
  messages,
  type Messages,
  type MessageKey,
  type UiLocale,
} from '@/lib/messages';

type LocaleContextValue = {
  uiLocale: UiLocale;
  theme: ResolvedTheme;
  platform: Platform;
  m: Messages;
  t: (key: MessageKey, values?: Record<string, string>) => string;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const uiLocale = useSyncExternalStore(
    subscribeToUiLocale,
    getUiLocale,
    getServerUiLocale,
  );
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getResolvedTheme,
    getServerResolvedTheme,
  );
  const platform = useSyncExternalStore(
    subscribeToPlatform,
    getPlatform,
    getServerPlatform,
  );
  const value = useMemo(
    () => ({
      uiLocale,
      theme,
      platform,
      m: messages[uiLocale],
      t: (key: MessageKey, values?: Record<string, string>) =>
        formatMessage(messages[uiLocale][key], values),
    }),
    [uiLocale, theme, platform],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocale requires LocaleProvider');
  }
  return value;
}
