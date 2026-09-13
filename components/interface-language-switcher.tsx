'use client';

import { ExperimentalLanguageWarning } from '@/components/experimental-language-warning';

import {
  languageDialogClasses,
  languageDialogHeaderClasses,
  languageDialogTitleClasses,
  languageDialogCloseClasses,
  languageCodeClasses,
} from '@/components/layout-classes';

import { useRef, useState, type RefObject } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UI_LOCALES, nativeLanguageNames, type UiLocale } from '@/lib/messages';
import { useLocale } from '@/components/locale-provider';
import { setUiLocale } from '@/lib/i18n';

const languages = UI_LOCALES.map((value) => ({
  value,
  label: nativeLanguageNames[value],
  keywords: [
    nativeLanguageNames[value],
    new Intl.DisplayNames(['en'], { type: 'language' }).of(value) ?? value,
  ],
}));

type InterfaceLanguageSwitcherProps = {
  onValueChange: (locale: UiLocale) => void;
  open: boolean;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function InterfaceLanguageSwitcher({
  onValueChange,
  open,
  returnFocusRef,
  onOpenChange,
  inputRef,
}: InterfaceLanguageSwitcherProps) {
  const { m, uiLocale: value } = useLocale();
  const collator = new Intl.Collator(value, { sensitivity: 'base' });
  const sortedLanguages = languages.toSorted((a, b) =>
    collator.compare(
      nativeLanguageNames[a.value],
      nativeLanguageNames[b.value],
    ),
  );
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<string>(value);
  const search = useRef<HTMLInputElement>(null);
  const selected = useRef(false);

  function changeOpen(next: boolean) {
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent
        className={languageDialogClasses}
        showCloseButton={false}
        initialFocus={(interaction) =>
          interaction === 'touch' ? true : search.current
        }
        finalFocus={() =>
          selected.current ? inputRef.current : returnFocusRef.current
        }
      >
        <DialogHeader className={languageDialogHeaderClasses}>
          <DialogTitle className={languageDialogTitleClasses}>
            {m.interfaceLanguage}
          </DialogTitle>
          <DialogDescription>
            {m.interfaceLanguageDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon"
              className={languageDialogCloseClasses}
              aria-label={m.closeInterfaceLanguage}
            />
          }
        >
          <X size={18} />
        </DialogClose>
        <ExperimentalLanguageWarning />
        <Command
          className="language-command"
          label={m.interfaceLanguage}
          value={highlighted}
          onValueChange={setHighlighted}
          loop
        >
          <CommandInput
            ref={search}
            placeholder={m.findLanguage}
            aria-label={m.findLanguage}
            value={query}
            onValueChange={setQuery}
            autoComplete="off"
            spellCheck={false}
          />
          <CommandList>
            <CommandEmpty>{m.languageNotFound}</CommandEmpty>
            {sortedLanguages.map((language) => (
              <CommandItem
                key={language.value}
                value={language.value}
                keywords={[
                  ...language.keywords,
                  new Intl.DisplayNames([value], { type: 'language' }).of(
                    language.value,
                  ) ?? language.value,
                ]}
                className="language-item"
                data-checked={value === language.value}
                onSelect={() => {
                  selected.current = true;
                  setUiLocale(language.value);
                  onValueChange(language.value);
                  changeOpen(false);
                }}
              >
                <span lang={language.value}>
                  {nativeLanguageNames[language.value]}
                </span>
                <span className={languageCodeClasses}>
                  {language.value.toUpperCase()}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
