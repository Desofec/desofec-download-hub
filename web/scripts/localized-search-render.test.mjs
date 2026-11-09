import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadWebModules } from './load-web-modules.mjs';

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionOrigin = 'https://www.desofec.com';
const socialLocales = { en: 'en_US', fr: 'fr_FR', de: 'de_DE', es: 'es_ES' };
const [localized, translations, registry] = loadWebModules([
  'lib/localized-tutorials.ts',
  'lib/tutorial-translations.ts',
  'lib/tutorials.ts'
]);
let server;
let origin;
let output = '';

before(async () => {
  const listener = createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(0, '127.0.0.1', resolve);
  });
  const address = listener.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));

  origin = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [
    path.join(webDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
    'start', '--hostname', '127.0.0.1', '--port', String(port)
  ], { cwd: webDir, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', (chunk) => { output = (output + chunk.toString()).slice(-12000); });
  server.stderr.on('data', (chunk) => { output = (output + chunk.toString()).slice(-12000); });
  let spawnError;
  server.on('error', (error) => { spawnError = error; });

  const deadline = Date.now() + 30000;
  let lastError;
  while (Date.now() < deadline) {
    if (spawnError || server.exitCode !== null) {
      throw new Error(`Production test server did not start: ${spawnError ?? server.exitCode}\n${output}`);
    }
    try {
      const response = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Production test server was not ready: ${lastError}\n${output}`);
}, { timeout: 35000 });

after(async () => {
  if (!server || server.exitCode !== null) return;
  const exited = new Promise((resolve) => server.once('exit', resolve));
  server.kill();
  const stopped = await Promise.race([
    exited.then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 3000))
  ]);
  if (!stopped && server.exitCode === null) {
    server.kill('SIGKILL');
    await exited;
  }
});

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/\s([\w:-]+)="([^"]*)"/g)]
    .map(([, name, value]) => [name.toLowerCase(), htmlText(value)]));
}

function renderedMain(html) {
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const main = withoutScripts.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  assert.ok(main, 'page has an initial HTML main element');
  return main;
}

function htmlText(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|apos));/gi, (match, decimal, hex, name) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    return named[name.toLowerCase()] ?? match;
  });
}

function checkAlternates(html, englishPath, currentPath) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const canonical = links.find((link) => link.rel === 'canonical');
  assert.equal(canonical?.href, `${productionOrigin}${currentPath}`);
  const actual = Object.fromEntries(links
    .filter((link) => link.rel === 'alternate' && link.hreflang)
    .map((link) => [link.hreflang, link.href]));
  assert.deepEqual(actual, {
    en: `${productionOrigin}${englishPath}`,
    fr: `${productionOrigin}/fr${englishPath}`,
    de: `${productionOrigin}/de${englishPath}`,
    es: `${productionOrigin}/es${englishPath}`,
    'x-default': `${productionOrigin}${englishPath}`
  });
}

function checkSocialMetadata(html, pathname, language, expectedTitle) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const value = (property) => tags.find((tag) => tag.property === property)?.content;
  assert.equal(value('og:url'), `${productionOrigin}${pathname}`, pathname);
  assert.equal(value('og:locale'), socialLocales[language], pathname);
  assert.deepEqual(
    tags.filter((tag) => tag.property === 'og:locale:alternate').map((tag) => tag.content).sort(),
    Object.entries(socialLocales).filter(([code]) => code !== language).map(([, locale]) => locale).sort(),
    pathname
  );
  if (expectedTitle) assert.equal(value('og:title'), expectedTitle, `${pathname}: translated social title`);
}

function checkSearchSnippet(html, pathname) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  assert.ok(title, `${pathname}: search title`);
  assert.ok(htmlText(title).length < 70, `${pathname}: search title includes the site name`);
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const description = tags.find((tag) => tag.name === 'description')?.content;
  assert.ok(description && description.length >= 25 && description.length <= 160, `${pathname}: search description`);
}

function checkLanguageNavigation(main, pathname) {
  const navigation = main.match(/<nav\b[^>]*class="tutorial-language-links"[^>]*>[\s\S]*?<\/nav>/i)?.[0];
  assert.ok(navigation, `${pathname}: language navigation`);
  const language = pathname.match(/^\/(fr|de|es)\//)?.[1] ?? 'en';
  const englishPath = language === 'en' ? pathname : pathname.slice(3);
  const labels = { en: 'Language', fr: 'Langue', de: 'Sprache', es: 'Idioma' };
  assert.equal(attributes(navigation.match(/^<nav\b[^>]*>/i)[0])['aria-label'], labels[language],
    `${pathname}: translated navigation name`);
  const links = [...navigation.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map(([tag, text]) => ({
    ...attributes(tag), text: htmlText(text)
  }));
  assert.deepEqual(links.map(({ href, lang, hreflang, text }) => ({ href, lang, hreflang, text })), [
    { href: englishPath, lang: 'en', hreflang: 'en', text: 'English' },
    { href: `/fr${englishPath}`, lang: 'fr', hreflang: 'fr', text: 'Français' },
    { href: `/de${englishPath}`, lang: 'de', hreflang: 'de', text: 'Deutsch' },
    { href: `/es${englishPath}`, lang: 'es', hreflang: 'es', text: 'Español' }
  ], `${pathname}: language names, destinations and tags`);
  const current = links.filter((link) => link['aria-current'] === 'page');
  assert.equal(current.length, 1, `${pathname}: one current language`);
  assert.equal(current[0].href, pathname, `${pathname}: current language URL`);
}

function checkCompletionLabels(main, titles, language, pathname) {
  const labels = [...main.matchAll(/<label\b[^>]*class="step-check"[^>]*>([\s\S]*?)<\/label>/gi)];
  assert.equal(labels.length, titles.length, `${pathname}: one completion control per lesson`);
  for (const [index, [, contents]] of labels.entries()) {
    assert.match(contents, /<input\b[^>]*type="checkbox"/i, `${pathname}: lesson ${index + 1} checkbox`);
    const context = contents.match(/<span\b[^>]*class="sr-only"[^>]*>([\s\S]*?)<\/span>/i);
    assert.ok(context, `${pathname}: lesson ${index + 1} has accessible context`);
    assert.equal(attributes(context[0]).lang, language, `${pathname}: lesson ${index + 1} title language`);
    assert.equal(htmlText(context[1]), `: ${index + 1}. ${titles[index]}`,
      `${pathname}: lesson ${index + 1} accessible context`);
  }
}

async function page(pathname) {
  const response = await fetch(`${origin}${pathname}`, {
    headers: { 'User-Agent': 'Googlebot', 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(15000)
  });
  return { response, html: await response.text() };
}

async function forEachLimit(items, limit, callback) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await callback(items[index]);
    }
  }));
}

test('all sitemap language versions return readable, self-canonical HTML with reciprocal alternates', async () => {
  const { response, html } = await page('/sitemap.xml');
  assert.equal(response.status, 200);
  const locations = [...html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location);
  assert.equal(new Set(locations).size, locations.length, 'sitemap URLs are unique');
  const localizedUrls = locations.filter((location) => /^https:\/\/www\.desofec\.com\/(?:fr|de|es)\//.test(location));
  assert.ok(localizedUrls.length >= 60, 'complete translations have discoverable language URLs');
  const expectedPages = new Map(localized.localizedTutorials.flatMap((tutorial) =>
    localized.localizedTutorialLanguages.map((language) => {
      const { title, intro, steps } = translations.getTutorialTranslation(tutorial.pathId, language);
      return [`${productionOrigin}${localized.localizedTutorialPath(tutorial, language)}`, {
        title, intro, stepTitles: tutorial.steps.map((step) => steps[step.id].title)
      }];
    })
  ));
  assert.deepEqual([...localizedUrls].sort(), [...expectedPages.keys()].sort(), 'sitemap matches eligible translations');

  const groups = new Map();
  for (const url of localizedUrls) {
    const pathname = new URL(url).pathname;
    const language = pathname.split('/')[1];
    const englishPath = pathname.slice(3);
    const group = groups.get(englishPath) ?? new Set();
    group.add(language);
    groups.set(englishPath, group);
  }
  for (const [englishPath, languages] of groups) {
    assert.deepEqual([...languages].sort(), ['de', 'es', 'fr'], englishPath);
    assert.ok(locations.includes(`${productionOrigin}${englishPath}`), englishPath);
  }

  await forEachLimit(localizedUrls, 6, async (url) => {
    const pathname = new URL(url).pathname;
    const language = pathname.split('/')[1];
    const { response: result, html: document } = await page(pathname);
    assert.equal(result.status, 200, pathname);
    const main = renderedMain(document);
    assert.match(main, new RegExp(`<div lang="${language}">`), pathname);
    const heading = main.match(/<h1\b[^>]*>([^<]+)<\/h1>/i);
    assert.ok(heading, pathname);
    const expected = expectedPages.get(url);
    assert.equal(htmlText(heading[1]), expected.title, `${pathname}: translated heading`);
    const sectionHead = main.match(/<div\b[^>]*class="section-head"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    const intro = sectionHead?.match(/<p>([\s\S]*?)<\/p>/i)?.[1];
    assert.ok(intro, `${pathname}: translated introduction`);
    assert.equal(htmlText(intro), expected.intro, `${pathname}: full translated introduction`);
    const checkboxes = [...main.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/gi)].map(([input]) => input);
    assert.ok(checkboxes.length > 0, pathname);
    assert.ok(checkboxes.every((input) => !/\schecked(?:[=>\s]|$)/i.test(input)), `${pathname}: no automatic completion`);
    checkCompletionLabels(main, expected.stepTitles, language, pathname);
    assert.doesNotMatch(document, /<meta[^>]+name="robots"[^>]+noindex/i, pathname);
    checkLanguageNavigation(main, pathname);
    checkAlternates(document, pathname.slice(3), pathname);
    checkSocialMetadata(document, pathname, language, expected.title);
    checkSearchSnippet(document, pathname);
  });

  await forEachLimit([...groups.keys()], 6, async (pathname) => {
    const { response: result, html: document } = await page(pathname);
    assert.equal(result.status, 200, pathname);
    const main = renderedMain(document);
    const tutorial = localized.localizedTutorials.find(({ href }) => href === pathname);
    assert.ok(tutorial, `${pathname}: tutorial exists`);
    checkCompletionLabels(main, tutorial.steps.map(({ title }) => title), 'en', pathname);
    checkLanguageNavigation(main, pathname);
    checkAlternates(document, pathname, pathname);
    checkSocialMetadata(document, pathname, 'en');
    checkSearchSnippet(document, pathname);
  });
});

test('English-only tutorials render concise search snippets', async () => {
  for (const pathname of [
    '/tutorials/looker-studio-guide',
    '/tutorials/zoho-inventory-guide',
    '/tutorials/freelance-client-discovery',
    '/tutorials/ai-spreadsheets'
  ]) {
    const { response, html } = await page(pathname);
    assert.equal(response.status, 200, pathname);
    checkSearchSnippet(html, pathname);
  }
});

test('other English learning entries identify every lesson completion control', async () => {
  for (const tutorial of registry.tutorials.filter((entry) => !localized.hasLocalizedTutorialPages(entry))) {
    const { response, html } = await page(tutorial.href);
    assert.equal(response.status, 200, tutorial.href);
    checkCompletionLabels(renderedMain(html), tutorial.steps.map(({ title }) => title), 'en', tutorial.href);
  }
});

test('every learning path identifies its completion controls', async () => {
  const paths = JSON.parse(await readFile(path.join(webDir, 'content', 'paths.json'), 'utf8'));
  assert.ok(paths.length > 0, 'learning paths are present');
  await forEachLimit(paths, 6, async (entry) => {
    const pathname = `/paths/${encodeURIComponent(entry.id)}`;
    const { response, html } = await page(pathname);
    assert.equal(response.status, 200, pathname);
    checkCompletionLabels(renderedMain(html), entry.steps, 'en', pathname);
  });
});

test('representative lessons render translated teaching text without JavaScript', async () => {
  for (const [pathname, title, firstStep] of [
    ['/fr/tutorials/ai-video-business', 'Créer des vidéos courtes avec l’IA pour une entreprise', 'Planifier des vidéos professionnelles courtes'],
    ['/de/tutorials/ai-video-business', 'Kurze Geschäftsvideos mit KI erstellen', 'Kurze Geschäftsvideos planen'],
    ['/es/tutorials/ai-video-business', 'Crear vídeos cortos para empresas con IA', 'Planificar vídeos empresariales cortos'],
    ['/fr/projects/ai-assisted-coding/build', 'Coder avec un assistant IA', 'Choisir et configurer un assistant'],
    ['/de/projects/ai-assisted-coding/build', 'Mit einem KI-Assistenten programmieren', 'Einen Assistenten auswählen und einrichten'],
    ['/es/projects/ai-assisted-coding/build', 'Programa con un asistente de IA', 'Elige y configura un asistente']
  ]) {
    const { response, html } = await page(pathname);
    assert.equal(response.status, 200, pathname);
    const main = renderedMain(html);
    assert.ok(main.includes(title), `${pathname}: translated title`);
    assert.ok(main.includes(firstStep), `${pathname}: translated lesson`);
    const checkboxes = [...main.matchAll(/<input\b[^>]*type="checkbox"[^>]*>/gi)].map(([input]) => input);
    assert.ok(checkboxes.length > 0, pathname);
    assert.ok(checkboxes.every((input) => !/\schecked(?:[=>\s]|$)/i.test(input)), `${pathname}: no automatic completion`);
  }
});

test('translated tutorial pages link to the same-language next tutorial without JavaScript', async () => {
  for (const language of ['fr', 'de', 'es']) {
    const pathname = `/${language}/projects/coding-foundations/build`;
    const { response, html } = await page(pathname);
    assert.equal(response.status, 200, pathname);
    const links = [...renderedMain(html).matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag));
    assert.ok(links.some((link) => link.href === `/${language}/projects/first-app/build`), pathname);
  }
});

test('search-visibility pages render existing-sitemap guidance in each language', async () => {
  for (const [pathname, google, bing] of [
    ['/tutorials/search-visibility', 'Submit it only if it is absent', 'Submit it only if absent'],
    ['/fr/tutorials/search-visibility', 'Envoyez-la seulement si elle est absente', 'Envoyez-le seulement s’il est absent'],
    ['/de/tutorials/search-visibility', 'Reiche sie nur ein, wenn sie fehlt', 'ist die Sitemap noch in Bearbeitung, beobachte den vorhandenen Eintrag'],
    ['/es/tutorials/search-visibility', 'Envíala solo si falta', 'Envíalo solo si falta']
  ]) {
    const { response, html } = await page(pathname);
    assert.equal(response.status, 200, pathname);
    const main = htmlText(renderedMain(html));
    assert.ok(main.includes(google), `${pathname}: Google guidance`);
    assert.ok(main.includes(bing), `${pathname}: Bing guidance`);
  }
});

test('incomplete translations and private pages are not advertised', async () => {
  for (const pathname of ['/fr/tutorials/ai-spreadsheets', '/es/tutorials/shopify-guide', '/fr/account']) {
    const { response, html } = await page(pathname);
    assert.ok(response.status === 404 || /<meta[^>]+name="robots"[^>]+noindex/i.test(html), pathname);
  }
  const untranslated = await page('/tutorials/shopify-guide');
  assert.equal(untranslated.response.status, 200);
  assert.doesNotMatch(untranslated.html, /<meta[^>]+property="og:locale:alternate"/i);
  assert.doesNotMatch(untranslated.html, /<link[^>]+hreflang=/i);
  const { html } = await page('/my-progress');
  assert.match(html, /<meta[^>]+name="robots"[^>]+noindex/i);
});
