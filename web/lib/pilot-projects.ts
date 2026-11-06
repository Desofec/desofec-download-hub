import { emptyProposalInputs, readProposalDraft, type ProposalDraft } from '@/lib/pilot-proposal';
import { emptyPilotResults, readPilotResults, resultTestSummary, type PilotResults } from '@/lib/pilot-results';
import { readEvidenceWorkbook, type EvidenceWorkbook } from '@/lib/evidence-workbook';
import { readProjectReviewCentre, type ProjectReviewCentre } from '@/lib/project-review';
import { automationScenarioLabels, isAutomationScenario, type AutomationScenario } from '@/lib/automation-projects';
import { readCaseStudy, type CaseStudy } from '@/lib/case-study';

export const projectStoragePrefix = 'desofec:pilot-project:v1:';
export const projectLimit = 10;
export const projectByteLimit = 1000000;
export const servicePathIds = [
  'ai-automation-services', 'ai-content-services', 'ai-cad-services',
  'micro-saas-validation', 'ai-education-services', 'ai-video-business', 'ai-spreadsheets'
] as const;
export type ServicePathId = typeof servicePathIds[number];
export const projectBriefFields = [
  { key: 'objective', label: 'Practice objective and evidence' },
  { key: 'scope', label: 'Deliverables and exclusions' },
  { key: 'review', label: 'Review role, missing evidence and next review date' }
] as const;
export const projectMilestones = [
  { id: 'brief', label: 'Separate facts, assumptions and unknowns in the brief.' },
  { id: 'scope', label: 'Define deliverables, exclusions and human review.' },
  { id: 'evidence', label: 'Record actual test evidence and unresolved issues.' },
  { id: 'review', label: 'Record the review decision without inventing approval.' },
  { id: 'handover', label: 'Prepare versioned handover materials and next actions.' }
] as const;
type MilestoneId = typeof projectMilestones[number]['id'];
export type PilotProject = {
  version: 1;
  id: string;
  pathId: ServicePathId;
  automationScenario?: AutomationScenario;
  title: string;
  brief: Record<typeof projectBriefFields[number]['key'], string>;
  completed: MilestoneId[];
  proposal: ProposalDraft | null;
  results: PilotResults | null;
  workbook?: EvidenceWorkbook;
  reviewCentre?: ProjectReviewCentre;
  caseStudy?: CaseStudy;
};
export type StoredProject = {
  project: PilotProject;
  revision: number;
  savedAt: string;
  cloud: { userId: string; version: number } | null;
};
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

export function withProjectLock<T>(action: () => T): Promise<T> {
  if (!navigator.locks) return Promise.reject(new Error('This browser cannot safely coordinate project saves. Use a current browser.'));
  return navigator.locks.request('desofec:pilot-projects', action);
}

export function isProjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid project data.');
  return value as Record<string, unknown>;
}

export function readPilotProject(raw: string): PilotProject {
  if (new TextEncoder().encode(raw).length > projectByteLimit) throw new Error('Project exceeds the storage limit.');
  const value = record(JSON.parse(raw));
  if (value.version !== 1 || !isProjectId(value.id)
    || !servicePathIds.some((id) => id === value.pathId)
    || typeof value.title !== 'string' || !value.title.trim() || value.title.length > 120
    || !Array.isArray(value.completed) || value.completed.length > projectMilestones.length
    || new Set(value.completed).size !== value.completed.length
    || !value.completed.every((id) => projectMilestones.some((item) => item.id === id))) {
    throw new Error('Invalid project data.');
  }
  const brief = record(value.brief);
  if ('automationScenario' in value
    && (value.pathId !== 'ai-automation-services' || !isAutomationScenario(value.automationScenario))) {
    throw new Error('Invalid automation project choice.');
  }
  for (const { key } of projectBriefFields) {
    if (typeof brief[key] !== 'string' || brief[key].length > 2000) throw new Error('Invalid project data.');
  }
  return {
    version: 1, id: value.id, pathId: value.pathId as ServicePathId, title: value.title,
    ...(isAutomationScenario(value.automationScenario) ? { automationScenario: value.automationScenario } : {}),
    brief: { objective: String(brief.objective), scope: String(brief.scope), review: String(brief.review) },
    completed: value.completed as MilestoneId[],
    proposal: value.proposal === null ? null : readProposalDraft(JSON.stringify(value.proposal)),
    results: value.results === null ? null : readPilotResults(JSON.stringify(value.results)),
    ...('workbook' in value ? { workbook: readEvidenceWorkbook(value.workbook) } : {}),
    ...('reviewCentre' in value ? { reviewCentre: readProjectReviewCentre(value.reviewCentre, value.pathId as ServicePathId) } : {}),
    ...('caseStudy' in value ? { caseStudy: readCaseStudy(value.caseStudy) } : {})
  };
}

