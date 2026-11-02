import type { Metadata } from 'next';
import { AccountPanel } from '@/components/account-panel';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Your account',
  description: 'Sign in to sync your learning progress across devices.'
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
      </div>
    </section>
  );
}
