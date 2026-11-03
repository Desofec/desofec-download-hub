import type { Metadata } from 'next';
import { PathCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Learning paths',
  description: 'Explore beginner-friendly learning paths for AI, coding, no-code, and automation.'
};

export default async function PathsPage() {
  const { paths } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow"><Tr>Learning paths</Tr></span>
            <h1><Tr>Beginner-first journeys</Tr></h1>
          </div>
        </div>
        <h2 className="sr-only"><Tr>All learning paths</Tr></h2>
        <div className="path-directory">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} showSteps />
          ))}
        </div>
      </div>
    </section>
  );
}
