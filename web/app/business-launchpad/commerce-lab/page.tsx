import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CommercePracticeLab } from '@/components/commerce-practice-lab';
import { Tr } from '@/components/tr';
import { commerceTrack } from '@/lib/commerce-practice';

export const metadata: Metadata = {
  title: 'Commerce and Logistics Practice Lab',
  description: 'Edit fictional retail costs and inventory, marketplace commissions, and logistics stock and order records with explicit checks and downloadable worksheets.',
  alternates: { canonical: '/business-launchpad/commerce-lab' },
  openGraph: { title: 'Commerce and Logistics Practice Lab', url: '/business-launchpad/commerce-lab' }
};

type Query = Promise<{ track?: string | string[] }>;

async function Lab({ searchParams }: { searchParams: Query }) {
  const params = await searchParams;
  const track = commerceTrack(typeof params.track === 'string' ? params.track : undefined);
  return <CommercePracticeLab key={track} initialTrack={track} />;
}

export default function CommerceLabPage({ searchParams }: { searchParams: Query }) {
  return <section className="section"><div className="container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>Commerce and Logistics Practice Lab</Tr></h1>
      <p><Tr>Practise all three business models with editable fictional data, checked calculations, explicit exceptions and downloadable review worksheets.</Tr></p>
    </div>
    <Suspense fallback={<p><Tr>Loading...</Tr></p>}><Lab searchParams={searchParams} /></Suspense>
  </div></section>;
}
