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
          <li><strong>Guided practice portfolios</strong> are private previews derived from saved service projects, not separately stored or publicly hosted pages. The app does not upload or inspect original project files or independently verify recorded outcomes. The preview includes your brief, milestone status, test names/outcomes, required-case coverage where applicable and decision notes; it omits full proposals, structured financial fields and raw test evidence. Review all user-entered text before downloading or manually sharing. Downloading requires acknowledgement and creates a file on your device, not a public link; delete that file separately. Choosing a first-project goal does not save or upload a project. Loading service test plans requires confirmation and only replaces test cases in the current form; your saved project is unchanged until you explicitly save.</li>
          <li><strong>Private project evidence workbooks</strong> store practice text only when you explicitly save a revision to a device project. Each project can retain eight text items and five revisions per item, including earlier titles and full text. Test references also retain the test name, input and expected result at linking time. The app does not upload files, execute draft scripts or independently verify this work. References do not pass tests or grant approval. An explicitly consented account snapshot includes the entire saved workbook and its retained revisions. Workbook downloads include full saved text and older revisions, unlike the shorter practice portfolio; review all revisions for sensitive information before downloading, uploading or sharing. Delete item or Delete device project removes those local copies; account snapshots and downloaded files must be removed separately.</li>
          <li><strong>Project self-reviews</strong> across service paths retain one explicitly saved review per workbook item, including service-specific observations, correction tasks, self-recorded correction evidence and a separate full copy of the reviewed text revision. Removing workbook text does not remove its review copy. Delete saved review removes that device record; deleting the whole device project removes its device reviews too. Account snapshots and downloaded handover packs remain separate. Explicit account upload consent includes these review records and copied text, even if archived. Handover downloads require selection and review acknowledgement; they contain selected copied text, feedback, test names/outcomes and unresolved next actions, not unselected drafts, raw test evidence or structured costs. Self-reviews never verify work or grant client approval. Review sensitive details before uploading or sharing, and delete account/downloaded copies separately.</li>
          <li><strong>Spreadsheet practice lab</strong> uses fictional sample data and temporary in-page edits. It does not upload your files, run an AI model or OCR service, or automatically save lab results to a project or account. The fictional PDF is served by this site; CSV downloads are generated in your browser and remain on your device until you delete them. Copying observations into a private project follows the explicit project-saving and account-consent rules above.</li>
          <li><strong>Lesson feedback</strong> if you choose to vote while signed in. We store the lesson, helpful/not-helpful choice, your account reference and the time of your latest vote to improve lessons. Votes are not publicly visible. You can change or remove your vote on the lesson page. We do not collect written feedback comments.</li>
          <li><strong>Anonymous visit statistics</strong> (which pages are viewed, country and device type) so we can see which paths help people. This uses cookieless Vercel Web Analytics: no cookies, no advertising profiles and no tracking across other websites.</li>
        </ul>
        <p><strong>Freelance case studies:</strong> explicitly saved narrative text and selected test identifiers belong to your private device project. Optional account upload consent includes them. The saved preview and print layout contain the narrative, selected saved test text (including corrections and retests), and whole-project status, not full proposals, structured costs, workbook drafts or review copies. All exports are labelled fictional practice, not verified client work. Review every included section before exporting. No public page or sharing link is created. Delete the saved case study, account snapshots and downloaded or printed copies separately; deleting a case study does not delete source tests in the project. Browser print headers may include the page URL: disable headers and footers before sharing.</p>
        <p><strong>Client discovery and scoping:</strong> the public lab uses temporary page memory and fixed fictional answers, not AI or live outreach. It does not save or upload your edits. In a private service project, explicitly saved discovery includes brief text, project-fit choices, evidence notes and a proposed change. Optional account consent covers these records. Proposal import requires confirmation and only copies saved scope fields to an unsaved form; it never applies proposed changes, saves automatically or grants approval. Discovery downloads use saved discovery only, excluding unrelated project records. Delete discovery, account snapshots, downloaded files and copied proposal text separately. No automatic client contact or agreement occurs.</p>
        <p><strong>Start Here project dashboard:</strong> reads already-saved projects from this browser to show self-recorded milestones, test counts, decisions and case-study status. It does not independently verify deliverables, upload projects, load account snapshots or create additional saved records. Device projects may be visible to anyone using this browser profile. Account projects must be explicitly loaded from the workspace. The separate learning-checkmark panel uses the existing progress-sync rules above, not private-project sync.</p>
        <p><strong>Practice feedback guide:</strong> edits exist only in the open page and are lost on reload or navigation. The guide does not save them to a project, upload them or send a request. Separate request and revision-plan downloads contain the text shown in their previews and remain on your device until deleted. The blank worksheet is a public file. Use fictional or anonymised information, and inspect downloaded files before sharing.</p>
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
