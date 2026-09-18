'use client';

import { allSymbolLabels, popularSymbolLabels } from '@/lib/symbol-popular';
import {
  PALETTE_TABS,
  matchesPaletteCategory,
} from '@/lib/symbol-palette-categories';
import { VirtualSymbolGrid } from '@/components/virtual-symbol-grid';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  SearchX,
  LoaderCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';
import { configurationMessages } from '@/lib/configuration-messages';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import {
  accentMessageKeys,
  messages,
  UI_LOCALES,
  type UiLocale,
} from '@/lib/messages';
import {
  normalizeSearchTerm,
  scoreSearchTerm,
  type SymbolSearchItem,
} from '@/lib/symbol-search-index';
import { accents, type Action } from '@/lib/typing-engine';
import initialCatalog from '@/lib/symbol-catalog-initial.json';
import {
  symbolPreview,
  unicodeLabel,
  symbolFontKind,
} from '@/lib/symbol-presentation';
import {
  type SymbolCategory,
  symbolCategoryNames,
} from '@/lib/symbol-search-categories';

const initialItems = initialCatalog.items as SymbolSearchItem[];
const initialCategories = initialCatalog.categories as Record<
  string,
  SymbolCategory
>;
type SearchResult = { query: string; locale: UiLocale; symbols: string[] };

