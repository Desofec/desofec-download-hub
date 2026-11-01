'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';

const links = [
  { href: '/', label: 'Home' },
  { href: '/onboarding', label: 'Start', match: ['/onboarding', '/results'] },
  { href: '/tools', label: 'Tools' },
  { href: '/paths', label: 'Paths' },
  { href: '/starter-packs', label: 'Starter Packs' },
  { href: '/my-progress', label: 'My Progress' }
];

function isActive(pathname: string, href: string, match?: string[]) {
  if (href === '/') return pathname === '/';
  return (match ?? [href]).some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = useAuth();

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
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            className={session?.user.email ? undefined : 'signin-pulse'}
            onClick={() => setMenuOpen(false)}>
            {session?.user.email ? 'Account' : 'Sign in'}
          </Link>
          <Link className="btn btn-primary mobile-nav-cta" href="/onboarding" onClick={() => setMenuOpen(false)}>
            Start my path
          </Link>
        </nav>
        <Link className="btn btn-primary desktop-nav-cta" href="/onboarding">
          Start my path
        </Link>
      </div>
    </header>
  );
}
