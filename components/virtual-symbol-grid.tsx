'use client';

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { SymbolSearchItem } from '@/lib/symbol-search-index';
import type { UiLocale } from '@/lib/messages';
import {
  symbolPreview,
  unicodeLabel,
  symbolFontKind,
} from '@/lib/symbol-presentation';

const ROW_HEIGHT = 54;
const OVERSCAN = 3;

export function VirtualSymbolGrid({
  items,
  locale,
  selected,
  label,
  onHighlight,
  onChoose,
}: {
  items: readonly SymbolSearchItem[];
  locale: UiLocale;
  selected?: string;
  label: string;
  onHighlight: (symbol: string) => void;
  onChoose: (symbol: string) => void;
}) {
  const grid = useRef<HTMLTableElement>(null);
  const [viewport, setViewport] = useState({ width: 330, height: 400, top: 0 });
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const element = grid.current!;
    const scroller = element.closest<HTMLElement>('.symbol-palette-results')!;
    let frame = 0;
    const measure = () => {
      const next = {
        width: element.clientWidth,
        height: scroller.clientHeight,
        top: Math.max(0, scroller.scrollTop - element.offsetTop),
      };
      setViewport((previous) =>
        previous.width === next.width &&
        previous.height === next.height &&
        previous.top === next.top
          ? previous
          : next,
      );
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(scroller);
    observer.observe(element);
    scroller.addEventListener('scroll', scheduleMeasure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      scroller.removeEventListener('scroll', scheduleMeasure);
      cancelAnimationFrame(frame);
    };
  }, []);
  const columns = Math.max(1, Math.floor((viewport.width + 6) / 54));
  const rowCount = Math.ceil(items.length / columns);
  const first = Math.max(
    0,
    Math.min(rowCount - 1, Math.floor(viewport.top / ROW_HEIGHT) - OVERSCAN),
  );
  const last = Math.min(
    rowCount,
    Math.ceil((viewport.top + viewport.height) / ROW_HEIGHT) + OVERSCAN,
  );
  const activeIndex = Math.min(active, Math.max(0, items.length - 1));
  // Keep the focused row mounted when a mouse/trackpad scrolls it out of view.
  const rows = [
    ...new Set([
      ...Array.from(
        { length: Math.max(0, last - first) },
        (_, index) => first + index,
      ),
      ...(items.length ? [Math.floor(activeIndex / columns)] : []),
    ]),
  ].sort((a, b) => a - b);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      PageDown: columns * Math.max(1, Math.floor(viewport.height / ROW_HEIGHT)),
      PageUp: -columns * Math.max(1, Math.floor(viewport.height / ROW_HEIGHT)),
    };
    if (
      !(event.key in offsets) &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return;
    }
    event.preventDefault();
    const next = Math.max(
      0,
      Math.min(
        items.length - 1,
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? items.length - 1
            : index + offsets[event.key],
      ),
    );
    flushSync(() => setActive(next));
    const element = grid.current!;
    const scroller = element.closest<HTMLElement>('.symbol-palette-results')!;
    const top = element.offsetTop + Math.floor(next / columns) * ROW_HEIGHT;
    if (top < scroller.scrollTop) {
      scroller.scrollTop = top;
    } else if (top + ROW_HEIGHT > scroller.scrollTop + scroller.clientHeight) {
      scroller.scrollTop = top + ROW_HEIGHT - scroller.clientHeight;
    }
    element
      .querySelector<HTMLButtonElement>(`[data-symbol-index="${next}"]`)
      ?.focus({ preventScroll: true });
  }

  return (
    <table
      ref={grid}
      className="symbol-palette-grid"
      dir="ltr"
      aria-label={label}
      aria-rowcount={rowCount}
      aria-colcount={columns}
      style={{ height: Math.max(0, rowCount * ROW_HEIGHT - 6) }}
    >
      <tbody className="contents">
        {rows.map((row) => (
          <tr
            key={row}
            aria-rowindex={row + 1}
            className="symbol-palette-row"
            style={{
              top: row * ROW_HEIGHT,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items
              .slice(row * columns, (row + 1) * columns)
              .map((item, column) => {
                const index = row * columns + column;
                return (
                  <td
                    key={item.symbol}
                    className="block min-w-0 p-0"
                    aria-colindex={column + 1}
                  >
                    <button
                      type="button"
                      className="symbol-palette-tile"
                      data-symbol-index={index}
                      data-symbol-font={symbolFontKind(item.symbol)}
                      tabIndex={index === activeIndex ? 0 : -1}
                      aria-label={`${item.names[locale]} · ${unicodeLabel(item.symbol)}`}
                      aria-pressed={selected === item.symbol}
                      onKeyDown={(event) => navigate(event, index)}
                      onMouseEnter={() => onHighlight(item.symbol)}
                      onFocus={() => {
                        setActive(index);
                        onHighlight(item.symbol);
                      }}
                      onClick={() => onChoose(item.symbol)}
                    >
                      {symbolPreview(item.symbol)}
                    </button>
                  </td>
                );
              })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
