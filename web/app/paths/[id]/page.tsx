import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { PathSteps } from '@/components/path-steps';
import { TutorialLink } from '@/components/tutorial-link';
import { getCatalog } from '@/lib/catalog';
import { getRelatedPathTutorials, getTutorialForPath } from '@/lib/tutorials';
import { toolsForIds } from '@/lib/tool-identities';
import { Tr } from '@/components/tr';

export async function generateStaticParams() {
  const { paths } = await getCatalog();
  return paths.map((path) => ({ id: path.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const path = (await getCatalog()).paths.find((entry) => entry.id === id);
  return path ? {
    title: path.title, description: path.description,
    alternates: { canonical: `/paths/${encodeURIComponent(id)}` },
    openGraph: { title: path.title, description: path.description, url: `/paths/${encodeURIComponent(id)}` },
    twitter: { card: 'summary_large_image', title: path.title, description: path.description }
  } : { title: 'Learning path' };
}

export default async function PathDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const path = catalog.paths.find((entry) => entry.id === id);
  if (!path) notFound();

  const tutorial = getTutorialForPath(path.id);
  const relatedTutorials = tutorial ? [] : getRelatedPathTutorials(path, catalog.paths);
  const recommendation = catalog.recommendations[path.goal];
  const tools = toolsForIds(catalog.tools, recommendation?.tools ?? []);
  const packs = (recommendation?.starters ?? []).flatMap(
    (packId) => catalog.starterPacks.find((pack) => pack.id === packId) ?? []
  );

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><Tr>Learning path</Tr></span>
            <h1><Tr>{path.title}</Tr></h1>
            <p><Tr>{path.description}</Tr></p>
          </div>
          <div className="tool-meta path-meta">
            <span className="path-badge"><Tr>{path.badge}</Tr></span>
            <span className="skill-chip"><Tr>{path.level}</Tr></span>
          </div>
          <div className="section-head">
            <h2><Tr>Your learning steps</Tr></h2>
          </div>
          <PathSteps pathId={path.id} steps={path.steps} />
          {path.id === 'freelance-client-discovery' && <p><Link href="/business-launchpad/client-discovery-lab"><Tr>Open client discovery and scoping</Tr></Link></p>}
          {path.id === 'ai-spreadsheets' && <p><Link href="/business-launchpad/spreadsheet-lab"><Tr>Open the spreadsheet practice lab</Tr></Link></p>}
          {path.id === 'ai-automation-services' && <p><Link href="/business-launchpad/automation-lab">
            <Tr>Open the no-send automation practice lab</Tr>
          </Link></p>}
          {!tutorial && (
            <div className="section-head">
              <p><Tr>This path does not yet have its own tutorial.</Tr></p>
              {relatedTutorials.length > 0 && (
                <>
                  <h2><Tr>Related tutorials</Tr></h2>
                  <div className="cta-row">
                    {relatedTutorials.map((related) => (
                      <TutorialLink key={related.path.id} className="btn btn-secondary" href={related.tutorial.href}>
                        <Tr>{related.path.title}</Tr>
                      </TutorialLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <div className="cta-row">
            {tutorial?.practiceHref && <Link className="btn btn-primary" href={tutorial.practiceHref}>
              <Tr>Open commerce practice lab</Tr>
            </Link>}
            {tutorial?.serviceKitId && (
              <Link className="btn btn-secondary" href={`/business-launchpad/projects?path=${encodeURIComponent(path.id)}`}>
                <Tr>Start a practice project</Tr>
              </Link>
            )}
            {tutorial && (
              <TutorialLink className="btn btn-primary" href={tutorial.href}>
                <Tr>Learn step by step: tutorial</Tr>
              </TutorialLink>
            )}
            {path.id === 'first-app' && (
              <Link className="btn btn-secondary" href="/projects/first-app">
                <Tr>Open hands-on app lab</Tr>
              </Link>
            )}
            <Link className="btn btn-primary" href={`/results/${encodeURIComponent(path.goal)}`}>
              <Tr>See recommendation</Tr>
            </Link>
            <Link className="btn btn-secondary" href="/paths">
              <Tr>Browse all paths</Tr>
            </Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Recommended tools</Tr></h2>
            </div>
            <div className="results-grid">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} cta="none" />
              ))}
            </div>
          </div>
        </section>
      )}

      {packs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Starter packs for this path</Tr></h2>
            </div>
            <div className="results-grid">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
