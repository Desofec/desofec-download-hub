import Link from 'next/link';
import { downloadUrl } from '@/lib/urls';
import type { Goal, LearningPath, StarterPack, Tool } from '@/lib/types';

export function GoalCard({ goal }: { goal: Goal }) {
  return (
    <article className="goal-card">
      <span className="goal-badge">{goal.badge}</span>
      <h3>{goal.name}</h3>
      <p>{goal.description}</p>
      <div className="card-cta">
        <Link className="btn btn-secondary" href={`/onboarding?goal=${encodeURIComponent(goal.id)}`}>
          Start here
        </Link>
      </div>
    </article>
  );
}

export function ToolCard({ tool, cta = 'find' }: { tool: Tool; cta?: 'find' | 'none' }) {
  return (
    <article className="tool-card">
      <div className="tool-meta">
        <span className="tool-tag">{tool.badge}</span>
        <span className="skill-chip">{tool.skill}</span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      {cta === 'find' && (
        <div className="card-cta">
          <Link className="btn btn-secondary" href="/onboarding">
            Find my path
          </Link>
        </div>
      )}
    </article>
  );
}

export function PathCard({ path, showSteps = false }: { path: LearningPath; showSteps?: boolean }) {
  return (
    <article className="path-card">
      <div className="card-row">
        <span className="path-badge">{path.badge}</span>
        <span className="skill-chip">{path.level}</span>
      </div>
      <h3>{path.title}</h3>
      <p>{path.description}</p>
      {showSteps && (
        <ul className="mini-checklist">
          {path.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      )}
      <div className="card-cta">
        <Link className="btn btn-secondary" href={`/paths/${encodeURIComponent(path.id)}`}>
          View path
        </Link>
      </div>
    </article>
  );
}

export function PackCard({ pack }: { pack: StarterPack }) {
  return (
    <article className="starter-card">
      <div className="tool-meta">
        <span className="tool-tag">Starter</span>
        <span className="skill-chip">{pack.level}</span>
      </div>
      <h3>{pack.title}</h3>
      <p>{pack.description}</p>
      <div className="card-cta">
        <a className="btn btn-secondary" href={downloadUrl(pack.file)} download>
          Download pack
        </a>
      </div>
    </article>
  );
}
