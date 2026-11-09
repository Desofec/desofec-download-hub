import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
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
