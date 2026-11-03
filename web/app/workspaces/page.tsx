import type { Metadata } from 'next';
import { Tr } from '@/components/tr';
import { WorkspacesPanel } from '@/components/workspaces-panel';

export const metadata: Metadata = {
  title: 'Learning workspaces',
  description: 'Create a private workspace and share learning paths, packs, tutorials and tools.',
  robots: { index: false }
};

export default function WorkspacesPage() {
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>Learn together</Tr></span>
          <h1><Tr>Learning workspaces</Tr></h1>
          <p><Tr>Invite friends, classmates or a team and share what to learn next.</Tr></p>
        </div>
        <WorkspacesPanel />
      </div>
    </section>
  );
}
