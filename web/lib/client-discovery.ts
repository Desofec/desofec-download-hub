import type { ProposalDraft } from '@/lib/pilot-proposal';
import { emptyProposalInputs } from '@/lib/pilot-proposal';

export const discoveryFields = [
  { key: 'problem', label: 'Problem, facts and source evidence' },
  { key: 'unknowns', label: 'Assumptions, unknowns and next questions' },
  { key: 'scope', label: 'Included work and deliverables' },
  { key: 'exclusions', label: 'Exclusions and boundaries' },
  { key: 'acceptance', label: 'Acceptance checks' },
  { key: 'reviewer', label: 'Approval owner (role, not personal details)' },
  { key: 'timeline', label: 'Timeline and review dates' },
  { key: 'dataHandling', label: 'Data handling, off switch and manual fallback' }
] as const;
export const fitChecks = [
  { id: 'skill', label: 'I can demonstrate the required skills with practice evidence.' },
  { id: 'scope', label: 'Deliverables, exclusions and acceptance checks are clear.' },
  { id: 'access', label: 'Permission, data minimisation and safe access are defined.' },
  { id: 'review', label: 'An authorised review role and decision process are defined.' },
  { id: 'capacity', label: 'Time, costs and dependencies have been discussed, not assumed.' },
  { id: 'safety', label: 'The request excludes safety-critical decisions and unsupported guarantees.' }
] as const;
export const changeFields = [
  { key: 'baseline', label: 'Original scope and version reference' },
  { key: 'request', label: 'Requested change and reason' },
  { key: 'impact', label: 'Impact on work, timing, costs and dependencies' },
  { key: 'acceptance', label: 'Revised acceptance checks' },
  { key: 'reviewer', label: 'Change reviewer role and next decision date' }
] as const;
export const discoveryQuestions = [
  {
    id: 'problem', question: 'What is the actual problem and what evidence exists?',
    answer: 'The fictional owner compares five sample orders manually. No measured time baseline or demand evidence exists yet. Do not promise savings.'
  },
  {
    id: 'deliverables', question: 'What should the first delivery include?',
    answer: 'One checked sample CSV, an exception list and a short handover. No live integration, accounting certification or unlimited revisions. One correction round needs agreement.'
  },
  {
    id: 'permission', question: 'Who can approve access and data use?',
    answer: 'Only invented orders are supplied. Real data access, retention and deletion permissions are unknown. Do not request credentials or upload client records.'
  },
  {
    id: 'review', question: 'Who reviews the work, and when?',
    answer: 'The fictional owner role must compare source cells and approve scope before work. Budget, deadline and reviewer availability are not confirmed.'
  }
] as const;
export const fitStatuses = [
  { value: 'unknown', label: 'Unknown' }, { value: 'yes', label: 'Yes, with evidence' }, { value: 'no', label: 'No' }
] as const;
export type DiscoveryDraft = {
  version: 1;
  brief: Record<typeof discoveryFields[number]['key'], string>;
  fit: Record<typeof fitChecks[number]['id'], typeof fitStatuses[number]['value']>;
  fitEvidence: string;
  change: Record<typeof changeFields[number]['key'], string>;
};

export function emptyDiscovery(): DiscoveryDraft {
  return {
    version: 1,
    brief: { problem: '', unknowns: '', scope: '', exclusions: '', acceptance: '', reviewer: '', timeline: '', dataHandling: '' },
    fit: { skill: 'unknown', scope: 'unknown', access: 'unknown', review: 'unknown', capacity: 'unknown', safety: 'unknown' },
    fitEvidence: '',
    change: { baseline: '', request: '', impact: '', acceptance: '', reviewer: '' }
  };
}

export function readDiscovery(value: unknown): DiscoveryDraft {
  const invalid = () => new Error('Invalid saved discovery draft.');
  const record = (input: unknown): Record<string, unknown> => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid();
    return input as Record<string, unknown>;
  };
  const raw = record(value);
  if (raw.version !== 1) throw invalid();
  const brief = record(raw.brief);
  const fit = record(raw.fit);
  const change = record(raw.change);
  const next = emptyDiscovery();
  for (const { key } of discoveryFields) {
    const text = brief[key];
    if (typeof text !== 'string' || text.length > 2000) throw invalid();
    next.brief[key] = text;
  }
  for (const { key } of changeFields) {
    const text = change[key];
    if (typeof text !== 'string' || text.length > 2000) throw invalid();
    next.change[key] = text;
  }
  for (const { id } of fitChecks) {
    const status = fit[id];
    if (status !== 'unknown' && status !== 'yes' && status !== 'no') throw invalid();
    next.fit[id] = status;
  }
  if (typeof raw.fitEvidence !== 'string' || raw.fitEvidence.length > 2000) throw invalid();
  next.fitEvidence = raw.fitEvidence;
  return next;
}

export function discoveryFit(draft: DiscoveryDraft) {
  const missing = fitChecks.filter(({ id }) => draft.fit[id] !== 'yes').length;
  return {
    missing,
    ready: missing === 0 && Boolean(draft.fitEvidence.trim())
      && discoveryFields.every(({ key }) => Boolean(draft.brief[key].trim()))
  };
}

export function discoveryProposalSeed(draft: DiscoveryDraft, title: string): ProposalDraft {
  const valid = readDiscovery(draft);
  return {
    version: 1,
    inputs: {
      ...emptyProposalInputs(), title, problem: valid.brief.problem, scope: valid.brief.scope,
      exclusions: valid.brief.exclusions, acceptance: valid.brief.acceptance, reviewer: valid.brief.reviewer,
      timeline: valid.brief.timeline, dataHandling: valid.brief.dataHandling
    },
    document: '', source: ''
  };
}

export function buildDiscoveryReport(draft: DiscoveryDraft, tr: (text: string) => string) {
  const valid = readDiscovery(draft);
  const text = (value: string) => value.trim() || tr('[TO CONFIRM]');
  return [
    tr('FICTIONAL DISCOVERY AND SCOPE DRAFT - NOT AN AGREEMENT'),
    tr('Self-recorded practice only. No live outreach, client approval, legal advice or guarantee of results.'),
    tr(discoveryFit(valid).ready ? 'Continue scoping, not approval to accept work.' : 'Pause: resolve missing evidence, fit concerns and unknowns before accepting work.'),
    ...discoveryFields.map(({ key, label }) => `${tr(label)}\n${text(valid.brief[key])}`),
    tr('Project-fit and risk checklist'),
    ...fitChecks.map(({ id, label }) => `${tr(label)}: ${tr(fitStatuses.find((status) => status.value === valid.fit[id])!.label)}`),
    `${tr('Evidence for fit decisions and unresolved risks')}\n${text(valid.fitEvidence)}`,
    tr('PROPOSED CHANGE - NOT ACCEPTED'),
    ...changeFields.map(({ key, label }) => `${tr(label)}\n${text(valid.change[key])}`),
    tr('A change request never updates the original scope or proposal automatically. Agree a versioned revision with the authorised reviewer before work; missing costs and dates stay unknown.')
  ].join('\n\n');
}
