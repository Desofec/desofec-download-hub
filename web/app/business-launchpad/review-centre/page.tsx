import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectReviewCentre } from '@/components/project-review-centre';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Guided Project Review Centre',
  description: 'Review saved content practice drafts, record corrections and assemble a private self-reviewed handover.',
  robots: { index: false, follow: true }
};
type Query = Promise<{ project?: string | string[] }>;
async function Review({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  const projectId = Array.isArray(project) ? '' : project;
  return <ProjectReviewCentre key={projectId ?? 'missing'} projectId={projectId} />;
}
export default function ReviewCentrePage({ searchParams }: { searchParams: Query }) {
  return (
    <section className="section proposal-page">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
          <h1><Tr>Guided Project Review Centre</Tr></h1>
          <p><Tr>Review saved content drafts, record correction tasks and prepare a private handover without inventing approval.</Tr></p>
        </div>
        <Suspense fallback={<p><Tr>Loading...</Tr></p>}>
          <Review searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
