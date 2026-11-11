import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readAndValidateCatalog } from './content-catalog.mjs';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('production metadata, crawler discovery and newsletter defaults use the www origin', async () => {
  const files = {
    'app/layout.tsx': 5,
    'app/robots.ts': 1,
    'app/sitemap.ts': 1,
    'app/business-launchpad/automation-lab/page.tsx': 1,
    'app/business-launchpad/spreadsheet-lab/page.tsx': 1,
    'app/actions.ts': 1,
    '.env.example': 1
  };
  for (const [file, count] of Object.entries(files)) {
    const source = await readFile(path.join(repoDir, 'web', file), 'utf8');
    assert.doesNotMatch(source, /https:\/\/desofec\.com(?:[/'"]|$)/, file);
    assert.equal((source.match(/https:\/\/www\.desofec\.com/g) ?? []).length, count, file);
  }
  const actions = await readFile(path.join(repoDir, 'web/app/actions.ts'), 'utf8');
  assert.match(actions, /process\.env\.NEXT_PUBLIC_SITE_URL \|\| 'https:\/\/www\.desofec\.com'/);
  assert.match(actions, /noreply@desofec\.com/);
});

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
    { id: 'ai-education-services', goal: 'offer-education-services', kit: 'ai-education-services-kit', tools: ['notebooklm'] },
    { id: 'ai-privacy-fact-checking', goal: 'research-ai', kit: 'ai-privacy-fact-checking-kit', tools: [] },
    { id: 'ai-multilingual-work', goal: 'ai-productivity', kit: 'ai-multilingual-work-kit', tools: [] },
    { id: 'ai-meeting-notes', goal: 'ai-productivity', kit: 'ai-meeting-notes-kit', tools: [] }
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
    if (['ai-privacy-fact-checking', 'ai-multilingual-work', 'ai-meeting-notes'].includes(addition.id)) {
      assert.equal(checklist.length, 6);
      strings.push(...checklist);
    }
    if (['scope-freelance-project', 'offer-content-services', 'offer-cad-services', 'validate-micro-saas', 'offer-education-services', 'create-business-videos'].includes(addition.goal)) {
      assert.equal(checklist.length, 5);
      strings.push(goal.name, goal.description, goal.badge, recommendation.title, recommendation.summary,
        ...recommendation.steps, ...checklist);
      const download = await readFile(path.join(repoDir, pack.file), 'utf8');
      assert.ok(download.length > 2000, `${addition.kit}: substantial practical worksheet`);
      assert.equal(download, await readFile(path.join(repoDir, 'web/public', pack.file), 'utf8'));
    }
    if (addition.id === 'ai-content-services') {
      for (const locale of ['fr', 'de', 'es']) {
        const localizedFile = `downloads/ai-content-services-kit-${locale}.md`;
        const download = await readFile(path.join(repoDir, localizedFile), 'utf8');
        assert.ok(download.length > 2000, `${localizedFile}: substantial localized worksheet`);
        assert.equal(download, await readFile(path.join(repoDir, 'web/public', localizedFile), 'utf8'));
        assert.match(download, locale === 'fr' ? /40 à 60/ : /40-60/);
        assert.match(download, /100 EUR/);
        assert.match(download, /BLOQU|BLOCKIERT|BLOQUEAD/);
      }
    }
    if (addition.id === 'ai-automation-services') {
      for (const locale of ['fr', 'de', 'es']) {
        const localizedFile = `downloads/ai-automation-services-kit-${locale}.md`;
        const download = await readFile(path.join(repoDir, localizedFile), 'utf8');
        assert.ok(download.length > 10000, `${localizedFile}: substantial localized guide`);
        assert.equal(download, await readFile(path.join(repoDir, 'web/public', localizedFile), 'utf8'));
        for (const invariant of ['AUTO-', 'APPT-', 'REPORT-', 'event_id', 'QUEUED', 'DUPLICATE',
          'INVALID', 'REVIEW', 'E1', 'A1', 'O5', '2030-01-07', '2030-01-13', 'EUR 21', 'EUR 29',
          '324', '45', '2h/month']) {
          assert.ok(download.includes(invariant), `${locale}: missing invariant "${invariant}"`);
        }
        assert.match(download, /(?:zéro message envoyé|null gesendete Nachrichten|cero mensajes enviados)/, locale);
      }
    }
    if (addition.id === 'ai-spreadsheets') {
      for (const locale of ['fr', 'de', 'es']) {
        const localizedFile = `downloads/ai-spreadsheets-kit-${locale}.md`;
        const download = await readFile(path.join(repoDir, localizedFile), 'utf8');
        assert.ok(download.length > 6000, `${localizedFile}: substantial localized guide`);
        assert.equal(download, await readFile(path.join(repoDir, 'web/public', localizedFile), 'utf8'));
        for (const invariant of [
          'Order,Item,Quantity,UnitPrice',
          'A5,Folder,,4',
          '2030/01/07',
          'A5,Folder,2030-01-13,,4',
          'A6,Folder,01/02/2030,1,4',
          '=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")',
          '=SUM(E2:E6)',
          '=COUNTIF(E2:E6,"REVIEW")',
          '10, 6, 5, 0, REVIEW',
          'SHEET-1',
          'SHEET-7',
          '2030-01-07',
          '2030-01-13',
          'EUR 21',
          'CSV',
          'XLSX'
        ]) {
          assert.ok(download.includes(invariant), `${locale}: missing invariant "${invariant}"`);
        }
      }
    }
    for (const locale of ['fr', 'de', 'es']) {
      const translations = JSON.parse(await readFile(path.join(repoDir, 'web/content/translations', `catalog-${locale}.json`), 'utf8'));
      for (const text of strings) assert.ok(translations[text], `${locale}: missing "${text}"`);
    }
  }
});

