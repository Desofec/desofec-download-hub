import type { Metadata } from 'next';
import { IdeaPlanner } from '@/components/idea-planner';
import { getCatalog } from '@/lib/catalog';
import { getTutorialForPath } from '@/lib/tutorials';

export const metadata: Metadata = {
  title: 'Describe your idea',
  description: 'Type or speak your idea and get a simple plan with the right learning path and tutorial.'
};

export default async function PlanPage() {
  const { goals, paths } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Idea planner</span>
            <h1>Describe your idea</h1>
            <p>
              Say or type what you imagine. We match it to the right learning paths and tutorials. No writing skills
              needed, and your idea is not stored or sent to us.
            </p>
          </div>
        </div>
        <IdeaPlanner
          goals={goals.map(({ id, name, description }) => ({ id, name, description }))}
          paths={paths.map(({ id, title, goal, steps }) => ({
            id,
            title,
            goal,
            steps,
            tutorialHref: getTutorialForPath(id)?.href
          }))}
        />
      </div>
    </section>
  );
}
