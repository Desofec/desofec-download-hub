import { pilotHundredths } from '@/lib/pilot-numbers';

export type CommerceTrack = 'retail' | 'marketplace' | 'logistics';
export type PracticeRow = Record<string, string>;
export type PracticeResult = {
  columns: string[];
  rows: string[][];
  summary: string;
  issues: string[];
};
type Exercise = {
  id: string; track: CommerceTrack; title: string; explanation: string;
  fields: string[]; sample: PracticeRow[];
};

export const commerceExercises: Exercise[] = [
  {
    id: 'retail-cost', track: 'retail', title: 'Retail contribution',
    explanation: 'Invented USD allowances, not vendor quotes. Contribution excludes taxes, storage, ads and other overhead; it is not net profit.',
    fields: ['Price', 'Product cost', 'Channel cost', 'Fulfillment cost', 'Inbound cost', 'Returns cost'],
    sample: [{ Price: '20', 'Product cost': '6', 'Channel cost': '3', 'Fulfillment cost': '4', 'Inbound cost': '1', 'Returns cost': '1' }]
  },
  {
    id: 'retail-stock', track: 'retail', title: 'Inventory planning',
    explanation: 'Use a 14-day sample: daily average = sold / 14; threshold = daily average × lead days + buffer. REVIEW is not a purchase instruction. Real planning needs reservations, seasonality and cash constraints.',
    fields: ['SKU', 'Sold in 14 days', 'Usable stock', 'Confirmed inbound', 'Lead days', 'Buffer'],
    sample: [
      { SKU: 'NB-A', 'Sold in 14 days': '28', 'Usable stock': '18', 'Confirmed inbound': '0', 'Lead days': '10', Buffer: '6' },
      { SKU: 'PN-B', 'Sold in 14 days': '14', 'Usable stock': '30', 'Confirmed inbound': '0', 'Lead days': '7', Buffer: '4' }
    ]
  },
  {
    id: 'retail-report', track: 'retail', title: 'Weekly retail report',
    explanation: 'Separate seven-day period: 2030-01-07 through 2030-01-13 inclusive, USD. Refund amount is a total per row, not per unit. Fees, taxes and adjustments are omitted; no profit, payout or growth is established.',
    fields: ['SKU', 'Units', 'Unit price', 'Refund amount'],
    sample: [{ SKU: 'NB-A', Units: '10', 'Unit price': '20', 'Refund amount': '20' }, { SKU: 'PN-B', Units: '5', 'Unit price': '10', 'Refund amount': '0' }]
  },
  {
    id: 'market-catalog', track: 'marketplace', title: 'Seller catalog checks',
    explanation: 'Preserve seller/SKU identity. For this fictional brief only, S1/N1 supports “2 A5 ruled notebooks; 80 pages each” and S2/P1 supports “3 black-ink pens”. Unsupported or changed wording needs human review, not automatic rejection or publication.',
    fields: ['Seller', 'SKU', 'Claim'],
    sample: [{ Seller: 'S1', SKU: 'N1', Claim: '2 A5 ruled notebooks; 80 pages each' }, { Seller: 'S2', SKU: 'P1', Claim: '3 black-ink pens' }]
  },
  {
    id: 'market-orders', track: 'marketplace', title: 'Orders and commission',
    explanation: 'Illustrative agreement: 10% commission on merchandise after refunds. Seller allocations are not actual payouts; fees, taxes, reserves and chargebacks are omitted. Duplicate order IDs are errors, not extra sales.',
    fields: ['Order', 'Seller', 'Gross amount', 'Refund amount'],
    sample: [
      { Order: 'O1', Seller: 'S1', 'Gross amount': '100', 'Refund amount': '0' },
      { Order: 'O2', Seller: 'S2', 'Gross amount': '80', 'Refund amount': '20' },
      { Order: 'O3', Seller: 'S1', 'Gross amount': '50', 'Refund amount': '50' }
    ]
  },
  {
    id: 'logistics-stock', track: 'logistics', title: 'Receiving and reservations',
    explanation: 'Count total receipt separately from usable stock. Reserve whole orders in sequence; a held order reserves nothing. Damaged units are unavailable. A reservation is not a physical pick or shipment.',
    fields: ['SKU', 'Expected receipt', 'Counted usable', 'Quarantined'],
    sample: [{ SKU: 'NB-A', 'Expected receipt': '30', 'Counted usable': '28', Quarantined: '2' }, { SKU: 'PN-B', 'Expected receipt': '20', 'Counted usable': '20', Quarantined: '0' }]
  },
  {
    id: 'logistics-orders', track: 'logistics', title: 'Sequential order requests',
    explanation: 'Run receiving and reservations to process these rows against the receiving table. The two exercises are linked: changing either clears the previous result. Zero quantity is allowed; an entirely empty order is not.',
    fields: ['Order', 'NB-A quantity', 'PN-B quantity'],
    sample: [
      { Order: 'L1', 'NB-A quantity': '5', 'PN-B quantity': '3' },
      { Order: 'L2', 'NB-A quantity': '25', 'PN-B quantity': '0' },
      { Order: 'L3', 'NB-A quantity': '0', 'PN-B quantity': '4' }
    ]
  },
  {
    id: 'logistics-return', track: 'logistics', title: 'Dispatch and returns',
    explanation: 'This return is from an earlier order outside the reservation sample. Returned units stay quarantined pending real inspection and do not change available stock. All dispatch records remain simulation-only: zero physical picks or shipments.',
    fields: ['Return', 'SKU', 'Returned units'],
    sample: [{ Return: 'R1', SKU: 'NB-A', 'Returned units': '1' }]
  },
  {
    id: 'logistics-cost', track: 'logistics', title: 'Logistics cost scenario',
    explanation: 'This hypothetical processed-order cost scenario is separate from reservation counts. Invented USD allowances exclude shipping, insurance, taxes and other costs. Contribution is not actual revenue or net profit.',
    fields: ['Service fee', 'Labour cost', 'Packaging cost', 'Overhead cost', 'Hypothetical orders'],
    sample: [{ 'Service fee': '8', 'Labour cost': '3', 'Packaging cost': '1', 'Overhead cost': '2', 'Hypothetical orders': '10' }]
  }
];

