import type { Metadata } from 'next';
import { FeedbackGuide } from '@/components/feedback-guide';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Practice Project Feedback Guide',
  description: 'Prepare a respectful feedback request, record observations and plan a revision for a fictional practice project.'
};

export default function FeedbackGuidePage() {
  return <section className="section"><div className="container narrow-container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>Practice project feedback guide</Tr></h1>
      <p><Tr>Ask useful questions, plan one improvement and check the result. Feedback is not a certificate, verified skill or permission to publish.</Tr></p>
    </div>
    <FeedbackGuide />
  </div></section>;
}
