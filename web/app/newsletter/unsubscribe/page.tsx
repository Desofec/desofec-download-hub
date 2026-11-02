import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Tr } from '@/components/tr';
import { NewsletterTokenPage } from '@/components/newsletter-token-page';

export const metadata: Metadata = {
  title: 'Unsubscribe from newsletter',
  robots: { index: false, follow: false }
};

export default function UnsubscribeNewsletterPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow"><Tr>Newsletter</Tr></span>
        <h1><Tr>Unsubscribe</Tr></h1>
        <p><Tr>Confirm that you want to stop receiving Desofec AI Studio updates.</Tr></p>
        <Suspense fallback={<p><Tr>Loading unsubscribe form…</Tr></p>}>
          <NewsletterTokenPage mode="unsubscribe" />
        </Suspense>
      </div>
    </section>
  );
}