export default function SymbolPalette({
  value,
  onChoose,
}: {
  value: Action;
  onChoose: (action: Action) => void;
}) {
  const { uiLocale, m } = useLocale();
  const text = configurationMessages[uiLocale];
  const search = symbolSearchMessages[uiLocale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('popular');
  const [highlighted, setHighlighted] = useState(value.text ?? '');
  const [catalogError, setCatalogError] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [catalog, setCatalog] = useState<
    typeof import('@/lib/symbol-catalog') | null
  >(null);
  const items = catalog?.symbolCatalog ?? initialItems;
  const bySymbol = useMemo(
    () => new Map(items.map((item) => [item.symbol, item])),
    [items],
  );
  const worker = useRef<Worker | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const categories = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const instance = new Worker(
      new URL('../lib/symbol-catalog.worker.ts', import.meta.url),
      { type: 'module' },
    );
    instance.onmessage = (event: MessageEvent<SearchResult>) =>
      setResult(event.data);
    worker.current = instance;
    if (!matchMedia('(pointer: coarse)').matches) {
      searchInput.current?.focus();
    }
    return () => {
      instance.terminate();
      worker.current = null;
    };
  }, []);
  const needsCatalog = Boolean(query) || category !== 'popular';
  useEffect(() => {
    if (!needsCatalog || catalog) {
      return;
    }
    let disposed = false;
    void import('@/lib/symbol-catalog')
      .then((loaded) => {
        if (!disposed) {
          setCatalogError(false);
          setCatalog(loaded);
        }
      })
      .catch(() => {
        if (!disposed) {
          setCatalogError(true);
        }
      });
    return () => {
      disposed = true;
    };
  }, [needsCatalog, catalog]);
  useEffect(() => {
    worker.current?.postMessage({
      items: catalog?.symbolCatalog ?? initialItems,
    });
  }, [catalog]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query && catalog) {
        worker.current?.postMessage({ query, locale: uiLocale });
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [query, uiLocale, catalog]);
  const pending = Boolean(
    !catalogError &&
    query &&
    (result?.query !== query || result.locale !== uiLocale),
  );
  const matches =
    catalogError && query
      ? []
      : query
        ? pending
          ? []
          : result!.symbols.map((symbol) => bySymbol.get(symbol)!)
        : items;
  const filtered = category
    ? matches.filter((item) =>
        matchesPaletteCategory(
          item.symbol,
          category,
          (symbol) =>
            catalog?.catalogCategory(symbol) ?? initialCategories[symbol],
        ),
      )
    : matches;
  const preview =
    filtered.find((item) => item.symbol === highlighted) ?? filtered[0];

  const accentOptions = Object.entries(accents).filter(([id, accent]) => {
    if (!query || query === accent.spacing) {
      return true;
    }
    const names = UI_LOCALES.map((locale) =>
      normalizeSearchTerm(messages[locale][accentMessageKeys[id]]),
    );
    return normalizeSearchTerm(query)
      .split(/\s+/u)
      .filter(Boolean)
      .every((token) =>
        names.some((name) => scoreSearchTerm(name, token) !== null),
      );
  });

  return (
    <>
      <label className="symbol-palette-search border-border bg-background flex items-center gap-3 rounded-lg border px-3">
        <Search size={18} className="text-muted-foreground shrink-0" />
        <input
          ref={searchInput}
          className="min-h-11 min-w-0 flex-1 bg-transparent outline-none"
          aria-label={search.placeholder}
          placeholder={search.placeholder}
          value={query}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value && category === 'popular') {
              setCategory('');
            }
            grid.current?.scrollTo(0, 0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              grid.current
                ?.querySelector<HTMLButtonElement>(
                  '.symbol-palette-tile[tabindex="0"]',
                )
                ?.focus();
            }
          }}
        />
        <span className="flex size-8 shrink-0 items-center justify-center">
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            query && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={m.resetLabel}
                onClick={() => {
                  setQuery('');
                  grid.current?.scrollTo(0, 0);
                  searchInput.current?.focus();
                }}
              >
                <X size={16} />
              </Button>
            )
          )}
        </span>
      </label>
      <div className="flex min-w-0 items-center gap-1" dir="ltr">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label={`${search.navigate} ←`}
          onClick={() =>
            categories.current?.scrollBy({ left: -240, behavior: 'smooth' })
          }
        >
          <ChevronLeft size={16} />
        </Button>
        <div
          ref={categories}
          className="min-w-0 flex-1 scroll-px-1 overflow-x-auto py-1"
          dir={['ar', 'he'].includes(uiLocale) ? 'rtl' : 'ltr'}
          aria-label={text.symbols}
        >
          <div className="flex w-max min-w-full gap-2 px-1">
            {PALETTE_TABS.map((id) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={category === id ? 'secondary' : 'ghost'}
                className="symbol-palette-category shrink-0 rounded-md px-3"
                aria-pressed={category === id}
                onClick={() => {
                  setCategory(id);
                  grid.current?.scrollTo(0, 0);
                }}
              >
                {id === 'popular'
                  ? popularSymbolLabels[uiLocale]
                  : id
                    ? symbolCategoryNames[uiLocale][
                        id as keyof typeof symbolCategoryNames.en
                      ]
                    : allSymbolLabels[uiLocale]}
              </Button>
            ))}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label={`${search.navigate} →`}
          onClick={() =>
            categories.current?.scrollBy({ left: 240, behavior: 'smooth' })
          }
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <div className="symbol-palette-results" aria-busy={pending} ref={grid}>
        {accentOptions.length > 0 &&
          (category === 'diacritics' || Boolean(query)) && (
            <section className="border-border bg-card mb-4 space-y-3 rounded-xl border p-3">
              <h3 className="text-sm font-medium">{text.accent}</h3>
              <div className="flex flex-wrap gap-2">
                {accentOptions.map(([id, accent]) => (
                  <Button
                    key={id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto min-h-8 text-start whitespace-normal"
                    aria-pressed={value.dead === id}
                    onClick={() => onChoose({ dead: id })}
                  >
                    <span dir="ltr">{accent.spacing}</span>
                    {m[accentMessageKeys[id]]}
                  </Button>
                ))}
              </div>
            </section>
          )}
        <output
          className="text-muted-foreground mb-2 block text-xs"
          aria-live="polite"
        >
          {search.results}:{' '}
          {pending
            ? '…'
            : (!query && !category
                ? initialCatalog.total
                : filtered.length
              ).toLocaleString(uiLocale)}
        </output>
        {catalogError && needsCatalog && (
          <p role="alert" className="text-muted-foreground py-4 text-sm">
            {search.unavailable}
          </p>
        )}
        {!catalogError && !pending && !filtered.length && (
          <output
            className={[
              'text-muted-foreground flex h-[calc(100%_-_24px)] min-h-40',
              'flex-col items-center justify-center gap-4 px-4 py-6 text-center',
            ].join(' ')}
          >
            <SearchX
              size={64}
              strokeWidth={1.25}
              className="shrink-0 opacity-40"
              aria-hidden="true"
            />
            <span className="text-sm">{search.empty}</span>
          </output>
        )}
        <VirtualSymbolGrid
          key={`${query}-${category}`}
          items={filtered}
          locale={uiLocale}
          selected={value.text}
          label={search.results}
          onHighlight={setHighlighted}
          onChoose={(symbol) => onChoose({ text: symbol })}
        />
      </div>
      <div className="symbol-palette-preview" aria-live="polite">
        {preview ? (
          <>
            <span
              className="symbol-palette-preview-glyph"
              data-symbol-font={symbolFontKind(preview.symbol)}
              dir="ltr"
              aria-hidden="true"
            >
              {symbolPreview(preview.symbol)}
            </span>
            <div
              className="flex h-12 min-w-0 flex-1 flex-col justify-center gap-1"
              dir="ltr"
            >
              <p className="line-clamp-2 text-sm leading-[14px] font-medium">
                {preview.standardName ?? unicodeLabel(preview.symbol)}
              </p>
              <p className="text-muted-foreground truncate font-mono text-xs leading-4">
                <bdi dir="ltr">{unicodeLabel(preview.symbol)}</bdi>
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">{search.placeholder}</p>
        )}
      </div>
    </>
  );
}
