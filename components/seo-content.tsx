import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Languages,
  Keyboard,
  Palette,
  PenLine,
} from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { localePath, referencePath, REPOSITORY_URL } from '@/lib/seo';
import copy from '@/lib/audience-copy.json';
import seoCopy from '@/lib/seo-copy.json';
import details from '@/lib/audience-details.json';

const examples = [
  { id: 'writers', icon: PenLine, symbols: ['—', '«', '»', '„', '“'] },
  {
    id: 'designers',
    icon: Palette,
    symbols: ['©', '®', '™', '€', '£', '¥', '¢'],
  },
  {
    id: 'translators',
    icon: Languages,
    symbols: ['ä', 'ö', 'ü', 'é', 'è', 'ç'],
  },
] as const;

export function SeoContent({ page }: { page: 'trainer' | 'reference' }) {
  const { uiLocale, m } = useLocale();
  const overview = seoCopy[uiLocale];
  const LinkIcon = page === 'trainer' ? BookOpen : Keyboard;
  const text = copy[uiLocale];
  const expanded =
    uiLocale === 'en' || uiLocale === 'ru' ? details[uiLocale] : undefined;
  const expandedGroups = expanded?.groups;
  return (
    <section
      aria-labelledby="about-layout-heading"
      className="border-border mt-12 w-full border-t pt-14 pb-16 text-sm leading-7 sm:mt-16 sm:pt-18 sm:pb-20"
    >
      <h2
        id="about-layout-heading"
        className="text-foreground mb-5 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
      >
        {overview.heading}
      </h2>
      <p className="text-muted-foreground text-base leading-8 text-pretty">
        {overview.positioning} {overview.intro}
      </p>
      <h3 className="text-foreground mt-8 mb-4 font-semibold">
        {overview.featuresTitle}
      </h3>
      <ul className="text-muted-foreground marker:text-primary/60 list-disc space-y-3 ps-5 text-pretty">
        <li>{overview.symbols}</li>
        <li>{overview.languages}</li>
        <li>{overview.search}</li>
      </ul>
      <h2
        id="audience-heading"
        className="text-foreground mt-14 mb-6 text-xl font-semibold tracking-tight text-balance sm:mt-16 sm:text-2xl"
      >
        {expanded?.title ?? text.title}
      </h2>
      <div className="grid min-w-0 gap-5">
        {examples.map(({ id, icon: Icon, symbols }, index) => (
          <article
            key={id}
            className="border-border bg-card min-w-0 rounded-2xl border p-5 sm:p-8"
          >
            <h3 className="text-foreground mb-6 flex items-center gap-3 text-base font-semibold text-balance">
              <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              {expandedGroups?.[index].title ?? text[`${id}Title`]}
            </h3>
            {expandedGroups ? (
              <ul className="text-muted-foreground space-y-5 text-pretty">
                {expandedGroups[index].items.map(([label, body]) => (
                  <li key={label}>
                    <strong className="text-foreground mb-1 block font-medium">
                      {label}
                    </strong>
                    {body}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-pretty">
                {text[`${id}Body`]}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2" dir="ltr">
              {symbols.map((symbol) =>
                id === 'translators' ? (
                  <span
                    key={symbol}
                    className={[
                      'border-primary/25 bg-primary/5 text-primary inline-flex size-10',
                      'items-center justify-center rounded-md border text-lg',
                    ].join(' ')}
                  >
                    {symbol}
                  </span>
                ) : (
                  <a
                    key={symbol}
                    href={`${referencePath(uiLocale)}#u-${symbol.codePointAt(0)!.toString(16)}`}
                    className={[
                      'border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 inline-flex size-10',
                      'items-center justify-center rounded-md border text-lg transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    ].join(' ')}
                  >
                    {symbol}
                  </a>
                ),
              )}
            </div>
          </article>
        ))}
      </div>
      <a
        className={[
          'group border-primary/30 bg-primary/5 text-foreground hover:border-primary/60',
          'hover:bg-primary/10 mt-8 flex w-full items-center gap-4 rounded-2xl border',
          'p-5 text-base font-semibold transition-colors sm:mt-10 sm:p-6',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          'motion-reduce:transition-none',
        ].join(' ')}
        href={
          page === 'trainer' ? referencePath(uiLocale) : localePath(uiLocale)
        }
      >
        <LinkIcon aria-hidden="true" className="text-primary size-6 shrink-0" />
        <span className="text-foreground flex-1 text-balance">
          {page === 'trainer' ? overview.referenceTitle : overview.openDemo}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="text-primary size-5 shrink-0 rtl:rotate-180"
        />
      </a>
      <p className="text-muted-foreground mt-5 text-sm leading-7 text-pretty">
        {expanded?.scope ?? text.scope}
      </p>
      {expanded && (
        <section aria-labelledby="faq-heading" className="mt-14 sm:mt-16">
          <h2
            id="faq-heading"
            className="text-foreground mb-6 text-xl font-semibold tracking-tight text-balance sm:text-2xl"
          >
            {expanded.faqTitle}
          </h2>
          <div className="border-border divide-border divide-y rounded-2xl border">
            {expanded.faq.map(([question, answer]) => (
              <details key={question} className="group px-5 sm:px-6">
                <summary
                  className={[
                    'text-foreground flex cursor-pointer list-none items-start',
                    'justify-between gap-4 rounded-sm py-5 font-medium text-balance',
                    'focus-visible:outline-2 focus-visible:outline-ring',
                    '[&::-webkit-details-marker]:hidden',
                  ].join(' ')}
                >
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className={[
                      'text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform',
                      'group-open:rotate-180 motion-reduce:transition-none',
                    ].join(' ')}
                  />
                </summary>
                <p className="text-muted-foreground pb-6 text-pretty">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
      <footer className="text-muted-foreground mt-12 text-sm leading-7 sm:mt-16">
        {overview.basedOn}{' '}
        <a
          className="underline underline-offset-4"
          href="https://ilyabirman.ru/typography-layout/"
        >
          {overview.basedOnLayout}
        </a>
        .{' '}
        <a className="underline underline-offset-4" href={REPOSITORY_URL}>
          {m.sourceLabel}
        </a>{' '}
        · MIT
      </footer>
    </section>
  );
}
