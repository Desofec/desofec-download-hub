import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { CommerceReadinessBuilder } from '@/components/commerce-readiness-builder';
import { Tr } from '@/components/tr';
import { isProjectId } from '@/lib/pilot-projects';

export const metadata: Metadata = {
  title: 'Commerce Validation and Readiness',
  description: 'Record customer evidence, compare providers, model costs and review commerce responsibilities before deciding what to validate next.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[] }>;

async function Readiness({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  const projectId = typeof project === 'string' && isProjectId(project) ? project : null;
  return projectId
    ? <CommerceReadinessBuilder key={projectId} projectId={projectId} />
    : <p><Tr>Open a saved retail, marketplace or logistics project in the workspace before recording readiness.</Tr></p>;
}

export default function CommerceReadinessPage({ searchParams }: { searchParams: Query }) {
  return <section className="section proposal-page">
    <div className="container narrow-container">
      <div className="section-head">
        <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
        <h1><Tr>{'Commerce Validation & Readiness'}</Tr></h1>
        <p><Tr>Commerce readiness form labels, validation messages and report text are in English. Navigation follows your language.</Tr></p>
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
        </div>
      </div>
      <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Readiness searchParams={searchParams} /></Suspense>
    </div>
  </section>;
}
