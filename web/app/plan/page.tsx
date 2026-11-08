import { publicPageMetadata } from '@/lib/public-page-metadata';
import { IdeaPlanner } from '@/components/idea-planner';
import { getCatalog } from '@/lib/catalog';
import { getTutorialForPath } from '@/lib/tutorials';
import { Tr } from '@/components/tr';

export const metadata = publicPageMetadata('/plan', {
  title: 'Describe your idea',
  description: 'Type or speak your idea and get a simple plan with the right learning path and tutorial.'
});

export default async function PlanPage() {
  const { goals, paths } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow"><Tr>Idea planner</Tr></span>
            <h1><Tr>Describe your idea</Tr></h1>
            <p>
              <Tr>Say or type what you imagine. We match it to the right learning paths and tutorials. No writing skills needed, and your idea is not stored or sent to us.</Tr>
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
