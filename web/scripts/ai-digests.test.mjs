import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const source = await readFile(new URL('../lib/ai-digests.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;
const { readAiDigests, publishedAiDigests } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const stored = JSON.parse(await readFile(new URL('../content/ai-digests.json', import.meta.url), 'utf8'));

function fixture() {
  return {
    id: '2026-11-06-test-edition',
    status: 'published',
    title: 'Test-only edition',
    summary: 'Test content, not a real news claim.',
    publishedOn: '2026-11-06',
    review: { reviewedOn: '2026-11-06', reviewer: 'owner', sourcesChecked: true },
    items: [{
      title: 'Test-only story',
      announcement: 'An attributed announcement.',
      relevance: 'Useful for fictional practice.',
      limitations: 'Not independently tested. Access is unverified.',
      practice: 'Use only invented data.',
      practiceHref: '/business-launchpad/spreadsheet-lab',
      source: {
        title: 'Test source',
        publisher: 'Google',
        url: 'https://blog.google/test-fixture',
        publishedOn: '2026-11-05'
      }
    }]
  };
}

test('stored digests validate and published dates are not a scheduling mechanism', () => {
  const parsed = readAiDigests(stored);
  assert.equal(parsed.length, stored.length);
  const today = new Date().toISOString().slice(0, 10);
  for (const digest of publishedAiDigests(parsed)) {
    assert.ok(digest.publishedOn <= today, 'do not future-date a published edition');
  }
});

test('drafts stay excluded even if they contain stories and review metadata', () => {
  const draft = { ...fixture(), status: 'draft' };
  assert.deepEqual(publishedAiDigests(readAiDigests([draft])), []);
  const emptyDraft = { ...draft, review: null, publishedOn: null, items: [] };
  assert.equal(readAiDigests([emptyDraft])[0].items.length, 0);
  assert.deepEqual(publishedAiDigests(readAiDigests([emptyDraft])), []);
});

test('publication requires a complete, explicitly checked review and one to three stories', () => {
  for (const modify of [
    (d) => { d.status = 'approved'; },
    (d) => { d.review = null; },
    (d) => { d.review.sourcesChecked = false; },
    (d) => { d.review.reviewer = ' '; },
    (d) => { d.publishedOn = null; },
    (d) => { d.items = []; },
    (d) => { d.items = Array(4).fill(d.items[0]); },
    (d) => { d.summary = ' '; },
    (d) => { d.items[0].limitations = ''; },
    (d) => { d.items[0].practice = ''; },
    (d) => { d.items[0].relevance = 3; },
    (d) => { d.items[0].source.title = ''; },
    (d) => { d.items[0].source.publisher = ''; },
    (d) => { d.title = 'x'.repeat(161); }
  ]) {
    const digest = fixture();
    modify(digest);
    assert.throws(() => readAiDigests([digest]), /Invalid AI digest/);
  }
  for (const invalid of [null, {}, [null], [[]]]) {
    assert.throws(() => readAiDigests(invalid), /Invalid AI digest/);
  }
});

test('dates are real ISO dates in source, review and publication order', () => {
  for (const invalid of ['2026-02-29', '2026-11-31', '2026-1-01', '2026-11-06T12:00Z', 'not-a-date']) {
    const digest = fixture();
    digest.publishedOn = invalid;
    assert.throws(() => readAiDigests([digest]), /Invalid AI digest/);
  }
  const digest = fixture();
  digest.review.reviewedOn = '2026-11-07';
  assert.throws(() => readAiDigests([digest]), /review date/);
  digest.review.reviewedOn = '2026-11-04';
  assert.throws(() => readAiDigests([digest]), /source date/);
});

test('unsafe source URLs and unrecognised practice links are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//evil.example/test',
    'http://blog.google/test', 'https://name:password@blog.google/test', 'https://localhost/test',
    'https://127.0.0.1/test', 'https://internal.local/test', 'https://[::1]/test', 'bad URL']) {
    const digest = fixture();
    digest.items[0].source.url = url;
    assert.throws(() => readAiDigests([digest]), /source.url/);
  }
  for (const href of ['//evil.example', 'https://evil.example', '/account', '/missing-route', '/start-here?upload=true']) {
    const digest = fixture();
    digest.items[0].practiceHref = href;
    assert.throws(() => readAiDigests([digest]), /practiceHref/);
  }
});

