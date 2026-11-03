import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { TutorialSteps } from '@/components/tutorial-steps';
import { codingFoundationsSteps } from '@/lib/coding-foundations-tutorial';

export const metadata: Metadata = {
  title: 'Learn Python: coding foundations tutorial',
  description: 'A step-by-step beginner tutorial: set up Python, learn the basics, use Git and build a guessing game.'
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
