import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
import { loadWebModules } from './load-web-modules.mjs';

const source = await readFile(new URL('../lib/search-visibility-tutorial.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;
const { searchVisibilitySteps, searchVisibilityResources } = await import(
  `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`
);

test('search-visibility tutorial has six ordered, complete, distinctly keyed steps', () => {
  assert.equal(searchVisibilitySteps.length, 6);
  assert.equal(new Set(searchVisibilitySteps.map((step) => step.id)).size, 6);
  for (const step of searchVisibilitySteps) {
    assert.ok(step.title.trim(), step.id);
    assert.ok(step.explanation.length >= 2, step.id);
    assert.ok(step.check.trim(), step.id);
    assert.ok(step.aiPrompt.trim(), step.id);
    for (const resource of step.resources) {
      const url = new URL(resource.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(['google.com', 'developers.google.com', 'support.google.com', 'bing.com', 'www.bing.com'].includes(url.hostname), resource.url);
    }
  }
  assert.match(searchVisibilitySteps[0].explanation.join(' '), /https:\/\/www\.desofec\.com/);
  assert.match(searchVisibilitySteps[3].explanation.join(' '), /does not guarantee inclusion/);
  assert.match(searchVisibilitySteps[3].explanation.join(' '), /repeated requests do not speed it up/);
  assert.match(searchVisibilitySteps[4].explanation.join(' '), /Microsoft Edge is only a web browser/);
  assert.match(searchVisibilitySteps[5].explanation.join(' '), /no configuration guarantees indexing/);
});

test('Google and Bing lessons link to primary documentation and the Bing portal', () => {
  assert.equal(searchVisibilityResources.googleProperty.url, 'https://support.google.com/webmasters/answer/34592?hl=en');
  assert.equal(searchVisibilityResources.googleSitemap.url, 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap');
  assert.equal(searchVisibilityResources.googleRecrawl.url, 'https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl');
  assert.equal(searchVisibilityResources.bingGettingStarted.url, 'https://www.bing.com/webmasters/help/getting-started-checklist-66a806de?lang=en');
  assert.equal(new URL(searchVisibilityResources.bingPortal.url).hostname, 'www.bing.com');
  assert.ok(searchVisibilitySteps[1].resources.some(({ url }) => url === searchVisibilityResources.googleProperty.url));
  assert.ok(searchVisibilitySteps[2].resources.some(({ url }) => url === searchVisibilityResources.googleSitemap.url));
  assert.ok(searchVisibilitySteps[4].resources.some(({ url }) => url === searchVisibilityResources.bingPortal.url));
});

test('Google and Bing sitemap guidance checks existing submissions in all four languages', () => {
  const [translations] = loadWebModules(['lib/tutorial-translations.ts']);
  const rules = {
    en: {
      existing: /already listed/,
      absent: /only if (?:it is )?absent/,
      pending: /pending/,
      avoidRepeat: /rather than (?:submitting the same sitemap|submitting it) again/,
      reuseSite: /use the existing entry and verify it only if needed/
    },
    fr: {
      existing: /figur(?:e|ent) déjà dans la liste/,
      absent: /seulement (?:si elle est absente|s’il est absent)/,
      pending: /en attente/,
      avoidRepeat: /plutôt que de renvoyer le même sitemap|au lieu de le répéter/,
      reuseSite: /utilisez cette entrée et ne le vérifiez que si nécessaire/
    },
    de: {
      existing: /bereits aufgeführt/,
      absent: /nur (?:ein|hinzu), wenn sie fehl(?:t|en)/,
      pending: /Verarbeitung noch aus|noch in Bearbeitung/,
      avoidRepeat: /statt (?:dieselbe Sitemap erneut|sie erneut) einzureichen/,
      reuseSite: /nutze den bestehenden Eintrag und bestätige sie nur bei Bedarf/
    },
    es: {
      existing: /ya apare(?:ce|cen) en la lista/,
      absent: /solo si falta(?:n)?/,
      pending: /pendiente/,
      avoidRepeat: /en lugar de (?:volver a enviar el mismo sitemap|repetirlo)/,
      reuseSite: /usa la entrada existente y verifícala solo si es necesario/
    }
  };
  for (const [language, checks] of Object.entries(rules)) {
    const steps = language === 'en'
      ? Object.fromEntries(searchVisibilitySteps.map((step) => [step.id, step]))
      : translations.getTutorialTranslation('search-visibility', language).steps;
    for (const id of ['submit-google-sitemap', 'set-up-bing-webmaster']) {
      const guidance = steps[id].explanation.join(' ');
      for (const [label, pattern] of Object.entries(checks).filter(([label]) => label !== 'reuseSite')) {
        assert.match(guidance, pattern, `${language}/${id}: ${label}`);
      }
      assert.match(guidance, /https:\/\/www\.example\.com\/sitemap\.xml/, `${language}/${id}: canonical example`);
    }
    assert.match(steps['set-up-bing-webmaster'].explanation[0], checks.reuseSite, `${language}: reuse existing Bing site`);
  }
});

test('Bing ownership file preserves the verification issued for the production property', async () => {
  const xml = (await readFile(new URL('../public/BingSiteAuth.xml', import.meta.url), 'utf8'))
    .replace(/\r\n/g, '\n').trim();
  assert.equal(xml, [
    '<?xml version="1.0"?>',
    '<users>',
    '\t<user>1A40A79EE7BAE314A3FD3DA65AF7801A</user>',
    '</users>'
  ].join('\n'));
});

test('new tutorial is listed without an invalid learning-path link or unsupported lesson feedback', async () => {
  const tutorials = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  assert.match(tutorials, /pathId: 'search-visibility'/);
  assert.match(tutorials, /href: '\/tutorials\/search-visibility'/);
  assert.match(tutorials, /backHref: '\/tutorials'/);
  assert.match(tutorials, /feedbackEnabled: false/);
  const page = await readFile(new URL('../app/tutorials/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /feedbackEnabled=\{tutorial\.feedbackEnabled\}/);
  assert.match(page, /tutorial\.backHref \?\? `\/paths\/\$\{tutorial\.pathId\}`/);
  assert.match(await readFile(new URL('../components/tutorial-steps.tsx', import.meta.url), 'utf8'), /target="_blank" rel="noopener noreferrer"/);
});

test('homepage displays learning paths rather than the separate goal count', async () => {
  const home = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const stats = home.match(/<ul className="mini-stats"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(stats, 'homepage statistics are present');
  assert.match(stats, /catalog\.paths\.length/);
  assert.match(stats, /<Tr>learning paths<\/Tr>/);
  assert.doesNotMatch(stats, /catalog\.goals\.length/);
  assert.match(home, /alternates: \{ canonical: '\/' \}/);
  assert.match(home, /openGraph: \{ type: 'website', locale: 'en_US', url: '\/'/);
  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  const goals = JSON.parse(await readFile(new URL('../content/goals.json', import.meta.url), 'utf8'));
  assert.ok(paths.length >= 32);
  assert.ok(goals.length >= 23);
  assert.ok(paths.length > goals.length, 'learning paths and goals are distinct counts');
});

test('SEO metadata uses page-specific canonical and social URLs instead of inheriting the homepage URL', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(layout, /alternates:\s*\{\s*canonical:/, 'a root canonical would be inherited by child routes');
  assert.doesNotMatch(layout, /openGraph:\s*\{[\s\S]*?url:\s*'\/'/, 'the homepage URL must not be inherited as every page social URL');
  for (const [file, canonical] of [
    ['../app/tools/page.tsx', '/tools'],
    ['../app/paths/page.tsx', '/paths'],
    ['../app/starter-packs/page.tsx', '/starter-packs'],
    ['../app/tutorials/page.tsx', '/tutorials'],
    ['../app/business-launchpad/page.tsx', '/business-launchpad'],
    ['../app/start-here/page.tsx', '/start-here']
  ]) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.ok(source.includes(`canonical: '${canonical}'`), `${file}: canonical`);
    assert.match(source, /openGraph:\s*\{/);
    assert.match(source, /twitter:\s*\{/);
  }
  for (const file of ['../app/tools/[id]/page.tsx', '../app/starter-packs/[id]/page.tsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.match(source, /const canonical = `\/(?:tools|starter-packs)\/\$\{encodeURIComponent\(id\)\}`/);
    assert.match(source, /alternates:\s*\{\s*canonical\s*\}/);
    assert.match(source, /openGraph:\s*\{/);
    assert.match(source, /twitter:\s*\{/);
  }
});

test('public practice and support pages have matching canonical and social metadata', async () => {
  const source = await readFile(new URL('../lib/public-page-metadata.ts', import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const { publicPageMetadata } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
  for (const pathname of [
    '/contact', '/onboarding', '/plan', '/break-room', '/privacy', '/terms',
    '/projects/first-app', '/projects/first-app/build', '/projects/coding-foundations/build',
    '/projects/ai-assisted-coding/build', '/challenges/first-website', '/ai-updates',
    '/business-launchpad/first-project', '/business-launchpad/feedback-guide',
    '/business-launchpad/proposal-builder', '/business-launchpad/results-tracker',
    '/business-launchpad/freelance-portfolio', '/business-launchpad/client-discovery-lab',
    '/business-launchpad/commerce-lab'
  ]) {
    const page = await readFile(new URL(`../app${pathname}/page.tsx`, import.meta.url), 'utf8');
    assert.ok(page.includes(`publicPageMetadata('${pathname}',`), `${pathname}: uses public metadata`);
    const metadata = publicPageMetadata(pathname, { title: 'Page title', description: 'Page description' });
    assert.equal(metadata.alternates.canonical, pathname);
    assert.equal(metadata.openGraph.url, pathname);
    assert.equal(metadata.openGraph.title, metadata.title);
    assert.equal(metadata.openGraph.description, metadata.description);
    assert.equal(metadata.openGraph.siteName, 'Desofec AI Studio');
    assert.equal(metadata.openGraph.images[0].url, '/opengraph-image');
    assert.equal(metadata.twitter.card, 'summary_large_image');
    assert.equal(metadata.twitter.title, metadata.title);
    assert.equal(metadata.twitter.description, metadata.description);
    assert.deepEqual(metadata.twitter.images, ['/opengraph-image']);
  }
});

test('account and progress pages request no indexing without blocking crawler access to noindex', async () => {
  for (const pathname of ['account', 'my-progress']) {
    const page = await readFile(new URL(`../app/${pathname}/page.tsx`, import.meta.url), 'utf8');
    assert.match(page, /robots: \{ index: false, follow: true \}/, pathname);
  }
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, /['"]\/(?:account|my-progress|workspaces|study-groups)(?:\/|['"])/);
  const robots = await readFile(new URL('../app/robots.ts', import.meta.url), 'utf8');
  assert.match(robots, /allow: '\/'/);
  assert.doesNotMatch(robots, /disallow:/, 'crawlers must be able to read page-level noindex');
});

test('contact guidance is translated and preserves the manual email boundary', async () => {
  const page = await readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');
  const phrases = [...page.matchAll(/<Tr>([^<]+)<\/Tr>/g)].map(match => match[1]);
  assert.equal(phrases.length, 8);
  assert.match(page, /href="mailto:support@desofec\.com"/);
  assert.match(page, /href="\/start-here"/);
  assert.doesNotMatch(page, /<form|fetch\(|localStorage/);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of phrases) {
      assert.ok(book[phrase]?.trim() && book[phrase] !== phrase, `${locale}: ${phrase}`);
      assert.doesNotMatch(book[phrase], /\uFFFD|\p{L}\?\p{L}/u);
    }
  }
});

test('English-only first-app practice has an explicit content language and translated notice', async () => {
  const page = await readFile(new URL('../app/projects/first-app/page.tsx', import.meta.url), 'utf8');
  const phrase = 'This practice page is currently available in English.';
  assert.match(page, /<div className="container first-app-project" lang="en">/);
  assert.ok(page.indexOf(`<Tr>${phrase}</Tr>`) < page.indexOf('lang="en"'), 'notice follows the selected language');
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    assert.ok(book[phrase]?.trim() && book[phrase] !== phrase, `${locale}: English notice`);
  }
});

test('search visibility tutorial translation covers every step and public UI labels', async () => {
  const content = await readFile(new URL('../lib/tutorial-translations.ts', import.meta.url), 'utf8');
  for (const id of ['choose-canonical-origin', 'verify-google-property', 'submit-google-sitemap',
    'inspect-google-url', 'set-up-bing-webmaster', 'monitor-indexing']) {
    const matches = content.match(new RegExp(`'${id}':`, 'g')) ?? [];
    assert.equal(matches.length, 3, `${id} must be translated in French, German and Spanish`);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of ['learning paths', 'Official guidance', 'Browse all tutorials']) assert.ok(book[text], `${locale}: ${text}`);
  }
});

test('homepage discovery offers translated practice outcomes and registered tutorials', async () => {
  const home = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  assert.match(home, /aria-labelledby="featured-lessons"/);
  assert.match(home, /tutorials\.find\(\(entry\) => entry\.pathId === lesson\.id\)/);
  assert.match(home, /throw new Error\(`Missing featured homepage tutorial/);
  for (const id of ['ai-content-services', 'ai-automation-services', 'ai-spreadsheets', 'ai-video-business']) {
    assert.ok(home.includes(`id: '${id}'`));
    assert.ok(registry.includes(`pathId: '${id}'`));
  }
  const phrases = [...home.matchAll(/(?:title|outcome): phrase\('([^']+)'\)/g)].map((match) => match[1]);
  phrases.push(
    'Learn by practising', 'Choose one useful skill to practise',
    'Start with a guided lesson, try the examples, and check what you made. These are learning routes, not promises of clients or income.',
    'Not sure where to begin? Follow the recommended fictional content project at your own pace.'
  );
  assert.equal(phrases.length, 12);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of phrases) assert.ok(book[text], `${locale}: ${text}`);
  }
  const hero = home.slice(home.indexOf('<section className="hero'), home.indexOf('<ContinueLearning'));
  assert.equal((hero.match(/<Link /g) ?? []).length, 3);
  assert.match(hero, /href="\/start-here"/);
  assert.match(hero, /href="\/tutorials"/);
  assert.match(hero, /href="\/my-progress"/);
});

test('tutorial topics cover every registered lesson and combine query, level and topic filters', async () => {
  const directorySource = await readFile(new URL('../lib/tutorial-directory.ts', import.meta.url), 'utf8');
  const directoryOutput = ts.transpileModule(directorySource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const { tutorialTopics, tutorialTopicIds, matchesTutorialFilters } = await import(
    `data:text/javascript;base64,${Buffer.from(directoryOutput).toString('base64')}`
  );
  const registry = await readFile(new URL('../lib/tutorials.ts', import.meta.url), 'utf8');
  const guides = await readFile(new URL('../lib/commerce-tool-guides.ts', import.meta.url), 'utf8');
  const ids = [
    ...[...registry.matchAll(/pathId: '([^']+)'/g)].map((match) => match[1]),
    ...[...guides.matchAll(/toolId: '([^']+)'/g)].map((match) => `${match[1]}-guide`),
    'first-website-challenge'
  ];
  for (const id of ids) {
    const topics = tutorialTopicIds(id);
    assert.ok(topics.length > 0, id);
    assert.equal(new Set(topics).size, topics.length, id);
    assert.ok(topics.every((topic) => tutorialTopics.some((entry) => entry.id === topic)), id);
  }
  assert.throws(() => tutorialTopicIds('unknown'), /Missing tutorial directory topic/);
  const item = {
    topics: tutorialTopicIds('ai-spreadsheets'), level: 'Beginner',
    searchText: ['Spreadsheets', 'Feuilles de calcul', 'Données', 'Clean fictional orders']
  };
  assert.equal(matchesTutorialFilters(item, '  FEUILLES  ', 'data', 'Beginner'), true);
  assert.equal(matchesTutorialFilters(item, 'orders', 'business', 'All'), true);
  assert.equal(matchesTutorialFilters(item, 'Spreadsheets', 'coding', 'All'), false);
  assert.equal(matchesTutorialFilters(item, '', 'all', 'Advanced'), false);
  assert.equal(matchesTutorialFilters(item, 'missing', 'all', 'All'), false);
  assert.equal(matchesTutorialFilters(item, '', 'all', 'All'), true);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of [
      ...tutorialTopics.map((topic) => topic.label), 'Choose a topic', 'All topics', 'Clear tutorial filters',
      'Filter by topic, level or a search word. Titles and descriptions follow your language; some lesson instructions remain in English.'
    ]) assert.ok(book[phrase], `${locale}: ${phrase}`);
  }
  const component = await readFile(new URL('../components/tutorial-list.tsx', import.meta.url), 'utf8');
  assert.match(component, /translation\?\.title/);
  assert.match(component, /translation\?\.intro/);
  assert.match(component, /setQuery\(''\); setTopic\('all'\); setLevel\('All'\)/);
  assert.doesNotMatch(component, /localStorage|saveProject|tutorialStorageKey/);
});

test('tutorial cards translate fallback headings and include them in search', async () => {
  const component = await readFile(new URL('../components/tutorial-list.tsx', import.meta.url), 'utf8');
  assert.match(component, /getTutorialTranslation\(tutorial\.pathId, language\)\?\.title \?\? tr\(tutorial\.title\)/);
  assert.match(component, /translation\?\.title \?\? '', tr\(item\.title\)/);
  const fallbackIds = new Set([
    'ai-automation-services', 'origin-data-analysis', 'auto-data-analysis',
    'advanced-measurement-analysis', 'data-visualization', 'research-with-ai',
    'ai-for-education', 'advanced-web-dev-ai', 'ai-workflows-agents', 'ai-website-builder',
    'ai-content-services', 'ai-cad-services', 'micro-saas-validation', 'ai-education-services'
  ]);
  const titles = [];
  for (const file of ['../lib/tutorials.ts', '../lib/commerce-tool-guides.ts']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const properties = new Map(node.properties.filter(ts.isPropertyAssignment)
          .map(property => [property.name.getText(ast), property.initializer]));
        const id = properties.get('pathId') ?? properties.get('toolId');
        const title = properties.get('title');
        if (id && ts.isStringLiteral(id) && title && ts.isStringLiteral(title)
          && (file.endsWith('commerce-tool-guides.ts') || fallbackIds.has(id.text))) titles.push(title.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  assert.equal(titles.length, 20);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const title of titles) {
      assert.ok(book[title], `${locale}: ${title}`);
      assert.notEqual(book[title], title);
    }
  }
});

test('remaining tutorial card descriptions have three translations preserving lesson-language notices', async () => {
  const descriptions = [];
  for (const file of ['../lib/tutorials.ts', '../lib/commerce-tool-guides.ts']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'intro'
        && ts.isStringLiteral(node.initializer) && node.initializer.text.trim()) {
        descriptions.push(node.initializer.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  const books = await Promise.all(['fr', 'de', 'es'].map(async locale =>
    JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'))));
  const newDescriptions = descriptions.filter(description => books.some(book => Object.hasOwn(book, description)));
  assert.equal(newDescriptions.length, 28);
  for (const description of newDescriptions) {
    for (const [index, book] of books.entries()) {
      assert.ok(book[description]?.trim(), `${index}: ${description}`);
      assert.notEqual(book[description], description);
      if (description.includes('Instructions are currently English')) {
        assert.match(book[description], [/anglais/, /Englisch/, /inglés/][index]);
      }
    }
  }
  const component = await readFile(new URL('../components/tutorial-list.tsx', import.meta.url), 'utf8');
  assert.match(component, /translation\?\.intro \?\? '', tr\(item\.intro\)/);
  assert.match(component, /getTutorialTranslation\(tutorial\.pathId, language\)\?\.intro \|\| tr\(tutorial\.intro\)/);
  assert.match(component, /some lesson instructions remain in English/);
});
