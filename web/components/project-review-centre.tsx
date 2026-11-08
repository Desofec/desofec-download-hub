'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { commerceProjectTrack, loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  buildReviewHandover, checksForService, emptyReviewChecks, emptyReviewCentre,
  reviewStatuses, reviewStatusLabels, saveTextReview, textReviewState, type ReviewCheck
} from '@/lib/project-review';

const subscribeHydration = () => () => {};

export function ProjectReviewCentre({ projectId }: { projectId?: string }) {
  const tr = useTr();
  const ready = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [itemId, setItemId] = useState('');
  const [number, setNumber] = useState(1);
  const [checks, setChecks] = useState<ReviewCheck[]>(emptyReviewChecks);
  const [dirty, setDirty] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const working = useRef(false);
  const query = projectId === undefined ? '' : `?project=${encodeURIComponent(projectId)}`;
  const definitions = saved ? checksForService(saved.project.pathId, saved.project.automationScenario) : [];
  const items = saved?.project.workbook?.items ?? [];
  const item = items.find((entry) => entry.id === itemId);
  const source = item?.revisions.find((entry) => entry.number === number);
  const centre = saved?.project.reviewCentre ?? emptyReviewCentre;
  const expected = JSON.stringify(saved?.project.reviewCentre ?? null);
  const pack = saved && selected.length ? buildReviewHandover(saved.project, selected, tr) : '';

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const discard = () => !dirty || window.confirm(tr('Discard unsaved review observations and correction tasks?'));
  const choose = (record: StoredProject, id: string, revision: number) => {
    const text = record.project.workbook?.items.find((item) => item.id === id)?.revisions.find((entry) => entry.number === revision);
    const review = record.project.reviewCentre?.reviews.find((review) => review.itemId === id);
    setSaved(record);
    setItemId(text ? id : '');
    setNumber(revision);
    setChecks(review && JSON.stringify(review.source) === JSON.stringify(text) ? review.checks : emptyReviewChecks(record.project.pathId));
    setDirty(false);
    setSelected([]);
    setConsent(false);
  };
  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    void withProjectLock(action).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : 'Could not save project data. Check browser storage and retry.');
    }).finally(() => { working.current = false; setBusy(false); });
  };
  const current = () => {
    if (!saved || projectId === undefined) throw new Error('Reload the saved project before reviewing.');
    const record = loadProject(localStorage, projectId);
    if (JSON.stringify(record.project.reviewCentre ?? null) !== expected) throw new Error('This project draft changed. Reload the project draft before replacing it.');
    return record;
  };
  const edit = (index: number, patch: Partial<ReviewCheck>) => {
    setChecks((checks) => checks.map((check, at) => at === index ? { ...check, ...patch } : check));
    setDirty(true);
    setConsent(false);
    setNotice('');
  };
  return (
    <div className="proposal-builder project-review-centre">
      <div className="proposal-controls">
        <p>{tr('Self-review only. Record your own observations; the app does not inspect external files, verify quality or grant client approval. Use fictional or anonymised practice material.')}</p>
        <p>{tr('Save explicitly. Each text item keeps one saved review; replacing it requires confirmation. Reviews retain a copy of the reviewed text even if the workbook item is deleted. Account upload includes reviews and copied text only after workspace consent.')}</p>
        <div className="cta-row">
          <a className="btn btn-secondary" href="/business-launchpad/feedback-guide" onClick={(event) => { if (!discard()) event.preventDefault(); }}>{tr('Open practice feedback guide')}</a>
          <a className="btn btn-secondary" href={`/business-launchpad/projects${query}`}>{tr('Back to project')}</a>
          <a className="btn btn-secondary" href={`/business-launchpad/evidence-workbook${query}`}>{tr('Open private evidence workbook')}</a>
          <a className="btn btn-secondary" href={`/business-launchpad/results-tracker${query}`}>{tr('Track pilot tests and results')}</a>
          <button className="btn btn-primary" type="button" disabled={!ready || busy || projectId === undefined} onClick={() => attempt(() => {
            if (!discard() || projectId === undefined) return;
            const record = loadProject(localStorage, projectId);
            choose(record, itemId, number);
            setNotice('Saved project and reviews reloaded.');
          })}>{tr('Reload saved project and reviews')}</button>
        </div>
        {projectId === undefined && <p role="alert">{tr('Open a saved service project in the workspace, then choose Open project review centre.')}</p>}
        <p role="status">{tr(busy ? 'Working...' : notice || (dirty ? 'Review edits are not saved. The handover preview uses saved reviews only.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
        {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
      </div>
      {saved && <>
        <h2>{saved.project.title}</h2>
        {saved.project.pathId === 'ai-content-services' && <p>{tr('Bakery review instructions follow your language; saved drafts, observations and correction evidence are not automatically translated. Missing real owner approval stays blocked. A self-checked item is not permission to publish.')}</p>}
        {commerceProjectTrack(saved.project.pathId) && <p>{tr('Commerce project instructions, workbook starters and required checks are English. Navigation follows your language. Save selected fictional lab observations manually; no files are uploaded or evidence automatically approved.')}</p>}
        {!items.length && <p>{tr('Save practice text in the workbook first, then reload this review centre.')}</p>}
        <div className="form-group">
          <label htmlFor="review-item">{tr('Saved text item')}</label>
          <select id="review-item" value={itemId} disabled={busy} onChange={(event) => {
            if (!discard()) return;
            const id = event.target.value;
            choose(saved, id, items.find((item) => item.id === id)?.revisions.at(-1)?.number ?? 1);
          }}>
            <option value="">{tr('Choose saved text to review')}</option>
            {items.map((item) => <option key={item.id} value={item.id}>{item.revisions.at(-1)?.title}</option>)}
          </select>
        </div>
        {source && <form className="proposal-form" onSubmit={(event) => {
          event.preventDefault();
          attempt(() => {
            const record = current();
            const next = saveTextReview(record.project, itemId, source, checks, new Date().toISOString());
            if (centre.reviews.some((review) => review.itemId === itemId)
              && !window.confirm(tr('Replace the saved review for this item? Its previous feedback and copied text will be removed from this device review centre. Workbook revisions, tests, account copies and downloads remain.'))) return;
            choose(saveProjectPart(localStorage, record.project.id, 'reviewCentre', next, expected), itemId, number);
            setNotice('Self-review saved on this device. Text, test outcomes and milestones are unchanged.');
          });
        }}>
          <div className="form-group">
            <label htmlFor="review-revision">{tr('Saved revision')}</label>
            <select id="review-revision" value={number} disabled={busy} onChange={(event) => {
              if (!discard()) return;
              choose(saved, itemId, Number(event.target.value));
            }}>
              {item?.revisions.map((revision) => <option key={revision.number} value={revision.number}>{revision.number} - {revision.savedAt}</option>)}
            </select>
          </div>
          <p>{tr('A different revision starts with unreviewed checks. Saving a newer draft never marks feedback or corrections complete.')}</p>
          <h3>{source.title}</h3>
          <pre className="project-portfolio-preview" tabIndex={0} data-review-source>{source.body}</pre>
          <p>{tr('For every non-pending check, add observations. Needs correction also requires a task. Mark a task addressed only with written correction evidence; this does not change the review status or any test outcome.')}</p>
          {checks.map((check, index) => <fieldset key={check.id} disabled={busy}>
            <legend>{tr(definitions[index].label)}</legend>
            <p>{tr(definitions[index].instruction)}</p>
            <div className="form-group">
              <label htmlFor={`review-${check.id}-status`}>{tr('Self-review status')}</label>
              <select id={`review-${check.id}-status`} value={check.status} onChange={(event) => {
                const status = reviewStatuses.find((status) => status === event.target.value);
                if (status) edit(index, { status, ...(status === 'needs-work' ? {} : { done: false }) });
              }}>{reviewStatuses.map((status) => <option key={status} value={status}>{tr(reviewStatusLabels[status])}</option>)}</select>
            </div>
            {(['notes', 'task', 'resolution'] as const).map((key) => <div className="form-group" key={key}>
              <label htmlFor={`review-${check.id}-${key}`}>{tr({ notes: 'Review observations', task: 'Correction task', resolution: 'Correction evidence' }[key])}</label>
              <textarea id={`review-${check.id}-${key}`} rows={3} maxLength={2000} value={check[key]}
                required={key === 'notes' ? check.status !== 'pending' : key === 'task' ? check.status === 'needs-work' || check.done : check.done}
                onChange={(event) => edit(index, { [key]: event.target.value })} />
            </div>)}
            <label className="project-check">
              <input type="checkbox" checked={check.done} disabled={check.status !== 'needs-work' || !check.task.trim() || !check.resolution.trim()}
                onChange={(event) => edit(index, { done: event.target.checked })} />
              <span>{tr('I recorded this correction as addressed, with evidence above. This is my statement, not verification.')}</span>
            </label>
          </fieldset>)}
          <button type="submit" className="btn btn-primary" disabled={busy || !dirty}>{tr('Save self-review on device')}</button>
        </form>}
        <section aria-labelledby="saved-project-reviews">
          <h3 id="saved-project-reviews">{tr('Saved reviews and unresolved corrections')}</h3>
          {!centre.reviews.length && <p>{tr('No saved reviews yet.')}</p>}
          {centre.reviews.map((review) => <article className="path-card" key={review.itemId}>
            <h4>{review.itemId}: {review.source.title} - {tr('Saved revision')}: {review.source.number}</h4>
            <p>{tr(textReviewState(saved.project, review))}</p>
            <p>{tr('Review saved at')}: {review.savedAt}</p>
            {review.checks.map((check, index) => <div key={check.id}>
              <strong>{tr(definitions[index]?.label ?? check.id)}: {tr(reviewStatusLabels[check.status])}</strong>
              <p className="project-portfolio-preview">{check.notes || tr('[TO CONFIRM]')}</p>
              {check.task.trim() && <>
                <p className="project-portfolio-preview">{tr('Correction task')}: {check.task}</p>
                <p className="project-portfolio-preview">{tr('Correction evidence')}: {check.resolution || tr('[TO CONFIRM]')}</p>
                <p>{tr(check.done ? 'Correction self-recorded as addressed; not independently verified.' : 'Correction not recorded as addressed.')}</p>
              </>}
            </div>)}
            <label className="project-check">
              <input type="checkbox" disabled={busy || dirty} checked={selected.includes(review.itemId)} onChange={(event) => {
                setSelected((selected) => event.target.checked ? [...selected, review.itemId] : selected.filter((id) => id !== review.itemId));
                setConsent(false);
              }} />
              <span>{tr('Include this reviewed revision and its feedback in the private handover pack')}</span>
            </label>
            <button type="button" className="btn btn-secondary" disabled={busy || dirty} onClick={() => attempt(() => {
              const record = current();
              if (!window.confirm(tr('Delete this saved review and its copied text on this device? Workbook revisions, tests, account snapshots and downloaded packs remain.'))) return;
              const next = { version: 1 as const, reviews: (record.project.reviewCentre ?? emptyReviewCentre).reviews.filter((entry) => entry.itemId !== review.itemId) };
              choose(saveProjectPart(localStorage, record.project.id, 'reviewCentre', next, expected), itemId, number);
              setNotice('Saved review deleted on this device. Workbook text, tests, account copies and downloads remain.');
            })}>{tr('Delete saved review')}</button>
          </article>)}
        </section>
        <details className="journey-portfolio">
          <summary>{tr('Review private handover pack before download')}</summary>
          <p>{tr('Choose saved reviews above. The pack contains their copied text and feedback, even for older or deleted workbook revisions, plus saved test names/outcomes and unresolved next actions. It omits unselected drafts, raw test evidence and structured costs. Review sensitive details before sharing manually.')}</p>
          <pre className="project-portfolio-preview" tabIndex={0} data-review-export>{pack}</pre>
          <label className="project-check">
            <input type="checkbox" checked={consent} disabled={busy || dirty || !selected.length} onChange={(event) => setConsent(event.target.checked)} />
            <span>{tr('I reviewed the selected copied text, feedback and next actions for sensitive details. Download privately; do not publish.')}</span>
          </label>
          <button type="button" className="btn btn-secondary" disabled={busy || dirty || !consent || !selected.length} onClick={() => attempt(() => {
            const record = current();
            if (record.revision !== saved.revision) throw new Error('Project changed in another tab. Reload it before saving.');
            downloadPilotText(pack, 'private-content-review-handover.txt');
            setNotice('Private handover download requested. No work was published or approved.');
          })}>{tr('Download private handover pack (.txt)')}</button>
        </details>
      </>}
    </div>
  );
}
