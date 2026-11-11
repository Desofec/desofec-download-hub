import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { loadWebModules } from './load-web-modules.mjs';

const [registry, translations, localized, search, downloads] = loadWebModules([
  'lib/tutorials.ts',
  'lib/tutorial-translations.ts',
  'lib/localized-tutorials.ts',
  'lib/tutorial-search-metadata.ts',
  'lib/starter-pack-downloads.ts'
]);

const sourceChecks = {
  en: {
    r1: /free.*2030-07-18/i,
    r2: /2030-07-04/,
    r3: /2030-07-02.*if available.*not confirmed/i,
    r4: /budget is not approved/i,
    r5: /2030-07-06.*10:00 UTC.*if everyone agrees/i,
    r6: /draft.*do not send.*reviewer approves/i,
    privacy: /permission is missing or someone objects, do not record/i,
    fiction: /fictional/i
  },
  fr: {
    r1: /gratuit.*2030-07-18/i,
    r2: /au plus tard le 2030-07-04/i,
    r3: /2030-07-02.*disponible.*n’est pas confirmée/i,
    r4: /budget n’est pas approuvé/i,
    r5: /2030-07-06.*10:00 UTC.*si tout le monde est d’accord/i,
    r6: /brouillon.*ne l’envoyez pas.*approbation/i,
    privacy: /autorisation manque ou si une personne s’oppose, n’enregistrez pas/i,
    fiction: /ficti(?:f|ve)/i
  },
  de: {
    r1: /kostenlosen.*2030-07-18/i,
    r2: /bis zum 2030-07-04/i,
    r3: /2030-07-02.*verfügbar.*nicht bestätigt/i,
    r4: /budget ist nicht freigegeben/i,
    r5: /2030-07-06.*10:00 UTC.*wenn alle einverstanden sind/i,
    r6: /entwurf.*nicht versenden.*freigegeben/i,
    privacy: /fehlt eine erlaubnis oder widerspricht jemand, nehmen sie nicht auf/i,
    fiction: /fiktiv/i
  },
  es: {
    r1: /gratuito.*2030-07-18/i,
    r2: /a más tardar el 2030-07-04/i,
    r3: /2030-07-02.*disponible.*no está confirmada/i,
    r4: /presupuesto no está aprobado/i,
    r5: /2030-07-06.*10:00 UTC.*si todos están de acuerdo/i,
    r6: /borrador.*no enviarlo.*apruebe/i,
    privacy: /falta un permiso o alguien se opone, no grabes/i,
    fiction: /fictici[oa]/i
  }
};

