import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialList } from '@/components/tutorial-list';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';

export const metadata: Metadata = {
  title: 'Step-by-step tutorials',
  description: 'Hands-on beginner tutorials for AI, coding, no-code, automation, ML and design, one for every learning path.'
};

export default async function TutorialsPage() {
  const { paths } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Tutorials</span>
            <h1>Learn by building, step by step</h1>
            <p>Every learning path has a hands-on tutorial with explanations, copy-ready examples and checks.</p>
            <Link className="btn btn-secondary" href="/plan">
              Not sure where to start? Describe your idea
            </Link>
          </div>
        </div>
        <TutorialList
          items={tutorials.map((tutorial) => {
            const path = paths.find((entry) => entry.id === tutorial.pathId);
            return {
              pathId: tutorial.pathId,
              href: tutorial.href,
              title: tutorial.title,
              intro: tutorial.intro,
              time: tutorial.time,
              stepCount: tutorial.steps.length,
              badge: path?.badge,
              level: path?.level,
              pathTitle: path?.title
            };
          })}
        />
      </div>
    </section>
  );
}
