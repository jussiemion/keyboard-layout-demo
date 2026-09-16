'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import {
  Apple,
  BellPlus,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Monitor,
  Send,
  Terminal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocale } from '@/components/locale-provider';
import { normalizeTelegramUsername, WAITLIST_PLATFORMS } from '@/lib/waitlist';
import copy from '@/lib/waitlist-copy.json';

const platformIcons = { Windows: Monitor, macOS: Apple, Linux: Terminal };

function WaitlistForm() {
  const { uiLocale } = useLocale();
  const text = copy[uiLocale];
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const endpoint =
    process.env.NEXT_PUBLIC_WAITLIST_URL ??
    'https://yushkevich-layout-waitlist.keyboard-layout-demo.workers.dev/waitlist';

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !endpoint) {
      return;
    }
    const form = new FormData(event.currentTarget);
    const rawUsername = form.get('username');
    const username =
      typeof rawUsername === 'string'
        ? normalizeTelegramUsername(rawUsername)
        : null;
    const platform = form.get('platform');
    if (!username || !WAITLIST_PLATFORMS.some((value) => value === platform)) {
      setError(text.invalid);
      return;
    }
    submitting.current = true;
    setStatus('sending');
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          platform,
          locale: uiLocale,
          website: form.get('website') || '',
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result: { ok?: boolean } = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error('Submission failed');
      }
      setStatus('success');
    } catch {
      setError(text.error);
      setStatus('idle');
    } finally {
      submitting.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div className="grid gap-6 px-5 pb-5 sm:px-7 sm:pb-7">
        <output
          className={[
            'border-primary/20 bg-primary/5 grid justify-items-center gap-4',
            'rounded-xl border px-5 py-8 text-center',
          ].join(' ')}
        >
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <span className="max-w-80 text-sm leading-relaxed text-balance">
            {text.success}
          </span>
        </output>
        <DialogClose
          render={<Button variant="outline" className="h-12 px-3.5" />}
        >
          {text.close}
        </DialogClose>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-5 px-5 sm:px-7">
        <div className="grid gap-2">
          <label htmlFor="waitlist-username" className="text-sm font-medium">
            Telegram
          </label>
          <Input
            id="waitlist-username"
            name="username"
            placeholder="@username"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={33}
            required
            dir="ltr"
            className="h-11"
            disabled={status === 'sending'}
            aria-describedby={error ? 'waitlist-error' : undefined}
          />
        </div>
        <fieldset disabled={status === 'sending'}>
          <legend className="mb-2.5 text-sm font-medium">
            {text.platform}
          </legend>
          <div className="grid grid-cols-3 gap-2" dir="ltr">
            {WAITLIST_PLATFORMS.map((platform) => {
              const Icon = platformIcons[platform];
              return (
                <label
                  key={platform}
                  className={[
                    'group border-border bg-muted/30 hover:bg-muted/60',
                    'has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary',
                    'has-focus-visible:ring-ring/50 has-focus-visible:ring-3',
                    'relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2.5',
                    'rounded-xl border px-2 py-4 text-xs font-medium transition-colors sm:text-sm',
                    'has-disabled:pointer-events-none has-disabled:opacity-60',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={platform}
                    required
                    className="sr-only"
                  />
                  <Check
                    className="absolute end-2 top-2 size-3.5 opacity-0 group-has-checked:opacity-100"
                    aria-hidden="true"
                  />
                  <Icon
                    className="size-6"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {platform}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div hidden aria-hidden="true">
          <input name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {!endpoint && <output>{text.unavailable}</output>}
        {error && (
          <p
            id="waitlist-error"
            className={[
              'border-destructive/20 bg-destructive/5 text-destructive rounded-lg',
              'border p-3 text-sm leading-relaxed',
            ].join(' ')}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
      <div className="bg-muted/25 grid gap-3 px-5 pt-3 pb-5 sm:px-7">
        <Button
          type="submit"
          className="h-auto min-h-12 py-3 whitespace-normal"
          disabled={!endpoint || status === 'sending'}
        >
          {status === 'sending' ? (
            <LoaderCircle
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === 'sending' ? text.sending : text.send}
        </Button>
        <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
          <LockKeyhole
            className="mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>{text.privacy}</span>
        </p>
      </div>
    </form>
  );
}

export function WaitlistButton({ onOpen }: { onOpen?: () => void }) {
  const { uiLocale } = useLocale();
  const text = copy[uiLocale];
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          onOpen?.();
        }
      }}
    >
      <DialogTrigger render={<Button className="min-h-10 gap-2" />}>
        <BellPlus className="size-4 shrink-0" aria-hidden="true" />
        {text.cta}
      </DialogTrigger>
      <DialogContent
        className={[
          'max-h-[calc(100dvh-32px)] w-[480px] max-w-[calc(100vw-32px)] gap-6',
          'overflow-x-hidden overflow-y-auto rounded-2xl p-0 shadow-xl sm:max-w-[480px]',
        ].join(' ')}
        showCloseButton={false}
        dir={['he', 'ar'].includes(uiLocale) ? 'rtl' : 'ltr'}
      >
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute end-3 top-3"
              aria-label={text.close}
            />
          }
        >
          <X aria-hidden="true" />
        </DialogClose>
        <div className="grid gap-4 px-5 pt-5 sm:px-7 sm:pt-7">
          <div
            className={[
              'border-primary/20 bg-primary/10 text-primary flex size-11',
              'items-center justify-center rounded-xl border',
            ].join(' ')}
          >
            <BellPlus className="size-5" aria-hidden="true" />
          </div>
          <div className="grid gap-2 pe-4">
            <DialogTitle className="text-xl leading-tight text-balance">
              {text.title}
            </DialogTitle>
            <DialogDescription className="leading-relaxed text-pretty">
              {text.intro}
            </DialogDescription>
          </div>
        </div>
        <WaitlistForm />
      </DialogContent>
    </Dialog>
  );
}
