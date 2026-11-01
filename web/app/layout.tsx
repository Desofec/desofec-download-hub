import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { FavoritesSync } from '@/components/favorites-sync';
import { PwaControls } from '@/components/pwa-controls';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Desofec AI Studio | Learn the right tools',
    template: '%s | Desofec AI Studio'
  },
  description:
    'Discover beginner-friendly AI tools, learning paths, and starter packs that match your goals.',
  metadataBase: new URL('https://desofec.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Desofec AI Studio',
    title: 'Desofec AI Studio | Learn the right tools',
    description:
      'Discover beginner-friendly AI tools, learning paths, and starter packs that match your goals.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desofec AI Studio | Learn the right tools',
    description:
      'Discover beginner-friendly AI tools, learning paths, and starter packs that match your goals.'
  },
  applicationName: 'Desofec AI Studio',
  appleWebApp: {
    capable: true,
    title: 'Desofec Studio',
    statusBarStyle: 'black-translucent'
  }
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AuthProvider>
          <FavoritesSync />
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          <PwaControls />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
