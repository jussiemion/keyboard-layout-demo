import { baseKey, KEYBOARD_LOCALES, keyMap } from './typing-engine.ts';

const ordinaryC = new Set(
  KEYBOARD_LOCALES.flatMap((locale) => [
    baseKey('KeyC', locale),
    baseKey('KeyC', locale, false, true),
  ]),
);

export type NativeLayoutEvent = {
  code: string;
  key: string;
  isTrusted: boolean;
  isComposing: boolean;
  repeat: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
};

/** Observe raw browser input, never the demo's generated symbols or OS identity. */
export class NativeLayoutDetector {
  private alt: string | null = null;
  private taps = 0;
  private altUsed = false;
  private evidence = new Set<string>();
  private detected = false;

  interrupt() {
    this.alt = null;
    this.taps = 0;
    this.altUsed = false;
  }

  dismiss() {
    this.interrupt();
    this.evidence.clear();
    this.detected = false;
  }

  observe(
    event: NativeLayoutEvent,
    down: boolean,
  ): 'detected' | 'inactive' | null {
    if (!event.isTrusted) return null;
    if (event.isComposing || event.ctrlKey || event.metaKey || event.shiftKey) {
      this.interrupt();
      return null;
    }
    if (event.repeat) return null;
    if (/^Alt(Left|Right)$/.test(event.code)) {
      // Native AltGr/Option chords alone are not evidence of this layout.
      if (event.key !== 'Alt') {
        this.interrupt();
      } else if (down) {
        if (this.alt !== null) this.interrupt();
        else {
          this.alt = event.code;
          this.altUsed = false;
        }
      } else if (this.alt === event.code) {
        this.alt = null;
        if (!this.altUsed) this.taps = Math.min(2, this.taps + 1);
        this.altUsed = false;
      }
      return null;
    }
    if (!down) return null;
    const taps = this.taps;
    const held = this.alt !== null;
    const entry = keyMap.get(event.code);
    // Native output clears Alt on its emitted symbol, even for a physical
    // hold. Ordinary Option/AltGr chords retain it and do not qualify.
    const mode = held ? (entry?.quick ? 0 : taps ? 2 : null) : taps || null;
    this.taps = 0;
    if (held) this.altUsed = true;
    if (mode === null || event.altKey) return null;
    const expected = mode === 2 ? entry?.secondary.text : entry?.primary.text;
    // Ignore letters, ASCII, dead keys and multi-character IME output. Require
    // two distinct physical-position/mode matches, not repeated copies of one.
    if (
      expected &&
      Array.from(expected).length === 1 &&
      expected.codePointAt(0)! > 127 &&
      !/[\p{L}\p{N}\p{M}\s]/u.test(expected) &&
      event.key === expected
    ) {
      this.evidence.add(`${mode}:${event.code}`);
      if (this.evidence.size >= 2) {
        this.detected = true;
        return 'detected';
      }
    } else {
      this.evidence.clear();
      // Explicit recheck: this layout would turn Alt → C into © (or ¢).
      if (
        this.detected &&
        !held &&
        event.code === 'KeyC' &&
        ordinaryC.has(event.key)
      ) {
        this.detected = false;
        return 'inactive';
      }
    }
    return null;
  }
}
