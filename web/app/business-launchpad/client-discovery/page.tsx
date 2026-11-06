import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ClientDiscoveryBuilder } from '@/components/client-discovery-builder';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Private Client Discovery & Project Scoping',
  description: 'Prepare a private discovery brief, project-fit checks and proposed scope changes for an existing service project.',
  robots: { index: false, follow: true }
};
type Query = Promise<{ project?: string | string[] }>;
async function Builder({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  return project === undefined
    ? <p><Tr>Open a saved service project in the workspace to save discovery. Use the public lab for temporary practice.</Tr></p>
    : <ClientDiscoveryBuilder key={typeof project === 'string' ? project : 'invalid'} projectId={Array.isArray(project) ? '' : project} />;
}
export default function ClientDiscoveryPage({ searchParams }: { searchParams: Query }) {
  return <section className="section proposal-page"><div className="container narrow-container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>{'Client Discovery & Project Scoping'}</Tr></h1>
      <div className="cta-row">
        <Link className="btn btn-secondary" href="/business-launchpad/client-discovery-lab"><Tr>Fictional client-brief simulator</Tr></Link>
        <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
      </div>
    </div>
    <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Builder searchParams={searchParams} /></Suspense>
  </div></section>;
}
