import { readCommercePilotPlan, type CommercePilotPlan } from '@/lib/commerce-pilot-plan';
import type { CommercePathId } from '@/lib/commerce-readiness';

export const commercePilotReviewDecisions = ['not-decided', 'stop', 'revise', 'explore'] as const;
export type CommercePilotReviewDecision = typeof commercePilotReviewDecisions[number];
export type CommercePilotReview = {
  version: 1;
  planSnapshot: CommercePilotPlan;
  reviewDate: string;
  sampleCompleted: string;
  successObserved: string;
  stopObserved: string;
  actualSpend: string;
  evidenceSummary: string;
  unexpectedFindings: string;
  learning: string;
  decision: CommercePilotReviewDecision;
  rationale: string;
  nextQuestion: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function text(value: unknown, limit: number, pattern?: RegExp) {
  if (typeof value !== 'string' || value.length > limit || (pattern && value && !pattern.test(value))) {
    throw new Error('Invalid commerce pilot review.');
  }
  return value;
}

function validDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const amountPattern = /^\d{0,6}(?:\.\d{0,2})?$/;

export function emptyCommercePilotReview(plan: CommercePilotPlan): CommercePilotReview {
  return {
    version: 1,
    planSnapshot: structuredClone(plan),
    reviewDate: '',
    sampleCompleted: '',
    successObserved: '',
    stopObserved: '',
    actualSpend: '',
    evidenceSummary: '',
    unexpectedFindings: '',
    learning: '',
    decision: 'not-decided',
    rationale: '',
    nextQuestion: ''
  };
}

export function readCommercePilotReview(value: unknown, pathId: CommercePathId): CommercePilotReview {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.planSnapshot)
    || !commercePilotReviewDecisions.includes(value.decision as CommercePilotReviewDecision)) {
    throw new Error('Invalid commerce pilot review.');
  }
  const planSnapshot = readCommercePilotPlan(value.planSnapshot, pathId);
  const reviewDate = text(value.reviewDate, 10);
  if (!validDate(reviewDate) || (reviewDate && planSnapshot.startDate && reviewDate < planSnapshot.startDate)) {
    throw new Error('Review date must be on or after the planned start date.');
  }
  return {
    version: 1,
    planSnapshot,
    reviewDate,
    sampleCompleted: text(value.sampleCompleted, 6, /^\d{0,6}$/),
    successObserved: text(value.successObserved, 10, amountPattern),
    stopObserved: text(value.stopObserved, 10, amountPattern),
    actualSpend: text(value.actualSpend, 10, amountPattern),
    evidenceSummary: text(value.evidenceSummary, 1600),
    unexpectedFindings: text(value.unexpectedFindings, 1600),
    learning: text(value.learning, 1600),
    decision: value.decision as CommercePilotReviewDecision,
    rationale: text(value.rationale, 1600),
    nextQuestion: text(value.nextQuestion, 1200)
  };
}

export function commercePilotReviewMatchesPlan(review: CommercePilotReview, plan: CommercePilotPlan) {
  return JSON.stringify(review.planSnapshot) === JSON.stringify(plan);
}

function thresholdMet(observed: string, criterion: CommercePilotPlan['success']) {
  if (!amountPattern.test(observed) || observed === '' || !amountPattern.test(criterion.threshold) || criterion.threshold === '') return null;
  const actual = Number(observed);
  const threshold = Number(criterion.threshold);
  if (!Number.isFinite(actual) || !Number.isFinite(threshold)) return null;
  if (criterion.operator === 'at-least') return actual >= threshold;
  if (criterion.operator === 'at-most') return actual <= threshold;
  return actual === threshold;
}

