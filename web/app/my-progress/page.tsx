import type { Metadata } from 'next';
import { getCatalog } from '@/lib/catalog';
import { ProgressDashboard } from '@/components/progress-dashboard';

export const metadata: Metadata = {
  title: 'My progress',
  description: 'Continue your learning paths and starter-pack checklists.'
};

export default async function MyProgressPage() {
  const { paths, starterPacks, starterPackChecklists } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Your learning</span>
          <h1>My progress</h1>
          <p>Pick up where you left off, or choose something new to learn.</p>
        </div>
        <ProgressDashboard paths={paths} packs={starterPacks} checklists={starterPackChecklists} />
      </div>
    </section>
  );
}
