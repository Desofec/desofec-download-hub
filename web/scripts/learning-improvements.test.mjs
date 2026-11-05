import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function contentUrl(relativePath, imports = {}) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  });
  for (const [specifier, dependency] of Object.entries({ '@/lib/pilot-numbers': '../lib/pilot-numbers.ts', ...imports })) {
    if (outputText.includes(`'${specifier}'`)) {
      outputText = outputText.replaceAll(`'${specifier}'`, JSON.stringify(await contentUrl(dependency)));
    }
  }
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

async function loadContent(relativePath, imports = {}) {
  return import(await contentUrl(relativePath, imports));
}

test('four service curricula each provide six complete and independently keyed lessons', async () => {
  const curricula = await loadContent('../lib/business-services-tutorials.ts');
  const allIds = new Set();
  for (const steps of Object.values(curricula)) {
    assert.equal(steps.length, 6);
    for (const step of steps) {
      assert.match(step.id, /^[a-z]+(?:-[a-z]+)+$/);
      assert.ok(!allIds.has(step.id));
      allIds.add(step.id);
      assert.ok(step.title && step.file && step.code && step.check && step.aiPrompt);
      assert.equal(step.explanation.length, 2);
      assert.ok(step.explanation.every((text) => text.length > 100));
    }
  }
  assert.equal(allIds.size, 24);
});

test('service worksheets retain independently verified scope, arithmetic and approval boundaries', async () => {
  const { contentServicesSteps, cadServicesSteps, microSaasSteps, educationServicesSteps } =
    await loadContent('../lib/business-services-tutorials.ts');
  const copy = (steps) => JSON.stringify(steps);
  assert.match(contentServicesSteps[0].code, /3 posts \(40-60 words each\), 4 FAQ answers/);
  assert.match(contentServicesSteps[2].code, /Open Sunday.*REMOVE/);
  assert.match(contentServicesSteps[2].code, /Delivery available.*REMOVE/);
  assert.match(contentServicesSteps[4].code, new RegExp(`EUR ${(1 + 2 + 1 + 1) * 20}`));
  assert.match(contentServicesSteps[5].code, /BLOCKED, not PASS/);
  assert.match(cadServicesSteps[1].code, new RegExp(`${80 * 40 * 3} mm\\^3`));
  assert.match(cadServicesSteps[1].code, /Front: 80 x 40 mm[\s\S]*Side: 3 x 40 mm[\s\S]*Top: 80 x 3 mm/);
  assert.match(cadServicesSteps[1].code, /front drawn 40 x 20 mm/);
  assert.match(cadServicesSteps[3].code, new RegExp(`${90 * 40 * 3} mm\\^3`));
  assert.match(cadServicesSteps[3].code, new RegExp(`${90 / 40}:1`));
  assert.match(copy(cadServicesSteps), /CONCEPT ONLY - NOT FOR MANUFACTURE/);
  assert.match(copy(cadServicesSteps), /personal-use CAD license may exclude paid client projects/);
  assert.match(microSaasSteps[2].code, /output\.textContent/);
  assert.doesNotMatch(microSaasSteps[2].code, /fetch\(|localStorage|innerHTML|https?:\/\//);
  assert.match(microSaasSteps[3].code, /41 characters.*visible error/);
  assert.match(educationServicesSteps[1].code, /3 min[\s\S]*5 min[\s\S]*4 min[\s\S]*3 min/);
  assert.equal(3 + 5 + 4 + 3, 15);
  assert.match(educationServicesSteps[2].code, /30/);
  assert.match(copy(educationServicesSteps), /0-4|0–4/);
  assert.match(copy(educationServicesSteps), /NOT RUN|not run/);
});

test('service intents select their distinct recommendations in four languages', async () => {
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const [goal, ideas] of [
    ['offer-content-services', ['content agency', 'agence de contenu', 'content-agentur', 'agencia de contenido']],
    ['offer-cad-services', ['cad service', 'service cao', 'cad-dienstleistung', 'servicio cad']],
    ['validate-micro-saas', ['validate micro-saas', 'valider saas', 'saas validieren', 'validar saas']],
    ['offer-education-services', ['adult workshop', 'atelier pour adultes', 'ki-schulung', 'taller para adultos']]
  ]) {
    for (const idea of ideas) assert.equal(matchGoals(idea)[0]?.goalId, goal, idea);
  }
  assert.equal(matchGoals('automation agency')[0]?.goalId, 'start-ai-business');
});

test('all three practical tutorials have complete translations without changing progress IDs', async () => {
  const { smallBusinessSteps, videoCreationSteps, careerSkillsSteps } = await loadContent('../lib/practical-ai-tutorials.ts');
  const tutorials = {
    'ai-small-business': smallBusinessSteps,
    'ai-video-creation': videoCreationSteps,
    'ai-career-skills': careerSkillsSteps
  };
  for (const language of ['fr', 'de', 'es']) {
    const loaded = await loadContent(`../lib/translations/practical-${language}.ts`);
    const translations = Object.values(loaded)[0];
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(tutorials).sort());
    for (const [id, steps] of Object.entries(tutorials)) {
      const translation = translations[id];
      assert.ok(translation.title && translation.intro);
      assert.deepEqual(Object.keys(translation.steps).sort(), steps.map((step) => step.id).sort());
      for (const step of steps) {
        const text = translation.steps[step.id];
        assert.ok(text.title && text.check && text.aiPrompt);
        assert.ok(text.explanation.length >= 1);
        assert.ok(text.explanation.every((paragraph) => paragraph.length > 0));
        if (step.code) assert.ok(text.code, `${language}/${id}/${step.id}: worksheet untranslated`);
      }
    }
  }
});

