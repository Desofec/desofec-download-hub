import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { BreakTimer } from '@/components/break-timer';
import { FavoritesSync } from '@/components/favorites-sync';
import { TutorialPathsProvider } from '@/components/language';
import { PwaControls } from '@/components/pwa-controls';
import { PrivacyAnalytics } from '@/components/privacy-analytics';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Tr } from '@/components/tr';
import { localizedTutorials } from '@/lib/localized-tutorials';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Desofec AI Studio | Learn the right tools',
    template: '%s | Desofec AI Studio'
  },
  description:
    'Explore beginner-friendly learning paths, AI and digital tools, step-by-step tutorials, and practical starter packs for building real skills.',
  metadataBase: new URL('https://www.desofec.com'),
  referrer: 'strict-origin',
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
const localizedTutorialPaths = localizedTutorials.map((tutorial) => tutorial.href);

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <TutorialPathsProvider paths={localizedTutorialPaths}>
          <a className="skip-link" href="#main-content">
            <Tr>Skip to content</Tr>
          </a>
          <AuthProvider>
            <FavoritesSync />
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <PwaControls />
            <main id="main-content" tabIndex={-1}>{children}</main>
            <SiteFooter />
            <BreakTimer />
          </AuthProvider>
          <PrivacyAnalytics />
        </TutorialPathsProvider>
      </body>
    </html>
  );
}
