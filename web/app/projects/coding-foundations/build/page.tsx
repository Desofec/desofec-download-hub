import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { TutorialLanguageLinks } from '@/components/tutorial-language-links';
import { TutorialSteps } from '@/components/tutorial-steps';
import { requireTutorial, tutorialAlternates } from '@/lib/localized-tutorials';
import { codingFoundationsSteps } from '@/lib/coding-foundations-tutorial';

const tutorial = requireTutorial('coding-foundations');
export const metadata = {
  ...publicPageMetadata('/projects/coding-foundations/build', {
    title: 'Learn Python: coding foundations tutorial',
    description: 'A step-by-step beginner tutorial: set up Python, learn the basics, use Git and build a guessing game.'
  }),
  alternates: tutorialAlternates(tutorial, 'en')
};

export default function CodingFoundationsTutorialPage() {
  return (
    <section className="section">
      <div className="container first-app-project">
        <TutorialHeader
          pathId="coding-foundations"
          title="Learn to code with Python"
          minutes={90}
          intro={
            <>Go from zero to your first real program. You will install the tools, learn the core ideas, save your work
            with Git and finish with a small game you can share.</>
          }
        />
        <TutorialLanguageLinks tutorial={tutorial} />
        <TutorialSteps
          steps={codingFoundationsSteps}
          storageKey="desofec:tutorial:coding-foundations"
          syncId="coding-foundations"
          title="Learn to code with Python"
        />
        <div className="cta-row">
          <Link className="btn btn-primary" href="/projects/first-app/build">
            Next: build a task tracker
          </Link>
          <Link className="btn btn-secondary" href="/paths/coding-foundations"><TutorialLabel k="tutorial.back" /></Link>
        </div>
      </div>
    </section>
  );
}
