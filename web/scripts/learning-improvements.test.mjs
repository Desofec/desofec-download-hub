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
      outputText = outputText.replaceAll(`'${specifier}'`, JSON.stringify(await contentUrl(dependency, imports)));
    }
  }
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

async function loadContent(relativePath, imports = {}) {
  return import(await contentUrl(relativePath, imports));
}

const projectImports = {
  '@/lib/evidence-workbook': '../lib/evidence-workbook.ts',
  '@/lib/pilot-proposal': '../lib/pilot-proposal.ts',
  '@/lib/pilot-results': '../lib/pilot-results.ts'
};
function memoryStorage() {
  const data = new Map();
  return {
    get length() { return data.size; },
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    key: (index) => [...data.keys()][index] ?? null
  };
}
const projectId = '11111111-1111-4111-8111-111111111111';

const workbookTime = '2026-11-06T01:30:00.000Z';
test('workbook validation preserves bounded title/text revisions and rejects corrupted archives and references', async () => {
  const { appendWorkbookRevision, readEvidenceWorkbook, setWorkbookTestLink, workbookTextLimit } =
    await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const initial = { version: 1, items: [] };
  const first = appendWorkbookRevision(initial, null, ' First title ', 'Draft v1 <script>not executable</script>', workbookTime);
  const second = appendWorkbookRevision(first, 'item-1', 'Renamed v2', 'Corrected text', workbookTime);
  assert.deepEqual(initial, { version: 1, items: [] });
  assert.deepEqual(first.items[0].revisions, [{ number: 1, title: 'First title', body: 'Draft v1 <script>not executable</script>', savedAt: workbookTime }]);
  assert.deepEqual(second.items[0].revisions[0], first.items[0].revisions[0]);
  assert.equal(second.items[0].revisions[1].number, 2);
  const test = { ...emptyPilotTest('test-1'), name: 'Claim facts', input: 'Review saved text', expected: 'Unknown claims flagged' };
  const linked = setWorkbookTestLink(second, 'item-1', 1, test);
  assert.equal(second.items[0].links.length, 0);
  assert.deepEqual(linked.items[0].links, [{ testId: 'test-1', revision: 1, name: test.name, input: test.input, expected: test.expected }]);
  const relinked = setWorkbookTestLink(linked, 'item-1', 2, test);
  assert.equal(relinked.items[0].links.length, 1);
  assert.equal(relinked.items[0].links[0].revision, 2);
  assert.deepEqual(readEvidenceWorkbook(JSON.parse(JSON.stringify(relinked))), relinked);
  for (const mutate of [
    (copy) => { copy.version = 2; },
    (copy) => { copy.items = null; },
    (copy) => { copy.items.push(structuredClone(copy.items[0])); },
    (copy) => { copy.items[0].id = '../bad'; },
    (copy) => { copy.items[0].revisions = []; },
    (copy) => { copy.items[0].revisions[0].number = 2; },
    (copy) => { copy.items[0].revisions[0].title = ''; },
    (copy) => { copy.items[0].revisions[0].title = 'x'.repeat(121); },
    (copy) => { copy.items[0].revisions[0].body = ' '; },
    (copy) => { copy.items[0].revisions[0].body = 'x'.repeat(8001); },
    (copy) => { copy.items[0].revisions[0].body = 5; },
    (copy) => { copy.items[0].revisions[0].savedAt = '2026-02-30T00:00:00.000Z'; },
    (copy) => { copy.items[0].revisions[0].savedAt = 'not-a-date'; },
    (copy) => { copy.items[0].links[0].revision = 3; },
    (copy) => { copy.items[0].links[0].revision = 1.5; },
    (copy) => { copy.items[0].links[0].testId = 'test-21'; },
    (copy) => { copy.items[0].links[0].name = ' '; },
    (copy) => { copy.items[0].links[0].input = 'x'.repeat(2001); },
    (copy) => { copy.items[0].links[0].expected = null; },
    (copy) => { copy.items[0].links.push({ ...copy.items[0].links[0] }); }
  ]) {
    const copy = structuredClone(relinked);
    mutate(copy);
    assert.throws(() => readEvidenceWorkbook(copy), /Invalid saved evidence workbook/);
  }
  assert.equal(appendWorkbookRevision(initial, null, 'At limit', 'x'.repeat(workbookTextLimit), workbookTime).items[0].revisions[0].body.length, 8000);
  assert.throws(() => appendWorkbookRevision(initial, null, 'Too long', 'x'.repeat(8001), workbookTime), /limit/);
  assert.throws(() => appendWorkbookRevision(initial, null, ' ', 'Text', workbookTime), /title and practice text/);
  assert.throws(() => appendWorkbookRevision(second, 'item-1', 'Renamed v2', 'Corrected text', workbookTime), /unchanged/);
  assert.throws(() => appendWorkbookRevision(second, 'item-8', 'Missing', 'Text', workbookTime), /no longer exists/);
  assert.throws(() => setWorkbookTestLink(second, 'item-1', 1, { ...test, expected: '' }), /Save a test name/);
  assert.throws(() => setWorkbookTestLink(second, 'item-1', 0, test), /Invalid/);
});

