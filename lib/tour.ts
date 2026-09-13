import {
  accents,
  layout,
  type KeyboardLocale,
  type Mode,
} from './typing-engine.ts';
import type { LanguageMapping } from './settings.ts';

export const TOUR_STORAGE_KEY = 'keyboard-layout-demo.tour.v1';
export type TourChoice = 'declined' | 'started' | 'completed';
let sessionChoice: TourChoice | null = null;
export function parseTourChoice(raw: string | null): TourChoice | null {
  return raw === 'declined' || raw === 'started' || raw === 'completed'
    ? raw
    : null;
}
export function readTourChoice(): TourChoice | null {
  try {
    return (
      sessionChoice ?? parseTourChoice(localStorage.getItem(TOUR_STORAGE_KEY))
    );
  } catch {
    return sessionChoice;
  }
}
export function rememberTour(choice: TourChoice): boolean {
  sessionChoice = choice;
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, choice);
    return true;
  } catch {
    return false;
  }
}

export type TourStepId =
  | 'birman'
  | 'extended'
  | 'accent'
  | 'quick'
  | 'modes'
  | 'stress'
  | 'postfix'
  | 'hebrew'
  | 'pair'
  | 'slot1'
  | 'slot2'
  | 'slot3'
  | 'slot4'
  | 'off'
  | 'on'
  | 'search'
  | 'settings'
  | 'help'
  | 'challenge';
export type TourStep = {
  id: TourStepId;
  keys: string[];
  locale: KeyboardLocale;
  initial?: string;
  target?: string;
  targetMode?: Mode;
  targetLocale?: KeyboardLocale;
  enabled?: boolean;
  targetEnabled?: boolean;
  chord?: string[];
  spotlight?: 'search' | 'settings' | 'help';
};
export type TourObservation = {
  value: string;
  mode: Mode;
  locale: KeyboardLocale;
  enabled: boolean;
  settingsOpen: boolean;
  helpOpen: boolean;
};

export function tourStepComplete(
  step: TourStep,
  state: TourObservation,
): boolean {
  if (step.target !== undefined)
    return state.value.normalize('NFC') === step.target.normalize('NFC');
  if (step.targetMode !== undefined) return state.mode === step.targetMode;
  if (step.targetLocale !== undefined)
    return state.locale === step.targetLocale;
  if (step.targetEnabled !== undefined)
    return state.enabled === step.targetEnabled;
  if (step.spotlight === 'settings') return state.settingsOpen;
  if (step.spotlight === 'help') return state.helpOpen;
  return false;
}

/** Completion belongs to the step, not to the user's later edits or retries. */
export function retainTourCompletion(
  completed: ReadonlySet<TourStepId>,
  step: TourStep,
  observation: TourObservation,
): ReadonlySet<TourStepId> {
  if (completed.has(step.id) || !tourStepComplete(step, observation))
    return completed;
  return new Set([...completed, step.id]);
}

export function buildTourSteps(
  familiar: boolean,
  config: Pick<LanguageMapping, 'order' | 'slots'>,
): TourStep[] {
  const intro: TourStep[] = familiar
    ? []
    : [
        { id: 'birman', locale: 'en', keys: ['AltLeft', 'KeyC'], target: '©' },
        {
          id: 'extended',
          locale: 'en',
          keys: ['AltLeft', 'Digit2'],
          target: '¹⁄₂',
        },
        {
          id: 'accent',
          locale: 'en',
          keys: ['AltLeft', 'Digit6', 'KeyA'],
          target: 'â',
        },
      ];
  return [
    ...intro,
    { id: 'quick', locale: 'en', keys: ['AltLeft', 'Minus'], target: '—' },
    { id: 'modes', locale: 'en', keys: ['AltLeft'], targetMode: 2 },
    {
      id: 'stress',
      locale: 'en',
      keys: ['AltLeft', 'Slash', 'KeyA'],
      target: 'á',
    },
    {
      id: 'postfix',
      locale: 'pl',
      keys: ['KeyA', 'ShiftLeft', 'ShiftRight'],
      target: 'ą',
    },
    {
      id: 'hebrew',
      locale: 'he',
      keys: ['AltRight', 'KeyA'],
      initial: 'ש',
      target: 'שְ',
      chord: ['AltRight', 'KeyA'],
    },
    {
      id: 'pair',
      locale: config.order[0],
      keys: ['CapsLock'],
      targetLocale: config.order[1],
    },
    ...config.slots.map((locale, index): TourStep => ({
      id: `slot${index + 1}` as TourStepId,
      locale: locale === config.order[0] ? config.order[1] : config.order[0],
      keys: ['CapsLock', ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'][index]],
      chord: ['CapsLock', ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'][index]],
      targetLocale: locale,
    })),
    {
      id: 'off',
      locale: 'en',
      keys: ['ControlLeft', 'ControlRight'],
      chord: ['ControlLeft', 'ControlRight'],
      targetEnabled: false,
    },
    {
      id: 'on',
      locale: 'en',
      keys: ['ControlLeft', 'ControlRight'],
      chord: ['ControlLeft', 'ControlRight'],
      enabled: false,
      targetEnabled: true,
    },
    { id: 'search', locale: 'en', keys: [], target: '©', spotlight: 'search' },
    { id: 'settings', locale: 'en', keys: [], spotlight: 'settings' },
    { id: 'help', locale: 'en', keys: [], spotlight: 'help' },
  ];
}

/** Include every distinct output, including spacing forms of dead keys and NBSP. */
export const birmanSymbols = [
  ...new Set(
    layout
      .flatMap((key) => [key.primary, key.secondary])
      .flatMap((action) =>
        action.text
          ? [action.text]
          : action.dead
            ? [accents[action.dead].spacing]
            : [],
      ),
  ),
];
export const birmanChallenge = `Birman 3.9: ${birmanSymbols.join(' ')}.`;
export const challengeStep: TourStep = {
  id: 'challenge',
  locale: 'en',
  keys: [],
  target: birmanChallenge,
};
export function challengeProgress(value: string, target = birmanChallenge) {
  const entered = Array.from(value.normalize('NFC'));
  const expected = Array.from(target.normalize('NFC'));
  let matched = 0;
  while (matched < entered.length && entered[matched] === expected[matched])
    matched++;
  return {
    matched,
    total: expected.length,
    error: matched < entered.length,
    complete: matched === expected.length && entered.length === expected.length,
  };
}
