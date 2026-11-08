'use client';

import { useRef, useState } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  buildProjectBackup, projectBackupByteLimit, readProjectBackup, restoreProjectBackup
} from '@/lib/project-backup';
import { withProjectLock, type PilotProject } from '@/lib/pilot-projects';

export function ProjectBackup({ projectCount, onRestored }: { projectCount: number; onRestored: () => void }) {
  const tr = useTr();
  const [backup, setBackup] = useState<PilotProject[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const working = useRef(false);

  const run = async (action: () => Promise<void>, fallback: string) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : fallback);
    } finally {
      working.current = false;
      setBusy(false);
    }
  };

  return (
    <section className="proposal-controls" aria-labelledby="project-backup-heading">
      <h3 id="project-backup-heading">{tr('Back up saved device projects')}</h3>
      <p id="project-backup-privacy">{tr('This unencrypted file contains all saved project details, including drafts, costs, test results, workbook revisions and reviews. Keep it private and store it securely.')}</p>
      <p>{tr('Only saved device projects are included, not unsaved changes, standalone drafts, learning progress or account snapshots. Restore creates new device copies; nothing is uploaded or overwritten.')}</p>
      <p>{tr('Restored copies have new project IDs and are not linked to account snapshots. Links entered in saved text remain unchanged.')}</p>
      <button type="button" className="btn btn-secondary" disabled={busy || projectCount === 0} onClick={() => void run(async () => {
        const content = await withProjectLock(() => buildProjectBackup(localStorage));
        downloadPilotText(content, 'desofec-project-backup.json', 'application/json;charset=utf-8');
        setNotice(tr('Backup download requested. Keep the unencrypted file private.'));
      }, 'Could not create the backup. Check browser storage and retry.')}>
        {tr('Download project backup')}
      </button>
      <div className="form-group">
        <label htmlFor="project-backup-file">{tr('Choose a project backup file')}</label>
        <input id="project-backup-file" type="file" accept=".json,application/json" disabled={busy}
          aria-describedby="project-backup-privacy" onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (!file) return;
            setBackup(null);
            void run(async () => {
              if (file.size > projectBackupByteLimit) throw new Error('Backup file is too large.');
              let content: string;
              try {
                content = await file.text();
              } catch {
                throw new Error('Could not read the backup file. Check the file and retry.');
              }
              setBackup(readProjectBackup(content));
            }, 'Could not read the backup file. Check the file and retry.');
          }} />
      </div>
      {backup && (
        <div>
          <p>{tr('Projects in backup: {count}', { count: backup.length })}</p>
          <ul>{backup.map((project) => <li key={project.id}>{project.title}</li>)}</ul>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => {
            const confirmation = backup.length === 1
              ? tr('Restore 1 saved project as a new device copy? Existing projects and account snapshots will not be changed.')
              : tr('Restore {count} saved projects as new device copies? Existing projects and account snapshots will not be changed.', { count: backup.length });
            if (!window.confirm(confirmation)) return;
            void run(async () => {
              const ids = await withProjectLock(() => restoreProjectBackup(localStorage, backup, () => crypto.randomUUID()));
              setBackup(null);
              try {
                onRestored();
              } catch {
                throw new Error('Backup restored, but the project list could not be refreshed. Reload the page.');
              }
              setNotice(ids.length === 1
                ? tr('Restored 1 project copy on this device. Nothing was uploaded.')
                : tr('Restored {count} project copies on this device. Nothing was uploaded.', { count: ids.length }));
            }, 'Could not restore the backup. Check browser storage and retry.');
          }}>{tr('Restore as new device copies')}</button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    </section>
  );
}
