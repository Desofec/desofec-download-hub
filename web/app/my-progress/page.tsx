import type { Metadata } from 'next';
import { FavoriteTools } from '@/components/favorite-tools';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { Tr } from '@/components/tr';
import { NextLesson } from '@/components/next-lesson';

export const metadata: Metadata = {
  title: 'My progress',
  description: 'Continue your learning paths and starter-pack checklists.'
};

export default async function MyProgressPage() {
  const { goals, paths, starterPacks, starterPackChecklists, tools, recommendations } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><Tr>Your learning</Tr></span>
          <h1><Tr>My progress</Tr></h1>
          <p><Tr>Pick up where you left off, or choose something new to learn.</Tr></p>
        </div>
        <NextLesson goals={goals} paths={paths} tools={tools} recommendations={recommendations} />
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
