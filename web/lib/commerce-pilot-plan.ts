import { commerceDecisionLabels, commerceResponsibilities, type CommercePathId, type CommerceReadiness } from '@/lib/commerce-readiness';

export const commercePilotStatuses = ['draft', 'review-required', 'paused'] as const;
export const commercePilotRoles: Record<CommercePathId, string[]> = {
  'ai-online-retail': ['Pilot coordinator', 'Budget approver', 'Product and supplier reviewer', 'Customer and returns reviewer'],
  'ai-marketplace-model': ['Pilot coordinator', 'Budget approver', 'Seller and catalog reviewer', 'Payments and dispute reviewer'],
  'ai-logistics-services': ['Pilot coordinator', 'Budget approver', 'Custody and safety reviewer', 'Carrier and claims reviewer']
};
export const pilotRoleLabels: Record<string, string> = {
  'Pilot coordinator': 'Pilot coordinator',
  'Budget approver': 'Budget approver',
  'Product and supplier reviewer': 'Product and supplier reviewer',
  'Customer and returns reviewer': 'Customer and returns reviewer',
  'Seller and catalog reviewer': 'Seller and catalog reviewer',
  'Payments and dispute reviewer': 'Payments and dispute reviewer',
  'Custody and safety reviewer': 'Custody and safety reviewer',
  'Carrier and claims reviewer': 'Carrier and claims reviewer'
} as const;
export const pilotThresholdOperators = ['at-least', 'at-most', 'exactly'] as const;
export const pilotThresholdOperatorLabels = {
  'at-least': 'At least', 'at-most': 'At most', exactly: 'Exactly'
} as const;