test('workbook limits are exact, never prune history and remain subject to the whole-project byte cap', async () => {
  const { appendWorkbookRevision, readEvidenceWorkbook, setWorkbookTestLink } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const { newPilotProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  let workbook = { version: 1, items: [] };
  for (let index = 1; index <= 8; index++) {
    workbook = appendWorkbookRevision(workbook, null, `Item ${index}`, 'x'.repeat(8000), workbookTime);
    for (let number = 2; number <= 5; number++) {
      workbook = appendWorkbookRevision(workbook, `item-${index}`, `Item ${index} r${number}`, 'y'.repeat(8000), workbookTime);
    }
  }
  assert.equal(workbook.items.length, 8);
  assert.ok(workbook.items.every((item) => item.revisions.length === 5));
  assert.throws(() => appendWorkbookRevision(workbook, null, 'Ninth', 'Text', workbookTime), /item limit/);
  assert.throws(() => appendWorkbookRevision(workbook, 'item-1', 'Sixth', 'Text', workbookTime), /Revision limit/);
  const original = JSON.stringify(workbook);
  const project = newPilotProject(projectId, 'ai-cad-services', 'Full text archive');
  project.workbook = workbook;
  assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  assert.equal(JSON.stringify(workbook), original);
  for (let index = 1; index <= 8; index++) {
    for (let testNumber = 1; testNumber <= 20; testNumber++) {
      workbook = setWorkbookTestLink(workbook, `item-${index}`, 1, {
        ...emptyPilotTest(`test-${testNumber}`), name: 'N'.repeat(2000), input: 'I'.repeat(2000), expected: 'E'.repeat(2000)
      });
    }
  }
  assert.deepEqual(readEvidenceWorkbook(workbook), workbook);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook })), /storage limit/);
});

test('workbook links pin saved definitions and revisions without changing results or completing milestones', async () => {
  const { appendWorkbookRevision, setWorkbookTestLink, workbookLinkState } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const test = { ...emptyPilotTest('test-1'), name: 'Required scenario', input: 'Fictional input', expected: 'Expected behavior' };
  const before = JSON.stringify(test);
  let workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Draft', 'Actual practice text', workbookTime);
  workbook = setWorkbookTestLink(workbook, 'item-1', 1, test);
  const item = workbook.items[0];
  const link = item.links[0];
  assert.match(workbookLinkState(item, link, [test]), /current saved revision and test definition/);
  assert.match(workbookLinkState(item, link, []), /removed/);
  for (const field of ['name', 'input', 'expected']) {
    assert.match(workbookLinkState(item, link, [{ ...test, [field]: 'Definition changed' }]), /definition changed/);
  }
  assert.match(workbookLinkState(item, link, [{ ...test, actual: 'New outcome', status: 'fail' }]), /current saved revision/);
  workbook = appendWorkbookRevision(workbook, 'item-1', 'Draft', 'Actual revised text', workbookTime);
  assert.match(workbookLinkState(workbook.items[0], link, [test]), /older saved revision/);
  assert.equal(JSON.stringify(test), before);
});

test('optional workbook round-trips legacy/account projects, merges only its own part and blocks stale/deleted saves', async () => {
  const { newPilotProject, readPilotProject, saveProject, loadProject, saveProjectPart, deleteProject, projectResultsSeed, projectProposalSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const project = newPilotProject(projectId, 'ai-content-services', 'Legacy practice');
  assert.equal('workbook' in readPilotProject(JSON.stringify(project)), false);
  assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook: null })), /workbook/);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook: { version: 2, items: [] } })), /workbook/);
  const storage = memoryStorage();
  storage.setItem('desofec:pilot-proposal:v1', 'STANDALONE_PROPOSAL_CANARY');
  storage.setItem('desofec:pilot-results:v1', 'STANDALONE_RESULTS_CANARY');
  saveProject(storage, project, 0, { userId: projectId, version: 2 });
  const workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Saved title', 'Saved body', workbookTime);
  saveProjectPart(storage, projectId, 'results', projectResultsSeed(project), 'null');
  saveProjectPart(storage, projectId, 'proposal', projectProposalSeed(project), 'null');
  const saved = saveProjectPart(storage, projectId, 'workbook', workbook, 'null');
  assert.deepEqual(saved.project.results, projectResultsSeed(project));
  assert.deepEqual(saved.project.proposal, projectProposalSeed(project));
  assert.deepEqual(saved.project.completed, []);
  assert.deepEqual(saved.cloud, { userId: projectId, version: 2 });
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project, 'account snapshots preserve workbook');
  saveProjectPart(storage, projectId, 'results', { ...projectResultsSeed(project), decision: 'stop' }, JSON.stringify(saved.project.results));
  assert.deepEqual(loadProject(storage, projectId).project.workbook, workbook, 'results save preserves workbook');
  assert.throws(() => saveProjectPart(storage, projectId, 'workbook', workbook, 'null'), /draft changed/);
  const copy = loadProject(storage, projectId);
  deleteProject(storage, projectId, copy.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'workbook', workbook, JSON.stringify(workbook)), /not found/);
  assert.equal(storage.getItem('desofec:pilot-proposal:v1'), 'STANDALONE_PROPOSAL_CANARY');
  assert.equal(storage.getItem('desofec:pilot-results:v1'), 'STANDALONE_RESULTS_CANARY');
});

