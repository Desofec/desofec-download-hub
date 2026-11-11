import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { loadWebModules } from './load-web-modules.mjs';

const [localized, registry, translations, i18n, search] = loadWebModules([
  'lib/localized-tutorials.ts',
  'lib/tutorials.ts',
  'lib/tutorial-translations.ts',
  'lib/i18n.ts',
  'lib/tutorial-search-metadata.ts'
]);

test('only public tutorials with complete lesson translations get localized pages', () => {
  const { localizedTutorials, hasLocalizedTutorialPages, localizedTutorialLanguages } = localized;
  const ids = new Set(localizedTutorials.map((tutorial) => tutorial.pathId));
  for (const id of ['ai-assisted-coding', 'first-app', 'coding-foundations', 'ai-video-business', 'ai-online-retail', 'content-creation', 'ai-privacy-fact-checking', 'ai-multilingual-work', 'ai-meeting-notes']) {
    assert.ok(ids.has(id), id);
  }
  for (const id of ['ai-spreadsheets', 'shopify-guide', 'freelance-client-discovery']) {
    assert.ok(!ids.has(id), `${id} must not advertise incomplete lesson translations`);
  }
  assert.equal(new Set(localizedTutorials.map(({ href }) => href)).size, localizedTutorials.length);
  for (const tutorial of localizedTutorials) {
    assert.ok(/^\/tutorials\/[a-z0-9-]+$/.test(tutorial.href) || [
      '/projects/first-app/build', '/projects/coding-foundations/build', '/projects/ai-assisted-coding/build'
    ].includes(tutorial.href), tutorial.href);
    for (const language of localizedTutorialLanguages) {
      const translation = translations.getTutorialTranslation(tutorial.pathId, language);
      assert.ok(translation?.title.trim(), `${tutorial.pathId}/${language}: title`);
      assert.ok(translation.intro.trim(), `${tutorial.pathId}/${language}: intro`);
      for (const step of tutorial.steps) {
        const text = translation.steps[step.id];
        assert.ok(text?.title.trim() && text.check.trim() && text.aiPrompt.trim(), `${tutorial.pathId}/${language}/${step.id}`);
        assert.equal(text.explanation.length, step.explanation.length);
        assert.ok(text.explanation.every((paragraph) => paragraph.trim()));
      }
    }
    assert.equal(hasLocalizedTutorialPages({ ...tutorial, href: '/account' }), false);
    assert.equal(hasLocalizedTutorialPages({ ...tutorial, href: '/tutorials/wrong-slug' }), false);
    assert.equal(hasLocalizedTutorialPages({
      ...tutorial,
      steps: [...tutorial.steps, { ...tutorial.steps[0], id: 'missing-translation' }]
    }), false);
  }
  assert.equal(localized.isLocalizedTutorialLanguage('en'), false);
  assert.equal(localized.isLocalizedTutorialLanguage('fr'), true);
  assert.equal(localized.isLocalizedTutorialLanguage('pt'), false);
});

