import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import {
  TypingEngine,
  baseKey,
  nationalKeyAction,
  replaceSelection,
} from '../lib/typing-engine.ts';

// Run the actual screen-key handler: down/up ordering and caret context matter.
const source = ts.createSourceFile(
  'page.tsx',
  readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
let handler = '';
function visit(node: ts.Node) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === 'virtualKey') {
    handler = node.getText(source);
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(handler);
const compiled = ts.transpileModule(handler, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup() {
  const engine = new TypingEngine();
  const input = { value: '', selectionStart: 0, selectionEnd: 0, focus() {} };
  const context = {
    tourOpen: false,
    tourTask: null,
    input: { current: input },
    engine: { current: engine },
    locale: 'pl',
    caps: false,
    virtualShift: false,
    baseKey,
    nationalKeyAction,
    refresh() {},
    setVirtualShift(value: boolean) {
      context.virtualShift = value;
    },
    insert(
      text: string,
      replacement?: { start: number; end: number; expected: string },
    ) {
      if (replacement) {
        assert.equal(input.value, replacement.expected);
      }
      const next = replaceSelection(
        input.value,
        replacement?.start ?? input.selectionStart,
        replacement?.end ?? input.selectionEnd,
        text,
      );
      input.value = next.value;
      input.selectionStart = input.selectionEnd = next.caret;
    },
  };
  const press = runInNewContext(`${compiled}\nvirtualKey`, context) as (
    code: string,
  ) => void;
  return { input, press, engine };
}
void test('screen Shift press/release cycles a preceding Polish letter', () => {
  const { input, press } = setup();
  press('KeyA');
  press('ShiftLeft');
  press('ShiftLeft');
  assert.equal(input.value, 'ą');
  press('ShiftRight');
  press('ShiftRight');
  assert.equal(input.value, 'a');
});
void test('screen Shift used for uppercase does not cycle the preceding letter', () => {
  const { input, press } = setup();
  press('KeyA');
  press('ShiftLeft');
  press('KeyB');
  assert.equal(input.value, 'aB');
});
void test('screen postfix preserves independent stress', () => {
  const { input, press } = setup();
  press('AltLeft');
  press('AltLeft');
  press('Slash');
  press('KeyA');
  assert.equal(input.value, 'á');
  press('ShiftLeft');
  press('ShiftLeft');
  assert.equal(input.value, 'ą\u0301');
});
