import { pilotHundredths, formatPilotMoney } from '@/lib/pilot-numbers';

export const proposalStorageKey = 'desofec:pilot-proposal:v1';
export const proposalTextLimit = 2000;
export const proposalDocumentLimit = 40000;

export const proposalTextFields = [
  { key: 'title', label: 'Service title', rows: 1 },
  { key: 'problem', label: 'Customer problem and evidence', rows: 3 },
  { key: 'scope', label: 'Included work and deliverables', rows: 3 },
  { key: 'exclusions', label: 'Exclusions and boundaries', rows: 3 },
  { key: 'acceptance', label: 'Acceptance checks', rows: 3 },
  { key: 'reviewer', label: 'Approval owner (role, not personal details)', rows: 2 },
  { key: 'timeline', label: 'Timeline and review dates', rows: 2 },
  { key: 'terms', label: 'Vendor charges, taxes and payment terms to confirm', rows: 3 },
  { key: 'handover', label: 'Support, handover and cancellation terms', rows: 3 },
  { key: 'dataHandling', label: 'Data handling, off switch and manual fallback', rows: 3 }
] as const;

export const proposalCostFields = [
  { key: 'setupHours', label: 'Total setup hours', max: 10000 },
  { key: 'setupRate', label: 'Internal hourly allowance (EUR)', max: 100000 },
  { key: 'contingency', label: 'Setup labour contingency (%)', max: 100 },
  { key: 'setupExpenses', label: 'Other one-off costs (EUR)', max: 1000000 },
  { key: 'monthlyHours', label: 'Monthly support hours', max: 10000 },
  { key: 'monthlyRate', label: 'Internal support allowance per hour (EUR)', max: 100000 },
  { key: 'monthlyExpenses', label: 'Monthly vendor and other costs (EUR)', max: 1000000 },
  { key: 'setupFee', label: 'Proposed setup service fee (EUR)', max: 1000000 },
  { key: 'monthlyFee', label: 'Proposed monthly service fee (EUR)', max: 1000000 }
] as const;

type TextKey = typeof proposalTextFields[number]['key'];
type CostKey = typeof proposalCostFields[number]['key'];
export type ProposalInputs = Record<TextKey | CostKey, string>;
type Translate = (text: string) => string;

export function emptyProposalInputs(): ProposalInputs {
  return {
    title: '', problem: '', scope: '', exclusions: '', acceptance: '', reviewer: '', timeline: '',
    terms: '', handover: '', dataHandling: '', setupHours: '', setupRate: '', contingency: '',
    setupExpenses: '', monthlyHours: '', monthlyRate: '', monthlyExpenses: '', setupFee: '', monthlyFee: ''
  };
}

export function proposalCalculations(inputs: ProposalInputs) {
  const values: Partial<Record<CostKey, number | null>> = {};
  const errors: CostKey[] = [];
  for (const field of proposalCostFields) {
    try {
      values[field.key] = pilotHundredths(inputs[field.key], field.max);
    } catch {
      errors.push(field.key);
    }
  }
  const { setupHours, setupRate, contingency, setupExpenses, monthlyHours, monthlyRate, monthlyExpenses } = values;
  const setupLabour = setupHours != null && setupRate != null ? Math.round(setupHours * setupRate / 100) : null;
  const setup = setupLabour !== null && contingency != null && setupExpenses != null
    ? setupLabour + Math.round(setupLabour * contingency / 10000) + setupExpenses
    : null;
  const monthly = monthlyHours != null && monthlyRate != null && monthlyExpenses != null
    ? Math.round(monthlyHours * monthlyRate / 100) + monthlyExpenses
    : null;
  return { setup, monthly, setupFee: values.setupFee ?? null, monthlyFee: values.monthlyFee ?? null, errors };
}

export const formatProposalMoney = formatPilotMoney;

export function proposalSource(inputs: ProposalInputs, language: string) {
  return JSON.stringify({ inputs, language });
}

export function buildPilotProposal(inputs: ProposalInputs, language: string, tr: Translate) {
  const totals = proposalCalculations(inputs);
  if (totals.errors.length) throw new Error('Invalid proposal number');
  const unknown = tr('[TO CONFIRM]');
  const text = (value: string) => value.trim() || unknown;
  const money = (value: number | null) => value === null ? unknown : formatProposalMoney(value, language);
  return [
    tr('DRAFT PILOT PROPOSAL - NOT AN AGREEMENT'),
    tr('Review every statement and agree terms with the customer before any work. No earnings, savings or compliance guarantee.'),
    ...proposalTextFields.slice(0, 7).map((field) => `${tr(field.label)}\n${text(inputs[field.key])}`),
    `${tr('Proposed service fees (EUR)')}\n${tr('Setup service fee:')} ${money(totals.setupFee)}\n${tr('Monthly service fee:')} ${money(totals.monthlyFee)}`,
    tr('Vendor charges and taxes are not included in these service fees. Confirm responsibility, amounts and payment terms below.'),
    ...proposalTextFields.slice(7).map((field) => `${tr(field.label)}\n${text(inputs[field.key])}`),
    tr('Before live work: confirm scope, acceptance tests, authorised access, human approval, spending limits and the manual fallback. Seek qualified local advice where needed.'),
    tr('Prepared with the Desofec AI Studio Pilot Proposal Builder. This is a draft template, not legal, tax or financial advice.')
  ].join('\n\n');
}

export type ProposalDraft = {
  version: 1;
  inputs: ProposalInputs;
  document: string;
  source: string;
};

export function readProposalDraft(raw: string): ProposalDraft {
  if (raw.length > 1000000) throw new Error('Invalid saved proposal');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1
    || !('inputs' in value) || !value.inputs || typeof value.inputs !== 'object'
    || !('document' in value) || typeof value.document !== 'string' || value.document.length > proposalDocumentLimit
    || !('source' in value) || typeof value.source !== 'string' || value.source.length > 150000) {
    throw new Error('Invalid saved proposal');
  }
  const inputs = emptyProposalInputs();
  for (const key of Object.keys(inputs) as (keyof ProposalInputs)[]) {
    const saved: unknown = Reflect.get(value.inputs, key);
    const limit = proposalTextFields.some((field) => field.key === key) ? proposalTextLimit : 30;
    if (typeof saved !== 'string' || saved.length > limit) throw new Error('Invalid saved proposal');
    inputs[key] = saved;
  }
  if (proposalCalculations(inputs).errors.length) throw new Error('Invalid saved proposal');
  return { version: 1, inputs, document: value.document, source: value.source };
}
