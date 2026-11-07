import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialList } from '@/components/tutorial-list';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Step-by-step tutorials',
  description: 'Follow hands-on beginner tutorials for AI, coding, no-code, automation, machine learning and design, with examples and checks.',
  alternates: { canonical: '/tutorials' },
  openGraph: {
    title: 'Step-by-Step AI and Digital Skills Tutorials',
    description: 'Follow beginner tutorials with practical examples and checks for AI, coding, no-code, automation and design.',
    url: '/tutorials'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Step-by-Step AI and Digital Skills Tutorials',
    description: 'Follow beginner tutorials with practical examples and checks for AI, coding, no-code, automation and design.'
  }
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
              badge: path?.badge ?? tutorial.badge,
              level: path?.level ?? tutorial.level,
              pathTitle: path?.title
            };
          })}
        />
      </div>
    </section>
  );
}
