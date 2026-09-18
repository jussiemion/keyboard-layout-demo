'use client';

import { useRef, useState, type Ref } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command';
import { useLocale } from '@/components/locale-provider';
import { nativeLanguageNames } from '@/lib/messages';
import {
  keyboardLanguage,
  keyboardLabel,
  isExperimentalKeyboard,
  type KeyboardLocale,
} from '@/lib/keyboard-locales';
import { languageComparator } from '@/lib/language-priority';
import {
  languageDialogClasses,
  languageDialogHeaderClasses,
  languageDialogTitleClasses,
  languageDialogCloseClasses,
  languageCodeClasses,
} from '@/components/layout-classes';

function nativeLabel(locale: KeyboardLocale) {
  return locale.includes('-')
    ? keyboardLabel(locale, keyboardLanguage(locale))
    : nativeLanguageNames[keyboardLanguage(locale)];
}

export function SettingsLanguagePicker<T extends KeyboardLocale>({
  value,
  options,
  priority,
  label,
  onValueChange,
  disabledValue,
  triggerRef,
}: {
  value: T;
  options: readonly T[];
  priority: readonly KeyboardLocale[];
  label: string;
  onValueChange: (value: T) => void;
  disabledValue?: KeyboardLocale;
  triggerRef?: Ref<HTMLButtonElement>;
}) {
  const { m, uiLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<string>(value);
  const search = useRef<HTMLInputElement>(null);
  const sorted = options.toSorted(
    languageComparator(uiLocale, priority, nativeLabel),
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setQuery('');
          setHighlighted(value);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            className="settings-language-trigger h-11 w-full min-w-0 justify-between px-3 font-normal"
            aria-label={label}
          />
        }
      >
        <bdi lang={keyboardLanguage(value)} className="truncate">
          {nativeLabel(value)}
        </bdi>
        <span className="text-muted-foreground flex shrink-0 items-center gap-2">
          <bdi className="text-xs">{value.toUpperCase()}</bdi>
          <ChevronDown size={16} />
        </span>
      </DialogTrigger>
      <DialogContent
        className={languageDialogClasses}
        showCloseButton={false}
        dir={['he', 'ar'].includes(uiLocale) ? 'rtl' : 'ltr'}
        initialFocus={(interaction) =>
          interaction === 'touch' ? true : search.current
        }
      >
        <DialogHeader className={languageDialogHeaderClasses}>
          <DialogTitle className={languageDialogTitleClasses}>
            {label}
          </DialogTitle>
        </DialogHeader>
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={languageDialogCloseClasses}
              aria-label={m.closeKeyboardLanguage}
            />
          }
        >
          <X size={18} />
        </DialogClose>
        <Command
          className="language-command"
          label={label}
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
            {sorted.map((locale) => (
              <CommandItem
                key={locale}
                value={locale}
                disabled={locale === disabledValue}
                keywords={[
                  nativeLabel(locale),
                  keyboardLabel(locale, 'en'),
                  keyboardLabel(locale, 'ru'),
                  keyboardLabel(locale, uiLocale),
                ]}
                className="language-item"
                data-checked={locale === value}
                onSelect={() => {
                  onValueChange(locale);
                  setOpen(false);
                }}
              >
                <span className="min-w-0">
                  <bdi lang={keyboardLanguage(locale)}>
                    {nativeLabel(locale)}
                  </bdi>
                  {isExperimentalKeyboard(locale) && (
                    <small className="text-muted-foreground block text-xs">
                      {m.experimental}
                    </small>
                  )}
                </span>
                <span className={languageCodeClasses}>
                  <bdi>{locale.toUpperCase()}</bdi>
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
