import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readAndValidateCatalog } from './content-catalog.mjs';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('practical AI paths have recommendations, kits and catalog translations', async () => {
  const catalog = await readAndValidateCatalog(repoDir);
  const additions = [
    { id: 'freelance-client-discovery', goal: 'scope-freelance-project', kit: 'freelance-client-discovery-kit', tools: ['google-sheets'] },
    { id: 'ai-small-business', goal: 'ai-small-business', kit: 'ai-small-business-kit', tools: ['tally', 'hubspot-breeze'] },
    { id: 'ai-video-creation', goal: 'create-content', kit: 'ai-video-creation-kit', tools: ['runway'] },
    { id: 'ai-video-business', goal: 'create-business-videos', kit: 'ai-video-business-kit', tools: ['canva', 'runway', 'chatgpt'] },
    { id: 'ai-career-skills', goal: 'ai-career', kit: 'ai-career-skills-kit', tools: ['teal'] },
    { id: 'ai-spreadsheets', goal: 'analyze-data', kit: 'ai-spreadsheets-kit', tools: ['excel-copilot', 'google-sheets'] },
    { id: 'ai-automation-services', goal: 'start-ai-business', kit: 'ai-automation-services-kit', tools: ['make', 'n8n', 'google-sheets'] },
    { id: 'ai-content-services', goal: 'offer-content-services', kit: 'ai-content-services-kit', tools: ['canva'] },
    { id: 'ai-cad-services', goal: 'offer-cad-services', kit: 'ai-cad-services-kit', tools: ['fusion-360'] },
    { id: 'micro-saas-validation', goal: 'validate-micro-saas', kit: 'micro-saas-validation-kit', tools: ['vscode'] },
    { id: 'ai-education-services', goal: 'offer-education-services', kit: 'ai-education-services-kit', tools: ['notebooklm'] }
  ];

  for (const addition of additions) {
    const learningPath = catalog.paths.find((entry) => entry.id === addition.id);
    assert.equal(learningPath?.goal, addition.goal);
    const recommendation = catalog.recommendations[addition.goal];
    assert.ok(recommendation.starters.includes(addition.kit));
    for (const tool of addition.tools) assert.ok(recommendation.tools.includes(tool));

    const pack = catalog.starterPacks.find((entry) => entry.id === addition.kit);
    const goal = catalog.goals.find((entry) => entry.id === addition.goal);
    const checklist = catalog.starterPackChecklists[addition.kit];
    assert.ok(checklist.length >= 5);
    const strings = [learningPath.title, learningPath.description, ...learningPath.steps, pack.title, pack.description];
    if (['scope-freelance-project', 'offer-content-services', 'offer-cad-services', 'validate-micro-saas', 'offer-education-services', 'create-business-videos'].includes(addition.goal)) {
      assert.equal(checklist.length, 5);
      strings.push(goal.name, goal.description, goal.badge, recommendation.title, recommendation.summary,
        ...recommendation.steps, ...checklist);
      const download = await readFile(path.join(repoDir, pack.file), 'utf8');
      assert.ok(download.length > 2000, `${addition.kit}: substantial practical worksheet`);
      assert.equal(download, await readFile(path.join(repoDir, 'web/public', pack.file), 'utf8'));
    }
    for (const locale of ['fr', 'de', 'es']) {
      const translations = JSON.parse(await readFile(path.join(repoDir, 'web/content/translations', `catalog-${locale}.json`), 'utf8'));
      for (const text of strings) assert.ok(translations[text], `${locale}: missing "${text}"`);
    }
  }
});

