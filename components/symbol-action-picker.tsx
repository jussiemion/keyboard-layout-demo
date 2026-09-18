'use client';

import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';
import { configurationMessages } from '@/lib/configuration-messages';
import { symbolSearchMessages } from '@/lib/symbol-search-messages';
import { accentMessageKeys } from '@/lib/messages';
import { accents, type Action } from '@/lib/typing-engine';

export type PaletteRequest = {
  value: Action;
  label: string;
  keyLabel: string;
  trigger: HTMLButtonElement;
  onChoose: (action: Action) => void;
};

export function SymbolActionPicker({
  value,
  label,
  keyLabel,
  onOpenPalette,
  onChange,
}: {
  value: Action;
  label: string;
  keyLabel: string;
  onOpenPalette: (request: PaletteRequest) => void;
  onChange: (action: Action) => void;
}) {
  const { uiLocale, m } = useLocale();
  const text = configurationMessages[uiLocale];
  const search = symbolSearchMessages[uiLocale];
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="settings-language-trigger h-auto min-h-11 w-full justify-between px-3 text-start font-normal"
        aria-label={`${label}: ${search.title}`}
        onClick={(event) =>
          onOpenPalette({
            value,
            label,
            keyLabel,
            trigger: event.currentTarget,
            onChoose: onChange,
          })
        }
      >
        <span>
          {value.dead
            ? `${accents[value.dead].spacing} · ${m[accentMessageKeys[value.dead]]}`
            : text.text}
        </span>
        <ChevronDown className="shrink-0" size={16} />
      </Button>
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
