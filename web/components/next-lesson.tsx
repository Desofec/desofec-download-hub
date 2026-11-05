'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PathCard, ToolCard } from '@/components/cards';
import { useTr } from '@/components/tr';
import type { Goal, LearningPath, Recommendation, Tool } from '@/lib/types';

export function NextLesson({
  goals,
  paths,
  tools,
  recommendations
}: {
  goals: Goal[];
  paths: LearningPath[];
  tools: Tool[];
  recommendations: Record<string, Recommendation>;
}) {
  const tr = useTr();
  const [goal, setGoal] = useState('');
  const matchingPaths = paths.filter((path) => path.goal === goal);
  const toolIds = recommendations[goal]?.tools ?? [];
  const matchingTools = toolIds.flatMap((id) => tools.find((tool) => tool.id === id) ?? []);

  return (
    <section className="progress-section" aria-labelledby="next-lesson-heading">
      <div className="section-head">
        <div>
          <h2 id="next-lesson-heading">{tr('Choose your next lesson')}</h2>
          <p>{tr('Choose a goal to find matching paths and tools. Your saved progress stays below.')}</p>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="next-lesson-goal">{tr('What do you want to do?')}</label>
        <select id="next-lesson-goal" value={goal} onChange={(event) => setGoal(event.target.value)}>
          <option value="">{tr('Choose a goal')}</option>
          {goals.map((entry) => <option key={entry.id} value={entry.id}>{tr(entry.name)}</option>)}
        </select>
      </div>
      {goal && (
        <div>
          <p role="status">{tr('{count} matching learning paths', { count: matchingPaths.length })}</p>
          <div className="path-grid">
            {matchingPaths.map((path) => <PathCard key={path.id} path={path} />)}
          </div>
          <div className="section-head"><h3>{tr('Tools for this goal')}</h3></div>
          <div className="tool-grid">
            {matchingTools.map((tool) => <ToolCard key={tool.id} tool={tool} cta="none" />)}
          </div>
          <div className="cta-row">
            <Link className="btn btn-secondary" href={`/results/${encodeURIComponent(goal)}`}>
              {tr('Show my recommendation')}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