test('new learning catalog updates match the source data and only insert the intended rows', async () => {
  const catalog = await readAndValidateCatalog(repoDir);
  const sqlLiteral = (value) => `'${value.replaceAll("'", "''")}'`;
  for (const [id, label] of [
    ['ai-privacy-fact-checking', 'privacy'],
    ['ai-multilingual-work', 'multilingual'],
    ['ai-meeting-notes', 'meeting notes']
  ]) {
    const learningPath = catalog.paths.find((entry) => entry.id === id);
    const pack = catalog.starterPacks.find((entry) => entry.id === `${id}-kit`);
    const update = await readFile(path.join(repoDir, 'supabase', 'catalog-updates', `${id}.sql`), 'utf8');
    for (const value of [
      learningPath.id, learningPath.title, learningPath.level, learningPath.description,
      learningPath.badge, learningPath.goal, ...learningPath.steps,
      pack.id, pack.title, pack.description, pack.level, pack.file
    ]) {
      assert.ok(update.includes(sqlLiteral(value)), `${id}: catalog update is missing ${value}`);
    }
    assert.ok(catalog.recommendations[learningPath.goal].starters.includes(pack.id));
    assert.deepEqual([...update.matchAll(/\binsert\s+into\s+public\.([a-z_]+)/gi)].map((match) => match[1]), [
      'starter_packs', 'paths', 'recommendation_starters'
    ]);
    assert.equal((update.match(/\bon conflict\s*\([^)]*\)\s*do nothing/gi) ?? []).length, 3);
    assert.doesNotMatch(update, /\b(?:delete\s+from|truncate|update|alter\s+table|drop\s+table)\s+public\./i);
    assert.match(update, new RegExp(`existing ${label} kit differs`, 'i'));
    assert.match(update, new RegExp(`existing ${label} path differs`, 'i'));
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
  for (const file of ['downloads/ai-automation-services-kit.md', ...['fr', 'de', 'es'].map(locale =>
    `downloads/ai-automation-services-kit-${locale}.md`)]) {
    const download = await readFile(path.join(repoDir, file), 'utf8');
    assert.equal(download, await readFile(path.join(repoDir, 'web/public', file), 'utf8'));
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

test('rejects stale review names and text, unknown tools and invalid review dates', async () => {
  await withCatalog(async (tempDir) => {
    const reviewsPath = path.join(tempDir, 'data', 'tool-reviews.json');
    const reviews = JSON.parse(await readFile(reviewsPath, 'utf8'));
    reviews.tally.toolName = 'Outdated name';
    await writeFile(reviewsPath, JSON.stringify(reviews));
    await assert.rejects(readAndValidateCatalog(tempDir), /stale review/);
  });
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
