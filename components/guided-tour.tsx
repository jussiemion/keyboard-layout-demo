'use client';

import { KeyTerminology } from '@/components/key-terminology';
import {
  tourKeySequenceClasses,
  tourEyebrowClasses,
  tourMutedClasses,
  tourErrorClasses,
} from '@/components/layout-classes';

import { keyboardLabel } from '@/lib/keyboard-locales';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, GraduationCap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { ResultSymbol } from '@/components/result-symbol';
import { TranslatedText } from '@/components/translated-text';
import { modifierNames } from '@/lib/keyboard';

import { helpMessages } from '@/lib/help-messages';
import { headerMenuMessages } from '@/lib/header-menu-messages';
import { tourMessages } from '@/lib/tour-messages';
import {
  buildTourSteps,
  challengeStep,
  challengeProgress,
  readTourChoice,
  rememberTour,
  TOUR_STORAGE_KEY,
  retainTourCompletion,
  type TourStepId,
  type TourObservation,
  type TourStep,
} from '@/lib/tour';
import type { LanguageMapping } from '@/lib/settings';

export function TourInvitation({ onStart }: { onStart: () => void }) {
  const { uiLocale } = useLocale();
  const t = tourMessages[uiLocale];
  const [state, setState] = useState<'hidden' | 'offer' | 'declined'>('hidden');
  const [persisted, setPersisted] = useState(true);
  useEffect(() => {
    // No dialog, autofocus, or interruption of the user's first keystrokes.
    const timer = window.setTimeout(() => {
      if (!readTourChoice()) {
        setState('offer');
      }
    }, 4000);
    const sync = (event: StorageEvent) => {
      if (event.key === TOUR_STORAGE_KEY && event.newValue) {
        setState('hidden');
      }
    };
    window.addEventListener('storage', sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('storage', sync);
    };
  }, []);
  if (state === 'hidden') {
    return null;
  }
  return (
    <aside className="tour-invitation" aria-label={t.menu}>
      <GraduationCap aria-hidden="true" size={20} />
      <div className="tour-invitation-copy" aria-live="polite">
        <strong>{state === 'offer' ? t.invite : t.later}</strong>
        <p>
          {state === 'offer' ? t.inviteBody : !persisted ? t.storageNote : ''}
        </p>
      </div>
      <div className="tour-buttons">
        {state === 'offer' ? (
          <>
            <Button size="sm" onClick={onStart}>
              {t.start}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setPersisted(rememberTour('declined'));
                setState('declined');
              }}
            >
              {t.decline}
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setState('hidden')}
          >
            {t.ack}
          </Button>
        )}
      </div>
    </aside>
  );
}