export function commerceTrack(value: string | undefined): CommerceTrack {
  return value === 'marketplace' || value === 'logistics' ? value : 'retail';
}

export function sampleCommerceRows(id: string): PracticeRow[] {
  const exercise = commerceExercises.find((entry) => entry.id === id);
  if (!exercise) throw new Error('Unknown commerce exercise.');
  return exercise.sample.map((row) => ({ ...row }));
}

const usd = (cents: number) => (cents / 100).toFixed(2);
const decimal = (value: number) => value.toFixed(2);
function number(value: string, field: string, integer = false): number | null {
  if (value.trim() === '') return null;
  if (integer) {
    if (!/^\d+$/.test(value.trim()) || Number(value) > 100000) throw new Error('Enter whole numbers from 0 to 100000 for quantities and days.');
    return Number(value);
  }
  try {
    return pilotHundredths(value, 100000);
  } catch {
    throw new Error(`Invalid money amount: ${field}. Use 0 to 100000 with at most two decimal places.`);
  }
}
function unique(rows: PracticeRow[], fields: string[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    const values = fields.map((field) => row[field]?.trim());
    if (values.some((value) => !value || value.length > 40)) throw new Error('Identifiers must contain 1 to 40 characters.');
    const key = JSON.stringify(values);
    if (seen.has(key)) throw new Error('Duplicate identifier. Resolve the source before calculating.');
    seen.add(key);
  }
}
function checkShape(id: string, rows: PracticeRow[]) {
  const exercise = commerceExercises.find((entry) => entry.id === id);
  if (!exercise || rows.length < 1 || rows.length > 20) throw new Error('Use 1 to 20 rows for a known exercise.');
  for (const row of rows) {
    if (Object.keys(row).length !== exercise.fields.length || exercise.fields.some((field) => typeof row[field] !== 'string' || row[field].length > 300)) {
      throw new Error('Invalid exercise fields.');
    }
  }
}
function values(row: PracticeRow, fields: string[], integer = false): number[] | null {
  const parsed = fields.map((field) => number(row[field], field, integer));
  return parsed.every((value): value is number => value !== null) ? parsed : null;
}
function cost(rows: PracticeRow[], logistics: boolean): PracticeResult {
  if (rows.length !== 1) throw new Error('Cost scenarios require exactly one row.');
  const fields = logistics ? ['Service fee', 'Labour cost', 'Packaging cost', 'Overhead cost'] : ['Price', 'Product cost', 'Channel cost', 'Fulfillment cost', 'Inbound cost', 'Returns cost'];
  const amounts = values(rows[0], fields);
  const orders = logistics ? number(rows[0]['Hypothetical orders'], 'Hypothetical orders', true) : 1;
  if (!amounts || orders === null) return { columns: ['Status'], rows: [['UNRESOLVED']], summary: 'Cost scenario incomplete; missing values are not zero.', issues: ['Complete the missing inputs before estimating contribution.'] };
  const fee = amounts[0];
  if (fee === 0) throw new Error('Price or service fee must be greater than zero.');
  const costs = amounts.slice(1).reduce((sum, amount) => sum + amount, 0);
  const contribution = fee - costs;
  return {
    columns: ['Fee / price (USD)', 'Known allowances (USD)', 'Contribution (USD)', 'Contribution ratio', 'Scenario fees (USD)', 'Scenario allowances (USD)', 'Scenario contribution (USD)'],
    rows: [[usd(fee), usd(costs), usd(contribution), `${decimal(contribution / fee * 100)}%`, usd(fee * orders), usd(costs * orders), usd(contribution * orders)]],
    summary: 'Illustrative contribution only. Not vendor quotes, complete profit or actual revenue.', issues: []
  };
}

