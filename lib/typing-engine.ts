import diacritics from './diacritic-profiles.ts';
import canonical from './layout.json' with { type: 'json' };
import nationalMaps from './national-layouts.json' with { type: 'json' };

export { KEYBOARD_LOCALES } from './keyboard-locales.ts';
export type { Locale, KeyboardLocale } from './keyboard-locales.ts';
import {
  keyboardLanguage,
  keyboardMap,
  type KeyboardLocale,
} from './keyboard-locales.ts';
export type Mode = 0 | 1 | 2;
export type Action = { text?: string; dead?: string };
export type LayoutKey = {
  key: string;
  label: string;
  code: string;
  primary: Action;
  secondary: Action;
  quick: boolean;
};

const physical: Record<string, string> = {
  TLDE: 'Backquote',
  AE11: 'Minus',
  AE12: 'Equal',
  AD11: 'BracketLeft',
  AD12: 'BracketRight',
  AC10: 'Semicolon',
  AC11: 'Quote',
  AB08: 'Comma',
  AB09: 'Period',
  AB10: 'Slash',
  SPCE: 'Space',
  BKSL: 'Backslash',
};
for (let i = 1; i <= 10; i++)
  physical[`AE${String(i).padStart(2, '0')}`] = `Digit${i % 10}`;
for (const [row, letters] of [
  ['AD', 'QWERTYUIOP'],
  ['AC', 'ASDFGHJKL'],
  ['AB', 'ZXCVBNM'],
]) {
  letters.split('').forEach((letter, i) => {
    physical[`${row}${String(i + 1).padStart(2, '0')}`] = `Key${letter}`;
  });
}
export const layout: LayoutKey[] = canonical.keys.map((entry) => ({
  ...entry,
  code: physical[entry.key],
}));
export const keyMap = new Map(layout.map((entry) => [entry.code, entry]));
export const accents: Record<
  string,
  { mark: string; label: string; spacing: string }
> = {
  grave: { mark: '\u0300', label: 'гравис', spacing: '`' },
  circumflex: { mark: '\u0302', label: 'циркумфлекс', spacing: '^' },
  breve: { mark: '\u0306', label: 'кратка', spacing: '˘' },
  ring: { mark: '\u030a', label: 'кружок', spacing: '˚' },
  doubleacute: { mark: '\u030b', label: 'двойной акут', spacing: '˝' },
  diaeresis: { mark: '\u0308', label: 'умлаут', spacing: '¨' },
  cedilla: { mark: '\u0327', label: 'седиль', spacing: '¸' },
  caron: { mark: '\u030c', label: 'гачек', spacing: 'ˇ' },
  tilde: { mark: '\u0303', label: 'тильда', spacing: '~' },
  acute: { mark: '\u0301', label: 'ударение', spacing: '´' },
};
const nationalAccents: typeof accents = {
  macron: { mark: '\u0304', label: 'macron', spacing: '¯' },
  ogonek: { mark: '\u0328', label: 'ogonek', spacing: '˛' },
  abovedot: { mark: '\u0307', label: 'dot above', spacing: '˙' },
  belowdot: { mark: '\u0323', label: 'dot below', spacing: '̣' },
  belowmacron: { mark: '\u0331', label: 'macron below', spacing: '̱' },
  hook: { mark: '\u0309', label: 'hook above', spacing: '̉' },
  horn: { mark: '\u031b', label: 'horn', spacing: '̛' },
};
function accentDefinition(name: string) {
  return accents[name] || nationalAccents[name];
}

export function nationalKeyAction(
  code: string,
  locale: KeyboardLocale,
  shift = false,
  caps = false,
  alt = false,
): Action {
  const rows = (nationalMaps as Record<string, Record<string, Action[]>>)[
    keyboardMap(locale)
  ];
  const levels = rows?.[code];
  if (!levels) return {};
  return levels[(caps ? 4 : 0) + (alt ? 2 : 0) + (shift ? 1 : 0)] || {};
}

export function actionLabel(action: Action): string {
  if (action.dead) return `◌${accentDefinition(action.dead).mark}`;
  return action.text === '\u00a0' ? '⍽' : action.text || '';
}
const russian = new Map<string, string>();
for (const [codes, letters] of [
  [
    'KeyQ KeyW KeyE KeyR KeyT KeyY KeyU KeyI KeyO KeyP BracketLeft BracketRight',
    'йцукенгшщзхъ',
  ],
  [
    'KeyA KeyS KeyD KeyF KeyG KeyH KeyJ KeyK KeyL Semicolon Quote',
    'фывапролджэ',
  ],
  ['KeyZ KeyX KeyC KeyV KeyB KeyN KeyM Comma Period', 'ячсмитьбю'],
])
  codes.split(' ').forEach((code, i) => russian.set(code, letters[i]));
