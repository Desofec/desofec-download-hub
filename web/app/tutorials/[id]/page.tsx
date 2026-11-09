import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialSteps } from '@/components/tutorial-steps';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { TutorialLanguageLinks } from '@/components/tutorial-language-links';
import { Tr } from '@/components/tr';
import { tutorialAlternates, tutorialSocialLocales } from '@/lib/localized-tutorials';
import { tutorialSearchText } from '@/lib/tutorial-search-metadata';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';

const hosted = tutorials.filter((tutorial) => tutorial.href.startsWith('/tutorials/'));

export function generateStaticParams() {
  return hosted.map((tutorial) => ({ id: tutorial.pathId }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tutorial = hosted.find((entry) => entry.pathId === id);
  if (!tutorial) return { title: 'Tutorial' };
  const search = tutorialSearchText(tutorial.pathId, 'en', {
    title: tutorial.title,
    description: tutorial.intro
  });
  return {
    title: search.title, description: search.description,
    alternates: tutorialAlternates(tutorial, 'en'),
    openGraph: { title: tutorial.title, description: search.description, url: tutorial.href, ...tutorialSocialLocales(tutorial, 'en') },
    twitter: { card: 'summary_large_image', title: tutorial.title, description: search.description }
  };
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
        <TutorialLanguageLinks tutorial={tutorial} />
        <TutorialSteps
          steps={tutorial.steps}
          storageKey={tutorialStorageKey(tutorial.pathId)}
          syncId={tutorial.pathId}
          title={tutorial.title}
          feedbackEnabled={tutorial.feedbackEnabled}
        />
        <div className="cta-row">
          {tutorial.practiceHref && <Link className="btn btn-primary" href={tutorial.practiceHref}>
            <Tr>Open commerce practice lab</Tr>
          </Link>}
          {tutorial.toolId && (
            <Link className="btn btn-secondary" href={`/tools/${tutorial.toolId}`}>
              <Tr>View tool details</Tr>
            </Link>
          )}
          {tutorial.starterPackId && (
            <Link className="btn btn-secondary" href={`/starter-packs/${tutorial.starterPackId}`}>
              <Tr>Open the service kit</Tr>
            </Link>
          )}
          {id === 'freelance-client-discovery' && <>
            <Link className="btn btn-primary" href="/business-launchpad/client-discovery-lab"><Tr>Open client discovery and scoping</Tr></Link>
            <Link className="btn btn-secondary" href="/starter-packs/freelance-client-discovery-kit"><Tr>Open the service kit</Tr></Link>
          </>}
          {id === 'ai-spreadsheets' && <Link className="btn btn-primary" href="/business-launchpad/spreadsheet-lab"><Tr>Open the spreadsheet practice lab</Tr></Link>}
          {id === 'ai-automation-services' && <Link className="btn btn-primary" href="/business-launchpad/automation-lab">
            <Tr>Open the no-send automation practice lab</Tr>
          </Link>}
          {id === 'ai-video-creation' && (
            <Link className="btn btn-primary" href="/paths/ai-video-business">
              <Tr>AI Video Creation for Business</Tr>
            </Link>
          )}
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
          <Link className="btn btn-secondary" href={tutorial.backHref ?? `/paths/${tutorial.pathId}`}>
            {tutorial.backHref ? <Tr>Browse all tutorials</Tr> : <TutorialLabel k="tutorial.back" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
