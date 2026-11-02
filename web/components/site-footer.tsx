'use client';

import Link from 'next/link';
import { Tr } from '@/components/tr';
import { LanguageEffect, useT } from '@/components/language';

export function SiteFooter() {
  const t = useT();
  return (
    <LanguageEffect>
      <footer className="site-footer">
        <div className="container footer-row">
          <div>{t('footer.copy')}</div>
          <nav className="footer-links" aria-label="Legal">
            <Link href="/privacy"><Tr>Privacy</Tr></Link>
            <Link href="/terms"><Tr>Terms</Tr></Link>
            <Link href="/contact"><Tr>Contact</Tr></Link>
          </nav>
          <div>{t('footer.tagline')}</div>
        </div>
      </footer>
    </LanguageEffect>
  );
}
