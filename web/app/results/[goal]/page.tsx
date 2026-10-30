import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';

export async function generateStaticParams() {
  const { goals } = await getCatalog();
  return goals.map((goal) => ({ goal: goal.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ goal: string }> }): Promise<Metadata> {
  const { goal } = await params;
  const { recommendations } = await getCatalog();
  const recommendation = recommendations[goal];
  return recommendation
    ? { title: recommendation.title, description: recommendation.summary }
    : { title: 'Your recommendation' };
}

export default async function ResultsPage({ params }: { params: Promise<{ goal: string }> }) {
  const { goal } = await params;
  const catalog = await getCatalog();
  const recommendation = catalog.recommendations[goal];
  if (!recommendation) notFound();

  const tools = recommendation.tools.flatMap((id) => catalog.tools.find((tool) => tool.id === id) ?? []);
  const packs = recommendation.starters.flatMap((id) => catalog.starterPacks.find((pack) => pack.id === id) ?? []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Your recommendation</span>
            <h1>{recommendation.title}</h1>
          </div>
        </div>
        <div className="result-summary">
          <article className="result-card">
            <h3>Recommended next step</h3>
            <p>{recommendation.summary}</p>
            <ul className="mini-checklist">
              {recommendation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="section-head">
          <h2>Best tools to start with</h2>
        </div>
        <div className="results-grid">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} cta="none" />
          ))}
        </div>

        <div className="section-head">
          <h2>Starter packs for this path</h2>
        </div>
        <div className="results-grid">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>

        <div className="cta-row">
          <Link className="btn btn-primary" href="/onboarding">
            Try another goal
          </Link>
          <Link className="btn btn-secondary" href="/tools">
            Explore all tools
          </Link>
        </div>
      </div>
    </section>
  );
}
