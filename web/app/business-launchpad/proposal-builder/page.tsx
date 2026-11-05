import type { Metadata } from 'next';
import Link from 'next/link';
import { PilotProposalBuilder } from '@/components/pilot-proposal-builder';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Pilot Proposal Builder',
  description: 'Plan costs, choose service fees and create an editable pilot proposal with local-only drafts, text download and printing.'
};

export default function ProposalBuilderPage() {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Pilot Proposal Builder</Tr></h1>
          <p><Tr>Turn a small service idea into a reviewable proposal. No paid AI, account or client connection required. This is a planning template, not legal, tax or financial advice.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
            <Link className="btn btn-secondary" href="/tutorials/ai-automation-services"><Tr>Start the automation service tutorial</Tr></Link>
          </div>
        </div>
        <PilotProposalBuilder />
      </div>
    </section>
  );
}
