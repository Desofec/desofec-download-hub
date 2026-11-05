'use client';

import { useLanguage } from '@/components/language';
import { useTr } from '@/components/tr';
import type { Tool } from '@/lib/types';

export function ToolFreshness({ tool, details = false }: { tool: Tool; details?: boolean }) {
  const tr = useTr();
  const language = useLanguage();
  const review = tool.review;

  if (!review) {
    return <p className="planner-note">{tr('Description review not recorded. Check the official site for current details.')}</p>;
  }

  const date = new Intl.DateTimeFormat(language, {
    dateStyle: 'medium', timeZone: 'UTC'
  }).format(new Date(`${review.reviewedOn}T00:00:00Z`));

  return (
    <div className="planner-note">
      <p>{tr('Description reviewed:')} <time dateTime={review.reviewedOn}>{date}</time></p>
      {details && (
        <>
          <p>{tr('Based on indexed official documentation, not a live link check. Prices and features can change.')}</p>
          <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
            {tr('Review source')}<span className="sr-only">{` — ${tool.name}`}</span>
          </a>
        </>
      )}
    </div>
  );
}