russian.set('Backquote', 'ё');
const shiftEn: Record<string, string> = {
  Backquote: '~',
  Digit1: '!',
  Digit2: '@',
  Digit3: '#',
  Digit4: '$',
  Digit5: '%',
  Digit6: '^',
  Digit7: '&',
  Digit8: '*',
  Digit9: '(',
  Digit0: ')',
  Minus: '_',
  Equal: '+',
  BracketLeft: '{',
  BracketRight: '}',
  Backslash: '|',
  Semicolon: ':',
  Quote: '"',
  Comma: '<',
  Period: '>',
  Slash: '?',
};
const shiftRu: Record<string, string> = {
  Digit2: '"',
  Digit3: '№',
  Digit4: ';',
  Digit6: ':',
  Digit7: '?',
  Backslash: '/',
  Slash: ',',
};
export function baseKey(
  code: string,
  locale: KeyboardLocale,
  shift = false,
  caps = false,
  alt = false,
): string {
  if (keyboardMap(locale) in nationalMaps) {
    const action = nationalKeyAction(code, locale, shift, caps, alt);
    return actionLabel(
      action.text || action.dead
        ? action
        : nationalKeyAction(code, locale, shift, caps),
    );
  }
  if (locale === 'pl' && alt && polish[code]) {
    return shift !== caps ? polish[code].toUpperCase() : polish[code];
  }
  let value =
    locale === 'ru' && russian.has(code)
      ? russian.get(code)!
      : code === 'Space'
        ? ' '
        : code === 'Slash' && locale === 'ru'
          ? '.'
          : keyMap.get(code)?.label.toLowerCase() || '';
  if (/^\p{L}$/u.test(value))
    return shift !== caps ? value.toUpperCase() : value;
  if (shift)
    value =
      (locale === 'ru' ? shiftRu[code] : undefined) || shiftEn[code] || value;
  return value;
}
/** Preview an armed acute accent without consuming the typing state. */
export function accentKeyLabel(letter: string, accent: string | null): string {
  return accent === 'acute' &&
    (/^[аеёиоуыэюя]$/iu.test(letter) ||
      /^[aeiouy]$/iu.test(letter.normalize('NFD').replace(/\p{M}/gu, '')))
    ? (letter + accents.acute.mark).normalize('NFC')
    : letter;
}

const polish: Record<string, string> = {
  KeyA: 'ą',
  KeyC: 'ć',
  KeyE: 'ę',
  KeyL: 'ł',
  KeyN: 'ń',
  KeyO: 'ó',
  KeyS: 'ś',
  KeyX: 'ź',
  KeyZ: 'ż',
};
export type KeyInput = {
  code: string;
  key?: string;
  down: boolean;
  repeat?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altGraph?: boolean;
  capsLock?: boolean;
  synthetic?: boolean;
  context?: { value: string; start: number; end: number };
};
export type KeyResult = {
  prevent: boolean;
  text?: string;
  replace?: { start: number; end: number; expected: string };
  route:
    | 'pass'
    | 'suppress'
    | 'primary'
    | 'secondary'
    | 'national'
    | 'accent'
    | 'postfix';
};
const pass: KeyResult = { prevent: false, route: 'pass' };
const suppress: KeyResult = { prevent: true, route: 'suppress' };

export function nextDiacritic(base: string, locale: KeyboardLocale): string {
  const upper = (text: string) =>
    Array.from(text)
      .map(
        (letter) =>
          (diacritics.uppercaseOverrides as Record<string, string>)[letter] ||
          letter.toLocaleUpperCase(keyboardLanguage(locale)),
      )
      .join('');
  for (const cycle of (
    diacritics.profiles as Partial<Record<KeyboardLocale, string[]>>
  )[keyboardLanguage(locale)] || []) {
    for (const row of [cycle, upper(cycle)]) {
      const index = base.length === 1 ? row.indexOf(base) : -1;
      if (index >= 0) return row[(index + 1) % row.length];
    }
  }
  return '';
}

// A letter can be replaced only while its text and caret remain unchanged.
type PostfixCandidate = {
  base: string;
  stressed: boolean;
  value: string;
  caret: number;
  text: string;
};

function isShift(code: string): boolean {
  return code === 'ShiftLeft' || code === 'ShiftRight';
}

/** Browser port of core/state.hpp. No clocks, input logs, or global injection. */
export class TypingEngine {
  enabled = true;
  held = new Set<string>();
  private consumed = new Set<string>();
  pending: Mode = 0;
  accent: string | null = null;
  private altEligible = false;
  private shortcut = false;
  private postfix: PostfixCandidate | null = null;
  private postfixShift: string | null = null;
  private postfixLocale: KeyboardLocale | null = null;

