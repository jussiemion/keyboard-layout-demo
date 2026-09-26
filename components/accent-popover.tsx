'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';

// A mirror keeps bidi text, proportional fonts and input scrolling in the
// browser's text layout engine rather than estimating character widths.
function caretRect(input: HTMLInputElement) {
  const rect = input.getBoundingClientRect();
  const style = getComputedStyle(input);
  const mirror = document.createElement('div');
  for (const property of [
    'box-sizing',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'font-variant',
    'font-stretch',
    'font-feature-settings',
    'font-kerning',
    'letter-spacing',
    'word-spacing',
    'line-height',
    'text-align',
    'text-indent',
    'text-transform',
    'direction',
    'padding',
    'border-width',
    'border-style',
  ]) {
    mirror.style.setProperty(property, style.getPropertyValue(property));
  }
  Object.assign(mirror.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    whiteSpace: 'pre',
    overflow: 'hidden',
    visibility: 'hidden',
    pointerEvents: 'none',
  });
  const text = document.createTextNode(input.value || '\u200b');
  mirror.append(text);
  document.body.append(mirror);
  mirror.scrollLeft = input.scrollLeft;
  const range = document.createRange();
  range.setStart(text, input.selectionEnd ?? input.value.length);
  range.collapse(true);
  const caret = range.getBoundingClientRect();
  mirror.remove();
  return {
    x: Math.max(rect.left, Math.min(rect.right, caret.left)),
    top: rect.top,
    bottom: rect.bottom,
  };
}

export function AccentPopover({
  input,
  menu,
  choose,
}: {
  input: RefObject<HTMLInputElement | null>;
  menu: { choices: string[]; index: number };
  choose: (index: number) => void;
}) {
  const popup = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const field = input.current;
    const panel = popup.current;
    if (!field || !panel) {
      return;
    }
    let active = true;
    function position() {
      if (!active || !field || !panel) {
        return;
      }
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? document.documentElement.clientWidth;
      const height = viewport?.height ?? window.innerHeight;
      const margin = 8;
      const gap = 8;
      const caret = caretRect(field);
      panel.style.maxWidth = `${Math.max(1, width - margin * 2)}px`;
      panel.style.maxHeight = `${Math.max(1, height - margin * 2)}px`;
      const size = panel.getBoundingClientRect();
      const x = Math.max(
        left + margin,
        Math.min(caret.x, left + width - size.width - margin),
      );
      const below = caret.bottom + gap;
      const y =
        below + size.height <= top + height - margin
          ? below
          : caret.top - gap - size.height;
      panel.style.left = `${x}px`;
      panel.style.top = `${Math.max(top + margin, Math.min(y, top + height - size.height - margin))}px`;
      panel.style.visibility =
        caret.bottom < top || caret.top > top + height ? 'hidden' : 'visible';
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(field);
    observer.observe(panel);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    document.addEventListener('selectionchange', position);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    void document.fonts.ready.then(position);
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
      document.removeEventListener('selectionchange', position);
      window.visualViewport?.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('scroll', position);
    };
  });

  return createPortal(
    <div
      ref={popup}
      data-accent-popover=""
      dir="ltr"
      style={{ visibility: 'hidden' }}
      className={[
        'border-border bg-popover text-popover-foreground fixed z-50 flex',
        'w-max flex-wrap justify-center gap-0.5 overflow-auto rounded-lg',
        'border p-1 shadow-md',
      ].join(' ')}
    >
      {menu.choices.map((symbol, index) => (
        <button
          key={symbol}
          type="button"
          aria-pressed={menu.index === index}
          className={[
            'flex h-13 min-w-10 flex-col items-center justify-center gap-0.5 rounded-md border px-2',
            'transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
            menu.index === index
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'hover:bg-muted border-transparent',
          ].join(' ')}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => choose(index)}
        >
          <span className="text-xl leading-6">{symbol}</span>
          <span className="text-muted-foreground h-3 text-[10px] leading-3 tabular-nums">
            {index < 9 ? index + 1 : null}
          </span>
        </button>
      ))}
    </div>,
    document.body,
  );
}