test('workbook export includes only saved revisions while summaries and portfolios never include draft bodies or financial fields', async () => {
  const { appendWorkbookRevision, buildWorkbookExport, setWorkbookTestLink } = await loadContent('../lib/evidence-workbook.ts');
  const { buildProjectSummary, saveProject, loadProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildServicePortfolio } = await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const project = await contentProjectFixture();
  const first = appendWorkbookRevision({ version: 1, items: [] }, null, 'Draft one', 'PRIVATE_WORKBOOK_V1_CANARY', workbookTime);
  project.workbook = appendWorkbookRevision(first, 'item-1', 'Draft two', 'PRIVATE_WORKBOOK_V2_CANARY', workbookTime);
  project.workbook = setWorkbookTestLink(project.workbook, 'item-1', 1, project.results.tests[0]);
  const storage = memoryStorage();
  saveProject(storage, project, 0);
  const saved = loadProject(storage, projectId);
  project.workbook.items[0].revisions[1].body = 'UNSAVED_WORKBOOK_CANARY';
  const report = buildWorkbookExport(saved.project.workbook, saved.project.title, saved.project.results.tests, (text) => text);
  assert.match(report, /PRIVATE_WORKBOOK_V1_CANARY/);
  assert.match(report, /PRIVATE_WORKBOOK_V2_CANARY/);
  assert.match(report, /older saved revision/);
  assert.doesNotMatch(report, /UNSAVED_WORKBOOK_CANARY|98765|87654|PRIVATE_PROPOSAL_CANARY|RAW_TEST_/);
  assert.doesNotMatch(buildProjectSummary(saved.project, (text) => text), /PRIVATE_WORKBOOK/);
  assert.doesNotMatch(buildServicePortfolio(saved.project, (text) => text), /PRIVATE_WORKBOOK/);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const tr = (text) => { assert.ok(book[text], `${locale}: missing workbook phrase "${text}"`); return book[text]; };
    assert.ok(buildWorkbookExport(saved.project.workbook, saved.project.title, saved.project.results.tests, tr).startsWith(book['PRIVATE EVIDENCE WORKBOOK - SELF-RECORDED PRACTICE, NOT VERIFIED CLIENT WORK']));
  }
});