  get canCycleDiacritic() {
    return this.postfix !== null;
  }

  resetPostfix() {
    this.postfix = null;
    this.postfixShift = null;
  }

  get altHeld() {
    return this.held.has('AltLeft') || this.held.has('AltRight');
  }
  get shiftHeld() {
    return this.held.has('ShiftLeft') || this.held.has('ShiftRight');
  }
  get mode(): Mode {
    return this.pending && this.altHeld ? 2 : this.pending;
  }
  reset() {
    this.resetPostfix();
    this.held.clear();
    this.consumed.clear();
    this.pending = 0;
    this.accent = null;
    this.altEligible = false;
    this.shortcut = false;
  }
  selectMode(mode: Mode) {
    this.reset();
    this.pending = mode;
  }

  compose(text: string): string {
    if (!this.accent || !text) return text;
    const accent = accentDefinition(this.accent);
    this.accent = null;
    if (text === ' ') return accent.spacing;
    if (!/^\p{L}/u.test(text)) return text;
    return (text + accent.mark).normalize('NFC');
  }

  private output(action: Action, route: KeyResult['route']): KeyResult {
    if (action.dead) {
      this.accent = action.dead;
      return { prevent: true, route, text: '' };
    }
    return { prevent: true, route, text: this.compose(action.text || '') };
  }

  handle(event: KeyInput, locale: KeyboardLocale = 'ru'): KeyResult {
    if (event.synthetic) return pass;
    if (!this.enabled) {
      if (event.down) this.held.add(event.code);
      else this.held.delete(event.code);
      return pass;
    }
    const fresh = !event.repeat && event.down !== this.held.has(event.code);
    const shift = isShift(event.code);
    const command = this.isCommand(event);
    const accent = this.accent;
    this.preparePostfix(event, locale, fresh, command);

    const result = this.route(event, locale);
    if (!fresh || command) return result;
    if (
      shift &&
      !event.down &&
      this.postfixShift === event.code &&
      this.held.size === 0 &&
      this.postfix
    ) {
      return this.cyclePostfix(this.postfix, locale);
    }
    if (event.down && !shift && event.context) {
      this.rememberPostfix(event, locale, result, accent, event.context);
    }
    return result;
  }

  private isCommand(event: KeyInput): boolean {
    // AltGraph may set ctrlKey on Windows; an explicitly held Ctrl still wins.
    return (
      this.held.has('ControlLeft') ||
      this.held.has('ControlRight') ||
      Boolean(event.ctrlKey && !event.altGraph) ||
      Boolean(event.metaKey) ||
      this.held.has('MetaLeft') ||
      this.held.has('MetaRight')
    );
  }

  private preparePostfix(
    event: KeyInput,
    locale: KeyboardLocale,
    fresh: boolean,
    command: boolean,
  ) {
    if (this.postfixLocale !== locale) this.resetPostfix();
    this.postfixLocale = locale;
    const context = event.context;
    const shift = isShift(event.code);
    const alone = this.held.size === 0;
    if (
      this.postfix &&
      (!context ||
        context.value !== this.postfix.value ||
        context.start !== this.postfix.caret ||
        context.end !== context.start)
    )
      this.resetPostfix();
    if (command) this.resetPostfix();
    if (fresh && shift && event.down) {
      this.postfixShift = alone && this.postfix ? event.code : null;
    } else if (fresh && event.down) this.resetPostfix();
  }

  private cyclePostfix(
    previous: PostfixCandidate,
    locale: KeyboardLocale,
  ): KeyResult {
    const base = nextDiacritic(previous.base, locale);
    const text = (base + (previous.stressed ? '\u0301' : '')).normalize('NFC');
    const start = previous.caret - previous.text.length;
    const next = replaceSelection(previous.value, start, previous.caret, text);
    this.postfix = {
      ...previous,
      base,
      text,
      value: next.value,
      caret: next.caret,
    };
    this.postfixShift = null;
    return {
      prevent: true,
      route: 'postfix',
      text,
      replace: { start, end: previous.caret, expected: previous.value },
    };
  }

