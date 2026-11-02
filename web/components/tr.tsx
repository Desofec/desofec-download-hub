'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/components/language';
import { translatePhrase } from '@/lib/phrases';

// Renders an English string in the visitor's language, falling back to English.
export function Tr({ children, values }: { children: string; values?: Record<string, string | number> }) {
  return <>{translatePhrase(children, useLanguage(), values)}</>;
}

export function useTr() {
  const language = useLanguage();
  return useCallback(
    (text: string, values?: Record<string, string | number>) => translatePhrase(text, language, values),
    [language]
  );
}
