import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsExplorer } from '@/components/tools-explorer';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Explore beginner-friendly AI, coding, automation, and productivity tools.'
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
        <Suspense fallback={null}>
          <ToolsExplorer tools={tools} />
        </Suspense>
      </div>
    </section>
  );
}