export function newPilotProject(id: string, pathId: ServicePathId, title: string, automationScenario?: AutomationScenario): PilotProject {
  return readPilotProject(JSON.stringify({
    version: 1, id, pathId, title: title.trim(), brief: { objective: '', scope: '', review: '' },
    completed: [], proposal: null, results: null, ...(automationScenario !== undefined ? { automationScenario } : {})
  }));
}

function readStoredProject(raw: string): StoredProject {
  if (raw.length > projectByteLimit + 2000) throw new Error('Invalid project data.');
  const value = record(JSON.parse(raw));
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 1
    || typeof value.savedAt !== 'string' || !Number.isFinite(Date.parse(value.savedAt))) throw new Error('Invalid project data.');
  let cloud: StoredProject['cloud'] = null;
  if (value.cloud !== null) {
    const meta = record(value.cloud);
    if (!isProjectId(meta.userId) || !Number.isSafeInteger(meta.version) || Number(meta.version) < 1) throw new Error('Invalid project data.');
    cloud = { userId: meta.userId, version: Number(meta.version) };
  }
  return { project: readPilotProject(JSON.stringify(value.project)), revision: Number(value.revision), savedAt: value.savedAt, cloud };
}

export function loadProject(storage: Storage, id: string): StoredProject {
  if (!isProjectId(id)) throw new Error('Invalid project link.');
  const raw = storage.getItem(projectStoragePrefix + id);
  if (raw === null) throw new Error('Project not found on this device. Load an account copy from the workspace if you saved one.');
  const saved = readStoredProject(raw);
  if (saved.project.id !== id) throw new Error('Invalid project data.');
  return saved;
}

export function listProjects(storage: Storage): StoredProject[] {
  const projects: StoredProject[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(projectStoragePrefix)) projects.push(loadProject(storage, key.slice(projectStoragePrefix.length)));
  }
  return projects.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveProject(storage: Storage, project: PilotProject, expectedRevision: number, cloud?: StoredProject['cloud']): StoredProject {
  const valid = readPilotProject(JSON.stringify(project));
  const key = projectStoragePrefix + valid.id;
  const exists = storage.getItem(key) !== null;
  const current = exists ? loadProject(storage, valid.id) : null;
  if ((current?.revision ?? 0) !== expectedRevision) throw new Error('Project changed in another tab. Reload it before saving.');
  if (current && (current.project.automationScenario ?? 'enquiries') !== (valid.automationScenario ?? 'enquiries')) {
    throw new Error('Automation project choice cannot change. Create a separate practice project.');
  }
  if (!current && listProjects(storage).length >= projectLimit) throw new Error('Project limit reached. Delete a device copy before creating or loading another.');
  const saved = readStoredProject(JSON.stringify({
    project: valid, revision: expectedRevision + 1, savedAt: new Date().toISOString(),
    cloud: cloud === undefined ? current?.cloud ?? null : cloud
  }));
  storage.setItem(key, JSON.stringify(saved));
  return saved;
}

export function deleteProject(storage: Storage, id: string, expectedRevision: number) {
  if (loadProject(storage, id).revision !== expectedRevision) throw new Error('Project changed in another tab. Reload it before saving.');
  storage.removeItem(projectStoragePrefix + id);
}

export function saveProjectPart<K extends 'proposal' | 'results' | 'workbook' | 'reviewCentre' | 'caseStudy'>(
  storage: Storage, id: string, key: K, value: PilotProject[K], expectedPart: string
) {
  const saved = loadProject(storage, id);
  if (JSON.stringify(saved.project[key] ?? null) !== expectedPart) throw new Error('This project draft changed. Reload the project draft before replacing it.');
  return saveProject(storage, { ...saved.project, [key]: value }, saved.revision);
}

