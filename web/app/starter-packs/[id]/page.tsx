import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackChecklist } from '@/components/pack-checklist';
import { downloadUrl } from '@/lib/urls';
import { getCatalog } from '@/lib/catalog';

export async function generateStaticParams() {
  const { starterPacks } = await getCatalog();
  return starterPacks.map((pack) => ({ id: pack.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pack = (await getCatalog()).starterPacks.find((entry) => entry.id === id);
  return pack ? { title: pack.title, description: pack.description } : { title: 'Starter pack' };
}

export default async function StarterPackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const pack = catalog.starterPacks.find((entry) => entry.id === id);
  if (!pack) notFound();

  const steps = catalog.starterPackChecklists[id];
  if (!steps) notFound();

  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow">Starter pack checklist</span>
          <h1>{pack.title}</h1>
          <p>{pack.description}</p>
        </div>
        <div className="tool-meta path-meta">
          <span className="tool-tag">Starter</span>
          <span className="skill-chip">{pack.level}</span>
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href={downloadUrl(pack.file)} download>
            Download the pack
          </a>
          <Link className="btn btn-secondary" href="/starter-packs">
            All starter packs
          </Link>
        </div>
        <div className="section-head checklist-heading">
          <h2>Work through the steps</h2>
          <p>Tick off each step as you go. Your progress is saved in this browser.</p>
        </div>
        <PackChecklist packId={pack.id} steps={steps} />
      </div>
    </section>
  );
}
