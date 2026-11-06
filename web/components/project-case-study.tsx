'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { loadProject, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import { serviceJourneyCoverage, serviceJourneyDefinition, serviceProjectJourney } from '@/lib/service-project-journeys';
import { buildCaseStudy, caseStudyFields, caseStudyFromBrief, caseStudyText, emptyCaseStudy, type CaseStudy } from '@/lib/case-study';
import '@/app/case-study.css';

const subscribeHydration = () => () => {};

export function ProjectCaseStudy({ projectId }: { projectId?: string }) {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [draft, setDraft] = useState<CaseStudy>(emptyCaseStudy);
  const [dirty, setDirty] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const working = useRef(false);
  const query = projectId === undefined ? '' : `?project=${encodeURIComponent(projectId)}`;
  const expected = JSON.stringify(saved?.project.caseStudy ?? null);
  const sections = saved?.project.caseStudy ? buildCaseStudy(
    saved.project, serviceJourneyCoverage(saved.project), serviceProjectJourney(saved.project).ready,
    tr(serviceJourneyDefinition(saved.project.pathId, saved.project.automationScenario)?.boundary
      ?? 'Fictional content practice only. No publication or client approval is implied.'), tr
  ) : [];
  const missingIds = draft.testIds.filter((id) => !saved?.project.results?.tests.some((test) => test.id === id));

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const discard = () => !dirty || window.confirm(tr('Discard unsaved case study changes?'));
  const display = (record: StoredProject) => {
    setSaved(record);
    setDraft(record.project.caseStudy ?? emptyCaseStudy());
    setDirty(false);
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
    }).finally(() => { working.current = false; setBusy(false); });
  };
  const change = (next: CaseStudy) => {
    setDraft(next);
    setDirty(true);
    setReviewed(false);
    setNotice('');
  };
  const currentForExport = () => {
    if (!saved || dirty || !reviewed) throw new Error('Save and review the case study before exporting.');
    if (JSON.stringify(loadProject(localStorage, saved.project.id).project) !== JSON.stringify(saved.project)) {
      throw new Error('Project evidence changed. Reload, inspect the preview and review it again before exporting.');
    }
  };

  return (
    <div className="proposal-builder">
      <div className="proposal-controls">
        <p>{tr('Write an honest case study using fictional practice. No AI generation, automatic publishing, file uploads or client sending.')}</p>
        <p>{tr('Save explicitly to this device project. Account snapshots include the saved case study only when you consent and upload from the workspace. Downloads and PDFs remain separate.')}</p>
        <div className="cta-row">
          <Link href={`/business-launchpad/projects${query}`} className="btn btn-secondary" onNavigate={(event) => {
            if (!discard()) event.preventDefault();
          }}>{tr('Back to project')}</Link>
          <Link href={`/business-launchpad/results-tracker${query}`} className="btn btn-secondary" onNavigate={(event) => {
            if (!discard()) event.preventDefault();
          }}>{tr('Track pilot tests and results')}</Link>
          <button type="button" className="btn btn-primary" disabled={!hydrated || busy || projectId === undefined}
            onClick={() => attempt(() => {
              if (!discard() || projectId === undefined) return;
              display(loadProject(localStorage, projectId));
              setNotice('Saved project and case study reloaded.');
            })}>{tr('Reload saved project and case study')}</button>
        </div>
        {projectId === undefined && <p role="alert">{tr('Open a saved project in the workspace, then choose Build a freelance case study.')}</p>}
        <p role="status">{tr(busy ? 'Working...' : notice || (dirty
          ? 'Case study edits are not saved. The preview uses saved text only.'
          : 'No automatic saving. Save explicitly if you want to return later.'))}</p>
        {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
      </div>
      {saved && <>
        <h2>{saved.project.title}</h2>
        <p>{tr('Use fictional or anonymised project details only. Do not enter credentials, personal data or confidential client information.')}</p>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => {
          if (!window.confirm(tr('Replace the unsaved narrative with the saved brief? Outcome stays blank and no tests are selected. Review copied text before saving.'))) return;
          change(caseStudyFromBrief(saved.project));
        }}>{tr('Use saved brief as a starting draft')}</button>
        <form className="proposal-form" onSubmit={(event) => {
          event.preventDefault();
          attempt(() => {
            if (!draft.text.title.trim()) throw new Error('Enter a case study title.');
            display(saveProjectPart(localStorage, saved.project.id, 'caseStudy', draft, expected));
            setNotice('Case study saved on this device. Account copies are unchanged.');
          });
        }}>
          {caseStudyFields.map((field) => <div className="form-group" key={field.key}>
            <label htmlFor={`case-study-${field.key}`}>{tr(field.label)}</label>
            <textarea id={`case-study-${field.key}`} rows={field.key === 'title' ? 1 : 4}
              required={field.key === 'title'} maxLength={field.limit} value={draft.text[field.key]} autoComplete="off" disabled={busy}
              onChange={(event) => change({ ...draft, text: { ...draft.text, [field.key]: event.target.value } })} />
          </div>)}
          <fieldset disabled={busy}>
            <legend>{tr('Select saved test evidence to include')}</legend>
            <p>{tr('Nothing is selected automatically. Selected tests include input, expected and actual results, corrections and retests. Whole-project gaps and decisions always remain visible.')}</p>
            {!saved.project.results?.tests.length && <p>{tr('No saved test results.')}</p>}
            {saved.project.results?.tests.map((test) => <label className="project-check" key={test.id}>
              <input type="checkbox" checked={draft.testIds.includes(test.id)} onChange={(event) => change({
                ...draft, testIds: event.target.checked ? [...draft.testIds, test.id] : draft.testIds.filter((id) => id !== test.id)
              })} />
              <span>{test.id}: {test.name || tr('[TO CONFIRM]')}</span>
            </label>)}
            {missingIds.map((id) => <label className="project-check" key={id}>
              <input type="checkbox" checked onChange={() => change({ ...draft, testIds: draft.testIds.filter((testId) => testId !== id) })} />
              <span>{id}: {tr('Selected test no longer exists. Reload and update the selection.')}</span>
            </label>)}
          </fieldset>
          <button type="submit" className="btn btn-primary" disabled={busy || !dirty || !draft.text.title.trim()}>{tr('Save case study on device')}</button>
        </form>
        <button type="button" className="btn btn-secondary" disabled={busy || !saved.project.caseStudy} onClick={() => attempt(() => {
          if (!discard() || !window.confirm(tr('Delete the saved case study from this device project? Account copies and downloaded files remain.'))) return;
          display(saveProjectPart(localStorage, saved.project.id, 'caseStudy', undefined, expected));
          setNotice('Saved case study deleted from this device project.');
        })}>{tr('Delete saved case study')}</button>
        {!!sections.length && <>
          <h2>{tr('Saved case study preview')}</h2>
          <div className="case-study-sheet">
            {sections.map((section, index) => <section key={index}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>)}
          </div>
          <label className="project-check">
            <input type="checkbox" checked={reviewed} disabled={dirty || busy} onChange={(event) => setReviewed(event.target.checked)} />
            <span>{tr('I reviewed every included section for sensitive details and understand this is fictional practice, not verified client work.')}</span>
          </label>
          <div className="cta-row">
            <button type="button" className="btn btn-secondary" disabled={!reviewed || dirty || busy} onClick={() => attempt(() => {
              currentForExport();
              downloadPilotText(caseStudyText(sections), 'fictional-practice-case-study.txt');
              setNotice('Case study download requested. No public page was created.');
            })}>{tr('Download case study (.txt)')}</button>
            <button type="button" className="btn btn-primary" disabled={!reviewed || dirty || busy} onClick={() => attempt(() => {
              currentForExport();
              window.print();
              setNotice('Print dialog requested. Choose Save as PDF if your browser supports it; no PDF or public link is saved by the app.');
            })}>{tr('Print / Save as PDF')}</button>
          </div>
          <p>{tr('The print layout contains only this saved preview. Browser headers may include the page URL; turn headers and footers off before saving or sharing. Delete downloaded copies separately.')}</p>
          {hydrated && createPortal(<div className="case-study-print-root" aria-hidden="true">
            <article className="case-study-sheet">
              {sections.map((section, index) => <section key={index}>
                <h2>{section.heading}</h2><p>{section.body}</p>
              </section>)}
            </article>
          </div>, document.body)}
        </>}
      </>}
    </div>
  );
}
