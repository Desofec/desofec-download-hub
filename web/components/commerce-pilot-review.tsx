'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  commerceProjectTrack, loadProject, saveProjectPart, withProjectLock, type StoredProject
} from '@/lib/pilot-projects';
import {
  buildCommercePilotReviewReport, commercePilotReviewMatchesPlan, commercePilotReviewSummary,
  commercePilotReviewDecisions, emptyCommercePilotReview, readCommercePilotReview,
  type CommercePilotReview
} from '@/lib/commerce-pilot-review';
import type { CommercePathId } from '@/lib/commerce-readiness';

const subscribeHydration = () => () => {};
const decisionLabels = {
  'not-decided': 'Not decided', stop: 'Stop', revise: 'Revise', explore: 'Explore further'
} as const;
const amountFields = [
  ['sampleCompleted', 'Number of aggregate responses or transactions reviewed', 'numeric'],
  ['successObserved', 'Observed aggregate value for the success criterion', 'decimal'],
  ['stopObserved', 'Observed aggregate value for the stop criterion', 'decimal'],
  ['actualSpend', 'Total actual spend in the planned currency', 'decimal']
] as const;
const textFields = [
  ['evidenceSummary', 'Aggregate evidence source, method and limitations', 1600],
  ['unexpectedFindings', 'Unexpected findings or adverse signals', 1600],
  ['learning', 'What was learned and what remains uncertain', 1600],
  ['rationale', 'Why the human reviewer chose this decision', 1600],
  ['nextQuestion', 'Next discovery question, if any', 1200]
] as const;

