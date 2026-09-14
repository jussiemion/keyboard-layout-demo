import { LocaleProvider } from '@/components/locale-provider';
import { notFound } from 'next/navigation';
import { parseUiLocale } from '@/lib/i18n';
import { UI_LOCALES } from '@/lib/messages';
import { referenceMetadata } from '@/lib/seo';
import { TypographyReference } from '@/components/typography-reference';

export const dynamicParams = false;
export function generateStaticParams() {
  return UI_LOCALES.map((lang) => ({ lang }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = parseUiLocale((await params).lang);
  if (!locale) {
    notFound();
  }
  return referenceMetadata(locale);
}
export default async function ReferencePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = parseUiLocale((await params).lang);
  if (!locale) {
    notFound();
  }
  return (
    <LocaleProvider initialLocale={locale}>
      <TypographyReference />
    </LocaleProvider>
  );
}
