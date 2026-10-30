import type { Metadata } from 'next';
import { PathCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';

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
            <span className="eyebrow">Learning paths</span>
            <h1>Beginner-first journeys</h1>
          </div>
        </div>
        <div className="path-directory">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} showSteps />
          ))}
        </div>
      </div>
    </section>
  );
}
