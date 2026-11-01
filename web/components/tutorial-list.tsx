'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type TutorialCardData = {
  pathId: string;
  href: string;
  title: string;
  intro: string;
  time: string;
  stepCount: number;
  badge?: string;
  level?: string;
  pathTitle?: string;
};

export function TutorialList({ items }: { items: TutorialCardData[] }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  const levels = useMemo(() => ['All', ...Array.from(new Set(items.flatMap((item) => item.level ?? [])))], [items]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (level !== 'All' && item.level !== level) return false;
      if (!needle) return true;
      return [item.title, item.intro, item.pathTitle, item.badge].some((field) => field?.toLowerCase().includes(needle));
    });
  }, [items, query, level]);

  return (
    <div>
      <div className="tutorial-filters">
        <label className="sr-only" htmlFor="tutorial-search">
          Search tutorials
        </label>
        <input
          id="tutorial-search"
          className="planner-input"
          type="search"
          placeholder="Search tutorials, for example Python or automation"
          value={query}
          maxLength={80}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="cta-row" role="group" aria-label="Filter by level">
          {levels.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`btn ${level === entry ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={level === entry}
              onClick={() => setLevel(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>
      <p className="planner-note" aria-live="polite">
        {visible.length} of {items.length} tutorials
      </p>
      <div className="path-directory">
        {visible.map((tutorial) => (
          <article className="path-card" key={tutorial.pathId}>
            <div className="tool-meta path-meta">
              {tutorial.badge && <span className="path-badge">{tutorial.badge}</span>}
              {tutorial.level && <span className="skill-chip">{tutorial.level}</span>}
              <span className="skill-chip">{tutorial.time}</span>
            </div>
            <h3>{tutorial.title}</h3>
            <p>
              {tutorial.stepCount} steps{tutorial.pathTitle ? ` · ${tutorial.pathTitle} path` : ''}
            </p>
            <Link className="btn btn-primary" href={tutorial.href}>
              Start tutorial
            </Link>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p>No tutorials match. Try a different word or clear the filter.</p>}
    </div>
  );
}
