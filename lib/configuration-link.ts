import { UI_LOCALES, type UiLocale } from './messages.ts';
import { KEYBOARD_LOCALES, type KeyboardLocale } from './keyboard-locales.ts';
import { PLATFORMS, type Platform } from './platform.ts';
import type { ThemePreference } from './theme.ts';
import { defaultLanguageMapping, type UserSettings } from './settings.ts';
import { BASE_MAP, record, validSymbolMap } from './symbol-map.ts';

export type DisplayPreferences = {
  uiLocale: UiLocale;
  keyboardLocale: KeyboardLocale;
  theme: ThemePreference;
  platform: Platform;
};
export type Configuration = {
  format: 'yushkevich-layout';
  version: 1;
  base: typeof BASE_MAP;
  settings: UserSettings;
  preferences: DisplayPreferences;
};
export const MAX_CONFIG_LINK_LENGTH = 32768;

export function configuration(
  settings: UserSettings,
  preferences: DisplayPreferences,
): Configuration {
  return {
    format: 'yushkevich-layout',
    version: 1,
    base: BASE_MAP,
    settings: {
      version: 1,
      languageMapping: settings.languageMapping ?? defaultLanguageMapping(),
      symbolMap: settings.symbolMap ?? {},
    },
    preferences,
  };
}

function onlyKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).every((key) => keys.includes(key));
}

/** Import is strict and atomic. Never silently apply a partial or future profile. */
export function validateConfiguration(value: unknown): Configuration {
  const fail = () => {
    throw new Error('Invalid configuration');
  };
  if (
    !record(value) ||
    !onlyKeys(value, [
      'format',
      'version',
      'base',
      'settings',
      'preferences',
    ]) ||
    value.format !== 'yushkevich-layout' ||
    value.version !== 1 ||
    value.base !== BASE_MAP
  ) {
    return fail();
  }
  const { settings, preferences } = value;
  if (
    !record(settings) ||
    !onlyKeys(settings, ['version', 'languageMapping', 'symbolMap']) ||
    settings.version !== 1 ||
    !validSymbolMap(settings.symbolMap)
  ) {
    return fail();
  }
  const mapping = settings.languageMapping;
  if (!record(mapping) || !onlyKeys(mapping, ['order', 'slots'])) {
    return fail();
  }
  for (const [field, length] of [
    ['order', 2],
    ['slots', 4],
  ] as const) {
    const values = mapping[field];
    if (
      !Array.isArray(values) ||
      values.length !== length ||
      !values.every((locale) => KEYBOARD_LOCALES.includes(locale))
    ) {
      return fail();
    }
  }
  if ((mapping.order as string[])[0] === (mapping.order as string[])[1]) {
    return fail();
  }
  if (
    !record(preferences) ||
    !onlyKeys(preferences, [
      'uiLocale',
      'keyboardLocale',
      'theme',
      'platform',
    ]) ||
    !UI_LOCALES.includes(preferences.uiLocale as UiLocale) ||
    !KEYBOARD_LOCALES.includes(preferences.keyboardLocale as KeyboardLocale) ||
    !PLATFORMS.includes(preferences.platform as Platform) ||
    !['system', 'vesper', 'vesper_light'].includes(preferences.theme as string)
  ) {
    return fail();
  }
  return structuredClone(value) as Configuration;
}

/** UTF-8 JSON in the fragment: no network request and no external URL fetching. */
export function encodeConfiguration(
  value: Configuration,
  baseUrl: string,
): string {
  const data = JSON.stringify(validateConfiguration(value));
  const bytes = new TextEncoder().encode(data);
  const encoded = btoa(
    Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''),
  )
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '');
  const url = new URL(baseUrl);
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error('Invalid URL');
  }
  url.search = '';
  url.hash = `config=${encoded}`;
  const result = url.href;
  if (result.length > MAX_CONFIG_LINK_LENGTH) {
    throw new Error('Configuration too large');
  }
  return result;
}

export function decodeConfiguration(link: string): Configuration {
  if (link.length > MAX_CONFIG_LINK_LENGTH) {
    throw new Error('Configuration too large');
  }
  const url = new URL(link.trim());
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error('Invalid URL');
  }
  const match = /^#config=([A-Za-z0-9_-]+)$/u.exec(url.hash);
  if (!match) {
    throw new Error('Invalid configuration fragment');
  }
  const binary = atob(match[1].replaceAll('-', '+').replaceAll('_', '/'));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return validateConfiguration(JSON.parse(json));
}