test('workbook interface, starters, errors and privacy consent have three translations', async () => {
  const strings = new Set();
  for (const file of ['../lib/evidence-workbook.ts', '../components/project-evidence-workbook.tsx',
    '../app/business-launchpad/evidence-workbook/page.tsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isStringLiteral(node) && /^[A-Z]/.test(node.text)) strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing workbook phrase "${text}"`);
  }
});

const journeyImports = {
  ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts',
  '@/lib/first-content-project': '../lib/first-content-project.ts'
};
async function contentProjectFixture() {
  const { newPilotProject, projectProposalSeed, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const project = newPilotProject(projectId, 'ai-content-services', 'Cedar Bakery fictional practice');
  project.brief = {
    objective: 'Separate known bakery hours from unknown delivery and allergens.',
    scope: 'Three posts, four FAQ answers; no publication or invented prices.',
    review: 'Owner approval unavailable in fictional practice; keep blocked.'
  };
  project.completed = ['brief', 'scope', 'evidence', 'review', 'handover'];
  project.proposal = projectProposalSeed(project);
  for (const key of ['exclusions', 'acceptance', 'reviewer', 'handover']) project.proposal.inputs[key] = `Practice ${key}`;
  project.proposal.inputs.setupRate = '98765.43';
  project.proposal.document = 'PRIVATE_PROPOSAL_CANARY';
  project.proposal.source = proposalSource(project.proposal.inputs, 'en');
  project.results = projectResultsSeed(project);
  project.results.metrics.cost = '87654.32';
  project.results.tests = ['Brief facts', 'Post word counts', 'Asset permissions', 'Owner approval'].map((name, index) => ({
    ...emptyPilotTest(`test-${index + 1}`), name,
    input: 'RAW_TEST_INPUT_CANARY', expected: 'RAW_TEST_EXPECTED_CANARY',
    actual: 'RAW_TEST_ACTUAL_CANARY', correction: 'RAW_CORRECTION_CANARY',
    status: index === 3 ? 'blocked' : 'pass'
  }));
  project.results.decision = 'revise';
  Object.assign(project.results.notes, {
    rationale: 'Revise the copy; live approval is unavailable.',
    uncertainty: 'Permissions and owner approval remain unverified.',
    nextSteps: 'Keep publication paused and preserve versioned files.'
  });
  return project;
}

test('guided content milestones are sequential, saved-data derived and accept documented blocked outcomes without approval', async () => {
  const { contentJourney, projectJourneyHref, buildContentPortfolio } =
    await loadContent('../lib/first-content-project.ts', journeyImports);
  const project = await contentProjectFixture();
  const before = JSON.stringify(project);
  assert.equal(contentJourney(project).ready, true);
  assert.equal(contentJourney(project).summary.blocked, 1);
  for (const decision of ['continue', 'revise', 'stop']) {
    const copy = structuredClone(project);
    copy.results.decision = decision;
    const report = buildContentPortfolio(copy, (text) => text);
    assert.match(report, new RegExp(`Recorded decision: ${decision[0].toUpperCase() + decision.slice(1)}`));
    assert.match(report, /FICTIONAL CONTENT SERVICE, NOT CLIENT WORK/);
    assert.match(report, /Practice record assembled - self-recorded, not independently verified/);
    assert.match(report, /Blocked: 1/);
    assert.match(report, /No client approval, publication permission/);
    assert.doesNotMatch(report, /98765|87654|PRIVATE_PROPOSAL_CANARY|RAW_TEST_|RAW_CORRECTION_CANARY/);
  }
  assert.equal(JSON.stringify(project), before);
  assert.equal(projectJourneyHref(project, 'proposal'), `/business-launchpad/proposal-builder?project=${project.id}`);
  assert.equal(projectJourneyHref(project, 'results'), `/business-launchpad/results-tracker?project=${project.id}`);
  assert.equal(projectJourneyHref(project, 'tutorial'), '/tutorials/ai-content-services');
  assert.equal(projectJourneyHref(project, 'kit'), '/starter-packs/ai-content-services-kit');
  assert.equal(projectJourneyHref(project, 'brief'), '#project-brief-form');
  for (const [milestone, next] of [['brief', 'learn'], ['scope', 'practise'], ['evidence', 'test'], ['review', 'review'], ['handover', 'handover']]) {
    const copy = structuredClone(project);
    copy.completed = copy.completed.filter((item) => item !== milestone);
    const result = contentJourney(copy);
    assert.equal(result.next.id, next);
    assert.equal(result.ready, false);
    assert.ok(result.stages.slice(result.stages.findIndex((stage) => stage.id === next)).every((stage) => !stage.complete));
    assert.match(buildContentPortfolio(copy, (text) => text), /Incomplete practice draft/);
  }
  for (const field of ['objective', 'scope', 'review']) {
    const copy = structuredClone(project);
    copy.brief[field] = ' ';
    assert.equal(contentJourney(copy).next.id, field === 'objective' ? 'learn' : 'practise');
  }
  assert.throws(() => buildContentPortfolio({ ...project, pathId: 'ai-cad-services' }, (text) => text), /only/);
});

test('guided proposal and test milestones reject missing, stale, unsupported and duplicate evidence', async () => {
  const { contentJourney } = await loadContent('../lib/first-content-project.ts', journeyImports);
  const project = await contentProjectFixture();
  for (const mutate of [
    (copy) => { copy.proposal = null; },
    (copy) => { copy.proposal.document = ''; },
    (copy) => { copy.proposal.source = '{'; },
    (copy) => { copy.proposal.inputs.scope = 'Stale form'; },
    (copy) => { copy.proposal.inputs.acceptance = ''; }
  ]) {
    const copy = structuredClone(project);
    mutate(copy);
    assert.equal(contentJourney(copy).next.id, 'draft');
  }
  for (const mutate of [
    (copy) => { copy.results = null; },
    (copy) => { copy.results.tests.pop(); },
    (copy) => { copy.results.tests[3].name = '  BRIEF FACTS  '; },
    (copy) => { copy.results.tests[3].actual = ' '; },
    (copy) => { copy.results.tests[0].actual = ''; },
    (copy) => { copy.results.tests[0].retestStatus = 'pass'; copy.results.tests[0].retest = ''; },
    (copy) => { copy.results.tests[0].status = 'pending'; }
  ]) {
    const copy = structuredClone(project);
    mutate(copy);
    assert.equal(contentJourney(copy).next.id, 'test');
  }
  const retested = structuredClone(project);
  retested.results.tests[0].status = 'fail';
  retested.results.tests[0].retestStatus = 'pass';
  retested.results.tests[0].retest = 'Rechecked the source facts; corrected hours now match.';
  assert.equal(contentJourney(retested).ready, true);
  const failed = structuredClone(project);
  failed.results.tests[0].status = 'fail';
  assert.equal(contentJourney(failed).ready, true, 'recorded failure is evidence, not an approved outcome');
  for (const key of ['rationale', 'uncertainty', 'nextSteps']) {
    const copy = structuredClone(project);
    copy.results.notes[key] = ' ';
    assert.equal(contentJourney(copy).next.id, 'review');
  }
  const undecided = structuredClone(project);
  undecided.results.decision = '';
  assert.equal(contentJourney(undecided).next.id, 'review');
});

test('guided portfolio uses unchanged project serialization and has translated interface and exports', async () => {
  const { contentJourney, buildContentPortfolio } = await loadContent('../lib/first-content-project.ts', journeyImports);
  const { saveProject, loadProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const project = await contentProjectFixture();
  const storage = memoryStorage();
  saveProject(storage, project, 0, { userId: projectId, version: 1 });
  project.brief.objective = 'UNSAVED_CANARY';
  const saved = loadProject(storage, projectId);
  assert.doesNotMatch(buildContentPortfolio(saved.project, (text) => text), /UNSAVED_CANARY/);
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project);
  assert.equal(contentJourney(saved.project).ready, true);
  const strings = new Set(['Find a guided first project']);
  const files = ['../lib/first-content-project.ts', '../components/first-project-chooser.tsx',
    '../components/service-project-journey.tsx', '../app/business-launchpad/first-project/page.tsx'];
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isStringLiteral(node) && /^(?:[A-Z]|[1-6]\.)/.test(node.text) && node.text !== 'AI Content Services') strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing guided phrase "${text}"`);
    const report = buildContentPortfolio(saved.project, (text) => book[text] ?? text);
    assert.ok(report.startsWith(book['PRACTICE PORTFOLIO - FICTIONAL CONTENT SERVICE, NOT CLIENT WORK']));
    assert.doesNotMatch(report, /Recorded decision:|Practice record assembled - self-recorded/);
  }
});

test('four service journeys define distinct required plans without invented evidence or changed schemas', async () => {
  const { serviceJourneys, serviceJourneyTests, serviceProjectJourney, serviceJourneyCoverage } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const counts = { 'ai-automation-services': 9, 'ai-cad-services': 5, 'micro-saas-validation': 8, 'ai-education-services': 5 };
  const allCodes = new Set();
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    const original = JSON.stringify(project);
    const plans = serviceJourneyTests(pathId, (text) => text);
    assert.equal(plans.length, counts[pathId]);
    assert.deepEqual(plans.map((test) => test.id), plans.map((_, index) => `test-${index + 1}`));
    for (const [index, plan] of plans.entries()) {
      const { code, label } = definition.checks[index];
      assert.equal(allCodes.has(code), false);
      allCodes.add(code);
      assert.equal(plan.name, `[${code}] ${label}`);
      assert.ok(plan.input.trim() && plan.expected.trim());
      assert.equal(plan.status, 'pending');
      assert.equal(plan.retestStatus, 'pending');
      for (const field of ['actual', 'correction', 'retest']) assert.equal(plan[field], '');
    }
    assert.equal(JSON.stringify(project), original);
    project.results.tests = plans;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    assert.equal(serviceProjectJourney(project).next.id, 'test');
    assert.ok(serviceJourneyCoverage(project).every((check) => !check.recorded));
    assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  }
  assert.throws(() => serviceJourneyTests('ai-content-services', (text) => text), /content-service checks/);
});

test('required service evidence cannot be replaced by arbitrary counts, duplicates or unsupported passes and retests', async () => {
  const { serviceJourneys, serviceJourneyTests, serviceProjectJourney, serviceJourneyCoverage } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    project.results.tests = serviceJourneyTests(pathId, (text) => text).map((test, index) => ({
      ...test, actual: index === definition.checks.length - 1 ? 'Required external review unavailable; documented blocked.' : 'Observed fictional result in my practice files.',
      status: index === definition.checks.length - 1 ? 'blocked' : 'pass'
    }));
    assert.equal(serviceProjectJourney(project).ready, true);
    const renamed = structuredClone(project);
    renamed.results.tests.forEach((test) => { test.name = test.name.split(']')[0] + '] Titre traduit'; });
    assert.equal(serviceProjectJourney(renamed).ready, true, 'stable codes survive translated names');
    for (const mutate of [
      (copy) => { copy.results.tests.pop(); },
      (copy) => { copy.results.tests[0].name = '[UNRELATED-1] arbitrary test'; },
      (copy) => { copy.results.tests[0].actual = ' '; },
      (copy) => { copy.results.tests[0].input = ''; },
      (copy) => { copy.results.tests[0].expected = ''; },
      (copy) => { copy.results.tests[0].status = 'pending'; },
      (copy) => { copy.results.tests[0].retestStatus = 'pass'; copy.results.tests[0].retest = ''; },
      (copy) => { copy.results.tests.push({ ...copy.results.tests[0], id: 'test-20' }); },
      (copy) => { copy.results.tests[1].name = copy.results.tests[0].name; },
      (copy) => { copy.results.tests[0].name = '[AUTO-10] wrong code'; }
    ]) {
      const copy = structuredClone(project);
      mutate(copy);
      assert.equal(serviceProjectJourney(copy).next.id, 'test', pathId);
      assert.ok(serviceJourneyCoverage(copy).some((check) => !check.recorded));
    }
    for (const status of ['fail', 'blocked']) {
      const copy = structuredClone(project);
      copy.results.tests[0].status = status;
      assert.equal(serviceProjectJourney(copy).ready, true, 'documented learning is not a success claim');
    }
    const retested = structuredClone(project);
    Object.assign(retested.results.tests[0], { status: 'fail', retestStatus: 'pass', retest: 'Dated recheck after correction in fictional exercise.' });
    assert.equal(serviceProjectJourney(retested).ready, true);
    for (const [flag, expected] of [['brief', 'learn'], ['scope', 'practise'], ['evidence', 'test'], ['review', 'review'], ['handover', 'handover']]) {
      const copy = structuredClone(project);
      copy.completed = copy.completed.filter((item) => item !== flag);
      const journey = serviceProjectJourney(copy);
      assert.equal(journey.next.id, expected);
      assert.equal(journey.stages.at(-1).complete, false);
    }
    for (const field of definition.proposalFields) {
      const copy = structuredClone(project);
      copy.proposal.inputs[field] = '';
      copy.proposal.source = proposalSource(copy.proposal.inputs, 'en');
      assert.equal(serviceProjectJourney(copy).next.id, 'draft', pathId + ': ' + field);
    }
    const stale = structuredClone(project);
    stale.proposal.inputs.scope = 'New unsynchronised proposal input';
    assert.equal(serviceProjectJourney(stale).next.id, 'draft');
    for (const field of ['rationale', 'uncertainty', 'nextSteps']) {
      const copy = structuredClone(project);
      copy.results.notes[field] = '';
      assert.equal(serviceProjectJourney(copy).next.id, 'review');
    }
    const undecided = structuredClone(project);
    undecided.results.decision = '';
    assert.equal(serviceProjectJourney(undecided).next.id, 'review');
  }
});

test('service portfolios preserve decisions, missing coverage, privacy and optional account serialization in four languages', async () => {
  const { serviceJourneys, serviceJourneyTests, buildServicePortfolio, serviceProjectJourney } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { saveProject, loadProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    project.results.tests = serviceJourneyTests(pathId, (text) => text).map((test) => ({
      ...test, actual: 'RAW_PRIVATE_EVIDENCE_CANARY', status: 'blocked'
    }));
    const before = JSON.stringify(project);
    for (const decision of ['continue', 'revise', 'stop']) {
      const copy = structuredClone(project);
      copy.results.decision = decision;
      const report = buildServicePortfolio(copy, (text) => text);
      assert.ok(report.startsWith(definition.heading));
      assert.ok(report.includes(definition.boundary));
      assert.match(report, new RegExp(`Recorded decision: ${decision[0].toUpperCase() + decision.slice(1)}`));
      assert.match(report, /Practice record assembled - self-recorded/);
      assert.match(report, /not a passing grade or independent verification/);
      assert.doesNotMatch(report, /98765|87654|RAW_PRIVATE_EVIDENCE_CANARY|PRIVATE_PROPOSAL_CANARY/);
    }
    assert.equal(JSON.stringify(project), before);
    const storage = memoryStorage();
    saveProject(storage, project, 0, { userId: projectId, version: 3 });
    project.brief.objective = 'UNSAVED_CANARY';
    const saved = loadProject(storage, projectId);
    assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project);
    assert.equal(serviceProjectJourney(saved.project).ready, true);
    assert.doesNotMatch(buildServicePortfolio(saved.project, (text) => text), /UNSAVED_CANARY/);
    const partial = structuredClone(saved.project);
    partial.results.tests[0].actual = '';
    const report = buildServicePortfolio(partial, (text) => text);
    assert.match(report, /Incomplete practice draft/);
    assert.ok(report.includes(`[ ] [${definition.checks[0].code}]`));
    for (const locale of ['fr', 'de', 'es']) {
      const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
      const tr = (text) => { assert.ok(book[text], `${locale}: missing service phrase "${text}"`); return book[text]; };
      for (const field of ['title', 'heading', 'exercise', 'boundary', 'practiceTitle', 'learn', 'practise', 'draft', 'handover']) tr(definition[field]);
      const plans = serviceJourneyTests(pathId, tr);
      assert.deepEqual(plans.map((test) => test.name.match(/^\[[^\]]+\]/)[0]), definition.checks.map((check) => `[${check.code}]`));
      assert.ok(plans.every((test) => test.actual === '' && test.status === 'pending'));
      assert.ok(buildServicePortfolio(saved.project, tr).startsWith(book[definition.heading]));
    }
  }
  const content = await contentProjectFixture();
  const { buildContentPortfolio, contentJourney } = await loadContent('../lib/first-content-project.ts', journeyImports);
  assert.equal(buildServicePortfolio(content, (text) => text), buildContentPortfolio(content, (text) => text));
  assert.deepEqual(serviceProjectJourney(content), contentJourney(content), 'existing content behavior is unchanged');
});

test('project schema supports five tracks, validates all nested drafts and rejects malformed data', async () => {
  const { newPilotProject, readPilotProject, servicePathIds } = await loadContent('../lib/pilot-projects.ts', projectImports);
  for (const id of servicePathIds) {
    const project = newPilotProject(projectId, id, ' Fictional pilot ');
    assert.equal(project.title, 'Fictional pilot');
    assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
    for (const bad of [
      { version: 2 }, { id: '../bad' }, { pathId: 'made-up' }, { title: '' }, { title: 'a'.repeat(121) },
      { brief: { ...project.brief, scope: 42 } }, { completed: ['review', 'review'] },
      { completed: ['approved'] }, { proposal: {} }, { results: {} }, { proposal: undefined }
    ]) assert.throws(() => readPilotProject(JSON.stringify({ ...project, ...bad })));
    assert.throws(() => readPilotProject(JSON.stringify({ ...project, brief: { ...project.brief, scope: 'a'.repeat(2001) } })));
    assert.throws(() => readPilotProject(JSON.stringify({ ...project, extra: '😀'.repeat(300000) })), /storage limit/);
  }
});

test('project persistence preserves standalone drafts, enforces quota and rejects stale revisions', async () => {
  const { newPilotProject, loadProject, listProjects, saveProject, deleteProject, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const storage = memoryStorage();
  storage.setItem('desofec:pilot-proposal:v1', 'legacy proposal');
  storage.setItem('desofec:pilot-results:v1', 'legacy results');
  const project = newPilotProject(projectId, 'ai-content-services', 'Bakery practice');
  const first = saveProject(storage, project, 0);
  assert.equal(first.revision, 1);
  const second = saveProject(storage, { ...project, title: 'Reviewed brief' }, 1);
  assert.equal(second.revision, 2);
  assert.throws(() => saveProject(storage, project, 1), /another tab/);
  assert.throws(() => deleteProject(storage, projectId, 1), /another tab/);
  assert.equal(loadProject(storage, projectId).project.title, 'Reviewed brief');
  for (let index = 2; index <= 10; index++) {
    const id = `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`;
    saveProject(storage, newPilotProject(id, 'ai-education-services', `Workshop ${index}`), 0);
  }
  assert.equal(listProjects(storage).length, 10);
  assert.throws(() => saveProject(storage, newPilotProject('11111111-1111-4111-8111-000000000011', 'ai-cad-services', 'Too many'), 0), /limit reached/);
  deleteProject(storage, projectId, 2);
  assert.equal(listProjects(storage).length, 9);
  assert.equal(storage.getItem('desofec:pilot-proposal:v1'), 'legacy proposal');
  assert.equal(storage.getItem('desofec:pilot-results:v1'), 'legacy results');
  assert.throws(() => loadProject(storage, projectId), /not found/);
  storage.setItem(projectStoragePrefix + projectId, '{');
  assert.throws(() => listProjects(storage));
  assert.throws(() => loadProject(storage, 'invalid'), /Invalid project link/);
});

test('project tool saves merge only their own field and block stale replacement or resurrection', async () => {
  const { newPilotProject, loadProject, saveProject, saveProjectPart, deleteProject, projectProposalSeed, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const storage = memoryStorage();
  const project = newPilotProject(projectId, 'micro-saas-validation', 'Formatter');
  saveProject(storage, project, 0);
  const proposal = projectProposalSeed(project);
  saveProjectPart(storage, projectId, 'proposal', proposal, 'null');
  const withResults = saveProjectPart(storage, projectId, 'results', projectResultsSeed(project), 'null');
  assert.deepEqual(withResults.project.proposal, proposal);
  assert.throws(() => saveProjectPart(storage, projectId, 'proposal', proposal, 'null'), /draft changed/);
  const newer = saveProject(storage, { ...withResults.project, brief: { ...project.brief, scope: 'New scope' } }, withResults.revision);
  const updated = saveProjectPart(storage, projectId, 'proposal', { ...proposal, document: 'Manual edits' }, JSON.stringify(proposal));
  assert.equal(updated.project.brief.scope, 'New scope');
  assert.equal(updated.revision, newer.revision + 1);
  deleteProject(storage, projectId, updated.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'proposal', proposal, JSON.stringify(proposal)), /not found/);
  assert.throws(() => saveProject(storage, loadProject(storage, projectId).project, 1));
});

test('project seeds copy only context; summaries omit internal costs and respect decisions and missing evidence', async () => {
  const { newPilotProject, projectProposalSeed, projectResultsSeed, projectNextAction, projectProposalReady, buildProjectSummary } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  const project = newPilotProject(projectId, 'ai-cad-services', 'Concept practice');
  assert.match(projectNextAction(project), /brief/);
  project.brief = { objective: 'Fictional concept', scope: 'Not for manufacture', review: 'Review pending' };
  project.proposal = projectProposalSeed(project);
  assert.equal(project.proposal.inputs.setupFee, '');
  assert.equal(project.proposal.document, '');
  project.results = projectResultsSeed(project);
  assert.equal(project.results.tests[0].status, 'pending');
  assert.equal(project.results.decision, '');
  assert.match(projectNextAction(project), /proposal/);
  project.proposal.inputs.setupRate = '12345.67';
  project.proposal.document = 'INTERNAL_COST_CANARY';
  project.proposal.source = proposalSource(project.proposal.inputs, 'en');
  assert.equal(projectProposalReady(project), true);
  assert.match(projectNextAction(project), /results tracker/);
  project.results.decision = 'continue';
  Object.assign(project.results.notes, { rationale: 'Recorded reason', nextSteps: 'Review again', uncertainty: 'Not approved' });
  assert.match(projectNextAction(project), /unresolved tests/);
  project.results.decision = 'stop';
  assert.match(projectNextAction(project), /Stop recorded/);
  project.results.decision = 'revise';
  assert.match(projectNextAction(project), /Revision recorded/);
  const report = buildProjectSummary(project, (text) => text);
  assert.doesNotMatch(report, /12345.67|INTERNAL_COST_CANARY/);
  assert.match(report, /NOT CLIENT APPROVAL/);
  assert.match(report, /Recorded reason/);
  project.proposal.inputs.scope = 'Changed form';
  assert.equal(projectProposalReady(project), false);
  project.proposal.source = '{';
  assert.equal(projectProposalReady(project), false);
});

test('project saving reports unavailable storage and validates account metadata', async () => {
  const { newPilotProject, saveProject, loadProject, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const project = newPilotProject(projectId, 'ai-automation-services', 'Queue practice');
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error('Storage full'); };
  assert.throws(() => saveProject(storage, project, 0), /Storage full/);
  const good = memoryStorage();
  const saved = saveProject(good, project, 0, { userId: projectId, version: 2 });
  assert.deepEqual(loadProject(good, projectId).cloud, { userId: projectId, version: 2 });
  good.setItem(projectStoragePrefix + projectId, JSON.stringify({ ...saved, cloud: { userId: projectId, version: -1 } }));
  assert.throws(() => loadProject(good, projectId));
});

test('workspace interface, project checklist, next actions and errors have three translations', async () => {
  const files = [
    '../components/pilot-project-workspace.tsx', '../components/pilot-project-tool.tsx',
    '../components/pilot-project-account.tsx', '../lib/pilot-projects.ts',
    '../app/business-launchpad/projects/page.tsx'
  ];
  const strings = new Set([
    'Open the Pilot Project Workspace', 'Working...', 'Saved draft; review before sharing.',
    'Missing or needs regeneration.', 'Load the project draft before editing.',
    'Project draft saved on this device only. Account copies are unchanged.',
    'Saved project draft removed from this device. Current work, account copies and downloads remain.',
    'Brief copied into the form. Review it and save explicitly; no outcomes or approvals were filled in.',
    'Project draft loaded.'
  ]);
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const match of source.matchAll(/(?:tr\(|new Error\(|label: |return |setNotice\()'([^']+)'|<Tr>([^<{]+)<\/Tr>/g)) {
      strings.add(match[1] ?? match[2]);
    }
  }
  assert.ok(strings.size >= 100);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing project phrase "${text}"`);
  }
});

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
