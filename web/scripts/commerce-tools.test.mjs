import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { readAndValidateCatalog } from './content-catalog.mjs';

const catalog = await readAndValidateCatalog(fileURLToPath(new URL('../../', import.meta.url)));
const source = await readFile(new URL('../lib/commerce-tool-guides.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;
const { commerceToolGuides } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
const ids = ['shopify', 'sharetribe', 'zoho-inventory', 'shippo', 'zendesk', 'looker-studio'];

test('six distinct commerce tools bring the catalog to 51 without adding paths', async () => {
  assert.equal(catalog.tools.length, 51);
  assert.equal(catalog.paths.length, 36);
  const rec = catalog.recommendations['build-ai-commerce'];
  for (const id of ids) {
    assert.ok(catalog.tools.find((tool) => tool.id === id));
    assert.ok(rec.tools.includes(id));
  }
  for (const name of ['tools', 'recommendations']) {
    assert.deepEqual(
      JSON.parse(await readFile(new URL(`../../data/${name}.json`, import.meta.url), 'utf8')),
      JSON.parse(await readFile(new URL(`../content/${name}.json`, import.meta.url), 'utf8'))
    );
  }
  const seed = await readFile(new URL('../../supabase/seed.sql', import.meta.url), 'utf8');
  for (const id of ids) assert.ok(seed.includes(`'${id}'`));
});

test('every tool has setup, AI exercise, cost and limitation guidance with HTTPS references', () => {
  assert.deepEqual(commerceToolGuides.map((guide) => guide.toolId), ids);
  const stepIds = new Set();
  for (const guide of commerceToolGuides) {
    assert.equal(guide.steps.length, 3);
    assert.ok(guide.title && guide.intro);
    for (const step of guide.steps) {
      assert.ok(!stepIds.has(step.id));
      stepIds.add(step.id);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) assert.ok(step[field]?.trim());
      assert.ok(step.explanation.length >= 2);
      for (const resource of step.resources ?? []) {
        assert.equal(new URL(resource.url).protocol, 'https:');
        assert.ok(resource.label);
      }
    }
    const text = JSON.stringify(guide);
    assert.match(text, /not.*live-checked/i);
    assert.match(text, /fictional/i);
    assert.match(text, /document|spreadsheet|paper/i);
    assert.match(text, /cost|pricing|charges/i);
    assert.match(text, /BLOCKED/);
    assert.ok(guide.steps[0].resources.length >= 2);
  }
  assert.equal(stepIds.size, 18);
});

test('practice outputs retain exact calculations and safety boundaries', () => {
  const byId = Object.fromEntries(commerceToolGuides.map((guide) => [guide.toolId, guide]));
  const shopify = byId.shopify.steps[2].code.match(/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)=(\d+)/);
  const amounts = shopify.slice(1).map(Number);
  assert.equal(amounts[0] - amounts.slice(1, 6).reduce((sum, n) => sum + n, 0), amounts[6]);
  assert.equal(amounts[6] / amounts[0], 0.25);
  const orders = [...byId.sharetribe.steps[2].code.matchAll(/O\d \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+)/g)];
  assert.equal(orders.length, 3);
  const totals = [0, 0, 0, 0, 0];
  for (const row of orders) {
    const [gross, refund, retained, commission, allocation] = row.slice(1).map(Number);
    assert.equal(gross - refund, retained);
    assert.equal(retained * 0.1, commission);
    assert.equal(retained - commission, allocation);
    row.slice(1).forEach((n, i) => { totals[i] += Number(n); });
  }
  assert.deepEqual(totals, [230, 70, 160, 16, 144]);
  assert.match(byId.sharetribe.steps[2].code, /missing refund -> UNRESOLVED/);
  assert.match(byId['zoho-inventory'].steps[1].code, /available NB-A 23 \/ PN-B 13; reserved 5 \/ 7/);
  assert.match(byId['zoho-inventory'].steps[1].code, /Repeated L1 -> DUPLICATE\/REVIEW/);
  assert.match(byId.shippo.steps[1].code, /carrier acceptance NONE/);
  for (const match of byId.shippo.steps[2].code.matchAll(/(\d+)\+(\d+)\+(\d+)=(\d+)/g)) {
    const [a, b, c, total] = match.slice(1).map(Number);
    assert.equal(a + b + c, total);
  }
  assert.match(byId.zendesk.steps[1].code, /T3.*authorised account\/security process/);
  assert.match(byId.zendesk.steps[1].code, /0 messages sent/);
  const reportRows = [...byId['looker-studio'].steps[1].code.matchAll(/(?:NB-A|PN-B),(\d+),(\d+),(\d+)/g)];
  const gross = reportRows.reduce((sum, [, n, price]) => sum + Number(n) * Number(price), 0);
  const refund = reportRows.reduce((sum, [, , , n]) => sum + Number(n), 0);
  assert.deepEqual([gross, refund, gross - refund], [250, 20, 230]);
  assert.match(byId['looker-studio'].steps[2].code, /Missing refund -> UNRESOLVED/);
});

test('guides use non-path progress IDs with feedback disabled and bidirectional tool links', async () => {
  const registry = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  assert.match(registry, /pathId: `\$\{guide\.toolId\}-guide`/);
  assert.match(registry, /href: `\/tutorials\/\$\{guide\.toolId\}-guide`/);
  assert.match(registry, /feedbackEnabled: false/);
  assert.match(registry, /toolId: guide\.toolId/);
  const toolPage = await readFile(new URL('../app/tools/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(toolPage, /entry\.toolId === tool\.id/);
  assert.match(toolPage, /href=\{guide\.href\}/);
  const tutorialPage = await readFile(new URL('../app/tutorials/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(tutorialPage, /href=\{`\/tools\/\$\{tutorial\.toolId\}`\}/);
  assert.match(tutorialPage, /feedbackEnabled=\{tutorial\.feedbackEnabled\}/);
});

test('catalog and navigation text are translated in three languages', async () => {
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/catalog-${locale}.json`, import.meta.url), 'utf8'));
    for (const tool of catalog.tools.filter((tool) => ids.includes(tool.id))) {
      for (const text of [tool.description, tool.category, tool.badge]) assert.ok(book[text], `${locale}: ${text}`);
    }
    assert.ok(book['Tool guide']);
    const ui = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    assert.ok(ui['View tool details']);
  }
});
