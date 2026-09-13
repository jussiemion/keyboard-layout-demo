'use client';

import { FlaskConical } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

export function ExperimentalLanguageWarning() {
  const { m } = useLocale();
  return (
    <div role="note" className="experimental-language-warning">
      <FlaskConical size={20} aria-hidden="true" />
      <p>{m.experimentalLanguageSupport}</p>
    </div>
  );
}
