import { Suspense } from 'react';
import type { Metadata } from 'next';
import { WorkspaceDetail } from '@/components/workspace-detail';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';
import type { WorkspaceItem } from '@/lib/workspaces';

export const metadata: Metadata = {
  title: 'Workspace',
  robots: { index: false }
};

export default async function WorkspaceViewPage() {
  const { paths, starterPacks, tools } = await getCatalog();
  const items: WorkspaceItem[] = [
    ...paths.map((item) => ({ type: 'path' as const, id: item.id, title: item.title, href: `/paths/${item.id}` })),
    ...starterPacks.map((item) => ({ type: 'pack' as const, id: item.id, title: item.title, href: `/starter-packs/${item.id}` })),
    ...tutorials.map((item) => ({ type: 'tutorial' as const, id: item.pathId, title: item.title, href: item.href })),
    ...tools.map((item) => ({ type: 'tool' as const, id: item.id, title: item.name, href: `/tools/${item.id}` }))
  ];

  return (
    <section className="section">
      <div className="container narrow-container">
        <Suspense fallback={<p role="status">Loading…</p>}>
          <WorkspaceDetail items={items} />
        </Suspense>
      </div>
    </section>
  );
}
