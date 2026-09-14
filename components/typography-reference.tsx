'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  BookOpen,
  Languages,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { AboutLayout } from '@/components/about-layout';
import {
  ReferenceSymbolCard,
  referenceSymbolId,
} from '@/components/reference-symbol-card';
import {
  groupSymbolSearchResults,
  symbolCategoryNames,
  type SymbolCategory,
} from '@/lib/symbol-search-categories';
import { useLocale } from '@/components/locale-provider';
import { BrandMarkIcon } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { ExperimentalLanguageWarning } from '@/components/experimental-language-warning';
import {
  getAllSymbolSearchItems,
  searchSymbolItems,
} from '@/lib/symbol-search-index';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import { revealInitialPreferences } from '@/lib/preferences';
import { localePath, referencePath, referenceUrl } from '@/lib/seo';
import { UI_LOCALES, nativeLanguageNames } from '@/lib/messages';
import { keyboardLanguage } from '@/lib/keyboard-locales';
import { languageComparator } from '@/lib/language-priority';
import { defaultLanguageMapping } from '@/lib/settings';
import { setThemePreference } from '@/lib/theme';
import copy from '@/lib/seo-copy.json';

const items = getAllSymbolSearchItems();
const categoryOrder: SymbolCategory[] = [
  'punctuation',
  'diacritics',
  'letters',
  'math',
  'currency',
  'arrows',
  'keyboard',
  'other',
];
const catalogGroups = groupSymbolSearchResults(
  items.map((item) => ({ item })),
  false,
).toSorted(
  (a, b) =>
    categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
);
const categoryButtonClasses = [
  'hover:bg-muted focus-visible:ring-primary flex min-h-10 shrink-0',
  'items-center justify-between gap-3 rounded-lg px-3 py-2 text-start',
  'text-sm transition-colors focus-visible:ring-2 lg:w-full',
].join(' ');

