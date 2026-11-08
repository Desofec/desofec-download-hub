import {
  deleteProject,
  isProjectId,
  listProjects,
  projectByteLimit,
  projectLimit,
  projectStoragePrefix,
  readPilotProject,
  saveProject,
  type PilotProject
} from '@/lib/pilot-projects';

type ProjectStorage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

const backupFormat = 'desofec-device-projects';
export const projectBackupByteLimit = projectLimit * projectByteLimit + 4096;

function sameJsonValue(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length
      && left.every((item, index) => sameJsonValue(item, right[index]));
  }
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false;
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => key === rightKeys[index] && sameJsonValue(leftRecord[key], rightRecord[key]));
}

export function buildProjectBackup(storage: ProjectStorage): string {
  const projects = listProjects(storage).map(({ project }) => {
    let stored: unknown;
    try {
      const raw = storage.getItem(projectStoragePrefix + project.id);
      stored = raw === null ? null : JSON.parse(raw);
    } catch {
      throw new Error('A saved project contains unsupported or incompatible data. No backup was created.');
    }
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      throw new Error('A saved project contains unsupported or incompatible data. No backup was created.');
    }
    const record = stored as Record<string, unknown>;
    if (Object.keys(record).some((key) => !['project', 'revision', 'savedAt', 'cloud'].includes(key))
      || !sameJsonValue(record.project, project)) {
      throw new Error('A saved project contains unsupported or incompatible data. No backup was created.');
    }
    return project;
  });
  if (!projects.length) throw new Error('No device projects to back up.');
  return JSON.stringify({ format: backupFormat, version: 1, projects });
}

export function readProjectBackup(raw: string): PilotProject[] {
  if (new TextEncoder().encode(raw).length > projectBackupByteLimit) throw new Error('Backup file is too large.');
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error('Invalid or unsupported project backup. No projects were changed.');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid or unsupported project backup. No projects were changed.');
  }
  const backup = value as Record<string, unknown>;
  if (Object.keys(backup).some((key) => !['format', 'version', 'projects'].includes(key))
    || backup.format !== backupFormat || backup.version !== 1 || !Array.isArray(backup.projects)
    || backup.projects.length < 1 || backup.projects.length > projectLimit) {
    throw new Error('Invalid or unsupported project backup. No projects were changed.');
  }

  const projects = backup.projects.map((entry) => {
    let project: PilotProject;
    try {
      project = readPilotProject(JSON.stringify(entry));
    } catch {
      throw new Error('Invalid or unsupported project backup. No projects were changed.');
    }
    if (!sameJsonValue(project, entry)) throw new Error('Invalid or unsupported project backup. No projects were changed.');
    return project;
  });
  if (new Set(projects.map((project) => project.id)).size !== projects.length) {
    throw new Error('Invalid or unsupported project backup. No projects were changed.');
  }
  return projects;
}

export function restoreProjectBackup(storage: ProjectStorage, projects: PilotProject[], createId: () => string): string[] {
  const validated = readProjectBackup(JSON.stringify({ format: backupFormat, version: 1, projects }));
  if (listProjects(storage).length + validated.length > projectLimit) {
    throw new Error('Not enough device project slots for this backup. Existing projects were not changed.');
  }
  const copies = validated.map((project) => ({ ...project, id: createId() }));
  const ids = copies.map((project) => project.id);
  const originalIds = new Set(validated.map((project) => project.id));
  if (ids.some((id) => !isProjectId(id) || originalIds.has(id) || storage.getItem(projectStoragePrefix + id) !== null)
    || new Set(ids).size !== ids.length) {
    throw new Error('Could not create separate project copies. Try again.');
  }

  const attempted: string[] = [];
  try {
    for (const project of copies) {
      attempted.push(project.id);
      saveProject(storage, project, 0, null);
    }
  } catch {
    let cleanupFailed = false;
    for (const id of attempted) {
      try {
        if (storage.getItem(projectStoragePrefix + id) !== null) deleteProject(storage, id, 1);
      } catch {
        cleanupFailed = true;
      }
    }
    if (cleanupFailed) {
      throw new Error('Restore was interrupted and some new copies could not be removed. Check the device project list; existing projects were not replaced.');
    }
    throw new Error('Could not restore the backup. No new copies were kept; check browser storage and retry.');
  }
  return ids;
}
