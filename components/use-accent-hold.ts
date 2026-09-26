import { useEffect, useRef, useState, type RefObject } from 'react';
import type { TypingEngine } from '@/lib/typing-engine';

type Choices = NonNullable<TypingEngine['accentChoices']>;
export const ACCENT_MENU_DELAY = 250;
// Some Linux input paths report autorepeat as a release/press pair instead
// of repeat=true. Give that pair one short grace period, not a new hold.
const RELEASE_GRACE = 12;

export function useAccentHold(
  input: RefObject<HTMLInputElement | null>,
  engine: RefObject<TypingEngine>,
  insert: (text: string, replace: Choices['replace']) => void,
) {
  const [menu, setMenu] = useState<{ choices: string[]; index: number } | null>(
    null,
  );
  const menuTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const handled = useRef(new Set<string>());
  const pending = useRef<{
    choices: string[];
    index: number;
    appliedIndex: number;
    visible: boolean;
    code: string;
    data: Choices;
    held: boolean;
  } | null>(null);
  const blockedRepeats = useRef(new Set<string>());
  const releases = useRef(
    new Map<string, { time: number; timer: ReturnType<typeof setTimeout> }>(),
  );
  function cancel() {
    if (pending.current?.held) {
      blockedRepeats.current.add(pending.current.code);
    }
    clearTimeout(menuTimer.current);
    setMenu(null);
    pending.current = null;
  }
  function valid(data: Choices) {
    const field = input.current;
    return (
      field &&
      field.value === data.replace.expected &&
      field.selectionStart === data.replace.end &&
      field.selectionEnd === data.replace.end
    );
  }
  function select(index: number) {
    const current = pending.current;
    if (!current || !valid(current.data)) {
      cancel();
      return false;
    }
    const text = current.choices[index];
    if (text === undefined) {
      return false;
    }
    if (index !== current.appliedIndex) {
      const result = engine.current.chooseDiacritic(text);
      if (!result?.text || !result.replace) {
        cancel();
        return false;
      }
      insert(result.text, result.replace);
      const next = engine.current.accentChoices;
      if (!next) {
        cancel();
        return false;
      }
      current.data = next;
    }
    current.index = index;
    current.appliedIndex = index;
    setMenu({ choices: current.choices, index });
    return true;
  }
  function choose(index: number) {
    if (select(index)) {
      cancel();
    }
  }
  function open(direction: 1 | -1 = 1) {
    arm('', true);
    const current = pending.current;
    if (current) {
      select(
        (current.index + current.choices.length + direction) %
          current.choices.length,
      );
    }
  }
  function before(event: KeyboardEvent, down: boolean) {
    const isShift = event.code === 'ShiftLeft' || event.code === 'ShiftRight';
    if (isShift) {
      // Let the engine distinguish a standalone tap from ordinary Shift input.
      // In particular, never replace text on keydown or while Shift is held.
      if (down && !pending.current?.visible) {
        cancel();
      }
      return false;
    }
    if (handled.current.has(event.code)) {
      if (!down) {
        handled.current.delete(event.code);
      }
      event.preventDefault();
      return true;
    }
    const release = releases.current.get(event.code);
    if (down && release) {
      clearTimeout(release.timer);
      releases.current.delete(event.code);
      const paired =
        event.timeStamp >= release.time && event.timeStamp - release.time <= 2;
      if (
        paired &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        !event.isComposing &&
        (blockedRepeats.current.has(event.code) ||
          (pending.current?.code === event.code && valid(pending.current.data)))
      ) {
        event.preventDefault();
        return true;
      }
      blockedRepeats.current.delete(event.code);
      if (pending.current?.code === event.code) {
        pending.current.held = false;
        cancel();
      }
    }
    if (
      !down &&
      (pending.current?.code === event.code ||
        blockedRepeats.current.has(event.code))
    ) {
      if (release) {
        clearTimeout(release.timer);
      }
      const current = pending.current;
      releases.current.set(event.code, {
        time: event.timeStamp,
        timer: setTimeout(() => {
          releases.current.delete(event.code);
          blockedRepeats.current.delete(event.code);
          if (current && pending.current === current) {
            current.held = false;
            if (!current.visible) {
              cancel();
            }
          }
        }, RELEASE_GRACE),
      });
      return false;
    }
    if (down && event.repeat && blockedRepeats.current.has(event.code)) {
      event.preventDefault();
      return true;
    }
    const current = pending.current;
    if (!current) {
      return false;
    }
    if (
      !valid(current.data) ||
      event.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      cancel();
      return false;
    }
    if (event.code === current.code) {
      if (down && event.repeat) {
        event.preventDefault();
        return true;
      }
      if (!down) {
        if (!current.visible) {
          cancel();
        }
      }
      return false;
    }
    if (!down) {
      return false;
    }
    if (engine.current.shiftHeld) {
      cancel();
      return false;
    }
    if (current.visible) {
      const digit = /^Digit([1-9])$/.exec(event.code);
      const confirm = event.code === 'Enter' || event.code === 'NumpadEnter';
      if (confirm || (digit && Number(digit[1]) <= current.choices.length)) {
        handled.current.add(event.code);
        event.preventDefault();
        if (confirm) {
          choose(current.index);
        } else if (digit) {
          choose(Number(digit[1]) - 1);
        }
        return true;
      }
    }
    cancel();
    return false;
  }
  function arm(code: string, preview = false) {
    cancel();
    const data = engine.current.accentChoices;
    if (!data || !valid(data)) {
      return;
    }
    const text = data.replace.expected.slice(
      data.replace.start,
      data.replace.end,
    );
    const index = data.menuChoices.indexOf(text);
    const current = {
      code,
      data,
      held: !preview,
      choices: data.menuChoices,
      index,
      appliedIndex: index,
      visible: preview,
    };
    pending.current = current;
    if (preview) {
      setMenu({ choices: current.choices, index });
      return;
    }
    function showMenu() {
      if (pending.current !== current) {
        return;
      }
      if (!valid(current.data) || document.activeElement !== input.current) {
        cancel();
        return;
      }
      if (releases.current.has(code)) {
        menuTimer.current = setTimeout(showMenu, RELEASE_GRACE);
        return;
      }
      if (current.held) {
        current.visible = true;
        select(
          engine.current.shiftHeld
            ? 0
            : current.index === 0
              ? 1
              : current.index,
        );
      }
    }
    menuTimer.current = setTimeout(showMenu, ACCENT_MENU_DELAY);
  }

  useEffect(() => {
    const releaseTimers = releases.current;
    return () => {
      clearTimeout(menuTimer.current);
      for (const release of releaseTimers.values()) {
        clearTimeout(release.timer);
      }
    };
  }, []);
  function reset() {
    cancel();
    for (const release of releases.current.values()) {
      clearTimeout(release.timer);
    }
    releases.current.clear();
    handled.current.clear();
    blockedRepeats.current.clear();
  }
  return {
    before,
    arm,
    open,
    cancel: reset,
    menu,
    choose,
  };
}
