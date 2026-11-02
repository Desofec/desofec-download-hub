import type { Metadata } from 'next';
import { PackCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Starter packs',
  description: 'Download starter packs and practical resource bundles for AI, no-code, coding, and productivity.'
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
        <div className="starter-directory">
          {starterPacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
}
