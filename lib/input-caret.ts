/** Restore the caret after a controlled insertion and reveal trailing text. */
export function restoreInputCaret(
  target: Pick<
    HTMLInputElement,
    'value' | 'focus' | 'setSelectionRange' | 'scrollLeft' | 'scrollWidth'
  >,
  caret: number,
  rtl = false,
) {
  target.focus({ preventScroll: true });
  target.setSelectionRange(caret, caret);
  // Programmatic selection does not consistently scroll like native typing.
  // Let the browser clamp this to the field's maximum horizontal offset.
  if (caret === target.value.length)
    target.scrollLeft = rtl ? -target.scrollWidth : target.scrollWidth;
}
