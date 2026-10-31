import Link from 'next/link';
import { GoalCard, PackCard, PathCard, ToolCard } from '@/components/cards';
import { NewsletterForm } from '@/components/newsletter-form';
import { getCatalog } from '@/lib/catalog';

const steps = [
  ['01', 'Choose a goal', 'Pick what you want to do next, like building a site, learning AI, or automating work.'],
  ['02', 'Get a learning path', 'We recommend the best beginner-friendly route and the tools that match your level.'],
  ['03', 'Use starter resources', 'Open prompt packs, templates, design kits, and simple project ideas to start building.'],
  ['04', 'Build with confidence', 'Move from confusion to real steps with a clearer path and practical next actions.']
];

const highlights = [
  ['Find your direction', 'Choose a goal and get a clear path instead of guessing which tool to use.'],
  ['Learn with confidence', 'Follow beginner-friendly steps that turn confusion into simple, practical actions.'],
  ['Build with support', 'Use starter packs, prompts, and workflow ideas to take action quickly.']
];

export default async function HomePage() {
  const catalog = await getCatalog();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Guided AI discovery for beginners</span>
            <h1>Learn the right tools. Build with confidence. Launch with clarity.</h1>
            <p>
              Desofec AI Studio helps you discover the tools, learning paths, and starter resources that match your
              goals — without the confusion of too many choices.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/onboarding">
                Start my path
              </Link>
              <Link className="btn btn-secondary" href="/tools">
                Explore tools
              </Link>
            </div>
            <ul className="mini-stats" aria-label="Project stats">
              <li>
                <strong>{catalog.goals.length}</strong>
                <span>goal paths</span>
              </li>
              <li>
                <strong>{catalog.tools.length}</strong>
                <span>starter tools</span>
              </li>
              <li>
                <strong>Beginner-first</strong>
                <span>clear guidance</span>
              </li>
            </ul>
          </div>
          <div className="feature-panel">
            <div className="panel-header">
              <span className="status-dot"></span>
              <span>Most useful paths</span>
            </div>
            <div className="feature-list">
              {highlights.map(([title, text]) => (
                <article className="feature-card" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Choose your direction</span>
              <h2>What do you want to build?</h2>
            </div>
          </div>
          <div className="goal-grid">
            {catalog.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Get a clear path without the chaos</h2>
            </div>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <div className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow">Learning paths</span>
              <h2>Beginner-first journeys</h2>
            </div>
            <Link className="text-link" href="/paths">
              View all paths
            </Link>
          </div>
          <div className="path-grid">
            {catalog.paths.slice(0, 3).map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow">Tool library</span>
              <h2>Pick tools by purpose and skill level</h2>
            </div>
            <Link className="text-link" href="/tools">
              Explore all tools
            </Link>
          </div>
          <div className="tool-grid">
            {catalog.tools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} cta="none" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow">Starter packs</span>
              <h2>Useful resources to start with</h2>
            </div>
            <Link className="text-link" href="/starter-packs">
              Browse packs
            </Link>
          </div>
          <div className="starter-grid">
            {catalog.starterPacks.slice(0, 4).map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-row">
          <div>
            <span className="eyebrow">Stay in the loop</span>
            <h2>Get new tools and paths first</h2>
            <p>Join the list for new beginner-friendly tools, learning paths, and starter packs.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