export function evaluateCommerce(id: string, rows: PracticeRow[], requests?: PracticeRow[]): PracticeResult {
  checkShape(id, rows);
  if (id === 'retail-cost' || id === 'logistics-cost') return cost(rows, id === 'logistics-cost');
  if (id === 'retail-stock') {
    unique(rows, ['SKU']);
    const issues: string[] = [];
    return {
      columns: ['SKU', 'Daily average', 'Threshold', 'Inventory position', 'Days of cover', 'Status'],
      rows: rows.map((row) => {
        const n = values(row, ['Sold in 14 days', 'Usable stock', 'Confirmed inbound', 'Lead days', 'Buffer'], true);
        if (!n) { issues.push(`${row.SKU}: missing inventory input.`); return [row.SKU, 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNRESOLVED']; }
        const [sold, stock, inbound, lead, buffer] = n;
        const daily = sold / 14, threshold = daily * lead + buffer, position = stock + inbound;
        return [row.SKU, decimal(daily), decimal(threshold), String(position), daily === 0 ? 'UNKNOWN' : decimal(stock / daily), position <= threshold ? 'REVIEW' : 'HOLD'];
      }),
      summary: 'Observed 14-day averages are not forecasts. REVIEW is not an order instruction.', issues
    };
  }
  if (id === 'retail-report' || id === 'market-orders') {
    const market = id === 'market-orders';
    unique(rows, [market ? 'Order' : 'SKU']);
    if (market) for (const row of rows) unique([row], ['Seller']);
    const issues: string[] = [], output: string[][] = [], sellers = new Map<string, number>();
    let grossTotal = 0, refundTotal = 0, commissionTotal = 0, allocationTotal = 0;
    for (const row of rows) {
      const name = market ? row.Order : row.SKU;
      const amounts = values(row, market ? ['Gross amount', 'Refund amount'] : ['Unit price', 'Refund amount']);
      const units = market ? 1 : number(row.Units, 'Units', true);
      if (!amounts || units === null) {
        issues.push(`${name}: missing report input.`);
        output.push(market ? [name, row.Seller, 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN'] : [name, 'UNKNOWN', 'UNKNOWN', 'UNKNOWN']);
        continue;
      }
      const gross = amounts[0] * units, refund = amounts[1];
      if (refund > gross) throw new Error('Refund amount cannot exceed gross amount in this exercise.');
      const retained = gross - refund, commission = market ? Math.round(retained / 10) : 0, allocation = retained - commission;
      grossTotal += gross; refundTotal += refund; commissionTotal += commission; allocationTotal += allocation;
      if (market) {
        output.push([name, row.Seller, usd(gross), usd(refund), usd(retained), usd(commission), usd(allocation)]);
        const seller = row.Seller.trim();
        sellers.set(seller, (sellers.get(seller) ?? 0) + allocation);
      } else output.push([name, usd(gross), usd(refund), usd(retained)]);
    }
    const label = issues.length ? 'KNOWN SUBTOTAL - INCOMPLETE' : 'TOTAL';
    if (market) {
      output.push([label, '', usd(grossTotal), usd(refundTotal), usd(grossTotal - refundTotal), usd(commissionTotal), usd(allocationTotal)]);
      for (const [seller, allocation] of sellers) output.push(['SELLER KNOWN ALLOCATION', seller, '', '', '', '', usd(allocation)]);
    } else output.push([label, usd(grossTotal), usd(refundTotal), usd(grossTotal - refundTotal)]);
    return {
      columns: market ? ['Order', 'Seller', 'Gross (USD)', 'Refunds (USD)', 'After refunds (USD)', 'Commission (USD)', 'Seller allocation (USD)'] : ['SKU', 'Gross (USD)', 'Refunds (USD)', 'After refunds (USD)'],
      rows: output, issues,
      summary: market ? '10% commission rounded to cents per order. Allocations are not actual payouts or profit; incomplete rows exclude their whole amount.' : '2030-01-07 to 2030-01-13 inclusive; USD. Not profit, cash received or growth; incomplete rows exclude their whole amount.'
    };
  }
  if (id === 'market-catalog') {
    unique(rows, ['Seller', 'SKU']);
    const facts: Record<string, string> = { '["S1","N1"]': '2 A5 ruled notebooks; 80 pages each', '["S2","P1"]': '3 black-ink pens' };
    const issues: string[] = [];
    const output = rows.map((row) => {
      const source = facts[JSON.stringify([row.Seller.trim(), row.SKU.trim()])];
      const supported = Boolean(source && row.Claim.trim() === source);
      if (!supported) issues.push(`${row.Seller}/${row.SKU}: compare the claim with the fictional source.`);
      return [row.Seller, row.SKU, row.Claim || 'UNKNOWN', source ?? 'UNKNOWN', supported ? 'MATCHES FICTIONAL SOURCE' : 'REVIEW REQUIRED'];
    });
    return { columns: ['Seller', 'SKU', 'Claim', 'Source fact', 'Status'], rows: output, issues, summary: 'Exact comparison with two fictional facts only, not AI moderation, seller verification or publication approval.' };
  }
  if (id === 'logistics-stock') {
    if (!requests) throw new Error('Order requests are required.');
    checkShape('logistics-orders', requests);
    unique(rows, ['SKU']); unique(requests, ['Order']);
    if (rows.length !== 2 || !rows.some((row) => row.SKU.trim() === 'NB-A') || !rows.some((row) => row.SKU.trim() === 'PN-B')) {
      throw new Error('Receiving must contain exactly NB-A and PN-B for this exercise.');
    }
    const available = new Map<string, number>(), reserved = new Map<string, number>(), issues: string[] = [], output: string[][] = [];
    for (const row of rows) {
      const n = values(row, ['Expected receipt', 'Counted usable', 'Quarantined'], true);
      if (!n) { issues.push(`${row.SKU}: missing receipt count.`); continue; }
      const [expected, usable, quarantine] = n;
      if (expected !== usable + quarantine) { issues.push(`${row.SKU}: receipt discrepancy requires review.`); }
      available.set(row.SKU.trim(), usable); reserved.set(row.SKU.trim(), 0);
      output.push(['RECEIPT', row.SKU, String(usable), String(quarantine), '', expected === usable + quarantine ? 'RECONCILED' : 'REVIEW REQUIRED']);
    }
    const parsed = requests.map((row) => {
      const n = values(row, ['NB-A quantity', 'PN-B quantity'], true);
      if (!n) issues.push(`${row.Order}: missing request quantity.`);
      if (n && n.every((quantity) => quantity === 0)) throw new Error('Each order must request at least one unit.');
      return { row, n };
    });
    if (issues.length) {
      return { columns: ['Record', 'Identifier', 'Usable / NB-A units', 'Quarantine / PN-B units', 'Shortage', 'Status'], rows: output, issues, summary: 'Reservation run blocked by incomplete or discrepant source. No orders reserved; counts are unverified.' };
    }
    for (const { row, n } of parsed) {
      if (!n) throw new Error('Missing request input.');
      const skus = ['NB-A', 'PN-B'];
      const shortages = skus.map((sku, index) => Math.max(0, n[index] - (available.get(sku) ?? 0)));
      const hold = shortages.some((quantity) => quantity > 0);
      if (!hold) skus.forEach((sku, index) => {
        available.set(sku, (available.get(sku) ?? 0) - n[index]);
        reserved.set(sku, (reserved.get(sku) ?? 0) + n[index]);
      });
      output.push(['ORDER', row.Order, String(n[0]), String(n[1]), shortages.map((quantity, index) => `${skus[index]} ${quantity}`).join('; '), hold ? 'HOLD' : 'RESERVED']);
    }
    for (const [sku, count] of available) output.push(['BALANCE', sku, String(count), '', String(reserved.get(sku)), 'AVAILABLE / RESERVED']);
    return { columns: ['Record', 'Identifier', 'Usable / NB-A units', 'Quarantine / PN-B units', 'Shortage / reserved', 'Status'], rows: output, issues, summary: 'Whole-order reservations only. Quarantined units excluded; zero physical picks, dispatches or shipments.' };
  }
  if (id === 'logistics-return') {
    unique(rows, ['Return']);
    const issues: string[] = [];
    const output = rows.map((row) => {
      if (!['NB-A', 'PN-B'].includes(row.SKU.trim())) throw new Error('Use NB-A or PN-B for returned stock.');
      const count = number(row['Returned units'], 'Returned units', true);
      if (count === 0) throw new Error('Returned units must be greater than zero.');
      if (count === null) issues.push(`${row.Return}: missing return quantity.`);
      return [row.Return, row.SKU, count === null ? 'UNKNOWN' : String(count), count === null ? 'UNRESOLVED' : 'QUARANTINE - INSPECTION PENDING', '0'];
    });
    return { columns: ['Return', 'SKU', 'Returned units', 'Status', 'Added to available stock'], rows: output, issues, summary: 'Returns from earlier orders; reservation balances unchanged. No inspection, stock release, refunds or shipments performed.' };
  }
  throw new Error('Run receiving and reservations to evaluate order requests.');
}

export function commerceResultText(id: string, source: PracticeRow[], result: PracticeResult, requests?: PracticeRow[]): string {
  return [
    'FICTIONAL COMMERCE PRACTICE - NOT OWNER APPROVAL',
    `Exercise: ${id}`, 'Source inputs:', JSON.stringify(source, null, 2),
    ...(requests ? ['Order request inputs:', JSON.stringify(requests, null, 2)] : []),
    'Calculated worksheet:', result.columns.join(' | '), ...result.rows.map((row) => row.join(' | ')),
    result.summary, 'Unresolved issues:', result.issues.length ? result.issues.join('\n') : 'None detected by this limited exercise.',
    'Real owner approval: BLOCKED. Demand and actual business outcomes not established.',
    'No AI model, live integration, payment, publication or shipment.',
    'AI review prompt: Audit these fictional inputs and calculations; preserve unknowns, flag unsupported claims and explain limitations. Do not invent approval, actual income, deliveries or real client results.'
  ].join('\n\n');
}
