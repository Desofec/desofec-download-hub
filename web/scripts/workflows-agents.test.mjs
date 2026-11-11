import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { loadWebModules } from './load-web-modules.mjs';

const [registry, translations, localized, downloads, demos, search, phrases] = loadWebModules([
  'lib/tutorials.ts',
  'lib/tutorial-translations.ts',
  'lib/localized-tutorials.ts',
  'lib/starter-pack-downloads.ts',
  'lib/ai-workflows-tutorial.ts',
  'lib/tutorial-search-metadata.ts',
  'lib/phrases.ts'
]);

const stepIds = [
  'workflow-or-agent', 'design-the-workflow', 'build-in-no-code',
  'agent-loop', 'test-and-guardrails', 'measure-and-improve'
];

const languageChecks = {
  en: { fiction: /fictional/i, room: /room unconfirmed/i, noSend: /do not send/i },
  fr: { fiction: /ficti(?:f|ve)/i, room: /salle non confirmée/i, noSend: /n’envoyez/i },
  de: { fiction: /fiktiv/i, room: /Raum unbestätigt/i, noSend: /versende.*nicht/i },
  es: { fiction: /fictici[oa]/i, room: /sala sin confirmar/i, noSend: /no envíes/i }
};

function runDemo(code) {
  const output = [];
  const forbidden = () => { throw new Error('The offline demo attempted an external action'); };
  runInNewContext(code, {
    console: { log: (value) => output.push(value) },
    fetch: forbidden,
    send_message: forbidden,
    XMLHttpRequest: forbidden,
    WebSocket: forbidden
  }, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } });
  return output;
}

