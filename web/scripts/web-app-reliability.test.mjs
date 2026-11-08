import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(webDir, '..');
const locales = ['fr', 'de', 'es'];
const localizedPacks = [
  'ai-content-services-kit',
  'ai-automation-services-kit',
  'ai-spreadsheets-kit',
  'ai-commerce-services-kit',
  'ai-video-business-kit',
  'ai-video-creation-kit'
];

async function loadModule(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const readWeb = (file) => readFile(path.join(webDir, file), 'utf8');
const readJson = async (file) => JSON.parse(await readWeb(file));
const { hasLocalizedStarterPack, starterPackDownloadFile } = await loadModule('../lib/starter-pack-downloads.ts');
const { toolMatchesSearch } = await loadModule('../lib/tool-search.ts');

test('every starter-pack download surface uses selected-language routing', async () => {
  const cards = await readWeb('components/cards.tsx');
  assert.doesNotMatch(cards, /downloadUrl\(pack\.file\)/, 'catalog cards must not bypass language routing');
  assert.match(cards, /<StarterPackDownload packId=\{pack\.id\} file=\{pack\.file\} variant="card" \/>/);
  const detail = await readWeb('app/starter-packs/[id]/page.tsx');
  assert.match(detail, /<StarterPackDownload packId=\{pack\.id\} file=\{pack\.file\} \/>/);
});

test('localized kits route to existing files and English-only kits are labelled', async () => {
  const packs = await readJson('content/starter-packs.json');
  for (const pack of packs) {
    assert.equal(starterPackDownloadFile(pack.id, pack.file, 'en'), pack.file, `${pack.id}: English default`);
    for (const locale of locales) {
      const routed = starterPackDownloadFile(pack.id, pack.file, locale);
      if (localizedPacks.includes(pack.id)) {
        assert.equal(routed, pack.file.replace(/\.md$/, `-${locale}.md`));
        await access(path.join(repoDir, routed));
        await access(path.join(webDir, 'public', routed));
      } else {
        assert.equal(routed, pack.file, `${pack.id}: English fallback for ${locale}`);
      }
    }
    assert.equal(hasLocalizedStarterPack(pack.id), localizedPacks.includes(pack.id));
  }
  for (const id of localizedPacks) assert.ok(packs.some((pack) => pack.id === id), `${id} exists in the catalog`);

  const component = await readWeb('components/starter-pack-download.tsx');
  assert.match(component, /This download is currently available in English only\./);
  assert.match(component, /<Tr>\(English\)<\/Tr>/);
});

test('English kit editions no longer claim translations are unavailable', async () => {
  for (const id of ['ai-content-services-kit', 'ai-automation-services-kit', 'ai-commerce-services-kit']) {
    for (const dir of [repoDir, path.join(webDir, 'public')]) {
      const text = await readFile(path.join(dir, 'downloads', `${id}.md`), 'utf8');
      assert.doesNotMatch(text, /currently English/, `${id}: stale English-only claim`);
      assert.match(text, /English edition; French, German and Spanish editions/);
    }
  }
});

test('language notices and new interface copy are translated', async () => {
  const launchpad = await readWeb('app/business-launchpad/page.tsx');
  assert.doesNotMatch(launchpad, /Lessons and downloads are currently English/);
  const phrases = [
    'No paid AI is required for the worksheets. Many lessons and kit downloads are available in French, German and Spanish; when a download is only available in English, its button or page says so. Interviews, feedback and tool setup take additional time.',
    '(English)',
    'This download is currently available in English only.',
    'You finished every step. Be proud of what you built.'
  ];
  for (const locale of locales) {
    const book = await readJson(`content/translations/ui-${locale}.json`);
    for (const phrase of phrases) {
      assert.ok(book[phrase] && book[phrase] !== phrase, `${locale}: missing translation for "${phrase}"`);
      assert.doesNotMatch(book[phrase], /\p{L}\?\p{L}|\uFFFD/u, `${locale}: corrupted characters in "${phrase}"`);
    }
  }
});

test('tool search matches the translated text visitors see, ignoring accents', async () => {
  const tools = await readJson('content/tools.json');
  const fr = { ...(await readJson('content/translations/catalog-fr.json')), ...(await readJson('content/translations/ui-fr.json')) };
  const translate = (text) => fr[text] ?? text;
  const english = tools.filter((tool) => toolMatchesSearch(tool, 'research', (text) => text));
  assert.ok(english.length > 0, 'English search still works');
  const french = tools.filter((tool) => toolMatchesSearch(tool, 'recherche', translate));
  assert.ok(french.length >= english.length - 1 && french.length > 0, 'French search finds translated cards');
  assert.ok(french.some((tool) => tool.name === 'Perplexity'));
  assert.deepEqual(
    tools.filter((tool) => toolMatchesSearch(tool, 'RÉSUMÉ', translate)).map((tool) => tool.id),
    tools.filter((tool) => toolMatchesSearch(tool, 'resume', translate)).map((tool) => tool.id),
    'accent-insensitive'
  );
  assert.equal(tools.filter((tool) => toolMatchesSearch(tool, '   ', translate)).length, tools.length);
});

test('service worker refreshes downloads online while keeping offline copies', async () => {
  const sw = await readWeb('public/sw.js');
  assert.doesNotMatch(sw, /desofec-studio-v1'/, 'cache version bumped to purge stale downloads');
  const downloadBlock = sw.slice(sw.indexOf("startsWith('/downloads/')"), sw.indexOf("startsWith('/_next/static/')"));
  assert.ok(downloadBlock.length > 0, 'downloads handled before cache-first static assets');
  assert.match(downloadBlock, /fetch\(request\)[\s\S]*cache\.put[\s\S]*catch\([\s\S]*caches\.match\(request\)/);
  assert.match(sw, /caches\.match\(OFFLINE_URL\)/, 'offline page fallback preserved');
  assert.match(sw, /key !== CACHE_NAME/, 'old caches are deleted on activation');
});

test('continue-learning prefers unfinished work and never says continue at 100%', async () => {
  const source = await readWeb('components/continue-learning.tsx');
  assert.match(source, /Number\(a\.completed >= a\.total\) - Number\(b\.completed >= b\.total\)/);
  assert.match(source, /finished \? tr\('Explore learning paths'\)/);
  assert.match(source, /finished \? '\/paths'/);
});