export function CommercePilotReviewEditor({ projectId }: { projectId: string }) {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [draft, setDraft] = useState<CommercePilotReview | null>(null);
  const [dirty, setDirty] = useState(false);
  const [aggregateConfirmed, setAggregateConfirmed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const working = useRef(false);
  const pathId = saved && commerceProjectTrack(saved.project.pathId)
    ? saved.project.pathId as CommercePathId : null;
  const plan = saved?.project.commercePilotPlan;
  const expectedReview = JSON.stringify(saved?.project.commercePilotReview ?? null);
  const expectedPlan = JSON.stringify(plan ?? null);
  const summary = draft ? commercePilotReviewSummary(draft) : null;
  const currentReview = Boolean(draft && plan && commercePilotReviewMatchesPlan(draft, plan));
  let report = '';
  let reportError = '';
  if (draft && pathId) {
    try {
      report = buildCommercePilotReviewReport(draft, pathId, tr);
    } catch (cause) {
      reportError = cause instanceof Error ? cause.message : 'Correct invalid review values before saving or exporting.';
    }
  }

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved commerce results review changes?'));
  const display = (record: StoredProject) => {
    if (!commerceProjectTrack(record.project.pathId)) throw new Error('Commerce pilot reviews are only available for commerce projects.');
    const savedPlan = record.project.commercePilotPlan;
    if (!savedPlan) throw new Error('Save a commerce pilot plan before recording its results.');
    const review = record.project.commercePilotReview
      ? readCommercePilotReview(record.project.commercePilotReview, record.project.pathId as CommercePathId)
      : emptyCommercePilotReview(savedPlan);
    setSaved(record);
    setDraft(review);
    setDirty(false);
    setAggregateConfirmed(false);
    setReviewed(false);
  };
  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setNotice('');
    setError('');
    void withProjectLock(action).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : 'Could not save this review. Check browser storage and retry.');
    }).finally(() => {
      working.current = false;
      setBusy(false);
    });
  };
  const change = (next: CommercePilotReview) => {
    setDraft(next);
    setDirty(true);
    setAggregateConfirmed(false);
    setReviewed(false);
    setNotice('');
    setError('');
  };
  const current = () => {
    if (!saved || !pathId || !plan) throw new Error('Reload a saved commerce project and plan before recording results.');
    const latest = loadProject(localStorage, projectId);
    if (JSON.stringify(latest.project.commercePilotPlan ?? null) !== expectedPlan) {
      throw new Error('The saved pilot plan changed. Reload and start a review against the current plan.');
    }
    if (JSON.stringify(latest.project.commercePilotReview ?? null) !== expectedReview) {
      throw new Error('The saved results review changed. Reload it before saving.');
    }
    return latest;
  };
  const save = () => {
    if (!draft || !plan || !pathId || !aggregateConfirmed) return;
    attempt(() => {
      current();
      const valid = readCommercePilotReview(draft, pathId);
      if (!commercePilotReviewMatchesPlan(valid, plan)) {
        throw new Error('This review is based on an older plan. Start a new review against the saved plan before saving.');
      }
      display(saveProjectPart(localStorage, projectId, 'commercePilotReview', valid, expectedReview));
      setNotice('Results review saved on this device. It records observations and does not authorize further activity.');
    });
  };
  const startNewReview = () => {
    if (!saved?.project.commercePilotPlan || !discard()) return;
    if (saved.project.commercePilotReview
      && !window.confirm(tr('Start a new review from the current plan? The saved review remains until you explicitly save its replacement.'))) return;
    change(emptyCommercePilotReview(saved.project.commercePilotPlan));
    setNotice('A new unsaved review has been started from the current plan.');
  };

  return <div className="proposal-builder commerce-pilot-review">
    <div className="proposal-controls">
      <p>{tr('Record aggregate outcomes only. Do not enter participant names, contact details, individual responses or personal data. This worksheet is manual and private; it does not contact people, spend money or authorize next steps.')}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/business-launchpad/commerce-pilot-planner?project=${encodeURIComponent(projectId)}`}
          onNavigate={(event) => { if (!discard()) event.preventDefault(); }}>{tr('Review saved commerce pilot plan')}</Link>
        <Link className="btn btn-secondary" href={`/business-launchpad/projects?project=${encodeURIComponent(projectId)}`}
          onNavigate={(event) => { if (!discard()) event.preventDefault(); }}>{tr('Back to project workspace')}</Link>
        <button type="button" className="btn btn-secondary" disabled={!hydrated || busy} onClick={() => attempt(() => {
          if (!discard()) return;
          display(loadProject(localStorage, projectId));
          setNotice('Saved project, plan and results review reloaded.');
        })}>{tr('Reload saved project and review')}</button>
        {saved?.project.commercePilotPlan && <button type="button" className="btn btn-secondary" disabled={busy}
          onClick={startNewReview}>{tr('Start new review from current plan')}</button>}
        <button type="button" className="btn btn-primary" disabled={busy || !dirty || !draft || !currentReview || !aggregateConfirmed || Boolean(reportError)} onClick={save}>
          {tr('Save results review on this device')}
        </button>
      </div>
      <p role="status">{tr(notice || (dirty ? 'Review edits are not saved.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
      {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    </div>
    {!saved && <p role="status">{tr('Reload a saved commerce project and pilot plan before recording results.')}</p>}
    {saved && !plan && <p role="status">{tr('Save a commerce pilot plan before recording its results.')}</p>}
    {saved && plan && draft && summary && <>
      <h2>{saved.project.title}</h2>
      {!currentReview && <p role="alert" className="proposal-error">
        {tr('This saved review is based on a different pilot plan. Its recorded results remain visible, but cannot be changed or saved against the new plan. Start a new review to replace it explicitly.')}
      </p>}
      <section aria-labelledby="results-review-plan">
        <h2 id="results-review-plan">{tr('Plan criteria being reviewed')}</h2>
        <p><strong>{tr('Question')}:</strong> {draft.planSnapshot.question || tr('[TO CONFIRM]')}</p>
        <p><strong>{tr('Success criterion')}:</strong> {draft.planSnapshot.success.metric || tr('[TO CONFIRM]')} — {tr(draft.planSnapshot.success.operator === 'at-least' ? 'At least' : draft.planSnapshot.success.operator === 'at-most' ? 'At most' : 'Exactly')} {draft.planSnapshot.success.threshold || tr('[TO CONFIRM]')}</p>
        <p><strong>{tr('Stop criterion')}:</strong> {draft.planSnapshot.stop.metric || tr('[TO CONFIRM]')} — {tr(draft.planSnapshot.stop.operator === 'at-least' ? 'At least' : draft.planSnapshot.stop.operator === 'at-most' ? 'At most' : 'Exactly')} {draft.planSnapshot.stop.threshold || tr('[TO CONFIRM]')}</p>
        <p>{tr('Comparisons use only the aggregate values you enter. They do not select a decision. A human reviewer must consider evidence quality, uncertainty, safety and permissions.')}</p>
      </section>
      <fieldset disabled={busy || !currentReview}>
        <legend>{tr('Aggregate observations')}</legend>
        <div className="form-group">
          <label htmlFor="review-date">{tr('Human review date')}</label>
          <input id="review-date" type="date" value={draft.reviewDate}
            onChange={(event) => change({ ...draft, reviewDate: event.target.value })} />
        </div>
        {amountFields.map(([field, label, inputMode]) => <div className="form-group" key={field}>
          <label htmlFor={`review-${field}`}>{tr(label)}</label>
          <input id={`review-${field}`} inputMode={inputMode} maxLength={field === 'sampleCompleted' ? 6 : 10} value={draft[field]}
            onChange={(event) => change({ ...draft, [field]: event.target.value })} />
        </div>)}
        <p>{tr('Use the same units as each criterion and the planned sample/budget. Blank means not recorded; enter 0 only for a measured zero. Overshooting a sample or budget is shown, never hidden.')}</p>
        <label htmlFor="review-evidenceSummary">{tr(textFields[0][1])}</label>
        <textarea id="review-evidenceSummary" rows={3} maxLength={1600} value={draft.evidenceSummary}
          onChange={(event) => change({ ...draft, evidenceSummary: event.target.value })} />
        <label htmlFor="review-unexpectedFindings">{tr(textFields[1][1])}</label>
        <textarea id="review-unexpectedFindings" rows={3} maxLength={1600} value={draft.unexpectedFindings}
          onChange={(event) => change({ ...draft, unexpectedFindings: event.target.value })} />
        <label htmlFor="review-learning">{tr(textFields[2][1])}</label>
        <textarea id="review-learning" rows={3} maxLength={1600} value={draft.learning}
          onChange={(event) => change({ ...draft, learning: event.target.value })} />
        <label className="project-check">
          <input type="checkbox" checked={aggregateConfirmed} disabled={busy || !currentReview}
            onChange={(event) => setAggregateConfirmed(event.target.checked)} />
          <span>{tr('I confirm this review contains aggregate observations only and no participant-level or personal data.')}</span>
        </label>
      </fieldset>
      <section aria-labelledby="review-comparisons">
        <h2 id="review-comparisons">{tr('Recorded comparisons (not an automatic decision)')}</h2>
        <ul className="journey-checks">
          <li>{tr('Success threshold')}: {tr(summary.successMet === null ? 'Not recorded' : summary.successMet ? 'Met' : 'Not met')}</li>
          <li>{tr('Stop threshold')}: {tr(summary.stopTriggered === null ? 'Not recorded' : summary.stopTriggered ? 'Triggered' : 'Not triggered')}</li>
          <li>{tr('Completed sample')}: {tr(summary.sampleWithinPlan === null ? 'Not recorded' : summary.sampleWithinPlan ? 'Within planned maximum' : 'Above planned maximum')}</li>
          <li>{tr('Actual spend')}: {tr(summary.budgetWithinPlan === null ? 'Not recorded' : summary.budgetWithinPlan ? 'Within planned cap' : 'Above planned cap')}</li>
        </ul>
        {summary.stopTriggered === true && <p role="alert" className="proposal-error">
          {tr('The planned stop threshold was triggered. Keep activity paused; this review cannot authorize a different action.')}
        </p>}
        {summary.budgetWithinPlan === false && <p role="alert" className="proposal-error">
          {tr('Recorded spend exceeds the planned cap. Keep activity paused and document the variance with an authorised reviewer.')}
        </p>}
        {summary.sampleWithinPlan === false && <p role="alert" className="proposal-error">
          {tr('The recorded sample exceeds the planned maximum. Document the variance; do not treat the original bound as met.')}
        </p>}
        {(!summary.planHasBoundedSample || !summary.planHasBudgetCap
          || !summary.planHasSuccessCriterion || !summary.planHasStopCriterion) && <p role="status">
          {tr('The saved plan has incomplete criteria or bounds. Record the gaps; do not treat this comparison as evidence that the pilot was safe or successful.')}
        </p>}
      </section>
      <fieldset disabled={busy || !currentReview}>
        <legend>{tr('Human learning decision')}</legend>
        <div className="form-group">
          <label htmlFor="review-decision">{tr('Recorded decision: stop, revise or explore further')}</label>
          <select id="review-decision" value={draft.decision} onChange={(event) => {
            const decision = commercePilotReviewDecisions.find((candidate) => candidate === event.target.value);
            if (decision) change({ ...draft, decision });
          }}>{commercePilotReviewDecisions.map((decision) => <option key={decision} value={decision}>{tr(decisionLabels[decision])}</option>)}</select>
        </div>
        {textFields.slice(3).map(([field, label]) => <div className="form-group" key={field}>
          <label htmlFor={`review-${field}`}>{tr(label)}</label>
          <textarea id={`review-${field}`} rows={3} maxLength={field === 'nextQuestion' ? 1200 : 1600}
            value={draft[field]} onChange={(event) => change({ ...draft, [field]: event.target.value })} />
        </div>)}
        {draft.decision !== 'not-decided' && !draft.rationale.trim() && <p role="status">{tr('Record a reasoned human rationale for the selected decision.')}</p>}
      </fieldset>
      <section aria-labelledby="review-report">
        <h2 id="review-report">{tr('Private results and learning report')}</h2>
        <p>{tr('Review the aggregate report for sensitive information before downloading. It captures the current draft; save the review first.')}</p>
        {reportError && <p role="alert" className="proposal-error">{tr(reportError)}</p>}
        <pre className="project-portfolio-preview" tabIndex={0} data-commerce-review-report>{report}</pre>
        <label className="project-check">
          <input type="checkbox" checked={reviewed} disabled={dirty || busy || !saved.project.commercePilotReview || !currentReview}
            onChange={(event) => setReviewed(event.target.checked)} />
          <span>{tr('I reviewed the saved aggregate report for personal data and understand it does not authorize further activity.')}</span>
        </label>
        <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty || busy || !currentReview || !report}
          onClick={() => attempt(() => {
            const latest = current();
            if (!latest.project.commercePilotReview
              || !commercePilotReviewMatchesPlan(latest.project.commercePilotReview, latest.project.commercePilotPlan!)) {
              throw new Error('Save a current results review against the saved plan before downloading.');
            }
            downloadPilotText(report, 'private-commerce-pilot-review.txt');
            setNotice('Private review download requested. No further activity was authorized.');
          })}>{tr('Download private results review (.txt)')}</button>
      </section>
    </>}
  </div>;
}
