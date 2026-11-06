import type { Metadata } from 'next';
import Link from 'next/link';
import { PackChecklist } from '@/components/pack-checklist';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';
import { phrase } from '@/lib/phrase-mark';
import { PathCard } from '@/components/cards';
import { tutorials } from '@/lib/tutorials';

export const metadata: Metadata = {
  title: 'AI Business Launchpad',
  description: 'Learn AI video creation for business, automation, content, CAD concepts, micro-SaaS validation and adult education with guided practice projects.'
};

const stages = [
  [phrase('Validate one customer problem'), phrase('Interview with permission. Record evidence and unknowns before buying tools.')],
  [phrase('Define a safe, bounded pilot'), phrase('Choose one administrative task, a human reviewer and clear stop conditions.')],
  [phrase('Build and test a fictional enquiry demo'), phrase('Use six sample events to check drafts, duplicates, missing data and human review.')],
  [phrase('Calculate costs and prepare an honest offer'), phrase('Separate setup, support and vendor costs. Never promise earnings or invent client results.')],
  [phrase('Plan handover and review the evidence'), phrase('Document the off switch, manual fallback and a decision to continue, revise or stop.')]
];

export default async function BusinessLaunchpadPage() {
  const { starterPackChecklists, paths } = await getCatalog();
  const services = tutorials.filter((tutorial) => tutorial.serviceKitId);

  return (
    <section className="section">
      <div className="container first-app-project">
        <div className="section-head">
          <span className="eyebrow"><Tr>From learning to a small pilot</Tr></span>
          <h1><Tr>AI Business Launchpad</Tr></h1>
          <p><Tr>Choose a service learning path, including AI video creation for business. Build practice evidence before offering real work; no path promises clients or income.</Tr></p>
          <p><Tr>No paid AI is required for the worksheets. Lessons and downloads are currently English; the surrounding interface follows your language. Interviews, feedback and tool setup take additional time.</Tr></p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/start-here"><Tr>Start here</Tr></Link>
            <Link className="btn btn-primary" href="/paths/freelance-client-discovery"><Tr>{'Freelance Client Discovery & Project Scoping'}</Tr></Link>
            <Link className="btn btn-primary" href="/business-launchpad/freelance-portfolio"><Tr>{'Freelance Portfolio & Case Study Builder'}</Tr></Link>
            <Link className="btn btn-primary" href="/business-launchpad/spreadsheet-lab"><Tr>{'Excel Data Cleaning & PDF-to-Excel Services'}</Tr></Link>
            <Link className="btn btn-primary" href="/paths/ai-video-business"><Tr>AI Video Creation for Business</Tr></Link>
            <Link className="btn btn-primary" href="/paths/ai-automation-services"><Tr>AI Workflow Automation for Small Business</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/automation-lab"><Tr>Open the no-send automation practice lab</Tr></Link>
            <Link className="btn btn-primary" href="/business-launchpad/first-project"><Tr>Complete your first practice project</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/feedback-guide"><Tr>Open practice feedback guide</Tr></Link>
            <Link className="btn btn-primary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
            <Link className="btn btn-primary" href="/tutorials/ai-automation-services"><Tr>Start the automation service tutorial</Tr></Link>
            <Link className="btn btn-secondary" href="/starter-packs/ai-automation-services-kit"><Tr>Open the pilot kit</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/proposal-builder"><Tr>Build a pilot proposal</Tr></Link>
            <Link className="btn btn-secondary" href="/business-launchpad/results-tracker"><Tr>Track pilot tests and results</Tr></Link>
          </div>
        </div>

        <section className="progress-section" aria-labelledby="launchpad-services">
          <h2 id="launchpad-services"><Tr>Choose a service learning path</Tr></h2>
          <p><Tr>Explore business video creation, automation, content, CAD concepts, micro-SaaS validation and adult education. Each service path includes six lessons, a starter kit and a guided private project.</Tr></p>
          <div className="path-grid">
            {services.map((tutorial) => {
              const path = paths.find((entry) => entry.id === tutorial.pathId);
              return path ? (
                <div key={path.id} className="service-path-entry">
                  <PathCard path={path} />
                  <div className="cta-row">
                    <Link className="btn btn-primary" href={tutorial.href}>
                      <Tr>Start the tutorial</Tr>
                    </Link>
                    <Link className="btn btn-secondary" href={`/starter-packs/${tutorial.serviceKitId}`}>
                      <Tr>Open the service kit</Tr>
                    </Link>
                    <Link className="btn btn-secondary" href={`/business-launchpad/projects?path=${encodeURIComponent(path.id)}`}>
                      <Tr>Start a practice project</Tr>
                    </Link>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </section>

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
