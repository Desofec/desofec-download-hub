import type { Metadata } from 'next';
import { PackCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Starter packs',
  description: 'Browse practical starter packs, prompts and checklists for beginner AI, coding, design, no-code and productivity projects.',
  alternates: { canonical: '/starter-packs' },
  openGraph: {
    title: 'Practical AI and Digital Skills Starter Packs',
    description: 'Browse beginner-friendly prompts, checklists and resource packs for AI, coding, design and no-code projects.',
    url: '/starter-packs'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Practical AI and Digital Skills Starter Packs',
    description: 'Browse beginner-friendly prompts, checklists and resource packs for AI, coding, design and no-code projects.'
  }
};

export default async function StarterPacksPage() {
  const { starterPacks } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow"><Tr>Starter packs</Tr></span>
            <h1><Tr>Practical resources to start with</Tr></h1>
          </div>
        </div>
        <h2 className="sr-only"><Tr>All starter packs</Tr></h2>
        <div className="starter-directory">
          {starterPacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
}
