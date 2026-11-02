'use client';

import { useT } from '@/components/language';
import type { TranslationKey } from '@/lib/i18n';

export function TutorialLabel({ k }: { k: TranslationKey }) {
  return <>{useT()(k)}</>;
}
