'use client';

import Link from 'next/link';
import { setLanguage, useLanguage, useT } from '@/components/language';
import type { LanguageCode } from '@/lib/i18n';

export function TutorialLanguageNav({
  versions
}: {
  versions: { code: LanguageCode; label: string; href: string }[];
}) {
  const t = useT();
  const language = useLanguage();

  return (
    <nav className="tutorial-language-links" aria-label={t('nav.language')}>
      <strong>{t('nav.language')}:</strong>
      {versions.map(({ code, label, href }) => (
        <Link key={code} href={href} hrefLang={code} lang={code}
          aria-current={code === language ? 'page' : undefined} onClick={() => setLanguage(code)}>{label}</Link>
      ))}
    </nav>
  );
}
