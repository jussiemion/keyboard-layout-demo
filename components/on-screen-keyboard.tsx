'use client';

import { useMemo, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Delete,
  CornerDownLeft,
} from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import {
  arrowClusterClasses,
  homeMarkClasses,
} from '@/components/layout-classes';
import { getKeyboardRows, modifierNames, type Keycap } from '@/lib/keyboard';
import { keyboardLabel } from '@/lib/keyboard-locales';
import {
  languageSlotForKey,
  LANGUAGE_SWITCH_MARK,
} from '@/lib/language-switching';
import { keyMessageKeys } from '@/lib/messages';
import {
  actionLabel,
  accentKeyLabel,
  baseKey,
  type LayoutKey,
  type KeyboardLocale,
  type Mode,
} from '@/lib/typing-engine';
import type { Platform } from '@/lib/platform';

const inactiveKeyCodes = new Set([
  'MetaLeft',
  'MetaRight',
  'ContextMenu',
  'Fn',
]);
const arrowIcons: Partial<Record<string, typeof ArrowLeft>> = {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
};

export function OnScreenKeyboard({
  platform,
  locale,
  layoutKeys,
  onKeyPress,
  mode = 0,
  held = [],
  shifted = false,
  caps = false,
  nationalAlt = false,
  accent = null,
  typographyEnabled = true,
  languageSlots,
  highlightedKeys = [],
  disabledKeys = [],
  editableOnly = false,
  selectedKey,
  changedKeys = [],
  changedLabel,
  preserveInputFocus = true,
  showAllSymbols = false,
  appearance = 'trainer',
  showStatusIndicators = true,
  showModeIndicators = true,
  showLanguageIndicators = true,
}: {
  platform: Platform;
  locale: KeyboardLocale;
  layoutKeys: readonly LayoutKey[];
  onKeyPress: (code: string) => void;
  mode?: Mode;
  held?: readonly string[];
  shifted?: boolean;
  caps?: boolean;
  nationalAlt?: boolean;
  accent?: string | null;
  typographyEnabled?: boolean;
  languageSlots?: readonly KeyboardLocale[];
  highlightedKeys?: readonly string[];
  disabledKeys?: readonly string[];
  editableOnly?: boolean;
  selectedKey?: string;
  changedKeys?: readonly string[];
  changedLabel?: string;
  preserveInputFocus?: boolean;
  showAllSymbols?: boolean;
  appearance?: 'trainer' | 'editor';
  showStatusIndicators?: boolean;
  showModeIndicators?: boolean;
  showLanguageIndicators?: boolean;
}) {
  const { m, t, uiLocale } = useLocale();
  const modifiers = modifierNames(platform);
  const rows = getKeyboardRows(platform, locale);
  const entries = useMemo(
    () => new Map(layoutKeys.map((key) => [key.code, key])),
    [layoutKeys],
  );
  function renderKey(key: Keycap) {
    const entry = entries.get(key.code);
    const languageSlot = languageSlotForKey(key.code, languageSlots);
    const ArrowIcon = arrowIcons[key.code];
    const isAlt = key.code.startsWith('Alt');
    const isDisabled = Boolean(
      key.disabled ||
      inactiveKeyCodes.has(key.code) ||
      disabledKeys.includes(key.code) ||
      (editableOnly && !entry),
    );
    // Held keys share the pressed fill; released Alt/Option shows the mode.
    const isPressed = !isDisabled && held.includes(key.code);
    const base =
      key.label ||
      (key.code === 'Space'
        ? ''
        : accentKeyLabel(
            baseKey(
              key.code,
              locale,
              shifted,
              caps,
              nationalAlt &&
                (locale !== 'he' || !entry?.quick || held.includes('AltRight')),
            ),
            accent,
          ));
    const alternateBase =
      key.code === 'Backslash' ? baseKey(key.code, locale, !shifted, caps) : '';
    const primary = entry ? actionLabel(entry.primary) : '';
    const secondary = entry ? actionLabel(entry.secondary) : '';
    const keyName = key.code.startsWith('Meta')
      ? modifiers.meta
      : key.code.startsWith('Alt')
        ? modifiers.alt
        : key.code.startsWith('Control')
          ? modifiers.control
          : key.code === 'Fn'
            ? m.fnKeyInfo
            : key.code === 'Enter' && platform === 'macos'
              ? 'Return'
              : keyMessageKeys[key.code]
                ? m[keyMessageKeys[key.code]]
                : entry?.label || key.code;
    const accessible = `${keyName}${key.code.startsWith('Control') ? `: ${typographyEnabled ? t('typographyToggleHint', { ctrl: modifiers.control }) : t('typographyDisabledWarning', { ctrl: modifiers.control })}` : ''}${isAlt ? `: M${mode} — ${[m.basicMode, m.primaryMode, m.secondaryMode][mode]}` : ''}${entry ? `: ${primary ? t('primarySymbol', { symbol: primary, modifier: modifiers.alt }) : m.emptyPrimary}; ${secondary ? t('secondarySymbol', { symbol: secondary, modifier: modifiers.alt }) : m.emptySecondary}` : ''}`;
    return (
      <button
        key={key.code}
        type="button"
        className={`keycap ${key.label ? 'modifier' : ''} ${isAlt && appearance === 'trainer' ? 'alt-key' : ''} ${key.code === 'Space' ? 'space-key' : ''} ${isPressed ? 'pressed' : ''} ${entry?.quick ? 'quick-key' : ''} ${key.symbol ? 'mac-modifier' : ''} ${ArrowIcon ? 'arrow-key' : ''}`}
        style={{ '--units': key.width || 1 } as CSSProperties}
        aria-label={
          languageSlot
            ? `${accessible}; ${languageSlot.label}: Caps Lock + ${key.code === 'Semicolon' ? ';' : key.code.slice(3)} — ${keyboardLabel(languageSlot.locale, uiLocale)}`
            : accessible
        }
        aria-pressed={
          editableOnly && entry ? selectedKey === key.code : undefined
        }
        aria-controls={editableOnly && entry ? 'symbol-key-editor' : undefined}
        data-key-code={key.code}
        data-customized={changedKeys.includes(key.code) || undefined}
        data-tour-key={highlightedKeys.includes(key.code) || undefined}
        data-mode={isAlt ? mode : undefined}
        disabled={isDisabled}
        onPointerDown={
          preserveInputFocus ? (event) => event.preventDefault() : undefined
        }
        onMouseDown={
          preserveInputFocus ? (event) => event.preventDefault() : undefined
        }
        onClick={() => onKeyPress(key.code)}
      >
        {ArrowIcon ? (
          <ArrowIcon size={14} aria-hidden="true" />
        ) : key.code === 'Backspace' ? (
          platform === 'macos' ? (
            <span className="enter-label">
              delete <Delete size={18} aria-hidden="true" />
            </span>
          ) : (
            <Delete className="key-icon" size={18} aria-hidden="true" />
          )
        ) : key.code === 'Enter' ? (
          <span className="enter-label">
            {key.label} <CornerDownLeft size={15} />
          </span>
        ) : (
          <>
            {key.symbol && (
              <span className="key-symbol" aria-hidden="true">
                {key.symbol}
              </span>
            )}
            <span className="key-base">
              {base}
              {alternateBase && alternateBase !== base && (
                <span className="key-alternate">{alternateBase}</span>
              )}
            </span>
            {showStatusIndicators && key.code.startsWith('Control') && (
              <span
                className="ctrl-status"
                data-enabled={typographyEnabled}
                aria-hidden="true"
              >
                <span className="ctrl-status-led" />
              </span>
            )}
            {showModeIndicators && isAlt && (
              <span
                className="mode-key-label inline-mode"
                data-mode={mode}
                aria-hidden="true"
              >
                {`M${mode}`}
              </span>
            )}
          </>
        )}
        {showLanguageIndicators &&
          (languageSlot || key.code === 'CapsLock') && (
            <span
              className="language-slot-label language-mark"
              aria-hidden="true"
            >
              {languageSlot?.label ?? LANGUAGE_SWITCH_MARK}
            </span>
          )}
        {key.code === 'Space' ? (
          <span className="space-legend">
            {mode === 0 ? m.space : m.nonBreakingSpace}
          </span>
        ) : (
          entry && (
            <span className="type-legends">
              <span
                className={`primary-symbol ${!primary ? 'empty-symbol' : ''}`}
              >
                {primary}
              </span>
              <span
                className={`secondary-symbol ${entry.secondary.dead ? 'dead-symbol' : ''}`}
              >
                {secondary}
              </span>
            </span>
          )
        )}
        {changedKeys.includes(key.code) && (
          <span
            aria-label={changedLabel}
            className="custom-key-marker absolute end-1 top-1 size-1 rounded-full"
          />
        )}
        {(key.code === 'KeyF' || key.code === 'KeyJ') && (
          <span className={homeMarkClasses} />
        )}
      </button>
    );
  }

  return (
    <div
      dir="ltr"
      data-appearance={appearance}
      className={`virtual-keyboard platform-${platform} ${showAllSymbols ? '' : `mode-${mode}`}${typographyEnabled ? '' : ' typography-disabled'}`}
    >
      {rows.map((row, index) => (
        <div className="keyboard-row" key={index}>
          {row.map((key) =>
            'keys' in key ? (
              <div
                key={key.code}
                className={arrowClusterClasses}
                style={{ '--units': key.width } as CSSProperties}
              >
                {key.keys.map(renderKey)}
              </div>
            ) : (
              renderKey(key)
            ),
          )}
        </div>
      ))}
    </div>
  );
}
