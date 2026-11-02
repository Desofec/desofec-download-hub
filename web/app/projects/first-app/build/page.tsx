import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialSteps } from '@/components/tutorial-steps';
import { taskTrackerSteps } from '@/lib/task-tracker-tutorial';

export const metadata: Metadata = {
  title: 'Code your own task tracker',
  description: 'A step-by-step beginner tutorial: build a task tracker with HTML, CSS and JavaScript.'
};

export default function TaskTrackerTutorialPage() {
  return (
    <section className="section">
      <div className="container first-app-project">
        <div className="section-head">
          <span className="eyebrow">Step-by-step tutorial · about 60 minutes</span>
          <h1>Code your own task tracker</h1>
          <p>
            Build the app from the hands-on lab yourself, one small step at a time. You need a free{' '}
            <a href="https://replit.com" target="_blank" rel="noopener noreferrer">
              Replit
            </a>{' '}
            account and a web browser. No installs and no experience required.
          </p>
        </div>
        <TutorialSteps steps={taskTrackerSteps} storageKey="desofec:tutorial:task-tracker" syncId="first-app" />
        <div className="cta-row">
          <Link className="btn btn-primary" href="/projects/first-app">
            Back to the app lab
          </Link>
          <Link className="btn btn-secondary" href="/paths/first-app">
            Back to the path
          </Link>
        </div>
      </div>
    </section>
  );
}
