import { KEYBOARD_LOCALES, type KeyboardLocale } from './keyboard-locales.ts';
import { validSymbolMap, type SymbolMap } from './symbol-map.ts';
import { defaultLanguageConfig } from './language-switching.ts';

export type LanguageMapping = {
  order: readonly [KeyboardLocale, KeyboardLocale];
  slots: readonly [
    KeyboardLocale,
    KeyboardLocale,
    KeyboardLocale,
    KeyboardLocale,
  ];
};
export type UserSettings = {
  version: 1;
  languageMapping: LanguageMapping | null;
  symbolMap?: SymbolMap;
  keyboardLocale?: KeyboardLocale;
};

export const SETTINGS_STORAGE_KEY = 'keyboard-layout-demo.settings';
export const SETTINGS_CHANGE_EVENT = 'keyboard-layout-demo:settings-change';
export const DEFAULT_SETTINGS: UserSettings = {
  version: 1,
  languageMapping: null,
};

export function defaultLanguageMapping(): LanguageMapping {
  const { order, slots } = defaultLanguageConfig();
  return {
    order: [order[0], order[1]],
    slots: [slots[0], slots[1], slots[2], slots[3]],
  };
}

function languages(value: unknown, length: number): value is KeyboardLocale[] {
  return (
    Array.isArray(value) &&
    value.length === length &&
    value.every((locale) => KEYBOARD_LOCALES.includes(locale))
  );
}

/** Invalid or future data must never leave the language controller without a pair. */
export function parseSettings(raw: string | null): UserSettings {
  if (!raw) {
    return DEFAULT_SETTINGS;
  }
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) {
      return DEFAULT_SETTINGS;
    }
    const mapping = data.languageMapping;
    const valid =
      mapping &&
      languages(mapping.order, 2) &&
      mapping.order[0] !== mapping.order[1] &&
      languages(mapping.slots, 4);
    return {
      version: 1,
      ...(KEYBOARD_LOCALES.includes(data.keyboardLocale)
        ? { keyboardLocale: data.keyboardLocale }
        : {}),
      ...(validSymbolMap(data.symbolMap) ? { symbolMap: data.symbolMap } : {}),
      languageMapping: valid
        ? {
            order: [mapping.order[0], mapping.order[1]],
            slots: [
              mapping.slots[0],
              mapping.slots[1],
              mapping.slots[2],
              mapping.slots[3],
            ],
          }
        : null,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

let snapshot: UserSettings | undefined;
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  if (!snapshot) {
    try {
      snapshot = parseSettings(localStorage.getItem(SETTINGS_STORAGE_KEY));
    } catch {
      snapshot = DEFAULT_SETTINGS;
    }
  }
  return snapshot;
}
export function getServerSettings() {
  return DEFAULT_SETTINGS;
}

/** Apply even when storage is blocked; the caller reports session-only persistence. */
export function saveSettings(settings: UserSettings): boolean {
  const raw = JSON.stringify(settings);
  snapshot = parseSettings(raw);
  let persisted = true;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    persisted = false;
  }
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  return persisted;
}

export function subscribeToSettings(onChange: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== SETTINGS_STORAGE_KEY && event.key !== null) {
      return;
    }
    snapshot = parseSettings(event.key === null ? null : event.newValue);
    onChange();
  };
  window.addEventListener(SETTINGS_CHANGE_EVENT, onChange);
  window.addEventListener('storage', storageChanged);
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', storageChanged);
  };
}