test('study board data validation rejects malformed responses instead of showing an empty board', async () => {
  const { studyRows, isStudyPost, isStudyRequest } = await loadContent('../lib/study-board-data.ts');
  const post = {
    id: 'post', goal_id: 'learn-ai', display_name: 'Learner', note: '', created_at: '2026-11-05',
    mine: false, my_request_status: null, joined_workspace_id: null
  };
  assert.deepEqual(studyRows([post], isStudyPost), [post]);
  assert.deepEqual(studyRows([], isStudyPost), []);
  for (const data of [null, {}, [{ ...post, mine: 'true' }], [{ ...post, my_request_status: 'invalid' }]]) {
    assert.throws(() => studyRows(data, isStudyPost), /Invalid study board response/);
  }
  const request = { id: 'request', post_id: 'post', goal_id: 'learn-ai', display_name: 'Learner', message: '' };
  assert.deepEqual(studyRows([request], isStudyRequest), [request]);
  assert.throws(() => studyRows([{ ...request, message: null }], isStudyRequest), /Invalid study board response/);
});

test('feedback response parsing preserves false votes and rejects malformed data', async () => {
  const { readLessonVote } = await loadContent('../lib/lesson-feedback.ts');
  assert.equal(readLessonVote(null), null);
  assert.equal(readLessonVote({ helpful: true }), true);
  assert.equal(readLessonVote({ helpful: false }), false);
  for (const invalid of [{}, [], { helpful: 'false' }, undefined]) {
    assert.throws(() => readLessonVote(invalid), /Invalid lesson feedback response/);
  }
});

test('review metadata only attaches to the exact reviewed description and URL', async () => {
  const { withToolReviews } = await loadContent('../lib/tool-review.ts');
  const tool = { id: 'tool', name: 'Tool', description: 'Reviewed', url: 'https://example.com' };
  const reviews = {
    tool: { reviewedOn: '2026-11-05', sourceUrl: 'https://example.com/help', toolUrl: tool.url, description: tool.description }
  };
  assert.equal(withToolReviews([tool], reviews)[0].review.reviewedOn, '2026-11-05');
  assert.equal(withToolReviews([{ ...tool, description: 'Changed' }], reviews)[0].review, undefined);
  assert.equal(withToolReviews([{ ...tool, url: 'https://different.example' }], reviews)[0].review, undefined);
  assert.equal(withToolReviews([{ ...tool, id: 'other' }], reviews)[0].review, undefined);
});

test('website challenge has seven ordered tasks with independent progress and a final review', async () => {
  const { websiteChallengeId, websiteChallengeSteps } = await loadContent('../lib/website-challenge.ts', {
    '@/lib/ai-website-tutorial': '../lib/ai-website-tutorial.ts'
  });
  assert.equal(websiteChallengeId, 'first-website-challenge');
  assert.equal(websiteChallengeSteps.length, 7);
  assert.equal(new Set(websiteChallengeSteps.map((step) => step.id)).size, 7);
  for (const [index, step] of websiteChallengeSteps.entries()) {
    assert.ok(step.title.startsWith(`Day ${index + 1}:`));
    assert.ok(step.check && step.aiPrompt && step.code && step.explanation.length);
  }
  assert.equal(websiteChallengeSteps[6].id, 'final-project-review');
  assert.ok(websiteChallengeSteps[4].explanation.join(' ').includes('commercial'));
});

