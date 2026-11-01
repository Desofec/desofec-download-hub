'use client';

import { LanguageEffect, useT } from '@/components/language';

export function SiteFooter() {
  const t = useT();
  return (
    <LanguageEffect>
      <footer className="site-footer">
        <div className="container footer-row">
          <div>{t('footer.copy')}</div>
          <div>{t('footer.tagline')}</div>
        </div>
      </footer>
    </LanguageEffect>
  );
}
