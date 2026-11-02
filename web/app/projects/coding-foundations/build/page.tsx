import type { Metadata } from 'next';
import Link from 'next/link';
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
        <div className="section-head">
          <span className="eyebrow">Step-by-step tutorial · about 90 minutes</span>
          <h1>Learn to code with Python</h1>
          <p>
            Go from zero to your first real program. You will install the tools, learn the core ideas, save your work
            with Git and finish with a small game you can share.
          </p>
        </div>
        <TutorialSteps steps={codingFoundationsSteps} storageKey="desofec:tutorial:coding-foundations" syncId="coding-foundations" />
        <div className="cta-row">
          <Link className="btn btn-primary" href="/projects/first-app/build">
            Next: build a task tracker
          </Link>
          <Link className="btn btn-secondary" href="/paths/coding-foundations">
            Back to the path
          </Link>
        </div>
      </div>
    </section>
  );
}
