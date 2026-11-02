import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialLabel } from '@/components/tutorial-back-label';
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
        <TutorialHeader
          pathId="first-app"
          title="Code your own task tracker"
          minutes={60}
          intro={
            <>Build the app from the hands-on lab yourself, one small step at a time. You need a free{' '}
            <a href="https://replit.com" target="_blank" rel="noopener noreferrer">
              Replit
            </a>{' '}
            account and a web browser. No installs and no experience required.</>
          }
        />
        <TutorialSteps steps={taskTrackerSteps} storageKey="desofec:tutorial:task-tracker" syncId="first-app" />
        <div className="cta-row">
          <Link className="btn btn-primary" href="/projects/first-app"><TutorialLabel k="tutorial.backLab" /></Link>
          <Link className="btn btn-secondary" href="/paths/first-app"><TutorialLabel k="tutorial.back" /></Link>
        </div>
      </div>
    </section>
  );
}
