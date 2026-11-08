import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
import { readAndValidateCatalog } from './content-catalog.mjs';

const repo = new URL('../../', import.meta.url).pathname;
async function loadModule(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}
const { onlineRetailSteps, marketplaceSteps, logisticsSteps } = await loadModule('../lib/commerce-services-tutorials.ts');
const { commerceServicesTranslations } = await loadModule('../lib/translations/commerce-services.ts');
const tracks = [
  ['ai-online-retail', onlineRetailSteps],
  ['ai-marketplace-model', marketplaceSteps],
  ['ai-logistics-services', logisticsSteps]
];
const kit = await readFile(new URL('../../downloads/ai-commerce-services-kit.md', import.meta.url), 'utf8');

test('three platform-neutral courses have 18 complete, distinctly keyed lessons', () => {
  const ids = new Set();
  for (const [track, steps] of tracks) {
    assert.equal(steps.length, 6, track);
    for (const step of steps) {
      assert.ok(!ids.has(step.id));
      ids.add(step.id);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) assert.ok(step[field]?.trim(), `${step.id}: ${field}`);
      assert.ok(step.explanation.length >= 2);
    }
    assert.match(steps[0].explanation.join(' '), /fictional/i);
    assert.match(steps[5].explanation.join(' '), /BLOCKED/);
  }
  assert.equal(ids.size, 18);
  const text = JSON.stringify(tracks) + kit;
  assert.doesNotMatch(text, /Amazon|Seller Central|FBA|FBM/);
  assert.match(text, /No automatic publication/);
  assert.match(text, /credentials|passwords/);
  assert.match(text, /UNVALIDATED/);
});

test('all 18 commerce lessons have complete French, German and Spanish translations', () => {
  const expectedIds = {
    'ai-online-retail': onlineRetailSteps.map(({ id }) => id),
    'ai-marketplace-model': marketplaceSteps.map(({ id }) => id),
    'ai-logistics-services': logisticsSteps.map(({ id }) => id)
  };
  for (const [tutorialId, steps] of Object.entries(expectedIds)) {
    for (const locale of ['fr', 'de', 'es']) {
      const translation = commerceServicesTranslations[tutorialId][locale];
      assert.ok(translation.title.trim(), `${locale}/${tutorialId}: title`);
      assert.ok(translation.intro.trim(), `${locale}/${tutorialId}: intro`);
      assert.notEqual(translation.title, tracks.find(([id]) => id === tutorialId)[1][0].title);
      assert.deepEqual(Object.keys(translation.steps), steps, `${locale}/${tutorialId}: stable step IDs`);
      const sourceSteps = tracks.find(([id]) => id === tutorialId)[1];
      for (const source of sourceSteps) {
        const translated = translation.steps[source.id];
        assert.equal(translated.explanation.length, source.explanation.length, `${locale}/${source.id}`);
        for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
          assert.ok(translated[field]?.trim(), `${locale}/${source.id}.${field}`);
          assert.notEqual(translated[field], source[field], `${locale}/${source.id}.${field}`);
        }
        translated.explanation.forEach((text, index) => {
          assert.ok(text.trim(), `${locale}/${source.id}.explanation[${index}]`);
          assert.notEqual(text, source.explanation[index], `${locale}/${source.id}.explanation[${index}]`);
        });
        assert.equal('id' in translated, false, `${locale}/${source.id}: progress ID must remain in source`);
      }
    }
  }
});

