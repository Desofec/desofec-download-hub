'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useAuth } from '@/components/auth-provider';
import { PilotProjectAccount } from '@/components/pilot-project-account';
import { ProjectBackup } from '@/components/project-backup';
import { TutorialLink } from '@/components/tutorial-link';
import { ServiceProjectJourney } from '@/components/service-project-journey';
import { serviceProjectJourney } from '@/lib/service-project-journeys';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  buildProjectSummary, commerceProjectTrack, deleteProject, listProjects, loadProject, newPilotProject, projectBriefFields, projectKitId,
  projectMilestones, projectProposalReady, saveProject, withProjectLock,
  type PilotProject, type ServicePathId, type StoredProject
} from '@/lib/pilot-projects';
import type { LearningPath } from '@/lib/types';
import { resultTestSummary } from '@/lib/pilot-results';
import { automationScenarioIds, automationScenarioLabels, isAutomationScenario, type AutomationScenario } from '@/lib/automation-projects';

const subscribeHydration = () => () => {};
type WorkspaceProps = { paths: LearningPath[]; projectId?: string; initialPath?: ServicePathId };
export function PilotProjectWorkspace(props: WorkspaceProps) {
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const tr = useTr();
  return hydrated ? <Workspace key={`${props.projectId ?? ''}:${props.initialPath ?? ''}`} {...props} /> : <p>{tr('Loading...')}</p>;
}

