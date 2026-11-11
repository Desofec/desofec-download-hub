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

const sourceSegments = [
  'M1: Harbor Learning Centre offers a free digital skills workshop.',
  'M2: It takes place on 2030-06-14 from 14:00 to 15:00 UTC in Room B.',
  'M3: Registration closes on 2030-06-12; there are 20 seats.',
  'M4: Materials are provided.'
];
const spanishSegments = [
  'M1: Harbor Learning Centre ofrece un taller gratuito de competencias digitales.',
  'M2: Se celebra el 2030-06-14 de 14:00 a 15:00 UTC en la sala B.',
  'M3: La inscripción se cierra el 2030-06-12; hay 20 plazas.',
  'M4: Se proporcionan los materiales.'
];

const words = {
  en: { fiction: /fictional/i, blocked: /BLOCKED/, feedback: /NOT COLLECTED/, noSend: /do not send or publish/i },
  fr: { fiction: /ficti(?:f|ve)/i, blocked: /BLOQUÉE/, feedback: /NON RECUEILLIS/, noSend: /ne pas envoyer ni publier/i },
  de: { fiction: /fiktiv/i, blocked: /BLOCKIERT/, feedback: /NICHT ERHOBEN/, noSend: /nicht versenden oder veröffentlichen/i },
  es: { fiction: /ficticio/i, blocked: /BLOQUEADA/, feedback: /NO RECOPILADOS/, noSend: /no enviar ni publicar/i }
};

test('multilingual tutorial preserves the source, exercise facts and honest review in every language', async () => {
  const tutorial = registry.getTutorialForPath('ai-multilingual-work');
  assert.ok(tutorial);
  assert.equal(tutorial.href, '/tutorials/ai-multilingual-work');
  assert.equal(tutorial.starterPackId, 'ai-multilingual-work-kit');
  assert.equal(registry.tutorialStorageKey(tutorial.pathId), 'desofec:tutorial:ai-multilingual-work');
  assert.deepEqual(tutorial.steps.map(({ id }) => id), [
    'translation-brief', 'translation-prepare', 'translation-glossary',
    'translation-draft', 'translation-check', 'translation-handover'
  ]);
  assert.ok(localized.hasLocalizedTutorialPages(tutorial));
  for (const [language, checks] of Object.entries(words)) {
    const text = language === 'en'
      ? { title: tutorial.title, intro: tutorial.intro, steps: Object.fromEntries(tutorial.steps.map((step) => [step.id, step])) }
      : translations.getTutorialTranslation(tutorial.pathId, language);
    assert.match(text.intro, checks.fiction, language);
    assert.deepEqual(Object.keys(text.steps).sort(), tutorial.steps.map(({ id }) => id).sort(), language);
    for (const source of tutorial.steps) {
      const step = text.steps[source.id];
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${language}/${source.id}/${field}`);
        if (language !== 'en') assert.notEqual(step[field], source[field], `${language}/${source.id}/${field} translated`);
      }
      assert.equal(step.explanation.length, source.explanation.length);
      assert.ok(step.explanation.every((paragraph) => paragraph.trim()));
      assert.doesNotMatch(JSON.stringify(step), /\uFFFD|\p{L}\?\p{L}/u);
    }
    for (const segment of sourceSegments) assert.ok(text.steps['translation-brief'].code.includes(segment), `${language}: ${segment}`);
    for (const segment of spanishSegments) assert.ok(text.steps['translation-draft'].code.includes(segment), `${language}: ${segment}`);
    const comparison = text.steps['translation-check'].code;
    for (const fact of ['2030-06-14', '15:00-16:00 UTC', '14:00-15:00 UTC', '2030-06-12', '30 plazas', '20 plazas']) {
      assert.ok(comparison.includes(fact), `${language}: ${fact}`);
    }
    const handover = text.steps['translation-handover'].code;
    for (const fact of ['2030-06-14', '14:00-15:00 UTC', '2030-06-12', '20']) assert.ok(handover.includes(fact), `${language}: ${fact}`);
    assert.match(handover, checks.blocked, language);
    assert.match(handover, checks.feedback, language);
    assert.match(handover, checks.noSend, language);
    const metadata = search.tutorialSearchText(tutorial.pathId, language, { title: text.title, description: text.intro });
    assert.ok(`${metadata.title} | Desofec AI Studio`.length < 70, `${language}: metadata title`);
    assert.ok(metadata.description.length >= 25 && metadata.description.length <= 160, `${language}: metadata description`);
  }
  const source = await readFile(new URL('../lib/ai-multilingual-work-tutorial.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|fetch\(|upsert|applyProgress|persist\(/);
});

test('multilingual kits preserve source and Spanish draft and follow the selected language', async () => {
  for (const [language, checks] of Object.entries(words)) {
    const suffix = language === 'en' ? '' : `-${language}`;
    const name = `ai-multilingual-work-kit${suffix}.md`;
    const source = await readFile(new URL(`../../downloads/${name}`, import.meta.url), 'utf8');
    const publicCopy = await readFile(new URL(`../public/downloads/${name}`, import.meta.url), 'utf8');
    assert.equal(source, publicCopy, `${language}: source and public download`);
    assert.doesNotMatch(source, /\uFFFD|\p{L}\?\p{L}/u);
    assert.equal(source.split(/^## /m).length - 1, 5);
    for (const segment of [...sourceSegments, ...spanishSegments]) assert.ok(source.includes(segment), `${language}: ${segment}`);
    for (const fact of ['2030-06-14', '2030-06-12', '14:00-15:00 UTC', '15:00-16:00 UTC', '30 plazas', '20 plazas']) {
      assert.ok(source.includes(fact), `${language}: ${fact}`);
    }
    assert.match(source, checks.fiction, language);
    assert.match(source, checks.blocked, language);
    assert.match(source, checks.feedback, language);
    assert.equal(
      downloads.starterPackDownloadFile('ai-multilingual-work-kit', 'downloads/ai-multilingual-work-kit.md', language),
      `downloads/${name}`
    );
    assert.equal(
      downloads.starterPackDownloadFile('ai-privacy-fact-checking-kit', 'downloads/ai-privacy-fact-checking-kit.md', language),
      `downloads/ai-privacy-fact-checking-kit${suffix}.md`
    );
  }
});
