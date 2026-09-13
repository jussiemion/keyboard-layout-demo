export type ThemePreference = 'system' | 'vesper' | 'vesper_light';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export const THEME_STORAGE_KEY = 'keyboard-layout-demo.theme';
const THEME_CHANGE_EVENT = 'keyboard-layout-demo:theme-change';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function parsePreference(value: unknown): ThemePreference {
  return value === 'vesper' || value === 'vesper_light' ? value : 'system';
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  return preference === 'system'
    ? prefersDark
      ? 'vesper'
      : 'vesper_light'
    : preference;
}

// Runs in the document head before paint. Only fixed application code is inlined.
// CSS media queries also supply the correct system palette without JavaScript.
export const themeBootstrap = `(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (saved === 'vesper' || saved === 'vesper_light') preference = saved;
  } catch {}
  const theme = preference === 'system'
    ? (matchMedia('${COLOR_SCHEME_QUERY}').matches ? 'vesper' : 'vesper_light')
    : preference;
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'vesper');
})();`;

export function getThemePreference(): ThemePreference {
  const applied = document.documentElement.dataset.themePreference;
  if (applied) {
    return parsePreference(applied);
  }
  try {
    return parsePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function getServerThemePreference(): ThemePreference {
  return 'system';
}

export function getResolvedTheme(): ResolvedTheme {
  return resolveTheme(
    getThemePreference(),
    window.matchMedia(COLOR_SCHEME_QUERY).matches,
  );
}

export function getServerResolvedTheme(): ResolvedTheme {
  return 'vesper_light';
}

function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(
    preference,
    window.matchMedia(COLOR_SCHEME_QUERY).matches,
  );
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'vesper');
}

export function setThemePreference(value: string) {
  const preference = parsePreference(value);
  applyTheme(preference);
  try {
    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    /* In private/restricted contexts, the choice still works in this tab. */
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToTheme(onChange: () => void) {
  const query = window.matchMedia(COLOR_SCHEME_QUERY);
  const update = () => {
    applyTheme(getThemePreference());
    onChange();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) {
      return;
    }
    applyTheme(parsePreference(event.newValue));
    onChange();
  };
  query.addEventListener('change', update);
  window.addEventListener(THEME_CHANGE_EVENT, update);
  window.addEventListener('storage', storageChanged);
  update();
  return () => {
    query.removeEventListener('change', update);
    window.removeEventListener(THEME_CHANGE_EVENT, update);
    window.removeEventListener('storage', storageChanged);
  };
}