test('commerce course translations preserve IDs, formulas, sample arithmetic and safety boundaries', () => {
  for (const locale of ['fr', 'de', 'es']) {
    const retail = commerceServicesTranslations['ai-online-retail'][locale].steps;
    assert.match(retail['retail-cost-and-fulfillment'].code, /=B1-SUM\(B2:B6\)/);
    assert.match(retail['retail-cost-and-fulfillment'].code, /=B7\/B1/);
    assert.match(retail['retail-inventory-planning'].code, /G2 =B2\/14/);
    assert.match(retail['retail-inventory-planning'].code, /J2 =IF\(I2<=H2,"REVIEW","HOLD"\)/);
    assert.match(retail['retail-inventory-planning'].code, /NB-A \| 28 \| 18 \| 0 \| 10 \| 6/);
    assert.match(retail['retail-inventory-planning'].code, /PN-B \| 14 \| 30 \| 0 \| 7 \| 4/);
    assert.match(retail['retail-report-and-support'].code, /2030-01-07.*2030-01-13/);
    assert.match(retail['retail-report-and-support'].code, /250/);
    assert.match(retail['retail-report-and-support'].code, /230/);
    assert.match(retail['retail-inventory-planning'].explanation.join(' '), /TO CONFIRM/);
    assert.match(retail['retail-service-handover'].code, /BLOCKED - fictional practice/);

    const marketplace = commerceServicesTranslations['ai-marketplace-model'][locale].steps;
    const ledger = marketplace['marketplace-orders-and-commission'];
    assert.match(ledger.code, /O1 \| S1 \| 100 \| 0 \| 100 \| 10 \| 90/);
    assert.match(ledger.code, /O2 \| S2 \| 80 \| 20 \| 60 \| 6 \| 54/);
    assert.match(ledger.code, /230 \| 70 \| 160 \| 16 \| 144/);
    assert.match(ledger.code, /ERROR\/REVIEW/);
    assert.match(ledger.code, /UNRESOLVED/);
    assert.match(marketplace['marketplace-catalog'].code, /NO VERIFIED MATCH/);
    assert.match(marketplace['marketplace-support'].code, /UNKNOWN/);
    assert.match(marketplace['marketplace-handover'].code, /BLOCKED.*UNVALIDATED/);

    const logistics = commerceServicesTranslations['ai-logistics-services'][locale].steps;
    assert.match(logistics['logistics-receiving-and-stock'].code, /NB-A \| 30 \| 28 \| 2 \| 30 \| A1/);
    assert.match(logistics['logistics-pick-and-pack'].code, /L1: NB-A 5, PN-B 3 -> RESERVED/);
    assert.match(logistics['logistics-pick-and-pack'].code, /L2: NB-A 25 -> HOLD/);
    assert.match(logistics['logistics-pick-and-pack'].code, /NB-A 23.*PN-B 13/);
    assert.match(logistics['logistics-dispatch-and-returns'].code, /R1/);
    assert.match(logistics['logistics-cost-and-report'].code, /8 - 3 - 1 - 2 = 2/);
    assert.match(logistics['logistics-cost-and-report'].code, /80 - 60 = 20/);
    assert.match(logistics['logistics-handover'].code, /BLOCKED/);
  }
});

test('retail worksheet arithmetic and unknown-data boundaries match the lessons', () => {
  const cost = onlineRetailSteps[1].code;
  const amounts = [...cost.matchAll(/\| B[1-6] (\d+)/g)].map((match) => Number(match[1]));
  assert.deepEqual(amounts, [20, 6, 3, 4, 1, 1]);
  const contribution = amounts[0] - amounts.slice(1).reduce((sum, amount) => sum + amount, 0);
  assert.equal(contribution, 5);
  assert.equal(contribution / amounts[0], 0.25);
  const stock = onlineRetailSteps[3].code;
  const rows = [...stock.matchAll(/(NB-A|PN-B) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+)/g)];
  assert.equal(rows.length, 2);
  const computed = rows.map(([, sku, sold, usable, inbound, lead, buffer]) => {
    const daily = Number(sold) / 14;
    const threshold = daily * Number(lead) + Number(buffer);
    const position = Number(usable) + Number(inbound);
    return [sku, daily, threshold, position, position <= threshold ? 'REVIEW' : 'HOLD'];
  });
  assert.deepEqual(computed, [['NB-A', 2, 26, 18, 'REVIEW'], ['PN-B', 1, 11, 30, 'HOLD']]);
  assert.equal(Number(rows[0][3]) / computed[0][1], 9);
  assert.match(stock, /Missing lead time: TO CONFIRM/);
  assert.match(onlineRetailSteps[3].explanation.join(' '), /not an order quantity/);
  const reportRows = [...onlineRetailSteps[4].code.matchAll(/(?:NB-A|PN-B) \| (\d+) \| (\d+) \| (\d+)/g)];
  const gross = reportRows.reduce((sum, [, units, price]) => sum + Number(units) * Number(price), 0);
  const refunds = reportRows.reduce((sum, [, , , refund]) => sum + Number(refund), 0);
  assert.deepEqual([gross, refunds, gross - refunds], [250, 20, 230]);
  assert.match(onlineRetailSteps[4].code, /growth: UNKNOWN/);
});

