import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

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
  assert.match(home, /catalog\.paths\.length/);
  assert.match(home, /<Tr>learning paths<\/Tr>/);
  assert.doesNotMatch(home, /catalog\.goals\.length/);
  const paths = JSON.parse(await readFile(new URL('../content/paths.json', import.meta.url), 'utf8'));
  const goals = JSON.parse(await readFile(new URL('../content/goals.json', import.meta.url), 'utf8'));
  assert.equal(paths.length, 32);
  assert.equal(goals.length, 23);
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
