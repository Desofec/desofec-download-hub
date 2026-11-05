import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function contentUrl(relativePath, imports = {}) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  });
  for (const [specifier, dependency] of Object.entries(imports)) {
    outputText = outputText.replaceAll(`'${specifier}'`, JSON.stringify(await contentUrl(dependency)));
  }
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

async function loadContent(relativePath, imports = {}) {
  return import(await contentUrl(relativePath, imports));
}

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
