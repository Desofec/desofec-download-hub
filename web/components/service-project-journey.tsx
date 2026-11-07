'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { projectJourneyHref } from '@/lib/first-content-project';
import { buildServicePortfolio, serviceJourneyCoverage, serviceJourneyDefinition, serviceProjectJourney } from '@/lib/service-project-journeys';
import { commerceProjectTrack, type StoredProject } from '@/lib/pilot-projects';
import { commerceReadinessCoverage, type CommercePathId } from '@/lib/commerce-readiness';

export function ServiceProjectJourney({ saved, dirty }: { saved: StoredProject; dirty: boolean }) {
  const tr = useTr();
  const project = saved.project;
  const definition = serviceJourneyDefinition(project.pathId, project.automationScenario);
  const journey = serviceProjectJourney(project);
  const coverage = serviceJourneyCoverage(project);
  const commerceTrack = commerceProjectTrack(project.pathId);
  const readiness = commerceTrack && project.commerceReadiness
    ? commerceReadinessCoverage(project.commerceReadiness, project.pathId as CommercePathId) : null;
  const portfolio = buildServicePortfolio(project, tr);
  const [reviewed, setReviewed] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  return (
    <section className="service-project-journey" aria-labelledby="guided-service-heading">
      <h3 id="guided-service-heading">{tr(definition?.title ?? 'Your first content-service project')}</h3>
      <p>{tr('Learn → practise → draft → test → review → hand over. These milestones use saved project records and self-recorded checklist items, not independent checks of your files. Lesson and kit progress stay separate.')}</p>
      {definition && <p className="path-card">{tr(definition.boundary)}</p>}
      {commerceProjectTrack(project.pathId) && <p>{tr('Commerce project instructions, workbook starters and required checks are English. Navigation follows your language. Save selected fictional lab observations manually; no files are uploaded or evidence automatically approved.')}</p>}
      {commerceTrack && <section className="path-card" aria-labelledby="commerce-readiness-stage">
        <h4 id="commerce-readiness-stage">{tr('Commerce validation and launch readiness')}</h4>
        <p>{tr('Record real demand evidence, compare two current provider options, calculate a bounded cost scenario, and assign operational responsibilities before deciding what to test next. This checklist never approves launch.')}</p>
        {readiness && <ul className="journey-checks" aria-label={tr('Readiness evidence coverage')}>
          <li>{tr('Demand evidence recorded')}: {tr(readiness.demandRecorded ? 'Recorded' : 'Missing or unresolved')}</li>
          <li>{tr('Two sourced options compared')}: {tr(readiness.optionsCompared ? 'Recorded' : 'Missing or unresolved')}</li>
          <li>{tr('Cost scenario calculated')}: {tr(readiness.economicsCalculated ? 'Recorded' : 'Missing or unresolved')}</li>
          <li>{tr('Responsibility roles reviewed')}: {tr(readiness.responsibilitiesReviewed ? 'Recorded' : 'Missing or unresolved')}</li>
        </ul>}
        <Link className="btn btn-secondary" href={`/business-launchpad/commerce-readiness?project=${encodeURIComponent(project.id)}`}
          onNavigate={(event) => {
            if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
          }}>{tr(readiness ? 'Continue commerce readiness review' : 'Start commerce validation and readiness')}</Link>
        {project.commercePilotPlan && <p>{tr('A bounded pilot plan is saved for this project. Review its cap, criteria, roles and review date separately; it never authorizes activity.')}</p>}
        <Link className="btn btn-secondary" href={`/business-launchpad/commerce-pilot-planner?project=${encodeURIComponent(project.id)}`}
          onNavigate={(event) => {
            if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
          }}>{tr(project.commercePilotPlan ? 'Review saved commerce pilot plan' : 'Design a bounded commerce pilot plan')}</Link>
      </section>}
      <Link className="btn btn-secondary" href={`/business-launchpad/client-discovery?project=${encodeURIComponent(project.id)}`}
        onNavigate={(event) => {
          if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
        }}>{tr('Open client discovery and scoping')}</Link>
      <Link className="btn btn-secondary" href={`/business-launchpad/case-study-builder?project=${encodeURIComponent(project.id)}`}
        onNavigate={(event) => {
          if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
        }}>{tr('Build a freelance case study')}</Link>
      <Link className="btn btn-secondary" href={`/business-launchpad/review-centre?project=${encodeURIComponent(project.id)}`}
        onNavigate={(event) => {
          if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
        }}>{tr('Open project review centre')}</Link>
      <p>{tr('Draft your practice materials in the project workbook. Saving text or linking a revision does not verify deliverables, fill test evidence or complete a milestone.')}</p>
      <Link className="btn btn-secondary" href={`/business-launchpad/evidence-workbook?project=${encodeURIComponent(project.id)}`}
        onNavigate={(event) => {
          if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault();
        }}>{tr('Open private evidence workbook')}</Link>
      {dirty && <p role="status">{tr('Unsaved brief or checklist changes are not included below. Save them before continuing or exporting.')}</p>}
      <div className="path-card journey-next" role="status">
        <strong>{tr('Your next guided action')}</strong>
        <p>{tr(journey.next?.action ?? 'Practice record assembled. Review the private portfolio and all unresolved issues before any manual sharing.')}</p>
        {journey.next && <Link className="btn btn-primary" href={projectJourneyHref(project, journey.next.destination)}
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
            {stage.id === 'test' && coverage.length > 0 && <>
              <p>{tr('Required service checks: every bracketed code needs one case with recorded evidence. Keep codes when translating or renaming tests; duplicates and unsupported passes do not count. Existing saved cases are never rewritten automatically.')}</p>
              <ul className="journey-checks">
                {coverage.map((check) => (
                  <li key={check.code} data-journey-check={check.code}>
                    <strong>[{check.code}] {tr(check.label)}</strong>: {tr(check.recorded ? 'Recorded milestone' : 'Evidence still needed')}
                  </li>
                ))}
              </ul>
            </>}
          </li>
        ))}
      </ol>
      <details className="journey-portfolio">
        <summary>{tr('Preview private practice portfolio')}</summary>
        <p>{tr('No public portfolio page or sharing link is created. The preview is derived from your saved project and is not stored separately. Original project files stay in your own storage.')}</p>
        <pre className="project-portfolio-preview" tabIndex={0}>{portfolio}</pre>
        <label className="project-check">
          <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
          <span>{tr('I reviewed this saved portfolio for sensitive details and understand that it describes fictional practice, not verified client work.')}</span>
        </label>
        <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty} onClick={() => {
          setNotice('');
          setError('');
          try {
            downloadPilotText(portfolio, definition ? `${project.pathId}-practice-portfolio.txt` : 'content-practice-portfolio.txt');
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
