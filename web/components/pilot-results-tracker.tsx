'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/language';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { formatPilotMoney } from '@/lib/pilot-numbers';
import {
  buildPilotResultsReport, effectiveTestStatus, emptyPilotResults, emptyPilotTest,
  formatPilotMinutes, isPilotDecision, isResultStatus, maxPilotTests, pilotDecisions,
  readPilotResults, resultDecisionFields, resultMetricFields, resultMetrics,
  resultNoteFields, resultsStorageKey, resultsTextLimit, resultStatuses,
  resultTestFields, resultTestSummary, starterPilotTests, testHasEvidence,
  type PilotResults, type PilotTest
} from '@/lib/pilot-results';

function ResultsText({
  id, label, rows, value, onChange
}: { id: string; label: string; rows: number; value: string; onChange: (value: string) => void }) {
  const tr = useTr();
  return (
    <div className="form-group">
      <label htmlFor={id}>{tr(label)}</label>
      <textarea id={id} rows={rows} maxLength={resultsTextLimit} value={value}
        onChange={(event) => onChange(event.target.value)} autoComplete="off" spellCheck={false} />
    </div>
  );
}

export function PilotResultsTracker() {
  const tr = useTr();
  const language = useLanguage();
  const [data, setData] = useState(emptyPilotResults);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const testList = useRef<HTMLDivElement>(null);
  const metrics = resultMetrics(data.metrics);
  const summary = resultTestSummary(data.tests);
  const report = metrics.errors.length ? '' : buildPilotResultsReport(data, language, tr);
  const statusLabel = (value: PilotTest['status']) => tr(resultStatuses.find((entry) => entry.value === value)!.label);
  const incomplete = summary.open > 0 || !data.decision
    || Object.values(data.notes).some((value) => !value.trim())
    || resultMetricFields.some((field) => metrics.values[field.key] == null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = (update: (previous: PilotResults) => PilotResults) => {
    setData(update);
    setDirty(true);
    setNotice('');
    setError('');
  };
  const updateTest = (id: string, values: Partial<PilotTest>) => change((previous) => ({
    ...previous, tests: previous.tests.map((test) => test.id === id ? { ...test, ...values } : test)
  }));
  const save = () => {
    setError('');
    setNotice('');
    if (metrics.errors.length) {
      setError('Correct the highlighted numbers before saving.');
      return;
    }
    try {
      localStorage.setItem(resultsStorageKey, JSON.stringify(data));
      setDirty(false);
      setNotice('Results saved in this browser only. They do not sync to your account.');
    } catch {
      setError('Could not save these results. Browser storage may be blocked or full. Keep this page open or download the report.');
    }
  };
  const load = () => {
    setError('');
    setNotice('');
    try {
      const raw = localStorage.getItem(resultsStorageKey);
      if (raw === null) {
        setNotice('No saved pilot results were found in this browser.');
        return;
      }
      const saved = readPilotResults(raw);
      if (dirty && !window.confirm(tr('Load saved results and replace your unsaved tracker work?'))) return;
      setData(saved);
      setDirty(false);
      setNotice('Saved results loaded. Review the evidence before sharing.');
    } catch {
      setError('Could not load saved results. They may be damaged or browser storage may be blocked. Your current work has not changed.');
    }
  };
  const deleteSaved = () => {
    if (!window.confirm(tr('Delete saved pilot results from this browser? Current work and downloaded reports will remain.'))) return;
    setError('');
    setNotice('');
    try {
      localStorage.removeItem(resultsStorageKey);
      setDirty(true);
      setNotice('Saved results deleted. Current work and downloaded reports are unchanged.');
    } catch {
      setError('Could not delete saved results. Check browser storage settings and try again.');
    }
  };
  const addTest = () => {
    const id = Array.from({ length: maxPilotTests }, (_, index) => `test-${index + 1}`)
      .find((candidate) => !data.tests.some((test) => test.id === candidate));
    if (!id) return;
    change((previous) => ({ ...previous, tests: [...previous.tests, emptyPilotTest(id)] }));
    requestAnimationFrame(() => testList.current?.querySelector<HTMLTextAreaElement>(`#${id}-name`)?.focus());
  };
  const removeTest = (id: string) => {
    if (!window.confirm(tr('Remove this test and its evidence from the current tracker? The saved copy is unchanged until you save.'))) return;
    change((previous) => ({ ...previous, tests: previous.tests.filter((test) => test.id !== id) }));
    requestAnimationFrame(() => testList.current?.querySelector<HTMLButtonElement>('[data-add-test]')?.focus());
  };
  const download = () => {
    if (!report) return;
    setError('');
    setNotice('');
    try {
      downloadPilotText(report, 'pilot-results-report.txt');
      setNotice('Download requested. Check your downloads for pilot-results-report.txt.');
    } catch {
      setError('Could not download the results report. Copy the report text or try printing instead.');
    }
  };

  return (
    <div className="proposal-builder results-tracker">
      <div className="proposal-controls">
        <p>{tr('Use fictional or anonymised details only. Do not enter credentials, personal data or confidential client information. Nothing you type is sent to AI or saved to our servers.')}</p>
        <p>{tr('Saving is optional and stores one draft in this browser, shared with anyone using this browser profile. It is not encrypted by the app and does not sync when you sign in. Browser clearing may erase it.')}</p>
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={save}>{tr('Save on this device')}</button>
          <button type="button" className="btn btn-secondary" onClick={load}>{tr('Load saved results')}</button>
          <button type="button" className="btn btn-secondary" onClick={deleteSaved}>{tr('Delete saved results')}</button>
        </div>
        <p role="status">{notice ? tr(notice) : dirty ? tr('Changes are not saved on this device.') : tr('No automatic saving. Save explicitly if you want to return later.')}</p>
        {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
      </div>

      <section aria-labelledby="results-context">
        <h2 id="results-context">{tr('Pilot context and evidence')}</h2>
        {resultNoteFields.map((field) => (
          <ResultsText key={field.key} id={`results-${field.key}`} label={field.label} rows={field.rows} value={data.notes[field.key]}
            onChange={(value) => change((previous) => ({ ...previous, notes: { ...previous.notes, [field.key]: value } }))} />
        ))}
      </section>

      <section aria-labelledby="results-tests">
        <h2 id="results-tests">{tr('1. Test cases: expected versus actual')}</h2>
        <p>{tr('Record your own observations, not AI guesses. The workshop examples are test plans with no pre-filled outcomes. Use test accounts, never a live inbox or machine control.')}</p>
        <p>{tr('Up to 20 tests. Run workshop examples in order. A failure/retry case is included. Loading examples replaces only test cases after confirmation; other tracker fields stay unchanged.')}</p>
        <button type="button" className="btn btn-secondary" onClick={() => {
          if (!window.confirm(tr('Replace current test cases with seven fictional workshop test plans? Existing test evidence will be lost.'))) return;
          change((previous) => ({ ...previous, tests: starterPilotTests(tr) }));
        }}>{tr('Load workshop test plans')}</button>
        <p className="path-progress" aria-live="polite">
          {tr('Total tests:')} {summary.total} · {tr('Pass:')} {summary.pass} · {tr('Fail:')} {summary.fail} · {tr('Blocked:')} {summary.blocked} · {tr('Not run or missing evidence:')} {summary.pending}
        </p>
        <div ref={testList}>
          {data.tests.map((test, index) => (
            <fieldset key={test.id} data-test-id={test.id}>
              <legend>{tr('Test')} {index + 1}</legend>
              {resultTestFields.slice(0, 4).map((field) => (
                <ResultsText key={field.key} id={`${test.id}-${field.key}`} label={field.label} rows={field.rows} value={test[field.key]}
                  onChange={(value) => updateTest(test.id, { [field.key]: value })} />
              ))}
              <div className="form-group">
                <label htmlFor={`${test.id}-status`}>{tr('Original outcome')}</label>
                <select id={`${test.id}-status`} value={test.status} onChange={(event) => {
                  if (isResultStatus(event.target.value)) updateTest(test.id, { status: event.target.value });
                }}>
                  {resultStatuses.map((status) => <option key={status.value} value={status.value}>{tr(status.label)}</option>)}
                </select>
              </div>
              <h3>{tr('2. Corrections and retests')}</h3>
              <p>{tr('Keep the original outcome. Append dated correction and retest evidence; do not erase earlier failures. This is a self-recorded worksheet, not an immutable audit log.')}</p>
              {resultTestFields.slice(4).map((field) => (
                <ResultsText key={field.key} id={`${test.id}-${field.key}`} label={field.label} rows={field.rows} value={test[field.key]}
                  onChange={(value) => updateTest(test.id, { [field.key]: value })} />
              ))}
              <div className="form-group">
                <label htmlFor={`${test.id}-retestStatus`}>{tr('Retest outcome')}</label>
                <select id={`${test.id}-retestStatus`} value={test.retestStatus} onChange={(event) => {
                  if (isResultStatus(event.target.value)) updateTest(test.id, { retestStatus: event.target.value });
                }}>
                  {resultStatuses.map((status) => <option key={status.value} value={status.value}>{tr(status.label)}</option>)}
                </select>
              </div>
              {((test.status === 'pass' && !testHasEvidence(test)) || (test.retestStatus !== 'pending' && (!testHasEvidence(test) || !test.retest.trim()))) && (
                <p role="status">{tr('Missing evidence: fill in the test name, input, expected and actual results. A retest also needs dated evidence. Until then this case counts as not run or missing evidence.')}</p>
              )}
              <p>{tr('Current evidenced outcome')}: <strong>{statusLabel(effectiveTestStatus(test))}</strong></p>
              <button type="button" className="btn btn-secondary" disabled={data.tests.length === 1}
                onClick={() => removeTest(test.id)} aria-label={`${tr('Remove test')} ${index + 1}`}>{tr('Remove test')}</button>
            </fieldset>
          ))}
          <button type="button" className="btn btn-secondary" data-add-test disabled={data.tests.length >= maxPilotTests}
            onClick={addTest}>{tr('Add test case')}</button>
        </div>
      </section>

      <section aria-labelledby="results-metrics">
        <h2 id="results-metrics">{tr('3. Observed time and running costs')}</h2>
        <p id="results-number-help">{tr('Use totals for one comparable sample and period, not monthly estimates. Blank means unknown; enter 0 only for a measured zero. Runs must be a positive whole number. Other values accept up to two decimals (comma or point), without thousands separators.')}</p>
        <p>{tr('Net time = baseline - processing - additional review/correction. Negative means more time used. Use comparable tasks and do not count review time twice. Per-run figures require a positive sample count. No monthly projection, profit or ROI is calculated.')}</p>
        <div className="proposal-number-grid">
          {resultMetricFields.map((field) => {
            const invalid = metrics.errors.includes(field.key);
            return (
              <div className="form-group" key={field.key}>
                <label htmlFor={`results-${field.key}`}>{tr(field.label)}</label>
                <input id={`results-${field.key}`} type="text" inputMode={'integer' in field ? 'numeric' : 'decimal'} maxLength={30}
                  autoComplete="off" spellCheck={false} value={data.metrics[field.key]} aria-invalid={invalid}
                  aria-describedby={`results-number-help results-${field.key}-limit${invalid ? ` results-${field.key}-error` : ''}`}
                  onChange={(event) => change((previous) => ({ ...previous, metrics: { ...previous.metrics, [field.key]: event.target.value } }))} />
                <span id={`results-${field.key}-limit`}>{tr('Maximum:')} {field.max.toLocaleString(language)}</span>
                {invalid && <span className="proposal-error" id={`results-${field.key}-error`}>{tr('Enter a value within the limit and the stated number format. Runs cannot be zero or fractional.')}</span>}
              </div>
            );
          })}
        </div>
        <div className="proposal-totals" aria-live="polite">
          <p>{tr('Net time saved (minutes):')} <strong data-results-total="net">{metrics.net === null ? tr('[TO CONFIRM]') : formatPilotMinutes(metrics.net / 100, language)}</strong></p>
          <p>{tr('Net time saved per run (minutes):')} <strong data-results-total="per-run">{metrics.netPerRun === null ? tr('[TO CONFIRM]') : formatPilotMinutes(metrics.netPerRun, language)}</strong></p>
          <p>{tr('Running cost per run (EUR):')} <strong data-results-total="cost">{metrics.costPerRun === null ? tr('[TO CONFIRM]') : formatPilotMoney(metrics.costPerRun, language)}</strong></p>
        </div>
      </section>

      <section aria-labelledby="results-decision">
        <h2 id="results-decision">{tr('4. Decide: continue, revise or stop')}</h2>
        <p>{tr('Choose based on evidence with the authorised reviewer. Passing tests alone does not establish safety, compliance or business value. No decision is selected automatically.')}</p>
        <div className="form-group">
          <label htmlFor="results-decision-choice">{tr('Recorded decision')}</label>
          <select id="results-decision-choice" value={data.decision} onChange={(event) => {
            const decision = event.target.value;
            if (isPilotDecision(decision)) change((previous) => ({ ...previous, decision }));
          }}>
            {pilotDecisions.map((decision) => <option key={decision.value} value={decision.value}>{tr(decision.label)}</option>)}
          </select>
        </div>
        {resultDecisionFields.map((field) => (
          <ResultsText key={field.key} id={`results-${field.key}`} label={field.label} rows={field.rows} value={data.notes[field.key]}
            onChange={(value) => change((previous) => ({ ...previous, notes: { ...previous.notes, [field.key]: value } }))} />
        ))}
        {incomplete && <p role="status">{tr('Evidence is incomplete or tests remain open. A recorded decision is not approval to deploy. Resolve gaps with the authorised reviewer before live work.')}</p>}
      </section>

      <section className="proposal-editor" aria-labelledby="results-report-heading">
        <h2 id="results-report-heading">{tr('Review and download your results report')}</h2>
        <p>{tr('The report updates from the tracker, including open tests and unknowns. It includes your recorded costs and evidence: review it before sharing. User-written text is not translated.')}</p>
        {metrics.errors.length > 0 && <p className="proposal-error" role="alert">{tr('Correct the highlighted metrics before saving, downloading or printing a report.')}</p>}
        <label className="planner-label" htmlFor="results-report">{tr('Results report preview')}</label>
        <textarea id="results-report" rows={20} readOnly value={report} spellCheck={false} />
        <div className="cta-row">
          <button type="button" className="btn btn-primary" disabled={!report} onClick={download}>{tr('Download results report (.txt)')}</button>
          <button type="button" className="btn btn-secondary" disabled={!report} onClick={() => window.print()}>{tr('Print / Save as PDF')}</button>
        </div>
        <p>{tr('Only the results report is printed. Choose Save as PDF in your browser if available, and review the preview before sharing.')}</p>
      </section>
      <div className="proposal-print"><pre>{report || tr('No results report is ready. Correct invalid metrics before printing.')}</pre></div>
    </div>
  );
}
