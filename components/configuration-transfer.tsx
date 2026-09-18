'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { Copy, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { configurationMessages } from '@/lib/configuration-messages';
import {
  decodeConfiguration,
  encodeConfiguration,
  type Configuration,
} from '@/lib/configuration-link';
import { localeUrl } from '@/lib/seo';

export function ConfigurationTransfer({
  value,
  onImport,
  initialError = false,
}: {
  value: Configuration;
  onImport: (value: Configuration) => void;
  initialError?: boolean;
}) {
  const { uiLocale } = useLocale();
  const text = configurationMessages[uiLocale];
  const [importing, setImporting] = useState(false);
  let link = '';
  try {
    link = encodeConfiguration(value, localeUrl(value.preferences.uiLocale));
  } catch {
    // Invalid drafts cannot be exported.
  }
  const linkField = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const field = linkField.current;
    if (!field || field.value !== link) {
      return;
    }
    const fit = () => {
      field.style.height = 'auto';
      const border = field.offsetHeight - field.clientHeight;
      field.style.height = `${field.scrollHeight + border}px`;
    };
    fit();
    let width = field.clientWidth;
    let pendingFrame = 0;
    const observer = new ResizeObserver(() => {
      if (field.clientWidth !== width) {
        width = field.clientWidth;
        cancelAnimationFrame(pendingFrame);
        pendingFrame = requestAnimationFrame(fit);
      }
    });
    observer.observe(field);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(pendingFrame);
    };
  }, [link]);
  const [notice, setNotice] = useState<
    'copied' | 'loaded' | 'invalid' | 'copyFailed' | 'pasteFailed' | null
  >(initialError ? 'invalid' : null);
  return (
    <section className="mt-8 space-y-4" aria-labelledby="settings-transfer">
      <h3 id="settings-transfer">{text.transfer}</h3>
      <p>{text.transferHelp}</p>
      <label className="grid gap-2 text-sm">
        {text.link}
        <textarea
          ref={linkField}
          dir="ltr"
          rows={3}
          value={link}
          readOnly
          spellCheck={false}
          autoComplete="off"
          className={[
            'border-border bg-background focus-visible:outline-primary min-w-0',
            'min-h-[120px] resize-none overflow-hidden rounded-lg border p-3 font-mono text-xs break-all',
          ].join(' ')}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-8 max-w-full text-start whitespace-normal"
          disabled={!link}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setNotice('copied');
            } catch {
              setNotice('copyFailed');
            }
          }}
        >
          <Copy size={16} />
          {text.export}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-8 max-w-full text-start whitespace-normal"
          disabled={importing}
          aria-busy={importing}
          onClick={async () => {
            setImporting(true);
            setNotice(null);
            try {
              let clipboard: string;
              try {
                clipboard = await navigator.clipboard.readText();
              } catch {
                setNotice('pasteFailed');
                return;
              }
              try {
                const imported = decodeConfiguration(clipboard);
                onImport(imported);
                setNotice('loaded');
              } catch {
                setNotice('invalid');
              }
            } finally {
              setImporting(false);
            }
          }}
        >
          <ClipboardPaste size={16} />
          {text.importLink}
        </Button>
      </div>
      {notice && (
        <p
          role={
            notice === 'invalid' || notice === 'pasteFailed'
              ? 'alert'
              : 'status'
          }
        >
          {text[notice]}
        </p>
      )}
    </section>
  );
}
