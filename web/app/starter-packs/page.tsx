import type { Metadata } from 'next';
import { PackCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';

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
            <span className="eyebrow">Starter packs</span>
            <h1>Practical resources to start with</h1>
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
