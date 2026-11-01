import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewsletterTokenPage } from '@/components/newsletter-token-page';

export const metadata: Metadata = {
  title: 'Confirm newsletter subscription',
  robots: { index: false, follow: false }
};

export default function ConfirmNewsletterPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Newsletter</span>
        <h1>Confirm your subscription</h1>
        <p>Confirm that you want to receive Desofec AI Studio updates by email.</p>
        <Suspense fallback={<p>Loading confirmation…</p>}>
          <NewsletterTokenPage mode="confirm" />
        </Suspense>
      </div>
    </section>
  );
}