  private rememberPostfix(
    event: KeyInput,
    locale: KeyboardLocale,
    result: KeyResult,
    accent: string | null,
    context: NonNullable<KeyInput['context']>,
  ) {
    const plain =
      result.route === 'pass' && !this.altHeld && !accent && !this.pending;
    const national =
      !accent && result.route === 'national' && Boolean(result.text);
    const stressed =
      accent === 'acute' &&
      (result.route === 'accent' || result.route === 'national');
    const base =
      result.route === 'national'
        ? baseKey(
            event.code,
            locale,
            Boolean(event.shiftKey || this.shiftHeld),
            Boolean(event.capsLock),
            true,
          )
        : event.key || '';
    const onlyShift = [...this.held].every(
      (code) => code === event.code || isShift(code),
    );
    if (
      ((plain && onlyShift) || stressed || national) &&
      nextDiacritic(base, locale) &&
      (!stressed ||
        /^[aeiouyаеёиоуыэюя]$/iu.test(
          base.normalize('NFD').replace(/\p{M}/gu, ''),
        ))
    ) {
      const text = result.text ?? base;
      const next = replaceSelection(
        context.value,
        context.start,
        context.end,
        text,
      );
      this.postfix = {
        base,
        stressed,
        text,
        value: next.value,
        caret: next.caret,
      };
    }
  }

  private route(event: KeyInput, locale: KeyboardLocale): KeyResult {
    const { code, down } = event;
    if (event.synthetic) return pass;
    if (event.repeat || down === this.held.has(code))
      return this.consumed.has(code) ? suppress : pass;
    if (down) this.held.add(code);
    else this.held.delete(code);
    const alt = code === 'AltLeft' || code === 'AltRight';
    const modifier =
      /^(Alt|Shift|Control|Meta)(Left|Right)$/.test(code) ||
      code === 'CapsLock';
    const command = this.isCommand(event);
    if (alt) {
      if (down) {
        this.altEligible =
          !command &&
          !this.shortcut &&
          !(this.held.has('AltLeft') && this.held.has('AltRight'));
        if (command) {
          this.pending = 0;
          this.accent = null;
          this.shortcut = true;
        }
      } else {
        if (this.altEligible && !this.altHeld)
          this.pending = Math.min(2, this.pending + 1) as Mode;
        this.altEligible = false;
        if (!this.altHeld) this.shortcut = false;
      }
      return suppress;
    }
    if (!down) return this.consumed.delete(code) ? suppress : pass;
    if (command) {
      this.pending = 0;
      this.accent = null;
      this.altEligible = false;
      this.shortcut = this.altHeld;
      return pass;
    }
    if (modifier) return pass;
    this.altEligible = false;
    const entry = keyMap.get(code);
    const nationalAction = this.altHeld
      ? nationalKeyAction(
          code,
          locale,
          Boolean(event.shiftKey || this.shiftHeld),
          Boolean(event.capsLock),
          true,
        )
      : {};
    if (
      !entry &&
      !this.pending &&
      !this.shortcut &&
      (nationalAction.text || nationalAction.dead)
    ) {
      this.consumed.add(code);
      return this.output(nationalAction, 'national');
    }
    if (!entry) {
      this.pending = 0;
      this.accent = null;
      if (this.altHeld) this.shortcut = true;
      return pass;
    }
    if (this.shortcut) {
      this.pending = 0;
      this.accent = null;
      return pass;
    }
    if (this.pending) {
      const mode = this.mode;
      this.pending = 0;
      this.consumed.add(code);
      return this.output(
        mode === 2 ? entry.secondary : entry.primary,
        mode === 2 ? 'secondary' : 'primary',
      );
    }
    if (this.altHeld) {
      // Hebrew AltGr retains national punctuation and niqqud; Left Alt keeps M0.
      if (
        locale === 'he' &&
        this.held.has('AltRight') &&
        (nationalAction.text || nationalAction.dead)
      ) {
        this.consumed.add(code);
        return this.output(nationalAction, 'national');
      }
      if (entry.quick && !this.shiftHeld && !event.shiftKey) {
        this.consumed.add(code);
        return this.output(entry.primary, 'primary');
      }
      if (nationalAction.text || nationalAction.dead) {
        this.consumed.add(code);
        return this.output(nationalAction, 'national');
      }
      if (locale === 'pl' && polish[code]) {
        const uppercase =
          Boolean(event.shiftKey || this.shiftHeld) !== Boolean(event.capsLock);
        this.consumed.add(code);
        return this.output(
          { text: uppercase ? polish[code].toUpperCase() : polish[code] },
          'national',
        );
      }
      this.shortcut = true;
      this.accent = null;
      return pass;
    }
    if (this.accent && event.key && Array.from(event.key).length === 1) {
      this.consumed.add(code);
      return { prevent: true, route: 'accent', text: this.compose(event.key) };
    }
    return pass;
  }
}

export function replaceSelection(
  value: string,
  start: number,
  end: number,
  insertion: string,
) {
  return {
    value: value.slice(0, start) + insertion + value.slice(end),
    caret: start + insertion.length,
  };
}
export function deleteBackward(value: string, start: number, end: number) {
  if (start !== end) return replaceSelection(value, start, end, '');
  const segments = [
    ...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(
      value.slice(0, start),
    ),
  ];
  return replaceSelection(value, segments.at(-1)?.index ?? 0, end, '');
}
