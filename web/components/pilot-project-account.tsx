'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTr } from '@/components/tr';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { isProjectId, loadProject, projectStoragePrefix, readPilotProject, saveProject, withProjectLock, type PilotProject, type StoredProject } from '@/lib/pilot-projects';

type CloudProject = { id: string; version: number; project: PilotProject };

export function PilotProjectAccount({ userId, selected, dirty, onChanged }: {
  userId?: string; selected: StoredProject | null; dirty: boolean; onChanged: (id?: string) => void;
}) {
  const tr = useTr();
  const [consentFor, setConsentFor] = useState<string | null>(null);
  const consent = Boolean(selected && consentFor === selected.project.id);
  const [rows, setRows] = useState<CloudProject[]>([]);
  const [listed, setListed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const active = useRef(true);
  const working = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  const run = async (action: (client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>, owner: string, authorization: string) => Promise<void>) => {
    if (working.current) return;
    setError('');
    setNotice('');
    working.current = true;
    setBusy(true);
    try {
      const client = getSupabaseBrowserClient();
      if (!client || !userId) throw new Error('Sign in to use private account snapshots.');
      const { data, error } = await client.auth.getSession();
      if (error || data.session?.user.id !== userId) throw new Error('Your sign-in changed. Reload before continuing.');
      if (!active.current) return;
      await action(client, userId, `Bearer ${data.session.access_token}`);
    } catch (error) {
      if (active.current) setError(error instanceof Error ? error.message : 'Account operation failed. Your device copy is unchanged. Check the connection and required migration.');
    } finally {
      working.current = false;
      if (active.current) setBusy(false);
    }
  };

  return (
    <section className="proposal-controls" aria-labelledby="account-projects">
      <h2 id="account-projects">{tr('Optional private account snapshots')}</h2>
      <p>{tr('Signing in does not upload projects. An account snapshot includes the saved brief, checklist, full proposal including internal costs, and test results. Only your account can read it; this is not end-to-end encryption.')}</p>
      <p>{tr('If this project has a workbook, the account snapshot also includes complete saved text, every retained revision and test references. Review older revisions too before consenting to upload.')}</p>
      <p>{tr('Saved project reviews also include observations, correction tasks and separate copies of reviewed text, including text removed from the workbook. Upload consent includes these records; review and delete sensitive copies separately before uploading.')}</p>
      <p>{tr('If saved, the case study narrative and selected test identifiers are also included in account upload consent. Delete sensitive case study text before uploading.')}</p>
      <p>{tr('Saved discovery briefs, fit evidence and proposed changes are also included in account upload consent. Review these texts before uploading.')}</p>
      <p>{tr('There is no background sync or merging. Upload and load explicitly on each device. Version conflicts block overwrites. Delete account and device copies separately; downloaded files remain.')}</p>
      {!userId ? <Link className="btn btn-secondary" href="/account">{tr('Sign in to use private account snapshots.')}</Link> : <>
        <label className="project-check">
          <input type="checkbox" checked={consent} onChange={(event) => setConsentFor(event.target.checked ? selected?.project.id ?? null : null)} disabled={!selected} />
          <span>{tr('I agree to upload this saved project, including costs, test evidence, workbook revisions, reviews, copied review text, case studies and discovery drafts, to my private account when I press Upload.')}</span>
        </label>
        <p>{tr('Save brief and checklist changes before uploading. Only saved device data is uploaded.')}</p>
        <div className="cta-row">
          <button type="button" className="btn btn-primary" disabled={busy || !selected || !consent || dirty}
            onClick={() => void run(async (client, owner, authorization) => {
              if (!selected) return;
              const current = loadProject(localStorage, selected.project.id);
              if (current.revision !== selected.revision) throw new Error('Project changed in another tab. Reload it before saving.');
              const version = current.cloud?.userId === owner ? current.cloud.version : 0;
              const { data, error } = await client.rpc('save_pilot_project', {
                _id: current.project.id, _document: current.project, _expected_version: version
              }).setHeader('Authorization', authorization);
              if (error) throw new Error('Account upload failed. Check your connection and migration 0011. If this project exists or changed on another device, refresh the account list and load its latest copy first.');
              if (!Number.isSafeInteger(data) || data < 1) throw new Error('Invalid account response. Refresh the account list to check whether the upload completed.');
              if (!active.current) return;
              try {
                await withProjectLock(() => {
                  if (!active.current) return;
                  const latest = loadProject(localStorage, current.project.id);
                  saveProject(localStorage, latest.project, latest.revision, { userId: owner, version: data });
                  onChanged(current.project.id);
                });
              } catch {
                throw new Error('Account upload completed, but device metadata could not be updated. Refresh the account list and load the uploaded snapshot before uploading again.');
              }
              if (!active.current) return;
              setRows([]);
              setListed(false);
              setConsentFor(null);
              setNotice('Saved project uploaded. Later changes stay on this device until another explicit upload.');
            })}>{tr('Upload saved project to my account')}</button>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void run(async (client, owner, authorization) => {
            const { data, error } = await client.from('pilot_projects').select('id, version, document').eq('user_id', owner).order('updated_at', { ascending: false }).limit(11).setHeader('Authorization', authorization);
            if (error) throw new Error('Could not read account projects. Check your connection and migration 0011.');
            if (!Array.isArray(data) || data.length > 10) throw new Error('Invalid account project list.');
            const valid: CloudProject[] = data.map((row) => {
              const project = readPilotProject(JSON.stringify(row.document));
              if (!isProjectId(row.id) || row.id !== project.id || !Number.isSafeInteger(row.version) || row.version < 1) throw new Error('Invalid account project list.');
              return { id: row.id, version: row.version, project };
            });
            if (!active.current) return;
            setRows(valid);
            setListed(true);
            setNotice('Account list refreshed. No device projects were replaced.');
          })}>{tr('Refresh account projects')}</button>
        </div>
        {listed && !rows.length && <p>{tr('No account projects found.')}</p>}
        {rows.map((row) => (
          <article className="path-card" key={row.id}>
            <h3>{row.project.title}</h3>
            <p>{tr('Account version:')} {row.version}</p>
            <div className="cta-row">
              <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void run(async (_client, owner) => {
                if (!window.confirm(tr('Load this account snapshot onto this device? Any device copy of this project and unsaved workspace changes will be replaced. Other projects and standalone drafts remain.'))) return;
                await withProjectLock(() => {
                  if (!active.current) return;
                  let revision = 0;
                  const raw = localStorage.getItem(projectStoragePrefix + row.id);
                  if (raw !== null) revision = loadProject(localStorage, row.id).revision;
                  saveProject(localStorage, row.project, revision, { userId: owner, version: row.version });
                  onChanged(row.id);
                });
                if (!active.current) return;
                setNotice('Account snapshot loaded onto this device. Changes require explicit saving and uploading.');
              })}>{tr('Load account copy onto device')}</button>
              <button type="button" className="btn btn-secondary" disabled={busy || dirty} onClick={() => void run(async (client, owner, authorization) => {
                if (!window.confirm(tr('Delete this account snapshot? Device projects and downloaded files remain. This cannot be undone.'))) return;
                const { error } = await client.rpc('delete_pilot_project', { _id: row.id, _expected_version: row.version }).setHeader('Authorization', authorization);
                if (error) throw new Error('Could not delete the account snapshot. Refresh the account list and retry; it may have changed.');
                if (!active.current) return;
                setRows((current) => current.filter((entry) => entry.id !== row.id));
                setNotice('Account snapshot deleted. Device copies and downloads remain. Refresh the account list before any further changes.');
                try {
                  await withProjectLock(() => {
                    if (!active.current) return;
                    if (localStorage.getItem(projectStoragePrefix + row.id) !== null) {
                      const device = loadProject(localStorage, row.id);
                      if (device.cloud?.userId === owner) {
                        saveProject(localStorage, device.project, device.revision, null);
                        onChanged(selected?.project.id);
                      }
                    }
                  });
                } catch {
                  throw new Error('Account snapshot was deleted, but device metadata could not be updated. Refresh device projects and check browser storage before re-uploading.');
                }
              })}>{tr('Delete account snapshot')}</button>
            </div>
          </article>
        ))}
      </>}
      <p role="status">{tr(busy ? 'Working...' : notice)}</p>
      {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    </section>
  );
}