test('business launchpad catalog, checklist and hub copy have complete translations', async () => {
  const catalog = await readAndValidateCatalog(repoDir);
  const goal = catalog.goals.find((entry) => entry.id === 'start-ai-business');
  const recommendation = catalog.recommendations[goal.id];
  const checklist = catalog.starterPackChecklists['ai-automation-services-kit'];
  assert.equal(checklist.length, 6);
  const hub = await readFile(path.join(repoDir, 'web/app/business-launchpad/page.tsx'), 'utf8');
  const uiStrings = [
    ...hub.matchAll(/<Tr>([^<{]+)<\/Tr>/g),
    ...hub.matchAll(/phrase\('([^']+)'\)/g)
  ].map((match) => match[1]);
  assert.ok(uiStrings.length >= 25);
  for (const locale of ['fr', 'de', 'es']) {
    const catalogBook = JSON.parse(await readFile(path.join(repoDir, 'web/content/translations', `catalog-${locale}.json`), 'utf8'));
    const uiBook = JSON.parse(await readFile(path.join(repoDir, 'web/content/translations', `ui-${locale}.json`), 'utf8'));
    const book = { ...catalogBook, ...uiBook };
    for (const text of [goal.name, goal.description, goal.badge, recommendation.title, recommendation.summary, ...recommendation.steps, ...checklist, ...uiStrings]) {
      assert.ok(book[text], `${locale}: missing launchpad translation "${text}"`);
    }
  }
  const download = await readFile(path.join(repoDir, 'downloads/ai-automation-services-kit.md'), 'utf8');
  assert.equal(download, await readFile(path.join(repoDir, 'web/public/downloads/ai-automation-services-kit.md'), 'utf8'));
});

async function withCatalog(callback) {
  const tempDir = await mkdtemp(path.join(tmpdir(), 'desofec-content-'));
  try {
    await Promise.all(
      ['data', 'downloads'].map((directory) =>
        cp(path.join(repoDir, directory), path.join(tempDir, directory), { recursive: true })
      )
    );
    await callback(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

test('rejects duplicate catalog IDs', async () => {
  await withCatalog(async (tempDir) => {
    const goalsPath = path.join(tempDir, 'data', 'goals.json');
    const goals = JSON.parse(await readFile(goalsPath, 'utf8'));
    goals[1].id = goals[0].id;
    await writeFile(goalsPath, JSON.stringify(goals));

    await assert.rejects(readAndValidateCatalog(tempDir), /duplicate id/);
  });
});

test('rejects unknown recommendation references', async () => {
  await withCatalog(async (tempDir) => {
    const recommendationsPath = path.join(tempDir, 'data', 'recommendations.json');
    const recommendations = JSON.parse(await readFile(recommendationsPath, 'utf8'));
    recommendations['learn-ai'].tools.push('missing-tool');
    await writeFile(recommendationsPath, JSON.stringify(recommendations));

    await assert.rejects(readAndValidateCatalog(tempDir), /unknown reference "missing-tool"/);
  });
});

test('rejects missing starter pack checklists', async () => {
  await withCatalog(async (tempDir) => {
    const checklistPath = path.join(tempDir, 'data', 'starter-pack-checklists.json');
    const checklists = JSON.parse(await readFile(checklistPath, 'utf8'));
    delete checklists['ai-prompt-pack'];
    await writeFile(checklistPath, JSON.stringify(checklists));

    await assert.rejects(readAndValidateCatalog(tempDir), /missing checklist for "ai-prompt-pack"/);
  });
});

test('rejects stale review text, unknown tools and invalid review dates', async () => {
  await withCatalog(async (tempDir) => {
    const reviewsPath = path.join(tempDir, 'data', 'tool-reviews.json');
    const reviews = JSON.parse(await readFile(reviewsPath, 'utf8'));
    reviews.tally.description = 'Outdated description';
    await writeFile(reviewsPath, JSON.stringify(reviews));
    await assert.rejects(readAndValidateCatalog(tempDir), /stale review/);
  });
  await withCatalog(async (tempDir) => {
    const reviewsPath = path.join(tempDir, 'data', 'tool-reviews.json');
    const reviews = JSON.parse(await readFile(reviewsPath, 'utf8'));
    reviews['missing-tool'] = reviews.tally;
    await writeFile(reviewsPath, JSON.stringify(reviews));
    await assert.rejects(readAndValidateCatalog(tempDir), /unknown tool/);
  });
  for (const reviewedOn of ['2026-02-30', '2999-01-01', 'not-a-date']) {
    await withCatalog(async (tempDir) => {
      const reviewsPath = path.join(tempDir, 'data', 'tool-reviews.json');
      const reviews = JSON.parse(await readFile(reviewsPath, 'utf8'));
      reviews.tally.reviewedOn = reviewedOn;
      await writeFile(reviewsPath, JSON.stringify(reviews));
      await assert.rejects(readAndValidateCatalog(tempDir), /invalid review date/);
    });
  }
});
