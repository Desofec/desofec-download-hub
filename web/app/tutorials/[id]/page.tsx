import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialSteps } from '@/components/tutorial-steps';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { Tr } from '@/components/tr';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';

const hosted = tutorials.filter((tutorial) => tutorial.href.startsWith('/tutorials/'));

export function generateStaticParams() {
  return hosted.map((tutorial) => ({ id: tutorial.pathId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tutorial = hosted.find((entry) => entry.pathId === id);
  return tutorial ? { title: tutorial.title, description: tutorial.intro } : { title: 'Tutorial' };
}

export default async function TutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutorial = hosted.find((entry) => entry.pathId === id);
  if (!tutorial) notFound();

  return (
    <section className="section">
      <div className="container first-app-project">
        <TutorialHeader
          pathId={tutorial.pathId}
          title={tutorial.title}
          intro={tutorial.intro}
          minutes={Number.parseInt(tutorial.time, 10)}
        />
        <TutorialSteps
          steps={tutorial.steps}
          storageKey={tutorialStorageKey(tutorial.pathId)}
          syncId={tutorial.pathId}
          title={tutorial.title}
        />
        <div className="cta-row">
          {tutorial.serviceKitId && (
            <>
              <Link className="btn btn-secondary" href={`/business-launchpad/projects?path=${encodeURIComponent(tutorial.pathId)}`}>
                <Tr>Open the Pilot Project Workspace</Tr>
              </Link>
              <Link className="btn btn-secondary" href={`/starter-packs/${tutorial.serviceKitId}`}>
                <Tr>Open the service kit</Tr>
              </Link>
              <Link className="btn btn-primary" href="/business-launchpad/proposal-builder">
                <Tr>Build a pilot proposal</Tr>
              </Link>
              <Link className="btn btn-secondary" href="/business-launchpad/results-tracker">
                <Tr>Track pilot tests and results</Tr>
              </Link>
              <Link className="btn btn-secondary" href="/business-launchpad">
                <Tr>AI Business Launchpad</Tr>
              </Link>
            </>
          )}
          <Link className="btn btn-secondary" href={`/paths/${tutorial.pathId}`}>
            <TutorialLabel k="tutorial.back" />
          </Link>
        </div>
      </div>
    </section>
  );
}
