import type { Metadata } from 'next';
import Link from 'next/link';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';

export const metadata: Metadata = {
  title: 'Step-by-step tutorials',
  description: 'Hands-on beginner tutorials for AI, coding, no-code, automation, ML and design, one for every learning path.'
};

export default async function TutorialsPage() {
  const { paths } = await getCatalog();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Tutorials</span>
            <h1>Learn by building, step by step</h1>
            <p>Every learning path has a hands-on tutorial with explanations, copy-ready examples and checks.</p>
            <Link className="btn btn-secondary" href="/plan">
              Not sure where to start? Describe your idea
            </Link>
          </div>
        </div>
        <div className="path-directory">
          {tutorials.map((tutorial) => {
            const path = paths.find((entry) => entry.id === tutorial.pathId);
            return (
              <article className="path-card" key={tutorial.pathId}>
                <div className="tool-meta path-meta">
                  {path && <span className="path-badge">{path.badge}</span>}
                  {path && <span className="skill-chip">{path.level}</span>}
                  <span className="skill-chip">{tutorial.time}</span>
                </div>
                <h3>{tutorial.title}</h3>
                <p>
                  {tutorial.steps.length} steps{path ? ` · ${path.title} path` : ''}
                </p>
                <Link className="btn btn-primary" href={tutorial.href}>
                  Start tutorial
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
