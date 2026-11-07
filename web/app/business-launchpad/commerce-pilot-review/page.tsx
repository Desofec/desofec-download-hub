import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { CommercePilotReviewEditor } from '@/components/commerce-pilot-review';
import { Tr } from '@/components/tr';
import { isProjectId } from '@/lib/pilot-projects';

export const metadata: Metadata = {
  title: 'Commerce Pilot Results & Learning Review',
  description: 'Record aggregate outcomes against a saved commerce pilot plan and document a human learning decision.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[] }>;

async function Review({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  const projectId = typeof project === 'string' && isProjectId(project) ? project : null;
  return projectId
    ? <CommercePilotReviewEditor key={projectId} projectId={projectId} />
    : <p><Tr>Open a saved commerce project with a pilot plan before reviewing results.</Tr></p>;
}

export default function CommercePilotReviewPage({ searchParams }: { searchParams: Query }) {
  return <section className="section proposal-page">
    <div className="container narrow-container">
      <div className="section-head">
        <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
        <h1><Tr>{'Commerce Pilot Results & Learning Review'}</Tr></h1>
        <p><Tr>Results review labels, validation messages and report text are in English. Navigation follows your language.</Tr></p>
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
        </div>
      </div>
      <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Review searchParams={searchParams} /></Suspense>
    </div>
  </section>;
}
