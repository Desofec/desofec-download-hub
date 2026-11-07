import type { Metadata } from 'next';
import { PathCard } from '@/components/cards';
import { getCatalog } from '@/lib/catalog';
import { Tr } from '@/components/tr';

export const metadata: Metadata = {
  title: 'Learning paths',
  description: 'Choose a beginner-friendly learning path for AI, coding, design, no-code or automation, with clear steps and practical projects.',
  alternates: { canonical: '/paths' },
  openGraph: {
    title: 'Beginner-Friendly AI and Digital Skills Learning Paths',
    description: 'Choose step-by-step paths for learning AI, coding, design, no-code and automation through practical projects.',
    url: '/paths'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beginner-Friendly AI and Digital Skills Learning Paths',
    description: 'Choose step-by-step paths for learning AI, coding, design, no-code and automation through practical projects.'
  }
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
