import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function moduleUrl(file, replace = (text) => text) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  return `data:text/javascript;base64,${Buffer.from(replace(output)).toString('base64')}`;
}
const numbers = await moduleUrl('../lib/pilot-numbers.ts');
const practice = await moduleUrl('../lib/commerce-practice.ts', (text) => text.replace("'@/lib/pilot-numbers'", JSON.stringify(numbers)));
const { commerceExercises, commerceTrack, sampleCommerceRows, evaluateCommerce, commerceResultText } = await import(practice);
const sample = sampleCommerceRows;
const run = (id) => evaluateCommerce(id, sample(id), id === 'logistics-stock' ? sample('logistics-orders') : undefined);

test('all three tracks supply independent editable samples and exact practice outputs', () => {
  assert.deepEqual([...new Set(commerceExercises.map((entry) => entry.track))], ['retail', 'marketplace', 'logistics']);
  const rows = sample('retail-stock');
  rows[0].SKU = 'changed';
  assert.equal(sample('retail-stock')[0].SKU, 'NB-A');
  assert.deepEqual(run('retail-cost').rows[0], ['20.00', '15.00', '5.00', '25.00%', '20.00', '15.00', '5.00']);
  assert.deepEqual(run('retail-stock').rows, [
    ['NB-A', '2.00', '26.00', '18', '9.00', 'REVIEW'],
    ['PN-B', '1.00', '11.00', '30', '30.00', 'HOLD']
  ]);
  assert.deepEqual(run('retail-report').rows.at(-1), ['TOTAL', '250.00', '20.00', '230.00']);
  assert.deepEqual(run('market-orders').rows.slice(3), [
    ['TOTAL', '', '230.00', '70.00', '160.00', '16.00', '144.00'],
    ['SELLER KNOWN ALLOCATION', 'S1', '', '', '', '', '90.00'],
    ['SELLER KNOWN ALLOCATION', 'S2', '', '', '', '', '54.00']
  ]);
  assert.deepEqual(run('logistics-cost').rows[0], ['8.00', '6.00', '2.00', '25.00%', '80.00', '60.00', '20.00']);
});

test('missing values remain unresolved, while genuine zero and negative contribution stay meaningful', () => {
  for (const id of ['retail-cost', 'retail-stock', 'retail-report', 'market-orders', 'logistics-cost', 'logistics-return']) {
    const rows = sample(id);
    const field = commerceExercises.find((entry) => entry.id === id).fields.at(-1);
    rows[0][field] = '';
    const result = evaluateCommerce(id, rows);
    assert.ok(result.issues.length > 0, id);
    assert.match(JSON.stringify(result), /UNKNOWN|UNRESOLVED|INCOMPLETE/i);
  }
  const cost = sample('retail-cost');
  cost[0]['Product cost'] = '30';
  assert.equal(evaluateCommerce('retail-cost', cost).rows[0][2], '-19.00');
  cost[0].Price = '0';
  assert.throws(() => evaluateCommerce('retail-cost', cost), /greater than zero/);
  const stock = sample('retail-stock');
  stock[0]['Sold in 14 days'] = '0';
  assert.equal(evaluateCommerce('retail-stock', stock).rows[0][4], 'UNKNOWN');
  const weekly = sample('retail-report');
  weekly[0]['Refund amount'] = '';
  assert.deepEqual(evaluateCommerce('retail-report', weekly).rows.at(-1), ['KNOWN SUBTOTAL - INCOMPLETE', '50.00', '0.00', '50.00']);
});

test('malformed values, identifiers and out-of-bound source are errors, never successful fallbacks', () => {
  for (const value of ['-1', 'NaN', 'Infinity', '1e3', '1.001', '100001', '=SUM(A1)']) {
    const rows = sample('retail-cost'); rows[0].Price = value;
    assert.throws(() => evaluateCommerce('retail-cost', rows), /Invalid money amount/);
  }
  for (const value of ['-1', '1.5', '1e3', '100001', 'NaN']) {
    const rows = sample('retail-stock'); rows[0]['Lead days'] = value;
    assert.throws(() => evaluateCommerce('retail-stock', rows), /whole numbers/);
  }
  for (const id of ['retail-stock', 'retail-report', 'market-orders', 'market-catalog', 'logistics-return']) {
    const rows = sample(id); rows.push({ ...rows[0] });
    assert.throws(() => evaluateCommerce(id, rows), /Duplicate identifier/);
  }
  const report = sample('retail-report'); report[0]['Refund amount'] = '201';
  assert.throws(() => evaluateCommerce('retail-report', report), /cannot exceed/);
  const seller = sample('market-orders'); seller[0].Seller = '';
  assert.throws(() => evaluateCommerce('market-orders', seller), /Identifiers/);
  assert.throws(() => evaluateCommerce('retail-cost', []), /1 to 20/);
  assert.throws(() => evaluateCommerce('retail-cost', [{ Price: '20' }]), /Invalid exercise fields/);
  assert.throws(() => evaluateCommerce('retail-cost', [...sample('retail-cost'), ...sample('retail-cost')]), /exactly one/);
});

