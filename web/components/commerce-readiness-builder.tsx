'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  buildCommerceReadinessReport, commerceDecisionLabels, commerceDemandMethodLabels, commerceDemandMethods,
  commerceEconomics, commerceOptionSlots, commerceReadinessChoices, commerceReadinessCoverage, commerceResponsibilities,
  emptyCommerceReadiness, type CommercePathId, type CommerceReadiness
} from '@/lib/commerce-readiness';
import { commerceProjectTrack, loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';

const subscribeHydration = () => () => {};
const responsibilityLabels: Record<CommercePathId, string[]> = {
  'ai-online-retail': ['Sourcing and product quality', 'Store, platform and payment eligibility', 'Stock, fulfillment and delivery', 'Customer service, returns and refunds', 'Local tax, consumer and product obligations'],
  'ai-marketplace-model': ['Operator and seller roles', 'Platform and payment responsibilities', 'Seller payouts, refunds and disputes', 'Catalog moderation, rights and appeals', 'Local consumer, tax and privacy obligations'],
  'ai-logistics-services': ['Inventory custody and damaged goods', 'Facility safety, security and insurance', 'Carrier eligibility and service levels', 'Returns, claims and customer escalation', 'Data access, retention and deletion']
};
const amountFields = [
  ['price', 'Price per order'], ['productCost', 'Product or supplier cost per order'],
  ['platformFees', 'Platform and payment fees per order'], ['fulfillment', 'Fulfillment and delivery per order'],
  ['returnsSupport', 'Returns and support allowance per order'], ['otherVariable', 'Other known variable cost per order'],
  ['fixedMonthly', 'Monthly fixed costs'], ['scenarioOrders', 'Scenario monthly order count']
] as const;
const optionFields = [
  ['name', 'Provider or option name'], ['country', 'Country and currency availability'],
  ['source', 'Official source or evidence reference'], ['checkedAt', 'Date checked'],
  ['eligibility', 'Eligibility and service coverage evidence'], ['fees', 'Fees and billing basis'],
  ['limitations', 'Limitations and unresolved terms']
] as const;
export function CommerceReadinessBuilder({ projectId }: { projectId: string }) {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [draft, setDraft] = useState<CommerceReadiness | null>(null);
  const [dirty, setDirty] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const working = useRef(false);
  const track = saved ? commerceProjectTrack(saved.project.pathId) : null;
  const pathId = track ? saved!.project.pathId as CommercePathId : null;
  const query = `?project=${encodeURIComponent(projectId)}`;
  const expected = JSON.stringify(saved?.project.commerceReadiness ?? null);
  const coverage = draft && pathId ? commerceReadinessCoverage(draft, pathId) : null;
  const economics = draft ? commerceEconomics(draft) : null;
  const report = saved?.project.commerceReadiness && pathId
    ? buildCommerceReadinessReport(saved.project.commerceReadiness, pathId, tr) : '';

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved readiness changes?'));
  const display = (record: StoredProject) => {
    const nextTrack = commerceProjectTrack(record.project.pathId);
    if (!nextTrack) throw new Error('Commerce readiness is only available for commerce projects.');
    const next = record.project.commerceReadiness
      ?? emptyCommerceReadiness(record.project.pathId as CommercePathId);
    setSaved(record);
    setDraft(next);
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
      setError(cause instanceof Error ? cause.message : 'Could not save readiness. Check browser storage and retry.');
    }).finally(() => {
      working.current = false;
      setBusy(false);
    });
  };
  const change = (next: CommerceReadiness) => {
    setDraft(next);
    setDirty(true);
    setReviewed(false);
    setNotice('');
  };
  const current = () => {
    if (!saved || !pathId) throw new Error('Reload a saved commerce project before editing.');
    const latest = loadProject(localStorage, projectId);
    if (JSON.stringify(latest.project.commerceReadiness ?? null) !== expected) {
      throw new Error('Commerce readiness changed. Reload the project before saving.');
    }
    return latest;
  };
  const save = () => {
    if (!draft || !pathId) return;
    attempt(() => {
      current();
      const next = saveProjectPart(localStorage, projectId, 'commerceReadiness', draft, expected);
      display(next);
      setNotice('Commerce readiness saved on this device. No launch approval was created.');
    });
  };

  return <div className="proposal-builder commerce-readiness">
    <div className="proposal-controls">
      <p>{tr('Private practice only. Demand, provider terms, cost entries and responsibility decisions are self-reported, not independently verified. No store, seller account, payment, contract or shipment is created.')}</p>
      <p>{tr('Use fictional or approved non-confidential information. Do not enter personal data, credentials or sensitive customer records. A “continue discovery” choice is not permission to launch or accept work.')}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/business-launchpad/projects${query}`} onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Back to project workspace')}</Link>
        <button type="button" className="btn btn-secondary" disabled={!hydrated || busy} onClick={() => attempt(() => {
          if (!discard()) return;
          display(loadProject(localStorage, projectId));
          setNotice('Saved project and readiness reloaded.');
        })}>{tr('Reload saved project and readiness')}</button>
        <button type="button" className="btn btn-primary" disabled={busy || !dirty || !draft} onClick={save}>
          {tr('Save readiness on this device')}
        </button>
      </div>
      <p role="status">{tr(busy ? 'Working...' : notice || (dirty ? 'Readiness edits are not saved.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
      {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
    </div>
    {!saved && <p role="status">{tr('Reload a saved commerce project before editing.')}</p>}
    {saved && draft && pathId && <>
      <h2>{saved.project.title}</h2>
      <p>{tr('Commerce readiness form labels, validation messages and report text are in English. Navigation follows your language.')}</p>
      <form className="proposal-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <fieldset disabled={busy}>
          <legend>{tr('Customer demand evidence - distinguish observation from assumption')}</legend>
          <div className="form-group">
            <label htmlFor="readiness-method">{tr('Evidence method')}</label>
            <select id="readiness-method" value={draft.demand.method} onChange={(event) => {
              const method = commerceDemandMethods.find((value) => value === event.target.value);
              if (method) change({ ...draft, demand: { ...draft.demand, method } });
            }}>{commerceDemandMethods.map((method) => <option key={method} value={method}>{tr(commerceDemandMethodLabels[method])}</option>)}</select>
          </div>
          {([
            ['date', 'Observation date', 'date'], ['sample', 'Sample size and audience', 'text'],
            ['source', 'Source and permission', 'textarea'], ['finding', 'What was actually observed', 'textarea'],
            ['limitations', 'Limitations, contrary evidence and unknowns', 'textarea'],
            ['nextTest', 'Next low-risk validation test', 'textarea']
          ] as const).map(([field, label, type]) => <div className="form-group" key={field}>
            <label htmlFor={`demand-${field}`}>{tr(label)}</label>
            {type === 'textarea'
              ? <textarea id={`demand-${field}`} rows={3} maxLength={field === 'finding' ? 2000 : 1200} value={draft.demand[field]} onChange={(event) => change({ ...draft, demand: { ...draft.demand, [field]: event.target.value } })} />
              : <input id={`demand-${field}`} type={type} maxLength={field === 'sample' ? 300 : undefined} value={draft.demand[field]} onChange={(event) => change({ ...draft, demand: { ...draft.demand, [field]: event.target.value } })} />}
          </div>)}
          <p>{tr('Do not describe interest, survey responses or a small pilot as validated demand. Record the source, sample, date, limitations and the next test.')}</p>
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Compare two platform, supplier or service options')}</legend>
          <p>{tr('Use current official sources where possible. Record country availability, eligibility, fees, terms and unresolved responsibilities; comparison does not endorse either provider.')}</p>
          {commerceOptionSlots.map((id) => <fieldset key={id}>
            <legend>{tr(id === 'option-1' ? 'Option A' : 'Option B')}</legend>
            {optionFields.map(([field, label]) => <div className="form-group" key={field}>
              <label htmlFor={`${id}-${field}`}>{tr(label)}</label>
              {field === 'source' || field === 'eligibility' || field === 'fees' || field === 'limitations'
                ? <textarea id={`${id}-${field}`} rows={2} maxLength={1200} value={draft.options[id][field]} onChange={(event) => change({ ...draft, options: { ...draft.options, [id]: { ...draft.options[id], [field]: event.target.value } } })} />
                : <input id={`${id}-${field}`} type={field === 'checkedAt' ? 'date' : 'text'} maxLength={field === 'name' ? 120 : 80} value={draft.options[id][field]} onChange={(event) => change({ ...draft, options: { ...draft.options, [id]: { ...draft.options[id], [field]: event.target.value } } })} />}
            </div>)}
          </fieldset>)}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Cost and break-even scenario - not a forecast or profit')}</legend>
          <p>{tr('Enter values in one currency. Use known zero only when supported; leave unknown amounts blank. Calculations exclude unlisted items and do not recommend prices.')}</p>
          <div className="form-group">
            <label htmlFor="economics-currency">{tr('Three-letter currency code')}</label>
            <input id="economics-currency" type="text" maxLength={3} autoCapitalize="characters" value={draft.economics.currency}
              onChange={(event) => change({ ...draft, economics: { ...draft.economics, currency: event.target.value.toUpperCase() } })} />
          </div>
          {amountFields.map(([field, label]) => <div className="form-group" key={field}>
            <label htmlFor={`economics-${field}`}>{tr(label)}</label>
            <input id={`economics-${field}`} type="text" inputMode="decimal" maxLength={field === 'scenarioOrders' ? 6 : 10}
              value={draft.economics[field]} onChange={(event) => change({ ...draft, economics: { ...draft.economics, [field]: event.target.value } })} />
          </div>)}
          {coverage && <ul className="journey-checks" aria-label={tr('Readiness evidence coverage')}>
            <li>{tr('Demand evidence recorded')}: {tr(coverage.demandRecorded ? 'Recorded' : 'Missing or unresolved')}</li>
            <li>{tr('Two sourced options compared')}: {tr(coverage.optionsCompared ? 'Recorded' : 'Missing or unresolved')}</li>
            <li>{tr('Cost scenario calculated')}: {tr(coverage.economicsCalculated ? 'Recorded' : 'Missing or unresolved')}</li>
          </ul>}
          {economics && <p role="status">
            {tr('Contribution per order before fixed costs and unlisted items')}: {economics.currency} {(economics.contribution / 100).toFixed(2)}.{' '}
            {tr('Break-even order count from listed monthly fixed costs')}: {economics.breakEvenOrders === null
              ? tr('Not calculable: contribution is zero or negative') : economics.breakEvenOrders}.{' '}
            {tr('Scenario balance before unlisted costs and taxes')}: {economics.currency} {(economics.scenarioBalance / 100).toFixed(2)}.
          </p>}
          {!economics && <p role="status">{tr('The calculation preview appears only when all values are valid.')}</p>}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Operational responsibilities - assign roles and record evidence')}</legend>
          <p>{tr('Confirm obligations with current official sources or qualified local advisers where needed. A role assignment is not legal, tax, safety or insurance advice.')}</p>
          {commerceResponsibilities[pathId].map((id, index) => {
            const item = draft.responsibilities[id];
            return <fieldset key={id}>
              <legend>{tr(responsibilityLabels[pathId][index])}</legend>
              <div className="form-group">
                <label htmlFor={`responsibility-${id}-owner`}>{tr('Responsible role, not a person’s name')}</label>
                <input id={`responsibility-${id}-owner`} maxLength={120} value={item.owner}
                  onChange={(event) => change({ ...draft, responsibilities: { ...draft.responsibilities, [id]: { ...item, owner: event.target.value } } })} />
              </div>
              <div className="form-group">
                <label htmlFor={`responsibility-${id}-status`}>{tr('Review status')}</label>
                <select id={`responsibility-${id}-status`} value={item.status} onChange={(event) => {
                  if (event.target.value === 'unknown' || event.target.value === 'proposed' || event.target.value === 'confirmed') {
                    change({ ...draft, responsibilities: { ...draft.responsibilities, [id]: { ...item, status: event.target.value } } });
                  }
                }}>
                  {(['unknown', 'proposed', 'confirmed'] as const).map((status) => <option key={status} value={status}>{tr(status === 'unknown' ? 'Unknown' : status === 'proposed' ? 'Proposed; needs confirmation' : 'Self-reported as confirmed')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`responsibility-${id}-evidence`}>{tr('Evidence reference and unresolved question')}</label>
                <textarea id={`responsibility-${id}-evidence`} rows={2} maxLength={1200} value={item.evidence}
                  onChange={(event) => change({ ...draft, responsibilities: { ...draft.responsibilities, [id]: { ...item, evidence: event.target.value } } })} />
              </div>
            </fieldset>;
          })}
          {coverage && <p role="status">{tr('Responsibility roles reviewed')}: {tr(coverage.responsibilitiesReviewed ? 'Recorded' : 'Missing or unresolved')}</p>}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Human decision and next validation step')}</legend>
          <div className="form-group">
            <label htmlFor="readiness-decision">{tr('Decision - no option is launch approval')}</label>
            <select id="readiness-decision" value={draft.decision.choice} onChange={(event) => {
              const choice = commerceReadinessChoices.find((value) => value === event.target.value);
              if (choice) change({ ...draft, decision: { ...draft.decision, choice } });
            }}>{commerceReadinessChoices.map((choice) => <option key={choice} value={choice}>{tr(commerceDecisionLabels[choice])}</option>)}</select>
          </div>
          <div className="form-group">
            <label htmlFor="readiness-rationale">{tr('Reason, evidence gaps and dissenting signals')}</label>
            <textarea id="readiness-rationale" rows={3} maxLength={2000} value={draft.decision.rationale}
              onChange={(event) => change({ ...draft, decision: { ...draft.decision, rationale: event.target.value } })} />
          </div>
          <div className="form-group">
            <label htmlFor="readiness-next-step">{tr('Next low-risk validation step')}</label>
            <textarea id="readiness-next-step" rows={3} maxLength={1200} value={draft.decision.nextStep}
              onChange={(event) => change({ ...draft, decision: { ...draft.decision, nextStep: event.target.value } })} />
          </div>
          <p>{tr('A continue-discovery decision is not permission to launch, spend money, onboard sellers, hold stock, accept payments or ship goods.')}</p>
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={busy || !dirty}>{tr('Save readiness on this device')}</button>
      </form>
      <button type="button" className="btn btn-secondary" disabled={busy || !saved.project.commerceReadiness} onClick={() => attempt(() => {
        if (!discard() || !window.confirm(tr('Delete saved commerce readiness from this device project? Other project records, account copies and downloads remain.'))) return;
        current();
        display(saveProjectPart(localStorage, projectId, 'commerceReadiness', undefined, expected));
        setNotice('Saved commerce readiness deleted from this device.');
      })}>{tr('Delete saved readiness')}</button>
      {report && <section aria-labelledby="readiness-report">
        <h2 id="readiness-report">{tr('Saved private readiness report')}</h2>
        <p>{tr('This export includes your demand notes, provider comparison, cost scenario and role assignments. Review for sensitive information before downloading.')}</p>
        <pre className="project-portfolio-preview" tabIndex={0} data-readiness-report>{report}</pre>
        <label className="project-check">
          <input type="checkbox" checked={reviewed} disabled={dirty || busy} onChange={(event) => setReviewed(event.target.checked)} />
          <span>{tr('I reviewed the saved readiness report for sensitive details and understand it does not approve a launch.')}</span>
        </label>
        <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty || busy} onClick={() => attempt(() => {
          const currentProject = loadProject(localStorage, projectId);
          if (JSON.stringify(currentProject.project.commerceReadiness ?? null) !== expected) throw new Error('Readiness changed. Reload and review it again before downloading.');
          downloadPilotText(report, 'private-commerce-readiness-review.txt');
          setNotice('Readiness report download requested. No public page or business approval was created.');
        })}>{tr('Download private readiness report (.txt)')}</button>
        <Link className="btn btn-primary" href={`/business-launchpad/commerce-pilot-planner${query}`} onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Design a bounded commerce pilot plan')}</Link>
      </section>}
    </>}
  </div>;
}
