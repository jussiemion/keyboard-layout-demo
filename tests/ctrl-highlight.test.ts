import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import {
  TypingEngine,
  baseKey,
  nationalKeyAction,
} from '../lib/typing-engine.ts';
import {
  LanguageSwitchController,
  defaultLanguageConfig,
} from '../lib/language-switching.ts';
import { TypographyToggle } from '../lib/typography-toggle.ts';
import { NativeLayoutDetector } from '../lib/native-layout-detection.ts';
import { keyboardEventCode } from '../lib/window-typing.ts';

// Exercise the actual page handler and its three controllers, including early returns.
const source = ts.createSourceFile(
  'page.tsx',
  readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const functions: string[] = [];
function visit(node: ts.Node) {
  if (
    ts.isFunctionDeclaration(node) &&
    ['handleKey', 'refresh'].includes(node.name?.text ?? '')
  ) {
    functions.push(node.getText(source));
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.equal(functions.length, 2);
const code = ts.transpileModule(functions.join('\n'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
for (const nativeLayoutActive of [false, true]) {
  for (const first of ['ControlLeft', 'ControlRight']) {
    for (const reverse of [false, true]) {
      void test(`Ctrl highlight clears after each release: ${first}, reverse=${String(reverse)}, native=${String(nativeLayoutActive)}`, () => {
        const second = first === 'ControlLeft' ? 'ControlRight' : 'ControlLeft';
        const released = reverse ? [second, first] : [first, second];
        const state = { held: [] as string[], enabled: true };
        const noop = () => {};
        const context = {
          nativeLayoutActive,
          nativeDetector: { current: new NativeLayoutDetector() },
          setNativeLayoutActive: (_active: boolean) => {},
          setCheckingNativeLayout: noop,
          tourOpen: false,
          tourTask: null,
          engine: { current: new TypingEngine() },
          toggleController: { current: new TypographyToggle() },
          languageController: { current: new LanguageSwitchController() },
          activeLocale: { current: 'ru' },
          input: { current: null },
          capsManaged: { current: false },
          logicalCaps: { current: false },
          languageConfig: defaultLanguageConfig('ru'),
          keyboardEventCode,
          baseKey,
          nationalKeyAction,
          setHeld: (held: string[]) => {
            state.held = held;
          },
          setTypographyEnabled: (enabled: boolean) => {
            state.enabled = enabled;
          },
          setCanCycleDiacritic: noop,
          setAccent: noop,
          setMode: noop,
          setVirtualShift: noop,
          setCaps: noop,
        };
        context.setNativeLayoutActive = (active: boolean) => {
          context.nativeLayoutActive = active;
        };
        type Event = {
          isTrusted: boolean;
          isComposing: boolean;
          code: string;
          key: string;
          repeat: boolean;
          ctrlKey: boolean;
          shiftKey: boolean;
          altKey: boolean;
          metaKey: boolean;
          getModifierState: () => boolean;
          preventDefault: () => void;
        };
        const handle = runInNewContext(`${code}\nhandleKey`, context) as (
          event: Event,
          down: boolean,
        ) => void;
        const physical = new Set<string>();
        function send(key: string, down: boolean) {
          if (down) {
            physical.add(key);
          } else {
            physical.delete(key);
          }
          handle(
            {
              isTrusted: true,
              isComposing: false,
              code: key,
              key: 'Control',
              repeat: false,
              ctrlKey: physical.size > 0,
              shiftKey: false,
              altKey: false,
              metaKey: false,
              getModifierState: () => false,
              preventDefault: noop,
            },
            down,
          );
          assert.deepEqual([...state.held].sort(), [...physical].sort());
        }
        for (let cycle = 0; cycle < 4; cycle++) {
          send(first, true);
          send(second, true);
          send(released[0], false);
          send(released[1], false);
          assert.equal(
            state.enabled,
            nativeLayoutActive ? cycle % 2 === 0 : cycle % 2 === 1,
          );
          assert.equal(context.nativeLayoutActive, false);
        }
      });
    }
  }
}
