import { keyboardMap } from './keyboard-locales.ts';
import type { KeyboardLocale } from './typing-engine.ts';
import type { Platform } from './platform.ts';

export type Keycap = {
  code: string;
  label?: string;
  width?: number;
  symbol?: string;
  disabled?: boolean;
};
export type KeyCluster = { code: 'Arrows'; width: number; keys: Keycap[] };
export type KeyboardEntry = Keycap | KeyCluster;

const keys = (codes: string): Keycap[] =>
  codes.split(' ').map((code) => ({ code }));
const pcRows: Keycap[][] = [
  [
    ...keys(
      'Backquote Digit1 Digit2 Digit3 Digit4 Digit5 Digit6 Digit7 Digit8 Digit9 Digit0 Minus Equal',
    ),
    { code: 'Backspace', label: 'backspace', width: 2 },
  ],
  [
    { code: 'Tab', label: 'tab', width: 1.5 },
    ...keys(
      'KeyQ KeyW KeyE KeyR KeyT KeyY KeyU KeyI KeyO KeyP BracketLeft BracketRight',
    ),
    { code: 'Backslash', width: 1.5 },
  ],
  [
    { code: 'CapsLock', label: 'caps', width: 1.75 },
    ...keys('KeyA KeyS KeyD KeyF KeyG KeyH KeyJ KeyK KeyL Semicolon Quote'),
    { code: 'Enter', label: 'enter', width: 2.25 },
  ],
  [
    { code: 'ShiftLeft', label: 'shift', width: 2.25 },
    ...keys('KeyZ KeyX KeyC KeyV KeyB KeyN KeyM Comma Period Slash'),
    { code: 'ShiftRight', label: 'shift', width: 2.75 },
  ],
  [
    { code: 'ControlLeft', label: 'ctrl', width: 1.25 },
    { code: 'MetaLeft', label: 'super', width: 1.25 },
    { code: 'AltLeft', label: 'alt', width: 1.25 },
    { code: 'Space', width: 6.25 },
    { code: 'AltRight', label: 'alt', width: 1.25 },
    { code: 'MetaRight', label: 'super', width: 1.25 },
    { code: 'ContextMenu', label: 'menu', width: 1.25 },
    { code: 'ControlRight', label: 'ctrl', width: 1.25 },
  ],
];

const macRows: KeyboardEntry[][] = [
  ...pcRows.slice(0, 4).map((row) =>
    row.map((key) => {
      if (key.code === 'Backspace') {
        return { ...key, label: 'delete' };
      }
      if (key.code === 'Enter') {
        return { ...key, label: 'return' };
      }
      if (key.code.startsWith('Shift')) {
        return { ...key, symbol: '⇧' };
      }
      return key;
    }),
  ),
  [
    { code: 'Fn', label: 'fn', width: 0.75, disabled: true },
    { code: 'ControlLeft', label: 'control', symbol: '⌃', width: 1.25 },
    { code: 'AltLeft', label: 'option', symbol: '⌥', width: 1.25 },
    { code: 'MetaLeft', label: 'command', symbol: '⌘', width: 1.5 },
    { code: 'Space', width: 4.5 },
    { code: 'MetaRight', label: 'command', symbol: '⌘', width: 1.5 },
    { code: 'AltRight', label: 'option', symbol: '⌥', width: 1.25 },
    {
      code: 'Arrows',
      width: 3,
      keys: [
        { code: 'ArrowLeft', label: 'left' },
        { code: 'ArrowUp', label: 'up' },
        { code: 'ArrowDown', label: 'down' },
        { code: 'ArrowRight', label: 'right' },
      ],
    },
  ],
];

const windowsRows = pcRows.map((row) =>
  row.map((key) =>
    key.code.startsWith('Meta') ? { ...key, label: 'win' } : key,
  ),
);

export function getKeyboardRows(
  platform: Platform,
  locale: KeyboardLocale = 'en',
): KeyboardEntry[][] {
  const rows =
    platform === 'macos'
      ? macRows
      : platform === 'windows'
        ? windowsRows
        : pcRows;
  if (['ru', 'en', 'pl', 'he', 'ar', 'vi'].includes(keyboardMap(locale))) {
    return rows;
  }
  return rows.map((row, index) =>
    index !== 3
      ? row
      : row.flatMap((key) =>
          key.code === 'ShiftLeft'
            ? [
                { ...key, width: 1.25 },
                { code: 'IntlBackslash', width: 1 },
              ]
            : locale === 'pt-BR' && key.code === 'ShiftRight'
              ? [
                  { code: 'IntlRo', width: 1 },
                  { ...key, width: 1.75 },
                ]
              : [key],
        ),
  );
}

export function modifierNames(platform: Platform) {
  return {
    alt: platform === 'macos' ? 'Option' : 'Alt',
    meta:
      platform === 'macos'
        ? 'Command'
        : platform === 'windows'
          ? 'Win'
          : 'Super',
    control: platform === 'macos' ? 'Control' : 'Ctrl',
  };
}

// Screen-arrow navigation is grapheme-aware and never creates DOM key events.
export function moveSelection(
  value: string,
  start: number,
  end: number,
  direction: string | null,
  code: string,
  extend: boolean,
) {
  const backward = direction === 'backward';
  const anchor = backward ? end : start;
  const focus = backward ? start : end;
  const boundaries = [
    ...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(
      value,
    ),
  ].map((segment) => segment.index);
  boundaries.push(value.length);
  let next = focus;
  if (code === 'ArrowUp') {
    next = 0;
  } else if (code === 'ArrowDown') {
    next = value.length;
  } else if (code === 'ArrowLeft') {
    next =
      !extend && start !== end
        ? start
        : (boundaries.findLast((boundary) => boundary < focus) ?? 0);
  } else if (code === 'ArrowRight') {
    next =
      !extend && start !== end
        ? end
        : (boundaries.find((boundary) => boundary > focus) ?? value.length);
  }
  return extend
    ? {
        start: Math.min(anchor, next),
        end: Math.max(anchor, next),
        direction: next < anchor ? ('backward' as const) : ('forward' as const),
      }
    : { start: next, end: next, direction: 'none' as const };
}
