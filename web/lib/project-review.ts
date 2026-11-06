import { readEvidenceWorkbook, type WorkbookRevision } from '@/lib/evidence-workbook';
import { effectiveTestStatus } from '@/lib/pilot-results';
import type { PilotProject, ServicePathId } from '@/lib/pilot-projects';

type ReviewDefinition = { id: string; label: string; instruction: string };
export const serviceReviewChecks = {
  'ai-video-business': [
    { id: 'facts', label: 'Video scripts and business facts', instruction: 'Compare scripts and captions with the supplied fictional facts. Remove unsupported prices, delivery, allergens and results.' },
    { id: 'exports', label: 'Three measured video exports', instruction: 'Record duration and resolution for all three reopened exports: 15-30 seconds inclusive, 1080 x 1920. Text or storyboards cannot verify external videos.' },
    { id: 'captions', label: 'Captions and phone readability', instruction: 'Record caption corrections, sound-off phone checks and readable text. Silent slides need complete text; self-review does not inspect the video.' },
    { id: 'rights', label: 'Video asset permissions and disclosure', instruction: 'Record asset sources, permitted use, attribution and applicable AI disclosure. Unknown terms or missing consent stay blocked.' },
    { id: 'revision', label: 'Video revisions and reopened files', instruction: 'Preserve v1, trace v2 changes and repeat export checks. An unknown price stays excluded; later text does not resolve feedback automatically.' },
    { id: 'costs', label: 'Video service scope and costs', instruction: 'Separate time and vendor costs from the proposed fee. Confirm one revision round, data boundaries and no automatic posting or earnings promises.' },
    { id: 'approval', label: 'Real owner approval before publication', instruction: 'Missing real owner review and publication permission stay blocked. A self-review or completed practice journey never grants approval.' }
  ],
  'ai-content-services': [
  { id: 'facts', label: 'Facts and unknowns', instruction: 'Check Cedar Bakery facts: Tuesday-Saturday, 08:00-14:00, bread, pastries and counter collection. Flag prices, delivery and allergens as unknown; do not invent claims.' },
  { id: 'copy', label: 'Posts and FAQ quality', instruction: 'Count each of the three posts yourself: 40-60 words each. Review four FAQ answers for clarity and unsupported promises. Record the counts and remaining gaps.' },
  { id: 'access', label: 'Accessibility and asset permissions', instruction: 'Review readable wording, text alternatives and permission for each asset. A text-only workbook cannot verify external images, licences or accessibility of published pages.' },
  { id: 'revision', label: 'Corrections and version trace', instruction: 'Record requested changes, what changed and what remains unresolved. Link feedback to this saved revision; a later draft does not automatically resolve corrections.' },
  { id: 'approval', label: 'Publication and handover boundaries', instruction: 'Check the handover labels and missing owner review. Unavailable approval is blocked, not checked. Self-review never grants publication permission.' }
  ],
  'ai-automation-services': [
    { id: 'scope', label: 'Trigger, scope and data boundaries', instruction: 'Check the exact allowed event and required fields. Confirm no real inbox, personal data or live messages are involved; flag retention, access and exclusions.' },
    { id: 'queue', label: 'Queue records and duplicate events', instruction: 'Check stable event IDs, duplicate handling, queue-write success and visible status. Never count an event as queued if persistence failed.' },
    { id: 'failure', label: 'Failure, retry and recovery', instruction: 'Review a failed queue write, visible alert, bounded retry and safe recovery. Confirm retries do not duplicate or silently drop work.' },
    { id: 'fallback', label: 'Off switch and manual fallback', instruction: 'Check the reachable off switch and manual process. Verify the practice plan never sends messages or acts on a live account.' },
    { id: 'access', label: 'Access, spending and retention', instruction: 'Review least-privilege access, revocation, spending caps and retention limits. Flag any setting or credential that has not been verified.' },
    { id: 'approval', label: 'Human review and handover boundaries', instruction: 'Check who reviews every draft and how approval is recorded. A self-review does not authorize dispatch or customer-side automation.' }
  ],
  'ai-cad-services': [
    { id: 'dimensions', label: 'Dimensions and stated assumptions', instruction: 'Check units and the supplied concept measurements: 80 x 40 x 3 mm, revised width 90 mm. Record arithmetic only; it is not strength or safety validation.' },
    { id: 'views', label: 'Views and geometry consistency', instruction: 'Compare front, top and side views with the stated dimensions and 2.25 width ratio. Flag mismatches and any missing view.' },
    { id: 'revision', label: 'Revision and reopened exports', instruction: 'Confirm v1 is preserved, v2 changes only the intended dimension, and exported files were reopened and inspected. An export that was not reopened remains unverified.' },
    { id: 'licensing', label: 'Tool licensing and attribution', instruction: 'Record the tool version, export format, licence and attribution requirements. Flag commercial-use terms that still need confirmation.' },
    { id: 'safety', label: 'Manufacturing and qualified review boundary', instruction: 'Confirm every handover is labelled concept-only and not for manufacture. Flag any implied structural, safety or qualified engineering approval.' }
  ],
  'micro-saas-validation': [
    { id: 'output', label: 'Output and boundary cases', instruction: 'Check the exact two-line Project/Status output, trimmed 1-40 character input, blank input and forced 41-character case. Do not infer behaviour from an unrun case.' },
    { id: 'injection', label: 'Markup and rendering safety', instruction: 'Check markup is rendered as text, not interpreted, and invalid status values do not create unsupported output. This review does not replace security testing.' },
    { id: 'privacy', label: 'Network, storage and data handling', instruction: 'Confirm this prototype sends no network requests and stores no user data. Flag any undisclosed telemetry, persistence, login or external dependency.' },
    { id: 'demand', label: 'Observed demand and validation status', instruction: 'Separate actual anonymised demand evidence from assumptions. Mark demand UNVALIDATED when no real evidence exists; do not claim product-market fit.' },
    { id: 'operations', label: 'Costs and production readiness', instruction: 'List unknown future costs, reliability, accessibility, support and operational gaps. A local demo is not a production-ready paid service.' }
  ],
  'ai-education-services': [
    { id: 'accuracy', label: 'Supported facts and answer key', instruction: 'Check each statement against the supplied source. Label claims supported, contradicted or unknown; an unknown certificate or outcome must remain unknown.' },
    { id: 'timing', label: 'Activity timing and learning objective', instruction: 'Check the 3+5+4+3-minute plan against an actual rehearsal. Record measured duration and gaps; a plan alone is not observed timing.' },
    { id: 'access', label: 'Accessibility and original materials', instruction: 'Check readable source text, text alternatives and original-work provenance. Flag permission, accessibility or factual claims you could not verify.' },
    { id: 'safeguarding', label: 'Adult-only privacy and consent boundaries', instruction: 'Confirm no learner names, scores, recordings or sensitive data are collected. Any optional trial must be with consenting adults and safely scoped.' },
    { id: 'review', label: 'Independent review and credential boundary', instruction: 'Record whether an independent subject reviewer is actually available. A self-review or attendance record is not a qualification, accreditation or certification.' }
  ]
} satisfies Record<ServicePathId, readonly ReviewDefinition[]>;
export const contentReviewChecks = serviceReviewChecks['ai-content-services'];
export const checksForService = (pathId: ServicePathId) => serviceReviewChecks[pathId];
export type ReviewCheckId = typeof contentReviewChecks[number]['id']
  | typeof serviceReviewChecks['ai-automation-services'][number]['id']
  | typeof serviceReviewChecks['ai-cad-services'][number]['id']
  | typeof serviceReviewChecks['micro-saas-validation'][number]['id']
  | typeof serviceReviewChecks['ai-education-services'][number]['id']
  | typeof serviceReviewChecks['ai-video-business'][number]['id'];
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
export const emptyReviewChecks = (pathId: ServicePathId = 'ai-content-services'): ReviewCheck[] => checksForService(pathId).map(({ id }) => ({
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
export function readProjectReviewCentre(value: unknown, pathId: ServicePathId = 'ai-content-services'): ProjectReviewCentre {
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
    const definitions = checksForService(pathId);
    if (!Array.isArray(review.checks) || review.checks.length !== definitions.length) invalid();
    const checks = review.checks.map((value, index): ReviewCheck => {
      const check = object(value);
      if (check.id !== definitions[index].id || !reviewStatuses.some((status) => status === check.status)
        || typeof check.done !== 'boolean') invalid();
      const notes = text(check.notes), task = text(check.task), resolution = text(check.resolution);
      if ((check.status !== 'pending' && !notes.trim()) || (check.status === 'needs-work' && !task.trim())
        || (check.done && (check.status !== 'needs-work' || !task.trim() || !resolution.trim()))
        || (resolution.trim() && !task.trim())) invalid();
      return { id: definitions[index].id as ReviewCheckId, status: check.status as ReviewCheck['status'], notes, task, resolution, done: check.done };
    });
    return { itemId: review.itemId, source: { ...validated, number: Number(rawSource.number) }, savedAt: review.savedAt, checks };
  });
  return { version: 1, reviews };
}
export function saveTextReview(
  project: PilotProject, itemId: string, source: WorkbookRevision, checks: ReviewCheck[], savedAt: string
): ProjectReviewCentre {
  const current = project.workbook?.items.find((item) => item.id === itemId)?.revisions.find((entry) => entry.number === source.number);
  if (!current || JSON.stringify(current) !== JSON.stringify(source)) throw new Error('The reviewed text changed or was removed. Reload before saving a review.');
  if (checks.some((check) => check.status !== 'pending' && !check.notes.trim())) throw new Error('Add observations for every reviewed check.');
  if (checks.some((check) => check.status === 'needs-work' && !check.task.trim())) throw new Error('Add a correction task for every check needing correction.');
  if (checks.some((check) => check.done && (check.status !== 'needs-work' || !check.task.trim() || !check.resolution.trim()))) throw new Error('Keep the check marked as needing correction and record its task and correction evidence before marking it addressed.');
  if (checks.some((check) => check.resolution.trim() && !check.task.trim())) throw new Error('Add a correction task before recording correction evidence.');
  const centre = project.reviewCentre ?? emptyReviewCentre;
  return readProjectReviewCentre({
    version: 1, reviews: [...centre.reviews.filter((review) => review.itemId !== itemId), { itemId, source, checks, savedAt }]
  }, project.pathId);
}
export function textReviewState(project: PilotProject, review: SavedTextReview) {
  const item = project.workbook?.items.find((item) => item.id === review.itemId);
  const source = item?.revisions.find((entry) => entry.number === review.source.number);
  if (!source || JSON.stringify(source) !== JSON.stringify(review.source)) return 'Reviewed text was removed or replaced. This feedback is archived, not a review of current work.';
  if (item?.revisions.at(-1)?.number !== review.source.number) return 'Newer text exists. Review the newer revision explicitly; corrections are not automatically resolved.';
  return 'Self-review refers to the current saved text. This is not independent verification or client approval.';
}
export function buildReviewHandover(project: PilotProject, selected: readonly string[], tr: (text: string) => string) {
  if (!selected.length || new Set(selected).size !== selected.length) throw new Error('Select saved reviews before preparing a handover pack.');
  const centre = readProjectReviewCentre(project.reviewCentre ?? emptyReviewCentre, project.pathId);
  const definitions = checksForService(project.pathId);
  const reviews = selected.map((id) => {
    const review = centre.reviews.find((entry) => entry.itemId === id);
    if (!review) throw new Error('Selected review no longer exists. Reload before downloading.');
    return review;
  });
  return [
    tr(project.pathId === 'ai-content-services'
      ? 'PRIVATE CONTENT PRACTICE HANDOVER - SELF-REVIEW, NOT CLIENT APPROVAL'
      : 'PRIVATE SERVICE PRACTICE HANDOVER - SELF-REVIEW, NOT CLIENT APPROVAL'),
    project.title,
    tr('Contains only selected reviewed text revisions, saved feedback and recorded test outcomes. Archived or unresolved work remains labelled. No publication permission is granted. Delete downloaded files separately.'),
    ...reviews.flatMap((review) => [
      `${review.itemId}: ${review.source.title}\n${tr('Saved revision')}: ${review.source.number} (${review.source.savedAt})`,
      tr(textReviewState(project, review)),
      review.source.body,
      `${tr('Review saved at')}: ${review.savedAt}`,
      ...review.checks.map((check, index) => [
        `${tr(definitions[index].label)}: ${tr(reviewStatusLabels[check.status])}`,
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
