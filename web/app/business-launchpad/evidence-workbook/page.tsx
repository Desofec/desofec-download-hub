import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectEvidenceWorkbook } from '@/components/project-evidence-workbook';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Private Project Evidence Workbook',
  description: 'Keep private practice text, explicit saved revisions and references to test records within one pilot project.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[] }>;
async function Workbook({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  const projectId = Array.isArray(project) ? '' : project;
  return <ProjectEvidenceWorkbook key={projectId ?? 'missing'} projectId={projectId} />;
}

export default function EvidenceWorkbookPage({ searchParams }: { searchParams: Query }) {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Private Project Evidence Workbook</Tr></h1>
          <p><Tr>Draft practice materials, preserve saved revisions and link your own work to test records without inventing results.</Tr></p>
        </div>
        <Suspense fallback={<p><Tr>Loading...</Tr></p>}>
          <Workbook searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
