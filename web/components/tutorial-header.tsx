'use client';

import type { ReactNode } from 'react';
import { useLanguage, useT } from '@/components/language';
import { getTutorialTranslation } from '@/lib/tutorial-translations';

export function TutorialHeader({
  pathId,
  title,
  intro,
  minutes
}: {
  pathId: string;
  title: string;
  intro: ReactNode;
  minutes: number;
}) {
  const t = useT();
  const translation = getTutorialTranslation(pathId, useLanguage());

  return (
    <div className="section-head">
      <span className="eyebrow">{t('tutorial.eyebrow', { minutes })}</span>
      <h1>{translation?.title ?? title}</h1>
      <p>{translation?.intro ?? intro}</p>
    </div>
  );
}