test('automation services lessons keep six stable tasks, reproducible demo checks and honest costs', async () => {
  const { automationServicesSteps: steps } = await loadContent('../lib/automation-services-tutorial.ts');
  assert.deepEqual(steps.map((step) => step.id), [
    'validate-one-problem', 'define-safe-pilot', 'build-test-demo',
    'calculate-pilot-cost', 'prepare-honest-offer', 'handover-review-pilot'
  ]);
  for (const step of steps) {
    assert.ok(step.title && step.file && step.code && step.check && step.aiPrompt);
    assert.ok(step.explanation.length >= 2 && step.explanation.every(Boolean));
  }
  const cases = steps[2].code.split('\n').filter((line) => /^E\d \|/.test(line));
  assert.equal(cases.length, 6);
  for (const [status, count] of [['QUEUED', 2], ['DUPLICATE', 1], ['INVALID', 1], ['REVIEW', 2]]) {
    assert.equal(cases.filter((line) => line.split(' | ')[2].startsWith(status)).length, count);
  }
  assert.ok(steps[2].code.includes('External messages sent: 0'));
  assert.ok(steps[2].explanation.join(' ').includes('Only mark an ID successful after its queue write succeeds'));
  assert.ok(steps[3].code.includes('Setup planning subtotal: 324'));
  assert.ok(steps[3].code.includes('Monthly planning subtotal: 45'));
  assert.ok(steps[3].code.includes('NOT VALIDATED'));
  assert.ok(steps[5].code.includes('continue / revise / stop'));
});

test('business launch intent matches the new goal in all four languages', async () => {
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const idea of [
    'I want to start an automation agency',
    'Je veux lancer une agence automatisation',
    'Ich starte eine Automatisierungsagentur',
    'Quiero crear una agencia de automatización'
  ]) {
    assert.equal(matchGoals(idea)[0]?.goalId, 'start-ai-business', idea);
  }
});

test('proposal costs distinguish unknown from zero and keep costs separate from prices', async () => {
  const { emptyProposalInputs, proposalCalculations } = await loadContent('../lib/pilot-proposal.ts');
  const blank = emptyProposalInputs();
  assert.deepEqual(proposalCalculations(blank), { setup: null, monthly: null, setupFee: null, monthlyFee: null, errors: [] });
  const inputs = {
    ...blank, setupHours: '9', setupRate: '30', contingency: '20', setupExpenses: '0',
    monthlyHours: '1', monthlyRate: '30', monthlyExpenses: '15', setupFee: '500', monthlyFee: '75'
  };
  assert.deepEqual(proposalCalculations(inputs), { setup: 32400, monthly: 4500, setupFee: 50000, monthlyFee: 7500, errors: [] });
  assert.equal(proposalCalculations({ ...inputs, setupExpenses: '' }).setup, null);
  assert.equal(proposalCalculations({ ...inputs, setupRate: '0' }).setup, 0);
  assert.equal(proposalCalculations({ ...inputs, setupFee: '0' }).setupFee, 0);
  assert.equal(proposalCalculations({ ...inputs, setupHours: '1,25', setupRate: '10.10', contingency: '10', setupExpenses: '0.01' }).setup, 1263 + 126 + 1);
  assert.equal(proposalCalculations({ ...inputs, setupHours: '0.01', setupRate: '0.50', contingency: '50' }).setup, 2);
});

test('proposal numeric validation rejects malformed and excessive values without inventing totals', async () => {
  const { emptyProposalInputs, proposalCalculations, proposalCostFields, buildPilotProposal } = await loadContent('../lib/pilot-proposal.ts');
  for (const field of proposalCostFields) {
    for (const number of ['-1', 'NaN', 'Infinity', '1e3', '1,000', '1.234', '1 000', '.50', '1.', String(field.max + 0.01)]) {
      const inputs = { ...emptyProposalInputs(), [field.key]: number };
      assert.deepEqual(proposalCalculations(inputs).errors, [field.key], `${field.key}: ${number}`);
      assert.throws(() => buildPilotProposal(inputs, 'en', (text) => text), /Invalid proposal number/);
    }
    assert.deepEqual(proposalCalculations({ ...emptyProposalInputs(), [field.key]: String(field.max) }).errors, []);
  }
});

