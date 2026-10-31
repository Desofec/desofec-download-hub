import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsExplorer } from '@/components/tools-explorer';
import { getCatalog } from '@/lib/catalog';

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
            <span className="eyebrow">Tool library</span>
            <h1>Beginner-friendly tools</h1>
          </div>
        </div>
        <Suspense fallback={null}>
          <ToolsExplorer tools={tools} />
        </Suspense>
      </div>
    </section>
  );
}
