import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';

export async function generateStaticParams() {
  const { paths } = await getCatalog();
  return paths.map((path) => ({ id: path.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const path = (await getCatalog()).paths.find((entry) => entry.id === id);
  return path ? { title: path.title, description: path.description } : { title: 'Learning path' };
}

export default async function PathDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const path = catalog.paths.find((entry) => entry.id === id);
  if (!path) notFound();

  const recommendation = catalog.recommendations[path.goal];
  const tools = (recommendation?.tools ?? []).flatMap((toolId) => catalog.tools.find((tool) => tool.id === toolId) ?? []);
  const packs = (recommendation?.starters ?? []).flatMap(
    (packId) => catalog.starterPacks.find((pack) => pack.id === packId) ?? []
  );

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Learning path</span>
            <h1>{path.title}</h1>
            <p>{path.description}</p>
          </div>
          <div className="tool-meta path-meta">
            <span className="path-badge">{path.badge}</span>
            <span className="skill-chip">{path.level}</span>
          </div>
          <div className="section-head">
            <h2>Your learning steps</h2>
          </div>
          <div className="result-summary">
            {path.steps.map((step, index) => (
              <article className="result-card" key={step}>
                <h3>Step {index + 1}</h3>
                <p>{step}</p>
              </article>
            ))}
          </div>
          <div className="cta-row">
            <Link className="btn btn-primary" href={`/results/${encodeURIComponent(path.goal)}`}>
              Start this path
            </Link>
            <Link className="btn btn-secondary" href="/paths">
              Browse all paths
            </Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <div className="section-head">
              <h2>Recommended tools</h2>
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
              <h2>Starter packs for this path</h2>
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
