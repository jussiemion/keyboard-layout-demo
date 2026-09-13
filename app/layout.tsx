import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Typographic Layout by Semyon Yushkevich',
  description:
    'A keyboard layout for typographic punctuation, symbols, diacritics and language switching.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
