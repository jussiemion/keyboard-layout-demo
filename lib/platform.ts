export const PLATFORMS = ['linux', 'windows', 'macos'] as const;
export type Platform = (typeof PLATFORMS)[number];
export const PLATFORM_STORAGE_KEY = 'keyboard-layout-demo.platform';
export const PLATFORM_CHANGE_EVENT = 'keyboard-layout-demo:platform-change';
export const platformNames: Record<Platform, string> = {
  linux: 'Linux',
  windows: 'Windows',
  macos: 'macOS',
};

type PlatformSignals = {
  userAgentData?: { platform?: string };
  platform?: string;
  userAgent?: string;
  maxTouchPoints?: number;
};

// Self-contained so the same detector can run in the head before hydration.
export function detectPlatform(browser: PlatformSignals): Platform {
  const agent = browser.userAgent ?? '';
  const legacy = browser.platform ?? '';
  if (
    /Android|iPhone|iPad|iPod/i.test(agent) ||
    (/Mac/i.test(legacy) && (browser.maxTouchPoints ?? 0) > 1)
  )
    return 'linux';
  for (const value of [browser.userAgentData?.platform ?? '', legacy]) {
    if (/^win/i.test(value)) return 'windows';
    if (/^mac/i.test(value)) return 'macos';
    if (/^linux/i.test(value)) return 'linux';
  }
  if (/Windows|Win32|Win64/i.test(agent)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(agent)) return 'macos';
  return 'linux';
}

export function parsePlatform(value: unknown): Platform | null {
  return PLATFORMS.includes(value as Platform) ? (value as Platform) : null;
}

function getPreference(): Platform | null {
  const applied = document.documentElement.dataset.platformPreference;
  if (applied) return parsePlatform(applied);
  try {
    return parsePlatform(localStorage.getItem(PLATFORM_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getPlatform(): Platform {
  return (
    parsePlatform(document.documentElement.dataset.platform) ??
    getPreference() ??
    detectPlatform(navigator)
  );
}

export function getServerPlatform(): Platform {
  return 'linux';
}

function applyPlatform(preference: Platform | null) {
  const root = document.documentElement;
  root.dataset.platformPreference = preference ?? 'auto';
  root.dataset.platform = preference ?? detectPlatform(navigator);
}

export function setPlatform(value: string) {
  const platform = parsePlatform(value);
  if (!platform) return;
  applyPlatform(platform);
  try {
    localStorage.setItem(PLATFORM_STORAGE_KEY, platform);
  } catch {
    /* Selection still works when local storage is unavailable. */
  }
  window.dispatchEvent(new Event(PLATFORM_CHANGE_EVENT));
}

export function subscribeToPlatform(onChange: () => void) {
  const update = () => {
    applyPlatform(getPreference());
    onChange();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== PLATFORM_STORAGE_KEY && event.key !== null) return;
    applyPlatform(parsePlatform(event.newValue));
    onChange();
  };
  window.addEventListener(PLATFORM_CHANGE_EVENT, update);
  window.addEventListener('storage', storageChanged);
  update();
  return () => {
    window.removeEventListener(PLATFORM_CHANGE_EVENT, update);
    window.removeEventListener('storage', storageChanged);
  };
}

export const platformBootstrap = `(() => {
  let preference = null;
  try {
    const saved = localStorage.getItem('${PLATFORM_STORAGE_KEY}');
    if (${JSON.stringify(PLATFORMS)}.includes(saved)) preference = saved;
  } catch {}
  const root = document.documentElement;
  root.dataset.platformPreference = preference || 'auto';
  root.dataset.platform = preference || (${detectPlatform.toString()})(navigator);
})();`;
