export const WAITLIST_PLATFORMS = ['Windows', 'macOS', 'Linux'] as const;
export type WaitlistPlatform = (typeof WAITLIST_PLATFORMS)[number];

export function normalizeTelegramUsername(value: string) {
  const username = value.trim().replace(/^@/, '');
  return /^[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(username) ? username : null;
}
