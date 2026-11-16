'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/components/language';
import { translateComplaintPack } from '@/lib/complaint-pack-translations';

export function useComplaintTr() {
  const language = useLanguage();
  return useCallback(
    (text: string, values?: Record<string, string | number>) => translateComplaintPack(text, language, values),
    [language]
  );
}

export function ComplaintTr({ children }: { children: string }) {
  return <>{useComplaintTr()(children)}</>;
}
