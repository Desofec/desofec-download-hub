import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { PilotResultsTracker } from '@/components/pilot-results-tracker';
import { Tr } from '@/components/tr';
import { Suspense } from 'react';

export const metadata = publicPageMetadata('/business-launchpad/results-tracker', {
  title: 'Pilot Test & Results Tracker',
  description: 'Record pilot test evidence, corrections, observed time and costs, and an evidence-based continue, revise or stop decision.'
});

async function ResultsForm({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  const { project } = await searchParams;
  const projectId = Array.isArray(project) ? '' : project;
  return <PilotResultsTracker key={projectId ?? 'standalone'} projectId={projectId} />;
}

export default function ResultsTrackerPage({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Pilot Test &amp; Results Tracker</Tr></h1>
          <p><Tr>Test a small pilot, record what actually happened and decide what to do next. No paid AI, account or live client integration required.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/proposal-builder"><Tr>Build a pilot proposal</Tr></Link>
          </div>
        </div>
        <Suspense fallback={<p><Tr>Loading...</Tr></p>}>
          <ResultsForm searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
