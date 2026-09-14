import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/components/locale-provider';
import { pageMetadata } from '@/lib/seo';
import Home from '../page';
import { UI_LOCALES } from '@/lib/messages';
import { parseUiLocale } from '@/lib/i18n';

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
  return pageMetadata(locale);
}

export default async function LocalizedPage({
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
      <Home initialLocale={locale} rootPage={false} />
    </LocaleProvider>
  );
}
