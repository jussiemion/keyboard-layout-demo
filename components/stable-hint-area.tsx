'use client';

import { keyDetailContentClasses } from '@/components/layout-classes';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/** Keep transient hints from reducing the page's scroll range under the pointer. */
export function StableHintArea({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = frame.current!;
    const inner = content.current!;
    let width = 0;
    let reservedHeight = 0;
    const measure = () => {
      const box = inner.getBoundingClientRect();
      // Hidden during the tour: retain the reservation for when hints return.
      if (!box.width) {
        return;
      }
      // A real width change requires a fresh measurement of wrapped text.
      if (Math.abs(box.width - width) > 1) {
        reservedHeight = 0;
      }
      width = box.width;
      reservedHeight = Math.max(reservedHeight, Math.ceil(box.height));
      outer.style.minHeight = `${reservedHeight}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="key-detail-region" ref={frame}>
      <div className={keyDetailContentClasses} ref={content}>
        {children}
      </div>
    </div>
  );
}
