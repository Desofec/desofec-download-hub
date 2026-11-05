import type { Metadata } from 'next';
import Link from 'next/link';
import { PilotResultsTracker } from '@/components/pilot-results-tracker';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Pilot Test & Results Tracker',
  description: 'Record pilot test evidence, corrections, observed time and costs, and an evidence-based continue, revise or stop decision.'
};

export default function ResultsTrackerPage() {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Pilot Test &amp; Results Tracker</Tr></h1>
          <p><Tr>Test a small pilot, record what actually happened and decide what to do next. No paid AI, account or live client integration required.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/proposal-builder"><Tr>Build a pilot proposal</Tr></Link>
          </div>
        </div>
        <PilotResultsTracker />
      </div>
    </section>
  );
}
