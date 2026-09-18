'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { configurationMessages } from '@/lib/configuration-messages';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import { accentMessageKeys } from '@/lib/messages';
import { accents, type Action } from '@/lib/typing-engine';

import SymbolPalette from '@/components/symbol-palette';

export function SymbolActionPicker({
  value,
  label,
  onChange,
}: {
  value: Action;
  label: string;
  onChange: (action: Action) => void;
}) {
  const { uiLocale, m } = useLocale();
  const text = configurationMessages[uiLocale];
  const search = symbolSearchMessages[uiLocale];
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="settings-language-trigger h-auto min-h-11 w-full justify-between px-3 text-start font-normal"
              aria-label={`${label}: ${search.title}`}
            />
          }
        >
          <span>
            {value.dead
              ? `${accents[value.dead].spacing} · ${m[accentMessageKeys[value.dead]]}`
              : text.text}
          </span>
          <ChevronDown className="shrink-0" size={16} />
        </DialogTrigger>
        <DialogContent
          className="symbol-palette-dialog data-closed:animate-none data-open:animate-none"
          dir={['ar', 'he'].includes(uiLocale) ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <header className="flex items-center justify-between gap-3">
            <DialogTitle>
              {search.title} ·{' '}
              <span className="inline-mode" data-mode={label.slice(1)}>
                {label}
              </span>
            </DialogTitle>
            <DialogClose
              render={
                <Button variant="ghost" size="icon" aria-label={search.close} />
              }
            >
              <X size={18} />
            </DialogClose>
          </header>
          {open && (
            <SymbolPalette
              value={value}
              onChoose={(action) => {
                onChange(action);
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {!value.dead && (
        <input
          className={[
            'settings-symbol-input border-border bg-background',
            'focus-visible:outline-primary min-h-11 w-full min-w-0 rounded-lg',
            'border px-3 py-2 font-mono text-sm placeholder:italic',
          ].join(' ')}
          dir="auto"
          aria-label={`${label}: ${text.text}`}
          placeholder={text.empty}
          value={value.text ?? ''}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) =>
            onChange(event.target.value ? { text: event.target.value } : {})
          }
        />
      )}
    </>
  );
}
