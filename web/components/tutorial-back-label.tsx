'use client';

import { useT } from '@/components/language';

export function BackToPathLabel() {
  const t = useT();
  return <>{t('tutorial.back')}</>;
}
