import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';

export async function generateStaticParams() {
  const { tools } = await getCatalog();
  return tools.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = (await getCatalog()).tools.find((entry) => entry.id === id);
  return tool ? { title: tool.name, description: tool.description } : { title: 'Tool' };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const tool = catalog.tools.find((entry) => entry.id === id);
  if (!tool) notFound();

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
            <span className="eyebrow">{tool.category}</span>
            <h1>{tool.name}</h1>
            <p>{tool.description}</p>
          </div>
          <div className="tool-meta path-meta">
            <span className="tool-tag">{tool.badge}</span>
            <span className="skill-chip">{tool.skill}</span>
          </div>
          <div className="cta-row">
            <a
              className="btn btn-primary"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${tool.name} (opens in a new tab)`}
            >
              Open {tool.name}
            </a>
            <Link className="btn btn-secondary" href="/tools">
              Back to all tools
            </Link>
          </div>
        </div>
      </section>

      {goals.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <div className="section-head">
              <h2>Good for these goals</h2>
              <p>Pick a goal to see how {tool.name} fits into a full recommendation.</p>
            </div>
            <div className="result-summary">
              {goals.map((goal) => (
                <article className="result-card" key={goal.id}>
                  <h3>{goal.name}</h3>
                  <p>{goal.description}</p>
                  <Link className="text-link" href={`/results/${encodeURIComponent(goal.id)}`}>
                    See recommendation
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
              <h2>Learning paths that use it</h2>
            </div>
            <div className="result-summary">
              {paths.map((path) => (
                <article className="result-card" key={path.id}>
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                  <Link className="text-link" href={`/paths/${encodeURIComponent(path.id)}`}>
                    View path
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
              <h2>Starter packs to try</h2>
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
              <h2>Similar tools</h2>
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
