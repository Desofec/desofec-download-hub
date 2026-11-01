import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewsletterTokenPage } from '@/components/newsletter-token-page';

export const metadata: Metadata = {
  title: 'Unsubscribe from newsletter',
  robots: { index: false, follow: false }
};

export default function UnsubscribeNewsletterPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Newsletter</span>
        <h1>Unsubscribe</h1>
        <p>Confirm that you want to stop receiving Desofec AI Studio updates.</p>
        <Suspense fallback={<p>Loading unsubscribe form…</p>}>
          <NewsletterTokenPage mode="unsubscribe" />
        </Suspense>
      </div>
    </section>
  );
}
