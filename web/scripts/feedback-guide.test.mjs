import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../lib/feedback-guide.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;
const { emptyFeedbackDraft, feedbackFields, feedbackReport } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const t = (text) => text;

test('request and revision exports isolate fields and label missing evidence', () => {
  const draft = emptyFeedbackDraft();
  assert.equal(feedbackFields.length, 6);
  const emptyRequest = feedbackReport(draft, 'request', t);
  const emptyPlan = feedbackReport(draft, 'revision', t);
  assert.equal((emptyRequest.match(/\[TO CONFIRM\]/g) ?? []).length, 3);
  assert.equal((emptyPlan.match(/\[TO CONFIRM\]/g) ?? []).length, 4);
  Object.assign(draft, {
    sample: 'Fictional sample', context: 'DRAFT_CONTEXT', questions: 'DRAFT_QUESTIONS',
    response: 'PRIVATE_RESPONSE', decision: 'PRIVATE_DECISION', check: 'PRIVATE_CHECK'
  });
  const request = feedbackReport(draft, 'request', t);
  const plan = feedbackReport(draft, 'revision', t);
  assert.match(request, /Fictional sample/);
  assert.match(request, /DRAFT_QUESTIONS/);
  assert.doesNotMatch(request, /PRIVATE_RESPONSE|PRIVATE_DECISION|PRIVATE_CHECK/);
  assert.match(plan, /PRIVATE_RESPONSE/);
  assert.match(plan, /not proof of independent review or approval/);
  assert.doesNotMatch(plan, /DRAFT_CONTEXT|DRAFT_QUESTIONS/);
  assert.match(request, /not sent by the app/);
});

test('user text is kept as text, not interpreted, and translation applies to headings', () => {
  const draft = emptyFeedbackDraft();
  draft.sample = '<script>alert(1)</script>\nSecond line';
  const report = feedbackReport(draft, 'request', (text) => `T:${text}`);
  assert.match(report, /<script>alert\(1\)<\/script>\nSecond line/);
  assert.match(report, /T:What fictional work sample will you share\?/);
  assert.equal(emptyFeedbackDraft().sample, '');
});

test('guide and export labels have French, German and Spanish translations', async () => {
  const component = await readFile(new URL('../components/feedback-guide.tsx', import.meta.url), 'utf8');
  const page = await readFile(new URL('../app/business-launchpad/feedback-guide/page.tsx', import.meta.url), 'utf8');
  const strings = [
    ...[...component.matchAll(/tr\('([^']+)'\)/g)].map((match) => match[1]),
    ...[...page.matchAll(/<Tr>([^<{]+)<\/Tr>/g)].map((match) => match[1]),
    ...feedbackFields.map((field) => field.label),
    'FICTIONAL PRACTICE - FEEDBACK REQUEST DRAFT',
    'FICTIONAL PRACTICE - SELF-RECORDED REVISION PLAN',
    'This request is not sent by the app. Share only if you choose, and review the contents first.',
    'This is a learner record, not proof of independent review or approval. No project changes were applied.',
    'Feedback request downloaded. Nothing was sent.',
    'Revision plan downloaded. No project changes were applied.',
    'The download failed. Please try again.',
    'Practice Project Feedback Guide',
    'Prepare a respectful feedback request, record observations and plan a revision for a fictional practice project.'
  ];
  assert.ok(strings.length > 25);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: ${text}`);
  }
});

test('guide links to the existing project workflow and does not persist or send feedback', async () => {
  const component = await readFile(new URL('../components/feedback-guide.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /localStorage|fetch\(|saveProjectPart|dangerouslySetInnerHTML/);
  assert.match(component, /beforeunload/);
  assert.match(component, /disabled=\{!reviewedRequest\}/);
  assert.match(component, /disabled=\{!reviewedPlan\}/);
  assert.match(component, /setReviewedRequest\(false\)/);
  assert.match(component, /setReviewedPlan\(false\)/);
  for (const path of ['../app/start-here/page.tsx', '../app/business-launchpad/page.tsx',
    '../components/project-review-centre.tsx', '../app/sitemap.ts']) {
    assert.match(await readFile(new URL(path, import.meta.url), 'utf8'), /\/business-launchpad\/feedback-guide/);
  }
  const worksheet = await readFile(new URL('../../downloads/practice-feedback-worksheet.md', import.meta.url), 'utf8');
  assert.equal(worksheet, await readFile(new URL('../public/downloads/practice-feedback-worksheet.md', import.meta.url), 'utf8'));
  assert.match(worksheet, /do not invent a review/);
  assert.match(worksheet, /does not automatically resolve an older review/);
});