export function commercePilotReviewSummary(review: CommercePilotReview) {
  const sample = /^\d{1,6}$/.test(review.sampleCompleted) ? Number(review.sampleCompleted) : null;
  const plannedSample = /^\d{1,6}$/.test(review.planSnapshot.sampleTarget) ? Number(review.planSnapshot.sampleTarget) : null;
  const spend = amountPattern.test(review.actualSpend) && review.actualSpend !== '' ? Number(review.actualSpend) : null;
  const budget = review.planSnapshot.budgetCap === '' ? null : Number(review.planSnapshot.budgetCap);
  return {
    successMet: thresholdMet(review.successObserved, review.planSnapshot.success),
    stopTriggered: thresholdMet(review.stopObserved, review.planSnapshot.stop),
    sampleWithinPlan: sample !== null && plannedSample !== null ? sample <= plannedSample : null,
    budgetWithinPlan: spend !== null && budget !== null && Number.isFinite(budget) ? spend <= budget : null,
    planHasBoundedSample: Boolean(review.planSnapshot.audience.trim() && review.planSnapshot.method.trim()
      && plannedSample !== null && plannedSample > 0),
    planHasBudgetCap: /^[A-Z]{3}$/.test(review.planSnapshot.budgetCurrency)
      && budget !== null && Number.isFinite(budget) && budget > 0,
    planHasSuccessCriterion: Boolean(review.planSnapshot.success.metric.trim() && review.planSnapshot.success.threshold),
    planHasStopCriterion: Boolean(review.planSnapshot.stop.metric.trim() && review.planSnapshot.stop.threshold),
    decisionReasoned: review.decision !== 'not-decided' && Boolean(review.rationale.trim())
  };
}

function outcomeLabel(value: boolean | null, yes: string, no: string) {
  return value === null ? 'Not recorded' : value ? yes : no;
}

export function buildCommercePilotReviewReport(
  review: CommercePilotReview,
  pathId: CommercePathId,
  tr: (text: string) => string
) {
  const valid = readCommercePilotReview(review, pathId);
  const summary = commercePilotReviewSummary(valid);
  const threshold = (
    label: string, criterion: CommercePilotPlan['success'], observed: string,
    comparison: boolean | null, yes: string, no: string
  ) => `${tr(label)}: ${criterion.metric.trim() || tr('[TO CONFIRM]')} — ${tr(criterion.operator === 'at-least' ? 'At least' : criterion.operator === 'at-most' ? 'At most' : 'Exactly')} ${criterion.threshold || tr('[TO CONFIRM]')}; ${tr('observed aggregate value')}: ${observed || tr('[TO CONFIRM]')}; ${tr('comparison')}: ${tr(outcomeLabel(comparison, yes, no))}`;
  const decision = valid.decision === 'not-decided' ? 'Not decided'
    : valid.decision === 'stop' ? 'Stop'
      : valid.decision === 'revise' ? 'Revise'
        : 'Explore further';
  return [
    tr('COMMERCE PILOT RESULTS & LEARNING REVIEW - PRIVATE RECORD, NOT AUTHORIZATION'),
    tr('This is a manual review of aggregate observations only. Do not enter participant names, contact details, individual responses or other personal data. This worksheet does not contact people, spend money, publish listings, connect accounts or authorize further activity.'),
    `${tr('Review date')}: ${valid.reviewDate || tr('[TO CONFIRM]')}`,
    `${tr('Pilot question')}\n${valid.planSnapshot.question.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Recorded sample')}: ${valid.sampleCompleted || tr('[TO CONFIRM]')} / ${valid.planSnapshot.sampleTarget || tr('[TO CONFIRM]')} (${tr(outcomeLabel(summary.sampleWithinPlan, 'within plan', 'above plan'))})`,
    `${tr('Recorded spend')}: ${valid.planSnapshot.budgetCurrency || tr('[TO CONFIRM]')} ${valid.actualSpend || tr('[TO CONFIRM]')} / ${valid.planSnapshot.budgetCap || tr('[TO CONFIRM]')} (${tr(outcomeLabel(summary.budgetWithinPlan, 'within cap', 'above cap'))})`,
    threshold('Success criterion', valid.planSnapshot.success, valid.successObserved, summary.successMet, 'Success threshold met', 'Success threshold not met'),
    threshold('Stop criterion', valid.planSnapshot.stop, valid.stopObserved, summary.stopTriggered, 'Stop threshold triggered', 'Stop threshold not triggered'),
    `${tr('Aggregate evidence source and limits')}\n${valid.evidenceSummary.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Unexpected findings')}\n${valid.unexpectedFindings.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Learning and unresolved uncertainty')}\n${valid.learning.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Human-recorded decision')}: ${tr(decision)}`,
    `${tr('Decision rationale')}\n${valid.rationale.trim() || tr('[TO CONFIRM]')}`,
    `${tr('Next discovery question, if any')}\n${valid.nextQuestion.trim() || tr('[TO CONFIRM]')}`,
    tr('Threshold comparisons describe only the values entered; they do not choose a decision or validate evidence. Review the source and uncertainty with an authorised human. A stop, revise or explore decision here does not authorize outreach, spending, publication, contracts, payments, seller onboarding, stock custody, shipment or deployment.')
  ].join('\n\n');
}
