'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { loadProject, projectProposalSeed, projectResultsSeed, saveProjectPart, withProjectLock, type StoredProject } from '@/lib/pilot-projects';
import { emptyProposalInputs, type ProposalDraft } from '@/lib/pilot-proposal';
import { emptyPilotResults, type PilotResults } from '@/lib/pilot-results';

type Props = { projectId: string; dirty: boolean; onDirty: () => void } & (
  { kind: 'proposal'; value: ProposalDraft; onLoad: (value: ProposalDraft) => void }
  | { kind: 'results'; value: PilotResults; onLoad: (value: PilotResults) => void }
);

const subscribeHydration = () => () => {};

export function PilotProjectTool(props: Props) {
  const tr = useTr();
  const { projectId, kind } = props;
  const ready = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [saved, setSaved] = useState<StoredProject | null>(null);
  const [expected, setExpected] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const act = (action: 'save' | 'load' | 'delete' | 'seed') => {
    setError('');
    setNotice('');
    void withProjectLock(() => {
      const current = loadProject(localStorage, projectId);
      if (((action === 'load' || action === 'seed') && props.dirty
        || action === 'seed' && current.project[kind] !== null)
        && !window.confirm(tr('Replace current unsaved work with project data?'))) return;
      if (action === 'delete' && !window.confirm(tr('Remove this saved project draft on this device? Current work, account copies and downloads remain.'))) return;
      if (action === 'save' || action === 'delete') {
        if (expected === null) throw new Error('Reload the project draft before saving.');
        const updated = props.kind === 'proposal'
          ? saveProjectPart(localStorage, projectId, 'proposal', action === 'delete' ? null : props.value, expected)
          : saveProjectPart(localStorage, projectId, 'results', action === 'delete' ? null : props.value, expected);
        setSaved(updated);
        setExpected(JSON.stringify(updated.project[kind]));
        if (action === 'save') {
          if (props.kind === 'proposal') props.onLoad(updated.project.proposal!);
          else props.onLoad(updated.project.results!);
        } else props.onDirty();
        setNotice(action === 'save' ? 'Project draft saved on this device only. Account copies are unchanged.' : 'Saved project draft removed from this device. Current work, account copies and downloads remain.');
      } else {
        setSaved(current);
        if (action === 'load') setExpected(JSON.stringify(current.project[kind]));
        if (props.kind === 'proposal') props.onLoad(action === 'seed' ? projectProposalSeed(current.project) : current.project.proposal ?? {
          version: 1, inputs: emptyProposalInputs(), document: '', source: ''
        });
        else props.onLoad(action === 'seed' ? projectResultsSeed(current.project) : current.project.results ?? emptyPilotResults());
        if (action === 'seed') props.onDirty();
        setNotice(action === 'seed' ? 'Brief copied into the form. Review it and save explicitly; no outcomes or approvals were filled in.' : 'Project draft loaded.');
      }
    }).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : 'Could not save project data. Check browser storage and retry.');
    });
  };
  const query = `?project=${encodeURIComponent(projectId)}`;

  return (
    <div className="proposal-controls project-tool-context">
      <h2>{tr('Project workspace')}: {saved?.project.title ?? tr('Load the project draft before editing.')}</h2>
      <p>{tr('This form belongs to one device project. Save explicitly. Standalone drafts, learning progress and account snapshots stay separate.')}</p>
      <p>{tr('Use fictional or anonymised details only. Account upload happens only from the workspace after your consent; nothing is sent to AI or clients.')}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/business-launchpad/projects${query}`} onNavigate={(event) => {
          if (props.dirty && !window.confirm(tr('Leave this page without saving the current project draft?'))) event.preventDefault();
        }}>{tr('Back to project')}</Link>
        <Link className="btn btn-secondary" href={`/business-launchpad/${kind === 'proposal' ? 'results-tracker' : 'proposal-builder'}${query}`} onNavigate={(event) => {
          if (props.dirty && !window.confirm(tr('Leave this page without saving the current project draft?'))) event.preventDefault();
        }}>
          {tr(kind === 'proposal' ? 'Track pilot tests and results' : 'Build a pilot proposal')}
        </Link>
        <button type="button" className="btn btn-primary" disabled={expected === null} onClick={() => act('save')}>{tr('Save project draft on device')}</button>
        <button type="button" className="btn btn-secondary" disabled={!ready} onClick={() => act('load')}>{tr('Reload project draft')}</button>
        <button type="button" className="btn btn-secondary" disabled={!saved} onClick={() => act('seed')}>{tr('Start from project brief')}</button>
        <button type="button" className="btn btn-secondary" disabled={expected === null} onClick={() => act('delete')}>{tr('Remove project draft')}</button>
      </div>
      <p role="status">{notice ? tr(notice) : tr(props.dirty ? 'Changes are not saved on this device.' : 'No automatic saving. Save explicitly if you want to return later.')}</p>
      {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
    </div>
  );
}
