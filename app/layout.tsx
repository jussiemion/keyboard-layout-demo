import type { Metadata } from 'next';
import './globals.css';
import { ThemeFavicon } from '@/components/theme-favicon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LocaleProvider } from '@/components/locale-provider';
import { preferencesBootstrap, preferencesGuardCss } from '@/lib/preferences';
import { parseUiLocale } from '@/lib/i18n';
import { pageMetadata, SITE_PATH } from '@/lib/seo';
import fontManifest from '@/public/fonts/fonts.json';

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}>;
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const locale = parseUiLocale((await params).lang);
  return {
    ...pageMetadata(locale ?? 'en', !locale),
    icons: {
      icon: { url: `${SITE_PATH}/logo.svg?v=letter-y`, type: 'image/svg+xml' },
    },
  };
}
export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = parseUiLocale((await params).lang);
  const initialLocale = locale ?? 'en';
  return (
    <html
      lang={initialLocale}
      dir={initialLocale === 'ar' || initialLocale === 'he' ? 'rtl' : 'ltr'}
      data-rendered-locale={initialLocale}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="google-site-verification"
          content="OYzmOHxqWZwiQfEVvGtC0NnjUlVAvpUX6kV6byZHHH8"
        />
        {fontManifest.fonts.map((font) => (
          <link
            key={font.file}
            rel="preload"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/fonts/${font.file}`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <style>{preferencesGuardCss}</style>
        <script dangerouslySetInnerHTML={{ __html: preferencesBootstrap }} />
      </head>
      <body>
        <ThemeFavicon />
        <LocaleProvider initialLocale={initialLocale}>
          <ScrollArea className="document-scroll-area">{children}</ScrollArea>
        </LocaleProvider>
      </body>
    </html>
  );
}
