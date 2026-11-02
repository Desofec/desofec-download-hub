import Link from 'next/link';
import { GoalCard, PackCard, PathCard, ToolCard } from '@/components/cards';
import { ContinueLearning } from '@/components/continue-learning';
import { NewsletterForm } from '@/components/newsletter-form';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';
import { Tr } from '@/components/tr';
import { phrase } from '@/lib/phrase-mark';

const steps = [
  ['01', phrase('Choose a goal'), phrase('Pick what you want to do next, like building a site, learning AI, or automating work.')],
  ['02', phrase('Get a learning path'), phrase('We recommend the best beginner-friendly route and the tools that match your level.')],
  ['03', phrase('Use starter resources'), phrase('Open prompt packs, templates, design kits, and simple project ideas to start building.')],
  ['04', phrase('Build with confidence'), phrase('Move from confusion to real steps with a clearer path and practical next actions.')]
];

const highlights = [
  [phrase('Find your direction'), phrase('Choose a goal and get a clear path instead of guessing which tool to use.')],
  [phrase('Learn with confidence'), phrase('Follow beginner-friendly steps that turn confusion into simple, practical actions.')],
  [phrase('Build with support'), phrase('Use starter packs, prompts, and workflow ideas to take action quickly.')]
];

export default async function HomePage() {
  const catalog = await getCatalog();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Tr>Guided AI discovery for beginners</Tr></span>
            <h1><Tr>Learn the right tools. Build with confidence. Launch with clarity.</Tr></h1>
            <p>
              <Tr>Desofec AI Studio helps you discover the tools, learning paths, and starter resources that match your goals — without the confusion of too many choices.</Tr>
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/onboarding">
                <Tr>Start my path</Tr>
              </Link>
              <Link className="btn btn-secondary" href="/tools">
                <Tr>Explore tools</Tr>
              </Link>
            </div>
            <ul className="mini-stats" aria-label="Project stats">
              <li>
                <strong>{catalog.goals.length}</strong>
                <span><Tr>goal paths</Tr></span>
              </li>
              <li>
                <strong>{catalog.tools.length}</strong>
                <span><Tr>starter tools</Tr></span>
              </li>
              <li>
                <strong><Tr>Beginner-first</Tr></strong>
                <span><Tr>clear guidance</Tr></span>
              </li>
            </ul>
          </div>
          <div className="feature-panel">
            <div className="panel-header">
              <span className="status-dot"></span>
              <span><Tr>Most useful paths</Tr></span>
            </div>
            <div className="feature-list">
              {highlights.map(([title, text]) => (
                <article className="feature-card" key={title}>
                  <h3><Tr>{title}</Tr></h3>
                  <p><Tr>{text}</Tr></p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContinueLearning
        paths={catalog.paths}
        packs={catalog.starterPacks}
        checklists={catalog.starterPackChecklists}
        tutorials={tutorials.map((tutorial) => ({
          id: tutorial.pathId,
          title: tutorial.title,
          href: tutorial.href,
          stepIds: tutorial.steps.map((step) => step.id),
          storageKey: tutorialStorageKey(tutorial.pathId)
        }))}
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow"><Tr>Choose your direction</Tr></span>
              <h2><Tr>What do you want to build?</Tr></h2>
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
              <span className="eyebrow"><Tr>How it works</Tr></span>
              <h2><Tr>Get a clear path without the chaos</Tr></h2>
            </div>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <div className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <h3><Tr>{title}</Tr></h3>
                <p><Tr>{text}</Tr></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow"><Tr>Learning paths</Tr></span>
              <h2><Tr>Beginner-first journeys</Tr></h2>
            </div>
            <Link className="text-link" href="/paths">
              <Tr>View all paths</Tr>
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
              <span className="eyebrow"><Tr>Tool library</Tr></span>
              <h2><Tr>Pick tools by purpose and skill level</Tr></h2>
            </div>
            <Link className="text-link" href="/tools">
              <Tr>Explore all tools</Tr>
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
              <span className="eyebrow"><Tr>Starter packs</Tr></span>
              <h2><Tr>Useful resources to start with</Tr></h2>
            </div>
            <Link className="text-link" href="/starter-packs">
              <Tr>Browse packs</Tr>
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
            <span className="eyebrow"><Tr>Stay in the loop</Tr></span>
            <h2><Tr>Get new tools and paths first</Tr></h2>
            <p><Tr>Join the list for new beginner-friendly tools, learning paths, and starter packs. Unsubscribe any time.</Tr></p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
