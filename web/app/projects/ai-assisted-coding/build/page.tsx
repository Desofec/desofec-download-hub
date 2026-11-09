import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { TutorialHeader } from '@/components/tutorial-header';
import { TutorialLabel } from '@/components/tutorial-back-label';
import { TutorialLanguageLinks } from '@/components/tutorial-language-links';
import { TutorialSteps } from '@/components/tutorial-steps';
import { TutorialLink } from '@/components/tutorial-link';
import { aiAssistedCodingSteps } from '@/lib/ai-assisted-coding-tutorial';
import { requireTutorial, tutorialAlternates, tutorialSocialLocales } from '@/lib/localized-tutorials';

const tutorial = requireTutorial('ai-assisted-coding');
export const metadata = {
  ...publicPageMetadata('/projects/ai-assisted-coding/build', {
    title: 'AI coding assistant tutorial for beginners',
    description: 'Practise with an AI coding assistant and a small Python project. Write prompts, review suggested code, test for bugs and stay in control.',
    socialLocales: tutorialSocialLocales(tutorial, 'en')
  }),
  alternates: tutorialAlternates(tutorial, 'en')
};

export default function AiAssistedCodingTutorialPage() {
  return (
    <section className="section">
      <div className="container first-app-project">
        <TutorialHeader
          pathId="ai-assisted-coding"
          title="Code with an AI assistant"
          minutes={60}
          intro={
            <>Learn to pair with Copilot or Codex without losing control. You will write a small Python function with
            AI help, then read it, test it, debug it and improve it. If Python is new to you, start with the{' '}
            <TutorialLink href="/projects/coding-foundations/build">Python tutorial</TutorialLink> first.</>
          }
        />
        <TutorialLanguageLinks tutorial={tutorial} />
        <TutorialSteps
          steps={aiAssistedCodingSteps}
          storageKey="desofec:tutorial:ai-assisted-coding"
          syncId="ai-assisted-coding"
          title="Code with an AI assistant"
        />
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/paths/ai-assisted-coding"><TutorialLabel k="tutorial.back" /></Link>
        </div>
      </div>
    </section>
  );
}