test('marketplace commission reconciles by order and seller, not as actual payouts', () => {
  const rows = [...marketplaceSteps[3].code.matchAll(/(O\d) \| (S\d) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+)/g)];
  assert.equal(rows.length, 3);
  const totals = [0, 0, 0, 0, 0];
  const sellers = {};
  for (const [, , seller, ...values] of rows) {
    const [gross, refund, retained, commission, allocation] = values.map(Number);
    assert.equal(retained, gross - refund);
    assert.equal(commission, retained * 0.1);
    assert.equal(allocation + commission, retained);
    values.forEach((value, index) => { totals[index] += Number(value); });
    sellers[seller] = (sellers[seller] ?? 0) + allocation;
  }
  assert.deepEqual(totals, [230, 70, 160, 16, 144]);
  assert.deepEqual(sellers, { S1: 90, S2: 54 });
  assert.match(marketplaceSteps[3].code, /Duplicate O2 -> ERROR\/REVIEW/);
  assert.match(marketplaceSteps[3].code, /Missing refund -> UNRESOLVED/);
  assert.match(marketplaceSteps[3].code, /Not actual payouts\/profit/);
  assert.match(marketplaceSteps[2].code, /Waterproof notebook -> NO VERIFIED MATCH/);
});

test('logistics reservations exclude damaged stock, duplicates and held orders', () => {
  const receipt = [...logisticsSteps[1].code.matchAll(/(NB-A|PN-B) \| (\d+) \| (\d+) \| (\d+) \| (\d+)/g)];
  assert.equal(receipt.length, 2);
  const available = {};
  for (const [, sku, expected, usable, quarantined, total] of receipt) {
    assert.equal(Number(usable) + Number(quarantined), Number(total));
    assert.equal(Number(total), Number(expected));
    available[sku] = Number(usable);
  }
  const orders = [...logisticsSteps[2].code.matchAll(/(L\d): (NB-A \d+(?:, PN-B \d+)?|PN-B \d+) ->/g)];
  assert.equal(orders.length, 3);
  const statuses = [];
  const reserved = { 'NB-A': 0, 'PN-B': 0 };
  for (const [ , id, items] of orders) {
    const request = [...items.matchAll(/(NB-A|PN-B) (\d+)/g)].map(([, sku, quantity]) => [sku, Number(quantity)]);
    const fits = request.every(([sku, quantity]) => available[sku] >= quantity);
    statuses.push([id, fits ? 'RESERVED' : 'HOLD']);
    if (fits) for (const [sku, quantity] of request) {
      available[sku] -= quantity;
      reserved[sku] += quantity;
    }
  }
  assert.deepEqual(statuses, [['L1', 'RESERVED'], ['L2', 'HOLD'], ['L3', 'RESERVED']]);
  assert.deepEqual(available, { 'NB-A': 23, 'PN-B': 13 });
  assert.deepEqual(reserved, { 'NB-A': 5, 'PN-B': 7 });
  assert.match(logisticsSteps[2].code, /Repeated L1 -> DUPLICATE\/REVIEW/);
  assert.match(logisticsSteps[3].code, /Available after R1: NB-A 23; PN-B 13 \(unchanged\)/);
  assert.equal(8 - 3 - 1 - 2, 2);
  assert.equal((8 - 3 - 1 - 2) / 8, 0.25);
  assert.match(logisticsSteps[4].code, /80 - 60 = 20/);
  assert.match(logisticsSteps[4].code, /0 physical shipments/);
});