export type CommercePilotPlan = {
  version: 1;
  status: typeof commercePilotStatuses[number];
  question: string;
  hypothesis: string;
  audience: string;
  sampleTarget: string;
  method: string;
  startDate: string;
  reviewDate: string;
  budgetCurrency: string;
  budgetCap: string;
  success: { metric: string; operator: typeof pilotThresholdOperators[number]; threshold: string };
  stop: { metric: string; operator: typeof pilotThresholdOperators[number]; threshold: string };
  roles: Record<string, { owner: string; evidence: string }>;
  exclusions: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
function text(value: unknown, limit: number, pattern?: RegExp) {
  if (typeof value !== 'string' || value.length > limit || (pattern && value && !pattern.test(value))) {
    throw new Error('Invalid commerce pilot plan.');
  }
  return value;
}
function validDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function validAmount(value: string) {
  return /^\d{0,6}(?:\.\d{0,2})?$/.test(value);
}

export function emptyCommercePilotPlan(pathId: CommercePathId): CommercePilotPlan {
  return {
    version: 1, status: 'draft', question: '', hypothesis: '', audience: '', sampleTarget: '',
    method: '', startDate: '', reviewDate: '', budgetCurrency: '', budgetCap: '',
    success: { metric: '', operator: 'at-least', threshold: '' },
    stop: { metric: '', operator: 'at-least', threshold: '' },
    roles: Object.fromEntries(commercePilotRoles[pathId].map((role) => [role, { owner: '', evidence: '' }])),
    exclusions: ''
  };
}

export function readCommercePilotPlan(value: unknown, pathId: CommercePathId): CommercePilotPlan {
  if (!(pathId in commerceResponsibilities) || !isRecord(value) || value.version !== 1
    || !isRecord(value.success) || !isRecord(value.stop) || !isRecord(value.roles)
    || !commercePilotStatuses.includes(value.status as typeof commercePilotStatuses[number])) {
    throw new Error('Invalid commerce pilot plan.');
  }
  const startDate = text(value.startDate, 10);
  const reviewDate = text(value.reviewDate, 10);
  if (!validDate(startDate) || !validDate(reviewDate) || (startDate && reviewDate && reviewDate < startDate)) {
    throw new Error('Pilot review date must be on or after the planned start date.');
  }
  const metric = (item: Record<string, unknown>) => {
    if (!pilotThresholdOperators.includes(item.operator as typeof pilotThresholdOperators[number])) {
      throw new Error('Invalid commerce pilot plan.');
    }
    return {
      metric: text(item.metric, 240),
      operator: item.operator as typeof pilotThresholdOperators[number],
      threshold: text(item.threshold, 10, /^\d{0,6}(?:\.\d{0,2})?$/)
    };
  };
  const rawRoles = value.roles;
  if (!isRecord(rawRoles)) throw new Error('Invalid commerce pilot plan.');
  const roles = Object.fromEntries(commercePilotRoles[pathId].map((role) => {
    const item = rawRoles[role];
    if (!isRecord(item)) throw new Error('Invalid commerce pilot plan.');
    return [role, { owner: text(item.owner, 120), evidence: text(item.evidence, 800) }];
  }));
  const budgetCurrency = text(value.budgetCurrency, 3, /^[A-Z]{3}$/);
  const budgetCap = text(value.budgetCap, 10, /^\d{0,6}(?:\.\d{0,2})?$/);
  return {
    version: 1,
    status: value.status as CommercePilotPlan['status'],
    question: text(value.question, 1200), hypothesis: text(value.hypothesis, 1200),
    audience: text(value.audience, 500), sampleTarget: text(value.sampleTarget, 6, /^\d{0,6}$/),
    method: text(value.method, 2000), startDate, reviewDate, budgetCurrency, budgetCap,
    success: metric(value.success), stop: metric(value.stop), roles, exclusions: text(value.exclusions, 1200)
  };
}

export function commercePilotPlanCoverage(plan: CommercePilotPlan, pathId: CommercePathId) {
  const rolesAssigned = commercePilotRoles[pathId].every((role) => plan.roles[role].owner.trim() && plan.roles[role].evidence.trim());
  const thresholdsSet = [plan.success, plan.stop].every((item) =>
    item.metric.trim() && item.threshold !== '' && validAmount(item.threshold));
  const sameThreshold = plan.success.metric.trim().toLowerCase() === plan.stop.metric.trim().toLowerCase()
    && plan.success.operator === plan.stop.operator && plan.success.threshold === plan.stop.threshold;
  const budgetCapped = /^[A-Z]{3}$/.test(plan.budgetCurrency) && plan.budgetCap !== ''
    && validAmount(plan.budgetCap) && Number(plan.budgetCap) > 0;
  const scheduleValid = validDate(plan.startDate) && validDate(plan.reviewDate)
    && Boolean(plan.startDate && plan.reviewDate && plan.reviewDate >= plan.startDate);
  return {
    questionDefined: Boolean(plan.question.trim() && plan.hypothesis.trim()),
    boundedSample: Boolean(plan.audience.trim() && plan.sampleTarget && Number(plan.sampleTarget) > 0 && plan.method.trim()),
    budgetCapped, thresholdsSet: Boolean(thresholdsSet && !sameThreshold), rolesAssigned,
    scheduleValid, exclusionsDefined: Boolean(plan.exclusions.trim())
  };
}

export function buildCommercePilotPlanReport(
  plan: CommercePilotPlan, pathId: CommercePathId, tr: (text: string) => string,
  readinessChoice?: CommerceReadiness['decision']['choice']
) {
  const valid = readCommercePilotPlan(plan, pathId);
  const coverage = commercePilotPlanCoverage(valid, pathId);
  const roleLines = commercePilotRoles[pathId].map((role) =>
    `${tr(role)}: ${valid.roles[role].owner || tr('[TO CONFIRM]')}\n${valid.roles[role].evidence.trim() || tr('[TO CONFIRM]')}`);
  const threshold = (label: string, value: CommercePilotPlan['success']) =>
    `${tr(label)}: ${value.metric.trim() || tr('[TO CONFIRM]')} — ${tr(pilotThresholdOperatorLabels[value.operator])} ${value.threshold || tr('[TO CONFIRM]')}`;
  const checks = [
    ['questionDefined', 'Pilot question and hypothesis'],
    ['boundedSample', 'Audience, sample and method'],
    ['budgetCapped', 'Budget cap'],
    ['thresholdsSet', 'Success and stop thresholds'],
    ['rolesAssigned', 'Roles and reviewer evidence'],
    ['scheduleValid', 'Start and review dates'],
    ['exclusionsDefined', 'Exclusions and stop rules']
  ] as const;
  return [
    tr('COMMERCE PILOT PLAN - PRIVATE DESIGN DRAFT, NOT AUTHORIZATION TO EXECUTE'),
    tr('Planning only. No participants are contacted, listings published, money spent, accounts connected, stock held, sellers onboarded or goods shipped by this planner.'),
    `${tr('Plan status')}: ${tr(valid.status === 'draft' ? 'Draft' : valid.status === 'review-required' ? 'Review required' : 'Paused')}`,
    `${tr('Saved readiness decision')}: ${readinessChoice ? tr(commerceDecisionLabels[readinessChoice]) : tr('Not recorded')}`,
    tr(readinessChoice === 'stop'
      ? 'Readiness says stop. This draft cannot reverse that decision; use it only to design a distinct future discovery question.'
      : readinessChoice === 'revise'
        ? 'Readiness says revise. Resolve its open issues before proposing any real activity.'
        : 'Follow the saved readiness decision; a continue-discovery choice is not execution approval.'),
    `${tr('Question')}\n${valid.question.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Hypothesis to test, not a forecast')}\n${valid.hypothesis.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Audience and sample cap')}\n${valid.audience.trim() || tr('[TO CONFIRM]')}\n${valid.sampleTarget || tr('[TO CONFIRM]')}`,
    `${tr('Proposed method')}\n${valid.method.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Planned start and human review dates')}\n${valid.startDate || tr('[TO CONFIRM]')} — ${valid.reviewDate || tr('[TO CONFIRM]')}`,
    `${tr('Maximum planned budget; not a spending authorization')}\n${valid.budgetCurrency || tr('[TO CONFIRM]')} ${valid.budgetCap || tr('[TO CONFIRM]')}`,
    threshold('Success criterion', valid.success),
    threshold('Stop criterion', valid.stop),
    tr('Responsible roles and evidence needed before any real action'),
    ...roleLines,
    `${tr('Exclusions, permissions and safe fallback')}\n${valid.exclusions.trim() || tr('[TO CONFIRM]')}`,
    tr('Plan completeness checks - self-recorded planning only'),
    ...checks.map(([key, label]) => `${coverage[key] ? '[x]' : '[ ]'} ${tr(label)}`),
    tr('A written draft, budget cap, role assignment or saved readiness decision does not authorize outreach, purchases, contracts, payments, publication, seller onboarding, stock custody or shipment. Obtain separate informed approval and verify local requirements before any real pilot.')
  ].join('\n\n');
}
