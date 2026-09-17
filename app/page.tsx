'use client';

import { PreliminaryIndicator } from '@/components/preliminary-indicator';
import { applicationSchema } from '@/lib/seo';

import {
  homeMarkClasses,
  helpCloseClasses,
  arrowClusterClasses,
} from '@/components/layout-classes';

import { keyboardLabel } from '@/lib/keyboard-locales';

import { SeoContent } from '@/components/seo-content';
import { helpMessages } from '@/lib/help-messages';

import {
  getInitialKeyboardLocale,
  subscribeToInitialKeyboardLocale,
} from '@/lib/i18n';
import { capturesWindowKey, keyboardEventCode } from '@/lib/window-typing';
import { NativeLayoutDetector } from '@/lib/native-layout-detection';
import { nativeLayoutMessages } from '@/lib/native-layout-messages';
import { restoreInputCaret } from '@/lib/input-caret';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import {
  CornerDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Delete,
  RotateCcw,
  TriangleAlert,
  BookOpen,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SymbolSearchPanel } from '@/components/symbol-search';
import { GuidedTour, TourInvitation } from '@/components/guided-tour';
import { rememberTour, type TourStep } from '@/lib/tour';
import { HeaderMenu } from '@/components/header-menu';
import { WaitlistButton } from '@/components/waitlist-button';
import { SettingsDialog } from '@/components/settings-dialog';
import {
  getSettings,
  getServerSettings,
  subscribeToSettings,
  saveSettings,
  SETTINGS_CHANGE_EVENT,
  SETTINGS_STORAGE_KEY,
} from '@/lib/settings';
import { LanguageSwitcher } from '@/components/language-switcher';
import { PlatformSwitcher } from '@/components/platform-switcher';
import { PLATFORM_CHANGE_EVENT, PLATFORM_STORAGE_KEY } from '@/lib/platform';
import { BrandMarkIcon } from '@/components/brand-mark';
import {
  getKeyboardRows,
  modifierNames,
  moveSelection,
  type Keycap,
} from '@/lib/keyboard';
import { useLocale } from '@/components/locale-provider';
import {
  PREFERENCES_READY_EVENT,
  revealInitialPreferences,
} from '@/lib/preferences';
import {
  defaultLanguageConfig,
  LanguageSwitchController,
  languageSlotForKey,
  LANGUAGE_SWITCH_MARK,
} from '@/lib/language-switching';
import { HelpContent } from '@/components/help-content';
import { TranslatedText } from '@/components/translated-text';
import { keyMessageKeys } from '@/lib/messages';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TypingEngine,
  actionLabel,
  accentKeyLabel,
  baseKey,
  nationalKeyAction,
  deleteBackward,
  keyMap,
  replaceSelection,
  type Mode,
  type KeyboardLocale,
} from '@/lib/typing-engine';

import { TypographyToggle } from '@/lib/typography-toggle';

const arrowIcons: Partial<Record<string, typeof ArrowLeft>> = {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
};

const inactiveKeyCodes = new Set([
  'MetaLeft',
  'MetaRight',
  'ContextMenu',
  'Fn',
]);

