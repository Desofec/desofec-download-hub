import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCompletionDashboard } from '@/components/project-completion-dashboard';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey, tutorials } from '@/lib/tutorials';

export const metadata: Metadata = {
  title: 'Start Here: Build Your First Practice Portfolio',
  description: 'Learn a practical service, complete a guided fictional project and build an honest portfolio. Start with one beginner-friendly content exercise.',
  alternates: { canonical: '/start-here' }
};

export default async function StartHerePage() {
  const { paths, starterPacks, starterPackChecklists } = await getCatalog();
  const recommended = 'ai-content-services';
  return <section className="section"><div className="container first-app-project">
    <div className="section-head">
      <span className="eyebrow"><Tr>Start here</Tr></span>
      <h1><Tr>Learn a service. Finish a practice project. Build an honest portfolio.</Tr></h1>
      <p><Tr>One clear route for beginners who want to explore small-business digital services. No coding, paid AI or account is required for the recommended practice.</Tr></p>
      <p><Tr>Practice is not verified client work, certification or a promise of clients or income. Use fictional information and review your evidence before sharing.</Tr></p>
    </div>
    <section className="path-card" aria-labelledby="recommended-first-project">
      <h2 id="recommended-first-project"><Tr>Recommended first project: a fictional bakery content package</Tr></h2>
      <p><Tr>Create three short posts and four FAQ answers from supplied facts. Check claims and permissions, record revisions and turn your saved work into a clearly labelled practice case study.</Tr></p>
      <p><Tr>Go at your own pace. Reading, drafting, testing and feedback take separate time; checking a lesson does not create or verify deliverables.</Tr></p>
      <div className="cta-row">
        <Link className="btn btn-primary" href="/business-launchpad/projects?path=ai-content-services"><Tr>Start the guided content project</Tr></Link>
        <Link className="btn btn-secondary" href="/tutorials/ai-content-services"><Tr>Preview the lessons</Tr></Link>
        <Link className="text-link" href="/business-launchpad/first-project"><Tr>Prefer another service? Choose a different practice project.</Tr></Link>
      </div>
    </section>
    <ol className="journey-stages">
      <li><h2><Tr>1. Learn and create</Tr></h2><p><Tr>Create a titled device project, then follow its next guided action. Use the lessons and workbook to draft your own fictional materials; nothing is generated or saved automatically.</Tr></p></li>
      <li><h2><Tr>2. Test and revise</Tr></h2><p><Tr>Record actual checks, missing evidence and a reasoned decision. Unavailable review stays blocked; a complete checklist is not permission for real client work.</Tr></p></li>
      <li><h2><Tr>3. Explain your work</Tr></h2><p><Tr>Save a case study, select evidence and inspect every included section before exporting. Downloads remain private files until you choose to share them manually.</Tr></p></li>
    </ol>
    <ProjectCompletionDashboard />
    <p><Link className="text-link" href="/business-launchpad/feedback-guide"><Tr>Open practice feedback guide</Tr></Link></p>
    <details className="journey-portfolio">
      <summary><Tr>Recommended-path lesson and kit checkmarks</Tr></summary>
      <p><Tr>These are your existing learning checkmarks, separate from the project dashboard. Signed-in learning progress follows existing sync rules; private project snapshots still require explicit loading and upload consent.</Tr></p>
      <ProgressDashboard
        paths={paths.filter((path) => path.id === recommended)}
        packs={starterPacks.filter((pack) => pack.id === `${recommended}-kit`)}
        checklists={starterPackChecklists}
        tutorials={tutorials.filter((tutorial) => tutorial.pathId === recommended).map((tutorial) => ({
          id: tutorial.pathId, title: tutorial.title, href: tutorial.href,
          stepIds: tutorial.steps.map((step) => step.id), storageKey: tutorialStorageKey(tutorial.pathId)
        }))}
      />
    </details>
    <div className="cta-row">
      <Link className="btn btn-secondary" href="/my-progress"><Tr>View all progress</Tr></Link>
      <Link className="btn btn-secondary" href="/onboarding"><Tr>Explore other learning goals</Tr></Link>
    </div>
  </div></section>;
}
