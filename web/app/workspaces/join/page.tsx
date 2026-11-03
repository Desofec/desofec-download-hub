import type { Metadata } from 'next';
import { Tr } from '@/components/tr';
import { WorkspaceJoin } from '@/components/workspace-join';

export const metadata: Metadata = {
  title: 'Join a workspace',
  robots: { index: false }
};

export default function JoinWorkspacePage() {
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <h1><Tr>Join a workspace</Tr></h1>
        </div>
        <WorkspaceJoin />
      </div>
    </section>
  );
}
