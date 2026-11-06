'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import { automationProjects } from '@/lib/automation-projects';
import {
  appendWorkbookRevision, buildWorkbookExport, setWorkbookTestLink, workbookItemLimit,
  workbookLinkState, workbookRevisionLimit, workbookStarters, workbookTextLimit, type EvidenceWorkbook
} from '@/lib/evidence-workbook';

const subscribeHydration = () => () => {};
const emptyWorkbook: EvidenceWorkbook = { version: 1, items: [] };

export function ProjectEvidenceWorkbook({ projectId }: { projectId?: string }) {
  const tr = useTr();
  const ready = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revision, setRevision] = useState(1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dirty, setDirty] = useState(false);
  const [testId, setTestId] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const working = useRef(false);
  const workbook = saved?.project.workbook ?? emptyWorkbook;
  const archivedReviewIds = new Set((saved?.project.reviewCentre?.reviews ?? [])
    .filter((review) => !workbook.items.some((item) => item.id === review.itemId)).map((review) => review.itemId));
  const canAddItem = workbook.items.length < workbookItemLimit
    && Array.from({ length: workbookItemLimit }, (_, index) => `item-${index + 1}`)
      .some((id) => !archivedReviewIds.has(id) && !workbook.items.some((item) => item.id === id));
  const item = workbook.items.find((item) => item.id === selected);
  const history = item?.revisions.find((entry) => entry.number === revision);
  const tests = saved?.project.results?.tests ?? [];
  const query = projectId !== undefined ? `?project=${encodeURIComponent(projectId)}` : '';
  const expected = JSON.stringify(saved?.project.workbook ?? null);
  const portfolio = saved ? buildWorkbookExport(workbook, saved.project.title, tests, tr) : '';

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved workbook title and text changes?'));
  const display = (record: StoredProject, id: string | null) => {
    const current = record.project.workbook?.items.find((item) => item.id === id);
    const latest = current?.revisions.at(-1);
    setSaved(record);
    setSelected(current?.id ?? null);
    setRevision(latest?.number ?? 1);
    setTitle(latest?.title ?? '');
    setBody(latest?.body ?? '');
    setDirty(false);
    setTestId('');
    setReviewed(false);
  };
  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    void withProjectLock(action).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : 'Could not save project data. Check browser storage and retry.');
    }).finally(() => {
      working.current = false;
      setBusy(false);
    });
  };
  const currentProject = () => {
    if (!saved || projectId === undefined) throw new Error('Reload the saved project before editing its workbook.');
    const current = loadProject(localStorage, projectId);
    if (JSON.stringify(current.project.workbook ?? null) !== expected) throw new Error('This project draft changed. Reload the project draft before replacing it.');
    return current;
  };
  const persist = (next: EvidenceWorkbook, id: string | null) => {
    if (projectId === undefined) throw new Error('Reload the saved project before editing its workbook.');
    display(saveProjectPart(localStorage, projectId, 'workbook', next, expected), id);
  };

  return (
    <div className="proposal-builder evidence-workbook">
      <div className="proposal-controls">
        <p>{tr('Text drafts only: no file uploads, script execution, CAD rendering or independent verification. Use fictional or anonymised material, never personal data, credentials or confidential client files.')}</p>
        <p>{tr('The workbook belongs to one private project. Save each revision explicitly on this device. Account upload only happens from the workspace after consent; saved text and all retained revisions are included.')}</p>
        <div className="cta-row">
          <a className="btn btn-secondary" href={`/business-launchpad/projects${query}`}>{tr('Back to project')}</a>
          <a className="btn btn-secondary" href={`/business-launchpad/review-centre${query}`}>{tr('Open project review centre')}</a>
          <Link className="btn btn-secondary" href={`/business-launchpad/results-tracker${query}`} onNavigate={(event) => {
            if (!discard()) event.preventDefault();
          }}>{tr('Track pilot tests and results')}</Link>
          <button type="button" className="btn btn-primary" disabled={!ready || busy || projectId === undefined} onClick={() => attempt(() => {
            if (!discard()) return;
            if (projectId === undefined) return;
            const record = loadProject(localStorage, projectId);
            display(record, selected);
            setNotice('Saved project and workbook reloaded. Unsaved changes were not kept.');
          })}>{tr('Reload saved project and workbook')}</button>
        </div>
        {projectId === undefined && <p role="alert">{tr('Open a saved project in the workspace, then choose Open private evidence workbook.')}</p>}
        <p role="status">{tr(busy ? 'Working...' : notice || (dirty ? 'Workbook edits are not saved. The preview and downloads use saved revisions only.' : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
        {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
      </div>

      {saved && <>
        <h2>{saved.project.title}</h2>
        <p>{tr('Saved reviews keep a separate copy of reviewed text. Deleting workbook text does not delete those copies; remove saved reviews separately in the Review Centre.')}</p>
        <p>{tr('Up to eight text items, five saved revisions per item and 8,000 characters per revision. No silent pruning: export or remove an item when a limit is reached.')}</p>
        {workbook.items.length >= workbookItemLimit && <p role="status">{tr('Workbook item limit reached. Export or remove a saved item before adding another.')}</p>}
        {!canAddItem && workbook.items.length < workbookItemLimit && <p role="status">{tr('Saved reviews retain their deleted text item identifiers. Delete an archived review before reusing its slot.')}</p>}
        {item && item.revisions.length >= workbookRevisionLimit && <p role="status">{tr('Revision limit reached. Export this item and start a separate item; old revisions are never removed automatically.')}</p>}
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" disabled={busy || !canAddItem} onClick={() => {
            if (!discard()) return;
            display(saved, null);
            setNotice('');
            setError('');
          }}>{tr('Start a new text item')}</button>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => {
            if (!window.confirm(tr('Replace the current unsaved title and text with this service starter? No saved revision or test outcome will change.'))) return;
            const scenario = saved.project.automationScenario;
            const practice = saved.project.pathId === 'ai-automation-services' && scenario && scenario !== 'enquiries'
              ? automationProjects[scenario] : null;
            const starter = practice ? { title: practice.workbookTitle, text: practice.workbookText } : workbookStarters[saved.project.pathId];
            setTitle(tr(starter.title));
            setBody(tr(starter.text));
            setDirty(true);
            setReviewed(false);
            setNotice('Service starter copied into the unsaved draft. Fill it with actual practice work; headings are not evidence.');
          }}>{tr('Use this service text starter')}</button>
        </div>
        <div className="form-group">
          <label htmlFor="workbook-item">{tr('Saved text item')}</label>
          <select id="workbook-item" value={selected ?? ''} disabled={busy} onChange={(event) => {
            if (!discard()) return;
            display(saved, event.target.value || null);
            setNotice('');
            setError('');
          }}>
            <option value="">{tr('New unsaved item')}</option>
            {workbook.items.map((item) => <option key={item.id} value={item.id}>{item.revisions.at(-1)?.title}</option>)}
          </select>
        </div>
        <form className="proposal-form" onSubmit={(event) => {
          event.preventDefault();
          attempt(() => {
            const current = currentProject();
            const next = appendWorkbookRevision(current.project.workbook ?? emptyWorkbook, selected, title, body, new Date().toISOString(),
              current.project.reviewCentre?.reviews.map((review) => review.itemId) ?? []);
            persist(next, selected ?? next.items.at(-1)!.id);
            setNotice('New workbook revision saved on this device. Earlier revisions, tests and account copies are unchanged.');
          });
        }}>
          <div className="form-group">
            <label htmlFor="workbook-title">{tr('Practice text title')}</label>
            <input id="workbook-title" required maxLength={120} value={title} disabled={busy} autoComplete="off"
              onChange={(event) => { setTitle(event.target.value); setDirty(true); setReviewed(false); setNotice(''); }} />
          </div>
          <div className="form-group">
            <label htmlFor="workbook-body">{tr('Practice draft text')}</label>
            <textarea id="workbook-body" required rows={14} maxLength={workbookTextLimit} value={body} disabled={busy} autoComplete="off"
              onChange={(event) => { setBody(event.target.value); setDirty(true); setReviewed(false); setNotice(''); }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy || !dirty || !title.trim() || !body.trim()
            || (item?.revisions.length ?? 0) >= workbookRevisionLimit}>{tr('Save as a new revision on device')}</button>
        </form>
        {item && <>
          <section aria-labelledby="workbook-history">
            <h3 id="workbook-history">{tr('Saved revision history')}</h3>
            <div className="form-group">
              <label htmlFor="workbook-revision">{tr('Saved revision')}</label>
              <select id="workbook-revision" value={revision} disabled={busy} onChange={(event) => {
                setRevision(Number(event.target.value));
                setTestId('');
              }}>
                {item.revisions.map((entry) => <option key={entry.number} value={entry.number}>{entry.number} - {entry.savedAt}</option>)}
              </select>
            </div>
            <p>{history?.title}</p>
            <pre className="project-portfolio-preview" tabIndex={0} data-workbook-saved-text>{history?.body}</pre>
            <button type="button" className="btn btn-secondary" disabled={busy || !history} onClick={() => {
              if (!history || !discard()) return;
              setTitle(history.title);
              setBody(history.body);
              setDirty(true);
              setReviewed(false);
              setNotice('Saved revision copied into the unsaved draft. Saving creates a new revision; history is not overwritten.');
            }}>{tr('Use this saved revision as a draft')}</button>
          </section>
          <section aria-labelledby="workbook-tests">
            <h3 id="workbook-tests">{tr('Link saved work to a test')}</h3>
            <p>{tr('Links identify one saved text revision and the test name, input and expected result at linking time. They do not fill actual evidence, pass a test or complete a milestone. Changed definitions or newer revisions require review.')}</p>
            {!tests.length && <p>{tr('No saved test cases yet. Save them in the results tracker, then reload this workbook.')}</p>}
            <div className="form-group">
              <label htmlFor="workbook-test">{tr('Saved test case')}</label>
              <select id="workbook-test" value={testId} disabled={busy || dirty} onChange={(event) => setTestId(event.target.value)}>
                <option value="">{tr('Choose a saved test')}</option>
                {tests.map((test) => <option key={test.id} value={test.id}>{test.id}: {test.name || tr('[TO CONFIRM]')}</option>)}
              </select>
            </div>
            <button type="button" className="btn btn-secondary" disabled={busy || dirty || !testId} onClick={() => attempt(() => {
              const current = currentProject();
              const test = tests.find((test) => test.id === testId);
              const latestTest = current.project.results?.tests.find((test) => test.id === testId);
              if (!test || !latestTest || test.name !== latestTest.name || test.input !== latestTest.input || test.expected !== latestTest.expected) {
                throw new Error('Test definition changed or was removed. Reload the workbook before linking.');
              }
              if (!window.confirm(tr('Save this reference to the selected revision and test? An existing reference to this test in this item will be replaced; no test outcome changes.'))) return;
              persist(setWorkbookTestLink(current.project.workbook ?? emptyWorkbook, item.id, revision, test), item.id);
              setNotice('Saved text revision linked. Test outcomes and milestones are unchanged.');
            })}>{tr('Save link to selected revision and test')}</button>
            <ul className="journey-checks">
              {item.links.map((link) => <li key={link.testId}>
                <strong>{link.testId}: {link.name}</strong> - {tr('Saved revision')}: {link.revision}
                <p>{tr(workbookLinkState(item, link, tests))}</p>
                <button type="button" className="btn btn-secondary" disabled={busy || dirty} onClick={() => attempt(() => {
                  const current = currentProject();
                  if (!window.confirm(tr('Remove this saved test reference? Text revisions and test outcomes will remain.'))) return;
                  const next = current.project.workbook ?? emptyWorkbook;
                  persist({ ...next, items: next.items.map((entry) => entry.id === item.id ? {
                    ...entry, links: entry.links.filter((entry) => entry.testId !== link.testId)
                  } : entry) }, item.id);
                  setNotice('Test reference removed. Saved text and results are unchanged.');
                })}>{tr('Remove test reference')}</button>
              </li>)}
            </ul>
          </section>
          <button type="button" className="btn btn-secondary" disabled={busy || dirty} onClick={() => attempt(() => {
            const current = currentProject();
            if (!window.confirm(tr('Delete this text item, every retained revision and its test references from this device project? Account copies and downloaded files remain.'))) return;
            const next = current.project.workbook ?? emptyWorkbook;
            persist({ ...next, items: next.items.filter((entry) => entry.id !== item.id) }, null);
            setNotice('Workbook item and its saved revisions deleted on this device. Account copies and downloads remain.');
          })}>{tr('Delete saved text item')}</button>
        </>}
        <details className="journey-portfolio">
          <summary>{tr('Review saved workbook before download')}</summary>
          <p>{tr('Unlike the practice portfolio, this workbook download includes complete saved draft text and all retained revisions. Review each revision for sensitive details. Unsaved edits are excluded; downloaded files are not deleted with the project.')}</p>
          <pre className="project-portfolio-preview" tabIndex={0} data-workbook-export>{portfolio}</pre>
          <label className="project-check">
            <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} disabled={busy || dirty} />
            <span>{tr('I reviewed all saved workbook revisions for sensitive details and want a private device download, not a public page.')}</span>
          </label>
          <button type="button" className="btn btn-secondary" disabled={busy || dirty || !reviewed || !workbook.items.length} onClick={() => attempt(() => {
            const current = currentProject();
            if (current.revision !== saved.revision) throw new Error('Project changed in another tab. Reload it before saving.');
            downloadPilotText(portfolio, 'private-project-evidence-workbook.txt');
            setNotice('Private workbook download requested. Only saved revisions were included; nothing was published.');
          })}>{tr('Download saved private workbook (.txt)')}</button>
        </details>
      </>}
    </div>
  );
}
