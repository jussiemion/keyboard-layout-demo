import { resultExamplesClasses } from '@/components/layout-classes';
import { Fragment, type ReactNode } from 'react';

/** A displayed result, distinct from the key that produces it. */
export function ResultSymbol({ children }: { children: ReactNode }) {
  return <samp className="result-symbol">{children}</samp>;
}

export function ResultSequence({ text }: { text: string }) {
  return text.split(' → ').map((symbol, index) => (
    <Fragment key={index}>
      {index > 0 && <span aria-hidden="true"> → </span>}
      <ResultSymbol>{symbol}</ResultSymbol>
    </Fragment>
  ));
}

export function HebrewExamples() {
  return (
    <bdi className={resultExamplesClasses} dir="ltr">
      <kbd>A</kbd> → <ResultSymbol>◌ְ</ResultSymbol>, <kbd>S</kbd> →{' '}
      <ResultSymbol>◌ּ</ResultSymbol>, <kbd>-</kbd> →{' '}
      <ResultSymbol>־</ResultSymbol>
    </bdi>
  );
}
