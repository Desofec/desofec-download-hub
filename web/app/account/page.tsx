import type { Metadata } from 'next';
import { AccountPanel } from '@/components/account-panel';

export const metadata: Metadata = {
  title: 'Your account',
  description: 'Sign in to sync your learning progress across devices.'
};

export default function AccountPage() {
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow">Optional account</span>
          <h1>Keep your progress with you</h1>
          <p>Sign in to save your learning progress across devices.</p>
        </div>
        <AccountPanel />
      </div>
    </section>
  );
}
