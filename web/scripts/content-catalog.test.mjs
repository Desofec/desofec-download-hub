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
    { id: 'ai-small-business', goal: 'ai-small-business', kit: 'ai-small-business-kit', tools: ['tally', 'hubspot-breeze'] },
    { id: 'ai-video-creation', goal: 'create-content', kit: 'ai-video-creation-kit', tools: ['runway'] },
    { id: 'ai-career-skills', goal: 'ai-career', kit: 'ai-career-skills-kit', tools: ['teal'] }
  ];

  for (const addition of additions) {
    const learningPath = catalog.paths.find((entry) => entry.id === addition.id);
    assert.equal(learningPath?.goal, addition.goal);
    const recommendation = catalog.recommendations[addition.goal];
    assert.ok(recommendation.starters.includes(addition.kit));
    for (const tool of addition.tools) assert.ok(recommendation.tools.includes(tool));

    const pack = catalog.starterPacks.find((entry) => entry.id === addition.kit);
    const strings = [learningPath.title, learningPath.description, ...learningPath.steps, pack.title, pack.description];
    for (const locale of ['fr', 'de', 'es']) {
      const translations = JSON.parse(await readFile(path.join(repoDir, 'web/content/translations', `catalog-${locale}.json`), 'utf8'));
      for (const text of strings) assert.ok(translations[text], `${locale}: missing "${text}"`);
    }
  }
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