test('proposal generation preserves user text, marks unknowns and never exports internal costs', async () => {
  const { emptyProposalInputs, buildPilotProposal } = await loadContent('../lib/pilot-proposal.ts');
  const inputs = {
    ...emptyProposalInputs(), title: '<script>alert("fictional")</script>',
    scope: 'CUSTOM SCOPE\nSecond line', setupHours: '9', setupRate: '30',
    contingency: '20', setupExpenses: '0', monthlyHours: '1', monthlyRate: '30', monthlyExpenses: '15',
    setupFee: '500', monthlyFee: '75'
  };
  const document = buildPilotProposal(inputs, 'en', (text) => text);
  assert.ok(document.startsWith('DRAFT PILOT PROPOSAL - NOT AN AGREEMENT'));
  assert.ok(document.includes(inputs.title) && document.includes(inputs.scope));
  assert.ok(document.includes('[TO CONFIRM]'));
  assert.ok(document.includes('€500.00') && document.includes('€75.00'));
  assert.ok(!document.includes('324.00') && !document.includes('45.00'));
  const french = JSON.parse(await readFile(new URL('../content/translations/ui-fr.json', import.meta.url), 'utf8'));
  const translated = buildPilotProposal(inputs, 'fr', (text) => french[text] ?? text);
  assert.ok(translated.includes('[À CONFIRMER]'));
  assert.ok(translated.includes(inputs.scope));
  assert.ok(!translated.includes('DRAFT PILOT PROPOSAL'));
});

test('saved proposal validation round-trips editable text and rejects damaged or incompatible drafts', async () => {
  const { emptyProposalInputs, readProposalDraft, proposalSource, proposalTextLimit } = await loadContent('../lib/pilot-proposal.ts');
  const inputs = { ...emptyProposalInputs(), title: 'Fictional pilot', setupFee: '0' };
  const draft = { version: 1, inputs, document: 'Manual edits\nRemain unchanged', source: proposalSource(inputs, 'en') };
  assert.deepEqual(readProposalDraft(JSON.stringify(draft)), draft);
  const longInputs = { ...inputs, scope: '\n'.repeat(proposalTextLimit) };
  const longDraft = { ...draft, inputs: longInputs, source: proposalSource(longInputs, 'en') };
  assert.deepEqual(readProposalDraft(JSON.stringify(longDraft)), longDraft);
  for (const invalid of [
    'broken JSON', 'null', '[]', '{}', JSON.stringify({ ...draft, version: 2 }),
    JSON.stringify({ ...draft, document: 0 }), JSON.stringify({ ...draft, source: null }),
    JSON.stringify({ ...draft, inputs: { ...inputs, setupFee: '-1' } }),
    JSON.stringify({ ...draft, inputs: { title: 'missing fields' } }),
    JSON.stringify({ ...draft, inputs: { ...inputs, title: 'a'.repeat(proposalTextLimit + 1) } }),
    JSON.stringify({ ...draft, document: 'a'.repeat(40001) })
  ]) {
    assert.throws(() => readProposalDraft(invalid));
  }
});

test('proposal builder UI, notices and templates have all three translations', async () => {
  const sources = await Promise.all([
    '../lib/pilot-proposal.ts',
    '../components/pilot-proposal-builder.tsx',
    '../app/business-launchpad/proposal-builder/page.tsx'
  ].map((file) => readFile(new URL(file, import.meta.url), 'utf8')));
  const text = sources.join('\n');
  const phrases = [
    ...text.matchAll(/\btr\('([^']+)'\)/g),
    ...text.matchAll(/\blabel: '([^']+)'/g),
    ...text.matchAll(/\bset(?:Notice|Error)\('([^']+)'\)/g),
    ...text.matchAll(/<Tr>([^<{]+)<\/Tr>/g)
  ].map((match) => match[1]);
  // Both branches of these conditional labels are intentionally translated.
  phrases.push('Rebuild proposal from form', 'Generate editable proposal',
    'Changes are not saved on this device.', 'No automatic saving. Save explicitly if you want to return later.');
  assert.ok(phrases.length > 65);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of phrases) assert.ok(book[phrase], `${locale}: missing "${phrase}"`);
  }
});