export function TypographyReference() {
  const { uiLocale, theme, platform, m } = useLocale();
  const text = copy[uiLocale];
  const search = symbolSearchMessages[uiLocale];
  const [query, setQuery] = useState('');
  const mobileSections = useRef<HTMLDetailsElement>(null);
  const [category, setCategory] = useState<SymbolCategory | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    revealInitialPreferences(uiLocale, theme, platform);
  }, [uiLocale, theme, platform]);
  const mapping = defaultLanguageMapping('en');
  const languages = UI_LOCALES.toSorted(
    languageComparator(
      uiLocale,
      [...mapping.order, ...mapping.slots],
      (locale) => nativeLanguageNames[keyboardLanguage(locale)],
    ),
  );
  const matches = searchSymbolItems(query, uiLocale);
  const groups = groupSymbolSearchResults(
    matches,
    Boolean(query.trim()),
  ).filter((group) => category === null || group.category === category);
  if (!query.trim()) {
    groups.sort(
      (a, b) =>
        categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
    );
  }
  const count = groups.reduce(
    (total, group) => total + group.matches.length,
    0,
  );
  const filtered = category !== null || query.length > 0;
  function clearFilters() {
    setCategory(null);
    setQuery('');
    searchInput.current?.focus();
  }
  function chooseCategory(next: SymbolCategory | null) {
    setCategory(next);
    if (mobileSections.current?.open) {
      mobileSections.current.open = false;
      mobileSections.current
        .querySelector('summary')
        ?.focus({ preventScroll: true });
    }
    requestAnimationFrame(() =>
      searchInput.current?.scrollIntoView({ block: 'center' }),
    );
  }
  const categoryNavigation = (
    <nav aria-label={text.topics} className="flex flex-col gap-1">
      <button
        type="button"
        className={`${categoryButtonClasses} ${category === null ? 'bg-muted text-foreground font-semibold' : 'text-muted-foreground'}`}
        aria-pressed={category === null}
        onClick={() => chooseCategory(null)}
      >
        <span>{text.allSymbols}</span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {items.length}
        </span>
      </button>
      {catalogGroups.map((group) => (
        <button
          type="button"
          key={group.category}
          className={`${categoryButtonClasses} ${category === group.category ? 'bg-muted text-foreground font-semibold' : 'text-muted-foreground'}`}
          aria-pressed={category === group.category}
          onClick={() => chooseCategory(group.category)}
        >
          <span>{symbolCategoryNames[uiLocale][group.category]}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {group.matches.length}
          </span>
        </button>
      ))}
    </nav>
  );
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: text.referenceTitle,
    description: text.referenceDescription,
    url: referenceUrl(uiLocale),
    inLanguage: uiLocale,
    hasDefinedTerm: items.map((item) => ({
      '@type': 'DefinedTerm',
      name: item.names[uiLocale],
      termCode: item.symbol,
      description: item.description[uiLocale],
      url: `${referenceUrl(uiLocale)}#${referenceSymbolId(item.symbol)}`,
    })),
  };
  return (
    <main className="typography-reference mx-auto max-w-7xl px-4 pb-12 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <header className="border-border flex flex-wrap items-center justify-between gap-4 border-b py-5">
        <a
          href={localePath(uiLocale)}
          className="hover:text-primary inline-flex min-h-10 items-center gap-3 text-sm font-semibold"
        >
          <BrandMarkIcon width={28} height={28} />
          <span>{text.openDemo}</span>
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        </a>
        <div className="flex items-center gap-2">
          <label className="border-border bg-secondary flex min-h-10 items-center gap-2 rounded-lg border px-3">
            <Languages
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <span className="sr-only">{text.languageLinks}</span>
            <select
              value={uiLocale}
              onChange={(event) => {
                window.location.assign(
                  referencePath(event.target.value as typeof uiLocale),
                );
              }}
              className="bg-secondary max-w-40 py-2 text-sm"
              dir="auto"
            >
              {languages.map((locale) => (
                <option key={locale} value={locale} lang={locale}>
                  {nativeLanguageNames[locale]}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={theme === 'vesper' ? m.themeLight : m.themeDark}
            onClick={() =>
              setThemePreference(theme === 'vesper' ? 'vesper_light' : 'vesper')
            }
          >
            {theme === 'vesper' ? (
              <Sun aria-hidden="true" />
            ) : (
              <Moon aria-hidden="true" />
            )}
          </Button>
        </div>
      </header>
      <section className="py-8 sm:py-12" aria-labelledby="reference-title">
        <h1
          id="reference-title"
          className="mb-3 text-2xl leading-tight font-semibold tracking-tight sm:text-4xl"
        >
          {text.referenceTitle}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-7 sm:text-base">
          {text.referenceLead}
        </p>
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-6">
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide">
            {text.topics}
          </h2>
          <div className="hidden lg:block">{categoryNavigation}</div>
          <details
            ref={mobileSections}
            className="border-border bg-secondary group rounded-xl border lg:hidden"
          >
            <summary
              className={[
                'focus-visible:outline-primary flex min-h-12 cursor-pointer list-none',
                'items-center gap-3 rounded-xl p-3 text-sm font-semibold',
                '[&::-webkit-details-marker]:hidden',
              ].join(' ')}
            >
              <span className="min-w-0 flex-1">
                {category
                  ? symbolCategoryNames[uiLocale][category]
                  : text.allSymbols}
              </span>
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {category
                  ? catalogGroups.find((group) => group.category === category)
                      ?.matches.length
                  : items.length}
              </span>
              <ChevronDown
                className="size-4 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-border border-t p-2">
              {categoryNavigation}
            </div>
          </details>
        </aside>
        <div className="min-w-0">
          <div
            className={[
              'border-border focus-within:border-primary bg-secondary mb-4 flex',
              'items-center gap-3 rounded-xl border px-4',
            ].join(' ')}
          >
            <Search
              className="text-muted-foreground size-5 shrink-0"
              aria-hidden="true"
            />
            <input
              ref={searchInput}
              type="search"
              aria-label={search.title}
              placeholder={text.referencePlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none"
              dir="auto"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={text.clearSearch}
                onClick={() => {
                  setQuery('');
                  searchInput.current?.focus();
                }}
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </div>
          <div className="mb-6 flex min-h-9 flex-wrap items-center justify-between gap-3">
            <h2 className="scroll-mt-6 text-sm font-semibold">
              {category
                ? symbolCategoryNames[uiLocale][category]
                : text.allSymbols}{' '}
              <span className="text-muted-foreground ms-2 tabular-nums">
                {count}
              </span>
            </h2>
            <output className="sr-only">
              {search.results}: {count}
            </output>
            {filtered && count > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                {text.clearFilters}
              </Button>
            )}
          </div>
          {count === 0 && (
            <div className="border-border rounded-xl border border-dashed px-6 py-12 text-center">
              <Search
                className="text-muted-foreground mx-auto mb-4 size-8"
                aria-hidden="true"
              />
              <h3 className="mb-5 font-semibold">{search.empty}</h3>
              <Button variant="outline" onClick={clearFilters}>
                {text.clearFilters}
              </Button>
            </div>
          )}
          {groups.map((group) => (
            <section
              key={group.category}
              id={`category-${group.category}`}
              className="mb-10 scroll-mt-6"
              aria-labelledby={`heading-${group.category}`}
            >
              <h2
                id={`heading-${group.category}`}
                className="mb-4 flex items-center gap-3 text-base font-semibold"
              >
                <span>{symbolCategoryNames[uiLocale][group.category]}</span>
                <span className="border-border flex-1 border-t" />
              </h2>
              <div className="grid grid-cols-1 items-start gap-4">
                {group.matches.map(({ item }) => (
                  <ReferenceSymbolCard key={item.symbol} item={item} />
                ))}
              </div>
            </section>
          ))}
          <section
            className="border-border bg-secondary rounded-xl border p-5 sm:p-6"
            aria-label={text.openDemo}
          >
            <BookOpen className="text-primary mb-3 size-6" aria-hidden="true" />
            <p className="text-muted-foreground mb-5 text-sm leading-7">
              {text.referenceIntro}
            </p>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a href={localePath(uiLocale)} aria-label={text.openDemo} />
              }
              className="h-auto min-h-10 py-2 whitespace-normal"
            >
              {text.openDemo}
            </Button>
          </section>
          <div className="mt-6">
            <ExperimentalLanguageWarning />
          </div>
          <AboutLayout />
        </div>
      </div>
    </main>
  );
}
