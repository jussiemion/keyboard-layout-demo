'use client';

import { useEffect } from 'react';
import { REPOSITORY_URL } from '@/lib/seo';

let announced = false;

export function LocalConsoleMessage() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const local =
      process.env.NODE_ENV === 'development' ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]';

    if (!local || announced) {
      return;
    }
    announced = true;

    console.info(
      [
        '%c🚀 Typographic Layout%c',
        '%cby Semyon Yushkevich%c',
        '',
        '%c● Running locally%c',
        '',
        '⭐ If you like it, please support the project with a Star:',
        `   ${REPOSITORY_URL}`,
        '',
        '💬 Share your ideas or report bugs in Discussions!',
        `   ${REPOSITORY_URL}/discussions`,
      ].join('\n'),
      [
        'background:#ffc799',
        'color:#242424',
        'font:700 18px/1.8 monospace',
        'padding:8px 12px',
        'border-radius:6px',
      ].join(';'),
      '',
      'font:12px/2 monospace;padding:0 12px',
      '',
      [
        'background:#20392a',
        'color:#b6edc5',
        'font:600 12px/2 monospace',
        'padding:4px 10px',
        'border-radius:4px',
      ].join(';'),
      '',
    );
  }, []);

  return null;
}
