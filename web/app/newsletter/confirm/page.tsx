import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NewsletterTokenPage } from '@/components/newsletter-token-page';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Confirm newsletter subscription',
  robots: { index: false, follow: false }
};

export default function ConfirmNewsletterPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow"><Tr>Newsletter</Tr></span>
        <h1><Tr>Confirm your subscription</Tr></h1>
        <p><Tr>Confirm that you want to receive Desofec AI Studio updates by email.</Tr></p>
        <Suspense fallback={<p><Tr>Loading confirmation…</Tr></p>}>
          <NewsletterTokenPage mode="confirm" />
        </Suspense>
      </div>
    </section>
  );
}
