import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectCaseStudy } from '@/components/project-case-study';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Private Freelance Case Study Builder',
  description: 'Write, save and print a private fictional-practice case study from selected project evidence.',
  robots: { index: false, follow: true }
};

type Query = Promise<{ project?: string | string[] }>;
async function Builder({ searchParams }: { searchParams: Query }) {
  const { project } = await searchParams;
  return <ProjectCaseStudy key={typeof project === 'string' ? project : 'missing'}
    projectId={Array.isArray(project) ? '' : project} />;
}

export default function CaseStudyBuilderPage({ searchParams }: { searchParams: Query }) {
  return <section className="section proposal-page">
    <div className="container narrow-container">
      <div className="section-head">
        <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
        <h1><Tr>Private Freelance Case Study Builder</Tr></h1>
        <p><Tr>Describe your practice problem, contribution, evidence and limitations. Select what to include, then save and review before printing.</Tr></p>
      </div>
      <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Builder searchParams={searchParams} /></Suspense>
    </div>
  </section>;
}
