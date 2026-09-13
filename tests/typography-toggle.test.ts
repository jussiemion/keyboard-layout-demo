import test from 'node:test';
import assert from 'node:assert/strict';
import { TypographyToggle } from '../lib/typography-toggle.ts';
import { TypingEngine } from '../lib/typing-engine.ts';

for (const order of [
  ['ControlLeft', 'ControlRight'],
  ['ControlRight', 'ControlLeft'],
]) {
  for (const release of [order, [...order].reverse()]) {
    void test(`toggle once: ${order.join(',')} / ${release.join(',')}`, () => {
      const t = new TypographyToggle();
      assert.equal(t.handle(order[0], true), false);
      assert.equal(t.handle(order[1], true), false);
      assert.equal(t.handle(order[1], true, true), false);
      assert.equal(t.handle(release[0], false), false);
      assert.equal(t.handle(release[1], false), true);
      assert.equal(t.handle(release[1], false), false);
    });
  }
}
void test('separate taps do not toggle', () => {
  const t = new TypographyToggle();
  for (const key of ['ControlLeft', 'ControlRight']) {
    assert.equal(t.handle(key, true), false);
    assert.equal(t.handle(key, false), false);
  }
});
for (const when of ['before', 'during', 'reset', 'blocked']) {
  void test(`cancel contaminated gesture: ${when}`, () => {
    const t = new TypographyToggle();
    t.handle('ControlLeft', true);
    if (when === 'before') {
      t.handle('KeyC', true);
      t.handle('KeyC', false);
    }
    t.handle('ControlRight', true, false, when === 'blocked');
    if (when === 'during') {
      t.handle('KeyC', true);
      t.handle('KeyC', false);
    }
    if (when === 'reset') {
      t.reset();
    }
    assert.equal(t.handle('ControlLeft', false), false);
    assert.equal(t.handle('ControlRight', false), false);
  });
}
void test('disabled engine passes Alt, letters and Shift without typography', () => {
  const e = new TypingEngine();
  e.enabled = false;
  for (const code of ['AltLeft', 'AltLeft', 'KeyC', 'ShiftLeft']) {
    assert.equal(e.handle({ code, down: true, key: 'c' }, 'pl').prevent, false);
    assert.equal(
      e.handle({ code, down: false, key: 'c' }, 'pl').prevent,
      false,
    );
  }
  assert.equal(e.mode, 0);
  assert.equal(e.canCycleDiacritic, false);
  e.reset();
  e.enabled = true;
  e.handle({ code: 'AltLeft', down: true });
  e.handle({ code: 'AltLeft', down: false });
  assert.equal(e.handle({ code: 'KeyC', down: true }).text, '©');
});
