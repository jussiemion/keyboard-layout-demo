/** A clean overlapping pair, committed only after both Controls are released. */
export class TypographyToggle {
  held = new Set<string>();
  private clean = false;
  private paired = false;
  reset() {
    this.held.clear();
    this.clean = false;
    this.paired = false;
  }
  handle(
    code: string,
    down: boolean,
    repeat = false,
    blocked = false,
  ): boolean {
    if (repeat || down === this.held.has(code)) {
      return false;
    }
    const control = code === 'ControlLeft' || code === 'ControlRight';
    if (down) {
      if (this.held.size === 0) {
        this.clean = control && !blocked;
      }
      this.held.add(code);
      if (!control || blocked) {
        this.clean = false;
      }
      if (
        this.clean &&
        this.held.has('ControlLeft') &&
        this.held.has('ControlRight')
      ) {
        this.paired = true;
      }
      return false;
    }
    this.held.delete(code);
    if (blocked) {
      this.clean = false;
    }
    const toggle = control && this.held.size === 0 && this.clean && this.paired;
    if (this.held.size === 0) {
      this.clean = false;
      this.paired = false;
    }
    return toggle;
  }
}
