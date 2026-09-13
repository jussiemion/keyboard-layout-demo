import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TypingEngine,
  nationalKeyAction,
  baseKey,
  nextDiacritic,
  keyMap,
} from '../lib/typing-engine.ts';
import { defaultLanguageConfig } from '../lib/language-switching.ts';

void test('Hebrew reference positions, finals, Shift Latin and punctuation', () => {
  for (const [code, plain, shifted] of [
    ['KeyA', 'ש', 'A'],
    ['KeyT', 'א', 'T'],
    ['KeyO', 'ם', 'O'],
    ['KeyI', 'ן', 'I'],
    ['KeyL', 'ך', 'L'],
    ['Semicolon', 'ף', ':'],
    ['Period', 'ץ', '<'],
    ['KeyQ', '/', 'Q'],
    ['Quote', ',', '"'],
    ['Slash', '.', '?'],
    ['Digit9', '9', ')'],
    ['Digit0', '0', '('],
  ]) {
    assert.equal(baseKey(code, 'he'), plain);
    assert.equal(baseKey(code, 'he', true), shifted);
  }
  assert.equal(nextDiacritic('ש', 'he'), '');
  assert.deepEqual(defaultLanguageConfig('he').order, ['en', 'he']);
});

void test('Hebrew AltGr outputs niqqud, punctuation and direction controls without arming a prefix', () => {
  for (const [code, text] of [
    ['KeyA', '\u05b0'],
    ['KeyS', '\u05bc'],
    ['KeyE', '\u05b8'],
    ['KeyQ', '\u05c2'],
    ['KeyW', '\u05c1'],
    ['Minus', '־'],
    ['Quote', '״'],
    ['Backquote', '׳'],
    ['Digit4', '₪'],
    ['Digit9', '\u200e'],
    ['Digit0', '\u200f'],
    ['Comma', '’'],
    ['Period', '‚'],
    ['Slash', '÷'],
  ]) {
    const engine = new TypingEngine();
    engine.handle({ code: 'AltRight', down: true }, 'he');
    const result = engine.handle(
      { code, down: true, altGraph: true, ctrlKey: true },
      'he',
    );
    assert.equal(result.text, text, code);
    assert.equal(result.prevent, true);
    engine.handle({ code, down: false, altGraph: true }, 'he');
    engine.handle({ code: 'AltRight', down: false }, 'he');
    assert.equal(engine.pending, 0);
    assert.equal(nationalKeyAction(code, 'he', false, false, true).text, text);
  }
});

void test('Hebrew keeps Left Alt quick typography and both Alt prefix modes', () => {
  for (const [code, text] of [
    ['Minus', '—'],
    ['Slash', '…'],
    ['Comma', '«'],
    ['Period', '»'],
  ]) {
    const e = new TypingEngine();
    e.handle({ code: 'AltLeft', down: true }, 'he');
    assert.equal(e.handle({ code, down: true }, 'he').text, text);
  }
  const prefixes = [
    { alt: 'AltLeft', taps: 1 },
    { alt: 'AltRight', taps: 1 },
    { alt: 'AltLeft', taps: 2 },
    { alt: 'AltRight', taps: 2 },
  ];
  for (const { alt, taps } of prefixes) {
    for (const entry of keyMap.values()) {
      const e = new TypingEngine();
      for (let i = 0; i < taps; i++) {
        e.handle({ code: alt, down: true }, 'he');
        e.handle({ code: alt, down: false }, 'he');
      }
      const result = e.handle({ code: entry.code, down: true }, 'he');
      const action = taps === 1 ? entry.primary : entry.secondary;
      if (action.text) assert.equal(result.text, action.text);
      if (action.dead) assert.equal(e.accent, action.dead);
    }
  }
});
