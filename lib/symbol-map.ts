import {
  accents,
  layout,
  type Action,
  type LayoutKey,
} from './typing-engine.ts';

export type SymbolOverride = {
  primary?: Action;
  secondary?: Action;
  quick?: boolean;
};
export type SymbolMap = Record<string, SymbolOverride>;
export const BASE_MAP = 'birman-3.9';
export const MAX_SYMBOL_LENGTH = 16;
const physicalKeys = new Set(layout.map((entry) => entry.key));

export function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function validAction(value: unknown): value is Action {
  if (!record(value)) {
    return false;
  }
  const keys = Object.keys(value);
  if (!keys.length) {
    return true;
  }
  if (keys.length !== 1) {
    return false;
  }
  if (keys[0] === 'dead') {
    return typeof value.dead === 'string' && Object.hasOwn(accents, value.dead);
  }
  return (
    keys[0] === 'text' &&
    typeof value.text === 'string' &&
    Array.from(value.text).length > 0 &&
    Array.from(value.text).length <= MAX_SYMBOL_LENGTH &&
    !/[\p{Cc}\p{Cs}\u202a-\u202e\u2066-\u2069]/u.test(value.text)
  );
}

export function validSymbolMap(value: unknown): value is SymbolMap {
  if (!record(value) || Object.keys(value).length > layout.length) {
    return false;
  }
  return Object.entries(value).every(([key, entry]) => {
    if (!physicalKeys.has(key) || !record(entry)) {
      return false;
    }
    return Object.entries(entry).every(([field, action]) =>
      field === 'quick'
        ? typeof action === 'boolean'
        : (field === 'primary' || field === 'secondary') && validAction(action),
    );
  });
}

/** Physical XKB positions are shared by the web and desktop implementations. */
export function resolveSymbolMap(overrides: SymbolMap = {}): LayoutKey[] {
  return layout.map((entry) => ({ ...entry, ...overrides[entry.key] }));
}
