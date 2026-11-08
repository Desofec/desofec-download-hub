import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { PilotProposalBuilder } from '@/components/pilot-proposal-builder';
import { Tr } from '@/components/tr';
import { Suspense } from 'react';

export const metadata = publicPageMetadata('/business-launchpad/proposal-builder', {
  title: 'Pilot Proposal Builder',
  description: 'Plan costs, choose service fees and create an editable pilot proposal with optional device or project drafts, text download and printing.'
});

async function ProposalForm({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  const { project } = await searchParams;
  const projectId = Array.isArray(project) ? '' : project;
  return <PilotProposalBuilder key={projectId ?? 'standalone'} projectId={projectId} />;
}

export default function ProposalBuilderPage({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Pilot Proposal Builder</Tr></h1>
          <p><Tr>Turn a small service idea into a reviewable proposal. No paid AI, account or client connection required. This is a planning template, not legal, tax or financial advice.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
            <Link className="btn btn-secondary" href="/tutorials/ai-automation-services"><Tr>Start the automation service tutorial</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/results-tracker"><Tr>Track pilot tests and results</Tr></Link>
          </div>
        </div>
        <Suspense fallback={<p><Tr>Loading...</Tr></p>}>
          <ProposalForm searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
