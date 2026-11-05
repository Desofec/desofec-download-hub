import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialList } from '@/components/tutorial-list';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';
import { Tr } from '@/components/tr';

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
            <span className="eyebrow"><Tr>Tutorials</Tr></span>
            <h1><Tr>Learn by building, step by step</Tr></h1>
            <p><Tr>Every learning path has a hands-on tutorial with explanations, copy-ready examples and checks.</Tr></p>
            <Link className="btn btn-secondary" href="/plan">
              <Tr>Not sure where to start? Describe your idea</Tr>
            </Link>
          </div>
        </div>
        <h2 className="sr-only"><Tr>Tutorials</Tr></h2>
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
