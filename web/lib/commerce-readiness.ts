export const commerceDemandMethods = ['not-tested', 'desk-research', 'customer-conversations', 'small-pilot'] as const;
export const commerceReadinessChoices = ['undecided', 'continue-discovery', 'revise', 'stop'] as const;
export const commerceOptionSlots = ['option-1', 'option-2'] as const;
export const commerceDemandMethodLabels: Record<typeof commerceDemandMethods[number], string> = {
  'not-tested': 'Not tested', 'desk-research': 'Desk research only',
  'customer-conversations': 'Customer conversations', 'small-pilot': 'Small bounded pilot'
};
export const commerceDecisionLabels: Record<typeof commerceReadinessChoices[number], string> = {
  undecided: 'Not decided', 'continue-discovery': 'Continue discovery only',
  revise: 'Revise the idea or scope', stop: 'Stop this direction'
};
export const commerceResponsibilityStatusLabels = {
  unknown: 'Unknown', proposed: 'Proposed; needs confirmation', confirmed: 'Self-reported as confirmed'
} as const;

export type CommerceReadiness = {
  version: 1;
  demand: {
    method: typeof commerceDemandMethods[number];
    date: string;
    sample: string;
    source: string;
    finding: string;
    limitations: string;
    nextTest: string;
  };
  options: Record<typeof commerceOptionSlots[number], {
    name: string;
    country: string;
    source: string;
    checkedAt: string;
    eligibility: string;
    fees: string;
    limitations: string;
  }>;
  economics: {
    currency: string;
    price: string;
    productCost: string;
    platformFees: string;
    fulfillment: string;
    returnsSupport: string;
    otherVariable: string;
    fixedMonthly: string;
    scenarioOrders: string;
  };
  responsibilities: Record<string, { owner: string; status: 'unknown' | 'proposed' | 'confirmed'; evidence: string }>;
  decision: {
    choice: typeof commerceReadinessChoices[number];
    rationale: string;
    nextStep: string;
  };
};

const responsibilityIds = {
  'ai-online-retail': ['product-sourcing', 'store-payments', 'stock-fulfillment', 'customer-returns', 'local-obligations'],
  'ai-marketplace-model': ['seller-roles', 'platform-payments', 'seller-payouts', 'catalog-moderation', 'local-obligations'],
  'ai-logistics-services': ['stock-custody', 'facility-safety', 'carriers-service-levels', 'returns-claims', 'data-access']
} as const;
export type CommercePathId = keyof typeof responsibilityIds;
export const commerceResponsibilities = responsibilityIds;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
function readText(value: unknown, limit: number, pattern?: RegExp) {
  if (typeof value !== 'string' || value.length > limit || (pattern && value && !pattern.test(value))) {
    throw new Error('Invalid commerce readiness record.');
  }
  return value;
}

export function emptyCommerceReadiness(pathId: CommercePathId): CommerceReadiness {
  return {
    version: 1,
    demand: { method: 'not-tested', date: '', sample: '', source: '', finding: '', limitations: '', nextTest: '' },
    options: {
      'option-1': { name: '', country: '', source: '', checkedAt: '', eligibility: '', fees: '', limitations: '' },
      'option-2': { name: '', country: '', source: '', checkedAt: '', eligibility: '', fees: '', limitations: '' }
    },
    economics: {
      currency: '', price: '', productCost: '', platformFees: '', fulfillment: '',
      returnsSupport: '', otherVariable: '', fixedMonthly: '', scenarioOrders: ''
    },
    responsibilities: Object.fromEntries(responsibilityIds[pathId].map((id) =>
      [id, { owner: '', status: 'unknown', evidence: '' }])) as CommerceReadiness['responsibilities'],
    decision: { choice: 'undecided', rationale: '', nextStep: '' }
  };
}

