import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PwaControls } from '@/components/pwa-controls';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Desofec AI Studio | Learn the right tools',
    template: '%s | Desofec AI Studio'
  },
  description:
    'Discover beginner-friendly AI tools, learning paths, and starter packs that match your goals.',
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
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <PwaControls />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-row">
            <div>© 2026 Desofec AI Studio</div>
            <div>Learn the right tools. Build with confidence.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
