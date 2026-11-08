import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { PackChecklist } from '@/components/pack-checklist';
import { Tr } from '@/components/tr';
import { TutorialSteps } from '@/components/tutorial-steps';
import { getCatalog } from '@/lib/catalog';
import { tutorialStorageKey } from '@/lib/tutorials';
import { websiteChallengeId, websiteChallengeSteps } from '@/lib/website-challenge';

export const metadata = publicPageMetadata('/challenges/first-website', {
  title: '7-Day First Website Challenge',
  description: 'Build and publish a small website with seven practical tasks, saved progress and a final project checklist.'
});

export default async function FirstWebsiteChallengePage() {
  const { starterPackChecklists } = await getCatalog();

  return (
    <section className="section">
      <div className="container first-app-project">
        <div className="section-head">
          <span className="eyebrow"><Tr>Your first finished project</Tr></span>
          <h1><Tr>7-Day First Website Challenge</Tr></h1>
          <p><Tr>Build one small website with a daily task and a final project review. Go at your own pace: there is no deadline or penalty for missing a day.</Tr></p>
          <p><Tr>Plan about 15-30 minutes per day. Account setup and publishing may take longer. Check current hosting plans before choosing a service.</Tr></p>
          <p><Tr>Progress saves on this device. Sign in to sync it across devices. The challenge has its own progress, separate from the original website tutorial.</Tr></p>
        </div>
        <TutorialSteps
          steps={websiteChallengeSteps}
          storageKey={tutorialStorageKey(websiteChallengeId)}
          syncId={websiteChallengeId}
          title="7-Day First Website Challenge"
        />
        <section className="progress-section" aria-labelledby="final-checklist-heading">
          <h2 id="final-checklist-heading"><Tr>Final project checklist</Tr></h2>
          <p><Tr>This checklist is shared with the AI Website Kit. Review your live site before marking the final day complete.</Tr></p>
          <PackChecklist packId="ai-website-kit" steps={starterPackChecklists['ai-website-kit']} />
        </section>
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/paths/ai-website-builder"><Tr>View path</Tr></Link>
          <Link className="btn btn-secondary" href="/my-progress"><Tr>View all progress</Tr></Link>
        </div>
      </div>
    </section>
  );
}