test('all three paths, their goal, kit and recommendations are synced and translated', async () => {
  const catalog = await readAndValidateCatalog(repo);
  const matching = catalog.paths.filter((path) => path.goal === 'build-ai-commerce');
  assert.deepEqual(matching.map((path) => path.id), tracks.map(([id]) => id));
  assert.ok(catalog.paths.length >= 35);
  const recommendation = catalog.recommendations['build-ai-commerce'];
  assert.deepEqual(recommendation.starters, ['ai-commerce-services-kit']);
  const pack = catalog.starterPacks.find(({ id }) => id === 'ai-commerce-services-kit');
  assert.ok(pack);
  for (const name of ['paths', 'goals', 'starter-packs', 'recommendations', 'starter-pack-checklists']) {
    assert.deepEqual(
      JSON.parse(await readFile(new URL(`../../data/${name}.json`, import.meta.url), 'utf8')),
      JSON.parse(await readFile(new URL(`../content/${name}.json`, import.meta.url), 'utf8'))
    );
  }
  assert.equal(kit, await readFile(new URL('../public/downloads/ai-commerce-services-kit.md', import.meta.url), 'utf8'));
  for (const locale of ['fr', 'de', 'es']) {
    const localizedFile = `../../downloads/ai-commerce-services-kit-${locale}.md`;
    const localizedKit = await readFile(new URL(localizedFile, import.meta.url), 'utf8');
    assert.ok(localizedKit.length > 15000, `${locale}: substantial localized commerce guide`);
    assert.equal(localizedKit, await readFile(
      new URL(`../public/downloads/ai-commerce-services-kit-${locale}.md`, import.meta.url), 'utf8'
    ));
    for (const invariant of [
      'https://www.desofec.com/tutorials/ai-online-retail',
      'https://www.desofec.com/tutorials/ai-marketplace-model',
      'https://www.desofec.com/tutorials/ai-logistics-services',
      'https://www.desofec.com/business-launchpad/commerce-lab',
      'Price 20 - product 6 - channel/payment 3 - packing/delivery 4',
      'Contribution/price = 5/20 = 25%',
      'sku,sold_14d,usable_stock,confirmed_inbound,lead_days,buffer',
      'G2 =B2/14',
      'J2 =IF(I2<=H2,"REVIEW","HOLD")',
      '250/20/230',
      'order,seller,gross,refund',
      '230',
      '70',
      '160',
      '16',
      '144',
      '90',
      '54',
      'NO VERIFIED MATCH',
      'sku,expected,usable,quarantined,total,location',
      'L1: NB-A 5 and PN-B 3 -> RESERVED; available NB-A 23, PN-B 17',
      'L2: NB-A 25 -> HOLD, shortage 2; reserve nothing',
      '80',
      '60',
      '20',
      'Real owner/client approval: BLOCKED - fictional practice',
      'Demand: UNVALIDATED unless actual evidence recorded',
      'FICTIONAL PRACTICE'
    ]) {
      assert.ok(localizedKit.includes(invariant), `${locale}: missing invariant "${invariant}"`);
    }
  }
  const goal = catalog.goals.find(({ id }) => id === 'build-ai-commerce');
  const texts = [...matching.flatMap((path) => [path.title, path.description, ...path.steps]),
    goal.name, goal.description, recommendation.title, recommendation.summary, ...recommendation.steps,
    pack.title, pack.description, ...catalog.starterPackChecklists[pack.id]];
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/catalog-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of texts) assert.ok(book[text]?.trim(), `${locale}: ${text}`);
  }
  const seed = await readFile(new URL('../../supabase/seed.sql', import.meta.url), 'utf8');
  for (const [id] of tracks) assert.ok(seed.includes(`'${id}'`), id);
  assert.ok(seed.includes("'build-ai-commerce'"));
});

test('tutorial routes share the commerce kit and support guided projects', async () => {
  const registry = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  for (const [id] of tracks) {
    assert.ok(registry.includes(`pathId: '${id}'`));
    assert.ok(registry.includes(`href: '/tutorials/${id}'`));
    assert.ok(kit.includes(`/tutorials/${id}`));
  }
  for (const [id] of tracks) {
    assert.match(registry, new RegExp(`pathId: '${id}'[\\s\\S]*?serviceKitId: 'ai-commerce-services-kit'`));
  }
  const page = await readFile(new URL('../app/tutorials/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /tutorial\.starterPackId/);
  assert.match(page, /\/starter-packs\/\$\{tutorial\.starterPackId\}/);
});

test('idea planner discovers commerce models in all supported languages', async () => {
  const { matchGoals } = await loadModule('../lib/idea-planner.ts');
  for (const idea of ['online retail', 'multi-vendor marketplace', 'logistics', 'boutique en ligne',
    'logistique', 'onlinehandel', 'marktplatz', 'logistik', 'comercio electrónico', 'logística']) {
    assert.equal(matchGoals(idea)[0].goalId, 'build-ai-commerce', idea);
  }
});