export function GuidedTour({
  config,
  observation,
  onPrepare,
  onFinish,
  onChord,
  onKey,
}: {
  config: Pick<LanguageMapping, 'order' | 'slots'>;
  observation: TourObservation;
  onPrepare: (step: TourStep | null) => void;
  onFinish: (completed: boolean) => void;
  onChord: (keys: string[]) => void;
  onKey: (code: string) => void;
}) {
  const { uiLocale, m, platform } = useLocale();
  const t = tourMessages[uiLocale];
  const h = helpMessages[uiLocale];
  const menu = headerMenuMessages[uiLocale];
  const modifiers = modifierNames(platform);
  const [stage, setStage] = useState<
    'question' | 'exercise' | 'optional' | 'challenge' | 'done'
  >('question');
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<ReadonlySet<TourStepId>>(
    () => new Set(),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  const step =
    stage === 'challenge'
      ? challengeStep
      : stage === 'exercise'
        ? steps[index]
        : undefined;
  // A completed step stays available even after edits, retries or back navigation.
  const nextCompleted = step
    ? retainTourCompletion(completed, step, observation)
    : completed;
  if (nextCompleted !== completed) {
    setCompleted(nextCompleted);
  }
  const success = Boolean(step && nextCompleted.has(step.id));

  useEffect(() => {
    if (stage !== 'exercise' || !success) {
      return;
    }
    function advanceOnEnter(event: KeyboardEvent) {
      if (
        event.key !== 'Enter' ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented ||
        observation.settingsOpen ||
        observation.helpOpen ||
        document.querySelector(
          '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]',
        )
      ) {
        return;
      }
      const button = nextButton.current;
      if (!button || button.disabled) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!event.repeat) {
        button.click();
      }
    }
    window.addEventListener('keydown', advanceOnEnter, true);
    return () => window.removeEventListener('keydown', advanceOnEnter, true);
  }, [stage, success, observation.settingsOpen, observation.helpOpen]);

  function visit(next: number, plan = steps) {
    if (next >= plan.length) {
      setStage('optional');
      onPrepare(null);
      return;
    }
    setIndex(next);
    setStage('exercise');
    onPrepare(plan[next]);
  }
  function answer(familiar: boolean) {
    const plan = buildTourSteps(familiar, config);
    setSteps(plan);
    visit(0, plan);
  }
  function finishExercises() {
    setStage('done');
    onPrepare(null);
  }
  const slotIndex = step?.id.startsWith('slot')
    ? Number(step.id.slice(4)) - 1
    : -1;
  const bodyKey = slotIndex >= 0 ? 'slot' : step?.id;
  const titles: Record<string, ReactNode> = {
    birman: (
      <>
        Birman ·{' '}
        <kbd className="inline-mode" data-mode="1">
          M1
        </kbd>
      </>
    ),
    extended: (
      <>
        Birman ·{' '}
        <kbd className="inline-mode" data-mode="2">
          M2
        </kbd>
      </>
    ),
    accent: `Birman · ${h.accents}`,
    quick: h.quickSymbols,
    modes: h.symbols,
    stress: h.accents,
    postfix: `${h.accents} · PL`,
    hebrew: `${h.accents} · HE`,
    pair: h.languages,
    slot: h.languages,
    off: h.toggle,
    on: h.toggle,
    search: h.search,
    settings: menu.settings,
    help: h.title,
  };
  const title =
    stage === 'question'
      ? t.question
      : stage === 'optional' || stage === 'challenge'
        ? t.optional
        : stage === 'done'
          ? t.done
          : titles[bodyKey ?? ''];
  const progress = challengeProgress(
    success && stage === 'challenge'
      ? (challengeStep.target ?? '')
      : observation.value,
  );
  const instructionValues = {
    alt: <kbd>{modifiers.alt}</kbd>,
    ctrl: <kbd>{modifiers.control}</kbd>,
    shift: <kbd>Shift</kbd>,
    esc: <kbd>Esc</kbd>,
    capsLock: <kbd>Caps Lock</kbd>,
    altGr: <kbd>AltGr</kbd>,
    space: <kbd>{m.space}</kbd>,
    keyC: <kbd>C</kbd>,
    keyF: <kbd>F</kbd>,
    keyH: <kbd>H</kbd>,
    keyA: <kbd>A</kbd>,
    lowerA: <kbd>a</kbd>,
    key2: <kbd>2</kbd>,
    key6: <kbd>6</kbd>,
    slash: <kbd>/</kbd>,
    minus: <kbd>−</kbd>,
    searchChord: (
      <span className={tourKeySequenceClasses}>
        <kbd>Caps Lock</kbd> + <kbd>F</kbd>
      </span>
    ),
    helpChord: (
      <span className={tourKeySequenceClasses}>
        <kbd>Caps Lock</kbd> + <kbd>H</kbd>
      </span>
    ),
    copyright: <ResultSymbol>©</ResultSymbol>,
    fraction: <ResultSymbol>¹⁄₂</ResultSymbol>,
    circumflex: <ResultSymbol>â</ResultSymbol>,
    stressed: <ResultSymbol>á</ResultSymbol>,
    ogonek: <ResultSymbol>ą</ResultSymbol>,
    plainA: <ResultSymbol>a</ResultSymbol>,
    nbsp: <ResultSymbol>⍽</ResultSymbol>,
    s0: <kbd className="language-mark">S0</kbd>,
    slot: <kbd className="language-mark">S{slotIndex + 1}</kbd>,
    slots: (
      <span className={tourKeySequenceClasses}>
        {[1, 2, 3, 4].map((n) => (
          <kbd className="language-mark" key={n}>
            S{n}
          </kbd>
        ))}
      </span>
    ),
    m2: (
      <kbd className="inline-mode" data-mode="2">
        M2
      </kbd>
    ),
    key: <kbd>{['J', 'K', 'L', ';'][slotIndex]}</kbd>,
  };
  const progressLabel = t.progress
    .replace('{current}', String(index + 1))
    .replace('{total}', String(steps.length));
  return (
    <section
      className="tour-panel"
      aria-labelledby="tour-title"
      data-stage={stage}
    >
      <div className="tour-topline">
        <div className="tour-heading">
          <div className="tour-meta">
            <span className={tourEyebrowClasses}>
              <GraduationCap size={18} aria-hidden="true" />
              {t.menu}
            </span>
            {stage === 'exercise' && (
              <div className="tour-progress">
                <span>{progressLabel}</span>
                <progress
                  max={steps.length}
                  value={index + 1}
                  aria-label={progressLabel}
                />
              </div>
            )}
          </div>
          <h2 id="tour-title" ref={heading} tabIndex={-1}>
            {title}
          </h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label={t.exit}
          onClick={() => onFinish(stage === 'done')}
        >
          <X size={18} />
        </Button>
      </div>
      {stage === 'question' && (
        <>
          <p>{t.questionBody}</p>
          <p className={tourMutedClasses}>{t.practice}</p>
          <div className="tour-buttons">
            <Button onClick={() => answer(false)}>{t.no}</Button>
            <Button variant="outline" onClick={() => answer(true)}>
              {t.yes}
            </Button>
          </div>
        </>
      )}
      {step && (
        <>
          {stage === 'exercise' && (
            <>
              {step.target !== undefined ? (
                <div className="tour-target">
                  <span>{t.type}</span>
                  <samp
                    className="result-symbol"
                    dir={
                      ['he', 'ar'].includes(step.locale ?? 'en') ? 'rtl' : 'ltr'
                    }
                  >
                    {step.target}
                  </samp>
                </div>
              ) : step.targetLocale ? (
                <div className="tour-target">
                  <span>{t.switchTo}</span>
                  <strong>{keyboardLabel(step.targetLocale, uiLocale)}</strong>
                </div>
              ) : null}
              {['modes', 'pair', 'slot'].includes(bodyKey ?? '') && (
                <p className={tourMutedClasses}>
                  <KeyTerminology
                    kind={bodyKey === 'modes' ? 'modifier' : 'switcher'}
                    locale={uiLocale}
                  />
                </p>
              )}
              <p id="tour-instruction" className="tour-instruction">
                <TranslatedText
                  message={t.steps[bodyKey as keyof typeof t.steps]}
                  values={instructionValues}
                />
              </p>
            </>
          )}
          {stage === 'challenge' ? (
            <>
              <p id="tour-instruction" className={tourMutedClasses}>
                <TranslatedText
                  message={t.spaceNote}
                  values={instructionValues}
                />
              </p>
              <div
                className="tour-challenge-text"
                dir="ltr"
                aria-label={t.type}
              >
                {Array.from(challengeStep.target ?? '').map((char, i) => (
                  <span
                    key={i}
                    data-passed={i < progress.matched}
                    data-error={i === progress.matched && progress.error}
                  >
                    {char === '\u00a0' ? '⍽' : char}
                  </span>
                ))}
              </div>
              <div className="tour-progress">
                <span>
                  {progress.matched} / {progress.total}
                </span>
                <progress
                  max={progress.total}
                  value={progress.matched}
                  aria-label={t.type}
                />
              </div>
              {progress.error && (
                <p className={tourErrorClasses} aria-live="polite">
                  {t.error}
                </p>
              )}
            </>
          ) : null}
          {!step.chord && step.keys.length > 0 && (
            <div className="tour-touch-keys" aria-label={m.keyboardLanguage}>
              {step.keys
                .filter((code) => code !== 'ShiftRight')
                .map((code) => (
                  <Button
                    key={code}
                    variant="outline"
                    data-tour-key-code={code}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onKey(code)}
                  >
                    {code === 'CapsLock' ? (
                      <span className="language-mark">S0</span>
                    ) : code.startsWith('Alt') ? (
                      modifiers.alt
                    ) : code.startsWith('Shift') ? (
                      'Shift'
                    ) : code.startsWith('Key') ? (
                      code === 'KeyA' &&
                      ['accent', 'stress', 'postfix'].includes(step.id) ? (
                        'a'
                      ) : (
                        code.slice(3)
                      )
                    ) : code.startsWith('Digit') ? (
                      code.slice(5)
                    ) : code === 'Minus' ? (
                      '−'
                    ) : code === 'Slash' ? (
                      '/'
                    ) : (
                      code
                    )}
                  </Button>
                ))}
            </div>
          )}
          <div className="tour-footer">
            <div className="tour-status" aria-live="polite">
              {success && (
                <>
                  <Check size={16} aria-hidden="true" />
                  {t.success}
                </>
              )}
            </div>
            <div className="tour-buttons">
              {step.chord && !success && (
                <Button variant="outline" onClick={() => onChord(step.chord!)}>
                  {t.screenChord}
                </Button>
              )}
              <Button
                ref={nextButton}
                aria-keyshortcuts={
                  stage === 'exercise' && success ? 'Enter' : undefined
                }
                disabled={!success}
                onClick={() =>
                  stage === 'challenge' ? finishExercises() : visit(index + 1)
                }
              >
                {stage === 'challenge' ? t.finish : t.next}
              </Button>
              {stage === 'exercise' && (
                <Button variant="outline" onClick={() => visit(index + 1)}>
                  {t.skip}
                </Button>
              )}
              {stage === 'exercise' && index > 0 && (
                <Button variant="outline" onClick={() => visit(index - 1)}>
                  {t.back}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  onPrepare(step);
                }}
              >
                {t.retry}
              </Button>
            </div>
          </div>
        </>
      )}
      {stage === 'optional' && (
        <>
          <p>{t.optionalBody}</p>
          <div className="tour-buttons">
            <Button
              onClick={() => {
                setStage('challenge');
                onPrepare(challengeStep);
              }}
            >
              {t.startTest}
            </Button>
            <Button variant="outline" onClick={finishExercises}>
              {t.finish}
            </Button>
          </div>
        </>
      )}
      {stage === 'done' && (
        <>
          <p>{t.doneBody}</p>
          <div className="tour-buttons">
            <Button onClick={() => onFinish(true)}>{t.finish}</Button>
          </div>
        </>
      )}
    </section>
  );
}
