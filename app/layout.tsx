import type { Metadata } from 'next';
import './globals.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LocaleProvider } from '@/components/locale-provider';
import { buildBrandFavicon, themeBrandAccent } from '@/components/brand-mark';
import { preferencesBootstrap, preferencesGuardCss } from '@/lib/preferences';
import { messages } from '@/lib/messages';
import fontManifest from '@/public/fonts/fonts.json';

export const metadata: Metadata = {
  title: messages.en.pageTitle,
  description: messages.en.pageDescription,
  icons: { icon: buildBrandFavicon(themeBrandAccent('vesper_light')) },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        <LocaleProvider>
          <ScrollArea className="document-scroll-area">{children}</ScrollArea>
        </LocaleProvider>
      </body>
    </html>
  );
}
