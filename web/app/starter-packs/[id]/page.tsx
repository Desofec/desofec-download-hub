import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackChecklist } from '@/components/pack-checklist';
import { downloadUrl } from '@/lib/urls';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export async function generateStaticParams() {
  const { starterPacks } = await getCatalog();
  return starterPacks.map((pack) => ({ id: pack.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pack = (await getCatalog()).starterPacks.find((entry) => entry.id === id);
  if (!pack) return { title: 'Starter pack' };
  const canonical = `/starter-packs/${encodeURIComponent(id)}`;
  return {
    title: pack.title,
    description: pack.description,
    alternates: { canonical },
    openGraph: { title: pack.title, description: pack.description, url: canonical },
    twitter: { card: 'summary_large_image', title: pack.title, description: pack.description }
  };
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
          <span className="eyebrow"><Tr>Starter pack checklist</Tr></span>
          <h1><Tr>{pack.title}</Tr></h1>
          <p><Tr>{pack.description}</Tr></p>
        </div>
        <div className="tool-meta path-meta">
          <span className="tool-tag"><Tr>Starter</Tr></span>
          <span className="skill-chip"><Tr>{pack.level}</Tr></span>
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href={downloadUrl(pack.file)} download>
            <Tr>Download the pack</Tr>
          </a>
          <Link className="btn btn-secondary" href="/starter-packs">
            <Tr>All starter packs</Tr>
          </Link>
        </div>
        <div className="section-head checklist-heading">
          <h2><Tr>Work through the steps</Tr></h2>
          <p><Tr>Tick off each step as you go. Progress saves on this device and syncs across devices when you sign in.</Tr></p>
        </div>
        <PackChecklist packId={pack.id} steps={steps} />
      </div>
    </section>
  );
}
