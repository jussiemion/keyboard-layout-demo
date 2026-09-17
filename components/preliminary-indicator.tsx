'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

type Range = { start: number; end: number; value: string } | null;

/** A decoration-only mirror: the native input keeps its caret and selection. */
export function PreliminaryIndicator({
  input,
  value,
  range,
}: {
  input: RefObject<HTMLInputElement | null>;
  value: string;
  range: Range;
}) {
  const mirror = useRef<HTMLDivElement>(null);
  const active = range?.value === value ? range : null;
  useLayoutEffect(() => {
    const target = input.current;
    const overlay = mirror.current;
    if (!target || !overlay) {
      return;
    }
    const sync = () => {
      const css = getComputedStyle(target);
      for (const property of [
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'font-feature-settings',
        'font-variant-ligatures',
        'letter-spacing',
        'line-height',
        'padding-top',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'direction',
        'text-align',
      ]) {
        overlay.style.setProperty(property, css.getPropertyValue(property));
      }
      overlay.style.width = `${target.clientWidth}px`;
      overlay.style.height = `${target.clientHeight}px`;
      overlay.scrollLeft = target.scrollLeft;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(target);
    target.addEventListener('scroll', sync);
    return () => {
      observer.disconnect();
      target.removeEventListener('scroll', sync);
    };
  });
  return (
    <div
      ref={mirror}
      aria-hidden="true"
      className={[
        'pointer-events-none absolute top-0 left-0 overflow-hidden',
        'whitespace-pre text-transparent select-none',
      ].join(' ')}
    >
      {active ? (
        <>
          {value.slice(0, active.start)}
          <span
            data-preliminary="true"
            className={[
              'decoration-foreground underline decoration-[1.5px] underline-offset-10',
              '[text-decoration-skip-ink:none]',
            ].join(' ')}
          >
            {value.slice(active.start, active.end)}
          </span>
          {value.slice(active.end)}
        </>
      ) : (
        value
      )}
    </div>
  );
}
