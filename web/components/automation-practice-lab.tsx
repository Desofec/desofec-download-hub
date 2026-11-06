'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import { automationScenarioIds, automationScenarioLabels, isAutomationScenario, type AutomationScenario } from '@/lib/automation-projects';
import {
  enquiryExamples, processEnquiry, processReminder, reminderExamples, reminderClock,
  reportRows, writeWeeklyReport, type EnquiryRow, type ReminderState, type WeeklyReport
} from '@/lib/automation-practice';
import { downloadPilotText } from '@/lib/pilot-download';

export function AutomationPracticeLab() {
  const tr = useTr();
  const [scenario, setScenario] = useState<AutomationScenario>('enquiries');
  return <div className="proposal-builder">
    <div className="form-group">
      <label htmlFor="lab-project">{tr('Automation practice project')}</label>
      <select id="lab-project" value={scenario} onChange={(event) => {
        if (isAutomationScenario(event.target.value)
          && window.confirm(tr('Change practice project and discard these temporary lab results? Download your observations first if needed.'))) {
          setScenario(event.target.value);
        }
      }}>
        {automationScenarioIds.map((id) => <option key={id} value={id}>{tr(automationScenarioLabels[id])}</option>)}
      </select>
    </div>
    <Lab key={scenario} scenario={scenario} />
  </div>;
}

