'use client';

import { useState } from 'react';
import { useTr } from '@/components/tr';

const TOTAL = 36;

export function BubblePop() {
  const tr = useTr();
  const [popped, setPopped] = useState<number[]>([]);
  const done = popped.length === TOTAL;

  return (
    <div className="break-card">
      <h2>{tr('Bubble pop')}</h2>
      <p>{tr('Pop the bubbles one by one. No score, no timer, just relax.')}</p>
      <div className="bubble-grid">
        {Array.from({ length: TOTAL }, (_, index) => {
          const isPopped = popped.includes(index);
          return (
            <button
              key={index}
              type="button"
              className={`bubble${isPopped ? ' is-popped' : ''}`}
              disabled={isPopped}
              aria-label={isPopped ? tr('Popped bubble') : tr('Bubble')}
              onClick={() => setPopped((list) => [...list, index])}
            />
          );
        })}
      </div>
      <p role="status">{done ? tr('All popped. Feeling lighter?') : tr('{count} of {total} popped', { count: popped.length, total: TOTAL })}</p>
      <button className="btn btn-secondary" type="button" onClick={() => setPopped([])}>
        {tr('New sheet')}
      </button>
    </div>
  );
}
