import type { Metadata } from 'next';
import { StudyBoard } from '@/components/study-board';
import { Tr } from '@/components/tr';
import { getCatalog } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Study groups',
  description: 'Find people with the same learning goal and study together in a private workspace.',
  robots: { index: false }
};

export default async function StudyGroupsPage() {
  const { goals } = await getCatalog();

  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-head">
          <span className="eyebrow"><Tr>Learn together</Tr></span>
          <h1><Tr>Study groups</Tr></h1>
          <p><Tr>{"Find people with the same learning goal. Post a card, or ask to join someone else's group."}</Tr></p>
        </div>
        <StudyBoard goals={goals.map((goal) => ({ id: goal.id, name: goal.name }))} />
      </div>
    </section>
  );
}
