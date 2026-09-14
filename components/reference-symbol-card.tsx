'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import type { SymbolSearchItem } from '@/lib/symbol-search-index';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import copy from '@/lib/seo-copy.json';

export function referenceSymbolId(symbol: string) {
  return `u-${Array.from(symbol)
    .map((char) => char.codePointAt(0)!.toString(16))
    .join('-')}`;
}

export function ReferenceSymbolCard({ item }: { item: SymbolSearchItem }) {
  const { uiLocale, m } = useLocale();
  const text = copy[uiLocale];
  const search = symbolSearchMessages[uiLocale];
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  useEffect(() => {
    if (copyState !== 'copied') {
      return;
    }
    const timer = setTimeout(() => setCopyState('idle'), 2500);
    return () => clearTimeout(timer);
  }, [copyState]);
  async function copySymbol() {
    try {
      await navigator.clipboard.writeText(item.symbol);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }
  return (
    <article
      id={referenceSymbolId(item.symbol)}
      className={[
        'border-border bg-secondary target:border-primary flex scroll-mt-6',
        'flex-col rounded-xl border p-5 sm:p-6',
      ].join(' ')}
    >
      <div className="mb-5 flex items-start gap-4">
        <span
          className={[
            'border-primary/40 text-primary bg-background flex min-h-16 min-w-16',
            'shrink-0 items-center justify-center rounded-lg border px-3 text-3xl',
          ].join(' ')}
          dir="ltr"
        >
          {item.symbol === '\u00a0' ? '⍽' : item.symbol}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-base leading-snug font-semibold">
            <a
              href={`#${referenceSymbolId(item.symbol)}`}
              className="hover:text-primary underline-offset-4 hover:underline"
            >
              {item.names[uiLocale]}
            </a>
          </h3>
          <p className="text-muted-foreground text-xs break-words" dir="ltr">
            {Array.from(item.symbol)
              .map(
                (char) =>
                  `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
              )
              .join(' · ')}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground mb-5 text-sm leading-7">
        {item.description[uiLocale]}
      </p>
      <div className="mt-auto">
        <Button
          variant="outline"
          className="mb-4 min-h-9"
          onClick={() => {
            void copySymbol();
          }}
          aria-label={`${text.copySymbol}: ${item.names[uiLocale]}`}
        >
          {copyState === 'copied' ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          {copyState === 'copied' ? text.copied : text.copySymbol}
        </Button>
        <output
          className={copyState === 'failed' ? 'mb-3 block text-sm' : 'sr-only'}
        >
          {copyState === 'copied'
            ? text.copied
            : copyState === 'failed'
              ? text.copyFailed
              : ''}
        </output>
        <details className="border-border group border-t pt-4">
          <summary
            className={[
              'focus-visible:outline-primary flex cursor-pointer list-none',
              'items-center justify-between gap-3 text-sm font-medium',
              '[&::-webkit-details-marker]:hidden',
            ].join(' ')}
          >
            {search.howTo}
            <ChevronDown
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="pt-4">
            <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
              {text.sequenceNote}
            </p>
            <ul className="space-y-3">
              {item.bindings.map((binding) => (
                <li key={`${binding.mode}-${binding.keyCode}`}>
                  <bdi
                    dir="ltr"
                    className="inline-flex flex-wrap items-center gap-1.5"
                  >
                    <kbd className="inline-mode" data-mode={binding.mode}>
                      M{binding.mode}
                    </kbd>
                    <kbd>Alt</kbd>
                    <span aria-hidden="true">→</span>
                    {binding.mode === 2 && (
                      <>
                        <kbd>Alt</kbd>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                    <kbd>
                      {binding.keyCode === 'Space' ? m.space : binding.keyLabel}
                    </kbd>
                    {binding.finishWithSpace && (
                      <>
                        <span aria-hidden="true">→</span>
                        <kbd>{m.space}</kbd>
                      </>
                    )}
                  </bdi>
                </li>
              ))}
            </ul>
            {(item.tags[uiLocale]?.length ?? 0) > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags[uiLocale]!.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs"
                  >
                    <bdi>{tag}</bdi>
                  </span>
                ))}
              </div>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}
