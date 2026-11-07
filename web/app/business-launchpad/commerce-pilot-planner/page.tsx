import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { CommercePilotPlanner } from '@/components/commerce-pilot-planner';
import { Tr } from '@/components/tr';
import { isProjectId } from '@/lib/pilot-projects';

export const metadata: Metadata = {
  title: 'Commerce Pilot Planner',
  description: 'Design a small, bounded commerce experiment with a budget cap, measurable criteria, responsible roles and a review date.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[] }>;

async function Planner({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  const projectId = typeof project === 'string' && isProjectId(project) ? project : null;
  return projectId
    ? <CommercePilotPlanner key={projectId} projectId={projectId} />
    : <p><Tr>Open a saved retail, marketplace or logistics project before drafting a pilot plan.</Tr></p>;
}

export default function CommercePilotPlannerPage({ searchParams }: { searchParams: Query }) {
  return <section className="section proposal-page">
    <div className="container narrow-container">
      <div className="section-head">
        <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
        <h1><Tr>{'Commerce Pilot Planner'}</Tr></h1>
        <p><Tr>Pilot planner labels, validation messages and report text are in English. Navigation follows your language.</Tr></p>
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
        </div>
      </div>
      <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Planner searchParams={searchParams} /></Suspense>
    </div>
  </section>;
}
