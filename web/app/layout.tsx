import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { BreakTimer } from '@/components/break-timer';
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
    'Explore beginner-friendly learning paths, AI and digital tools, step-by-step tutorials, and practical starter packs for building real skills.',
  metadataBase: new URL('https://www.desofec.com'),
  verification: { google: 'B2vpNP_7gnCgWXYh1vZetOdmDsBKX6b-vBuU02sJmNA' },
  keywords: ['AI tools for beginners', 'learn AI', 'AI tutorials', 'AI learning paths', 'AI starter packs'],
  applicationName: 'Desofec AI Studio',
  appleWebApp: {
    capable: true,
    title: 'Desofec Studio',
    statusBarStyle: 'black-translucent'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.desofec.com/#website',
      url: 'https://www.desofec.com',
      name: 'Desofec AI Studio',
      description: 'Beginner-friendly AI tools, learning paths, tutorials and starter packs.',
      inLanguage: ['en', 'fr', 'de', 'es']
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.desofec.com/#org',
      name: 'Desofec AI Studio',
      url: 'https://www.desofec.com'
    }
  ]
};

const themeScript = `try{var t=localStorage.getItem('desofec:theme');if(['light','sky','sunrise','mint'].indexOf(t)>-1)document.documentElement.dataset.theme=t;if(localStorage.getItem('desofec:rainbow')==='on')document.documentElement.dataset.rainbow='on'}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <BreakTimer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
