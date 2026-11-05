import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PilotProjectWorkspace } from '@/components/pilot-project-workspace';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';
import { servicePathIds } from '@/lib/pilot-projects';

export const metadata: Metadata = {
  title: 'Pilot Project Workspace',
  description: 'Connect a service-learning brief, project checklist, proposal and test evidence with explicit saving and optional private account snapshots.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[]; path?: string | string[] }>;

async function Projects({ searchParams }: { searchParams: Query }) {
  const [{ project, path }, { paths }] = await Promise.all([searchParams, getCatalog()]);
  const initialPath = servicePathIds.find((id) => id === path);
  return <PilotProjectWorkspace projectId={Array.isArray(project) ? '' : project}
    initialPath={initialPath}
    paths={paths.filter((path) => servicePathIds.some((id) => id === path.id))} />;
}

export default function PilotProjectsPage({ searchParams }: { searchParams: Query }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Pilot Project Workspace</Tr></h1>
          <p><Tr>Turn a service learning path into a private practice project: brief, checklist, proposal, test evidence and next action in one place.</Tr></p>
          <Link className="btn btn-secondary" href="/business-launchpad"><Tr>AI Business Launchpad</Tr></Link>
          <Link className="btn btn-secondary" href="/business-launchpad/first-project"><Tr>Find a guided first project</Tr></Link>
        </div>
        <Suspense fallback={<p><Tr>Loading...</Tr></p>}>
          <Projects searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
