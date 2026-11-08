import { publicPageMetadata } from '@/lib/public-page-metadata';
import { LegalTranslation } from '@/components/legal-translation';

export const metadata = publicPageMetadata('/terms', {
  title: 'Terms of Use',
  description: 'The terms for using Desofec AI Studio.'
});

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container legal">
        <LegalTranslation kind="terms">
        <div lang="en" data-legal-source="terms">
        <h1>Terms of Use</h1>
        <p className="legal-date">Last updated: November 2026</p>
        <p>By using Desofec AI Studio you agree to these terms.</p>

        <h2>What the site is</h2>
        <p>Desofec AI Studio is an educational guide to AI tools, learning paths, tutorials and starter packs. Content is provided for general information and learning, not personalised legal, financial or other professional advice. Fictional practice, self-recorded progress and portfolios are not independently verified client work, accredited qualifications, client approval or promises of income.</p>

        <h2>Third-party tools</h2>
        <p>We link to tools run by other companies. We do not control them, and their own terms, pricing and privacy policies apply. Tool details may change without notice.</p>

        <h2>No guarantees</h2>
        <p>The site is provided &ldquo;as is&rdquo;. We try to keep content accurate, but we do not guarantee it is complete, current or suitable for your situation. Some translations are AI-assisted and may contain mistakes; consult the original language version when accuracy matters. Nothing in these terms removes rights that cannot lawfully be excluded.</p>

        <h2>Your account</h2>
        <p>Keep your sign-in details secure. Do not misuse the service, attempt to disrupt it, or submit harmful content.</p>

        <h2>Changes</h2>
        <p>We may update the site and these terms. Continued use means you accept the updated terms.</p>

        <h2>Contact</h2>
        <p>Questions? Visit our <a href="/contact">contact page</a>.</p>
        </div>
        </LegalTranslation>
      </div>
    </section>
  );
}
