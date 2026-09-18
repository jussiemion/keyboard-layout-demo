'use client';

import SymbolPalette from '@/components/symbol-palette';
import type { PaletteRequest } from '@/components/symbol-action-picker';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import { tourMessages } from '@/lib/tour-messages';

import { SettingsLanguagePicker } from '@/components/settings-language-picker';

import { SymbolMapEditor } from '@/components/symbol-map-editor';
import { ConfigurationTransfer } from '@/components/configuration-transfer';
import {
  configuration,
  type Configuration,
  type DisplayPreferences,
} from '@/lib/configuration-link';
import { configurationMessages } from '@/lib/configuration-messages';
import { UI_LOCALES } from '@/lib/messages';
import { platformNames, PLATFORMS, detectPlatform } from '@/lib/platform';
import { KeyTerminology } from '@/components/key-terminology';

import { ExperimentalLanguageWarning } from '@/components/experimental-language-warning';

import {
  settingsFormClasses,
  settingsSlotsDescriptionClasses,
  settingsSlotHeadingClasses,
  settingsStorageNoteClasses,
} from '@/components/layout-classes';

import { useRef, useState, useLayoutEffect, type RefObject } from 'react';
import { ArrowLeft, ArrowLeftRight, RotateCcw, X } from 'lucide-react';
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
  initialPreferences,
  importedConfiguration,
  importError,
  returnFocusRef,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  initialSettings: UserSettings;
  initialPreferences: DisplayPreferences;
  importedConfiguration?: Configuration | null;
  importError?: boolean;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: UserSettings, preferences: DisplayPreferences) => boolean;
}) {
  const { uiLocale, m } = useLocale();
  const text = settingsMessages[uiLocale];
  const copy = configurationMessages[uiLocale];
  const [draft, setDraft] = useState(
    importedConfiguration?.settings ?? initialSettings,
  );
  const [preferences, setPreferences] = useState(
    importedConfiguration?.preferences ?? initialPreferences,
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [sessionOnly, setSessionOnly] = useState(false);
  const firstSelect = useRef<HTMLButtonElement>(null);
  const [palette, setPalette] = useState<
    (PaletteRequest & { height?: number }) | null
  >(null);
  const paletteTrigger = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    if (palette) {
      dialogRef.current
        ?.querySelector<HTMLInputElement>('.symbol-palette-search input')
        ?.focus({ preventScroll: true });
    } else if (paletteTrigger.current) {
      paletteTrigger.current.focus({ preventScroll: true });
      paletteTrigger.current = null;
    }
  }, [palette]);
  function closePalette() {
    setPalette(null);
  }
  const mapping = draft.languageMapping ?? defaultLanguageMapping();
  const priority = [...mapping.order, ...mapping.slots];

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
    <Dialog
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen && details.reason === 'escape-key' && palette) {
          details.cancel();
          closePalette();
          return;
        }
        if (!nextOpen && details.reason === 'escape-key' && selectedKey) {
          details.cancel();
          dialogRef.current
            ?.querySelector<HTMLButtonElement>('.keycap[aria-pressed="true"]')
            ?.focus({ preventScroll: true });
          setSelectedKey(null);
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        ref={dialogRef}
        className="settings-dialog"
        style={palette ? { height: palette.height } : undefined}
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
        <DialogHeader className="settings-header">
          <div className="flex min-w-0 items-center gap-3">
            {palette && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={closePalette}
                aria-label={tourMessages[uiLocale].back}
              >
                <ArrowLeft size={18} className="rtl:rotate-180" />
              </Button>
            )}
            <DialogTitle className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {palette ? (
                <>
                  <span>{symbolSearchMessages[uiLocale].title}</span>
                  <span
                    className="inline-flex items-center gap-2 whitespace-nowrap"
                    dir="ltr"
                  >
                    <kbd>{palette.keyLabel}</kbd> ·{' '}
                    <span
                      className="inline-mode"
                      data-mode={palette.label.slice(1)}
                    >
                      {palette.label}
                    </span>
                  </span>
                </>
              ) : (
                text.title
              )}
            </DialogTitle>
          </div>
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
        {palette && (
          <div className="symbol-palette-screen">
            <SymbolPalette
              value={palette.value}
              onChoose={(action) => {
                palette.onChoose(action);
                closePalette();
              }}
            />
          </div>
        )}
        <form
          className={settingsFormClasses}
          style={palette ? { display: 'none' } : undefined}
          onSubmit={(event) => {
            event.preventDefault();
            if (onSave(draft, preferences)) {
              onOpenChange(false);
            } else {
              setSessionOnly(true);
            }
          }}
        >
          <div className="settings-body">
            <section className="mb-8" aria-labelledby="settings-general">
              <h3 id="settings-general">{copy.general}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid min-w-0 gap-2 text-sm">
                  <span>{copy.interface}</span>
                  <SettingsLanguagePicker
                    value={preferences.uiLocale}
                    options={UI_LOCALES}
                    priority={priority}
                    label={copy.interface}
                    triggerRef={firstSelect}
                    onValueChange={(uiLocale) =>
                      setPreferences({
                        ...preferences,
                        uiLocale,
                        keyboardLocale: uiLocale,
                      })
                    }
                  />
                </div>
                <div className="grid min-w-0 gap-2 text-sm">
                  <span>{copy.keyboard}</span>
                  <SettingsLanguagePicker
                    value={preferences.keyboardLocale}
                    options={KEYBOARD_LOCALES}
                    priority={priority}
                    label={copy.keyboard}
                    onValueChange={(keyboardLocale) =>
                      setPreferences({ ...preferences, keyboardLocale })
                    }
                  />
                </div>

                {(
                  [
                    [
                      'platform',
                      copy.platform,
                      PLATFORMS.map((id) => [id, platformNames[id]]),
                    ],
                    [
                      'theme',
                      copy.theme,
                      [
                        ['system', copy.system],
                        ['vesper', m.themeDark],
                        ['vesper_light', m.themeLight],
                      ],
                    ],
                  ] as const
                ).map(([field, label, values]) => (
                  <label key={field} className="grid min-w-0 gap-2 text-sm">
                    {label}
                    <select
                      value={preferences[field]}
                      onChange={(event) =>
                        setPreferences({
                          ...preferences,
                          [field]: event.target.value,
                        })
                      }
                    >
                      {values.map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>
            <section aria-labelledby="settings-language-map">
              <h3 id="settings-language-map">{text.map}</h3>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                <KeyTerminology kind="switcher" locale={uiLocale} />
              </p>
              <ExperimentalLanguageWarning />
              <fieldset className="settings-pair mapping-card">
                <legend>
                  <span className="language-mark">S0</span> <kbd>Caps Lock</kbd>
                </legend>
                <p>{text.pairHint}</p>
                <div className="settings-pair-fields">
                  <div className="settings-language-field">
                    <span>{text.first}</span>
                    <SettingsLanguagePicker
                      value={mapping.order[0]}
                      options={KEYBOARD_LOCALES}
                      priority={priority}
                      label={text.first}
                      disabledValue={mapping.order[1]}
                      onValueChange={(locale) =>
                        changeLanguage('order', 0, locale)
                      }
                    />
                  </div>
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
                  <div className="settings-language-field">
                    <span>{text.second}</span>
                    <SettingsLanguagePicker
                      value={mapping.order[1]}
                      options={KEYBOARD_LOCALES}
                      priority={priority}
                      label={text.second}
                      disabledValue={mapping.order[0]}
                      onValueChange={(locale) =>
                        changeLanguage('order', 1, locale)
                      }
                    />
                  </div>
                </div>
              </fieldset>
              <p className={settingsSlotsDescriptionClasses}>
                {text.slotsHint}
              </p>
              <div className="settings-slots-grid">
                {mapping.slots.map((locale, index) => (
                  <div className="mapping-card settings-slot" key={index}>
                    <span className={settingsSlotHeadingClasses}>
                      <span className="language-mark">S{index + 1}</span>
                      <bdi dir="ltr">
                        <kbd>Caps Lock</kbd> +{' '}
                        <kbd>{['J', 'K', 'L', ';'][index]}</kbd>
                      </bdi>
                    </span>
                    <SettingsLanguagePicker
                      value={locale}
                      options={KEYBOARD_LOCALES}
                      priority={priority}
                      label={`S${index + 1}`}
                      onValueChange={(locale) =>
                        changeLanguage('slots', index, locale)
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
            <SymbolMapEditor
              onOpenPalette={(request) => {
                paletteTrigger.current = request.trigger;
                setPalette({
                  ...request,
                  height: dialogRef.current?.getBoundingClientRect().height,
                });
              }}
              selected={selectedKey}
              onSelect={setSelectedKey}
              languageSlots={mapping.slots}
              platform={preferences.platform}
              keyboardLocale={preferences.keyboardLocale}
              value={draft.symbolMap ?? {}}
              onChange={(symbolMap) => setDraft({ ...draft, symbolMap })}
            />
            <ConfigurationTransfer
              value={configuration(draft, preferences)}
              initialError={importError}
              onImport={(value) => {
                setDraft(value.settings);
                setPreferences(value.preferences);
                setSessionOnly(false);
              }}
            />
            {importedConfiguration && (
              <output className="mt-4 block text-sm">{copy.loaded}</output>
            )}
            {sessionOnly && (
              <output className={settingsStorageNoteClasses}>
                {text.sessionOnly}
              </output>
            )}
          </div>
          <footer className="settings-footer">
            <Button
              type="button"
              variant="outline"
              className="settings-reset"
              onClick={() => {
                setDraft(DEFAULT_SETTINGS);
                setPreferences({
                  uiLocale,
                  keyboardLocale: uiLocale,
                  theme: 'system',
                  platform: detectPlatform(navigator),
                });
              }}
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
