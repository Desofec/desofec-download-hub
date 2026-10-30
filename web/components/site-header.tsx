'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/onboarding', label: 'Start', match: ['/onboarding', '/results'] },
  { href: '/tools', label: 'Tools' },
  { href: '/paths', label: 'Paths' },
  { href: '/starter-packs', label: 'Starter Packs' }
];

function isActive(pathname: string, href: string, match?: string[]) {
  if (href === '/') return pathname === '/';
  return (match ?? [href]).some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link href="/" className="brand">
          <span className="brand-mark">D</span>
          <span className="brand-text">Desofec AI Studio</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href, link.match) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-primary" href="/onboarding">
          Start my path
        </Link>
      </div>
    </header>
  );
}
