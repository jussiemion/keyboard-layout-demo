'use client';

import { languageComparator } from '@/lib/language-priority';

import { ExperimentalLanguageWarning } from '@/components/experimental-language-warning';

import {
  languageDialogClasses,
  languageDialogHeaderClasses,
  languageDialogTitleClasses,
  languageDialogCloseClasses,
  languageCodeClasses,
} from '@/components/layout-classes';

import {
  KEYBOARD_LOCALES,
  keyboardLanguage,
  keyboardLabel,
  isExperimentalKeyboard,
} from '@/lib/keyboard-locales';

import { useRef, useState, type RefObject } from 'react';
import { ChevronDown, Languages, X } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import type { KeyboardLocale } from '@/lib/typing-engine';
import { useLocale } from '@/components/locale-provider';

const languages = KEYBOARD_LOCALES.map((value) => ({
  value,
  keywords: [
    keyboardLabel(value, 'en'),
    keyboardLabel(value, 'ru'),
    keyboardLabel(value, keyboardLanguage(value)),
  ],
}));

type LanguageSwitcherProps = {
  languagePriority: readonly KeyboardLocale[];
  value: KeyboardLocale;
  onValueChange: (value: KeyboardLocale) => void;
  onOpenChange: (open: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function LanguageSwitcher({
  languagePriority,
  value,
  onValueChange,
  onOpenChange,
  inputRef,
}: LanguageSwitcherProps) {
  const { m, t, uiLocale } = useLocale();
  const compare = languageComparator(uiLocale, languagePriority, (locale) =>
    keyboardLabel(locale, uiLocale),
  );
  const sortedLanguages = languages.toSorted((a, b) =>
    compare(a.value, b.value),
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<string>(value);
  const search = useRef<HTMLInputElement>(null);
  const selected = useRef(false);
  const activeLabel = keyboardLabel(value, uiLocale);

  function changeOpen(next: boolean) {
    if (next) {
      setQuery('');
      setHighlighted(value);
      selected.current = false;
    }
    setOpen(next);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="language-trigger"
            aria-label={t('chooseKeyboardLanguage', { language: activeLabel })}
          />
        }
      >
        <Languages size={16} aria-hidden="true" />
        <span>{activeLabel}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </DialogTrigger>
      <DialogContent
        className={languageDialogClasses}
        showCloseButton={false}
        initialFocus={(interaction) =>
          interaction === 'touch' ? true : search.current
        }
        finalFocus={() => (selected.current ? inputRef.current : true)}
      >
        <DialogHeader className={languageDialogHeaderClasses}>
          <DialogTitle className={languageDialogTitleClasses}>
            {m.keyboardLanguage}
          </DialogTitle>
          <DialogDescription>{m.keyboardLanguageDescription}</DialogDescription>
        </DialogHeader>
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon"
              className={languageDialogCloseClasses}
              aria-label={m.closeKeyboardLanguage}
            />
          }
        >
          <X size={18} />
        </DialogClose>
        <ExperimentalLanguageWarning />
        <Command
          className="language-command"
          label={m.keyboardLanguageList}
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
                  keyboardLabel(language.value, uiLocale),
                ]}
                className="language-item"
                data-checked={value === language.value}
                onSelect={() => {
                  selected.current = true;
                  onValueChange(language.value);
                  changeOpen(false);
                }}
              >
                <span>
                  {keyboardLabel(language.value, uiLocale)}
                  {isExperimentalKeyboard(language.value) && (
                    <small className="text-muted-foreground block text-xs">
                      {m.experimental}
                    </small>
                  )}
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
