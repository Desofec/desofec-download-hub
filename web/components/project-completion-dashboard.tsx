'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';
import { listProjects } from '@/lib/pilot-projects';
import { projectCompletion } from '@/lib/project-completion';

const subscribeHydration = () => () => {};
type Snapshot = {
  projects: { id: string; title: string; progress: ReturnType<typeof projectCompletion> }[];
  error: string;
};
function readProjects() {
  try {
    return JSON.stringify({
      projects: listProjects(localStorage).map(({ project }) => ({
        id: project.id, title: project.title, progress: projectCompletion(project)
      })), error: ''
    });
  } catch (error) {
    return JSON.stringify({ projects: [], error: error instanceof Error ? error.message : 'Could not read device projects. Check browser storage and retry.' });
  }
}

function subscribeProjects(callback: () => void) {
  const events = ['storage', 'focus', 'pageshow', 'desofec-project-dashboard-refresh'];
  for (const event of events) window.addEventListener(event, callback);
  return () => { for (const event of events) window.removeEventListener(event, callback); };
}

export function ProjectCompletionDashboard() {
  const tr = useTr();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  return <section className="progress-section" aria-labelledby="project-completion-heading">
    <h2 id="project-completion-heading">{tr('Your practice-project dashboard')}</h2>
    <p>{tr('Saved device projects only. Lesson checkmarks, recorded project milestones and skill verification are different things. No automatic account loading, uploads or sharing.')}</p>
    {hydrated ? <DeviceProjects /> : <p role="status">{tr('Loading...')}</p>}
  </section>;
}

function DeviceProjects() {
  const tr = useTr();
  const raw = useSyncExternalStore(subscribeProjects, readProjects, () => null);
  const snapshot = useMemo<Snapshot>(() => raw ? JSON.parse(raw) : { projects: [], error: '' }, [raw]);
  const [notice, setNotice] = useState('');

  return <>
    <div className="cta-row">
      <button type="button" className="btn btn-secondary" onClick={() => {
        window.dispatchEvent(new Event('desofec-project-dashboard-refresh'));
        setNotice('Device project records refreshed.');
      }}>{tr('Refresh project dashboard')}</button>
      <Link className="btn btn-secondary" href="/business-launchpad/projects">{tr('Open existing projects')}</Link>
      <Link className="btn btn-secondary" href="/account">{tr('Sign in')}</Link>
    </div>
    <p>{tr('Saved on another device? In the workspace, sign in, refresh account projects and explicitly load an account copy. Signing in alone does not download private projects.')}</p>
    {snapshot.error ? <p role="alert" className="proposal-error">{tr(snapshot.error)}</p> : <>
      {notice && <p role="status">{tr(notice)}</p>}
      {!snapshot.projects.length && <div className="path-card">
        <h3>{tr('Your first work sample starts here')}</h3>
        <p>{tr('No device projects yet. Start the recommended content practice, or explicitly load a saved account copy in the workspace.')}</p>
        <Link className="btn btn-primary" href="/business-launchpad/projects?path=ai-content-services">{tr('Start the guided content project')}</Link>
      </div>}
      <div className="path-grid">
        {snapshot.projects.map(({ id, title, progress }) => {
          return <article className="path-card" key={id} data-completion-project={id} style={{ overflowWrap: 'anywhere' }}>
            <h3>{title}</h3>
            <p>{tr('Recorded milestones:')} {progress.recorded} / {progress.total}</p>
            <progress max={progress.total} value={progress.recorded} aria-label={`${tr('Recorded milestones:')} ${title}`} />
            <p>{tr(progress.ready ? 'Practice record assembled - self-recorded, not independently verified.' : 'Incomplete practice draft - milestones or evidence are missing.')}</p>
            <ol>
              {progress.stages.map((stage) => <li key={stage.id}>
                {tr(stage.title)}: {tr(stage.complete ? 'Recorded milestone' : 'Evidence still needed')}
              </li>)}
            </ol>
            <p>{progress.summary
              ? <>{tr('Pass:')} {progress.summary.pass} · {tr('Fail:')} {progress.summary.fail} · {tr('Blocked:')} {progress.summary.blocked} · {tr('Not run or missing evidence:')} {progress.summary.pending}</>
              : tr('No saved test results.')}</p>
            <p>{tr('Recorded decision:')} {tr(progress.decision === 'continue' ? 'Continue' : progress.decision === 'revise' ? 'Revise' : progress.decision === 'stop' ? 'Stop' : 'Not decided')}</p>
            {(progress.decision === 'stop' || progress.decision === 'revise' || Boolean(progress.summary?.open)) &&
              <p>{tr('Keep live work paused. Review the decision, failed or blocked tests and missing evidence; recorded milestones do not resolve them.')}</p>}
            <p>{tr(progress.caseStudyStatus)}</p>
            <p>{tr(progress.nextAction)}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href={progress.nextHref}>{tr(progress.nextLabel)}</Link>
              <Link className="btn btn-secondary" href={progress.workspace}>{tr('Open project')}</Link>
            </div>
          </article>;
        })}
      </div>
    </>}
  </>;
}