test('pilot results metrics retain unknowns, measured zero and negative net time', async () => {
  const { emptyPilotResults, resultMetrics } = await loadContent('../lib/pilot-results.ts');
  const blank = emptyPilotResults().metrics;
  assert.deepEqual(resultMetrics(blank), {
    errors: [], values: { runs: null, baseline: null, processing: null, review: null, cost: null },
    net: null, netPerRun: null, costPerRun: null
  });
  const sample = { runs: '40', baseline: '240', processing: '80', review: '40', cost: '12' };
  assert.deepEqual(resultMetrics(sample), {
    errors: [], values: { runs: 4000, baseline: 24000, processing: 8000, review: 4000, cost: 1200 },
    net: 12000, netPerRun: 3, costPerRun: 30
  });
  assert.equal(resultMetrics({ ...sample, baseline: '100' }).net, -2000);
  assert.equal(resultMetrics({ ...sample, baseline: '100' }).netPerRun, -0.5);
  assert.equal(resultMetrics({ ...sample, review: '' }).net, null);
  assert.equal(resultMetrics({ ...sample, runs: '' }).net, 12000);
  assert.equal(resultMetrics({ ...sample, runs: '' }).netPerRun, null);
  assert.equal(resultMetrics({ ...sample, runs: '' }).costPerRun, null);
  assert.equal(resultMetrics({ ...sample, review: '0' }).net, 16000);
  assert.equal(resultMetrics({ ...sample, cost: '0' }).costPerRun, 0);
  assert.equal(resultMetrics({ ...sample, baseline: '240,25', review: '40.10' }).net, 12015);
});

test('pilot metrics reject zero/fractional runs, malformed numbers and displayed limit violations', async () => {
  const { emptyPilotResults, resultMetrics, resultMetricFields, buildPilotResultsReport } = await loadContent('../lib/pilot-results.ts');
  const blank = emptyPilotResults();
  for (const field of resultMetricFields) {
    const invalid = ['-1', 'Infinity', '1e3', '1,000', '1.000', '1 000', '.2', '1.', String(field.max + 1)];
    if (field.key === 'runs') invalid.push('0', '0.00', '1.5', '1,5', '1.00');
    for (const value of invalid) {
      const data = { ...blank, metrics: { ...blank.metrics, [field.key]: value } };
      assert.deepEqual(resultMetrics(data.metrics).errors, [field.key], `${field.key}: ${value}`);
      assert.throws(() => buildPilotResultsReport(data, 'en', (text) => text), /Invalid pilot metrics/);
    }
    assert.deepEqual(resultMetrics({ ...blank.metrics, [field.key]: String(field.max) }).errors, []);
  }
});

test('test summaries never turn unrun plans or unsupported passes into successful evidence', async () => {
  const { emptyPilotTest, starterPilotTests, resultTestSummary, effectiveTestStatus } = await loadContent('../lib/pilot-results.ts');
  const examples = starterPilotTests((text) => text);
  assert.equal(examples.length, 7);
  assert.equal(new Set(examples.map((test) => test.id)).size, 7);
  assert.ok(examples[6].name.includes('failure'));
  assert.ok(examples.every((test) => test.status === 'pending' && test.retestStatus === 'pending' && !test.actual));
  assert.deepEqual(resultTestSummary(examples), { pending: 7, pass: 0, fail: 0, blocked: 0, total: 7, open: 7 });
  const unsupported = { ...emptyPilotTest('test-1'), status: 'pass' };
  assert.equal(effectiveTestStatus(unsupported), 'pending');
  const failed = { ...examples[0], actual: 'Two rows, failure screenshot recorded', status: 'fail', correction: 'Fix deduplication' };
  assert.equal(effectiveTestStatus(failed), 'fail');
  assert.equal(effectiveTestStatus({ ...failed, retestStatus: 'pass' }), 'pending');
  const retested = { ...failed, retestStatus: 'pass', retest: '2026-11-05: one row, screenshot checked' };
  assert.equal(effectiveTestStatus(retested), 'pass');
  assert.equal(retested.status, 'fail');
  assert.equal(effectiveTestStatus({ ...retested, retestStatus: 'blocked' }), 'blocked');
  assert.equal(effectiveTestStatus({ ...retested, retestStatus: 'fail' }), 'fail');
  assert.deepEqual(resultTestSummary([retested, { ...examples[1], status: 'blocked' }, unsupported]), {
    pending: 1, pass: 1, fail: 0, blocked: 1, total: 3, open: 2
  });
});

