/** Remapped Caps retains its physical code (e.g. F24), but its key is CapsLock. */
export function keyboardEventCode(event: {
  code: string;
  key: string;
}): string {
  return event.key === 'CapsLock' ? 'CapsLock' : event.code;
}

/** Decide whether an unfocused trainer should receive a key press. */
export function capturesWindowKey(
  event: {
    key: string;
    code: string;
    ctrlKey: boolean;
    metaKey: boolean;
    isComposing: boolean;
    defaultPrevented: boolean;
  },
  blocked: boolean,
  onControl: boolean,
): boolean {
  if (
    blocked ||
    event.defaultPrevented ||
    event.isComposing ||
    event.ctrlKey ||
    event.metaKey
  )
    return false;
  if (onControl && (event.key === ' ' || event.key === 'Enter')) return false;
  return (
    /^(Alt|Shift)(Left|Right)$/.test(event.code) ||
    keyboardEventCode(event) === 'CapsLock' ||
    event.key === 'Escape' ||
    Array.from(event.key).length === 1
  );
}
