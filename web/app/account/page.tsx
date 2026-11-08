import type { Metadata } from 'next';
import { AccountPanel } from '@/components/account-panel';
import { Tr } from '@/components/tr';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Your account',
  description: 'Sign in to sync your learning progress across devices.',
  robots: { index: false, follow: true }
};

export default function AccountPage() {
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>Optional account</Tr></span>
          <h1><Tr>Keep your progress with you</Tr></h1>
          <p><Tr>Sign in to save your learning progress across devices.</Tr></p>
        </div>
        <AccountPanel />
        <p><Tr>Signing in does not upload project drafts. Use the workspace to choose private account snapshots explicitly.</Tr></p>
        <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
      </div>
    </section>
  );
}