test('results reports include original failures, retests, actual costs, unknowns and explicit decisions', async () => {
  const { emptyPilotResults, starterPilotTests, buildPilotResultsReport } = await loadContent('../lib/pilot-results.ts');
  const data = emptyPilotResults();
  data.notes = {
    title: 'FICTIONAL TEST PILOT', objective: 'Manual approval only', period: '40 matched tasks, one week, manually timed',
    uncertainty: 'Small fictional sample, no production evidence', rationale: 'More representative tests needed',
    nextSteps: 'Workshop owner role: review next week'
  };
  data.metrics = { runs: '40', baseline: '240', processing: '80', review: '40', cost: '12' };
  data.tests = [{
    ...starterPilotTests((text) => text)[0], actual: 'Wrong output', status: 'fail',
    correction: 'Fixed the mapping', retestStatus: 'pass', retest: '2026-11-05: verified expected output'
  }];
  for (const decision of ['continue', 'revise', 'stop', '']) {
    data.decision = decision;
    const report = buildPilotResultsReport(data, 'en', (text) => text);
    assert.ok(report.includes('Original outcome: Fail'));
    assert.ok(report.includes('Retest outcome: Pass'));
    assert.ok(report.includes('Fixed the mapping'));
    assert.ok(report.includes('Net time saved (minutes): 120'));
    assert.ok(report.includes('Running cost per run (EUR): €0.30'));
    assert.ok(report.includes(`Recorded decision: ${decision ? decision[0].toUpperCase() + decision.slice(1) : 'Not decided'}`));
    assert.equal(report.includes('Evidence is incomplete or tests remain open.'), decision === '');
  }
  data.decision = 'continue';
  data.tests[0].retest = '';
  assert.ok(buildPilotResultsReport(data, 'en', (text) => text).includes('Evidence is incomplete or tests remain open.'));
  const blankReport = buildPilotResultsReport(emptyPilotResults(), 'en', (text) => text);
  assert.ok(blankReport.includes('[TO CONFIRM]'));
  assert.ok(blankReport.includes('Recorded decision: Not decided'));
});

test('results draft schema rejects damaged, oversized and incompatible drafts without accepting invalid metrics', async () => {
  const { emptyPilotResults, readPilotResults, starterPilotTests } = await loadContent('../lib/pilot-results.ts');
  const data = emptyPilotResults();
  data.tests = starterPilotTests((text) => text);
  assert.deepEqual(readPilotResults(JSON.stringify(data)), data);
  const twenty = { ...data, tests: Array.from({ length: 20 }, (_, i) => ({ ...data.tests[0], id: `test-${i + 1}` })) };
  assert.deepEqual(readPilotResults(JSON.stringify(twenty)), twenty);
  for (const invalid of [
    'broken', '{}', 'null', '[]',
    JSON.stringify({ ...data, version: 2 }), JSON.stringify({ ...data, decision: 'approve' }),
    JSON.stringify({ ...data, notes: { ...data.notes, title: 'a'.repeat(2001) } }),
    JSON.stringify({ ...data, metrics: { ...data.metrics, runs: '0' } }),
    JSON.stringify({ ...data, tests: [] }),
    JSON.stringify({ ...twenty, tests: [...twenty.tests, { ...data.tests[0], id: 'test-21' }] }),
    JSON.stringify({ ...data, tests: [data.tests[0], data.tests[0]] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], id: 'bad-id' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], actual: null }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], status: 'success' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], retestStatus: 'success' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], correction: 'a'.repeat(2001) }] })
  ]) assert.throws(() => readPilotResults(invalid));
});

test('tracker UI, report, statuses and workshop plans have French, German and Spanish translations', async () => {
  const { starterPilotTests, resultStatuses, pilotDecisions, resultTestFields, resultNoteFields, resultDecisionFields, resultMetricFields } = await loadContent('../lib/pilot-results.ts');
  const files = ['../lib/pilot-results.ts', '../components/pilot-results-tracker.tsx', '../app/business-launchpad/results-tracker/page.tsx'];
  const source = (await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');
  const phrases = [
    ...source.matchAll(/\btr\('([^']+)'\)/g),
    ...source.matchAll(/\bset(?:Notice|Error)\('([^']+)'\)/g),
    ...source.matchAll(/<Tr>([^<{]+)<\/Tr>/g)
  ].map((match) => match[1].replaceAll('&amp;', '&'));
  phrases.push(...[...resultStatuses, ...pilotDecisions, ...resultTestFields, ...resultNoteFields, ...resultDecisionFields, ...resultMetricFields].map((field) => field.label));
  for (const example of starterPilotTests((text) => text)) phrases.push(example.name, example.input, example.expected);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of phrases) assert.ok(book[phrase], `${locale}: missing tracker phrase "${phrase}"`);
    const plans = starterPilotTests((text) => book[text] ?? text);
    assert.notEqual(plans[0].expected, starterPilotTests((text) => text)[0].expected);
    assert.ok(plans.every((plan) => !plan.actual && plan.status === 'pending'));
  }
});
