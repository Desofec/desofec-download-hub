import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function loadModule(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const { videoCreationSteps } = await loadModule('../lib/practical-ai-tutorials.ts');
const { starterPackDownloadFile } = await loadModule('../lib/starter-pack-downloads.ts');
const locales = ['fr', 'de', 'es'];

test('video creation kit translations cover the complete responsible 30-second workflow', async () => {
  const ids = videoCreationSteps.map(({ id }) => id);
  assert.deepEqual(ids, [
    'video-brief', 'storyboard', 'permissioned-assets',
    'edit-video', 'captions-review', 'publish-video'
  ]);
  const english = await readFile(path.join(repoDir, 'downloads', 'ai-video-creation-kit.md'), 'utf8');
  for (const locale of locales) {
    const file = `downloads/ai-video-creation-kit-${locale}.md`;
    const translated = await readFile(path.join(repoDir, file), 'utf8');
    assert.ok(translated.length > 2000, `${locale}: substantial translated kit`);
    assert.equal(translated, await readFile(path.join(repoDir, 'web', 'public', file), 'utf8'));
    assert.notEqual(translated, english);
    for (const invariant of [
      '0-10', '10-20', '20-30', '30', 'Runway', 'https://runwayml.com/',
      '2026-11-05', 'CapCut', 'Descript', 'AI'
    ]) {
      assert.ok(translated.includes(invariant), `${locale}: missing "${invariant}"`);
    }
    assert.equal((translated.match(/^## /gm) ?? []).length, 5, `${locale}: all workflow sections`);
    const sectionTerms = {
      fr: ['Brief', 'Storyboard', 'autorisations', 'Production', 'Accessibilité'],
      de: ['Briefing', 'Storyboard', 'Berechtigungsprotokoll', 'Produktion', 'Barrierefreiheit'],
      es: ['Brief', 'Storyboard', 'permisos', 'Producción', 'Accesibilidad']
    }[locale];
    for (const section of sectionTerms) {
      assert.ok(translated.toLowerCase().includes(section.toLowerCase()), `${locale}: missing section "${section}"`);
    }
    assert.match(translated, /licen|permission|autoris|erlaubnis|autoriz/i);
    assert.match(translated, /caption|sous-titre|untertitel|subtítulo/i);
    assert.match(translated, /flashing|clignot|blink|parpade/i);
    assert.match(translated, /disclosure|déclaration|kennzeichnungs|divulgación/i);
    assert.match(translated, /transcript|transcription|Transkript|transcripción/i);
  }
});

test('selected language routes only this newly localized video-creation kit', () => {
  const source = 'downloads/ai-video-creation-kit.md';
  for (const locale of locales) {
    assert.equal(
      starterPackDownloadFile('ai-video-creation-kit', source, locale),
      `downloads/ai-video-creation-kit-${locale}.md`
    );
    assert.equal(
      starterPackDownloadFile('ai-video-business-kit', 'downloads/ai-video-business-kit.md', locale),
      `downloads/ai-video-business-kit-${locale}.md`
    );
  }
  assert.equal(starterPackDownloadFile('ai-video-creation-kit', source, 'en'), source);
  assert.equal(starterPackDownloadFile('other-kit', source, 'fr'), source);
  assert.equal(starterPackDownloadFile(
    'ai-commerce-services-kit',
    'downloads/ai-commerce-services-kit.md',
    'de'
  ), 'downloads/ai-commerce-services-kit-de.md');
});
