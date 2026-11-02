import type { Metadata } from 'next';
import { FavoriteTools } from '@/components/favorite-tools';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';
import { ProgressDashboard } from '@/components/progress-dashboard';

export const metadata: Metadata = {
  title: 'My progress',
  description: 'Continue your learning paths and starter-pack checklists.'
};

export default async function MyProgressPage() {
  const { paths, starterPacks, starterPackChecklists, tools } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Your learning</span>
          <h1>My progress</h1>
          <p>Pick up where you left off, or choose something new to learn.</p>
        </div>
        <ProgressDashboard
          paths={paths}
          packs={starterPacks}
          checklists={starterPackChecklists}
          tutorials={tutorials.map((tutorial) => ({
            id: tutorial.pathId,
            title: tutorial.title,
            href: tutorial.href,
            stepIds: tutorial.steps.map((step) => step.id),
            storageKey: tutorialStorageKey(tutorial.pathId)
          }))}
        />
        <FavoriteTools tools={tools} />
      </div>
    </section>
  );
}