test('per-order commissions round to cents and preserve ledger reconciliation', () => {
  const rows = [{ Order: 'O1', Seller: 'S1', 'Gross amount': '0.05', 'Refund amount': '0' }];
  assert.deepEqual(evaluateCommerce('market-orders', rows).rows[0], ['O1', 'S1', '0.05', '0.00', '0.05', '0.01', '0.04']);
  rows[0]['Refund amount'] = '0.05';
  assert.deepEqual(evaluateCommerce('market-orders', rows).rows[0].slice(4), ['0.00', '0.00', '0.00']);
});

test('catalog comparisons preserve identity and route unsupported claims to human review', () => {
  const rows = sample('market-catalog');
  assert.equal(run('market-catalog').issues.length, 0);
  rows[0].Claim += '; recycled';
  rows[1].Seller = 'S1';
  const result = evaluateCommerce('market-catalog', rows);
  assert.equal(result.issues.length, 2);
  assert.ok(result.rows.every((row) => row.at(-1) === 'REVIEW REQUIRED'));
  assert.match(result.summary, /not AI moderation/);
});

test('logistics reserves sequentially, excludes quarantine and blocks uncertain receiving', () => {
  const result = run('logistics-stock');
  assert.deepEqual(result.rows.filter((row) => row[0] === 'ORDER').map((row) => [row[1], row.at(-1)]), [['L1', 'RESERVED'], ['L2', 'HOLD'], ['L3', 'RESERVED']]);
  assert.deepEqual(result.rows.filter((row) => row[0] === 'BALANCE'), [
    ['BALANCE', 'NB-A', '23', '', '5', 'AVAILABLE / RESERVED'],
    ['BALANCE', 'PN-B', '13', '', '7', 'AVAILABLE / RESERVED']
  ]);
  const receipt = sample('logistics-stock');
  receipt[0]['Counted usable'] = '27';
  let blocked = evaluateCommerce('logistics-stock', receipt, sample('logistics-orders'));
  assert.ok(blocked.issues.length);
  assert.ok(!blocked.rows.some((row) => row[0] === 'ORDER'));
  receipt[0]['Counted usable'] = '';
  blocked = evaluateCommerce('logistics-stock', receipt, sample('logistics-orders'));
  assert.match(blocked.summary, /blocked/);
  const requests = sample('logistics-orders');
  requests[0]['NB-A quantity'] = '';
  assert.ok(evaluateCommerce('logistics-stock', sample('logistics-stock'), requests).issues.length);
  requests[0]['NB-A quantity'] = '0'; requests[0]['PN-B quantity'] = '0';
  assert.throws(() => evaluateCommerce('logistics-stock', sample('logistics-stock'), requests), /at least one/);
  assert.throws(() => evaluateCommerce('logistics-stock', sample('logistics-stock'), [...sample('logistics-orders'), sample('logistics-orders')[0]]), /Duplicate/);
  assert.deepEqual(run('logistics-return').rows, [['R1', 'NB-A', '1', 'QUARANTINE - INSPECTION PENDING', '0']]);
});

test('exports include actual source, linked requests, unresolved evidence and no real approval', () => {
  const inputs = sample('logistics-stock'), requests = sample('logistics-orders');
  const text = commerceResultText('logistics-stock', inputs, evaluateCommerce('logistics-stock', inputs, requests), requests);
  for (const term of ['Counted usable', 'Expected receipt', 'Order request inputs', 'L2', 'HOLD', 'BALANCE', '23', '13', 'Real owner approval: BLOCKED', 'AI review prompt']) assert.ok(text.includes(term), term);
  assert.match(text, /No AI model, live integration/);
});

test('lab links, localization and temporary-state behavior are wired across surfaces', async () => {
  const registry = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  for (const track of ['retail', 'marketplace', 'logistics']) assert.ok(registry.includes(`/business-launchpad/commerce-lab?track=${track}`));
  assert.equal(commerceTrack('marketplace'), 'marketplace');
  assert.equal(commerceTrack('logistics'), 'logistics');
  assert.equal(commerceTrack('invalid'), 'retail');
  assert.equal(commerceTrack(undefined), 'retail');
  const ui = await readFile(new URL('../components/commerce-practice-lab.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(ui, /localStorage|sessionStorage|fetch\(|supabase/);
  assert.match(ui, /id === 'logistics-orders' \|\| id === 'logistics-stock'/);
  const labels = [...ui.matchAll(/tr\('([^']+)'\)/g)].map((match) => match[1]);
  for (const language of ['fr', 'de', 'es']) {
    const translations = JSON.parse(await readFile(new URL(`../content/translations/ui-${language}.json`, import.meta.url), 'utf8'));
    const catalog = JSON.parse(await readFile(new URL(`../content/translations/catalog-${language}.json`, import.meta.url), 'utf8'));
    for (const label of labels) assert.ok(translations[label] || catalog[label], `${language}: ${label}`);
  }
  for (const file of ['../app/paths/[id]/page.tsx', '../app/tutorials/[id]/page.tsx']) {
    assert.match(await readFile(new URL(file, import.meta.url), 'utf8'), /practiceHref/);
  }
  assert.match(await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8'), /commerce-lab/);
});
