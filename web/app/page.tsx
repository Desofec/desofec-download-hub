import type { Metadata } from 'next';
import Link from 'next/link';
import { GoalCard, PackCard, PathCard, ToolCard } from '@/components/cards';
import { ContinueLearning } from '@/components/continue-learning';
import { HeroArt } from '@/components/hero-art';
import { NewsletterForm } from '@/components/newsletter-form';
import { TutorialLink } from '@/components/tutorial-link';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';
import { Tr } from '@/components/tr';
import { phrase } from '@/lib/phrase-mark';

const title = 'Desofec AI Studio | Learn AI and digital skills by building';
const description = 'Explore beginner-friendly learning paths, step-by-step tutorials, AI and digital tools, and practical starter packs for building real skills.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_US', url: '/', siteName: 'Desofec AI Studio', title, description },
  twitter: { card: 'summary_large_image', title, description }
};

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

const featuredLessons = [
  { id: 'ai-content-services', title: phrase('Create a practice content package'), outcome: phrase('Draft posts and FAQ answers from fictional facts, check claims, and prepare an honest work sample.') },
  { id: 'ai-automation-services', title: phrase('Practise small-business automation'), outcome: phrase('Explore enquiry tracking, reminders or reports with fictional data and a no-send practice lab.') },
  { id: 'ai-spreadsheets', title: phrase('Clean spreadsheets and check reports'), outcome: phrase('Practise data cleaning, PDF transcription checks and formulas with fictional orders.') },
  { id: 'ai-video-business', title: phrase('Plan short business videos'), outcome: phrase('Work through scripts, storyboards, captions and permissions before editing a fictional video project.') }
];

const faqs = [
  ['Is Desofec AI Studio free?', 'Yes. Browsing tools, paths, tutorials and starter packs is free. Signing in only adds progress sync across your devices.'],
  ['Do I need coding experience?', 'No. Every path and tutorial is written for complete beginners, with plain-language steps you can follow at your own pace.'],
  ['Which languages are supported?', 'English, French, German and Spanish. Use the language switcher in the header. Some lessons and downloads remain in English.'],
  ['Can I use it on my phone?', 'Yes. It works in any browser and can be installed like an app from your browser menu.']
].map(([q, a]) => [phrase(q), phrase(a)]);

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

export default async function HomePage() {
  const catalog = await getCatalog();

  return (
    <>
      <section className="hero hero-aurora">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Tr>Practical learning for beginners</Tr></span>
            <h1><Tr>Learn a service. Finish a practice project. Build an honest portfolio.</Tr></h1>
            <p>
              <Tr>Follow a clear route from beginner lessons to a fictional work sample, recorded evidence and a private case study. No client or income promises.</Tr>
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/start-here">
                <Tr>Start here</Tr>
              </Link>
              <Link className="btn btn-secondary" href="/tutorials">
                <Tr>Browse all tutorials</Tr>
              </Link>
              <Link className="text-link" href="/my-progress">
                <Tr>View all progress</Tr>
              </Link>
            </div>
            <span className="sr-only" id="home-resources-label"><Tr>Learning resources</Tr></span>
            <ul className="mini-stats" aria-labelledby="home-resources-label">
              <li>
                <strong>{catalog.paths.length}</strong>
                <span><Tr>learning paths</Tr></span>
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
            <HeroArt />
            <div className="panel-header">
              <span className="status-dot"></span>
              <span><Tr>Most useful paths</Tr></span>
            </div>
            <div className="feature-list">
              {highlights.map(([title, text]) => (
                <article className="feature-card" key={title}>
                  <h2><Tr>{title}</Tr></h2>
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

      <section className="section muted-section" aria-labelledby="featured-lessons">
        <div className="container">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow"><Tr>Learn by practising</Tr></span>
              <h2 id="featured-lessons"><Tr>Choose one useful skill to practise</Tr></h2>
              <p><Tr>Start with a guided lesson, try the examples, and check what you made. These are learning routes, not promises of clients or income.</Tr></p>
            </div>
            <Link className="text-link" href="/tutorials"><Tr>Browse all tutorials</Tr></Link>
          </div>
          <div className="results-grid">
            {featuredLessons.map((lesson) => {
              const tutorial = tutorials.find((entry) => entry.pathId === lesson.id);
              if (!tutorial) throw new Error(`Missing featured homepage tutorial: ${lesson.id}`);
              return <article className="result-card" key={lesson.id}>
                <h3><TutorialLink href={tutorial.href}><Tr>{lesson.title}</Tr></TutorialLink></h3>
                <p><Tr>{lesson.outcome}</Tr></p>
              </article>;
            })}
          </div>
          <p><Tr>Not sure where to begin? Follow the recommended fictional content project at your own pace.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/start-here"><Tr>Start here</Tr></Link>
            <Link className="btn btn-secondary" href="/tools"><Tr>Explore tools</Tr></Link>
            <Link className="btn btn-secondary" href="/challenges/first-website"><Tr>Open the 7-day website challenge</Tr></Link>
            <Link className="text-link" href="/business-launchpad"><Tr>Open the AI Business Launchpad</Tr></Link>
            <Link className="text-link" href="/ai-updates"><Tr>Explore reviewed AI updates</Tr></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow"><Tr>Choose your direction</Tr></span>
              <h2><Tr>What do you want to build?</Tr></h2>
            </div>
          </div>
          <div className="goal-grid">
            {catalog.goals.slice(0, 6).map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
          {catalog.goals.length > 6 && (
            <details className="more-options">
              <summary><Tr>See more learning goals</Tr></summary>
              <div className="goal-grid">
                {catalog.goals.slice(6).map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </details>
          )}
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

      <section className="section muted-section">
        <div className="container faq">
          <div className="section-head">
            <div>
              <span className="eyebrow"><Tr>Quick answers</Tr></span>
              <h2><Tr>Questions beginners ask</Tr></h2>
            </div>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary><Tr>{q}</Tr></summary>
                <p><Tr>{a}</Tr></p>
              </details>
            ))}
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
