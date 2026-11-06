import { readEvidenceWorkbook, type WorkbookRevision } from '@/lib/evidence-workbook';
import { effectiveTestStatus } from '@/lib/pilot-results';
import type { PilotProject } from '@/lib/pilot-projects';

export const contentReviewChecks = [
  { id: 'facts', label: 'Facts and unknowns', instruction: 'Check Cedar Bakery facts: Tuesday-Saturday, 08:00-14:00, bread, pastries and counter collection. Flag prices, delivery and allergens as unknown; do not invent claims.' },
  { id: 'copy', label: 'Posts and FAQ quality', instruction: 'Count each of the three posts yourself: 40-60 words each. Review four FAQ answers for clarity and unsupported promises. Record the counts and remaining gaps.' },
  { id: 'access', label: 'Accessibility and asset permissions', instruction: 'Review readable wording, text alternatives and permission for each asset. A text-only workbook cannot verify external images, licences or accessibility of published pages.' },
  { id: 'revision', label: 'Corrections and version trace', instruction: 'Record requested changes, what changed and what remains unresolved. Link feedback to this saved revision; a later draft does not automatically resolve corrections.' },
  { id: 'approval', label: 'Publication and handover boundaries', instruction: 'Check the handover labels and missing owner review. Unavailable approval is blocked, not checked. Self-review never grants publication permission.' }
] as const;
export type ReviewCheckId = typeof contentReviewChecks[number]['id'];
export const reviewStatuses = ['pending', 'checked', 'needs-work', 'blocked'] as const;
export const reviewStatusLabels = {
  pending: 'Not reviewed', checked: 'Self-checked', 'needs-work': 'Needs correction', blocked: 'Blocked'
} as const;
export type ReviewCheck = {
  id: ReviewCheckId; status: typeof reviewStatuses[number]; notes: string;
  task: string; resolution: string; done: boolean;
};
export type SavedTextReview = {
  itemId: string; source: WorkbookRevision; savedAt: string; checks: ReviewCheck[];
};
export type ProjectReviewCentre = { version: 1; reviews: SavedTextReview[] };
export const emptyReviewCentre: ProjectReviewCentre = { version: 1, reviews: [] };
export const emptyReviewChecks = (): ReviewCheck[] => contentReviewChecks.map(({ id }) => ({
  id, status: 'pending', notes: '', task: '', resolution: '', done: false
}));

