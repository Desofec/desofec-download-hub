'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Tr, useTr } from '@/components/tr';
import { useLanguage } from '@/components/language';
import { getTutorialTranslation } from '@/lib/tutorial-translations';
import { matchesTutorialFilters, tutorialTopics, type TutorialTopic } from '@/lib/tutorial-directory';

export type TutorialCardData = {
  pathId: string;
  href: string;
  title: string;
  intro: string;
  topics: TutorialTopic[];
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
  const [topic, setTopic] = useState<TutorialTopic | 'all'>('all');

  const levels = useMemo(() => ['All', ...Array.from(new Set(items.flatMap((item) => item.level ?? [])))], [items]);

  const visible = useMemo(() => {
    return items.filter((item) => {
      const translation = getTutorialTranslation(item.pathId, language);
      return matchesTutorialFilters({
        topics: item.topics,
        level: item.level,
        searchText: [
          item.title, item.intro, item.pathTitle ?? '', item.badge ?? '',
          translation?.title ?? '', tr(item.title), translation?.intro ?? '', tr(item.intro),
          tr(item.pathTitle ?? ''), tr(item.badge ?? ''),
          ...item.topics.flatMap((id) => {
            const label = tutorialTopics.find((entry) => entry.id === id)!.label;
            return [label, tr(label)];
          })
        ]
      }, query, topic, level);
    });
  }, [items, query, topic, level, language, tr]);

  return (
    <div>
      <p><Tr>Filter by topic, level or a search word. Some lesson descriptions remain in English; the filters follow your language.</Tr></p>
      <div className="tutorial-filters">
        <div className="form-group">
          <label htmlFor="tutorial-topic"><Tr>Choose a topic</Tr></label>
          <select id="tutorial-topic" value={topic} onChange={(event) => {
            const selected = event.target.value;
            if (selected === 'all') setTopic('all');
            else {
              const entry = tutorialTopics.find((candidate) => candidate.id === selected);
              if (entry) setTopic(entry.id);
            }
          }}>
            <option value="all">{tr('All topics')}</option>
            {tutorialTopics.map((entry) => <option key={entry.id} value={entry.id}>{tr(entry.label)}</option>)}
          </select>
        </div>
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
        <button type="button" className="btn btn-secondary" disabled={!query && topic === 'all' && level === 'All'}
          onClick={() => { setQuery(''); setTopic('all'); setLevel('All'); }}>
          <Tr>Clear tutorial filters</Tr>
        </button>
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
            <h3>{getTutorialTranslation(tutorial.pathId, language)?.title ?? tr(tutorial.title)}</h3>
            <p>{getTutorialTranslation(tutorial.pathId, language)?.intro || tr(tutorial.intro)}</p>
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