test('content-creation tutorial retains separate progress and complete, safe translations', async () => {
  const tutorial = registry.getTutorialForPath('content-creation');
  assert.ok(tutorial);
  assert.equal(tutorial.href, '/tutorials/content-creation');
  assert.equal(tutorial.time, '60 minutes');
  assert.equal(tutorial.starterPackId, 'content-creator-kit');
  assert.equal(tutorial.starterPackLabel, 'Open the content creator kit');
  assert.deepEqual(tutorial.steps.map(({ id }) => id), [
    'content-brief', 'content-draft', 'content-visual',
    'content-check', 'content-review', 'content-next-steps'
  ]);
  assert.equal(registry.tutorialStorageKey(tutorial.pathId), 'desofec:tutorial:content-creation');
  assert.notEqual(registry.tutorialStorageKey(tutorial.pathId), 'desofec:progress:content-creation');

  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  const path = paths.find(({ id }) => id === tutorial.pathId);
  assert.deepEqual(path.steps, [
    'Choose an audience and a message',
    'Draft with an AI assistant',
    'Add visuals, voice or video',
    'Polish, check facts and share'
  ]);

  for (const [language, fiction, blocked, noPublish, noResults] of [
    ['en', /fictional/i, /BLOCKED/, /do not publish/i, /NOT COLLECTED/],
    ['fr', /fictive/i, /BLOQUÉE/, /ne (?:pas publie|publiez pas)/i, /NON RECUEILLI/],
    ['de', /fiktiv/i, /BLOCKIERT/, /nicht veröffentlichen/i, /NICHT ERHOBEN/],
    ['es', /fictici/i, /BLOQUEADA/, /no publi(?:car|ques)/i, /NO RECOPILAD/]
  ]) {
    const text = language === 'en'
      ? { title: tutorial.title, intro: tutorial.intro, steps: Object.fromEntries(tutorial.steps.map((step) => [step.id, step])) }
      : translations.getTutorialTranslation(tutorial.pathId, language);
    assert.ok(text?.title.trim() && text.intro.trim(), language);
    assert.match(text.intro, fiction, language);
    assert.deepEqual(Object.keys(text.steps).sort(), tutorial.steps.map(({ id }) => id).sort(), language);
    for (const source of tutorial.steps) {
      const step = text.steps[source.id];
      assert.ok(step.title.trim() && step.file.trim() && step.code.trim() && step.check.trim() && step.aiPrompt.trim(),
        `${language}/${source.id}: every learner-facing field`);
      assert.equal(step.explanation.length, source.explanation.length, `${language}/${source.id}: paragraphs`);
      assert.ok(step.explanation.every((paragraph) => paragraph.trim()), `${language}/${source.id}: explanations`);
      assert.doesNotMatch(JSON.stringify(step), /\uFFFD|\p{L}\?\p{L}/u, `${language}/${source.id}: encoding`);
      if (language !== 'en') {
        for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
          assert.notEqual(step[field], source[field], `${language}/${source.id}: translated ${field}`);
        }
      }
    }

    const brief = text.steps['content-brief'];
    assert.match(brief.code, /Cedar Bakery/);
    assert.match(brief.code, /08:00-14:00/);
    assert.match(brief.code, fiction);
    const example = text.steps['content-draft'].code.split('\n')[1];
    const words = example.trim().split(/\s+/).length;
    assert.ok(words >= 40 && words <= 60, `${language}: example has ${words} words`);
    assert.match(example, /08:00/);
    assert.match(example, /14:00/);
    const visual = text.steps['content-visual'];
    for (const interval of ['0-10', '10-20', '20-30']) assert.ok(visual.code.includes(interval), `${language}: ${interval}`);
    assert.match(text.steps['content-check'].code, /08:00-14:00/);
    assert.match(text.steps['content-review'].code, blocked);
    assert.match(text.steps['content-review'].code, noPublish);
    assert.match(text.steps['content-next-steps'].code, noResults);
  }
  assert.ok(localized.hasLocalizedTutorialPages(tutorial));
  const [downloads] = loadWebModules(['lib/starter-pack-downloads.ts']);
  for (const language of ['en', 'fr', 'de', 'es']) {
    const suffix = language === 'en' ? '' : `-${language}`;
    assert.equal(downloads.starterPackDownloadFile('content-creator-kit', 'downloads/content-creator-kit.md', language),
      `downloads/content-creator-kit${suffix}.md`, `${language}: creator kit follows selected language`);
    assert.equal(downloads.starterPackDownloadFile('ai-video-business-kit', 'downloads/ai-video-business-kit.md', language),
      `downloads/ai-video-business-kit${suffix}.md`, `${language}: business-video kit still follows selected language`);
    assert.equal(downloads.starterPackDownloadFile('freelance-client-discovery-kit', 'downloads/freelance-client-discovery-kit.md', language),
      'downloads/freelance-client-discovery-kit.md', `${language}: untranslated kit remains English`);
  }
  const source = await readFile(new URL('../lib/content-creation-tutorial.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|fetch\(|upsert|applyProgress|persist\(/, 'lessons do not mutate progress or publish');
});

test('content creator kit editions retain complete prompts and private-practice safeguards', async () => {
  const editions = {
    en: {
      placeholders: ['[TOPIC]', '[AUDIENCE]', '[N]', '[POST]', '[PURPOSE]', '[TEXT]'],
      privacy: /fictional Cedar Bakery exercise private/i,
      approval: /no real owner to approve publication/i,
      results: /no result to report/i,
      rights: /copy other people's work or imitate a real person's voice without permission/i,
      disclosure: /AI helped, if your audience or platform expects it/i,
      privatePrompt: /Keep private information out of every prompt/i,
      storyboard: /storyboard is 30 seconds in three 10-second scenes; it is a plan, not a finished video/i
    },
    fr: {
      placeholders: ['[SUJET]', '[PUBLIC]', '[N]', '[PUBLICATION]', '[OBJECTIF]', '[TEXTE]'],
      privacy: /exercice fictif de Cedar Bakery privé/i,
      approval: /aucun propriétaire réel ne peut approuver sa publication/i,
      results: /aucun résultat n’est à rapporter/i,
      rights: /travail d’autrui.*voix d’une personne réelle sans autorisation/i,
      disclosure: /IA vous a aidé si votre public ou la plateforme l’attend/i,
      privatePrompt: /aucune information privée dans les prompts/i,
      storyboard: /storyboard facultatif[\s\S]*30 secondes en trois scènes de 10 secondes[\s\S]*pas une vidéo terminée/i
    },
    de: {
      placeholders: ['[THEMA]', '[ZIELGRUPPE]', '[N]', '[BEITRAG]', '[ZWECK]', '[TEXT]'],
      privacy: /fiktive Übung mit Cedar Bakery privat/i,
      approval: /keinen echten Inhaber, der eine Veröffentlichung freigeben kann/i,
      results: /keine Ergebnisse zu melden/i,
      rights: /Werke anderer nur mit Erlaubnis.*Stimme einer realen Person nicht ohne Erlaubnis/i,
      disclosure: /KI geholfen hat, wenn Ihre Zielgruppe oder die Plattform dies erwartet/i,
      privatePrompt: /keinen Prompt private Informationen/i,
      storyboard: /optionale Storyboard[\s\S]*30 Sekunden in drei Szenen zu je 10 Sekunden[\s\S]*kein fertiges Video/i
    },
    es: {
      placeholders: ['[TEMA]', '[PÚBLICO]', '[N]', '[PUBLICACIÓN]', '[PROPÓSITO]', '[TEXTO]'],
      privacy: /privado el ejercicio ficticio de Cedar Bakery/i,
      approval: /no hay un propietario real que pueda aprobar su publicación/i,
      results: /ni resultados que comunicar/i,
      rights: /trabajo de otras personas.*voz de una persona real sin permiso/i,
      disclosure: /IA si tu público o la plataforma lo espera/i,
      privatePrompt: /información privada en ningún prompt/i,
      storyboard: /storyboard opcional[\s\S]*30 segundos y tiene tres escenas de 10 segundos[\s\S]*no un vídeo terminado/i
    }
  };
  const english = await readFile(new URL('../../downloads/content-creator-kit.md', import.meta.url), 'utf8');
  for (const [language, checks] of Object.entries(editions)) {
    const suffix = language === 'en' ? '' : `-${language}`;
    const file = `content-creator-kit${suffix}.md`;
    const text = await readFile(new URL(`../../downloads/${file}`, import.meta.url), 'utf8');
    assert.equal(text, await readFile(new URL(`../public/downloads/${file}`, import.meta.url), 'utf8'),
      `${language}: public and source copies match`);
    if (language !== 'en') assert.notEqual(text, english, `${language}: translated`);
    assert.doesNotMatch(text, /\uFFFD|\p{L}\?\p{L}/u, `${language}: intact encoding`);

    const sections = text.split(/^## /m).slice(1);
    assert.equal(sections.length, 5, `${language}: all five sections`);
    assert.equal((sections[0].match(/^\d\./gm) ?? []).length, 4, `${language}: four-step loop`);
    const prompts = sections[1].split('\n').filter((line) => /^- \*\*/.test(line));
    assert.equal(prompts.length, 5, `${language}: all prompt templates`);
    assert.match(prompts[0], /\b10\b.*\b3\b/, `${language}: ideas`);
    assert.match(prompts[1], /\b45\b.*\b5\b.*\b3\b/, `${language}: video script`);
    assert.match(prompts[2], /\b3\b.*\[N\]/, `${language}: caption options`);
    assert.match(prompts[4], /\b5\b/, `${language}: repurposed list`);
    for (const placeholder of checks.placeholders) {
      assert.ok(sections[1].includes(placeholder), `${language}: ${placeholder}`);
    }
    assert.match(sections[1], checks.storyboard, `${language}: storyboard is not an export`);
    assert.equal((sections[2].match(/^- /gm) ?? []).length, 3, `${language}: all workflows`);
    for (const safeguard of [checks.privacy, checks.approval, checks.results, checks.rights, checks.disclosure, checks.privatePrompt]) {
      assert.match(sections[3], safeguard, `${language}: ${safeguard}`);
    }
    assert.match(sections[3], /licen|Lizenz/i, `${language}: licence check`);
    assert.match(sections[4], /\b30\b/, `${language}: first 30 minutes`);
    assert.equal((sections[4].match(/^\d\./gm) ?? []).length, 3, `${language}: first steps`);
    assert.match(sections[4], /\b10\b/, `${language}: generate 10 ideas`);
  }
});

test('privacy and fact-checking tutorial keeps stable progress, exact facts and safeguards in every language', async () => {
  const tutorial = registry.getTutorialForPath('ai-privacy-fact-checking');
  assert.ok(tutorial);
  assert.equal(tutorial.href, '/tutorials/ai-privacy-fact-checking');
  assert.equal(tutorial.time, '60 minutes');
  assert.equal(tutorial.starterPackId, 'ai-privacy-fact-checking-kit');
  assert.equal(tutorial.starterPackLabel, 'Open the privacy and fact-checking kit');
  assert.deepEqual(tutorial.steps.map(({ id }) => id), [
    'privacy-map', 'privacy-redact', 'claims-list',
    'claims-sources', 'claims-verdicts', 'privacy-review'
  ]);
  assert.equal(registry.tutorialStorageKey(tutorial.pathId), 'desofec:tutorial:ai-privacy-fact-checking');

  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  const path = paths.find(({ id }) => id === tutorial.pathId);
  assert.equal(path.goal, 'research-ai');
  assert.deepEqual(path.steps, [
    'Spot and redact private details before prompting',
    'Split AI answers into checkable claims',
    'Check each claim against a real source',
    'Correct claims and record an honest review'
  ]);

  const words = {
    en: { fiction: /fictional/i, privateWord: 'PRIVATE', contradicted: 'CONTRADICTED', supported: 'SUPPORTED', needsSource: 'NEEDS SOURCE',
      notFound: 'CITATION NOT FOUND', unverified: 'UNVERIFIED', blocked: 'BLOCKED', notCollected: 'NOT COLLECTED', noSend: /do not send or publish/i, legal: /not legal advice/i,
      room: /room B/i, health: /medical appointment/i, placeholders: ['[PERSON A]', '[EMAIL]', '[PHONE]'] },
    fr: { fiction: /fictive/i, privateWord: 'PRIVÉ', contradicted: 'CONTREDITE', supported: 'CONFIRMÉE', needsSource: 'SOURCE REQUISE',
      notFound: 'CITATION INTROUVABLE', unverified: 'NON VÉRIFIÉE', blocked: 'BLOQUÉE', notCollected: 'NON RECUEILLIS', noSend: /ne pas envoyer ni publier/i, legal: /avis juridique/i,
      room: /salle B/i, health: /rendez-vous médical/i, placeholders: ['[PERSONNE A]', '[E-MAIL]', '[TÉLÉPHONE]'] },
    de: { fiction: /fiktiv/i, privateWord: 'PRIVAT', contradicted: 'WIDERLEGT', supported: 'BELEGT', needsSource: 'QUELLE FEHLT',
      notFound: 'ZITAT NICHT GEFUNDEN', unverified: 'UNBESTÄTIGT', blocked: 'BLOCKIERT', notCollected: 'NICHT ERHOBEN', noSend: /nicht versenden oder veröffentlichen/i, legal: /keine Rechtsberatung/i,
      room: /raum B/i, health: /Arzttermin/i, placeholders: ['[PERSON A]', '[E-MAIL]', '[TELEFON]'] },
    es: { fiction: /ficticia/i, privateWord: 'PRIVADO', contradicted: 'CONTRADICHA', supported: 'RESPALDADA', needsSource: 'FALTA FUENTE',
      notFound: 'CITA NO ENCONTRADA', unverified: 'NO VERIFICADA', blocked: 'BLOQUEADA', notCollected: 'NO RECOPILADOS', noSend: /no enviar ni publicar/i, legal: /asesoramiento jurídico/i,
      room: /sala B/i, health: /cita médica/i, placeholders: ['[PERSONA A]', '[CORREO]', '[TELÉFONO]'] }
  };
  for (const [language, w] of Object.entries(words)) {
    const text = language === 'en'
      ? { title: tutorial.title, intro: tutorial.intro, steps: Object.fromEntries(tutorial.steps.map((step) => [step.id, step])) }
      : translations.getTutorialTranslation(tutorial.pathId, language);
    assert.ok(text?.title.trim() && text.intro.trim(), language);
    assert.match(text.intro, w.fiction, language);
    assert.deepEqual(Object.keys(text.steps).sort(), tutorial.steps.map(({ id }) => id).sort(), language);
    for (const source of tutorial.steps) {
      const step = text.steps[source.id];
      assert.ok(step.title.trim() && step.file.trim() && step.code.trim() && step.check.trim() && step.aiPrompt.trim(),
        `${language}/${source.id}: every learner-facing field`);
      assert.equal(step.explanation.length, source.explanation.length, `${language}/${source.id}: paragraphs`);
      assert.doesNotMatch(JSON.stringify(step), /\uFFFD|\p{L}\?\p{L}/u, `${language}/${source.id}: encoding`);
      if (language !== 'en') {
        for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
          assert.notEqual(step[field], source[field], `${language}/${source.id}: translated ${field}`);
        }
      }
    }

    const map = text.steps['privacy-map'].code;
    for (const fact of ['Alex Example', 'alex@example.test', '+00 0000 0000', '2030-03-14', '18:00']) assert.ok(map.includes(fact), `${language}: ${fact}`);
    assert.equal(map.split(w.privateWord).length - 1, 4, `${language}: four private items`);
    const redacted = text.steps['privacy-redact'].code.split('\n')[1];
    for (const secret of ['Alex Example', 'alex@example.test', '+00 0000 0000']) assert.ok(!redacted.includes(secret), `${language}: ${secret} redacted`);
    assert.ok(redacted.includes('2030-03-14') && redacted.includes('18:00'), `${language}: task facts kept`);
    assert.match(redacted, w.room, `${language}: room kept`);
    assert.doesNotMatch(redacted, w.health, `${language}: health detail removed`);
    for (const placeholder of w.placeholders) assert.ok(redacted.includes(placeholder), `${language}: ${placeholder}`);
    assert.match(text.steps['privacy-redact'].code, /0 (?:of|sur|von|de) 4/);

    const claims = text.steps['claims-list'].code;
    for (const id of ['C1', 'C2', 'C3', 'C4', 'C5', 'S1', '50', '1952', 'City Library Report 2029']) assert.ok(claims.includes(id), `${language}: ${id}`);
    for (const [id, fact] of [['C1', '7'], ['C2', '10:00-14:00'], ['C4', '50'], ['C5', '1952'], ['S1', 'City Library Report 2029']]) {
      const line = claims.split('\n').find((entry) => entry.startsWith(`${id} `));
      assert.ok(line?.includes(fact), `${language}: ${id} retains ${fact}`);
    }
    const check = text.steps['claims-sources'].code;
    assert.equal(check.split(w.contradicted).length - 1, 2, `${language}: two contradicted`);
    assert.equal(check.split(w.supported).length - 1, 2, `${language}: two supported`);
    assert.equal(check.split(w.needsSource).length - 1, 1, `${language}: one needs source`);
    for (const [id, verdict] of [
      ['C1', w.contradicted], ['C2', w.supported], ['C3', w.supported],
      ['C4', w.contradicted], ['C5', w.needsSource], ['S1', w.notFound]
    ]) {
      const line = check.split('\n').find((entry) => entry.startsWith(`${id} `));
      assert.ok(line?.includes(verdict), `${language}: ${id} is ${verdict}`);
    }
    assert.ok(check.split('\n').find((entry) => entry.startsWith('C4 '))?.includes('12'), `${language}: C4 evidence is 12`);
    assert.ok(check.includes(w.notFound) && check.includes('09:00-18:00') && check.includes('10:00-14:00') && check.includes('12'), language);
    const corrected = text.steps['claims-verdicts'].code.split('\n\n')[0];
    assert.ok(corrected.includes('12') && !corrected.includes('50') && !corrected.includes('1952') && !corrected.includes('City Library Report'),
      `${language}: corrected summary has no contradicted, unverified or unfound claims`);
    assert.ok(text.steps['claims-verdicts'].code.includes(w.unverified), language);
    const review = text.steps['privacy-review'];
    assert.ok(review.code.includes(w.blocked) && review.code.includes(w.notCollected), language);
    assert.match(review.code, w.noSend, language);
    assert.match(review.explanation.join(' '), w.legal, language);
  }
  assert.ok(localized.hasLocalizedTutorialPages(tutorial));
  for (const language of ['en', ...localized.localizedTutorialLanguages]) {
    const text = language === 'en' ? tutorial : translations.getTutorialTranslation(tutorial.pathId, language);
    const metadata = search.tutorialSearchText(tutorial.pathId, language, { title: text.title, description: text.intro });
    assert.ok(`${metadata.title} | Desofec AI Studio`.length < 70, `${language}: title length`);
    assert.ok(metadata.description.length >= 25 && metadata.description.length <= 160, `${language}: description length`);
  }
  const [downloads] = loadWebModules(['lib/starter-pack-downloads.ts']);
  for (const language of ['en', 'fr', 'de', 'es']) {
    const suffix = language === 'en' ? '' : `-${language}`;
    assert.equal(downloads.starterPackDownloadFile('ai-privacy-fact-checking-kit', 'downloads/ai-privacy-fact-checking-kit.md', language),
      `downloads/ai-privacy-fact-checking-kit${suffix}.md`, `${language}: privacy kit follows selected language`);
    assert.equal(downloads.starterPackDownloadFile('content-creator-kit', 'downloads/content-creator-kit.md', language),
      `downloads/content-creator-kit${suffix}.md`, `${language}: creator kit still follows selected language`);
    assert.equal(downloads.starterPackDownloadFile('freelance-client-discovery-kit', 'downloads/freelance-client-discovery-kit.md', language),
      'downloads/freelance-client-discovery-kit.md', `${language}: untranslated kit remains English`);
  }
  const source = await readFile(new URL('../lib/ai-privacy-fact-checking-tutorial.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|fetch\(|upsert|applyProgress|persist\(/, 'lessons do not mutate progress or publish');
});

test('privacy and fact-checking kit editions keep exercise facts and safeguards', async () => {
  const editions = {
    en: [/PRIVATE/, /CITATION NOT FOUND/, /UNVERIFIED/, /BLOCKED/, /NOT COLLECTED/, /not legal advice/i, /\[PERSON A\]/],
    fr: [/PRIVÉ/, /CITATION INTROUVABLE/, /NON VÉRIFIÉE/, /BLOQUÉE/, /NON RECUEILLIS/, /pas un avis juridique/i, /\[PERSONNE A\]/],
    de: [/PRIVAT/, /ZITAT NICHT GEFUNDEN/, /UNBESTÄTIGT/, /BLOCKIERT/, /NICHT ERHOBEN/, /keine Rechtsberatung/i, /\[PERSON A\]/],
    es: [/PRIVADO/, /CITA NO ENCONTRADA/, /NO VERIFICADA/, /BLOQUEADA/, /NO RECOPILADOS/, /no asesoramiento jurídico/i, /\[PERSONA A\]/]
  };
  const english = await readFile(new URL('../../downloads/ai-privacy-fact-checking-kit.md', import.meta.url), 'utf8');
  for (const [language, safeguards] of Object.entries(editions)) {
    const file = `ai-privacy-fact-checking-kit${language === 'en' ? '' : `-${language}`}.md`;
    const text = await readFile(new URL(`../../downloads/${file}`, import.meta.url), 'utf8');
    assert.equal(text, await readFile(new URL(`../public/downloads/${file}`, import.meta.url), 'utf8'), `${language}: public copy matches`);
    if (language !== 'en') assert.notEqual(text, english, `${language}: translated`);
    assert.doesNotMatch(text, /\uFFFD|\p{L}\?\p{L}/u, `${language}: intact encoding`);
    assert.equal(text.split(/^## /m).length - 1, 5, `${language}: five sections`);
    for (const fact of ['alex@example.test', '2030-03-14', '18:00', '09:00-18:00', '10:00-14:00', '12', '50', '1952',
      'City Library Report 2029', 'Riverside Library', 'C1', 'S1']) {
      assert.ok(text.includes(fact), `${language}: ${fact}`);
    }
    for (const safeguard of safeguards) assert.match(text, safeguard, `${language}: ${safeguard}`);
  }
});

test('a future path without a tutorial still finds relevant related tutorials', async () => {
  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  const base = paths.find(({ id }) => id === 'content-creation');
  const missing = { ...base, id: 'future-content-path' };
  assert.equal(registry.getTutorialForPath(missing.id), undefined);
  const related = registry.getRelatedPathTutorials(missing, [...paths, missing]);
  assert.ok(related.some(({ path }) => path.id === 'content-creation'));
  assert.ok(related.some(({ path }) => path.id === 'ai-video-creation'));
  assert.ok(related.every(({ path, tutorial }) => path.id !== missing.id && path.goal === missing.goal && tutorial.pathId === path.id));
  const page = await readFile(new URL('../app/paths/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /tutorial \? \[\] : getRelatedPathTutorials\(path, catalog\.paths\)/);
  assert.match(page, /This path does not yet have its own tutorial\./);
});

test('canonical and reciprocal alternates point to real language versions', () => {
  const socialLocales = { en: 'en_US', fr: 'fr_FR', de: 'de_DE', es: 'es_ES' };
  for (const tutorial of localized.localizedTutorials) {
    const versions = localized.tutorialLanguageVersions(tutorial);
    assert.deepEqual(versions.map(({ code }) => code), ['en', 'fr', 'de', 'es']);
    const expected = Object.fromEntries(versions.map(({ code, href }) => [code, href]));
    expected['x-default'] = tutorial.href;
    for (const { code, href } of versions) {
      assert.equal(href, code === 'en' ? tutorial.href : `/${code}${tutorial.href}`);
      const alternate = localized.tutorialAlternates(tutorial, code);
      assert.equal(alternate.canonical, href);
      assert.deepEqual(alternate.languages, expected);
      const social = localized.tutorialSocialLocales(tutorial, code);
      assert.equal(social.locale, socialLocales[code]);
      assert.deepEqual(social.alternateLocale, versions
        .filter((version) => version.code !== code)
        .map((version) => socialLocales[version.code]));
      if (code !== 'en') {
        const metadata = localized.localizedTutorialMetadata(tutorial, code);
        const text = translations.getTutorialTranslation(tutorial.pathId, code);
        const snippet = search.tutorialSearchText(tutorial.pathId, code, { title: text.title, description: text.intro });
        assert.equal(metadata.title, snippet.title);
        assert.equal(metadata.description, snippet.description);
        assert.equal(metadata.openGraph.url, href);
        assert.equal(metadata.openGraph.title, text.title);
        assert.equal(metadata.openGraph.description, snippet.description);
        assert.equal(metadata.openGraph.locale, social.locale);
        assert.deepEqual(metadata.openGraph.alternateLocale, social.alternateLocale);
        assert.equal(metadata.twitter.title, text.title);
        assert.equal(metadata.twitter.description, snippet.description);
        assert.deepEqual(metadata.alternates, alternate);
      }
    }
  }
  const untranslated = registry.tutorials.find(({ pathId }) => pathId === 'shopify-guide');
  assert.deepEqual(localized.tutorialLanguageVersions(untranslated), []);
  assert.equal(localized.tutorialSocialLocales(untranslated, 'en'), undefined);
  assert.deepEqual(localized.tutorialAlternates(untranslated, 'en'), { canonical: untranslated.href });
  assert.throws(() => localized.tutorialAlternates(untranslated, 'fr'), /Missing localized tutorial/);
});

test('tutorial search snippets fit search results without losing practice safeguards', () => {
  const assertSnippet = (id, language, source) => {
    const snippet = search.tutorialSearchText(id, language, source);
    assert.ok(`${snippet.title} | Desofec AI Studio`.length < 70, `${id}/${language}: search title`);
    assert.ok(snippet.description.length >= 25 && snippet.description.length <= 160, `${id}/${language}: search description`);
    return snippet.description;
  };
  for (const tutorial of registry.tutorials.filter(({ href }) => href.startsWith('/tutorials/'))) {
    assertSnippet(tutorial.pathId, 'en', { title: tutorial.title, description: tutorial.intro });
  }
  for (const tutorial of localized.localizedTutorials) {
    for (const language of localized.localizedTutorialLanguages) {
      const text = translations.getTutorialTranslation(tutorial.pathId, language);
      assertSnippet(tutorial.pathId, language, { title: text.title, description: text.intro });
    }
  }

  const content = registry.getTutorialForPath('content-creation');
  for (const [language, fiction, privacy, noPublication] of [
    ['en', /fictional bakery/i, /private/i, /do not publish/i],
    ['fr', /boulangerie fictive/i, /privé/i, /sans publier/i],
    ['de', /fiktive Bäckerei/i, /privat/i, /nicht/i],
    ['es', /panadería ficticia/i, /privado/i, /no publiques/i]
  ]) {
    const source = language === 'en' ? content : translations.getTutorialTranslation(content.pathId, language);
    const description = assertSnippet(content.pathId, language, { title: source.title, description: source.intro });
    for (const safeguard of [fiction, privacy, noPublication]) assert.match(description, safeguard, language);
  }

  const video = registry.tutorials.find(({ pathId }) => pathId === 'ai-video-business');
  for (const [language, fiction, privacy, duration, noPublication] of [
    ['en', /fictional bakery/i, /privat/i, /15-30/, /do not publish/i],
    ['fr', /boulangerie fictive/i, /privé/i, /15 à 30/, /sans publication/i],
    ['de', /fiktive Bäckerei/i, /privat/i, /15- bis 30/, /nicht veröffentlichen/i],
    ['es', /panadería ficticia/i, /privado/i, /15 a 30/, /sin publicar/i]
  ]) {
    const source = language === 'en' ? video : translations.getTutorialTranslation(video.pathId, language);
    const description = assertSnippet(video.pathId, language, { title: source.title, description: source.intro });
    assert.match(description, fiction, language);
    assert.match(description, privacy, language);
    assert.match(description, duration, language);
    assert.match(description, noPublication, language);
    assert.match(description, /storyboard/i, language);
  }

  for (const [id, language, safeguard] of [
    ['ai-online-retail', 'en', /fictional.*no live store, payments or purchases/i],
    ['ai-online-retail', 'fr', /fictives.*sans boutique, paiement ni achat réel/i],
    ['ai-online-retail', 'de', /fiktiven.*keine Zahlungen oder Käufe/i],
    ['ai-online-retail', 'es', /ficticios.*sin tienda, pagos ni compras reales/i],
    ['ai-automation-services', 'en', /fictional.*no live sending/i],
    ['ai-automation-services', 'fr', /fictives.*sans envoi réel/i],
    ['ai-automation-services', 'de', /fiktiven.*ohne echten Versand/i],
    ['ai-automation-services', 'es', /ficticios.*sin envíos reales/i],
    ['ai-marketplace-model', 'en', /paper or spreadsheet prototype, not a live marketplace or payment system/i],
    ['ai-marketplace-model', 'fr', /papier ou tableur, sans marketplace ni système de paiement réel/i],
    ['ai-marketplace-model', 'de', /Papier oder in Tabellen, ohne echten Marktplatz oder Zahlungsverkehr/i],
    ['ai-marketplace-model', 'es', /papel u hoja de cálculo, sin mercado ni sistema de pagos activo/i],
    ['ai-logistics-services', 'en', /fictional.*no goods, addresses or real shipments/i],
    ['ai-logistics-services', 'fr', /fictifs, sans traiter de marchandises, d’adresses ni d’envois réels/i],
    ['ai-logistics-services', 'de', /fiktiven.*keine echten Waren, Adressen oder Sendungen/i],
    ['ai-logistics-services', 'es', /ficticios.*no se procesan bienes, direcciones ni envíos reales/i],
    ['ai-cad-services', 'en', /non-functional.*no manufacturing or engineering approval/i],
    ['ai-cad-services', 'fr', /non fonctionnel.*sans fabrication ni approbation/i],
    ['ai-cad-services', 'de', /nicht funktionsfähiges.*keine Fertigung oder technische Freigabe/i],
    ['ai-cad-services', 'es', /no funcional.*sin fabricación ni aprobación/i],
    ['micro-saas-validation', 'en', /local-only.*no paid AI, billing or production launch/i],
    ['micro-saas-validation', 'fr', /local.*pas d’IA payante, de facturation ni de lancement en production/i],
    ['micro-saas-validation', 'de', /lokalen.*keine kostenpflichtige KI, Abrechnung oder Produktionsfreigabe/i],
    ['micro-saas-validation', 'es', /local.*sin IA de pago, facturación ni lanzamiento en producción/i],
    ['ai-education-services', 'en', /no accreditation or guaranteed learning outcome/i],
    ['ai-education-services', 'fr', /aucune accréditation ni aucun apprentissage garanti/i],
    ['ai-education-services', 'de', /keine Akkreditierung und kein garantierter Lernerfolg/i],
    ['ai-education-services', 'es', /sin acreditación ni resultados de aprendizaje garantizados/i]
  ]) {
    const tutorial = registry.tutorials.find(({ pathId }) => pathId === id);
    const source = language === 'en' ? tutorial : translations.getTutorialTranslation(id, language);
    assert.match(assertSnippet(id, language, { title: source.title, description: source.intro }), safeguard, `${id}/${language}`);
  }
});

test('language-prefixed navigation keeps existing routes recognizable', () => {
  assert.equal(i18n.languageFromPath('/fr/tutorials/ai-video-business'), 'fr');
  assert.equal(i18n.languageFromPath('/de/projects/ai-assisted-coding/build'), 'de');
  assert.equal(i18n.languageFromPath('/tutorials/ai-video-business'), undefined);
  assert.equal(i18n.languageFromPath('/en/tutorials/ai-video-business'), undefined);
  assert.equal(i18n.withoutLanguagePrefix('/es/tutorials/ai-video-business'), '/tutorials/ai-video-business');
  assert.equal(i18n.withoutLanguagePrefix('/tutorials/ai-video-business'), '/tutorials/ai-video-business');
});

test('tutorial links and explicit routes use the matching language without affecting other pages', () => {
  const paths = localized.localizedTutorials.map((tutorial) => tutorial.href);
  for (const tutorial of localized.localizedTutorials) {
    assert.equal(i18n.tutorialRouteLanguage(tutorial.href, paths), 'en');
    assert.equal(i18n.localizedTutorialHref(tutorial.href, 'en', paths), tutorial.href);
    for (const language of localized.localizedTutorialLanguages) {
      const localizedPath = `/${language}${tutorial.href}`;
      assert.equal(i18n.tutorialRouteLanguage(localizedPath, paths), language);
      assert.equal(i18n.localizedTutorialHref(tutorial.href, language, paths), localizedPath);
      assert.equal(
        i18n.localizedTutorialHref(`${tutorial.href}?source=practice#lesson`, language, paths),
        `${localizedPath}?source=practice#lesson`
      );
    }
  }
  for (const path of ['/tools', '/tutorials', '/tutorials/shopify-guide', '/tutorials/ai-spreadsheets']) {
    assert.equal(i18n.tutorialRouteLanguage(path, paths), undefined, path);
    assert.equal(i18n.localizedTutorialHref(path, 'fr', paths), path);
  }
  assert.equal(i18n.localizedTutorialHref('https://example.com/tutorials/ai-video-business', 'fr', paths),
    'https://example.com/tutorials/ai-video-business');
});

test('language selection cannot follow an unrelated cached tutorial', () => {
  const cachedPaths = [
    '/es/projects/ai-assisted-coding/build',
    '/es/tutorials/ai-video-business'
  ];
  assert.equal(i18n.tutorialLanguageDestination('/tools', 'es', cachedPaths), undefined);
  assert.equal(i18n.tutorialLanguageDestination('/tutorials/shopify-guide', 'es', cachedPaths), undefined);
  assert.equal(
    i18n.tutorialLanguageDestination('/fr/projects/ai-assisted-coding/build', 'es', cachedPaths),
    '/es/projects/ai-assisted-coding/build'
  );
  assert.equal(
    i18n.tutorialLanguageDestination('/tutorials/ai-video-business', 'es', cachedPaths),
    '/es/tutorials/ai-video-business'
  );
  assert.equal(
    i18n.tutorialLanguageDestination('/de/projects/ai-assisted-coding/build', 'en', [
      '/projects/ai-assisted-coding/build'
    ]),
    '/projects/ai-assisted-coding/build'
  );
});

test('English tutorial navigation remembers its language for linked kits', async () => {
  const source = await readFile(new URL('../components/tutorial-language-nav.tsx', import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true
    }
  }).outputText;
  const testModule = { exports: {} };
  let routeLanguage = 'en';
  let savedLanguage = 'fr';
  const calls = [];
  const jsx = (type, props) => ({ type, props });
  const imports = {
    react: { useEffect: (effect) => effect() },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/link': { __esModule: true, default: 'a' },
    '@/components/language': {
      useLanguage: () => routeLanguage,
      useT: () => (key) => key,
      setLanguage: (language) => { savedLanguage = language; calls.push(language); }
    }
  };
  runInNewContext(output, {
    module: testModule, exports: testModule.exports,
    require: (name) => {
      assert.ok(name in imports, `unexpected import: ${name}`);
      return imports[name];
    }
  });
  const versions = [{ code: 'en', label: 'English', href: '/tutorials/example' },
    { code: 'fr', label: 'Français', href: '/fr/tutorials/example' }];
  const english = testModule.exports.TutorialLanguageNav({ versions });
  assert.equal(savedLanguage, 'en');
  assert.deepEqual(calls, ['en']);

  routeLanguage = 'fr';
  savedLanguage = 'fr';
  calls.length = 0;
  const french = testModule.exports.TutorialLanguageNav({ versions });
  assert.equal(savedLanguage, 'fr', 'the French route is not overridden');
  assert.deepEqual(calls, []);
  for (const language of ['de', 'es']) {
    routeLanguage = language;
    savedLanguage = language;
    testModule.exports.TutorialLanguageNav({ versions });
    assert.equal(savedLanguage, language, `${language} is not overridden`);
    assert.deepEqual(calls, []);
  }
  english.props.children[1][1].props.onClick();
  assert.equal(savedLanguage, 'fr', 'language links still save the selected language');
  french.props.children[1][0].props.onClick();
  assert.equal(savedLanguage, 'en', 'switching back to English still saves the selection');
});

test('tutorial entry points use the shared language-aware link', async () => {
  const entryPoints = [
    ['../app/page.tsx', /<TutorialLink href=\{tutorial\.href\}/],
    ['../app/start-here/page.tsx', /<TutorialLink[^>]*href="\/tutorials\/ai-content-services"/],
    ['../app/paths/[id]/page.tsx', /<TutorialLink[^>]*href=\{tutorial\.href\}/],
    ['../app/tools/[id]/page.tsx', /<TutorialLink[^>]*href=\{guide\.href\}/],
    ['../app/business-launchpad/page.tsx', /<TutorialLink[^>]*href=\{tutorial\.href\}/],
    ['../app/business-launchpad/proposal-builder/page.tsx', /<TutorialLink[^>]*href="\/tutorials\/ai-automation-services"/],
    ['../app/projects/first-app/page.tsx', /<TutorialLink[^>]*href="\/projects\/first-app\/build"/],
    ['../app/projects/coding-foundations/build/page.tsx', /<TutorialLink[^>]*href="\/projects\/first-app\/build"/],
    ['../app/projects/ai-assisted-coding/build/page.tsx', /<TutorialLink[^>]*href="\/projects\/coding-foundations\/build"/],
    ['../components/tutorial-list.tsx', /<TutorialLink[^>]*href=\{tutorial\.href\}/],
    ['../components/first-project-chooser.tsx', /<TutorialLink[^>]*href=\{`\/tutorials\/\$\{selected\}`\}/],
    ['../components/commerce-practice-lab.tsx', /<TutorialLink[^>]*href=\{`\/tutorials\/\$\{trackPaths\[track\]\}`\}/],
    ['../components/pilot-project-workspace.tsx', /<TutorialLink[^>]*href=\{`\/tutorials\/\$\{saved\.pathId\}`\}/],
    ['../components/idea-planner.tsx', /<TutorialLink[^>]*href=\{path\.tutorialHref\}/],
    ['../components/continue-learning.tsx', /<TutorialLink[^>]*href=\{finished \? '\/paths' : item\?\.href/],
    ['../components/progress-dashboard.tsx', /<TutorialLink[^>]*href=\{item\.href\}/],
    ['../components/workspace-detail.tsx', /<TutorialLink href=\{item\.href\}/]
  ];
  for (const [file, link] of entryPoints) {
    assert.match(await readFile(new URL(file, import.meta.url), 'utf8'), link, file);
  }
  const discovery = await readFile(new URL('../components/client-discovery-builder.tsx', import.meta.url), 'utf8');
  assert.match(discovery, /<TutorialLink[^>]*href="\/tutorials\/freelance-client-discovery" onNavigate=\{\(event\) => \{\s*if \(!discard\(\)\) event\.preventDefault\(\);/);
});

test('localized pages reuse original tutorials and the existing sitemap', async () => {
  const hosted = await readFile(new URL('../components/localized-hosted-tutorial.tsx', import.meta.url), 'utf8');
  const legacy = await readFile(new URL('../components/localized-legacy-tutorial.tsx', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  const language = await readFile(new URL('../components/language.tsx', import.meta.url), 'utf8');
  const switcher = await readFile(new URL('../components/language-switcher.tsx', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const link = await readFile(new URL('../components/tutorial-link.tsx', import.meta.url), 'utf8');
  assert.match(hosted, /<TutorialPage params=\{Promise\.resolve\(\{ id \}\)\} \/>/);
  for (const component of ['AiAssistedCodingTutorialPage', 'CodingFoundationsTutorialPage', 'TaskTrackerTutorialPage']) {
    assert.ok(legacy.includes(`<${component} />`), component);
  }
  assert.match(hosted, /notFound\(\)/);
  assert.match(legacy, /notFound\(\)/);
  assert.match(sitemap, /localizedTutorials\.flatMap/);
  assert.match(sitemap, /localizedTutorialPath\(tutorial, language\)/);
  assert.match(language, /<div lang=\{language\}>\{children\}<\/div>/);
  assert.match(language, /tutorialRouteLanguage\(window\.location\.pathname, localizedPaths\)/);
  assert.match(layout, /<TutorialPathsProvider paths=\{localizedTutorialPaths\}>/);
  assert.match(link, /const localizedHref = useLocalizedTutorialHref\(href\)/);
  assert.match(link, /<Link \{\.\.\.props\} href=\{localizedHref\}/);
  assert.match(switcher, /tutorialLanguageDestination\(window\.location\.pathname, selected, availablePaths\)/);
  assert.doesNotMatch(hosted + legacy, /tutorialStorageKey|localStorage|applyProgress|persist\(/);
  for (const locale of ['fr', 'de', 'es']) {
    const hostedRoute = await readFile(new URL(`../app/${locale}/tutorials/[id]/page.tsx`, import.meta.url), 'utf8');
    const legacyRoute = await readFile(new URL(`../app/${locale}/projects/[project]/build/page.tsx`, import.meta.url), 'utf8');
    assert.ok(hostedRoute.includes(`language="${locale}"`));
    assert.ok(legacyRoute.includes(`language="${locale}"`));
  }
});
