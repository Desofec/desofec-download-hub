import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TutorialSteps } from '@/components/tutorial-steps';
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
        <div className="section-head">
          <span className="eyebrow">Step-by-step tutorial · about {tutorial.time}</span>
          <h1>{tutorial.title}</h1>
          <p>{tutorial.intro}</p>
        </div>
        <TutorialSteps steps={tutorial.steps} storageKey={tutorialStorageKey(tutorial.pathId)} syncId={tutorial.pathId} />
        <div className="cta-row">
          <Link className="btn btn-secondary" href={`/paths/${tutorial.pathId}`}>
            Back to the path
          </Link>
        </div>
      </div>
    </section>
  );
}