test('workflow tutorial preserves existing progress IDs and localizes every lesson field', async () => {
  const tutorial = registry.getTutorialForPath('ai-workflows-agents');
  assert.ok(tutorial);
  assert.equal(tutorial.href, '/tutorials/ai-workflows-agents');
  assert.equal(tutorial.starterPackId, 'ai-workflows-kit');
  assert.equal(tutorial.starterPackLabel, 'Open the workflows and agents kit');
  assert.equal(registry.tutorialStorageKey(tutorial.pathId), 'desofec:tutorial:ai-workflows-agents');
  assert.deepEqual(tutorial.steps.map(({ id }) => id), stepIds);
  assert.ok(localized.hasLocalizedTutorialPages(tutorial));
  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  assert.deepEqual(paths.find(({ id }) => id === tutorial.pathId).steps, [
    'Choose a workflow or an agent', 'Design it on paper with stop rules',
    'Build and test it in a no-code tool', 'Add guardrails, measure and improve'
  ]);
  const checklist = JSON.parse(await readFile(new URL('../content/starter-pack-checklists.json', import.meta.url), 'utf8'));
  assert.equal(checklist['ai-workflows-kit'].length, 6);

  for (const [language, checks] of Object.entries(languageChecks)) {
    const text = language === 'en'
      ? { title: tutorial.title, intro: tutorial.intro, steps: Object.fromEntries(tutorial.steps.map((step) => [step.id, step])) }
      : translations.getTutorialTranslation(tutorial.pathId, language);
    assert.ok(text.title.trim() && text.intro.trim(), language);
    assert.match(text.intro, checks.fiction, language);
    assert.deepEqual(Object.keys(text.steps).sort(), [...stepIds].sort(), language);
    for (const source of tutorial.steps) {
      const step = text.steps[source.id];
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${language}/${source.id}/${field}`);
        if (language !== 'en') assert.notEqual(step[field], source[field], `${language}/${source.id}/${field}`);
      }
      assert.equal(step.explanation.length, source.explanation.length);
      assert.ok(step.explanation.every((paragraph) => paragraph.trim()));
      assert.doesNotMatch(JSON.stringify(step), /\uFFFD|\p{L}\?\p{L}/u);
      if (language !== 'en') assert.ok(!('id' in step), `${language}: translation must not replace progress IDs`);
    }

    const choice = text.steps['workflow-or-agent'].code;
    assert.match(choice, /2030-07-18/);
    assert.match(choice, checks.room, language);
    const plan = text.steps['design-the-workflow'].code;
    for (const fact of ['E1', 'DUPLICATE', 'CONFLICT', 'read_fixture', 'draft_note', '3', 'BLOCKED']) {
      assert.ok(plan.includes(fact), `${language}: design ${fact}`);
    }
    const cases = text.steps['test-and-guardrails'].code.split('\n').filter((line) => /^[1-5] \|/.test(line));
    assert.equal(cases.length, 5, language);
    assert.deepEqual(cases.map((line) => ['REVIEW', 'DUPLICATE', 'INVALID', 'REVIEW', 'CONFLICT']
      .find((status) => line.includes(status))), ['REVIEW', 'DUPLICATE', 'INVALID', 'REVIEW', 'CONFLICT']);
    assert.ok(cases.every((line) => line.includes('NOT RUN')), `${language}: actual results start unrun`);
    const review = text.steps['measure-and-improve'].code;
    for (const fact of ['NOT RECORDED', 'NOT MEASURED', 'BLOCKED', 'NOT SENT']) {
      assert.ok(review.includes(fact), `${language}: review ${fact}`);
    }
    assert.equal(text.steps['design-the-workflow'].resources[0].url, demos.workflowAgentResources.security.url);
    const metadata = search.tutorialSearchText(tutorial.pathId, language, { title: text.title, description: text.intro });
    assert.ok(`${metadata.title} | Desofec AI Studio`.length < 70, `${language}: search title`);
    assert.ok(metadata.description.length >= 25 && metadata.description.length <= 160, `${language}: search description`);
    if (language !== 'en') {
      for (const step of checklist['ai-workflows-kit']) {
        assert.notEqual(phrases.translatePhrase(step, language), step, `${language}: translated kit checklist`);
      }
      assert.notEqual(phrases.translatePhrase(tutorial.starterPackLabel, language), tutorial.starterPackLabel);
    }
  }
  const source = await readFile(new URL('../lib/ai-workflows-tutorial.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|fetch\(|upsert|applyProgress|persist\(/);
});

test('localized kits match their lessons and execute both offline demos safely', async () => {
  for (const [language, checks] of Object.entries(languageChecks)) {
    const tutorial = registry.getTutorialForPath('ai-workflows-agents');
    const steps = language === 'en'
      ? Object.fromEntries(tutorial.steps.map((step) => [step.id, step]))
      : translations.getTutorialTranslation(tutorial.pathId, language).steps;
    const suffix = language === 'en' ? '' : `-${language}`;
    const name = `ai-workflows-kit${suffix}.md`;
    const source = (await readFile(new URL(`../../downloads/${name}`, import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
    const publicCopy = (await readFile(new URL(`../public/downloads/${name}`, import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
    assert.equal(source, publicCopy, `${language}: public copy matches source`);
    assert.match(source, checks.fiction);
    assert.match(source, checks.room);
    assert.match(source, checks.noSend);
    assert.doesNotMatch(source, /\uFFFD|\p{L}\?\p{L}/u);
    for (const fact of ['2030-07-18', 'DUPLICATE', 'INVALID', 'CONFLICT', 'REVIEW',
      'NOT RUN', 'NOT RECORDED', 'NOT MEASURED', 'BLOCKED', 'NOT SENT']) {
      assert.ok(source.includes(fact), `${language}: kit ${fact}`);
    }
    const blocks = [...source.matchAll(/```js\n([\s\S]*?)\n```/g)].map((match) => match[1]);
    assert.equal(blocks.length, 2, `${language}: two optional offline demos`);
    assert.equal(blocks[0], demos.workflowBatchDemo(language));
    assert.equal(blocks[1], demos.workflowAgentDemo(language));
    assert.equal(blocks[1], steps['agent-loop'].code, `${language}: tutorial and kit use the same agent demo`);
    const sourceLiteral = blocks[0].match(/const source = (".*");/)?.[1];
    assert.ok(sourceLiteral, `${language}: fixed source in batch demo`);
    const fictionalNote = JSON.parse(sourceLiteral);
    assert.ok(steps['workflow-or-agent'].code.includes(fictionalNote), `${language}: demo and lesson use the same source`);
    assert.ok(source.includes(fictionalNote), `${language}: kit and lesson use the same source`);
    assert.match(fictionalNote, checks.room);

    const batch = runDemo(blocks[0]);
    assert.deepEqual(batch.map((line) => line.split(' | ').slice(0, 2)), [
      ['E1', 'REVIEW'], ['E1', 'DUPLICATE'], ['E2', 'INVALID'], ['E3', 'REVIEW'], ['E1', 'CONFLICT']
    ]);
    assert.ok(batch[0].includes('DRAFT: ') && batch[0].includes('2030-07-18'));
    assert.ok(batch[3].includes('DRAFT: '), `${language}: instruction is shown as data`);
    assert.ok([batch[1], batch[2], batch[4]].every((line) => !line.includes('DRAFT: ')));
    const agent = runDemo(blocks[1]);
    assert.equal(agent.length, 3);
    assert.match(agent[0], /^STEP 1: read_fixture -> /);
    assert.match(agent[1], /^STEP 2: draft_note -> DRAFT: /);
    assert.equal(agent[2], 'STEP 3: BLOCKED: send_message');

    const allowedLoop = blocks[1].replace(
      "return ['send_message', history[1].result];",
      "return ['draft_note', history[1].result];"
    );
    assert.notEqual(allowedLoop, blocks[1]);
    const bounded = runDemo(allowedLoop);
    assert.equal(bounded.length, 4);
    assert.match(bounded[2], /^STEP 3: draft_note -> /);
    assert.equal(bounded[3], 'STOPPED: step limit');

    assert.equal(downloads.starterPackDownloadFile('ai-workflows-kit', 'downloads/ai-workflows-kit.md', language), `downloads/${name}`);
    for (const existing of ['ai-meeting-notes-kit', 'ai-multilingual-work-kit', 'ai-privacy-fact-checking-kit']) {
      assert.equal(downloads.starterPackDownloadFile(existing, `downloads/${existing}.md`, language), `downloads/${existing}${suffix}.md`);
    }
    assert.equal(downloads.starterPackDownloadFile('untranslated-kit', 'downloads/untranslated-kit.md', language), 'downloads/untranslated-kit.md');
  }
});
