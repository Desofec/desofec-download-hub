import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientDiscoveryBuilder } from '@/components/client-discovery-builder';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Freelance Client Discovery & Project Scoping',
  description: 'Practise client discovery questions, project-fit checks, bounded scope and change requests with a fictional client brief. No live outreach or automatic approval.',
  alternates: { canonical: '/business-launchpad/client-discovery-lab' }
};
export default function DiscoveryLabPage() {
  return <section className="section"><div className="container narrow-container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>{'Freelance Client Discovery & Project Scoping'}</Tr></h1>
      <p><Tr>Ask neutral questions, separate facts from assumptions and define a small service before preparing a proposal. No client or earnings promises.</Tr></p>
      <Link href="/starter-packs/freelance-client-discovery-kit" className="btn btn-secondary"><Tr>Open the service kit</Tr></Link>
    </div>
    <ClientDiscoveryBuilder />
  </div></section>;
}
