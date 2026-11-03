'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { RainbowSwitch } from '@/components/rainbow-switch';
import { ThemeToggle } from '@/components/theme-toggle';
import { useT } from '@/components/language';
import { useTr } from '@/components/tr';
import type { TranslationKey } from '@/lib/i18n';

const links: { href: string; label: TranslationKey; match?: string[] }[] = [
  { href: '/', label: 'nav.home' },
  { href: '/onboarding', label: 'nav.start', match: ['/onboarding', '/results'] },
  { href: '/tools', label: 'nav.tools' },
  { href: '/paths', label: 'nav.paths' },
  { href: '/tutorials', label: 'nav.tutorials', match: ['/tutorials', '/projects'] },
  { href: '/starter-packs', label: 'nav.packs' },
  { href: '/my-progress', label: 'nav.progress' }
];

function isActive(pathname: string, href: string, match?: string[]) {
  if (href === '/') return pathname === '/';
  return (match ?? [href]).some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = useAuth();
  const t = useT();
  const tr = useTr();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link href="/" className="brand">
          <span className="brand-mark">D</span>
          <span className="brand-text">Desofec AI Studio</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={`main-nav${menuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href, link.match) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}
          <Link
            href="/account"
            className={session?.user.email ? undefined : 'signin-pulse'}
            onClick={() => setMenuOpen(false)}>
            {session?.user.email ? t('nav.account') : t('nav.signin')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <RainbowSwitch />
          <Link
            className="break-link"
            href="/break-room"
            aria-label={tr('Break room')}
            title={tr('Break room')}
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">☕</span>
          </Link>
          <Link className="btn btn-primary mobile-nav-cta" href="/onboarding" onClick={() => setMenuOpen(false)}>
            {t('nav.cta')}
          </Link>
        </nav>
        <Link className="btn btn-primary desktop-nav-cta" href="/onboarding">
          {t('nav.cta')}
        </Link>
      </div>
    </header>
  );
}