export function readCommerceReadiness(value: unknown, pathId: CommercePathId): CommerceReadiness {
  if (!(pathId in responsibilityIds)) throw new Error('Invalid commerce readiness project type.');
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.demand) || !isRecord(value.options)
    || !isRecord(value.economics) || !isRecord(value.responsibilities) || !isRecord(value.decision)) {
    throw new Error('Invalid commerce readiness record.');
  }
  if (!commerceDemandMethods.includes(value.demand.method as typeof commerceDemandMethods[number])) throw new Error('Invalid commerce readiness record.');
  const demand = {
    method: value.demand.method as typeof commerceDemandMethods[number],
    date: readText(value.demand.date, 32), sample: readText(value.demand.sample, 300),
    source: readText(value.demand.source, 1200), finding: readText(value.demand.finding, 2000),
    limitations: readText(value.demand.limitations, 1200), nextTest: readText(value.demand.nextTest, 1200)
  };
  const rawOptions = value.options;
  if (!isRecord(rawOptions)) throw new Error('Invalid commerce readiness record.');
  const options = Object.fromEntries(commerceOptionSlots.map((id) => {
    const option = rawOptions[id];
    if (!isRecord(option)) throw new Error('Invalid commerce readiness record.');
    return [id, {
      name: readText(option.name, 120), country: readText(option.country, 80),
      source: readText(option.source, 1200), checkedAt: readText(option.checkedAt, 32),
      eligibility: readText(option.eligibility, 1200), fees: readText(option.fees, 1200),
      limitations: readText(option.limitations, 1200)
    }];
  })) as CommerceReadiness['options'];
  const rawEconomics = value.economics;
  const economics = {
    currency: readText(rawEconomics.currency, 3, /^[A-Z]{3}$/),
    price: readText(rawEconomics.price, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    productCost: readText(rawEconomics.productCost, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    platformFees: readText(rawEconomics.platformFees, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    fulfillment: readText(rawEconomics.fulfillment, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    returnsSupport: readText(rawEconomics.returnsSupport, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    otherVariable: readText(rawEconomics.otherVariable, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    fixedMonthly: readText(rawEconomics.fixedMonthly, 10, /^\d{0,6}(?:\.\d{0,2})?$/),
    scenarioOrders: readText(rawEconomics.scenarioOrders, 6, /^\d{0,6}$/)
  };
  const rawResponsibilities = value.responsibilities;
  const responsibilities = Object.fromEntries(responsibilityIds[pathId].map((id) => {
    const item = rawResponsibilities[id];
    if (!isRecord(item) || !['unknown', 'proposed', 'confirmed'].includes(String(item.status))) {
      throw new Error('Invalid commerce readiness record.');
    }
    return [id, { owner: readText(item.owner, 120), status: item.status as 'unknown' | 'proposed' | 'confirmed', evidence: readText(item.evidence, 1200) }];
  }));
  const choice = value.decision.choice;
  if (!commerceReadinessChoices.includes(choice as typeof commerceReadinessChoices[number])) throw new Error('Invalid commerce readiness record.');
  const decision = {
    choice: choice as typeof commerceReadinessChoices[number],
    rationale: readText(value.decision.rationale, 2000), nextStep: readText(value.decision.nextStep, 1200)
  };
  return { version: 1, demand, options, economics, responsibilities, decision };
}

function amountCents(value: string) {
  if (!value || !/^\d{0,6}(?:\.\d{0,2})?$/.test(value)) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 999999.99) return null;
  return Math.round(amount * 100);
}

export function commerceEconomics(readiness: CommerceReadiness) {
  const fields = ['price', 'productCost', 'platformFees', 'fulfillment', 'returnsSupport', 'otherVariable', 'fixedMonthly', 'scenarioOrders'] as const;
  if (!/^[A-Z]{3}$/.test(readiness.economics.currency) || fields.some((field) => readiness.economics[field] === '')) return null;
  const amounts = ['price', 'productCost', 'platformFees', 'fulfillment', 'returnsSupport', 'otherVariable', 'fixedMonthly'] as const;
  const cents = Object.fromEntries(amounts.map((field) => [field, amountCents(readiness.economics[field])])) as Record<typeof amounts[number], number | null>;
  if (Object.values(cents).some((amount) => amount === null) || !/^\d{1,6}$/.test(readiness.economics.scenarioOrders)) return null;
  const price = cents.price!;
  const variableCost = ['productCost', 'platformFees', 'fulfillment', 'returnsSupport', 'otherVariable']
    .reduce((sum, field) => sum + cents[field as typeof amounts[number]]!, 0);
  const fixedMonthly = cents.fixedMonthly!;
  const contribution = price - variableCost;
  const orders = Number(readiness.economics.scenarioOrders);
  const breakEvenOrders = contribution > 0 ? Math.ceil(fixedMonthly / contribution) : null;
  return {
    currency: readiness.economics.currency, contribution, variableCost, fixedMonthly, orders, breakEvenOrders,
    scenarioBalance: contribution * orders - fixedMonthly,
    contributionRate: price > 0 ? contribution / price : null
  };
}

export function commerceReadinessCoverage(readiness: CommerceReadiness, pathId: CommercePathId) {
  const economics = commerceEconomics(readiness);
  const demandRecorded = readiness.demand.method !== 'not-tested' && Boolean(
    readiness.demand.date && readiness.demand.sample.trim() && readiness.demand.source.trim() && readiness.demand.finding.trim()
    && readiness.demand.limitations.trim() && readiness.demand.nextTest.trim()
  );
  const optionNames = commerceOptionSlots.map((id) => readiness.options[id].name.trim().toLowerCase());
  const optionsCompared = new Set(optionNames).size === commerceOptionSlots.length && commerceOptionSlots.every((id) => {
    const option = readiness.options[id];
    return option.name.trim() && option.country.trim() && option.source.trim() && option.checkedAt && option.eligibility.trim()
      && option.fees.trim() && option.limitations.trim();
  });
  const responsibilitiesReviewed = responsibilityIds[pathId].every((id) => {
    const item = readiness.responsibilities[id];
    return item.owner.trim() && item.status !== 'unknown' && item.evidence.trim();
  });
  return {
    demandRecorded: Boolean(demandRecorded), optionsCompared: Boolean(optionsCompared),
    economicsCalculated: economics !== null, responsibilitiesReviewed: Boolean(responsibilitiesReviewed), economics
  };
}

export function buildCommerceReadinessReport(readiness: CommerceReadiness, pathId: CommercePathId, tr: (text: string) => string) {
  const valid = readCommerceReadiness(readiness, pathId);
  const coverage = commerceReadinessCoverage(valid, pathId);
  const economics = coverage.economics;
  const section = (label: string, value: string) => `${tr(label)}\n${value.trim() || tr('[TO CONFIRM]')}`;
  const responsibilityLabels: Record<CommercePathId, string[]> = {
    'ai-online-retail': ['Sourcing and product quality', 'Store, platform and payment eligibility', 'Stock, fulfillment and delivery', 'Customer service, returns and refunds', 'Local tax, consumer and product obligations'],
    'ai-marketplace-model': ['Operator and seller roles', 'Platform and payment responsibilities', 'Seller payouts, refunds and disputes', 'Catalog moderation, rights and appeals', 'Local consumer, tax and privacy obligations'],
    'ai-logistics-services': ['Inventory custody and damaged goods', 'Facility safety, security and insurance', 'Carrier eligibility and service levels', 'Returns, claims and customer escalation', 'Data access, retention and deletion']
  };
  return [
    tr('COMMERCE VALIDATION & READINESS - PRIVATE PRACTICE, NOT LAUNCH APPROVAL'),
    tr('All customer, provider and cost notes are self-entered and unverified. This record cannot approve a business, establish legal/tax compliance or predict income.'),
    `${tr('Decision')}: ${tr(commerceDecisionLabels[valid.decision.choice])}`,
    section('Reason for this decision', valid.decision.rationale),
    section('Next evidence or validation step', valid.decision.nextStep),
    tr('Customer demand evidence - not a forecast'),
    `${tr('Evidence method')}: ${tr(commerceDemandMethodLabels[valid.demand.method])}`,
    ...(['date', 'sample', 'source', 'finding', 'limitations', 'nextTest'] as const).map((field) =>
      section(({ date: 'Observation date', sample: 'Sample size and audience', source: 'Source and permission', finding: 'What was observed', limitations: 'Limitations and contrary evidence', nextTest: 'Next validation test' })[field], valid.demand[field])),
    tr('Provider comparison - check current country eligibility and terms directly'),
    ...commerceOptionSlots.flatMap((id) => {
      const option = valid.options[id];
      return [
        `${tr(id === 'option-1' ? 'Option A' : 'Option B')}: ${option.name || tr('[TO CONFIRM]')}`,
        section('Country and currency availability', option.country),
        section('Official source or evidence reference', option.source),
        section('Date checked', option.checkedAt),
        section('Eligibility evidence', option.eligibility),
        section('Fees and billing basis', option.fees),
        section('Limitations and unresolved terms', option.limitations)
      ];
    }),
    tr('Unit economics - scenario only, not a forecast or profit'),
    economics ? [
      `${tr('Contribution per order before fixed costs and unlisted items')}: ${economics.currency} ${(economics.contribution / 100).toFixed(2)}`,
      `${tr('Break-even order count from listed monthly fixed costs')}: ${economics.breakEvenOrders === null ? tr('Not calculable: contribution is zero or negative') : economics.breakEvenOrders}`,
      `${tr('Scenario balance before unlisted costs and taxes')}: ${economics.currency} ${(economics.scenarioBalance / 100).toFixed(2)}`,
      tr('Uses your entered scenario volume only. Excludes any unlisted costs, taxes, financing and uncertainty; not a profit estimate.')
    ] : [tr('Incomplete: enter one currency and every amount to calculate. Blank values are unknown, not zero.')],
    section('Currency code - no currency conversion', valid.economics.currency),
    ...(['price', 'productCost', 'platformFees', 'fulfillment', 'returnsSupport', 'otherVariable', 'fixedMonthly', 'scenarioOrders'] as const)
      .map((field) => section(({ price: 'Price per order', productCost: 'Product or supplier cost per order', platformFees: 'Platform and payment fees per order', fulfillment: 'Fulfillment and delivery per order', returnsSupport: 'Returns and support allowance per order', otherVariable: 'Other known variable cost per order', fixedMonthly: 'Monthly fixed costs', scenarioOrders: 'Scenario monthly order count' })[field], valid.economics[field])),
    tr('Operational responsibilities - role assignment is not professional advice or verified approval'),
    ...responsibilityIds[pathId].map((id, index) => {
      const item = valid.responsibilities[id];
      return `${tr(responsibilityLabels[pathId][index])}: ${tr(commerceResponsibilityStatusLabels[item.status])}; ${tr('Owner role')}: ${item.owner || tr('[TO CONFIRM]')}\n${item.evidence.trim() || tr('[TO CONFIRM]')}`;
    }),
    ...Object.entries(coverage).filter(([key]) => key !== 'economics')
      .map(([key, complete]) => `${tr(({ demandRecorded: 'Demand evidence recorded', optionsCompared: 'Two sourced options compared', economicsCalculated: 'Cost scenario calculated', responsibilitiesReviewed: 'Responsibility roles reviewed' } as Record<string, string>)[key])}: ${tr(complete ? 'Recorded' : 'Missing or unresolved')}`),
    tr('A “continue discovery” decision is not permission to launch. Independently confirm provider terms, customer demand, local requirements, permissions and operational capability before making real commitments.')
  ].join('\n\n');
}