function Lab({ scenario }: { scenario: AutomationScenario }) {
  const tr = useTr();
  const [enabled, setEnabled] = useState(true);
  const [failWrite, setFailWrite] = useState(false);
  const [index, setIndex] = useState(0);
  const [queue, setQueue] = useState<readonly EnquiryRow[]>([]);
  const [reminders, setReminders] = useState<ReminderState>({ drafts: [], latest: {} });
  const [reports, setReports] = useState<readonly WeeklyReport[]>([]);
  const [revision, setRevision] = useState(1);
  const [corrected, setCorrected] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState('');
  const events = scenario === 'enquiries' ? enquiryExamples : reminderExamples;
  const rows = corrected ? reportRows.map((row) => row.id === 'O5' ? { ...row, quantity: 2 } : row) : reportRows;
  const state = scenario === 'enquiries' ? queue : scenario === 'appointments' ? reminders : reports;
  const attempt = (action: () => string) => {
    setError('');
    setOutcome('');
    try {
      const message = action();
      setOutcome(message);
      setLog((entries) => [...entries, message]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Practice operation failed.';
      setError(message);
      setLog((entries) => [...entries, message]);
    }
  };
  const run = () => attempt(() => {
    if (scenario === 'weekly-report') {
      const result = writeWeeklyReport(reports, revision, rows, { enabled, failWrite });
      setReports(result.reports);
      return result.outcome;
    }
    if (scenario === 'enquiries') {
      const result = processEnquiry(queue, enquiryExamples[index], { enabled, failWrite });
      setQueue(result.rows);
      if (enabled) setIndex(index + 1);
      return result.outcome;
    }
    const result = processReminder(reminders, reminderExamples[index], { enabled, failWrite });
    setReminders(result.state);
    if (enabled) setIndex(index + 1);
    return result.outcome;
  });
  return <section aria-labelledby="lab-heading">
    <h2 id="lab-heading">{tr(automationScenarioLabels[scenario])}</h2>
    <p>{tr('Fictional data only. This local simulation has no AI model, calendar, inbox or spreadsheet connector. Nothing is sent. Results disappear on reload; download explicitly. No project evidence, grades or approval are saved automatically.')}</p>
    <p>{tr('Lab inputs and log entries below are English. Record your own observations in the private project workbook; simulation results do not prove a real integration works.')}</p>
    {scenario === 'enquiries' ? <>
      <p>{tr('The two human-review decisions are supplied for this fixed sample, not detected by AI. Expect four queue rows, two drafts and zero messages after all six events.')}</p>
      <pre className="project-portfolio-preview" tabIndex={0}>{JSON.stringify(enquiryExamples, null, 2)}</pre>
    </> : scenario === 'appointments' ? <>
      <p>{tr('Clock is fixed at 2030-01-07 09:00 UTC. Eligible reminders are more than 0 and at most 24 hours away, confirmed and permitted. Cancelled drafts stay visible; dispatch is never available.')}</p>
      <p>{tr('After eight events: A1 v1 cancelled, one active A1 v2 draft; no A2, A3 or A4 draft. Recheck current appointment version and permission before any hypothetical dispatch.')}</p>
      <p>UTC: {reminderClock}</p>
      <pre className="project-portfolio-preview" tabIndex={0}>{JSON.stringify(reminderExamples, null, 2)}</pre>
    </> : <>
      <p>{tr('Week: 2030-01-07 through 2030-01-13 UTC inclusive. Five unique orders, one identical duplicate, one excluded date. Known subtotal EUR 21 with one unresolved quantity, not a complete total. A zero quantity is valid, not missing.')}</p>
      <p>{tr('Corrected practice sample changes the missing quantity to 2: EUR 29 with no unresolved rows. Save a new revision; never overwrite the original incomplete report.')}</p>
      <pre className="project-portfolio-preview" tabIndex={0}>{JSON.stringify(rows, null, 2)}</pre>
      <div className="form-group">
        <label htmlFor="report-revision">{tr('Report revision')}</label>
        <select id="report-revision" value={revision} onChange={(event) => setRevision(Number(event.target.value))}>
          {[1, 2, 3].map((number) => <option key={number} value={number}>{number}</option>)}
        </select>
      </div>
      <label className="project-check"><input type="checkbox" checked={corrected} onChange={(event) => setCorrected(event.target.checked)} />
        <span>{tr('Use corrected sample quantity (2)')}</span></label>
    </>}
    <div className="proposal-controls">
      <label className="project-check"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        <span>{tr('Simulation enabled (off switch)')}</span></label>
      <label className="project-check"><input type="checkbox" checked={failWrite} onChange={(event) => setFailWrite(event.target.checked)} />
        <span>{tr('Simulate write failure until unchecked')}</span></label>
      <p>{tr('A failed write leaves state unchanged. Uncheck failure and retry the same event or revision. The off switch blocks state changes, not review of the existing log.')}</p>
      {scenario !== 'weekly-report' && <p>{tr('Processed sample events')}: {index}/{events.length}</p>}
      <div className="cta-row">
        <button type="button" className="btn btn-primary" onClick={run} disabled={scenario !== 'weekly-report' && index >= events.length}>
          {tr(scenario === 'weekly-report' ? 'Create or rerun practice report' : 'Process next sample event')}
        </button>
        {scenario === 'appointments' && <button className="btn btn-secondary" type="button" onClick={() => attempt(() =>
          processReminder(reminders, { ...reminderExamples[0], at: 'invalid' }, { enabled, failWrite }).outcome
        )}>{tr('Try an invalid appointment')}</button>}
        {scenario === 'weekly-report' && <button className="btn btn-secondary" type="button" onClick={() => attempt(() =>
          writeWeeklyReport(reports, revision, [...rows, { ...reportRows[0], quantity: 99 }], { enabled, failWrite }).outcome
        )}>{tr('Try a conflicting duplicate order')}</button>}
        <button type="button" className="btn btn-secondary" disabled={!log.length} onClick={() => attempt(() => {
          downloadPilotText(`automation-${scenario}-practice.txt`, [
            tr('SIMULATED PRACTICE OBSERVATIONS - NOT LIVE VERIFICATION OR CUSTOMER APPROVAL'),
            tr(automationScenarioLabels[scenario]), 'External messages sent: 0',
            JSON.stringify(state, null, 2), ...log
          ].join('\n\n'));
          return 'Practice observations downloaded. Review before sharing.';
        })}>{tr('Download lab observations')}</button>
      </div>
      <p role="status">{tr(outcome)}</p>
      {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    </div>
    {scenario === 'weekly-report' && reports.map((report) => <article className="path-card" key={report.key}>
      <h3>{report.key}</h3>
      <p>{tr('Known subtotal (EUR)')}: {(report.knownCents / 100).toFixed(2)}</p>
      <p>{tr('Unresolved rows')}: {report.unresolved}</p>
      <p>{tr(report.unresolved ? 'Report total remains incomplete.' : 'No missing quantities in this practice revision.')}</p>
    </article>)}
    <h3>{tr('Current simulated state')}</h3>
    <pre className="project-portfolio-preview" tabIndex={0} data-lab-state>{JSON.stringify(state, null, 2)}</pre>
    <h3>{tr('Practice event log')}</h3>
    <ol>{log.map((entry, at) => <li key={at}>{entry}</li>)}</ol>
    <div className="cta-row">
      <Link className="btn btn-primary" href="/business-launchpad/projects?path=ai-automation-services">{tr('Save evidence in a separate private project')}</Link>
      <Link className="btn btn-secondary" href="/starter-packs/ai-automation-services-kit">{tr('Open the service kit')}</Link>
    </div>
  </section>;
}