test('meeting-notes translations preserve source evidence, privacy and honest follow-up', async () => {
  const tutorial = registry.getTutorialForPath('ai-meeting-notes');
  assert.ok(tutorial);
  assert.equal(tutorial.href, '/tutorials/ai-meeting-notes');
  assert.equal(tutorial.starterPackId, 'ai-meeting-notes-kit');
  assert.equal(registry.tutorialStorageKey(tutorial.pathId), 'desofec:tutorial:ai-meeting-notes');
  assert.deepEqual(tutorial.steps.map(({ id }) => id), [
    'meeting-plan', 'meeting-source', 'meeting-summary', 'meeting-actions', 'meeting-check', 'meeting-follow-up'
  ]);
  assert.ok(localized.hasLocalizedTutorialPages(tutorial));
  for (const [language, checks] of Object.entries(sourceChecks)) {
    const text = language === 'en'
      ? { title: tutorial.title, intro: tutorial.intro, steps: Object.fromEntries(tutorial.steps.map((step) => [step.id, step])) }
      : translations.getTutorialTranslation(tutorial.pathId, language);
    assert.match(text.intro, checks.fiction, language);
    assert.deepEqual(Object.keys(text.steps).sort(), tutorial.steps.map(({ id }) => id).sort(), language);
    for (const source of tutorial.steps) {
      const step = text.steps[source.id];
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${language}/${source.id}/${field}`);
        if (language !== 'en') assert.notEqual(step[field], source[field], `${language}/${source.id}/${field}`);
      }
      assert.equal(step.explanation.length, source.explanation.length);
      assert.ok(step.explanation.every((paragraph) => paragraph.trim()));
      assert.doesNotMatch(JSON.stringify(step), /\uFFFD|\p{L}\?\p{L}/u);
      if (language !== 'en') assert.ok(!('id' in step), `${language}/${source.id}: do not replace progress IDs`);
    }

    const notes = text.steps['meeting-source'].code.split('\n').filter((line) => /^R[1-6] \|/.test(line));
    assert.equal(notes.length, 6, language);
    for (const [index, note] of notes.entries()) assert.match(note, checks[`r${index + 1}`], `${language}: R${index + 1}`);
    assert.match(text.steps['meeting-plan'].explanation.join(' '), checks.privacy, language);
    assert.deepEqual(
      text.steps['meeting-plan'].resources.map(({ url }) => url),
      tutorial.steps[0].resources.map(({ url }) => url),
      `${language}: privacy resources`
    );
    const action = text.steps['meeting-actions'].code;
    for (const fact of ['R2', 'R3', 'R4', 'R5', 'R6', '2030-07-04', '2030-07-02', '2030-07-06',
      '10:00 UTC', 'PLANNED', 'PROPOSED', 'UNCONFIRMED', 'UNASSIGNED', 'NOT STATED', 'NOT APPROVED', 'BLOCKED']) {
      assert.ok(action.includes(fact), `${language}: action ${fact}`);
    }
    const correction = text.steps['meeting-check'].code;
    for (const fact of ['2030-07-03', '2030-07-02', '2030-07-06', '10:00 UTC',
      'UNCONFIRMED', 'NOT APPROVED', 'PROPOSED', 'NOT STATED']) {
      assert.ok(correction.includes(fact), `${language}: correction ${fact}`);
    }
    const handover = text.steps['meeting-follow-up'].code;
    for (const fact of ['2030-07-18', '2030-07-04', '2030-07-02', '2030-07-06', '10:00 UTC',
      'UNCONFIRMED', 'NOT APPROVED', 'UNASSIGNED', 'NOT STATED', 'PROPOSED', 'BLOCKED', 'NOT SENT']) {
      assert.ok(handover.includes(fact), `${language}: follow-up ${fact}`);
    }
    const metadata = search.tutorialSearchText(tutorial.pathId, language, { title: text.title, description: text.intro });
    assert.ok(`${metadata.title} | Desofec AI Studio`.length < 70, `${language}: metadata title`);
    assert.ok(metadata.description.length >= 25 && metadata.description.length <= 160, `${language}: metadata description`);
  }
  const source = await readFile(new URL('../lib/ai-meeting-notes-tutorial.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|fetch\(|upsert|applyProgress|persist\(/);
});

test('meeting-notes kits reproduce their translated sources and follow the selected language', async () => {
  for (const [language, checks] of Object.entries(sourceChecks)) {
    const tutorial = registry.getTutorialForPath('ai-meeting-notes');
    const steps = language === 'en'
      ? Object.fromEntries(tutorial.steps.map((step) => [step.id, step]))
      : translations.getTutorialTranslation(tutorial.pathId, language).steps;
    const suffix = language === 'en' ? '' : `-${language}`;
    const name = `ai-meeting-notes-kit${suffix}.md`;
    const source = await readFile(new URL(`../../downloads/${name}`, import.meta.url), 'utf8');
    const publicCopy = await readFile(new URL(`../public/downloads/${name}`, import.meta.url), 'utf8');
    assert.equal(source, publicCopy, `${language}: source and public download`);
    assert.doesNotMatch(source, /\uFFFD|\p{L}\?\p{L}/u);
    assert.equal(source.split(/^## /m).length - 1, 5);
    assert.match(source, checks.fiction, language);
    for (const line of steps['meeting-source'].code.split('\n').filter((line) => /^R[1-6] \|/.test(line))) {
      assert.ok(source.includes(line), `${language}: kit source must match lesson: ${line}`);
    }
    for (const fact of ['2030-07-18', '2030-07-04', '2030-07-02', '2030-07-03', '2030-07-06',
      '10:00 UTC', 'PLANNED', 'PROPOSED', 'UNCONFIRMED', 'UNASSIGNED', 'NOT STATED',
      'NOT APPROVED', 'BLOCKED', 'NOT SENT']) {
      assert.ok(source.includes(fact), `${language}: kit ${fact}`);
    }
    assert.equal(
      downloads.starterPackDownloadFile('ai-meeting-notes-kit', 'downloads/ai-meeting-notes-kit.md', language),
      `downloads/${name}`
    );
    for (const existing of ['ai-privacy-fact-checking-kit', 'ai-multilingual-work-kit']) {
      assert.equal(
        downloads.starterPackDownloadFile(existing, `downloads/${existing}.md`, language),
        `downloads/${existing}${suffix}.md`
      );
    }
  }
});