test('IDs and sources must be unique; sorting is stable and does not mutate input', () => {
  const digest = fixture();
  assert.throws(() => readAiDigests([digest, digest]), /unique slug/);
  assert.throws(() => readAiDigests([{ ...digest, id: '../draft' }]), /unique slug/);
  assert.throws(() => readAiDigests([{ ...digest, items: [digest.items[0], digest.items[0]] }]), /duplicate source/);
  const parsed = readAiDigests([
    { ...digest, id: 'older', publishedOn: '2026-11-05', review: { ...digest.review, reviewedOn: '2026-11-05' } },
    { ...digest, id: 'b' },
    { ...digest, id: 'a' }
  ]);
  assert.deepEqual(publishedAiDigests(parsed).map((d) => d.id), ['a', 'b', 'older']);
  assert.deepEqual(parsed.map((d) => d.id), ['older', 'b', 'a']);
});

test('public page renders reviewed evidence safely and never includes draft titles', async () => {
  const pageSource = await readFile(new URL('../app/ai-updates/page.tsx', import.meta.url), 'utf8');
  const metadataSource = await readFile(new URL('../lib/public-page-metadata.ts', import.meta.url), 'utf8');
  const metadataOutput = ts.transpileModule(metadataSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const metadataUrl = `data:text/javascript;base64,${Buffer.from(metadataOutput).toString('base64')}`;
  const digest = fixture();
  digest.title = '<script>alert("edition")</script>';
  digest.items[0].announcement = '<img src=x onerror=alert(1)>';
  const draft = { ...fixture(), id: 'hidden-draft', status: 'draft', title: 'SECRET_DRAFT_TITLE' };
  const editions = publishedAiDigests(readAiDigests([digest, draft]));
  // Substitute framework boundaries only; render the real page JSX with the real publication filter.
  globalThis.__digestTest = { createElement, editions };
  let output = ts.transpileModule(pageSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React }
  }).outputText;
  output = output
    .replace("'@/lib/public-page-metadata'", `'${metadataUrl}'`)
    .replace(/import Link from 'next\/link';/, 'const Link = (props) => React.createElement("a", props);')
    .replace(/import \{ Tr \} from '@\/components\/tr';/, 'const Tr = ({children}) => children;')
    .replace(/import \{ getPublishedAiDigests \} from '@\/lib\/ai-digest-content';/, 'const getPublishedAiDigests = () => globalThis.__digestTest.editions;');
  output = 'const React = {createElement: globalThis.__digestTest.createElement};\n' + output;
  try {
    const { default: Page } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
    const html = renderToStaticMarkup(createElement(Page));
    assert.ok(!html.includes('SECRET_DRAFT_TITLE'));
    assert.ok(!html.includes('<script>'));
    assert.ok(!html.includes('<img '));
    assert.ok(html.includes('&lt;script&gt;'));
    for (const text of ['Not independently tested.', 'What the source announced', 'Sources reviewed',
      '2026-11-05', 'rel="noopener noreferrer"', '/business-launchpad/spreadsheet-lab']) {
      assert.ok(html.includes(text), text);
    }
    globalThis.__digestTest.editions = [];
    const emptyHtml = renderToStaticMarkup(createElement(Page));
    assert.ok(emptyHtml.includes('No reviewed editions yet'));
    assert.ok(!emptyHtml.includes('Test-only story'));
  } finally {
    delete globalThis.__digestTest;
  }
});

test('digest interface translations and discovery links are present', async () => {
  const page = await readFile(new URL('../app/ai-updates/page.tsx', import.meta.url), 'utf8');
  const strings = [...page.matchAll(/<Tr>([^<{]+)<\/Tr>/g)].map((match) => match[1]);
  strings.push('Explore reviewed AI updates', 'AI Updates for Practical Learning',
    'Source-linked AI announcements with beginner relevance, limitations and a small practice activity. Only reviewed editions are published.');
  assert.ok(strings.length > 20);
  for (const locale of ['fr', 'de', 'es']) {
    const translations = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(translations[text], `${locale}: missing ${text}`);
  }
  for (const file of ['../app/page.tsx', '../components/site-footer.tsx', '../app/sitemap.ts']) {
    assert.match(await readFile(new URL(file, import.meta.url), 'utf8'), /\/ai-updates/);
  }
  assert.doesNotMatch(page, /dangerouslySetInnerHTML|localStorage|fetch\(|supabase|NewsletterForm/);
});
