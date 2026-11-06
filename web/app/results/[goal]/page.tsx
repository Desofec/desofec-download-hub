import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackCard, ToolCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export async function generateStaticParams() {
  const { goals } = await getCatalog();
  return goals.map((goal) => ({ goal: goal.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ goal: string }> }): Promise<Metadata> {
  const { goal } = await params;
  const { recommendations } = await getCatalog();
  const recommendation = recommendations[goal];
  return recommendation
    ? {
      title: recommendation.title, description: recommendation.summary,
      alternates: { canonical: `/results/${encodeURIComponent(goal)}` },
      openGraph: { title: recommendation.title, description: recommendation.summary, url: `/results/${encodeURIComponent(goal)}` },
      twitter: { card: 'summary_large_image', title: recommendation.title, description: recommendation.summary }
    }
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
            <span className="eyebrow"><Tr>Your recommendation</Tr></span>
            <h1><Tr>{recommendation.title}</Tr></h1>
          </div>
        </div>
        <div className="result-summary">
          <article className="result-card">
            <h2><Tr>Recommended next step</Tr></h2>
            <p><Tr>{recommendation.summary}</Tr></p>
            <ul className="mini-checklist">
              {recommendation.steps.map((step) => (
                <li key={step}><Tr>{step}</Tr></li>
              ))}
            </ul>
          </article>
        </div>

        <div className="section-head">
          <h2><Tr>Best tools to start with</Tr></h2>
        </div>
        <div className="results-grid">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} cta="none" />
          ))}
        </div>

        <div className="section-head">
          <h2><Tr>Starter packs for this path</Tr></h2>
        </div>
        <div className="results-grid">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>

        <div className="cta-row">
          {catalog.paths.filter((path) => path.goal === goal).map((path) => (
            <Link key={path.id} className="btn btn-primary" href={`/paths/${encodeURIComponent(path.id)}`}>
              <Tr>{path.title}</Tr>
            </Link>
          ))}
          <Link className="btn btn-primary" href="/onboarding">
            <Tr>Try another goal</Tr>
          </Link>
          <Link className="btn btn-secondary" href="/tools">
            <Tr>Explore all tools</Tr>
          </Link>
        </div>
      </div>
    </section>
  );
}
