import type { Metadata } from 'next';
import Link from 'next/link';
import { TutorialSteps } from '@/components/tutorial-steps';
import { aiAssistedCodingSteps } from '@/lib/ai-assisted-coding-tutorial';

export const metadata: Metadata = {
  title: 'Code with an AI assistant: tutorial',
  description: 'A step-by-step tutorial: write clear prompts, review AI code, test it and stay in control.'
};

export default function AiAssistedCodingTutorialPage() {
  return (
    <section className="section">
      <div className="container first-app-project">
        <div className="section-head">
          <span className="eyebrow">Step-by-step tutorial · about 60 minutes</span>
          <h1>Code with an AI assistant</h1>
          <p>
            Learn to pair with Copilot or Codex without losing control. You will write a small Python function with
            AI help, then read it, test it, debug it and improve it. If Python is new to you, start with the{' '}
            <Link href="/projects/coding-foundations/build">Python tutorial</Link> first.
          </p>
        </div>
        <TutorialSteps steps={aiAssistedCodingSteps} storageKey="desofec:tutorial:ai-assisted-coding" />
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/paths/ai-assisted-coding">
            Back to the path
          </Link>
        </div>
      </div>
    </section>
  );
}