export function projectProposalSeed(project: PilotProject): ProposalDraft {
  return {
    version: 1, inputs: {
      ...emptyProposalInputs(), title: project.title, problem: project.brief.objective,
      scope: project.brief.scope, reviewer: project.brief.review
    }, document: '', source: ''
  };
}

export function projectResultsSeed(project: PilotProject): PilotResults {
  const results = emptyPilotResults();
  return { ...results, notes: { ...results.notes, title: project.title, objective: project.brief.objective, uncertainty: project.brief.review } };
}

export function projectProposalReady(project: PilotProject) {
  if (!project.proposal?.document.trim() || !project.proposal.source) return false;
  try {
    const source = record(JSON.parse(project.proposal.source));
    return JSON.stringify(source.inputs) === JSON.stringify(project.proposal.inputs);
  } catch {
    return false;
  }
}

export function projectNextAction(project: PilotProject) {
  if (projectBriefFields.some(({ key }) => !project.brief[key].trim())) return 'Complete the project brief and list missing evidence.';
  if (!projectProposalReady(project)) return 'Prepare or regenerate the proposal, then save it to this project.';
  const summary = project.results ? resultTestSummary(project.results.tests) : null;
  if (!summary || !project.results?.decision || !project.results.notes.rationale.trim()
    || !project.results.notes.nextSteps.trim() || !project.results.notes.uncertainty.trim()) {
    return 'Record tests, unresolved issues and a reasoned decision in the results tracker.';
  }
  if (project.results.decision === 'stop') return 'Stop recorded. Keep live work paused and document closure or a new discovery question.';
  if (project.results.decision === 'revise') return 'Revision recorded. Address unresolved issues and record new test evidence before reconsidering.';
  if (summary.open) return 'Review unresolved tests and missing evidence before any next step.';
  if (project.completed.length < projectMilestones.length) return 'Review the project checklist and prepare the handover.';
  return 'Review the saved evidence and next actions. Checklist completion is not approval for live work.';
}

export function buildProjectSummary(project: PilotProject, tr: (text: string) => string) {
  const summary = project.results ? resultTestSummary(project.results.tests) : null;
  return [
    tr('INTERNAL PRACTICE PROJECT SUMMARY - NOT CLIENT APPROVAL'),
    project.title, project.pathId,
    ...(project.pathId === 'ai-automation-services' ? [tr(automationScenarioLabels[project.automationScenario ?? 'enquiries'])] : []),
    ...projectBriefFields.map(({ key, label }) => `${tr(label)}\n${project.brief[key].trim() || tr('[TO CONFIRM]')}`),
    tr('Project checklist'),
    ...projectMilestones.map((item) => `${project.completed.includes(item.id) ? '[x]' : '[ ]'} ${tr(item.label)}`),
    `${tr('Proposal document:')} ${tr(projectProposalReady(project) ? 'Saved draft; review before sharing.' : 'Missing or needs regeneration.')}`,
    summary ? `${tr('Recorded tests:')} ${summary.total}; ${tr('Pass:')} ${summary.pass}; ${tr('Fail:')} ${summary.fail}; ${tr('Blocked:')} ${summary.blocked}; ${tr('Not run or missing evidence:')} ${summary.pending}` : tr('No saved test results.'),
    `${tr('Recorded decision:')} ${project.results?.decision ? tr(project.results.decision === 'continue' ? 'Continue' : project.results.decision === 'revise' ? 'Revise' : 'Stop') : tr('Not decided')}`,
    project.results?.notes.rationale || tr('[TO CONFIRM]'),
    project.results?.notes.uncertainty || tr('[TO CONFIRM]'),
    project.results?.notes.nextSteps || tr('[TO CONFIRM]'),
    tr(projectNextAction(project)),
    tr('This summary omits financial fields and full drafts. Review all user-entered text before sharing. No earnings, engineering or learning-outcome guarantee.')
  ].join('\n\n');
}