function Workspace({ paths, projectId, initialPath }: WorkspaceProps) {
  const tr = useTr();
  const { session, ready } = useAuth();
  const [initial] = useState(() => {
    try {
      return { projects: listProjects(localStorage), selected: projectId !== undefined ? loadProject(localStorage, projectId) : null, error: '' };
    } catch (error) {
      return { projects: [], selected: null, error: error instanceof Error ? error.message : 'Could not open this project. Check browser storage and retry.' };
    }
  });
  const [projects, setProjects] = useState<StoredProject[]>(initial.projects);
  const [selected, setSelected] = useState<StoredProject | null>(initial.selected);
  const [draft, setDraft] = useState<PilotProject | null>(initial.selected?.project ?? null);
  const [dirty, setDirty] = useState(false);
  const [title, setTitle] = useState('');
  const [pathId, setPathId] = useState<ServicePathId>(initialPath ?? 'ai-automation-services');
  const [scenario, setScenario] = useState<AutomationScenario>('enquiries');
  const [error, setError] = useState(initial.error);
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const working = useRef(false);

  const refresh = (id?: string) => {
    const records = listProjects(localStorage);
    setProjects(records);
    const current = id !== undefined ? loadProject(localStorage, id) : null;
    setSelected(current);
    setDraft(current?.project ?? null);
    setDirty(false);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const attempt = (action: () => void) => {
    if (working.current) return;
    working.current = true;
    setError('');
    setNotice('');
    void withProjectLock(action).catch((error: unknown) => {
      setError(error instanceof Error ? error.message : 'Could not save project data. Check browser storage and retry.');
    }).finally(() => { working.current = false; });
  };
  const change = (update: (project: PilotProject) => PilotProject) => {
    if (!draft) return;
    setDraft(update(draft));
    setDirty(true);
    setNotice('');
  };
  const open = (id: string) => attempt(() => {
    if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) return;
    refresh(id);
    window.history.replaceState(null, '', `/business-launchpad/projects?project=${encodeURIComponent(id)}`);
    requestAnimationFrame(() => heading.current?.focus());
  });
  const saved = selected?.project;
  const query = saved ? `?project=${encodeURIComponent(saved.id)}` : '';
  const summary = saved?.results ? resultTestSummary(saved.results.tests) : null;

  return (
    <div className="proposal-builder project-workspace">
      <div className="proposal-controls">
        <p>{tr('Use fictional or anonymised project details only. Do not enter credentials, personal data or confidential client information.')}</p>
        <p>{tr('Device projects are shared with anyone using this browser profile and are not encrypted by the app. Browser clearing may erase them. No automatic saving, account upload, AI processing or client sending.')}</p>
        <p>{tr('Up to 10 projects on this device and 10 account snapshots. Project checklists are separate from lesson and starter-kit progress.')}</p>
        <button type="button" className="btn btn-secondary" onClick={() => attempt(() => {
          if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) return;
          refresh(selected?.project.id);
        })}>{tr('Refresh device projects')}</button>
        <p role="status">{notice ? tr(notice) : dirty ? tr('Changes are not saved on this device.') : tr('Only explicitly saved data appears in summaries and account snapshots.')}</p>
        {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
      </div>

      <section aria-labelledby="create-project">
        <h2 id="create-project">{tr('Start a practice project')}</h2>
        <form className="proposal-form" onSubmit={(event) => {
          event.preventDefault();
          attempt(() => {
            if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) return;
            const project = newPilotProject(crypto.randomUUID(), pathId, title, pathId === 'ai-automation-services' ? scenario : undefined);
            saveProject(localStorage, project, 0);
            refresh(project.id);
            setTitle('');
            setNotice('Project created on this device. Nothing was uploaded.');
            window.history.replaceState(null, '', `/business-launchpad/projects?project=${project.id}`);
            requestAnimationFrame(() => heading.current?.focus());
          });
        }}>
          <div className="form-group">
            <label htmlFor="project-title">{tr('Project title')}</label>
            <input id="project-title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} autoComplete="off" />
          </div>
          <div className="form-group">
            <label htmlFor="project-path">{tr('Service learning path')}</label>
            <select id="project-path" value={pathId} onChange={(event) => {
              const path = paths.find((path) => path.id === event.target.value);
              if (path) setPathId(path.id as ServicePathId);
            }}>
              {paths.map((path) => <option value={path.id} key={path.id}>{tr(path.title)}</option>)}
            </select>
          </div>
          {pathId === 'ai-automation-services' && <div className="form-group">
            <label htmlFor="project-automation">{tr('Automation practice project')}</label>
            <select id="project-automation" value={scenario} onChange={(event) => {
              if (isAutomationScenario(event.target.value)) setScenario(event.target.value);
            }}>
              {automationScenarioIds.map((id) => <option key={id} value={id}>{tr(automationScenarioLabels[id])}</option>)}
            </select>
            <p>{tr('This choice stays fixed. Create another project to practise a different workflow. Older automation projects keep the enquiry exercise.')}</p>
            <Link href="/business-launchpad/automation-lab">{tr('Open the no-send automation practice lab')}</Link>
          </div>}
          <button type="submit" className="btn btn-primary" disabled={!title.trim()}>{tr('Create and save on this device')}</button>
        </form>
      </section>

      <section aria-labelledby="device-projects">
        <h2 id="device-projects">{tr('Device projects')}</h2>
        <ProjectBackup projectCount={projects.length} onRestored={() => {
          setProjects(listProjects(localStorage));
          window.dispatchEvent(new Event('desofec-project-dashboard-refresh'));
        }} />
        {!projects.length && <p>{tr('No projects saved on this device yet.')}</p>}
        <div className="path-grid">
          {projects.map(({ project }) => (
            <article className="path-card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{tr(paths.find((path) => path.id === project.pathId)?.title ?? project.pathId)}</p>
              {project.pathId === 'ai-automation-services' && <p>{tr(automationScenarioLabels[project.automationScenario ?? 'enquiries'])}</p>}
              <p>{tr(serviceProjectJourney(project).next?.action ?? 'Practice record assembled. Review the private portfolio and all unresolved issues before any manual sharing.')}</p>
              <button type="button" className="btn btn-secondary" onClick={() => open(project.id)} aria-pressed={selected?.project.id === project.id}>{tr('Open project')}</button>
            </article>
          ))}
        </div>
      </section>

      {draft && selected && saved && (
        <section aria-labelledby="current-project">
          <h2 id="current-project" tabIndex={-1} ref={heading}>{saved.title}</h2>
          <p>{tr(paths.find((path) => path.id === saved.pathId)?.title ?? saved.pathId)}</p>
          {saved.pathId === 'ai-automation-services' && <p>{tr(automationScenarioLabels[saved.automationScenario ?? 'enquiries'])}</p>}
          <ServiceProjectJourney key={`${saved.id}:${selected.revision}`} saved={selected} dirty={dirty} />
          <p>{tr('Checklist completion is self-recorded planning, not customer, engineering or teaching approval.')}</p>
          <p>{tr('Brief changes never rewrite existing proposal or results drafts. Review both after changing the brief.')}</p>
          <form className="proposal-form" id="project-brief-form" onSubmit={(event) => {
            event.preventDefault();
            attempt(() => {
              const updated = saveProject(localStorage, draft, selected.revision);
              refresh(updated.project.id);
              setNotice('Project brief and checklist saved on this device. Account copies are unchanged.');
            });
          }}>
            <div className="form-group">
              <label htmlFor="edit-project-title">{tr('Project title')}</label>
              <input id="edit-project-title" required maxLength={120} value={draft.title}
                onChange={(event) => change((project) => ({ ...project, title: event.target.value }))} autoComplete="off" />
            </div>
            {projectBriefFields.map(({ key, label }) => (
              <div className="form-group" key={key}>
                <label htmlFor={`project-${key}`}>{tr(label)}</label>
                <textarea id={`project-${key}`} rows={3} maxLength={2000} value={draft.brief[key]} autoComplete="off"
                  onChange={(event) => change((project) => ({ ...project, brief: { ...project.brief, [key]: event.target.value } }))} />
              </div>
            ))}
            <fieldset>
              <legend>{tr('Project checklist')}</legend>
              {projectMilestones.map((item) => (
                <label className="project-check" key={item.id}>
                  <input type="checkbox" checked={draft.completed.includes(item.id)} onChange={(event) => change((project) => ({
                    ...project, completed: event.target.checked ? [...project.completed, item.id] : project.completed.filter((id) => id !== item.id)
                  }))} />
                  <span>{tr(item.label)}</span>
                </label>
              ))}
            </fieldset>
            <button type="submit" className="btn btn-primary">{tr('Save brief and checklist on device')}</button>
          </form>
          <h3>{tr('Connected project tools')}</h3>
          <p>{tr('Open a tool and press Reload project draft before editing. Start from project brief is optional and never fills in results or approvals. Existing standalone drafts remain untouched.')}</p>
          <p>{tr(projectProposalReady(saved) ? 'Saved draft; review before sharing.' : 'Missing or needs regeneration.')}</p>
          <p>{tr('Recorded tests:')} {summary?.total ?? 0} · {tr('Not run or missing evidence:')} {summary?.pending ?? 0}</p>
          <p>{tr('Keep practice text and explicit revision history in the private workbook. Workbook drafts and links never mark tests or milestones complete.')}</p>
          <div className="cta-row">
            {commerceProjectTrack(saved.pathId) && <Link className="btn btn-primary"
              href={`/business-launchpad/commerce-lab?track=${commerceProjectTrack(saved.pathId)}&project=${encodeURIComponent(saved.id)}`}
              onNavigate={(event) => { if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault(); }}>
              {tr('Open commerce practice lab')}
            </Link>}
            <Link className="btn btn-secondary" href={`/business-launchpad/review-centre${query}`}
              onNavigate={(event) => { if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault(); }}>{tr('Open project review centre')}</Link>
            <Link className="btn btn-primary" href={`/business-launchpad/evidence-workbook${query}`}
              onNavigate={(event) => { if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault(); }}>{tr('Open private evidence workbook')}</Link>
            <Link className="btn btn-primary" href={`/business-launchpad/proposal-builder${query}`}
              onNavigate={(event) => { if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault(); }}>{tr('Build a pilot proposal')}</Link>
            <Link className="btn btn-secondary" href={`/business-launchpad/results-tracker${query}`}
              onNavigate={(event) => { if (dirty && !window.confirm(tr('Discard unsaved brief and checklist changes?'))) event.preventDefault(); }}>{tr('Track pilot tests and results')}</Link>
            <TutorialLink className="btn btn-secondary" href={`/tutorials/${saved.pathId}`}>{tr('Start the tutorial')}</TutorialLink>
            <Link className="btn btn-secondary" href={`/starter-packs/${projectKitId(saved.pathId)}`}>{tr('Open the service kit')}</Link>
            <button type="button" className="btn btn-secondary" onClick={() => attempt(() => {
              downloadPilotText(buildProjectSummary(saved, tr), 'pilot-project-summary.txt');
              setNotice('Summary download requested. Only the saved project was included; review before sharing.');
            })}>{tr('Download saved project summary')}</button>
            <button type="button" className="btn btn-secondary" onClick={() => attempt(() => {
              if (!window.confirm(tr('Delete this device project, workbook revisions, saved reviews, proposal and results? Account copies, standalone drafts, learning progress and downloads remain.'))) return;
              deleteProject(localStorage, saved.id, selected.revision);
              refresh();
              window.history.replaceState(null, '', '/business-launchpad/projects');
              setNotice('Device project deleted. Account copies and downloads are unchanged.');
            })}>{tr('Delete device project')}</button>
          </div>
        </section>
      )}

      {ready && <PilotProjectAccount key={session?.user.id ?? 'guest'} userId={session?.user.id} selected={selected}
        dirty={dirty} onChanged={(id) => {
          refresh(id);
          window.history.replaceState(null, '', id ? `/business-launchpad/projects?project=${encodeURIComponent(id)}` : '/business-launchpad/projects');
          setNotice('Device projects refreshed. Review the saved data.');
        }} />}
    </div>
  );
}
