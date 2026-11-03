import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What data Desofec AI Studio collects, why, and how you can control it.'
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container legal">
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: November 2026</p>
        <p>Desofec AI Studio (&ldquo;we&rdquo;) respects your privacy. This page explains what we collect and why.</p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Email address</strong> if you subscribe to the newsletter or sign in. We use it only for that purpose.</li>
          <li><strong>Progress and favorites</strong> (paths, starter packs, tutorial steps, saved tools). Without an account these stay in your browser. When you sign in they are also saved to your account so they sync across devices.</li>
          <li><strong>Preferences</strong> such as your chosen language, stored in your browser.</li>
          <li><strong>Anonymous visit statistics</strong> (which pages are viewed, country and device type) so we can see which paths help people. This uses cookieless Vercel Web Analytics: no cookies, no advertising profiles and no tracking across other websites.</li>
        </ul>
        <p>We do not sell your data and we do not show third-party ads.</p>

        <h2>Services we use</h2>
        <ul>
          <li><strong>Supabase</strong> stores accounts, progress and subscriptions.</li>
          <li><strong>Resend</strong> sends confirmation and newsletter emails.</li>
          <li><strong>Vercel</strong> hosts the website, provides anonymous visit statistics and may process technical request data such as IP addresses.</li>
        </ul>

        <h2>Newsletter</h2>
        <p>We use a double opt-in: you only receive the newsletter after confirming your email. You can unsubscribe at any time using the link in any email.</p>

        <h2>Your choices</h2>
        <p>You can clear your browser storage at any time to remove locally saved data. To access, correct or delete the data tied to your email, contact us and we will help.</p>

        <h2>Children</h2>
        <p>The site is not directed at children under 13.</p>

        <h2>Contact</h2>
        <p>Questions about privacy? Visit our <a href="/contact">contact page</a>.</p>
      </div>
    </section>
  );
}
