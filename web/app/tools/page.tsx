import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsExplorer } from '@/components/tools-explorer';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Compare beginner-friendly AI, coding, design, automation and productivity tools, then explore related learning paths and tutorials.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'Beginner-Friendly AI and Digital Tools',
    description: 'Compare tools for AI, coding, design, automation and productivity, with related guides and learning paths.',
    url: '/tools'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beginner-Friendly AI and Digital Tools',
    description: 'Compare tools for AI, coding, design, automation and productivity, with related guides and learning paths.'
  }
};

export default async function ToolsPage() {
  const { tools } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow"><Tr>Tool library</Tr></span>
            <h1><Tr>Beginner-friendly tools</Tr></h1>
          </div>
        </div>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
          <ToolsExplorer tools={tools} />
        </Suspense>
      </div>
    </section>
  );
}
