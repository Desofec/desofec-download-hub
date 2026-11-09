import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { TutorialLanguageLinks } from '@/components/tutorial-language-links';
import { TutorialSteps } from '@/components/tutorial-steps';
import { requireTutorial, tutorialAlternates, tutorialSocialLocales } from '@/lib/localized-tutorials';
import { taskTrackerSteps } from '@/lib/task-tracker-tutorial';

const tutorial = requireTutorial('first-app');
export const metadata = {
  ...publicPageMetadata('/projects/first-app/build', {
    title: 'Code your own task tracker',
    description: 'A step-by-step beginner tutorial: build a task tracker with HTML, CSS and JavaScript.',
    socialLocales: tutorialSocialLocales(tutorial, 'en')
  }),
  alternates: tutorialAlternates(tutorial, 'en')
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
        <TutorialLanguageLinks tutorial={tutorial} />
        <TutorialSteps
          steps={taskTrackerSteps}
          storageKey="desofec:tutorial:task-tracker"
          syncId="first-app"
          title="Code your own task tracker"
        />
        <div className="cta-row">
          <Link className="btn btn-primary" href="/projects/first-app"><TutorialLabel k="tutorial.backLab" /></Link>
          <Link className="btn btn-secondary" href="/paths/first-app"><TutorialLabel k="tutorial.back" /></Link>
        </div>
      </div>
    </section>
  );
}
