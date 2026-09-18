'use client';

import { KeyTerminology } from '@/components/key-terminology';
import {
  helpKeysClasses,
  helpTitleClasses,
  helpCaptionClasses,
  helpSymbolStripClasses,
  helpPairClasses,
} from '@/components/layout-classes';

import { keyboardLabel } from '@/lib/keyboard-locales';

import type { ReactNode } from 'react';
import {
  ResultSymbol,
  ResultSequence,
  HebrewExamples,
} from '@/components/result-symbol';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocale } from '@/components/locale-provider';
import { modifierNames } from '@/lib/keyboard';
import { TranslatedText } from '@/components/translated-text';
import { helpExamples, exampleLanguageName } from '@/lib/help-examples';
import {
  layout,
  actionLabel,
  type LayoutKey,
  type KeyboardLocale,
} from '@/lib/typing-engine';
import { configurationMessages } from '@/lib/configuration-messages';
import { helpMessages } from '@/lib/help-messages';

function Keys({ children }: { children: ReactNode }) {
  return (
    <bdi className={helpKeysClasses} dir="ltr">
      {children}
    </bdi>
  );
}

export function HelpContent({
  layoutKeys = layout,
  keyboardLocale,
  languageConfig,
}: {
  layoutKeys?: readonly LayoutKey[];
  keyboardLocale: KeyboardLocale;
  languageConfig: {
    order: readonly KeyboardLocale[];
    slots: readonly KeyboardLocale[];
  };
}) {
  const { m, platform, uiLocale } = useLocale();
  const h = helpMessages[uiLocale];
  const sample = helpExamples(keyboardLocale);
  const modifiers = modifierNames(platform);
  const modeExamples = [
    layoutKeys.find(
      (key) => key.quick && (key.primary.text || key.primary.dead),
    ),
    layoutKeys.find((key) => key.code === 'KeyC'),
    layoutKeys.find((key) => key.code === 'KeyC'),
  ];
  const stressKey =
    layoutKeys.find((key) => key.secondary.dead === 'acute') ??
    layoutKeys.find((key) => key.primary.dead === 'acute');

  return (
    <>
      <DialogHeader>
        <DialogTitle className={helpTitleClasses}>{h.title}</DialogTitle>
      </DialogHeader>
      <div className="help-sheet">
        <section
          className="help-card help-card-symbols"
          aria-labelledby="help-symbols"
        >
          <h3 id="help-symbols">{h.symbols}</h3>
          <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
            <KeyTerminology kind="modifier" locale={uiLocale} />
          </p>
          <dl className="help-reference help-modes">
            {[h.hold, h.tap, h.twice].map((label, mode) => (
              <div className="help-reference-row" key={mode}>
                <dt>
                  <kbd className="inline-mode" data-mode={mode}>
                    M{mode}
                  </kbd>{' '}
                  <span>
                    <TranslatedText
                      message={label}
                      values={{ alt: <kbd>{modifiers.alt}</kbd> }}
                    />
                  </span>
                </dt>
                <dd>
                  <Keys>
                    <kbd>{modifiers.alt}</kbd>
                    {mode === 2 && (
                      <>
                        → <kbd>{modifiers.alt}</kbd>
                      </>
                    )}
                    {mode === 0 ? ' + ' : ' → '}
                    {modeExamples[mode] ? (
                      <kbd>{modeExamples[mode].label}</kbd>
                    ) : (
                      <em>{configurationMessages[uiLocale].empty}</em>
                    )}{' '}
                    ={' '}
                    <ResultSymbol>
                      {actionLabel(
                        modeExamples[mode]?.[
                          mode === 2 ? 'secondary' : 'primary'
                        ] ?? {},
                      ) || <em>{configurationMessages[uiLocale].empty}</em>}
                    </ResultSymbol>
                  </Keys>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          className="help-card help-card-quick"
          aria-labelledby="help-quick"
        >
          <h3 id="help-quick">{h.quickSymbols}</h3>
          <p className={helpCaptionClasses}>
            <TranslatedText
              message={h.hold}
              values={{ alt: <kbd>{modifiers.alt}</kbd> }}
            />
          </p>{' '}
          <div className={helpSymbolStripClasses}>
            {layoutKeys
              .filter(
                (key) => key.quick && (key.primary.text || key.primary.dead),
              )
              .map((entry) => (
                <Keys key={entry.key}>
                  <kbd>{modifiers.alt}</kbd> + <kbd>{entry.label}</kbd> ={' '}
                  <ResultSymbol>{actionLabel(entry.primary)}</ResultSymbol>
                </Keys>
              ))}
          </div>
        </section>
        <section
          className="help-card help-card-accents"
          aria-labelledby="help-accents"
        >
          <h3 id="help-accents">{h.accents}</h3>
          {keyboardLocale === 'he' ? (
            <p className={helpCaptionClasses}>
              <TranslatedText
                message={m.hebrewInputNote}
                values={{
                  hebrewExamples: <HebrewExamples />,
                  altGr: <kbd>AltGr</kbd>,
                  altKey: <kbd>{modifiers.alt}</kbd>,
                  shiftKey: <kbd>{m.keyShift}</kbd>,
                }}
              />
            </p>
          ) : (
            <>
              <dl className="help-reference help-accents">
                <div>
                  <dt>{h.variants}</dt>
                  <dd>
                    <Keys>
                      <kbd>{sample.letter}</kbd> → <kbd>{m.keyShift}</kbd> ={' '}
                      <ResultSymbol>
                        {sample.cycle.split(' → ')[1] ?? sample.letter}
                      </ResultSymbol>
                    </Keys>
                  </dd>
                </div>
                {stressKey && (
                  <div>
                    <dt>{h.stress}</dt>
                    <dd>
                      <Keys>
                        <kbd>{modifiers.alt}</kbd> →{' '}
                        {stressKey.secondary.dead === 'acute' && (
                          <>
                            <kbd>{modifiers.alt}</kbd> →{' '}
                          </>
                        )}
                        <kbd>{stressKey.label}</kbd> →{' '}
                        <kbd>{sample.letter}</kbd> ={' '}
                        <ResultSymbol>{sample.stressed}</ResultSymbol>
                      </Keys>
                    </dd>
                  </div>
                )}
              </dl>
              <p className={helpCaptionClasses}>
                {exampleLanguageName(sample.language, uiLocale)}:{' '}
                <Keys>
                  <ResultSequence text={sample.cycle} />
                </Keys>
              </p>
            </>
          )}
        </section>
        <section
          className="help-card help-card-languages"
          aria-labelledby="help-languages"
        >
          <h3 id="help-languages">{h.languages}</h3>
          <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
            <KeyTerminology kind="switcher" locale={uiLocale} />
          </p>
          <dl className="help-reference help-mapping">
            <div className="help-reference-row">
              <dt>
                <kbd className="language-mark">S0</kbd>
              </dt>
              <dd className={helpPairClasses}>
                {languageConfig.order.map((language, index) => (
                  <span key={index}>
                    {index > 0 && <span aria-hidden="true"> ↔ </span>}
                    {keyboardLabel(language, uiLocale)}
                  </span>
                ))}
              </dd>
            </div>
            {languageConfig.slots.map((language, index) => (
              <div className="help-reference-row" key={index}>
                <dt>
                  <kbd className="language-mark">S{index + 1}</kbd>
                  <Keys>
                    <kbd className="language-mark">S0</kbd> +{' '}
                    <kbd>{['J', 'K', 'L', ';'][index]}</kbd>
                  </Keys>
                </dt>
                <dd>{keyboardLabel(language, uiLocale)}</dd>
              </div>
            ))}
          </dl>
          <p className={helpCaptionClasses}>
            <TranslatedText
              message={h.pairNote}
              values={{ s0: <kbd className="language-mark">S0</kbd> }}
            />
          </p>
          <p className={helpCaptionClasses}>
            <TranslatedText
              message={h.mappingNote}
              values={{
                s0: <kbd className="language-mark">S0</kbd>,
                keys: (
                  <Keys>
                    {['J', 'K', 'L', ';'].map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </Keys>
                ),
              }}
            />
          </p>
        </section>
        <section
          className="help-card help-card-actions"
          aria-labelledby="help-actions"
        >
          <h3 id="help-actions">{h.actions}</h3>
          <dl className="help-reference help-actions">
            <div>
              <dt>{h.search}</dt>
              <dd>
                <Keys>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <kbd>Ctrl</kbd> + <kbd>F</kbd>
                  </span>{' '}
                  /{' '}
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <kbd>Caps Lock</kbd> + <kbd>F</kbd>
                  </span>
                </Keys>
              </dd>
            </div>
            <div>
              <dt>{h.cancel}</dt>
              <dd>
                <Keys>
                  <kbd>Esc</kbd>
                </Keys>
              </dd>
            </div>
            <div>
              <dt>{h.title}</dt>
              <dd>
                <Keys>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <kbd>Ctrl</kbd> + <kbd>H</kbd>
                  </span>{' '}
                  /{' '}
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <kbd>Caps Lock</kbd> + <kbd>H</kbd>
                  </span>
                </Keys>
              </dd>
            </div>
            <div>
              <dt>{h.toggle}</dt>
              <dd>
                <TranslatedText
                  message={h.toggleKeys}
                  values={{ ctrl: <kbd>{modifiers.control}</kbd> }}
                />
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
