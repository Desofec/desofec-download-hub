import Link from 'next/link';
import { FavoriteToolButton } from '@/components/favorite-tool-button';
import { downloadUrl } from '@/lib/urls';
import type { Goal, LearningPath, StarterPack, Tool } from '@/lib/types';
import { Tr } from '@/components/tr';
import { ToolFreshness } from '@/components/tool-freshness';

export function GoalCard({ goal }: { goal: Goal }) {
  return (
    <article className="goal-card">
      <span className="goal-badge"><Tr>{goal.badge}</Tr></span>
      <h3><Tr>{goal.name}</Tr></h3>
      <p><Tr>{goal.description}</Tr></p>
      <div className="card-cta">
        <Link className="btn btn-secondary" href={`/onboarding?goal=${encodeURIComponent(goal.id)}`}>
          <Tr>Start here</Tr>
        </Link>
      </div>
    </article>
  );
}

export function ToolCard({
  tool,
  cta = 'find',
  comparison
}: {
  tool: Tool;
  cta?: 'find' | 'none';
  comparison?: { selected: boolean; disabled: boolean; onToggle: () => void };
}) {
  return (
    <article className="tool-card">
      <div className="tool-meta">
        <span className="tool-tag"><Tr>{tool.badge}</Tr></span>
        <span className="skill-chip"><Tr>{tool.skill}</Tr></span>
      </div>
      <h3>{tool.name}</h3>
      <p><Tr>{tool.description}</Tr></p>
      <ToolFreshness tool={tool} />
      <div className="card-cta">
        <FavoriteToolButton toolId={tool.id} />
        <a
          className="btn btn-primary"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tr>Open tool</Tr>
          <span className="sr-only">{` – ${tool.name}`}</span>
        </a>
        <Link className="btn btn-secondary" href={`/tools/${encodeURIComponent(tool.id)}`}>
          <Tr>Details</Tr>
        </Link>
        {comparison && (
          <button
            type="button"
            className="btn btn-secondary"
            aria-pressed={comparison.selected}
            disabled={comparison.disabled}
            onClick={comparison.onToggle}
          >
            <Tr>{comparison.selected ? 'Remove from comparison' : 'Add to comparison'}</Tr>
          </button>
        )}
        {cta === 'find' && (
          <Link className="btn btn-secondary" href="/onboarding">
            <Tr>Find my path</Tr>
          </Link>
        )}
      </div>
    </article>
  );
}

export function PathCard({ path, showSteps = false }: { path: LearningPath; showSteps?: boolean }) {
  return (
    <article className="path-card">
      <div className="card-row">
        <span className="path-badge"><Tr>{path.badge}</Tr></span>
        <span className="skill-chip"><Tr>{path.level}</Tr></span>
      </div>
      <h3><Tr>{path.title}</Tr></h3>
      <p><Tr>{path.description}</Tr></p>
      {showSteps && (
        <ul className="mini-checklist">
          {path.steps.map((step) => (
            <li key={step}><Tr>{step}</Tr></li>
          ))}
        </ul>
      )}
      <div className="card-cta">
        <Link className="btn btn-secondary" href={`/paths/${encodeURIComponent(path.id)}`}>
          <Tr>View path</Tr>
        </Link>
      </div>
    </article>
  );
}

export function PackCard({ pack }: { pack: StarterPack }) {
  return (
    <article className="starter-card">
      <div className="tool-meta">
        <span className="tool-tag"><Tr>Starter</Tr></span>
        <span className="skill-chip"><Tr>{pack.level}</Tr></span>
      </div>
      <h3><Tr>{pack.title}</Tr></h3>
      <p><Tr>{pack.description}</Tr></p>
      <div className="card-cta">
        <Link className="btn btn-secondary" href={`/starter-packs/${encodeURIComponent(pack.id)}`}>
          <Tr>View checklist</Tr>
        </Link>
        <a className="btn btn-secondary" href={downloadUrl(pack.file)} download>
          <Tr>Download pack</Tr>
        </a>
      </div>
    </article>
  );
}
