import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ToolsExplorer } from '@/components/tools-explorer';
import { getCatalog } from '@/lib/catalog';
import { distinctTools } from '@/lib/tool-identities';
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
        <Suspense fallback={
          <>
            <p><Tr>Search and comparison require JavaScript. You can browse the tools below while they load.</Tr></p>
            <h2 className="sr-only"><Tr>All tools</Tr></h2>
            <ul className="tool-grid tool-fallback">
              {distinctTools(tools).map((tool) => (
                <li key={tool.id}><Link href={`/tools/${encodeURIComponent(tool.id)}`}>{tool.name}</Link></li>
              ))}
            </ul>
          </>
        }>
          <ToolsExplorer tools={tools} />
        </Suspense>
      </div>
    </section>
  );
}
