'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { commerceProjectTrack, loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import { buildCommercePilotPlanReport, commercePilotPlanCoverage, commercePilotRoles, commercePilotStatuses,
  emptyCommercePilotPlan, pilotRoleLabels, pilotThresholdOperatorLabels, pilotThresholdOperators, type CommercePilotPlan } from '@/lib/commerce-pilot-plan';
import type { CommercePathId } from '@/lib/commerce-readiness';

const subscribeHydration = () => () => {};
const statusLabels = {
  draft: 'Draft', 'review-required': 'Review required', paused: 'Paused'
} as const;
const thresholdFields = [
  ['metric', 'Metric and evidence source'], ['operator', 'Threshold operator'], ['threshold', 'Threshold value']
] as const;
const roleSlug = (role: string) => role.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function CommercePilotPlanner({ projectId }: { projectId: string }) {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [draft, setDraft] = useState<CommercePilotPlan | null>(null);
  const [dirty, setDirty] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const working = useRef(false);
  const track = saved ? commerceProjectTrack(saved.project.pathId) : null;
  const pathId = track ? saved!.project.pathId as CommercePathId : null;
  const query = `?project=${encodeURIComponent(projectId)}`;
  const expected = JSON.stringify(saved?.project.commercePilotPlan ?? null);
  const expectedReadiness = JSON.stringify(saved?.project.commerceReadiness ?? null);
  const coverage = draft && pathId ? commercePilotPlanCoverage(draft, pathId) : null;
  const report = saved?.project.commercePilotPlan && pathId
    ? buildCommercePilotPlanReport(saved.project.commercePilotPlan, pathId, tr, saved.project.commerceReadiness?.decision.choice) : '';

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved pilot plan changes?'));
  const display = (record: StoredProject) => {
    const nextTrack = commerceProjectTrack(record.project.pathId);
    if (!nextTrack) throw new Error('Commerce pilot plans are only available for commerce projects.');
    const plan = record.project.commercePilotPlan ?? emptyCommercePilotPlan(record.project.pathId as CommercePathId);
    setSaved(record);
    setDraft(plan);
    setDirty(false);
    setReviewed(false);
  };
  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setNotice('');
    setError('');
    void withProjectLock(action).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : 'Could not save the pilot plan. Check browser storage and retry.');
    }).finally(() => {
      working.current = false;
      setBusy(false);
    });
  };
  const change = (next: CommercePilotPlan) => {
    setDraft(next);
    setDirty(true);
    setReviewed(false);
    setNotice('');
  };
  const current = () => {
    if (!saved || !pathId) throw new Error('Reload a saved commerce project before editing.');
    const latest = loadProject(localStorage, projectId);
    if (JSON.stringify(latest.project.commercePilotPlan ?? null) !== expected) {
      throw new Error('The saved pilot plan changed. Reload before saving.');
    }
    if (JSON.stringify(latest.project.commerceReadiness ?? null) !== expectedReadiness) {
      throw new Error('Commerce readiness changed. Reload and review its decision before saving the pilot plan.');
    }
    return latest;
  };
  const save = () => {
    if (!draft || !pathId) return;
    attempt(() => {
      current();
      const next = saveProjectPart(localStorage, projectId, 'commercePilotPlan', draft, expected);
      display(next);
      setNotice('Pilot plan saved on this device. It does not authorize an experiment.');
    });
  };

  return <div className="proposal-builder commerce-pilot-planner">
    <div className="proposal-controls">
      <p>{tr('Planning only. Nothing here contacts participants, publishes listings, spends money, connects accounts, onboards sellers, holds stock or ships goods.')}</p>
      <p>{tr('Use fictional or explicitly approved non-confidential information. A budget cap is a planning limit, not permission to spend. Obtain separate informed approval before any real activity.')}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/business-launchpad/projects${query}`} onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Back to project workspace')}</Link>
        <Link className="btn btn-secondary" href={`/business-launchpad/commerce-readiness${query}`} onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Review saved commerce readiness')}</Link>
        <button type="button" className="btn btn-secondary" disabled={!hydrated || busy} onClick={() => attempt(() => {
          if (!discard()) return;
          display(loadProject(localStorage, projectId));
          setNotice('Saved project and pilot plan reloaded.');
        })}>{tr('Reload saved project and pilot plan')}</button>
        <button type="button" className="btn btn-primary" disabled={busy || !dirty || !draft} onClick={save}>
          {tr('Save pilot plan on this device')}
        </button>
      </div>
      <p role="status">{tr(busy ? 'Working...' : notice || (dirty ? 'Pilot plan edits are not saved.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
      {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    </div>
    {!saved && <p role="status">{tr('Reload a saved commerce project before editing.')}</p>}
    {saved && draft && pathId && <>
      <h2>{saved.project.title}</h2>
      <p>{tr('Pilot planner labels, validation messages and report text are in English. Navigation follows your language.')}</p>
      {saved.project.commerceReadiness && <p role="status">
        {tr('Saved readiness decision')}: {tr(saved.project.commerceReadiness.decision.choice === 'stop' ? 'Stop this direction'
          : saved.project.commerceReadiness.decision.choice === 'revise' ? 'Revise the idea or scope'
            : saved.project.commerceReadiness.decision.choice === 'continue-discovery' ? 'Continue discovery only' : 'Not decided')}.{' '}
        {tr(saved.project.commerceReadiness.decision.choice === 'stop'
          ? 'This plan cannot reverse a stop decision; use it only to design a distinct future discovery question.'
          : 'This saved decision does not authorize execution; confirm evidence and obtain separate approval before real activity.')}
      </p>}
      <form className="proposal-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <fieldset disabled={busy}>
          <legend>{tr('Bounded question, audience and method')}</legend>
          {([
            ['question', 'Question this pilot is designed to answer', 1200],
            ['hypothesis', 'Testable hypothesis, not a forecast', 1200],
            ['audience', 'Eligible audience and exclusions', 500],
            ['sampleTarget', 'Maximum participant or transaction count', 6],
            ['method', 'Step-by-step low-risk method', 2000]
          ] as const).map(([field, label, limit]) => <div className="form-group" key={field}>
            <label htmlFor={`pilot-${field}`}>{tr(label)}</label>
            {field === 'method'
              ? <textarea id={`pilot-${field}`} rows={4} maxLength={limit} value={draft[field]} onChange={(event) => change({ ...draft, [field]: event.target.value })} />
              : <input id={`pilot-${field}`} maxLength={limit} inputMode={field === 'sampleTarget' ? 'numeric' : undefined}
                value={draft[field]} onChange={(event) => change({ ...draft, [field]: event.target.value })} />}
          </div>)}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Calendar and maximum budget cap')}</legend>
          <div className="form-group">
            <label htmlFor="pilot-start">{tr('Proposed start date')}</label>
            <input id="pilot-start" type="date" value={draft.startDate} onChange={(event) => change({ ...draft, startDate: event.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="pilot-review">{tr('Human review date')}</label>
            <input id="pilot-review" type="date" value={draft.reviewDate} onChange={(event) => change({ ...draft, reviewDate: event.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="pilot-currency">{tr('Three-letter budget currency')}</label>
            <input id="pilot-currency" maxLength={3} value={draft.budgetCurrency}
              onChange={(event) => change({ ...draft, budgetCurrency: event.target.value.toUpperCase() })} />
          </div>
          <div className="form-group">
            <label htmlFor="pilot-cap">{tr('Maximum total pilot budget cap')}</label>
            <input id="pilot-cap" inputMode="decimal" maxLength={10} value={draft.budgetCap}
              onChange={(event) => change({ ...draft, budgetCap: event.target.value })} />
          </div>
          {coverage && <p role="status">{tr('Budget cap')}: {tr(coverage.budgetCapped ? 'Recorded' : 'Missing or unresolved')}. {tr('Dates')}: {tr(coverage.scheduleValid ? 'Recorded' : 'Missing or unresolved')}.</p>}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Measurable success and stop criteria')}</legend>
          <p>{tr('Use a measure, an explicit comparator and a numeric threshold. State the denominator and evidence source in the measure. A threshold describes a decision rule; it does not predict the result.')}</p>
          {(['success', 'stop'] as const).map((criterion) => <fieldset key={criterion}>
            <legend>{tr(criterion === 'success' ? 'Success criterion' : 'Stop criterion')}</legend>
            {thresholdFields.map(([field, label]) => <div className="form-group" key={field}>
              <label htmlFor={`pilot-${criterion}-${field}`}>{tr(label)}</label>
              {field === 'metric'
                ? <textarea id={`pilot-${criterion}-${field}`} rows={2} maxLength={240} value={draft[criterion].metric}
                    onChange={(event) => change({ ...draft, [criterion]: { ...draft[criterion], metric: event.target.value } })} />
                : field === 'operator'
                  ? <select id={`pilot-${criterion}-${field}`} value={draft[criterion].operator} onChange={(event) => {
                    const operator = pilotThresholdOperators.find((candidate) => candidate === event.target.value);
                    if (operator) change({ ...draft, [criterion]: { ...draft[criterion], operator } });
                  }}>{pilotThresholdOperators.map((operator) => <option key={operator} value={operator}>{tr(pilotThresholdOperatorLabels[operator])}</option>)}</select>
                  : <input id={`pilot-${criterion}-${field}`} inputMode="decimal" maxLength={10} value={draft[criterion].threshold}
                    onChange={(event) => change({ ...draft, [criterion]: { ...draft[criterion], threshold: event.target.value } })} />}
            </div>)}
          </fieldset>)}
          {coverage && <p role="status">{tr('Success and stop thresholds')}: {tr(coverage.thresholdsSet ? 'Recorded' : 'Missing or unresolved')}</p>}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Human roles and pre-activity evidence')}</legend>
          <p>{tr('Assign roles, not personal names. Each owner role needs the evidence and permission required before any proposed real activity.')}</p>
          {commercePilotRoles[pathId].map((role) => <div className="form-group" key={role}>
            <label htmlFor={`pilot-role-${roleSlug(role)}`}>{tr(pilotRoleLabels[role])}</label>
            <input id={`pilot-role-${roleSlug(role)}`} maxLength={120} value={draft.roles[role].owner}
              onChange={(event) => change({ ...draft, roles: { ...draft.roles, [role]: { ...draft.roles[role], owner: event.target.value } } })} />
            <label htmlFor={`pilot-evidence-${roleSlug(role)}`}>{tr('Evidence or approval required before activity')}</label>
            <textarea id={`pilot-evidence-${roleSlug(role)}`} rows={2} maxLength={800} value={draft.roles[role].evidence}
              onChange={(event) => change({ ...draft, roles: { ...draft.roles, [role]: { ...draft.roles[role], evidence: event.target.value } } })} />
          </div>)}
          {coverage && <p role="status">{tr('Roles and reviewer evidence')}: {tr(coverage.rolesAssigned ? 'Recorded' : 'Missing or unresolved')}</p>}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Plan status and exclusions')}</legend>
          <div className="form-group">
            <label htmlFor="pilot-status">{tr('Plan status - none means approval')}</label>
            <select id="pilot-status" value={draft.status} onChange={(event) => {
              const status = commercePilotStatuses.find((candidate) => candidate === event.target.value);
              if (status) change({ ...draft, status });
            }}>{commercePilotStatuses.map((status) => <option key={status} value={status}>{tr(statusLabels[status])}</option>)}</select>
          </div>
          <div className="form-group">
            <label htmlFor="pilot-exclusions">{tr('Out-of-scope actions, permissions and safe fallback')}</label>
            <textarea id="pilot-exclusions" rows={4} maxLength={1200} value={draft.exclusions}
              onChange={(event) => change({ ...draft, exclusions: event.target.value })} />
          </div>
          {coverage && <ul className="journey-checks" aria-label={tr('Pilot plan completeness checks')}>
            <li>{tr('Pilot question and hypothesis')}: {tr(coverage.questionDefined ? 'Recorded' : 'Missing or unresolved')}</li>
            <li>{tr('Audience, sample and method')}: {tr(coverage.boundedSample ? 'Recorded' : 'Missing or unresolved')}</li>
            <li>{tr('Exclusions and stop rules')}: {tr(coverage.exclusionsDefined ? 'Recorded' : 'Missing or unresolved')}</li>
          </ul>}
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={busy || !dirty}>{tr('Save pilot plan on this device')}</button>
      </form>
      <button type="button" className="btn btn-secondary" disabled={busy || !saved.project.commercePilotPlan} onClick={() => attempt(() => {
        if (!discard() || !window.confirm(tr('Delete the saved pilot plan from this device project? Readiness, account copies and downloads remain.'))) return;
        current();
        display(saveProjectPart(localStorage, projectId, 'commercePilotPlan', undefined, expected));
        setNotice('Saved pilot plan deleted from this device.');
      })}>{tr('Delete saved pilot plan')}</button>
      {report && <section aria-labelledby="pilot-report">
        <h2 id="pilot-report">{tr('Saved private pilot plan report')}</h2>
        <p>{tr('The report includes the proposed sample, budget cap, criteria, role assignments and exclusions. Review for sensitive details; the plan is not permission to execute.')}</p>
        <pre className="project-portfolio-preview" tabIndex={0} data-pilot-plan-report>{report}</pre>
        <label className="project-check">
          <input type="checkbox" checked={reviewed} disabled={dirty || busy} onChange={(event) => setReviewed(event.target.checked)} />
          <span>{tr('I reviewed this plan for sensitive details and understand it does not authorize an experiment.')}</span>
        </label>
        <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty || busy} onClick={() => attempt(() => {
          const currentProject = loadProject(localStorage, projectId);
          if (JSON.stringify(currentProject.project.commercePilotPlan ?? null) !== expected
            || JSON.stringify(currentProject.project.commerceReadiness ?? null) !== expectedReadiness) {
            throw new Error('Readiness or pilot plan changed. Reload and review the decision before downloading.');
          }
          downloadPilotText(report, 'private-commerce-pilot-plan.txt');
          setNotice('Pilot plan download requested. No activity was authorized or started.');
        })}>{tr('Download private pilot plan (.txt)')}</button>
      </section>}
    </>}
  </div>;
}
