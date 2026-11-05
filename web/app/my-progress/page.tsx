import type { Metadata } from 'next';
import { FavoriteTools } from '@/components/favorite-tools';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { Tr } from '@/components/tr';
import { NextLesson } from '@/components/next-lesson';
import Link from 'next/link';

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
        <section className="progress-section">
          <h2><Tr>Your first finished project</Tr></h2>
          <p><Tr>Build one small website in seven practical sessions, with saved progress and a final checklist.</Tr></p>
          <Link className="btn btn-primary" href="/challenges/first-website"><Tr>Open the 7-day website challenge</Tr></Link>
        </section>
        <NextLesson goals={goals} paths={paths} tools={tools} recommendations={recommendations} />
        <section className="progress-section">
          <h2><Tr>AI Business Launchpad</Tr></h2>
          <p><Tr>Choose from five service learning paths. Build practice evidence before offering real work; no path promises clients or income.</Tr></p>
          <Link className="btn btn-secondary" href="/business-launchpad"><Tr>Open the AI Business Launchpad</Tr></Link>
          <Link className="btn btn-secondary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
          <Link className="btn btn-secondary" href="/business-launchpad/first-project"><Tr>Complete your first practice project</Tr></Link>
        </section>
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
