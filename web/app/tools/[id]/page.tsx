import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { FavoriteToolButton } from '@/components/favorite-tool-button';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';
import { ToolFreshness } from '@/components/tool-freshness';
import { TutorialLink } from '@/components/tutorial-link';
import { tutorials } from '@/lib/tutorials';

export async function generateStaticParams() {
  const { tools } = await getCatalog();
  return tools.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = (await getCatalog()).tools.find((entry) => entry.id === id);
  if (!tool) return { title: 'Tool' };
  const canonical = `/tools/${encodeURIComponent(id)}`;
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical },
    openGraph: { title: `${tool.name}: Tool Guide`, description: tool.description, url: canonical },
    twitter: { card: 'summary_large_image', title: `${tool.name}: Tool Guide`, description: tool.description }
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const tool = catalog.tools.find((entry) => entry.id === id);
  if (!tool) notFound();
  const guide = tutorials.find((entry) => entry.toolId === tool.id);

  const goalIds = Object.entries(catalog.recommendations)
    .filter(([, recommendation]) => recommendation.tools.includes(tool.id))
    .map(([goalId]) => goalId);
  const goals = catalog.goals.filter((goal) => goalIds.includes(goal.id));
  const paths = catalog.paths.filter((path) => goalIds.includes(path.goal));
  const packIds = new Set(goalIds.flatMap((goalId) => catalog.recommendations[goalId]?.starters ?? []));
  const packs = catalog.starterPacks.filter((pack) => packIds.has(pack.id));
  const similar = catalog.tools
    .filter((entry) => entry.id !== tool.id && entry.category === tool.category)
    .slice(0, 3);

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><Tr>{tool.category}</Tr></span>
            <h1>{tool.name}</h1>
            <p><Tr>{tool.description}</Tr></p>
          </div>
          <div className="tool-meta path-meta">
            <span className="tool-tag"><Tr>{tool.badge}</Tr></span>
            <span className="skill-chip"><Tr>{tool.skill}</Tr></span>
          </div>
          <ToolFreshness tool={tool} details />
          <div className="cta-row">
            <FavoriteToolButton toolId={tool.id} />
          </div>
          <div className="cta-row">
            {guide && <TutorialLink className="btn btn-secondary" href={guide.href}>
              <Tr>Learn step by step: tutorial</Tr>
            </TutorialLink>}
            <a
              className="btn btn-primary"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tr values={{ name: tool.name }}>{'Open {name}'}</Tr>
              <span className="sr-only">{' '}<Tr>(opens in a new tab)</Tr></span>
            </a>
            <Link className="btn btn-secondary" href="/tools">
              <Tr>Back to all tools</Tr>
            </Link>
          </div>
        </div>
      </section>

      {goals.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Good for these goals</Tr></h2>
              <p>
                <Tr values={{ name: tool.name }}>{'Pick a goal to see how {name} fits into a full recommendation.'}</Tr>
              </p>
            </div>
            <div className="result-summary">
              {goals.map((goal) => (
                <article className="result-card" key={goal.id}>
                  <h3><Tr>{goal.name}</Tr></h3>
                  <p><Tr>{goal.description}</Tr></p>
                  <Link className="text-link" href={`/results/${encodeURIComponent(goal.id)}`}>
                    <Tr>See recommendation</Tr>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {paths.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Learning paths that use it</Tr></h2>
            </div>
            <div className="result-summary">
              {paths.map((path) => (
                <article className="result-card" key={path.id}>
                  <h3><Tr>{path.title}</Tr></h3>
                  <p><Tr>{path.description}</Tr></p>
                  <Link className="text-link" href={`/paths/${encodeURIComponent(path.id)}`}>
                    <Tr>View path</Tr>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {packs.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Starter packs to try</Tr></h2>
            </div>
            <div className="results-grid">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2><Tr>Similar tools</Tr></h2>
            </div>
            <div className="results-grid">
              {similar.map((entry) => (
                <ToolCard key={entry.id} tool={entry} cta="none" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
