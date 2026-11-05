import type { Metadata } from 'next';
import Link from 'next/link';
import { PackChecklist } from '@/components/pack-checklist';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';
import { phrase } from '@/lib/phrase-mark';

export const metadata: Metadata = {
  title: 'AI Business Launchpad',
  description: 'Prepare an automation-service pilot with customer discovery, a safe fictional demo, cost checks and a practical proposal.'
};

const stages = [
  [phrase('Validate one customer problem'), phrase('Interview with permission. Record evidence and unknowns before buying tools.')],
  [phrase('Define a safe, bounded pilot'), phrase('Choose one administrative task, a human reviewer and clear stop conditions.')],
  [phrase('Build and test a fictional enquiry demo'), phrase('Use six sample events to check drafts, duplicates, missing data and human review.')],
  [phrase('Calculate costs and prepare an honest offer'), phrase('Separate setup, support and vendor costs. Never promise earnings or invent client results.')],
  [phrase('Plan handover and review the evidence'), phrase('Document the off switch, manual fallback and a decision to continue, revise or stop.')]
];

export default async function BusinessLaunchpadPage() {
  const { starterPackChecklists } = await getCatalog();

  return (
    <section className="section">
      <div className="container first-app-project">
        <div className="section-head">
          <span className="eyebrow"><Tr>From learning to a small pilot</Tr></span>
          <h1><Tr>AI Business Launchpad</Tr></h1>
          <p><Tr>Start with AI automation services: validate a problem, build a safe demo and prepare a pilot proposal. This is a learning journey, not a promise of income.</Tr></p>
          <p><Tr>No paid tool is required for the worksheets. Allow about two hours, plus time for customer discovery and workflow setup. The tutorial and download are currently in English.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/tutorials/ai-automation-services"><Tr>Start the automation service tutorial</Tr></Link>
            <Link className="btn btn-secondary" href="/starter-packs/ai-automation-services-kit"><Tr>Open the pilot kit</Tr></Link>
          </div>
        </div>

        <section className="progress-section" aria-labelledby="launchpad-route">
          <h2 id="launchpad-route"><Tr>Your first service: an enquiry review queue</Tr></h2>
          <p><Tr>Practise with a fictional workshop. Prepare acknowledgement drafts for a person to approve; do not connect a real inbox, send messages or automate machine control.</Tr></p>
          <div className="steps-grid">
            {stages.map(([title, text], index) => (
              <article className="step-card" key={title}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3><Tr>{title}</Tr></h3>
                <p><Tr>{text}</Tr></p>
              </article>
            ))}
          </div>
        </section>

        <section className="progress-section" aria-labelledby="launchpad-foundations">
          <h2 id="launchpad-foundations"><Tr>New to automation? Start here</Tr></h2>
          <p><Tr>Learn the basics first, then return to the pilot. Use test accounts and fictional data. Check current tool plans before paying or connecting business accounts.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-secondary" href="/tutorials/no-code-automation"><Tr>Automate your first task</Tr></Link>
            <Link className="btn btn-secondary" href="/tutorials/advanced-no-code-automation"><Tr>Build reliable no-code automations</Tr></Link>
            <Link className="btn btn-secondary" href="/results/start-ai-business"><Tr>Explore tools for this pilot</Tr></Link>
          </div>
        </section>

        <section className="progress-section" aria-labelledby="launchpad-checklist">
          <h2 id="launchpad-checklist"><Tr>Pilot readiness checklist</Tr></h2>
          <p><Tr>This checklist shares progress with the pilot kit. Tutorial steps save separately. Sign in to sync progress; no client notes or financial worksheets are collected here.</Tr></p>
          <PackChecklist packId="ai-automation-services-kit" steps={starterPackChecklists['ai-automation-services-kit']} />
        </section>
        <p><Tr>Before real client work, seek qualified local guidance on registration, contracts, privacy, taxes and insurance. Begin with administrative tasks, not safety-critical decisions.</Tr></p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/tutorials/ai-automation-services"><Tr>Start the automation service tutorial</Tr></Link>
          <Link className="btn btn-secondary" href="/my-progress"><Tr>View all progress</Tr></Link>
        </div>
      </div>
    </section>
  );
}
