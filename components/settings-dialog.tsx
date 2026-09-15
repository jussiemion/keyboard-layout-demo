'use client';

import { languageComparator } from '@/lib/language-priority';

import { ExperimentalLanguageWarning } from '@/components/experimental-language-warning';

import {
  settingsFormClasses,
  settingsSlotsDescriptionClasses,
  settingsSlotHeadingClasses,
  settingsStorageNoteClasses,
} from '@/components/layout-classes';

import { keyboardLabel, isExperimentalKeyboard } from '@/lib/keyboard-locales';

import { useRef, useState, type RefObject } from 'react';
import { ArrowLeftRight, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useLocale } from '@/components/locale-provider';

import { KEYBOARD_LOCALES, type KeyboardLocale } from '@/lib/typing-engine';
import {
  DEFAULT_SETTINGS,
  defaultLanguageMapping,
  type UserSettings,
} from '@/lib/settings';
import { settingsMessages } from '@/lib/settings-messages';

export function SettingsDialog({
  open,
  initialSettings,
  returnFocusRef,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  initialSettings: UserSettings;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: UserSettings) => boolean;
}) {
  const { uiLocale, m } = useLocale();
  const text = settingsMessages[uiLocale];
  const [draft, setDraft] = useState(initialSettings);
  const [sessionOnly, setSessionOnly] = useState(false);
  const firstSelect = useRef<HTMLSelectElement>(null);
  const mapping = draft.languageMapping ?? defaultLanguageMapping();
  const options = KEYBOARD_LOCALES.toSorted(
    languageComparator(
      uiLocale,
      [...mapping.order, ...mapping.slots],
      (locale) => keyboardLabel(locale, uiLocale),
    ),
  );

  function changeLanguage(
    group: 'order' | 'slots',
    index: number,
    value: KeyboardLocale,
  ) {
    const next = [...mapping[group]];
    next[index] = value;
    setDraft({ ...draft, languageMapping: { ...mapping, [group]: next } });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="settings-dialog"
        showCloseButton={false}
        dir={['he', 'ar'].includes(uiLocale) ? 'rtl' : 'ltr'}
        initialFocus={(interaction) => {
          if (interaction === 'touch') {
            return true;
          }
          firstSelect.current?.focus();
          return false;
        }}
        finalFocus={() => returnFocusRef.current}
      >
        <form
          className={settingsFormClasses}
          onSubmit={(event) => {
            event.preventDefault();
            if (onSave(draft)) {
              onOpenChange(false);
            } else {
              setSessionOnly(true);
            }
          }}
        >
          <DialogHeader className="settings-header">
            <DialogTitle>{text.title}</DialogTitle>
          </DialogHeader>
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="settings-close"
                aria-label={text.close}
              />
            }
          >
            <X size={18} />
          </DialogClose>
          <div className="settings-body">
            <section aria-labelledby="settings-language-map">
              <h3 id="settings-language-map">{text.map}</h3>
              <ExperimentalLanguageWarning />
              <fieldset className="settings-pair mapping-card">
                <legend>
                  <span className="language-mark">S0</span> <kbd>Caps Lock</kbd>
                </legend>
                <p>{text.pairHint}</p>
                <div className="settings-pair-fields">
                  <label>
                    <span>{text.first}</span>
                    <select
                      ref={firstSelect}
                      value={mapping.order[0]}
                      onChange={(e) =>
                        changeLanguage(
                          'order',
                          0,
                          e.target.value as KeyboardLocale,
                        )
                      }
                    >
                      {options.map((locale) => (
                        <option
                          key={locale}
                          value={locale}
                          disabled={locale === mapping.order[1]}
                        >
                          {keyboardLabel(locale, uiLocale)}
                          {isExperimentalKeyboard(locale)
                            ? ` — ${m.experimental}`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="settings-swap"
                    aria-label={text.swap}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        languageMapping: {
                          ...mapping,
                          order: [mapping.order[1], mapping.order[0]],
                        },
                      })
                    }
                  >
                    <ArrowLeftRight size={18} />
                  </Button>
                  <label>
                    <span>{text.second}</span>
                    <select
                      value={mapping.order[1]}
                      onChange={(e) =>
                        changeLanguage(
                          'order',
                          1,
                          e.target.value as KeyboardLocale,
                        )
                      }
                    >
                      {options.map((locale) => (
                        <option
                          key={locale}
                          value={locale}
                          disabled={locale === mapping.order[0]}
                        >
                          {keyboardLabel(locale, uiLocale)}
                          {isExperimentalKeyboard(locale)
                            ? ` — ${m.experimental}`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </fieldset>
              <p className={settingsSlotsDescriptionClasses}>
                {text.slotsHint}
              </p>
              <div className="settings-slots-grid">
                {mapping.slots.map((locale, index) => (
                  <label className="mapping-card settings-slot" key={index}>
                    <span className={settingsSlotHeadingClasses}>
                      <span className="language-mark">S{index + 1}</span>
                      <bdi dir="ltr">
                        <kbd>Caps Lock</kbd> +{' '}
                        <kbd>{['J', 'K', 'L', ';'][index]}</kbd>
                      </bdi>
                    </span>
                    <select
                      value={locale}
                      aria-label={`S${index + 1}`}
                      onChange={(e) =>
                        changeLanguage(
                          'slots',
                          index,
                          e.target.value as KeyboardLocale,
                        )
                      }
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {keyboardLabel(option, uiLocale)}
                          {isExperimentalKeyboard(option)
                            ? ` — ${m.experimental}`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>
            <label className="settings-hints" htmlFor="settings-show-hints">
              <span>
                <strong>{text.hints}</strong>
                <span>{text.hintsDescription}</span>
              </span>
              <input
                id="settings-show-hints"
                aria-label={text.hints}
                type="checkbox"
                role="switch"
                aria-checked={draft.showHints}
                checked={draft.showHints}
                onChange={(e) =>
                  setDraft({ ...draft, showHints: e.target.checked })
                }
              />
            </label>
            {sessionOnly && (
              <output className={settingsStorageNoteClasses}>
                {text.sessionOnly}
              </output>
            )}
          </div>
          <footer className="settings-footer">
            <Button
              type="button"
              variant="ghost"
              className="settings-reset"
              onClick={() => setDraft(DEFAULT_SETTINGS)}
            >
              <RotateCcw size={16} />
              {text.reset}
            </Button>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {sessionOnly ? text.close : text.cancel}
              </Button>
              <Button type="submit" className="settings-save">
                {text.save}
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