export default function Home({
  initialLocale = 'en',
  rootPage = true,
}: {
  initialLocale?: import('@/lib/messages').UiLocale;
  rootPage?: boolean;
}) {
  const { m, t, uiLocale, theme, platform } = useLocale();
  const modifiers = modifierNames(platform);
  const modeOptions: {
    value: Mode;
    mark: string;
    label: string;
  }[] = [
    {
      value: 0,
      mark: 'M0',
      label: m.basicMode,
    },
    {
      value: 1,
      mark: 'M1',
      label: m.primaryMode,
    },
    {
      value: 2,
      mark: 'M2',
      label: m.secondaryMode,
    },
  ];
  const nativeDetector = useRef(new NativeLayoutDetector());
  const [nativeLayoutActive, setNativeLayoutActive] = useState(false);
  const [checkingNativeLayout, setCheckingNativeLayout] = useState(false);
  const nativeMessages = nativeLayoutMessages[uiLocale];
  const engine = useRef(new TypingEngine());
  const toggleController = useRef(new TypographyToggle());
  const [typographyEnabled, setTypographyEnabled] = useState(true);
  const languageController = useRef(new LanguageSwitchController());
  const capsManaged = useRef(false);
  const logicalCaps = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const keyboardFrame = useRef<HTMLElement>(null);
  const [value, setValue] = useState('');
  const [preliminary, setPreliminary] =
    useState<TypingEngine['preliminaryRange']>(null);
  const initialKeyboardLocale = useSyncExternalStore(
    subscribeToInitialKeyboardLocale,
    getInitialKeyboardLocale,
    () => initialLocale,
  );
  const settings = useSyncExternalStore(
    subscribeToSettings,
    getSettings,
    getServerSettings,
  );
  const languageConfig = settings.languageMapping ?? defaultLanguageConfig();
  const [selectedLocale, setLocale] = useState<KeyboardLocale | null>(null);
  const locale = selectedLocale ?? initialKeyboardLocale;
  const activeLocale = useRef(locale);
  useEffect(() => {
    activeLocale.current = locale;
  }, [locale]);
  const rows = getKeyboardRows(platform, locale);
  const [mode, setMode] = useState<Mode>(0);
  const [accent, setAccent] = useState<string | null>(null);
  const [held, setHeld] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSession, setSettingsSession] = useState(0);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const helpTrigger = useRef<HTMLButtonElement>(null);
  const [caps, setCaps] = useState(false);
  const [virtualShift, setVirtualShift] = useState(false);
  const [lastSymbol, setLastSymbol] = useState('');
  const [tourOpen, setTourOpen] = useState(false);
  const [tourTask, setTourTask] = useState<TourStep | null>(null);
  const tourSnapshot = useRef<{
    value: string;
    locale: KeyboardLocale;
    enabled: boolean;
    lastSymbol: string;
    start: number;
    end: number;
    caps: boolean;
  } | null>(null);

  function startTour() {
    if (tourOpen) {
      return;
    }
    tourSnapshot.current = {
      value,
      locale: activeLocale.current,
      enabled: engine.current.enabled,
      lastSymbol,
      start: input.current?.selectionStart ?? value.length,
      end: input.current?.selectionEnd ?? value.length,
      caps: logicalCaps.current,
    };
    rememberTour('started');
    resetState();
    setTourTask(null);
    setTourOpen(true);
  }
  function prepareTour(step: TourStep | null) {
    resetState();
    setTourTask(step);
    const text = step?.initial ?? '';
    setValue(text);
    setLastSymbol('');
    if (step) {
      activeLocale.current = step.locale;
      setLocale(step.locale);
      engine.current.enabled = step.enabled ?? true;
      setTypographyEnabled(engine.current.enabled);
      logicalCaps.current = false;
      setCaps(false);
    }
    if (input.current) {
      input.current.value = text;
      input.current.setSelectionRange(text.length, text.length);
      if (step) {
        input.current.focus({ preventScroll: true });
      }
    }
  }
  function finishTour(completed: boolean) {
    const previous = tourSnapshot.current;
    resetState();
    setTourTask(null);
    setTourOpen(false);
    rememberTour(completed ? 'completed' : 'started');
    if (previous) {
      setValue(previous.value);
      setLastSymbol(previous.lastSymbol);
      activeLocale.current = previous.locale;
      setLocale(previous.locale);
      engine.current.enabled = previous.enabled;
      setTypographyEnabled(previous.enabled);
      logicalCaps.current = previous.caps;
      setCaps(previous.caps);
      if (input.current) {
        input.current.value = previous.value;
        input.current.focus({ preventScroll: true });
        input.current.setSelectionRange(previous.start, previous.end);
      }
    }
    tourSnapshot.current = null;
  }
  function playTourChord(keys: string[]) {
    if (!tourOpen || !tourTask) {
      return;
    }
    input.current?.focus({ preventScroll: true });
    if (keys[0] === 'CapsLock' && ['KeyF', 'KeyH'].includes(keys[1])) {
      for (const code of keys) {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            code,
            key: code,
            bubbles: true,
            cancelable: true,
          }),
        );
      }
      for (const code of [...keys].reverse()) {
        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            code,
            key: code,
            bubbles: true,
            cancelable: true,
          }),
        );
      }
      return;
    }
    // Use the same input path as physical keys, including release-only gestures.
    for (const code of keys) {
      handleKey(new KeyboardEvent('keydown', { code, key: code }), true);
    }
    for (const code of [...keys].reverse()) {
      handleKey(new KeyboardEvent('keyup', { code, key: code }), false);
    }
  }

  useLayoutEffect(() => {
    const frame = keyboardFrame.current;
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
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  function refresh() {
    setPreliminary(engine.current.preliminaryRange);
    setAccent(engine.current.accent);
    setMode(engine.current.mode);
    setHeld([
      ...new Set([
        ...engine.current.held,
        ...languageController.current.held,
        ...toggleController.current.held,
      ]),
    ]);
  }
  function resetState() {
    nativeDetector.current.interrupt();
    toggleController.current.reset();
    engine.current.reset();
    languageController.current.reset();
    setVirtualShift(false);
    refresh();
  }

  useLayoutEffect(() => {
    revealInitialPreferences(uiLocale, theme, platform, initialKeyboardLocale);
  }, [uiLocale, theme, platform, initialKeyboardLocale]);

  useEffect(() => {
    const focusInput = () => input.current?.focus({ preventScroll: true });
    focusInput();
    window.addEventListener(PREFERENCES_READY_EVENT, focusInput);
    const reset = () => {
      nativeDetector.current.interrupt();
      toggleController.current.reset();
      engine.current.reset();
      languageController.current.reset();
      setPreliminary(null);
      setMode(0);
      setAccent(null);
      setHeld([]);
      setVirtualShift(false);
    };
    const resetPlatform = () => {
      reset();
    };
    const platformStorageChanged = (event: StorageEvent) => {
      if (
        event.key === PLATFORM_STORAGE_KEY ||
        event.key === SETTINGS_STORAGE_KEY ||
        event.key === null
      ) {
        resetPlatform();
      }
    };
    window.addEventListener(PLATFORM_CHANGE_EVENT, resetPlatform);
    window.addEventListener(SETTINGS_CHANGE_EVENT, resetPlatform);
    window.addEventListener('storage', platformStorageChanged);
    const resetPostfix = (event: Event) => {
      // Clicking the on-screen Shift does not move the caret; it must retain
      // the preceding letter until the Shift release cycles its diacritic.
      if (
        event.type === 'pointerdown' &&
        event.target instanceof Element &&
        event.target.closest(
          '[data-key-code="ShiftLeft"], [data-key-code="ShiftRight"], [data-tour-key-code="ShiftLeft"]',
        )
      ) {
        return;
      }
      engine.current.resetPostfix();
      setPreliminary(null);
    };
    window.addEventListener('pointerdown', resetPostfix, true);
    window.addEventListener('wheel', resetPostfix, true);
    window.addEventListener('blur', reset);
    window.addEventListener('languagechange', reset);
    window.addEventListener('pageshow', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      window.removeEventListener(PREFERENCES_READY_EVENT, focusInput);
      window.removeEventListener(PLATFORM_CHANGE_EVENT, resetPlatform);
      window.removeEventListener(SETTINGS_CHANGE_EVENT, resetPlatform);
      window.removeEventListener('storage', platformStorageChanged);
      window.removeEventListener('pointerdown', resetPostfix, true);
      window.removeEventListener('wheel', resetPostfix, true);
      window.removeEventListener('blur', reset);
      window.removeEventListener('languagechange', reset);
      window.removeEventListener('pageshow', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, [engine, input, languageController, toggleController]);

  function insert(
    text: string,
    replacement?: { start: number; end: number; expected: string },
  ) {
    const target = input.current;
    if (!target || !text || (tourOpen && !tourTask)) {
      return;
    }
    if (
      replacement &&
      (target.value !== replacement.expected ||
        target.selectionStart !== replacement.end ||
        target.selectionEnd !== replacement.end)
    ) {
      engine.current.resetPostfix();
      setPreliminary(null);
      return;
    }
    const next = replaceSelection(
      target.value,
      replacement?.start ?? target.selectionStart ?? target.value.length,
      replacement?.end ?? target.selectionEnd ?? target.value.length,
      text,
    );
    // Update the DOM and caret synchronously so fast keyup/Shift events see
    // the committed edit rather than a pending React render or animation frame.
    target.value = next.value;
    target.setSelectionRange(next.caret, next.caret);
    setValue(next.value);
    setLastSymbol(text);
    requestAnimationFrame(() => {
      if (
        target.value === next.value &&
        target.selectionStart === next.caret &&
        target.selectionEnd === next.caret
      ) {
        restoreInputCaret(
          target,
          next.caret,
          ['he', 'ar'].includes(activeLocale.current),
        );
      }
    });
  }

  function selectKeyboardLanguage(next: KeyboardLocale) {
    languageController.current.rememberLanguage(
      activeLocale.current,
      languageConfig.order,
    );
    activeLocale.current = next;
    setLocale(next);
    engine.current.reset();
    setPreliminary(null);
    setVirtualShift(false);
  }

  function handleKey(event: KeyboardEvent, down: boolean) {
    const nativeStatus = nativeDetector.current.observe(event, down);
    if (nativeStatus) {
      setNativeLayoutActive(nativeStatus === 'detected');
      setCheckingNativeLayout(false);
    }
    if (tourOpen && !tourTask) {
      return;
    }
    if (event.isComposing || event.key === 'Process') {
      resetState();
      return;
    }
    const code = keyboardEventCode(event);
    if (
      toggleController.current.handle(
        code,
        down,
        event.repeat,
        event.altKey ||
          event.shiftKey ||
          event.metaKey ||
          event.getModifierState('AltGraph'),
      )
    ) {
      engine.current.reset();
      languageController.current.reset();
      // Let the native adapter own this physical gesture during its warning
      // and recheck, so disabling the OS layout does not also disable the demo.
      if (event.isTrusted && nativeLayoutActive) {
        nativeDetector.current.dismiss();
        setNativeLayoutActive(false);
        setCheckingNativeLayout(false);
      } else {
        engine.current.enabled = !engine.current.enabled;
        setTypographyEnabled(engine.current.enabled);
      }
      setVirtualShift(false);
      refresh();
      return;
    }
    const keyInput = {
      code,
      key: event.key,
      down,
      repeat: down && event.repeat,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altGraph: event.getModifierState('AltGraph'),
    };
    const language = languageController.current.handle(
      { ...keyInput, altGraph: event.altKey || keyInput.altGraph },
      activeLocale.current,
      languageConfig.order,
      languageConfig.slots,
    );
    if (language.prevent) {
      event.preventDefault();
      if (code === 'CapsLock' && down && !capsManaged.current) {
        // A web page cannot turn off the OS Caps LED. Keep its own field case
        // unchanged when Caps is used as the language gesture.
        // Keep the already displayed case: browsers differ in when they
        // report the native lock change relative to keydown.
        capsManaged.current = true;
      }
      engine.current.reset();
      if (language.locale) {
        selectKeyboardLanguage(language.locale);
      }
      setCaps(logicalCaps.current);
      refresh();
      return;
    }
    if (!capsManaged.current) {
      logicalCaps.current = event.getModifierState('CapsLock');
    }
    const current = activeLocale.current;
    const shift = event.shiftKey || engine.current.shiftHeld;
    const baseAction = nationalKeyAction(
      code,
      current,
      shift,
      logicalCaps.current,
    );
    const key = baseAction.dead
      ? 'Dead'
      : baseKey(code, current, shift, logicalCaps.current);
    const target = input.current;
    const result = engine.current.handle(
      {
        ...keyInput,
        key: key || event.key,
        capsLock: logicalCaps.current,
        context: target
          ? {
              value: target.value,
              start: target.selectionStart ?? target.value.length,
              end: target.selectionEnd ?? target.value.length,
            }
          : undefined,
      },
      current,
    );
    setCaps(logicalCaps.current);
    if (result.prevent) {
      event.preventDefault();
    }
    if (result.text) {
      insert(result.text, result.replace);
    }
    const command =
      event.ctrlKey || event.metaKey || event.altKey || engine.current.altHeld;
    if (down && !result.prevent && !command && (baseAction.dead || key)) {
      event.preventDefault();
      if (baseAction.dead) {
        engine.current.accent = baseAction.dead;
      } else {
        insert(key);
      }
    }
    if (down && event.key === 'Escape') {
      event.preventDefault();
      resetState();
    }
    refresh();
  }

  // Bubble phase lets dialogs and controls handle their keys first.
  useEffect(() => {
    const receive = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target === input.current) {
        return;
      }
      const down = event.type === 'keydown';
      const code = keyboardEventCode(event);
      if (!down) {
        if (
          toggleController.current.held.has(code) ||
          engine.current.held.has(code) ||
          languageController.current.held.has(code)
        ) {
          handleKey(event, false);
        }
        return;
      }
      const blocked = Boolean(
        document.querySelector(
          '[role="dialog"], [role="alertdialog"], [role="menu"]',
        ) ||
        target?.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
        ),
      );
      const onControl = Boolean(
        target?.closest(
          'button, a, [role="button"], [role="radio"], [role="checkbox"], [role="switch"]',
        ),
      );
      const isCtrl = /^Control(Left|Right)$/.test(code);
      if (
        !(isCtrl && !blocked && !event.defaultPrevented) &&
        !capturesWindowKey(event, blocked, onControl)
      ) {
        if (event.ctrlKey || event.metaKey) {
          resetState();
        }
        return;
      }
      const modifier = /^(Alt|Shift|Control)(Left|Right)$/.test(code);
      if (
        (!modifier && event.key !== 'Escape') ||
        code.startsWith('Alt') ||
        code === 'CapsLock'
      ) {
        input.current?.focus({ preventScroll: true });
      }
      handleKey(event, true);
      // This event originally targeted another element, so insert ordinary
      // printable text explicitly instead of relying on a retargeted default.
      if (!event.defaultPrevented && Array.from(event.key).length === 1) {
        event.preventDefault();
        insert(event.key);
      }
    };
    const cancelToggle = (event: Event) => {
      if (
        event.type === 'pointerdown' &&
        event.target instanceof Element &&
        event.target.closest(
          '[data-key-code="ControlLeft"], [data-key-code="ControlRight"]',
        )
      ) {
        return;
      }
      nativeDetector.current.interrupt();
      toggleController.current.reset();
    };
    window.addEventListener('pointerdown', cancelToggle);
    window.addEventListener('wheel', cancelToggle);
    window.addEventListener('keydown', receive);
    window.addEventListener('keyup', receive);
    return () => {
      window.removeEventListener('pointerdown', cancelToggle);
      window.removeEventListener('wheel', cancelToggle);
      window.removeEventListener('keydown', receive);
      window.removeEventListener('keyup', receive);
    };
  });

  function chooseMode(next: Mode) {
    if (!engine.current.enabled) {
      return;
    }
    input.current?.focus({ preventScroll: true });
    engine.current.selectMode(next);
    setVirtualShift(false);
    refresh();
  }

  function virtualKey(code: string) {
    if (tourOpen && !tourTask) {
      return;
    }
    const target = input.current;
    if (!target) {
      return;
    }
    target.focus({ preventScroll: true });
    const context = () => ({
      value: target.value,
      start: target.selectionStart ?? target.value.length,
      end: target.selectionEnd ?? target.value.length,
    });
    if (/^Control(Left|Right)$/.test(code)) {
      const down = !toggleController.current.held.has(code);
      if (toggleController.current.handle(code, down)) {
        engine.current.reset();
        languageController.current.reset();
        engine.current.enabled = !engine.current.enabled;
        setTypographyEnabled(engine.current.enabled);
      }
      refresh();
      return;
    }
    if (code === 'CapsLock') {
      languageController.current.reset();
      selectKeyboardLanguage(
        languageController.current.nextLanguage(
          activeLocale.current,
          languageConfig.order,
        ),
      );
      refresh();
      return;
    }
    if (code.startsWith('Shift')) {
      const result = engine.current.handle(
        { code: 'ShiftLeft', down: !virtualShift, context: context() },
        locale,
      );
      if (result.text) {
        insert(result.text, result.replace);
      }
      setVirtualShift(!virtualShift);
      refresh();
      return;
    }
    const baseAction = nationalKeyAction(code, locale, virtualShift, caps);
    const key = baseAction.dead
      ? 'Dead'
      : baseKey(code, locale, virtualShift, caps);
    const result = engine.current.handle(
      {
        code,
        key,
        down: true,
        shiftKey: virtualShift,
        capsLock: caps,
        context: context(),
      },
      locale,
    );
    if (result.text) {
      insert(result.text, result.replace);
    } else if (!result.prevent && code === 'Backspace') {
      const next = deleteBackward(
        target.value,
        target.selectionStart ?? target.value.length,
        target.selectionEnd ?? target.value.length,
      );
      setValue(next.value);
      requestAnimationFrame(() =>
        target.setSelectionRange(next.caret, next.caret),
      );
    } else if (!result.prevent && code.startsWith('Arrow')) {
      const next = moveSelection(
        target.value,
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0,
        target.selectionDirection,
        code,
        virtualShift,
      );
      requestAnimationFrame(() =>
        target.setSelectionRange(next.start, next.end, next.direction),
      );
    } else if (!result.prevent && code === 'Tab') {
      insert('\t');
    } else if (!result.prevent && code === 'Enter') {
      insert('\n');
    } else if (!result.prevent && baseAction.dead) {
      engine.current.accent = baseAction.dead;
    } else if (!result.prevent && key) {
      insert(key);
    }
    engine.current.handle(
      { code, key, down: false, context: context() },
      locale,
    );
    if (!code.startsWith('Alt') && !code.startsWith('Shift') && virtualShift) {
      engine.current.handle(
        { code: 'ShiftLeft', down: false, context: context() },
        locale,
      );
      setVirtualShift(false);
    }
    refresh();
  }

  function clear() {
    setValue('');
    setLastSymbol('');
    resetState();
    input.current?.focus({ preventScroll: true });
  }

  const shifted = virtualShift || held.some((code) => code.startsWith('Shift'));
  const nationalAlt =
    held.some((code) => code.startsWith('Alt')) &&
    !held.some((code) => /^(Control|Meta)/.test(code));

  function renderKey(key: Keycap) {
    const entry = keyMap.get(key.code);
    const languageSlot = languageSlotForKey(key.code, languageConfig.slots);
    const ArrowIcon = arrowIcons[key.code];
    const isAlt = key.code.startsWith('Alt');
    const isDisabled = Boolean(key.disabled || inactiveKeyCodes.has(key.code));
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
    const accessible = `${keyName}${key.code.startsWith('Control') ? `: ${typographyEnabled ? t('typographyToggleHint', { ctrl: modifiers.control }) : t('typographyDisabledWarning', { ctrl: modifiers.control })}` : ''}${isAlt ? `: ${modeOptions[mode].mark} — ${modeOptions[mode].label}` : ''}${entry ? `: ${primary ? t('primarySymbol', { symbol: primary, modifier: modifiers.alt }) : m.emptyPrimary}; ${secondary ? t('secondarySymbol', { symbol: secondary, modifier: modifiers.alt }) : m.emptySecondary}` : ''}`;
    return (
      <button
        key={key.code}
        type="button"
        className={`keycap ${key.label ? 'modifier' : ''} ${isAlt ? 'alt-key' : ''} ${key.code === 'Space' ? 'space-key' : ''} ${isPressed ? 'pressed' : ''} ${entry?.quick ? 'quick-key' : ''} ${key.symbol ? 'mac-modifier' : ''} ${ArrowIcon ? 'arrow-key' : ''}`}
        style={{ '--units': key.width || 1 } as CSSProperties}
        aria-label={
          languageSlot
            ? `${accessible}; ${languageSlot.label}: Caps Lock + ${key.code === 'Semicolon' ? ';' : key.code.slice(3)} — ${keyboardLabel(languageSlot.locale, uiLocale)}`
            : accessible
        }
        data-key-code={key.code}
        data-tour-key={tourTask?.keys.includes(key.code) || undefined}
        data-mode={isAlt ? mode : undefined}
        disabled={isDisabled}
        onPointerDown={(event) => event.preventDefault()}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => virtualKey(key.code)}
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
            {key.code.startsWith('Control') && (
              <span
                className="ctrl-status"
                data-enabled={typographyEnabled}
                aria-hidden="true"
              >
                <span className="ctrl-status-led" />
              </span>
            )}
            {isAlt && (
              <span
                className="mode-key-label inline-mode"
                data-mode={mode}
                aria-hidden="true"
              >
                {modeOptions[mode].mark}
              </span>
            )}
          </>
        )}
        {(languageSlot || key.code === 'CapsLock') && (
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
        {(key.code === 'KeyF' || key.code === 'KeyJ') && (
          <span className={homeMarkClasses} />
        )}
      </button>
    );
  }

  return (
    <TooltipProvider delay={350}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            applicationSchema(uiLocale, rootPage),
          ).replaceAll('<', '\\u003c'),
        }}
      />
      <div
        className="demo-shell"
        data-tour-spotlight={tourTask?.spotlight}
        data-tour-active={tourOpen}
      >
        <div className="trainer-viewport">
          <header className="site-header">
            <div className="brand">
              <BrandMarkIcon className="brand-mark" width={24} height={24} />
              <h1>{m.brandTitle}</h1>
            </div>
            <nav className="header-actions" aria-label={m.headerActions}>
              <WaitlistButton onOpen={resetState} />
              <SymbolSearchPanel
                typographyEnabled={typographyEnabled}
                modifierLabel={modifiers.alt}
                onOpenChange={() => {
                  setHelpOpen(false);
                  resetState();
                }}
                onHelpRequest={() => {
                  setHelpOpen(true);
                  resetState();
                }}
              />
              <Dialog
                open={helpOpen}
                onOpenChange={(open) => {
                  setHelpOpen(open);
                  resetState();
                }}
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <DialogTrigger
                        render={
                          <Button
                            ref={helpTrigger}
                            data-tour-target="help"
                            variant="ghost"
                            size="icon"
                            className="icon-link"
                            aria-label={helpMessages[uiLocale].title}
                            aria-keyshortcuts="Control+h"
                          />
                        }
                      >
                        <BookOpen size={20} aria-hidden="true" />
                      </DialogTrigger>
                    }
                  />
                  <TooltipContent>
                    {helpMessages[uiLocale].title}
                  </TooltipContent>
                </Tooltip>
                <DialogContent
                  className="help-dialog"
                  showCloseButton={false}
                  finalFocus={() => helpTrigger.current}
                >
                  <DialogClose
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className={helpCloseClasses}
                        aria-label={m.closeHelp}
                      />
                    }
                  >
                    <X />
                  </DialogClose>
                  <HelpContent
                    keyboardLocale={locale}
                    languageConfig={languageConfig}
                  />
                </DialogContent>
              </Dialog>
              <HeaderMenu
                languagePriority={[
                  ...languageConfig.order,
                  ...languageConfig.slots,
                ]}
                onUiLocaleChange={selectKeyboardLanguage}
                onTourOpen={startTour}
                tourActive={tourOpen}
                onSettingsOpen={() => {
                  setSettingsSession((session) => session + 1);
                  setSettingsOpen(true);
                  resetState();
                }}
                inputRef={input}
                triggerRef={menuTrigger}
                onOpenChange={resetState}
              />
            </nav>
          </header>

          <SettingsDialog
            key={settingsSession}
            open={settingsOpen}
            initialSettings={settings}
            returnFocusRef={menuTrigger}
            onOpenChange={(open) => {
              setSettingsOpen(open);
              resetState();
            }}
            onSave={(next) => {
              resetState();
              return saveSettings(next);
            }}
          />

          <div className="trainer-spacer" aria-hidden="true" />
          <main>
            {nativeLayoutActive && (
              <aside className="native-layout-warning" role="alert">
                <TriangleAlert size={20} aria-hidden="true" />
                <div>
                  <strong>{nativeMessages.title}</strong>
                  <p>
                    <TranslatedText
                      message={nativeMessages.body}
                      values={{ ctrl: <kbd>{modifiers.control}</kbd> }}
                    />
                  </p>
                  {checkingNativeLayout ? (
                    <p>
                      <TranslatedText
                        message={nativeMessages.instruction}
                        values={{
                          alt: <kbd>{modifiers.alt}</kbd>,
                          key: <kbd>C</kbd>,
                        }}
                      />
                    </p>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetState();
                        setCheckingNativeLayout(true);
                        input.current?.focus({ preventScroll: true });
                      }}
                    >
                      {nativeMessages.check}
                    </Button>
                  )}
                </div>
              </aside>
            )}

            {tourOpen ? (
              <GuidedTour
                config={{
                  order: [languageConfig.order[0], languageConfig.order[1]],
                  slots: [
                    languageConfig.slots[0],
                    languageConfig.slots[1],
                    languageConfig.slots[2],
                    languageConfig.slots[3],
                  ],
                }}
                observation={{
                  value,
                  mode,
                  locale,
                  enabled: typographyEnabled,
                  settingsOpen,
                  helpOpen,
                }}
                onPrepare={prepareTour}
                onFinish={finishTour}
                onChord={playTourChord}
                onKey={virtualKey}
              />
            ) : (
              <TourInvitation onStart={startTour} />
            )}
            <section className="typing-area" aria-label={m.inputSection}>
              <label className="sr-only" htmlFor="typing-input">
                {m.inputLabel}
              </label>
              <div className="typing-field">
                <input
                  type="text"
                  dir={['he', 'ar'].includes(locale) ? 'rtl' : 'ltr'}
                  lang={locale}
                  inputMode="none"
                  id="typing-input"
                  ref={input}
                  value={value}
                  readOnly={tourOpen && !tourTask}
                  aria-describedby={
                    tourTask
                      ? 'tour-title tour-instruction'
                      : tourOpen
                        ? 'tour-title'
                        : undefined
                  }
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder={m.inputPlaceholder}
                  onChange={(event) => setValue(event.target.value)}
                  onKeyDown={(event) => handleKey(event.nativeEvent, true)}
                  onKeyUp={(event) => handleKey(event.nativeEvent, false)}
                  onSelect={(event) => {
                    const candidate = engine.current.preliminaryRange;
                    const target = event.currentTarget;
                    if (
                      candidate &&
                      (target.value !== candidate.value ||
                        target.selectionStart !== candidate.end ||
                        target.selectionEnd !== candidate.end)
                    ) {
                      engine.current.resetPostfix();
                      setPreliminary(null);
                    }
                  }}
                  onBlur={resetState}
                  onCompositionStart={resetState}
                  onPaste={resetState}
                  onCut={resetState}
                  onDrop={resetState}
                />
                <PreliminaryIndicator
                  input={input}
                  value={value}
                  range={preliminary}
                />
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="reset-button"
                        onClick={clear}
                        aria-label={m.resetLabel}
                      >
                        <RotateCcw size={19} />
                      </Button>
                    }
                  />
                  <TooltipContent>{m.resetTooltip}</TooltipContent>
                </Tooltip>
              </div>
            </section>

            <section
              className="keyboard-section"
              aria-labelledby="keyboard-title"
            >
              <div className="keyboard-toolbar">
                <div className="keyboard-heading">
                  <h2 id="keyboard-title">
                    <a
                      href="https://ilyabirman.ru/typography-layout/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {m.keyboardTitle} <span>3.9</span>
                    </a>
                  </h2>
                  <PlatformSwitcher
                    onOpenChange={resetState}
                    inputRef={input}
                  />
                  <LanguageSwitcher
                    languagePriority={[
                      ...languageConfig.order,
                      ...languageConfig.slots,
                    ]}
                    value={locale}
                    onValueChange={(next) => {
                      selectKeyboardLanguage(next);
                      resetState();
                    }}
                    onOpenChange={resetState}
                    inputRef={input}
                  />
                </div>
                <RadioGroup
                  className="mode-indicators"
                  data-tour-mode={tourTask?.id === 'modes' || undefined}
                  aria-label={m.chooseMode}
                  value={String(mode)}
                  // Keep pointer selection from blurring the input into M0 before the click.
                  onMouseDown={(event) => event.preventDefault()}
                  onValueChange={(next) => chooseMode(Number(next) as Mode)}
                >
                  {modeOptions.map((option) => (
                    <label
                      className="mode-indicator"
                      key={option.value}
                      data-mode={option.value}
                      data-active={mode === option.value}
                    >
                      <RadioGroupItem
                        value={String(option.value)}
                        className="choice-radio"
                        aria-label={`${option.label} (${option.mark})`}
                      />
                      <span className="mode-name">{option.label}</span>
                      <span className="inline-mode" data-mode={option.value}>
                        {option.mark}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <section
                ref={keyboardFrame}
                className="keyboard-frame"
                aria-label={m.keyboardLanguage}
              >
                <div
                  dir="ltr"
                  className={`virtual-keyboard platform-${platform} mode-${mode}${typographyEnabled ? '' : ' typography-disabled'}`}
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
              </section>
            </section>
            <output className="sr-only">
              {lastSymbol &&
                t('entered', {
                  symbol:
                    lastSymbol === '\u00a0' ? m.nonBreakingSpace : lastSymbol,
                })}
            </output>
            <div className="grid">
              {/* Measure both messages without hiding the actual live output. */}
              <div
                aria-hidden="true"
                className="pointer-events-none invisible col-start-1 row-start-1 grid"
              >
                {[
                  m.accentModeWarning,
                  <TranslatedText
                    key="disabled"
                    message={m.typographyDisabledWarning}
                    values={{ ctrl: <kbd>{modifiers.control}</kbd> }}
                  />,
                ].map((message, index) => (
                  <div
                    key={index}
                    className="trainer-status accent-warning col-start-1 row-start-1"
                  >
                    <TriangleAlert size={17} aria-hidden="true" />
                    <strong>{message}</strong>
                  </div>
                ))}
              </div>
              {(!typographyEnabled || accent === 'acute') && (
                <output className="trainer-status accent-warning col-start-1 row-start-1">
                  <TriangleAlert size={17} aria-hidden="true" />
                  <strong>
                    {typographyEnabled ? (
                      m.accentModeWarning
                    ) : (
                      <TranslatedText
                        message={m.typographyDisabledWarning}
                        values={{ ctrl: <kbd>{modifiers.control}</kbd> }}
                      />
                    )}
                  </strong>
                </output>
              )}
            </div>
          </main>
        </div>
        <SeoContent page="trainer" />
      </div>
    </TooltipProvider>
  );
}
