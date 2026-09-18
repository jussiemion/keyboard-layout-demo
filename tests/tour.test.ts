import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  birmanChallenge,
  birmanSymbols,
  buildTourSteps,
  challengeProgress,
  parseTourChoice,
  tourStepComplete,
  retainTourCompletion,
  type TourStepId,
} from '../lib/tour.ts';
import { defaultLanguageMapping } from '../lib/settings.ts';
import {
  TypingEngine,
  layout,
  accents,
  baseKey,
} from '../lib/typing-engine.ts';
import { tourMessages } from '../lib/tour-messages.ts';

void test('familiarity only skips the Birman introduction', () => {
  const config = defaultLanguageMapping();
  const full = buildTourSteps(false, config);
  const familiar = buildTourSteps(true, config);
  assert.deepEqual(
    full.slice(0, 3).map((s) => s.id),
    ['birman', 'extended', 'accent'],
  );
  assert.deepEqual(full.slice(3), familiar);
  assert.equal(new Set(full.map((s) => s.id)).size, full.length);
});

void test('language exercises use custom mappings and start outside the target even for duplicate slots', () => {
  const config = {
    order: ['he', 'de'] as const,
    slots: ['he', 'de', 'he', 'pl'] as const,
  };
  const plan = buildTourSteps(true, config);
  assert.equal(plan.find((s) => s.id === 'pair')?.targetLocale, 'de');
  for (const [i, step] of plan
    .filter((s) => s.id.startsWith('slot'))
    .entries()) {
    assert.equal(step.targetLocale, config.slots[i]);
    assert.notEqual(step.locale, step.targetLocale);
    assert.deepEqual(step.chord, [
      'CapsLock',
      ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'][i],
    ]);
  }
});

void test('exercise checks require the intended result, preserving NBSP and normalizing accents', () => {
  const state = {
    value: '',
    mode: 0 as const,
    locale: 'en' as const,
    enabled: true,
    settingsOpen: false,
    helpOpen: false,
  };
  const plan = buildTourSteps(false, defaultLanguageMapping());
  assert.equal(tourStepComplete(plan[0], state), false);
  assert.equal(tourStepComplete(plan[0], { ...state, value: '©' }), true);
  assert.equal(tourStepComplete(plan[0], { ...state, value: '©x' }), false);
  assert.equal(
    tourStepComplete(
      plan.find((s) => s.id === 'stress')!,
      { ...state, value: 'a\u0301' },
    ),
    true,
  );
  assert.equal(
    tourStepComplete(
      plan.find((s) => s.id === 'off')!,
      state,
    ),
    false,
  );
  assert.equal(
    tourStepComplete(
      plan.find((s) => s.id === 'off')!,
      { ...state, enabled: false },
    ),
    true,
  );
  assert.equal(
    tourStepComplete(
      plan.find((s) => s.id === 'settings')!,
      { ...state, settingsOpen: true },
    ),
    true,
  );
});

void test('every Birman output in the optional text is producible through the current engine', () => {
  for (const entry of layout) {
    for (const [index, action] of [entry.primary, entry.secondary].entries()) {
      const expected =
        action.text ?? (action.dead ? accents[action.dead].spacing : undefined);
      if (!expected) {
        continue;
      }
      assert.ok(birmanSymbols.includes(expected));
      assert.ok(birmanChallenge.includes(expected));
      const engine = new TypingEngine();
      engine.selectMode(index === 0 ? 1 : 2);
      const result = engine.handle(
        { code: entry.code, key: baseKey(entry.code, 'en'), down: true },
        'en',
      );
      engine.handle({ code: entry.code, down: false }, 'en');
      const output = action.dead
        ? engine.handle({ code: 'Space', key: ' ', down: true }, 'en').text
        : result.text;
      assert.equal(output, expected, `${entry.code} M${index + 1}`);
    }
  }
  assert.ok(birmanSymbols.includes('\u00a0'));
});