function invalid(): never { throw new Error('Invalid saved project review.'); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid();
  return value as Record<string, unknown>;
}
function text(value: unknown) {
  if (typeof value !== 'string' || value.length > 2000) invalid();
  return value;
}
export function readProjectReviewCentre(value: unknown): ProjectReviewCentre {
  const centre = object(value);
  if (centre.version !== 1 || !Array.isArray(centre.reviews) || centre.reviews.length > 8) invalid();
  const ids = new Set<string>();
  const reviews = centre.reviews.map((value): SavedTextReview => {
    const review = object(value);
    if (typeof review.itemId !== 'string' || !/^item-[1-8]$/.test(review.itemId) || ids.has(review.itemId)) invalid();
    ids.add(review.itemId);
    const rawSource = object(review.source);
    if (!Number.isInteger(rawSource.number) || Number(rawSource.number) < 1 || Number(rawSource.number) > 5) invalid();
    // Reuse the workbook's strict text/timestamp validator without requiring earlier revisions.
    const validated = readEvidenceWorkbook({ version: 1, items: [{
      id: review.itemId, revisions: [{ ...rawSource, number: 1 }], links: []
    }] }).items[0].revisions[0];
    if (typeof review.savedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(review.savedAt)
      || !Number.isFinite(Date.parse(review.savedAt)) || new Date(review.savedAt).toISOString() !== review.savedAt) invalid();
    if (!Array.isArray(review.checks) || review.checks.length !== contentReviewChecks.length) invalid();
    const checks = review.checks.map((value, index): ReviewCheck => {
      const check = object(value);
      if (check.id !== contentReviewChecks[index].id || !reviewStatuses.some((status) => status === check.status)
        || typeof check.done !== 'boolean') invalid();
      const notes = text(check.notes), task = text(check.task), resolution = text(check.resolution);
      if ((check.status !== 'pending' && !notes.trim()) || (check.status === 'needs-work' && !task.trim())
        || (check.done && (!task.trim() || !resolution.trim())) || (resolution.trim() && !task.trim())) invalid();
      return { id: contentReviewChecks[index].id, status: check.status as ReviewCheck['status'], notes, task, resolution, done: check.done };
    });
    return { itemId: review.itemId, source: { ...validated, number: Number(rawSource.number) }, savedAt: review.savedAt, checks };
  });
  return { version: 1, reviews };
}
export function saveTextReview(
  project: PilotProject, itemId: string, source: WorkbookRevision, checks: ReviewCheck[], savedAt: string
): ProjectReviewCentre {
  if (project.pathId !== 'ai-content-services') throw new Error('The Review Centre currently supports AI Content Services projects only.');
  const current = project.workbook?.items.find((item) => item.id === itemId)?.revisions.find((entry) => entry.number === source.number);
  if (!current || JSON.stringify(current) !== JSON.stringify(source)) throw new Error('The reviewed text changed or was removed. Reload before saving a review.');
  if (checks.some((check) => check.status !== 'pending' && !check.notes.trim())) throw new Error('Add observations for every reviewed check.');
  if (checks.some((check) => check.status === 'needs-work' && !check.task.trim())) throw new Error('Add a correction task for every check needing correction.');
  if (checks.some((check) => check.done && (!check.task.trim() || !check.resolution.trim()))) throw new Error('Record a task and correction evidence before marking it addressed.');
  if (checks.some((check) => check.resolution.trim() && !check.task.trim())) throw new Error('Add a correction task before recording correction evidence.');
  const centre = project.reviewCentre ?? emptyReviewCentre;
  return readProjectReviewCentre({
    version: 1, reviews: [...centre.reviews.filter((review) => review.itemId !== itemId), { itemId, source, checks, savedAt }]
  });
}
export function textReviewState(project: PilotProject, review: SavedTextReview) {
  const item = project.workbook?.items.find((item) => item.id === review.itemId);
  const source = item?.revisions.find((entry) => entry.number === review.source.number);
  if (!source || JSON.stringify(source) !== JSON.stringify(review.source)) return 'Reviewed text was removed or replaced. This feedback is archived, not a review of current work.';
  if (item?.revisions.at(-1)?.number !== review.source.number) return 'Newer text exists. Review the newer revision explicitly; corrections are not automatically resolved.';
  return 'Self-review refers to the current saved text. This is not independent verification or client approval.';
}
export function buildReviewHandover(project: PilotProject, selected: readonly string[], tr: (text: string) => string) {
  if (project.pathId !== 'ai-content-services') throw new Error('The Review Centre currently supports AI Content Services projects only.');
  if (!selected.length || new Set(selected).size !== selected.length) throw new Error('Select saved reviews before preparing a handover pack.');
  const centre = readProjectReviewCentre(project.reviewCentre ?? emptyReviewCentre);
  const reviews = selected.map((id) => {
    const review = centre.reviews.find((entry) => entry.itemId === id);
    if (!review) throw new Error('Selected review no longer exists. Reload before downloading.');
    return review;
  });
  return [
    tr('PRIVATE CONTENT PRACTICE HANDOVER - SELF-REVIEW, NOT CLIENT APPROVAL'),
    project.title,
    tr('Contains only selected reviewed text revisions, saved feedback and recorded test outcomes. Archived or unresolved work remains labelled. No publication permission is granted. Delete downloaded files separately.'),
    ...reviews.flatMap((review) => [
      `${review.itemId}: ${review.source.title}\n${tr('Saved revision')}: ${review.source.number} (${review.source.savedAt})`,
      tr(textReviewState(project, review)),
      review.source.body,
      `${tr('Review saved at')}: ${review.savedAt}`,
      ...review.checks.map((check, index) => [
        `${tr(contentReviewChecks[index].label)}: ${tr(reviewStatusLabels[check.status])}`,
        `${tr('Review observations')}: ${check.notes.trim() || tr('[TO CONFIRM]')}`,
        `${tr('Correction task')}: ${check.task.trim() || tr('[TO CONFIRM]')}`,
        `${tr('Correction evidence')}: ${check.resolution.trim() || tr('[TO CONFIRM]')}`,
        tr(check.done ? 'Correction self-recorded as addressed; not independently verified.' : 'Correction not recorded as addressed.')
      ].join('\n'))
    ]),
    tr('Saved test outcomes'),
    ...(project.results?.tests.map((test) => `${test.name || tr('[TO CONFIRM]')}: ${tr({
      pending: 'Not run or missing evidence', pass: 'Pass', fail: 'Fail', blocked: 'Blocked'
    }[effectiveTestStatus(test)])}`) ?? [tr('No saved test results.')]),
    `${tr('Recorded decision:')} ${project.results?.decision ? tr({ continue: 'Continue', revise: 'Revise', stop: 'Stop' }[project.results.decision]) : tr('Not decided')}`,
    `${tr('Remaining uncertainty')}: ${project.results?.notes.uncertainty.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Next actions')}: ${project.results?.notes.nextSteps.trim() || tr('[TO CONFIRM]')}`
  ].join('\n\n');
}
