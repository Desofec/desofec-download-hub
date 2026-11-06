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
          <li><strong>Pilot proposal drafts</strong> only if you explicitly save in the proposal builder. One draft is stored locally in the browser profile, not in your account or our database. The app does not send proposal text to an AI service. Anyone using that browser profile may access the saved copy; do not enter personal or confidential client information. Use Delete saved copy to remove it. Downloaded files remain on your device until you delete them separately.</li>
          <li><strong>Pilot test results</strong> only if you explicitly save in the results tracker. One tracker draft, separate from your proposal, stays in this browser profile without account sync or AI processing. It includes your test evidence, costs and decision; anyone using the profile may access it. Use fictional or anonymised data only. Delete saved results removes the browser copy, not the current page or downloaded reports. Browser clearing may erase local drafts.</li>
          <li><strong>Pilot project workspaces</strong> only when you create or explicitly save a project. Up to ten device projects contain your brief, separate project checklist, proposal (including internal costs) and test results. Device projects are not encrypted by the app and are accessible to anyone using that browser profile. These drafts stay separate from the standalone proposal/results drafts and learning progress. Signing in does not upload them. If you explicitly consent and upload, a private account snapshot is stored in Supabase for access on another device. This is manual snapshot saving/loading, not background synchronisation or end-to-end encryption. Only your account can access its snapshots under database row-level policies. Delete device project and Delete account snapshot remove those copies separately; downloaded files remain until you delete them. No project content is sent to AI or automatically sent or published to clients. Use fictional or anonymised data only. Summary downloads omit financial fields but still include user-entered brief and decision text; review before sharing.</li>
          <li><strong>Guided practice portfolios</strong> are private previews derived from saved projects across all five service paths, not separately stored or publicly hosted pages. The app does not upload or inspect original project files or independently verify recorded outcomes. The preview includes your brief, milestone status, test names/outcomes, required-case coverage where applicable and decision notes; it omits full proposals, structured financial fields and raw test evidence. Review all user-entered text before downloading or manually sharing. Downloading requires acknowledgement and creates a file on your device, not a public link; delete that file separately. Choosing a first-project goal does not save or upload a project. Loading service test plans requires confirmation and only replaces test cases in the current form; your saved project is unchanged until you explicitly save.</li>
          <li><strong>Lesson feedback</strong> if you choose to vote while signed in. We store the lesson, helpful/not-helpful choice, your account reference and the time of your latest vote to improve lessons. Votes are not publicly visible. You can change or remove your vote on the lesson page. We do not collect written feedback comments.</li>
          <li><strong>Anonymous visit statistics</strong> (which pages are viewed, country and device type) so we can see which paths help people. This uses cookieless Vercel Web Analytics: no cookies, no advertising profiles and no tracking across other websites.</li>
        </ul>
        <p>We do not sell your data and we do not show third-party ads.</p>

        <h2>Services we use</h2>
        <ul>
          <li><strong>Supabase</strong> stores accounts, progress, lesson feedback, subscriptions and explicitly uploaded private project snapshots.</li>
          <li><strong>Google</strong> if you choose &ldquo;Continue with Google&rdquo;. We receive only your email address and sign-in confirmation, never your Google password.</li>
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