void test('challenge progress marks the first mismatch and does not accept a prefix or extra input', () => {
  assert.equal(challengeProgress(birmanChallenge).complete, true);
  assert.equal(challengeProgress(birmanChallenge + 'x').complete, false);
  assert.equal(challengeProgress(birmanChallenge.slice(0, -1)).complete, false);
  assert.deepEqual(challengeProgress('aX', 'abc'), {
    matched: 1,
    total: 3,
    error: true,
    complete: false,
  });
  assert.equal(challengeProgress(' ', '\u00a0').complete, false);
});

void test('only known persisted choices suppress the invitation', () => {
  for (const choice of ['declined', 'started', 'completed']) {
    assert.equal(parseTourChoice(choice), choice);
  }
  for (const value of [null, '', 'garbage', '{}']) {
    assert.equal(parseTourChoice(value), null);
  }
});

void test('all interface languages provide the same tour controls, tasks and placeholders', () => {
  for (const [locale, messages] of Object.entries(tourMessages)) {
    assert.deepEqual(
      Object.keys(messages).sort(),
      Object.keys(tourMessages.en).sort(),
      locale,
    );
    for (const [key, source] of Object.entries(tourMessages.en.steps)) {
      const translated = messages.steps[key as keyof typeof messages.steps];
      assert.ok(translated?.length, `${locale}:${key}`);
      assert.deepEqual(
        [
          ...new Set(
            [...translated.matchAll(/\{\w+\}/g)]
              .map((m) => m[0])
              .filter((token) => token !== '{plainA}'),
          ),
        ].sort(),
        [
          ...new Set(
            [...source.matchAll(/\{\w+\}/g)]
              .map((m) => m[0])
              .filter((token) => token !== '{plainA}'),
          ),
        ].sort(),
        `${locale}:${key}`,
      );
    }
  }
});

void test('declines persist, and denied storage still remembers the choice in this session', async () => {
  const { rememberTour, readTourChoice, TOUR_STORAGE_KEY } =
    await import('../lib/tour.ts');
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const stored = new Map<string, string>();
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => stored.set(key, value),
      },
    });
    assert.equal(rememberTour('declined'), true);
    assert.equal(stored.get(TOUR_STORAGE_KEY), 'declined');
    assert.equal(readTourChoice(), 'declined');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    assert.equal(rememberTour('started'), false);
    assert.equal(readTourChoice(), 'started');
  } finally {
    if (original) {
      Object.defineProperty(globalThis, 'localStorage', original);
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  }
});

void test('successful steps stay complete after edits, retries and revisits', () => {
  const steps = buildTourSteps(false, defaultLanguageMapping());
  const state = {
    value: '',
    mode: 0 as const,
    locale: 'en' as const,
    enabled: true,
    settingsOpen: false,
    helpOpen: false,
  };
  const empty = new Set<TourStepId>();
  assert.equal(retainTourCompletion(empty, steps[0], state), empty);
  const completed = retainTourCompletion(empty, steps[0], {
    ...state,
    value: '©',
  });
  assert.equal(completed.has('birman'), true);
  assert.equal(retainTourCompletion(completed, steps[0], state), completed);
  assert.equal(
    retainTourCompletion(completed, steps[0], { ...state, value: 'wrong' }),
    completed,
  );
  const next = retainTourCompletion(completed, steps[1], {
    ...state,
    value: '¹⁄₂',
  });
  assert.equal(next.has('extended'), true);
  assert.equal(next.has('birman'), true);
  assert.equal(retainTourCompletion(next, steps[0], state), next);
  assert.equal(next.has('postfix'), false);
});

void test('customization step completes on opening settings and retains completion', () => {
  const plan = buildTourSteps(false, defaultLanguageMapping());
  const step = plan.find((item) => item.id === 'customize')!;
  assert.ok(step);
  const observation = {
    value: '',
    mode: 0 as const,
    locale: 'en' as const,
    enabled: true,
    settingsOpen: false,
    helpOpen: false,
  };
  assert.equal(tourStepComplete(step, observation), false);
  const completed = retainTourCompletion(new Set(), step, {
    ...observation,
    settingsOpen: true,
  });
  assert.ok(completed.has('customize'));
  assert.equal(retainTourCompletion(completed, step, observation), completed);
  assert.ok(!completed.has('settings'));
});
