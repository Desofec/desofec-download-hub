'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import {
  buildDiscoveryReport, changeFields, discoveryFields, discoveryFit, discoveryQuestions,
  emptyDiscovery, fitChecks, fitStatuses, type DiscoveryDraft
} from '@/lib/client-discovery';

const subscribeHydration = () => () => {};

export function ClientDiscoveryBuilder({ projectId }: { projectId?: string }) {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [draft, setDraft] = useState<DiscoveryDraft>(emptyDiscovery);
  const [dirty, setDirty] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const working = useRef(false);
  const isProject = projectId !== undefined;
  const expected = JSON.stringify(saved?.project.discovery ?? null);
  const query = isProject ? `?project=${encodeURIComponent(projectId)}` : '';
  const report = saved?.project.discovery ? buildDiscoveryReport(saved.project.discovery, tr) : '';
  const fit = discoveryFit(draft);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved discovery changes?'));
  const change = (next: DiscoveryDraft) => {
    setDraft(next); setDirty(true); setReviewed(false); setNotice('');
  };
  const display = (record: StoredProject) => {
    setSaved(record); setDraft(record.project.discovery ?? emptyDiscovery());
    setDirty(false); setReviewed(false);
  };
  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true; setBusy(true); setError(''); setNotice('');
    void withProjectLock(action).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : 'Could not save project data. Check browser storage and retry.');
    }).finally(() => { working.current = false; setBusy(false); });
  };

  return <div className="proposal-builder">
    <div className="proposal-controls">
      <p>{tr('Fictional practice only. No AI chat, live outreach, automatic approval or client sending. Use roles and invented data, never personal details, credentials or confidential files.')}</p>
      <p>{tr(isProject
        ? 'Reload before editing. Save explicitly to this device project; account snapshots include discovery only after separate consent and upload.'
        : 'This public lab keeps edits in page memory only. Reloading clears them. To retain discovery, open an existing service project in the workspace.')}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/business-launchpad/projects${query}`} onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Open the Pilot Project Workspace')}</Link>
        <Link className="btn btn-secondary" href="/tutorials/freelance-client-discovery" onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Learn step by step: tutorial')}</Link>
        {isProject && <button className="btn btn-primary" type="button" disabled={!hydrated || busy} onClick={() => attempt(() => {
          if (!discard() || projectId === undefined) return;
          display(loadProject(localStorage, projectId));
          setNotice('Saved project and discovery reloaded.');
        })}>{tr('Reload saved project and discovery')}</button>}
      </div>
      <p role="status">{tr(busy ? 'Working...' : notice || (dirty ? 'Discovery edits are not saved.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
      {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
    </div>
    <section aria-labelledby="discovery-simulator">
      <h2 id="discovery-simulator">{tr('Fictional client-brief simulator')}</h2>
      <p>{tr('Can you automate our spreadsheet and save us lots of time?')}</p>
      <p>{tr('These are fixed practice answers, not a real client or an AI conversation. Ask before offering; do not treat the opening request as agreed scope.')}</p>
      {discoveryQuestions.map((question) => <details key={question.id} className="journey-portfolio">
        <summary>{tr(question.question)}</summary><p>{tr(question.answer)}</p>
      </details>)}
      <p>{tr('Change scenario: the fictional owner now asks for daily live synchronisation and unlimited revisions. Record this as a proposed change, never as accepted scope.')}</p>
    </section>
    {(!isProject || saved) && <>
      {saved && <h2>{saved.project.title}</h2>}
      <form className="proposal-form" onSubmit={(event) => {
        event.preventDefault();
        if (projectId === undefined) return;
        attempt(() => {
          display(saveProjectPart(localStorage, projectId, 'discovery', draft, expected));
          setNotice('Discovery saved on this device. Proposal and account copies are unchanged.');
        });
      }}>
        <fieldset disabled={busy}>
          <legend>{tr('Discovery brief and bounded scope')}</legend>
          {discoveryFields.map(({ key, label }) => <div className="form-group" key={key}>
            <label htmlFor={`discovery-${key}`}>{tr(label)}</label>
            <textarea id={`discovery-${key}`} rows={3} maxLength={2000} value={draft.brief[key]} autoComplete="off"
              onChange={(event) => change({ ...draft, brief: { ...draft.brief, [key]: event.target.value } })} />
          </div>)}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('Project-fit and risk checklist')}</legend>
          {fitChecks.map(({ id, label }) => <div className="form-group" key={id}>
            <label htmlFor={`discovery-fit-${id}`}>{tr(label)}</label>
            <select id={`discovery-fit-${id}`} value={draft.fit[id]} onChange={(event) => {
              const value = event.target.value;
              if (value === 'yes' || value === 'no' || value === 'unknown') change({ ...draft, fit: { ...draft.fit, [id]: value } });
            }}>
              {fitStatuses.map(({ value, label }) => <option value={value} key={value}>{tr(label)}</option>)}
            </select>
          </div>)}
          <div className="form-group">
            <label htmlFor="discovery-fit-evidence">{tr('Evidence for fit decisions and unresolved risks')}</label>
            <textarea id="discovery-fit-evidence" rows={3} maxLength={2000} value={draft.fitEvidence}
              onChange={(event) => change({ ...draft, fitEvidence: event.target.value })} />
          </div>
          <p role="status" data-discovery-fit>{tr(fit.ready
            ? 'Continue scoping, not approval to accept work.'
            : 'Pause: resolve missing evidence, fit concerns and unknowns before accepting work.')}</p>
        </fieldset>
        <fieldset disabled={busy}>
          <legend>{tr('PROPOSED CHANGE - NOT ACCEPTED')}</legend>
          {changeFields.map(({ key, label }) => <div className="form-group" key={key}>
            <label htmlFor={`discovery-change-${key}`}>{tr(label)}</label>
            <textarea id={`discovery-change-${key}`} rows={3} maxLength={2000} value={draft.change[key]} autoComplete="off"
              onChange={(event) => change({ ...draft, change: { ...draft.change, [key]: event.target.value } })} />
          </div>)}
          <p>{tr('A change request never updates the original scope or proposal automatically. Agree a versioned revision with the authorised reviewer before work; missing costs and dates stay unknown.')}</p>
        </fieldset>
        {isProject && <button type="submit" className="btn btn-primary" disabled={busy || !dirty}>{tr('Save discovery on device')}</button>}
      </form>
      {saved && <>
        <button type="button" className="btn btn-secondary" disabled={busy || !saved.project.discovery} onClick={() => attempt(() => {
          if (!discard() || !window.confirm(tr('Delete saved discovery from this device project? Proposals, account copies and downloads remain.'))) return;
          display(saveProjectPart(localStorage, saved.project.id, 'discovery', undefined, expected));
          setNotice('Saved discovery deleted from this device project.');
        })}>{tr('Delete saved discovery')}</button>
        <Link href={`/business-launchpad/proposal-builder${query}`} className="btn btn-secondary" onNavigate={(event) => {
          if (!discard()) event.preventDefault();
        }}>{tr('Build a pilot proposal')}</Link>
        {!!report && <section aria-labelledby="discovery-preview">
          <h2 id="discovery-preview">{tr('Saved discovery preview')}</h2>
          <p>{tr('The preview uses saved discovery only. It excludes proposals, costs, results, workbook text and reviews. Check all included text before downloading.')}</p>
          <pre tabIndex={0} className="project-portfolio-preview" data-discovery-report>{report}</pre>
          <label className="project-check">
            <input type="checkbox" checked={reviewed} disabled={dirty || busy} onChange={(event) => setReviewed(event.target.checked)} />
            <span>{tr('I reviewed this discovery draft for sensitive details and understand it is fictional practice, not an agreement or approval.')}</span>
          </label>
          <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty || busy} onClick={() => attempt(() => {
            const current = loadProject(localStorage, saved.project.id);
            if (JSON.stringify(current.project.discovery ?? null) !== expected) {
              throw new Error('Discovery changed. Reload and review it again before downloading.');
            }
            downloadPilotText(report, 'fictional-discovery-scope-draft.txt');
            setNotice('Discovery download requested. No public page or client message was created.');
          })}>{tr('Download discovery draft (.txt)')}</button>
        </section>}
      </>}
    </>}
  </div>;
}
