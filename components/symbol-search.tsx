'use client';

import {
  symbolSearchSectionClasses,
  symbolSearchCommandClasses,
  symbolSearchCloseClasses,
  symbolSearchCountClasses,
  symbolSearchListClasses,
  symbolSearchItemMetaClasses,
  symbolSearchUnicodeClasses,
  symbolSearchShortcutKeysClasses,
  symbolSearchFooterSeparatorClasses,
} from '@/components/layout-classes';

import { ArrowLeft, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { TranslatedText } from '@/components/translated-text';
import { ResultSymbol } from '@/components/result-symbol';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { searchSymbolItems } from '@/lib/symbol-search-index';
import {
  groupSymbolSearchResults,
  symbolCategoryNames,
} from '@/lib/symbol-search-categories';
import { ReferenceShortcuts } from '@/lib/reference-shortcuts';
import { referencePath } from '@/lib/seo';
import seoCopy from '@/lib/seo-copy.json';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';

// cmdk trims values; encode symbols so the non-breaking space retains its identity.
function symbolId(symbol: string) {
  return Array.from(symbol)
    .map((char) => char.codePointAt(0)!.toString(16))
    .join('-');
}

export function SymbolSearchPanel({
  modifierLabel,
  typographyEnabled,
  onOpenChange,
  onHelpRequest,
}: {
  modifierLabel: string;
  typographyEnabled: boolean;
  onOpenChange: () => void;
  onHelpRequest: () => void;
}) {
  const { uiLocale } = useLocale();
  const text = symbolSearchMessages[uiLocale];
  const shortcuts = useRef(new ReferenceShortcuts());
  const [open, setOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState('');
  const [mobileDetails, setMobileDetails] = useState(false);
  const backButton = useRef<HTMLButtonElement>(null);
  const resultsPane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileDetails) {
      backButton.current?.focus({ preventScroll: true });
    }
  }, [mobileDetails]);

  function returnToResults() {
    setMobileDetails(false);
    requestAnimationFrame(() =>
      resultsPane.current?.focus({ preventScroll: true }),
    );
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const result = shortcuts.current.handle(
        {
          code: event.code,
          key: event.key,
          repeat: event.repeat,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
          metaKey: event.metaKey,
          isComposing: event.isComposing,
          altGraph: event.getModifierState('AltGraph'),
        },
        event.type === 'keydown',
        typographyEnabled,
      );
      if (!result.prevent) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (!result.action) {
        return;
      }
      if (result.action === 'help') {
        setOpen(false);
        onHelpRequest();
        return;
      }
      if (open) {
        setMobileDetails(false);
        requestAnimationFrame(() =>
          searchInput.current?.focus({ preventScroll: true }),
        );
        return;
      }
      setQuery('');
      setSelection('');
      setMobileDetails(false);
      setOpen(true);
      onOpenChange();
      requestAnimationFrame(() =>
        searchInput.current?.focus({ preventScroll: true }),
      );
    };
    window.addEventListener('keydown', handleShortcut, true);
    window.addEventListener('keyup', handleShortcut, true);
    const reset = () => shortcuts.current.reset();
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', handleShortcut, true);
      window.removeEventListener('keyup', handleShortcut, true);
      window.removeEventListener('blur', reset);
    };
  }, [open, onOpenChange, onHelpRequest, typographyEnabled]);

  const results = useMemo(
    () => searchSymbolItems(query, uiLocale),
    [query, uiLocale],
  );
  const groups = useMemo(
    () => groupSymbolSearchResults(results, Boolean(query.trim())),
    [results, query],
  );
  const selected =
    results.find(({ item }) => symbolId(item.symbol) === selection)?.item ??
    groups[0]?.matches[0]?.item;
  const isolateDetailsBoundary = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !mobileDetails) {
        return;
      }
      // These are event boundaries, not keyboard-operated widgets. Stop native
      // bubbling before cmdk handles it, preserving scrolling and button defaults.
      const isolateDetailsKeys = (event: KeyboardEvent) => {
        if (
          window.matchMedia('(max-width: 640px)').matches &&
          !['Escape', 'Tab'].includes(event.key)
        ) {
          event.stopPropagation();
        }
      };
      element.addEventListener('keydown', isolateDetailsKeys);
      return () => element.removeEventListener('keydown', isolateDetailsKeys);
    },
    [mobileDetails],
  );

  const aliases = selected?.aliases[uiLocale] ?? [];
  const tags = selected?.tags[uiLocale] ?? [];
  const direction = ['he', 'ar'].includes(uiLocale) ? 'rtl' : 'ltr';
  return (
    <div className={symbolSearchSectionClasses}>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          setMobileDetails(false);
          setQuery('');
          setSelection('');
          onOpenChange();
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogTrigger
                aria-label={text.trigger}
                aria-keyshortcuts="Control+f"
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="icon-link symbol-search-trigger"
                  />
                }
              >
                <Search size={20} aria-hidden="true" />
              </DialogTrigger>
            }
          />
          <TooltipContent>{text.trigger}</TooltipContent>
        </Tooltip>
        <DialogContent
          className="symbol-search-dialog"
          data-mobile-view={mobileDetails ? 'details' : 'results'}
          showCloseButton={false}
          initialFocus={searchInput}
          dir={direction}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{text.title}</DialogTitle>
          </DialogHeader>
          <Command
            className={symbolSearchCommandClasses}
            label={text.title}
            value={selected ? symbolId(selected.symbol) : ''}
            onValueChange={setSelection}
            shouldFilter={false}
            loop
          >
            <div className="symbol-search-topbar" ref={isolateDetailsBoundary}>
              <Button
                ref={backButton}
                variant="ghost"
                className="symbol-search-back"
                onClick={returnToResults}
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>{text.backToResults}</span>
              </Button>
              <CommandInput
                ref={searchInput}
                placeholder={text.placeholder}
                aria-label={text.title}
                value={query}
                onValueChange={(next) => {
                  setMobileDetails(false);
                  setQuery(next);
                  setSelection('');
                }}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                dir="auto"
              />
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={symbolSearchCloseClasses}
                    aria-label={text.close}
                  />
                }
              >
                <X size={18} aria-hidden="true" />
              </DialogClose>
            </div>
            <div className="symbol-search-layout">
              <div
                className="symbol-search-results"
                dir={direction}
                ref={resultsPane}
                tabIndex={-1}
              >
                <output className={symbolSearchCountClasses}>
                  {text.results} <bdi>{results.length}</bdi>
                </output>
                <CommandList
                  className={symbolSearchListClasses}
                  label={text.results}
                >
                  {!results.length && (
                    <div className="symbol-search-empty">{text.empty}</div>
                  )}
                  {groups.map(({ category, matches }) => (
                    <CommandGroup
                      key={category}
                      heading={symbolCategoryNames[uiLocale][category]}
                      className="symbol-search-group"
                    >
                      {matches.map(({ item }) => (
                        <CommandItem
                          key={item.symbol}
                          value={symbolId(item.symbol)}
                          className="symbol-search-item"
                          onSelect={() => {
                            setSelection(symbolId(item.symbol));
                            if (
                              window.matchMedia('(max-width: 640px)').matches
                            ) {
                              setMobileDetails(true);
                            }
                          }}
                        >
                          <span
                            className="symbol-search-item-symbol"
                            aria-hidden="true"
                          >
                            <ResultSymbol>
                              {item.symbol === '\u00a0' ? '⍽' : item.symbol}
                            </ResultSymbol>
                          </span>
                          <span className="symbol-search-item-content">
                            <strong>
                              <bdi>{item.names[uiLocale]}</bdi>
                            </strong>
                            <span className={symbolSearchItemMetaClasses}>
                              <bdi>
                                {[...new Set(item.aliases[uiLocale] ?? [])]
                                  .slice(0, 3)
                                  .join(' · ')}
                              </bdi>
                            </span>
                          </span>
                          <kbd
                            className="inline-mode"
                            data-mode={item.bindings[0].mode}
                            dir="ltr"
                          >
                            M{item.bindings[0].mode}
                          </kbd>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </div>
              <aside
                key={selected?.symbol ?? 'empty'}
                className="symbol-search-details"
                ref={isolateDetailsBoundary}
                dir={direction}
                aria-label={text.about}
              >
                {selected ? (
                  <>
                    <div className="symbol-search-preview">
                      <span
                        className="symbol-search-preview-symbol"
                        dir="ltr"
                        aria-hidden="true"
                      >
                        {selected.symbol === '\u00a0' ? '⍽' : selected.symbol}
                      </span>
                      <h2>
                        <bdi>{selected.names[uiLocale]}</bdi>
                      </h2>
                      <p className={symbolSearchUnicodeClasses} dir="ltr">
                        {Array.from(selected.symbol)
                          .map(
                            (char) =>
                              'U+' +
                              char
                                .codePointAt(0)!
                                .toString(16)
                                .toUpperCase()
                                .padStart(4, '0'),
                          )
                          .join(' · ')}
                      </p>
                    </div>
                    <section>
                      <h3>{text.howTo}</h3>
                      <ul className="symbol-search-shortcuts">
                        {selected.bindings.map((binding) => (
                          <li key={`${binding.mode}-${binding.keyCode}`}>
                            <bdi dir="ltr">
                              <kbd
                                className="inline-mode"
                                data-mode={binding.mode}
                              >
                                M{binding.mode}
                              </kbd>
                              <span className={symbolSearchShortcutKeysClasses}>
                                <kbd>{modifierLabel}</kbd> →{' '}
                                {binding.mode === 2 && (
                                  <>
                                    <kbd>{modifierLabel}</kbd> →{' '}
                                  </>
                                )}
                                <kbd>{binding.keyLabel}</kbd>
                                {binding.finishWithSpace && (
                                  <>
                                    {' '}
                                    → <kbd>Space</kbd>
                                  </>
                                )}
                              </span>
                            </bdi>
                            {binding.quick && (
                              <bdi dir="ltr">
                                <kbd className="inline-mode" data-mode="0">
                                  M0
                                </kbd>
                                <span
                                  className={symbolSearchShortcutKeysClasses}
                                >
                                  <kbd>
                                    <bdi dir="auto">
                                      <TranslatedText
                                        message={text.leftModifier}
                                        values={{ alt: modifierLabel }}
                                      />
                                    </bdi>
                                  </kbd>{' '}
                                  + <kbd>{binding.keyLabel}</kbd>
                                  {binding.finishWithSpace && (
                                    <>
                                      {' '}
                                      → <kbd>Space</kbd>
                                    </>
                                  )}
                                </span>
                              </bdi>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3>{text.about}</h3>
                      <p>{selected.description[uiLocale]}</p>
                    </section>
                    {aliases.length > 0 && (
                      <section>
                        <h3>{text.aliasesLabel}</h3>
                        <div className="symbol-search-tags">
                          {[...new Set(aliases)].map((alias) => (
                            <bdi key={alias}>{alias}</bdi>
                          ))}
                        </div>
                      </section>
                    )}
                    {tags.length > 0 && (
                      <section>
                        <h3>{text.tagsLabel}</h3>
                        <div className="symbol-search-tags">
                          {tags.map((tag) => (
                            <bdi key={tag}>{tag}</bdi>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <div className="symbol-search-empty">
                    <Search aria-hidden="true" />
                    <p>{text.empty}</p>
                  </div>
                )}
              </aside>
            </div>
            <footer className="symbol-search-footer flex-wrap">
              <a
                href={referencePath(uiLocale)}
                className="text-primary underline underline-offset-4"
              >
                {seoCopy[uiLocale].referenceTitle}
              </a>
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> {text.navigate}
                <span className={symbolSearchFooterSeparatorClasses}>·</span>
                <kbd>Esc</kbd> {text.close}
              </span>
            </footer>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
