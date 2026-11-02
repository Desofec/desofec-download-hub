'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Tr, useTr } from '@/components/tr';
import { useLanguage } from '@/components/language';
import { getTutorialTranslation } from '@/lib/tutorial-translations';

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
  const tr = useTr();
  const language = useLanguage();
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
          <Tr>Search tutorials</Tr>
        </label>
        <input
          id="tutorial-search"
          className="planner-input"
          type="search"
          placeholder={tr('Search tutorials, for example Python or automation')}
          value={query}
          maxLength={80}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="cta-row" role="group" aria-label={tr('Filter by level')}>
          {levels.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`btn ${level === entry ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={level === entry}
              onClick={() => setLevel(entry)}
            >
              <Tr>{entry}</Tr>
            </button>
          ))}
        </div>
      </div>
      <p className="planner-note" aria-live="polite">
        <Tr values={{ shown: visible.length, total: items.length }}>{'{shown} of {total} tutorials'}</Tr>
      </p>
      <div className="path-directory">
        {visible.map((tutorial) => (
          <article className="path-card" key={tutorial.pathId}>
            <div className="tool-meta path-meta">
              {tutorial.badge && (
                <span className="path-badge">
                  <Tr>{tutorial.badge}</Tr>
                </span>
              )}
              {tutorial.level && (
                <span className="skill-chip">
                  <Tr>{tutorial.level}</Tr>
                </span>
              )}
              <span className="skill-chip">
                <Tr values={{ minutes: Number.parseInt(tutorial.time, 10) }}>{'{minutes} minutes'}</Tr>
              </span>
            </div>
            <h3>{getTutorialTranslation(tutorial.pathId, language)?.title ?? tutorial.title}</h3>
            <p>
              <Tr values={{ count: tutorial.stepCount }}>{'{count} steps'}</Tr>
              {tutorial.pathTitle && (
                <>
                  {' · '}
                  <Tr values={{ title: tr(tutorial.pathTitle) }}>{'{title} path'}</Tr>
                </>
              )}
            </p>
            <Link className="btn btn-primary" href={tutorial.href}>
              <Tr>Start tutorial</Tr>
            </Link>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p>
          <Tr>No tutorials match. Try a different word or clear the filter.</Tr>
        </p>}
    </div>
  );
}
