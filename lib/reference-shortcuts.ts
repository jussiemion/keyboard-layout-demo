export type ReferenceAction = 'search' | 'help';
type ShortcutKey = {
  code: string;
  key: string;
  repeat?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  isComposing?: boolean;
  altGraph?: boolean;
};

/** Track physical holds, never the latched Caps Lock LED. */
export class ReferenceShortcuts {
  private held = new Set<string>();
  private consumed = new Set<string>();
  private capsEligible = false;

  reset() {
    this.held.clear();
    this.consumed.clear();
    this.capsEligible = false;
  }

  handle(
    event: ShortcutKey,
    down: boolean,
    enabled: boolean,
  ): {
    prevent: boolean;
    action?: ReferenceAction;
  } {
    const code =
      event.key === 'CapsLock'
        ? 'CapsLock'
        : event.code || `Key${event.key.toUpperCase()}`;
    if (!down) {
      this.held.delete(code);
      if (code === 'CapsLock') {
        this.capsEligible = false;
      }
      return { prevent: this.consumed.delete(code) };
    }
    if (event.repeat || this.held.has(code)) {
      return { prevent: this.consumed.has(code) };
    }
    const alone = this.held.size === 0;
    this.held.add(code);
    const modified =
      event.altKey || event.shiftKey || event.metaKey || event.altGraph;
    if (event.isComposing || event.key === 'Process') {
      this.capsEligible = false;
      return { prevent: false };
    }
    if (code === 'CapsLock') {
      this.capsEligible = enabled && alone && !modified && !event.ctrlKey;
      return { prevent: false };
    }
    const caps = enabled && this.capsEligible && this.held.has('CapsLock');
    if (
      !modified &&
      (event.ctrlKey || caps) &&
      ['KeyF', 'KeyH'].includes(code)
    ) {
      this.consumed.add(code);
      if (caps) {
        this.consumed.add('CapsLock');
      }
      return { prevent: true, action: code === 'KeyF' ? 'search' : 'help' };
    }
    this.capsEligible = false;
    return { prevent: false };
  }
}
