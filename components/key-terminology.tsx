import { TranslatedText } from '@/components/translated-text';
import { keyTerminology } from '@/lib/key-terminology';
import type { UiLocale } from '@/lib/messages';

export function KeyTerminology({
  kind,
  locale,
}: {
  kind: 'switcher' | 'modifier';
  locale: UiLocale;
}) {
  return (
    <TranslatedText
      message={keyTerminology[locale][kind]}
      values={{
        key:
          kind === 'switcher' ? (
            <kbd className="language-mark">S</kbd>
          ) : (
            <kbd className="inline-mode" data-mode="1">
              M
            </kbd>
          ),
      }}
    />
  );
}
