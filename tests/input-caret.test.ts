import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreInputCaret } from '../lib/input-caret.ts';

void test('programmatic insertion reveals the end for every kind of output', () => {
  for (const symbol of ['©', '—', '¹⁄₂', 'о́', '🙂', 'a']) {
    const target = {
      value: 'long text '.repeat(100) + symbol,
      scrollLeft: 0,
      scrollWidth: 8000,
      focus(options?: FocusOptions) {
        assert.equal(options?.preventScroll, true);
      },
      setSelectionRange(start: number | null, end: number | null) {
        assert.equal(start, this.value.length);
        assert.equal(end, this.value.length);
      },
    };
    restoreInputCaret(target, target.value.length);
    assert.equal(target.scrollLeft, target.scrollWidth);
  }
});

void test('editing inside the text does not force scrolling to the end', () => {
  const target = {
    value: 'long text '.repeat(100),
    scrollLeft: 200,
    scrollWidth: 8000,
    focus() {},
    setSelectionRange(start: number | null, end: number | null) {
      assert.equal(start, 30);
      assert.equal(end, 30);
    },
  };
  restoreInputCaret(target, 30);
  assert.equal(target.scrollLeft, 200);
});

void test('RTL insertions reveal the left end; editing inside preserves scroll', () => {
  const target = {
    value: 'שלום '.repeat(100) + '©',
    scrollLeft: 0,
    scrollWidth: 8000,
    focus() {},
    setSelectionRange() {},
  };
  restoreInputCaret(target, target.value.length, true);
  assert.equal(target.scrollLeft, -8000);
  target.scrollLeft = -100;
  restoreInputCaret(target, 2, true);
  assert.equal(target.scrollLeft, -100);
});
