import type { Metadata } from 'next';
import { AutomationPracticeLab } from '@/components/automation-practice-lab';
import { Tr } from '@/components/tr';

const title = 'AI Workflow Automation for Small Business: Practice Lab';
const description = 'Practise customer enquiry tracking, appointment reminder automation and automated weekly business reports with fictional data, duplicate checks and safe retries. No messages sent.';
const canonical = 'https://desofec.com/business-launchpad/automation-lab';
export const metadata: Metadata = {
  title, description, alternates: { canonical },
  openGraph: { title, description, url: canonical, type: 'website' },
  twitter: { card: 'summary', title, description }
};

export default function AutomationLabPage() {
  return <section className="section"><div className="container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>AI Workflow Automation for Small Business: Practice Lab</Tr></h1>
      <p><Tr>Test three small-business workflows before connecting any real account. Use rules first, inspect errors and keep a human in control. AI is optional, not part of this simulator.</Tr></p>
    </div>
    <AutomationPracticeLab />
  </div></section>;
}
