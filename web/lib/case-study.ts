import type { PilotProject } from '@/lib/pilot-projects';
import { effectiveTestStatus, resultStatuses, resultTestSummary } from '@/lib/pilot-results';

export const caseStudyFields = [
  { key: 'title', label: 'Case study title', limit: 120 },
  { key: 'problem', label: 'Problem and practice context', limit: 2000 },
  { key: 'approach', label: 'Approach and your contribution', limit: 2000 },
  { key: 'outcome', label: 'Observed outcome, not promised impact', limit: 2000 },
  { key: 'learning', label: 'Limitations, learning and next steps', limit: 2000 }
] as const;

export type CaseStudy = {
  version: 1;
  text: Record<typeof caseStudyFields[number]['key'], string>;
  testIds: string[];
};
export type CaseStudySection = { heading: string; body: string };

export function emptyCaseStudy(): CaseStudy {
  return { version: 1, text: { title: '', problem: '', approach: '', outcome: '', learning: '' }, testIds: [] };
}

export function readCaseStudy(value: unknown): CaseStudy {
  const invalid = () => new Error('Invalid saved case study.');
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid();
  const record = value as Record<string, unknown>;
  if (record.version !== 1 || !record.text || typeof record.text !== 'object' || Array.isArray(record.text)
    || !Array.isArray(record.testIds) || record.testIds.length > 20
    || new Set(record.testIds).size !== record.testIds.length
    || !record.testIds.every((id) => typeof id === 'string' && /^test-([1-9]|1\d|20)$/.test(id))) throw invalid();
  const text = record.text as Record<string, unknown>;
  const draft = emptyCaseStudy();
  for (const field of caseStudyFields) {
    const content = text[field.key];
    if (typeof content !== 'string' || content.length > field.limit) throw invalid();
    draft.text[field.key] = content;
  }
  draft.testIds = [...record.testIds];
  return draft;
}

export function caseStudyFromBrief(project: PilotProject): CaseStudy {
  return {
    version: 1,
    text: {
      title: project.title, problem: project.brief.objective, approach: project.brief.scope,
      outcome: '', learning: project.brief.review
    },
    testIds: []
  };
}

export function buildCaseStudy(
  project: PilotProject, coverage: readonly { code: string; recorded: boolean }[],
  journeyReady: boolean, boundary: string, tr: (text: string) => string
): CaseStudySection[] {
  if (!project.caseStudy) throw new Error('Save a case study before exporting.');
  const draft = readCaseStudy(project.caseStudy);
  const tests = project.results?.tests ?? [];
  const summary = resultTestSummary(tests);
  const reviews = project.reviewCentre?.reviews ?? [];
  const openReviews = reviews.flatMap((review) => review.checks).filter((check) => check.status !== 'checked').length;
  const missing = coverage.filter((check) => !check.recorded);
  const unknown = tr('[TO CONFIRM]');
  const status = (value: typeof resultStatuses[number]['value']) =>
    tr(resultStatuses.find((entry) => entry.value === value)!.label);
  const sections: CaseStudySection[] = [
    { heading: tr('FICTIONAL PRACTICE CASE STUDY'), body: tr('Self-written narrative and self-recorded evidence. Not verified client work, certification, approval or a guarantee of employment, income or savings.') },
    { heading: tr('Case study title'), body: draft.text.title.trim() || unknown },
    { heading: tr('Service boundary'), body: `${project.pathId}\n${boundary}` },
    ...caseStudyFields.slice(1).map((field) => ({ heading: tr(field.label), body: draft.text[field.key].trim() || unknown })),
    {
      heading: tr('Whole-project evidence status'),
      body: [
        tr(journeyReady ? 'Recorded milestone' : 'Evidence still needed'),
        `${tr('Recorded tests:')} ${summary.total}; ${tr('Pass:')} ${summary.pass}; ${tr('Fail:')} ${summary.fail}; ${tr('Blocked:')} ${summary.blocked}; ${tr('Not run or missing evidence:')} ${summary.pending}`,
        `${tr('Required checks without recorded evidence:')} ${missing.map((check) => `[${check.code}]`).join(', ') || tr('None')}`,
        `${tr('Recorded decision:')} ${tr(project.results?.decision === 'continue' ? 'Continue' : project.results?.decision === 'revise' ? 'Revise' : project.results?.decision === 'stop' ? 'Stop' : 'Not decided')}`,
        reviews.length ? `${tr('Saved review checks not self-checked:')} ${openReviews}` : tr('No saved self-reviews.'),
        tr('Review counts include archived records and do not verify current deliverables or resolve corrections.'),
        tr('Selecting fewer tests does not hide whole-project gaps. Recorded milestones and passes are not independent verification.')
      ].join('\n')
    },
    {
      heading: tr('Selected saved test evidence'),
      body: draft.testIds.length ? draft.testIds.map((id) => {
        const test = tests.find((test) => test.id === id);
        if (!test) return `${id}: ${tr('Selected test no longer exists. Reload and update the selection.')}`;
        return [
          `${id}: ${test.name.trim() || unknown}`,
          `${tr('Fictional input or test steps')}: ${test.input.trim() || unknown}`,
          `${tr('Expected result')}: ${test.expected.trim() || unknown}`,
          `${tr('Actual result and evidence')}: ${test.actual.trim() || unknown}`,
          `${tr('Original outcome')}: ${status(test.status)}`,
          `${tr('Correction or next fix')}: ${test.correction.trim() || unknown}`,
          `${tr('Retest outcome')}: ${status(test.retestStatus)}`,
          `${tr('Retest date, result and evidence')}: ${test.retest.trim() || unknown}`,
          `${tr('Current evidenced outcome')}: ${status(effectiveTestStatus(test))}`
        ].join('\n');
      }).join('\n\n') : tr('No test evidence selected. This narrative alone does not demonstrate a successful outcome.')
    },
    { heading: tr('Sharing boundaries'), body: tr('Only the saved narrative, selected test text and whole-project status are included. Full proposals, structured costs, workbook drafts and review copies are excluded. Review all included text for sensitive details. No public page or sharing link is created.') }
  ];
  if (caseStudyFields.some((field) => !draft.text[field.key].trim()) || !journeyReady
    || summary.open || openReviews || !tests.length || missing.length
    || draft.testIds.some((id) => !tests.some((test) => test.id === id))) {
    sections.splice(1, 0, { heading: tr('Incomplete practice draft'), body: tr('Missing text, unresolved tests or unrecorded milestones remain. Do not present this draft as completed client work.') });
  }
  return sections;
}

export function caseStudyText(sections: CaseStudySection[]) {
  return sections.map((section) => `${section.heading}\n${section.body}`).join('\n\n');
}
