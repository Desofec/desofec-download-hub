import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { loadWebModules } from './load-web-modules.mjs';

const [localized, registry, translations, i18n] = loadWebModules([
  'lib/localized-tutorials.ts',
  'lib/tutorials.ts',
  'lib/tutorial-translations.ts',
  'lib/i18n.ts'
]);

test('only public tutorials with complete lesson translations get localized pages', () => {
  const { localizedTutorials, hasLocalizedTutorialPages, localizedTutorialLanguages } = localized;
  const ids = new Set(localizedTutorials.map((tutorial) => tutorial.pathId));
  for (const id of ['ai-assisted-coding', 'first-app', 'coding-foundations', 'ai-video-business', 'ai-online-retail']) {
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

test('canonical and reciprocal alternates point to real language versions', () => {
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
      if (code !== 'en') {
        const metadata = localized.localizedTutorialMetadata(tutorial, code);
        const text = translations.getTutorialTranslation(tutorial.pathId, code);
        assert.equal(metadata.title, text.title);
        assert.equal(metadata.description, text.intro);
        assert.equal(metadata.openGraph.url, href);
        assert.equal(metadata.twitter.title, text.title);
        assert.deepEqual(metadata.alternates, alternate);
      }
    }
  }
  const untranslated = registry.tutorials.find(({ pathId }) => pathId === 'shopify-guide');
  assert.deepEqual(localized.tutorialLanguageVersions(untranslated), []);
  assert.deepEqual(localized.tutorialAlternates(untranslated, 'en'), { canonical: untranslated.href });
  assert.throws(() => localized.tutorialAlternates(untranslated, 'fr'), /Missing localized tutorial/);
});

test('language-prefixed navigation keeps existing routes recognizable', () => {
  assert.equal(i18n.languageFromPath('/fr/tutorials/ai-video-business'), 'fr');
  assert.equal(i18n.languageFromPath('/de/projects/ai-assisted-coding/build'), 'de');
  assert.equal(i18n.languageFromPath('/tutorials/ai-video-business'), undefined);
  assert.equal(i18n.languageFromPath('/en/tutorials/ai-video-business'), undefined);
  assert.equal(i18n.withoutLanguagePrefix('/es/tutorials/ai-video-business'), '/tutorials/ai-video-business');
  assert.equal(i18n.withoutLanguagePrefix('/tutorials/ai-video-business'), '/tutorials/ai-video-business');
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

test('localized pages reuse original tutorials and the existing sitemap', async () => {
  const hosted = await readFile(new URL('../components/localized-hosted-tutorial.tsx', import.meta.url), 'utf8');
  const legacy = await readFile(new URL('../components/localized-legacy-tutorial.tsx', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  const language = await readFile(new URL('../components/language.tsx', import.meta.url), 'utf8');
  const switcher = await readFile(new URL('../components/language-switcher.tsx', import.meta.url), 'utf8');
  assert.match(hosted, /<TutorialPage params=\{Promise\.resolve\(\{ id \}\)\} \/>/);
  for (const component of ['AiAssistedCodingTutorialPage', 'CodingFoundationsTutorialPage', 'TaskTrackerTutorialPage']) {
    assert.ok(legacy.includes(`<${component} />`), component);
  }
  assert.match(hosted, /notFound\(\)/);
  assert.match(legacy, /notFound\(\)/);
  assert.match(sitemap, /localizedTutorials\.flatMap/);
  assert.match(sitemap, /localizedTutorialPath\(tutorial, language\)/);
  assert.match(language, /<div lang=\{language\}>\{children\}<\/div>/);
  assert.match(switcher, /tutorialLanguageDestination\(window\.location\.pathname, selected, availablePaths\)/);
  assert.doesNotMatch(hosted + legacy, /tutorialStorageKey|localStorage|applyProgress|persist\(/);
  for (const locale of ['fr', 'de', 'es']) {
    const hostedRoute = await readFile(new URL(`../app/${locale}/tutorials/[id]/page.tsx`, import.meta.url), 'utf8');
    const legacyRoute = await readFile(new URL(`../app/${locale}/projects/[project]/build/page.tsx`, import.meta.url), 'utf8');
    assert.ok(hostedRoute.includes(`language="${locale}"`));
    assert.ok(legacyRoute.includes(`language="${locale}"`));
  }
});
