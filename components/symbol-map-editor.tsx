'use client';

import { SymbolActionPicker } from '@/components/symbol-action-picker';
import { OnScreenKeyboard } from '@/components/on-screen-keyboard';

import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { TranslatedText } from '@/components/translated-text';
import { ResultSymbol } from '@/components/result-symbol';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import {
  actionLabel,
  baseKey,
  layout,
  type Action,
  type KeyboardLocale,
} from '@/lib/typing-engine';
import { modifierNames } from '@/lib/keyboard';
import type { Platform } from '@/lib/platform';
import {
  resolveSymbolMap,
  validAction,
  type SymbolMap,
} from '@/lib/symbol-map';
import { configurationMessages } from '@/lib/configuration-messages';

export function SymbolMapEditor({
  value,
  selected,
  onSelect,
  platform,
  keyboardLocale,
  languageSlots,
  onChange,
}: {
  value: SymbolMap;
  selected: string | null;
  onSelect: (key: string | null) => void;
  platform: Platform;
  keyboardLocale: KeyboardLocale;
  languageSlots: readonly KeyboardLocale[];
  onChange: (value: SymbolMap) => void;
}) {
  const { uiLocale } = useLocale();
  const text = configurationMessages[uiLocale];
  const alt = <kbd>{modifierNames(platform).alt}</kbd>;
  const modeMarks = Object.fromEntries(
    [0, 1, 2].map((mode) => [
      `m${mode}`,
      <span key={mode} className="inline-mode" data-mode={mode}>
        M{mode}
      </span>,
    ]),
  );
  const keyboardFrame = useCallback((frame: HTMLDivElement | null) => {
    if (!frame) {
      return;
    }
    const fit = () => {
      frame.style.setProperty(
        '--keyboard-scale',
        String(frame.clientWidth / 960),
      );
    };
    fit();
    let pendingFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(fit);
    });
    observer.observe(frame);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(pendingFrame);
    };
  }, []);
  const [invalid, setInvalid] = useState(false);
  const keys = resolveSymbolMap(value);
  const entry = keys.find((key) => key.key === selected);
  const original = layout.find((key) => key.key === selected);

  function update(field: 'primary' | 'secondary', action: Action) {
    if (!selected || !original) {
      return;
    }
    if (!validAction(action)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    const next = {
      ...value,
      [selected]: { ...value[selected], [field]: action },
    };
    if (JSON.stringify(action) === JSON.stringify(original[field])) {
      delete next[selected][field];
    }
    if (!Object.keys(next[selected]).length) {
      delete next[selected];
    }
    onChange(next);
  }

  return (
    <section className="mt-8 space-y-4" aria-labelledby="settings-symbol-map">
      <h3 id="settings-symbol-map">{text.symbols}</h3>
      <p>
        <TranslatedText message={text.symbolHelp} values={modeMarks} />
      </p>
      <div
        className="border-border bg-background overflow-x-auto rounded-xl border p-3"
        dir="ltr"
      >
        <div ref={keyboardFrame} className="keyboard-frame min-w-[720px]">
          <OnScreenKeyboard
            platform={platform}
            locale={keyboardLocale}
            layoutKeys={keys}
            languageSlots={languageSlots}
            editableOnly
            appearance="editor"
            showStatusIndicators={false}
            showModeIndicators={false}
            showLanguageIndicators={false}
            preserveInputFocus={false}
            showAllSymbols
            selectedKey={entry?.code}
            changedKeys={keys
              .filter((key) => value[key.key])
              .map((key) => key.code)}
            changedLabel={text.custom}
            onKeyPress={(code) => {
              const key = keys.find((item) => item.code === code);
              if (key) {
                onSelect(key.key);
                setInvalid(false);
              }
            }}
          />
        </div>
      </div>
      {selected && entry && original && (
        <div id="symbol-key-editor" className="mapping-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <strong>
              {text.key} <kbd>{entry.label || entry.code}</kbd>
            </strong>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!value[selected]}
              onClick={() => {
                const next = { ...value };
                delete next[selected];
                onChange(next);
                setInvalid(false);
              }}
            >
              <RotateCcw size={14} />
              {text.resetKey}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['primary', 'secondary'] as const).map((field, index) => (
              <fieldset
                key={`${selected}-${field}`}
                className="min-w-0 space-y-2"
              >
                <legend className="mb-2 text-sm font-semibold">
                  <span className="inline-mode" data-mode={index + 1}>
                    M{index + 1}
                  </span>
                </legend>
                <SymbolActionPicker
                  value={entry[field]}
                  label={`M${index + 1}`}
                  onChange={(action) => update(field, action)}
                />
                <p>
                  {text.original}:{' '}
                  <bdi>
                    {actionLabel(original[field]) || <em>{text.empty}</em>}
                  </bdi>
                </p>
              </fieldset>
            ))}
          </div>
          <div className="pt-2">
            <div className="border-border bg-card space-y-3 rounded-lg border p-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  className="accent-primary size-4 shrink-0"
                  aria-describedby="quick-entry-description"
                  checked={entry.quick}
                  onChange={(event) => {
                    const next = {
                      ...value,
                      [selected]: {
                        ...value[selected],
                        quick: event.target.checked,
                      },
                    };
                    if (event.target.checked === original.quick) {
                      delete next[selected].quick;
                    }
                    if (!Object.keys(next[selected]).length) {
                      delete next[selected];
                    }
                    onChange(next);
                  }}
                />
                <span>
                  <TranslatedText
                    message={text.quick}
                    values={{ alt, ...modeMarks }}
                  />
                </span>
              </label>
              <p id="quick-entry-description">
                <TranslatedText
                  message={text.quickHelp}
                  values={{
                    alt,
                    key: (
                      <kbd>
                        {baseKey(entry.code, keyboardLocale, false, false) ||
                          entry.label}
                      </kbd>
                    ),
                    ...modeMarks,
                  }}
                />
              </p>
              <div className="flex justify-start">
                <div
                  className="flex max-w-full flex-wrap items-center gap-2 text-sm"
                  dir="ltr"
                >
                  {alt}
                  <span>+</span>
                  <kbd>
                    {baseKey(entry.code, keyboardLocale, false, false) ||
                      entry.label}
                  </kbd>
                  <span>→</span>
                  {actionLabel(entry.primary) ? (
                    <ResultSymbol>{actionLabel(entry.primary)}</ResultSymbol>
                  ) : (
                    <em>{text.empty}</em>
                  )}
                  <span className="text-muted-foreground">
                    ({modeMarks.m1})
                  </span>
                </div>
              </div>
            </div>
          </div>
          {invalid && <p role="alert">{text.invalidSymbol}</p>}
        </div>
      )}
    </section>
  );
}
