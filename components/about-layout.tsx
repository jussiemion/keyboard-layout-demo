import { useLocale } from '@/components/locale-provider';
import { localePath, REPOSITORY_URL } from '@/lib/seo';
import copy from '@/lib/seo-copy.json';

export function AboutLayout() {
  const { uiLocale, m } = useLocale();
  const text = copy[uiLocale];
  return (
    <section
      className={[
        'border-border text-muted-foreground mt-12 w-full',
        'border-t py-8 text-sm leading-relaxed',
      ].join(' ')}
      aria-labelledby="about-layout-heading"
    >
      <h2
        id="about-layout-heading"
        className="text-foreground mb-3 text-lg font-semibold"
      >
        {text.heading}
      </h2>
      <p>
        {text.positioning} {text.intro}
      </p>
      <p className="mt-3">
        <a
          className="text-foreground font-semibold underline underline-offset-4"
          href={localePath(uiLocale)}
        >
          {text.openDemo}
        </a>
      </p>
      <h3 className="text-foreground mt-6 mb-2 font-semibold">
        {text.featuresTitle}
      </h3>
      <ul className="list-disc space-y-2 ps-5">
        <li>{text.symbols}</li>
        <li>{text.languages}</li>
        <li>{text.search}</li>
      </ul>
      <p className="mt-6">
        {text.basedOn}{' '}
        <a
          className="underline underline-offset-4"
          href="https://ilyabirman.ru/typography-layout/"
        >
          Ilya Birman
        </a>
        .{' '}
        <a className="underline underline-offset-4" href={REPOSITORY_URL}>
          {m.sourceLabel}
        </a>{' '}
        · MIT
      </p>
    </section>
  );
}
