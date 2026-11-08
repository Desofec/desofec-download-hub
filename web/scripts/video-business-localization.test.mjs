import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function loadModule(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const { videoBusinessSteps } = await loadModule('../lib/video-business-tutorial.ts');
const { videoBusinessTranslations } = await loadModule('../lib/translations/video-business.ts');
const { starterPackDownloadFile } = await loadModule('../lib/starter-pack-downloads.ts');
const locales = ['fr', 'de', 'es'];

test('all six business-video lessons are fully translated without changing progress IDs', () => {
  assert.equal(videoBusinessSteps.length, 6);
  const ids = videoBusinessSteps.map(({ id }) => id);
  assert.deepEqual(ids, [
    'video-business-brief',
    'video-business-scripts',
    'video-business-edit',
    'video-business-review',
    'video-business-offer',
    'video-business-handover'
  ]);
  for (const locale of locales) {
    const translation = videoBusinessTranslations['ai-video-business'][locale];
    assert.ok(translation.title.trim());
    assert.ok(translation.intro.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    for (const source of videoBusinessSteps) {
      const translated = translation.steps[source.id];
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(translated[field]?.trim(), `${locale}/${source.id}.${field}`);
        assert.notEqual(translated[field], source[field], `${locale}/${source.id}.${field}`);
      }
      assert.equal(translated.explanation.length, source.explanation.length, `${locale}/${source.id}`);
      translated.explanation.forEach((text, index) => {
        assert.ok(text.trim(), `${locale}/${source.id}.explanation[${index}]`);
        assert.notEqual(text, source.explanation[index], `${locale}/${source.id}.explanation[${index}]`);
      });
      assert.equal('id' in translated, false, `${locale}/${source.id}: progress IDs stay in source`);
    }
  }
});

test('lesson translations retain the exact exercise facts, calculations and review safeguards', () => {
  for (const locale of locales) {
    const steps = videoBusinessTranslations['ai-video-business'][locale].steps;
    const allText = JSON.stringify(steps);
    for (const invariant of [
      'Cedar Bakery', '08:00-14:00', '15-30', '1080 x 1920', '9:16',
      '0-4', '4-14', '14-20', 'VIDEO-1', 'VIDEO-7', 'v1 -> v2',
      '(1 + 2 + 1 + 1)', 'EUR 20', 'EUR 100', 'BLOCKED', 'PASS'
    ]) {
      assert.ok(allText.toLowerCase().includes(invariant.toLowerCase()), `${locale}: ${invariant}`);
    }
    const publicationNotice = {
      fr: /non approuvée pour publication/i,
      de: /nicht zur veröffentlichung freigegeben/i,
      es: /no aprobada para publicar/i
    }[locale];
    assert.match(steps['video-business-brief'].code, publicationNotice);
    assert.match(steps['video-business-brief'].code, /Unknown|Inconnus|Unbekannt|Desconocido/i);
    assert.match(steps['video-business-review'].code, /price.*unknown|prix.*inconnu|Preis.*unbekannt|precio.*desconocido/i);
    assert.match(steps['video-business-handover'].explanation.join(' '), /saved|enregistr|gespeichert|guardad/i);
  }
  assert.deepEqual(videoBusinessSteps.map(({ id }) => id), [
    'video-business-brief', 'video-business-scripts', 'video-business-edit',
    'video-business-review', 'video-business-offer', 'video-business-handover'
  ]);
});

test('localized starter-kit downloads route only the business-video kit and preserve existing routes', async () => {
  const file = 'downloads/ai-video-business-kit.md';
  const english = await readFile(path.join(repoDir, file), 'utf8');
  assert.ok(english.length > 3000);
  assert.equal(await readFile(path.join(repoDir, 'web', 'public', file), 'utf8'), english);
  for (const locale of locales) {
    const localizedName = starterPackDownloadFile('ai-video-business-kit', file, locale);
    assert.equal(localizedName, `downloads/ai-video-business-kit-${locale}.md`);
    const localized = await readFile(path.join(repoDir, localizedName), 'utf8');
    assert.ok(localized.length > 3000, `${locale}: substantial localized guide`);
    assert.equal(localized, await readFile(path.join(repoDir, 'web', 'public', localizedName), 'utf8'));
    for (const invariant of [
      'Cedar Bakery', '08:00-14:00', '15-30', '1080 x 1920', '9:16',
      '0-4', '4-14', '14-20', 'EUR 20', 'EUR 100',
      'VIDEO-1', 'VIDEO-2', 'VIDEO-3', 'VIDEO-4', 'VIDEO-5', 'VIDEO-6', 'VIDEO-7',
      'BLOCKED', 'PASS', 'v1', 'v2'
    ]) {
      assert.ok(localized.includes(invariant), `${locale}: missing invariant "${invariant}"`);
    }
    assert.match(localized, /storyboard/i);
    assert.match(localized, /fictional|fictif|fiktiv|ficticia/i);
  }
  assert.equal(starterPackDownloadFile('ai-video-business-kit', file, 'en'), file);
  assert.equal(starterPackDownloadFile('ai-video-creation-kit', file, 'fr'), file);
  assert.equal(starterPackDownloadFile('ai-commerce-services-kit', 'downloads/ai-commerce-services-kit.md', 'fr'),
    'downloads/ai-commerce-services-kit-fr.md');
  assert.equal(starterPackDownloadFile('ai-automation-services-kit', 'downloads/ai-automation-services-kit.md', 'de'),
    'downloads/ai-automation-services-kit-de.md');
});
