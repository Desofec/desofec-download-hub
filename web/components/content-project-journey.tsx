'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { buildContentPortfolio, contentJourney, contentJourneyHref } from '@/lib/first-content-project';
import type { StoredProject } from '@/lib/pilot-projects';

export function ContentProjectJourney({ saved, dirty }: { saved: StoredProject; dirty: boolean }) {
  const tr = useTr();
  const project = saved.project;
  const journey = contentJourney(project);
  const portfolio = buildContentPortfolio(project, tr);
  const [reviewed, setReviewed] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  return (
    <section className="content-project-journey" aria-labelledby="guided-content-heading">
      <h3 id="guided-content-heading">{tr('Your first content-service project')}</h3>
      <p>{tr('Learn → practise → draft → test → review → hand over. These milestones use saved project records and self-recorded checklist items, not independent checks of your files. Lesson and kit progress stay separate.')}</p>
      {dirty && <p role="status">{tr('Unsaved brief or checklist changes are not included below. Save them before continuing or exporting.')}</p>}
      <div className="path-card journey-next" role="status">
        <strong>{tr('Your next guided action')}</strong>
        <p>{tr(journey.next?.action ?? 'Practice record assembled. Review the private portfolio and all unresolved issues before any manual sharing.')}</p>
        {journey.next && <Link className="btn btn-primary" href={contentJourneyHref(project, journey.next.destination)}
          onNavigate={(event) => {
            if (journey.next?.destination !== 'brief' && dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
          }}>{tr(journey.next.link)}</Link>}
      </div>
      <ol className="journey-stages">
        {journey.stages.map((stage) => (
          <li key={stage.id} data-journey-stage={stage.id} aria-current={journey.next?.id === stage.id ? 'step' : undefined}>
            <h4>{tr(stage.title)}</h4>
            <p><strong>{tr(stage.complete ? 'Recorded milestone' : 'Evidence still needed')}</strong></p>
            <p>{tr(stage.instruction)}</p>
          </li>
        ))}
      </ol>
      <details className="journey-portfolio">
        <summary>{tr('Preview private practice portfolio')}</summary>
        <p>{tr('No public portfolio page or sharing link is created. The preview is derived from your saved project and is not stored separately. Original content files stay in your own storage.')}</p>
        <pre className="project-portfolio-preview" tabIndex={0}>{portfolio}</pre>
        <label className="project-check">
          <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
          <span>{tr('I reviewed this saved portfolio for sensitive details and understand that it describes fictional practice, not verified client work.')}</span>
        </label>
        <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty} onClick={() => {
          setNotice('');
          setError('');
          try {
            downloadPilotText(portfolio, 'content-practice-portfolio.txt');
            setNotice('Practice portfolio download requested. No public page was created. Delete downloaded files separately when no longer needed.');
          } catch {
            setError('Could not download the practice portfolio. Keep this page open, copy the preview or retry.');
          }
        }}>{tr(journey.ready ? 'Download practice portfolio (.txt)' : 'Download incomplete practice draft (.txt)')}</button>
        <p role="status">{notice ? tr(notice) : ''}</p>
        {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
      </details>
    </section>
  );
}
