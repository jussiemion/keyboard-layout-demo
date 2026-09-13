import type { KeyInput, KeyboardLocale } from './typing-engine.ts';

export const LANGUAGE_SWITCH_MARK = 'S0';

export const LANGUAGE_ORDER: readonly KeyboardLocale[] = [
  'ru',
  'en',
  'pl',
  'fr',
  'de',
  'es',
  'pt',
  'it',
  'ro',
];
export const LANGUAGE_SLOT_CODES = [
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
] as const;
export const LANGUAGE_SLOTS: readonly KeyboardLocale[] = [
  'en',
  'ru',
  'pl',
  'pt',
];
export function defaultLanguageConfig(native: KeyboardLocale) {
  const order: readonly KeyboardLocale[] =
    native === 'en' ? ['en', 'ru'] : ['en', native];
  const candidates: readonly KeyboardLocale[] = [
    'pl',
    'pt',
    'es',
    'de',
    'fr',
    'it',
    'ro',
    'ru',
    'en',
  ];
  return {
    order,
    slots: candidates.filter((locale) => !order.includes(locale)).slice(0, 4),
  };
}
export function languageSlotForKey(code: string, slots = LANGUAGE_SLOTS) {
  const index = LANGUAGE_SLOT_CODES.findIndex((value) => value === code);
  return index < 0
    ? undefined
    : { label: `S${index + 1}`, locale: slots[index] };
}
export type LanguageResult = { prevent: boolean; locale?: KeyboardLocale };

/** Caps is a tap/chord gesture with no clock and no changes to host input sources. */
export class LanguageSwitchController {
  held = new Set<string>();
  private consumed = new Set<string>();
  private active = false;
  private tapEligible = false;
  private lastPair: KeyboardLocale | undefined;

  rememberLanguage(locale: KeyboardLocale, order: readonly KeyboardLocale[]) {
    if (order.includes(locale)) {
      this.lastPair = locale;
    }
  }

  nextLanguage(locale: KeyboardLocale, order: readonly KeyboardLocale[]) {
    if (order.includes(locale)) {
      this.lastPair = order[(order.indexOf(locale) + 1) % order.length];
    } else if (!this.lastPair || !order.includes(this.lastPair)) {
      this.lastPair = order[0];
    }
    return this.lastPair;
  }

  reset() {
    this.held.clear();
    this.consumed.clear();
    this.active = false;
    this.tapEligible = false;
  }

  handle(
    event: KeyInput,
    locale: KeyboardLocale,
    order = LANGUAGE_SLOTS,
    slots = LANGUAGE_SLOTS,
  ): LanguageResult {
    if (event.synthetic) {
      return { prevent: false };
    }
    if (order.includes(locale)) {
      this.lastPair = locale;
    }
    const { code, down } = event;
    if (event.repeat || down === this.held.has(code)) {
      return {
        prevent:
          this.consumed.has(code) || (code === 'CapsLock' && this.active),
      };
    }
    const alone = this.held.size === 0;
    if (down) {
      this.held.add(code);
    } else {
      this.held.delete(code);
    }
    const modified =
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altGraph ||
      Array.from(this.held).some((key) =>
        /^(Alt|Shift|Control|Meta)(Left|Right)$/.test(key),
      );
    if (code === 'CapsLock') {
      if (down) {
        this.active = alone && !modified;
        this.tapEligible = this.active;
        if (this.active) {
          this.consumed.add(code);
        }
        return { prevent: this.active };
      }
      const prevent = this.consumed.delete(code);
      const next =
        this.active && this.tapEligible && !modified && order.length
          ? this.nextLanguage(locale, order)
          : undefined;
      this.active = false;
      this.tapEligible = false;
      return { prevent, locale: next };
    }
    if (!down) {
      return { prevent: this.consumed.delete(code) };
    }
    if (this.active) {
      this.tapEligible = false;
      this.consumed.add(code);
      const slot = LANGUAGE_SLOT_CODES.findIndex((key) => key === code);
      if (slot >= 0) {
        this.consumed.add(code);
        return { prevent: true, locale: slots[slot] };
      }
      return { prevent: true };
    }
    return { prevent: false };
  }
}
