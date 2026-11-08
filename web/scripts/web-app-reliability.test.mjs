import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
const { redactAnalyticsEvent } = await loadModule('../lib/analytics-privacy.ts');

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

test('updated tool names retain their stable IDs and review labels describe their limits', async () => {
  const tools = await readJson('content/tools.json');
  const reviews = await readJson('content/tool-reviews.json');
  const sourceReviews = JSON.parse(await readFile(path.join(repoDir, 'data', 'tool-reviews.json'), 'utf8'));
  assert.deepEqual(reviews, sourceReviews);
  for (const [id, name] of [
    ['fusion-360', 'Autodesk Fusion (Fusion 360)'],
    ['notebooklm', 'Gemini Notebook (NotebookLM)'],
    ['looker-studio', 'Google Data Studio (Looker Studio)']
  ]) {
    const tool = tools.find((entry) => entry.id === id);
    assert.equal(tool?.name, name);
    assert.equal(reviews[id]?.toolName, name);
    assert.equal(reviews[id]?.toolUrl, tool.url);
    assert.equal(reviews[id]?.description, tool.description);
  }
  assert.ok(tools.some((tool) => tool.id === 'git'));
  assert.ok(tools.some((tool) => tool.id === 'github'));
  const label = 'Description checked with AI assistance:';
  const limitation = 'The English description was checked against official documentation. Translations, links, prices and all features were not verified and can change.';
  const freshness = await readWeb('components/tool-freshness.tsx');
  assert.ok(freshness.includes(label) && freshness.includes(limitation));
  for (const locale of locales) {
    const book = await readJson(`content/translations/ui-${locale}.json`);
    assert.ok(book[label] && book[limitation], `${locale}: review disclosure`);
    const catalog = await readJson(`content/translations/catalog-${locale}.json`);
    for (const id of ['git', 'github', 'bolt-new', 'microsoft-copilot']) {
      const tool = tools.find((entry) => entry.id === id);
      assert.ok(tool && catalog[tool.description], `${locale}: ${id} description`);
    }
  }
  assert.match(tools.find((entry) => entry.id === 'bolt-new').description, /Review and test it before publishing/);
});

test('tool links preserve their visible label and translate the new-tab notice', async () => {
  const page = await readWeb('app/tools/[id]/page.tsx');
  const start = page.indexOf('href={tool.url}');
  const end = page.indexOf('</a>', start);
  assert.ok(start !== -1 && end !== -1, 'external tool link exists');
  const link = page.slice(start, end);
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener noreferrer"/);
  assert.doesNotMatch(link, /aria-label=/, 'accessible name comes from the displayed label');
  assert.ok(link.includes("<Tr values={{ name: tool.name }}>{'Open {name}'}</Tr>"));
  assert.ok(link.includes('<span className="sr-only">{\' \'}<Tr>(opens in a new tab)</Tr></span>'));
  for (const locale of locales) {
    const book = await readJson(`content/translations/ui-${locale}.json`);
    assert.ok(book['Open {name}']?.includes('{name}'), `${locale}: translated visible label`);
    assert.ok(book['(opens in a new tab)'], `${locale}: translated new-tab notice`);
  }
});

test('website publishing guidance checks hosting eligibility without changing progress IDs', async () => {
  const tutorial = await readWeb('lib/ai-website-tutorial.ts');
  assert.match(tutorial, /id: 'publish-for-free',[\s\S]*?title: 'Choose hosting and publish'/);
  assert.match(tutorial, /free Hobby plan is for non-commercial personal use/);
  assert.match(tutorial, /check the host's current plan terms and costs/);
  for (const kit of ['ai-website-kit.md', 'app-launch-kit.md']) {
    const source = await readFile(path.join(repoDir, 'downloads', kit), 'utf8');
    const bundled = await readFile(path.join(webDir, 'public', 'downloads', kit), 'utf8');
    assert.equal(bundled, source, `${kit}: bundled download matches its source`);
    assert.match(source, /Hobby plan is for non-commercial personal use/);
    assert.doesNotMatch(source, /Publish for free/);
  }
  const tool = (await readJson('content/tools.json')).find((entry) => entry.id === 'vercel');
  const learningPath = (await readJson('content/paths.json')).find((entry) => entry.description.includes('choose suitable hosting'));
  const tutorialIntro = 'Write a short brief, let AI draft a one-page site, review and personalise it, then choose suitable hosting and publish it.';
  assert.ok(tool && learningPath);
  for (const locale of locales) {
    const catalog = await readJson(`content/translations/catalog-${locale}.json`);
    const ui = await readJson(`content/translations/ui-${locale}.json`);
    assert.ok(catalog[tool.description] && catalog[learningPath.description] && ui[tutorialIntro], `${locale}: hosting guidance is translated`);
  }
});

test('service worker refreshes downloads online while keeping offline copies', async () => {
  const sw = await readWeb('public/sw.js');
  assert.match(sw, /desofec-studio-v1'/, 'existing offline copies remain available on upgrade');
  const downloadBlock = sw.slice(sw.indexOf("startsWith('/downloads/')"), sw.indexOf("startsWith('/_next/static/')"));
  assert.ok(downloadBlock.length > 0, 'downloads handled before cache-first static assets');
  assert.match(downloadBlock, /fetch\(request, \{ cache: 'no-cache' \}\)[\s\S]*cache\.put[\s\S]*catch\([\s\S]*caches\.match\(request\)/);
  assert.match(sw, /caches\.match\(OFFLINE_URL\)/, 'offline page fallback preserved');
  assert.match(sw, /key !== CACHE_NAME/, 'old caches are deleted on activation');
});

test('continue-learning prefers unfinished work and never says continue at 100%', async () => {
  const source = await readWeb('components/continue-learning.tsx');
  assert.match(source, /Number\(a\.completed >= a\.total\) - Number\(b\.completed >= b\.total\)/);
  assert.match(source, /finished \? tr\('Explore learning paths'\)/);
  assert.match(source, /finished \? '\/paths'/);
});

test('navigation reveals more choices without removing goals or project access', async () => {
  const home = await readWeb('app/page.tsx');
  assert.match(home, /catalog\.goals\.slice\(0, 6\)/);
  assert.match(home, /<details className="more-options">[\s\S]*catalog\.goals\.slice\(6\)/);
  const launchpad = await readWeb('app/business-launchpad/page.tsx');
  assert.match(launchpad, /href="#launchpad-services"/);
  assert.match(launchpad, /<details className="more-options">[\s\S]*\/business-launchpad\/commerce-lab/);
  const continueCard = await readWeb('components/continue-learning.tsx');
  assert.match(continueCard, /href="\/business-launchpad\/projects"/);
});

test('compact navigation remains scrollable and dismissible on smaller screens', async () => {
  const header = await readWeb('components/site-header.tsx');
  const css = await readWeb('app/globals.css');
  assert.match(header, /aria-expanded=\{menuOpen\}/);
  assert.match(header, /event\.key === 'Escape'[\s\S]*setMenuOpen\(false\)[\s\S]*menuButton\.current\?\.focus\(\)/);
  assert.match(css, /@media \(max-width: 1440px\)[\s\S]*\.main-nav\.is-open[\s\S]*max-height: calc\(100dvh - 65px\)[\s\S]*overflow-y: auto/);
  assert.match(css, /@media \(min-width: 1441px\) and \(max-width: 1650px\)[\s\S]*\.desktop-nav-cta[\s\S]*display: none/);
  assert.match(css, /\.main-nav a \{[\s\S]*?white-space: nowrap/);
});

test('skip-to-content link is translated and moves keyboard focus to main', async () => {
  const layout = await readWeb('app/layout.tsx');
  assert.match(layout, /<a className="skip-link" href="#main-content">\s*<Tr>Skip to content<\/Tr>/);
  assert.match(layout, /<main id="main-content" tabIndex=\{-1\}>/);
  for (const locale of locales) {
    const book = await readJson(`content/translations/ui-${locale}.json`);
    assert.ok(book['Skip to content'] && book['Skip to content'] !== 'Skip to content', `${locale}: translated skip link`);
  }
});

test('analytics preserves public page views while removing sensitive URL information', () => {
  const event = {
    type: 'pageview',
    url: 'https://www.desofec.com/tutorials/ai-video-business?email=learner%40example.test&token=private#invite',
    properties: { note: 'must not be copied' }
  };
  assert.deepEqual(redactAnalyticsEvent(event), {
    type: 'pageview', url: 'https://www.desofec.com/tutorials/ai-video-business'
  });
  assert.ok(event.url.includes('?'), 'input is not mutated');
  assert.deepEqual(redactAnalyticsEvent({
    type: 'pageview', url: 'http://127.0.0.1:3167/contact?from=project#help'
  }), { type: 'pageview', url: 'http://127.0.0.1:3167/contact' });
  assert.deepEqual(redactAnalyticsEvent({
    type: 'pageview', url: 'https://user:password@preview.example.test/tools?query=private'
  }), { type: 'pageview', url: 'https://preview.example.test/tools' });
});

test('analytics excludes private routes including nested and encoded paths', () => {
  for (const route of [
    '/account', '/my-progress', '/newsletter', '/workspaces', '/study-groups',
    '/business-launchpad/projects', '/business-launchpad/proposal-builder',
    '/business-launchpad/results-tracker', '/business-launchpad/client-discovery',
    '/business-launchpad/case-study-builder', '/business-launchpad/evidence-workbook',
    '/business-launchpad/review-centre', '/business-launchpad/commerce-pilot-planner',
    '/business-launchpad/commerce-pilot-review', '/business-launchpad/commerce-readiness'
  ]) {
    for (const suffix of ['', '/private-id', '?token=private#invite']) {
      assert.equal(redactAnalyticsEvent({ type: 'pageview', url: `https://www.desofec.com${route}${suffix}` }), null, `${route}${suffix}`);
    }
  }
  for (const route of ['/%61ccount', '/workspaces%2Fprivate-id', '/tools/../account']) {
    assert.equal(redactAnalyticsEvent({ type: 'pageview', url: `https://www.desofec.com${route}` }), null, route);
  }
  assert.ok(redactAnalyticsEvent({ type: 'pageview', url: 'https://www.desofec.com/business-launchpad' }));
});

test('analytics rejects custom events and malformed URLs without exposing raw input', (t) => {
  const warning = t.mock.method(console, 'warn', () => {});
  assert.equal(redactAnalyticsEvent({ type: 'event', url: 'https://www.desofec.com/' }), null);
  assert.equal(redactAnalyticsEvent({ type: 'pageview', url: 'mailto:private@example.test' }), null);
  for (const url of ['private-token-not-a-url', 'https://www.desofec.com/%invalid']) {
    assert.equal(redactAnalyticsEvent({ type: 'pageview', url }), null);
  }
  assert.equal(warning.mock.callCount(), 2);
  for (const call of warning.mock.calls) {
    assert.deepEqual(call.arguments, ['Skipped analytics page view with an invalid URL.']);
  }
});

test('root analytics uses the privacy filter and sends only referral origins', async () => {
  const layout = await readWeb('app/layout.tsx');
  const component = await readWeb('components/privacy-analytics.tsx');
  assert.match(layout, /<PrivacyAnalytics \/>/);
  assert.doesNotMatch(layout, /<Analytics/);
  assert.match(layout, /referrer: 'strict-origin'/);
  assert.match(component, /^'use client';/);
  assert.match(component, /<Analytics beforeSend=\{redactAnalyticsEvent\} \/>/);
});

test('legal translations retain every section and track the English sources', async () => {
  const component = await readWeb('components/legal-translation.tsx');
  const css = await readWeb('app/globals.css');
  assert.match(component, /if \(language === 'en'\) return <>\{children\}<\/>/);
  assert.match(component, /<div lang=\{language\}>/);
  assert.match(component, /className="legal-translation-notice">\{copy\.notice\}/);
  assert.match(component, /<details className="legal-original">[\s\S]*\{children\}/);
  assert.match(component, /<a href="\/contact">\{content\.contactLink\}<\/a>/);
  assert.match(css, /\.legal a\s*\{[^}]*color:\s*var\(--text\);[^}]*text-decoration:\s*underline\s*;/);
  assert.match(css, /\.legal-original summary\s*\{[^}]*color:\s*var\(--text\);/);

  const digests = {};
  for (const kind of ['privacy', 'terms']) {
    const source = await readWeb(`app/${kind}/page.tsx`);
    const match = source.match(new RegExp(`<div lang="en" data-legal-source="${kind}">([\\s\\S]*?)<\\/div>`));
    assert.ok(match, `${kind}: English source has an explicit language tag`);
    digests[kind] = createHash('sha256').update(match[1].replace(/\r\n/g, '\n').trim()).digest('hex');
    assert.match(source, new RegExp(`<LegalTranslation kind="${kind}">`));
  }

  const importantNumbers = {
    fr: [/dix/, /huit/, /cinq/],
    de: [/zehn/, /acht/, /fünf/],
    es: [/diez/, /ocho/, /cinco/]
  };
  for (const locale of locales) {
    const book = await readJson(`content/translations/legal-${locale}.json`);
    assert.ok(book.notice && book.englishOriginal, `${locale}: review notice and original link`);
    assert.match(book.notice, /\b(?:IA|KI)\b/, `${locale}: identifies AI assistance`);
    for (const kind of ['privacy', 'terms']) {
      const doc = book[kind];
      assert.equal(doc.sourceDigest, digests[kind], `${locale} ${kind}: review translation after English changes`);
      for (const field of ['title', 'updated', 'intro', 'contactHeading', 'contactLead', 'contactLink', 'contactTail']) {
        assert.ok(doc[field], `${locale} ${kind}: missing ${field}`);
      }
    }
    assert.equal(book.privacy.collected.length, 12, `${locale}: all data categories`);
    assert.equal(book.privacy.extras.length, 8, `${locale}: all project and privacy details`);
    assert.equal(book.privacy.providers.length, 4, `${locale}: all service providers`);
    assert.equal(book.terms.sections.length, 5, `${locale}: all terms sections`);
    for (const [index, category] of [[5, 0], [7, 1], [7, 2]]) {
      assert.match(book.privacy.collected[index].text, importantNumbers[locale][category], `${locale}: project limits`);
    }
    for (const text of [
      ...book.privacy.collected, ...book.privacy.extras, ...book.privacy.providers
    ]) assert.ok(text.label && text.text, `${locale}: empty legal item`);
    for (const section of book.terms.sections) assert.ok(section.heading && section.text, `${locale}: empty term`);
    assert.doesNotMatch(JSON.stringify(book), /\uFFFD|\p{L}\?\p{L}/u, `${locale}: corrupted characters`);
  }
});

test('policies distinguish stored records, sharing, provider access and practice claims', async () => {
  const privacy = await readWeb('app/privacy/page.tsx');
  const terms = await readWeb('app/terms/page.tsx');
  for (const pattern of [
    /authorised service administrators may also have access/,
    /Browser storage and backups/, /unencrypted file containing all saved device project details/,
    /sign-in sessions/, /provider may process audio remotely/,
    /Shared learning workspaces and study groups/, /expire within seven days/,
    /visible to signed-in users for 30 days/, /profile fields such as your name or photo/,
    /Confirmation links expire after 24 hours/,
    /Unsubscribing marks the subscription as unsubscribed rather than deleting/,
    /Signing out does not delete device progress or projects/,
    /does not necessarily immediately erase provider logs or backups/,
    /hosting requests can still contain the URL you requested/
  ]) assert.match(privacy, pattern);
  assert.doesNotMatch(privacy, /Only your account can access|receive only your email|Anonymous visit statistics/);
  assert.match(terms, /Some translations are AI-assisted/);
  assert.match(terms, /not independently verified client work, accredited qualifications, client approval or promises of income/);
  assert.match(terms, /rights that cannot lawfully be excluded/);
  assert.doesNotMatch(terms, /Translations are automatic/);
  for (const [locale, admin, invitation, confirmation, profile] of [
    ['fr', /administrateurs de service/, /sept jours/, /24 heures/, /profil de base/],
    ['de', /Dienstadministratoren/, /sieben Tagen/, /24 Stunden/, /Profilfelder/],
    ['es', /administradores de servicio/, /siete días/, /24 horas/, /campos básicos del perfil/]
  ]) {
    const book = await readJson(`content/translations/legal-${locale}.json`);
    assert.match(book.privacy.collected[5].text, admin, locale);
    assert.match(book.privacy.extras[6].text, invitation, locale);
    assert.match(book.privacy.extras[6].text, /30/, locale);
    assert.match(book.privacy.newsletter, confirmation, locale);
    assert.match(book.privacy.providers.find(item => item.label === 'Google').text, profile, locale);
    assert.equal(new Set(book.privacy.extras.map(item => item.label)).size, 8, `${locale}: unique privacy headings`);
  }
});

test('legal and accent text meet normal-text contrast across theme gradients', async () => {
  const css = await readWeb('app/globals.css');
  assert.match(css, /\.legal p,\s*\.legal li\s*\{[^}]*color:\s*var\(--muted\);/);
  for (const selector of ['text-link', 'eyebrow', 'goal-badge', 'tool-tag', 'step-number', 'step-marker']) {
    assert.match(css, new RegExp(`\\.${selector}\\s*\\{[^}]*color:\\s*var\\(--accent-text\\);`));
  }
  const variableBlock = (block) => Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()])
  );
  const root = css.match(/:root\s*\{([^}]+)\}/);
  const light = css.match(/html\[data-theme="light"\],\s*html\[data-theme="sky"\],\s*html\[data-theme="sunrise"\],\s*html\[data-theme="mint"\]\s*\{([^}]+)\}/);
  const body = css.match(/^body\s*\{([^}]+)\}/m);
  assert.ok(root && light && body, 'base theme and body declarations exist');
  assert.match(body[1], /var\(--body-grad\)/);
  const overlays = [...body[1].matchAll(/radial-gradient\([^,]+,\s*rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g)]
    .map((match) => ({ rgb: match.slice(1, 4).map(Number), alpha: Number(match[4]) }));
  assert.equal(overlays.length, 2, 'both body gradient overlays are considered');
  const badgeLayers = ['eyebrow', 'goal-badge', 'tool-tag'].map((selector) => {
    const blocks = [...css.matchAll(new RegExp(`\\.${selector}\\s*\\{([^}]+)\\}`, 'g'))];
    const color = blocks.map((block) =>
      block[1].match(/background:\s*rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
    ).find(Boolean);
    assert.ok(color, `${selector}: badge background`);
    return { rgb: color.slice(1, 4).map(Number), alpha: Number(color[4]) };
  });

  const rgb = (hex) => {
    assert.match(hex, /^#[0-9a-f]{6}$/i);
    return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  };
  const blend = (background, foreground, alpha) =>
    background.map((channel, index) => channel * (1 - alpha) + foreground[index] * alpha);
  const luminance = (color) => {
    const linear = color.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (first, second) => {
    const [bright, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (bright + 0.05) / (dark + 0.05);
  };
  const base = variableBlock(root[1]);
  const sharedLight = variableBlock(light[1]);
  for (const theme of ['dark', 'light', 'sky', 'sunrise', 'mint']) {
    const selector = new RegExp(`html\\[data-theme="${theme}"\\]\\s*\\{([^}]+)\\}`);
    const override = ['sky', 'sunrise', 'mint'].includes(theme)
      ? css.slice(light.index + light[0].length).match(selector)
      : null;
    if (['sky', 'sunrise', 'mint'].includes(theme)) assert.ok(override, `${theme}: theme declarations exist`);
    const vars = { ...base, ...(theme === 'dark' ? {} : sharedLight), ...(override ? variableBlock(override[1]) : {}) };
    const stops = vars['body-grad'].match(/#[0-9a-f]{6}/gi);
    assert.equal(stops?.length, 2, `${theme}: two body gradient stops`);
    const backgrounds = [];
    for (const stop of stops) {
      for (const rightAlpha of [0, overlays[1].alpha]) {
        for (const leftAlpha of [0, overlays[0].alpha]) {
          backgrounds.push(blend(blend(rgb(stop), overlays[1].rgb, rightAlpha), overlays[0].rgb, leftAlpha));
        }
      }
    }
    // Independent channel bounds cover every intermediate position in the gradients.
    const background = [0, 1, 2].map((index) =>
      Math[theme === 'dark' ? 'max' : 'min'](...backgrounds.map((color) => color[index]))
    );
    for (const color of ['muted', 'text']) {
      const ratio = contrast(rgb(vars[color]), background);
      assert.ok(ratio >= 4.5, `${theme}: legal ${color} text contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
    }
    const accentReference = vars['accent-text'].match(/^var\(--([\w-]+)\)$/);
    assert.ok(accentReference, `${theme}: accent text color reference`);
    const accent = rgb(vars[accentReference[1]]);
    const panels = [...vars['accent-panel'].matchAll(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g)]
      .map((match) => blend(background, match.slice(1, 4).map(Number), Number(match[4])));
    assert.equal(panels.length, 2, `${theme}: two accent-panel gradient stops`);
    const panelBackground = [0, 1, 2].map((index) =>
      Math[theme === 'dark' ? 'max' : 'min'](...panels.map((color) => color[index]))
    );
    const surfaces = [['body', background], ['accent panel', panelBackground]];
    for (const badge of badgeLayers) {
      const tinted = blend(background, badge.rgb, badge.alpha);
      surfaces.push(['badge', [0, 1, 2].map((index) =>
        Math[theme === 'dark' ? 'max' : 'min'](background[index], tinted[index])
      )]);
    }
    for (const [surface, color] of surfaces) {
      const ratio = contrast(accent, color);
      assert.ok(ratio >= 4.5, `${theme}: accent text on ${surface} contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
    }
  }
});

test('project backup instructions, errors and accessible labels are translated', async () => {
  const component = await readWeb('components/project-backup.tsx');
  const model = await readWeb('lib/project-backup.ts');
  const phrases = new Set([
    ...[...component.matchAll(/\btr\('([^']+)'/g)].map((match) => match[1]),
    ...[...model.matchAll(/new Error\('([^']+)'\)/g)].map((match) => match[1]),
    'Could not create the backup. Check browser storage and retry.',
    'Could not read the backup file. Check the file and retry.',
    'Could not restore the backup. Check browser storage and retry.',
    'Learning resources', 'See more learning goals', 'More practice tools and resources',
    'Search and comparison require JavaScript. You can browse the tools below while they load.',
    'Tutorial progress', 'Open navigation menu', 'Close navigation menu',
    'Main navigation', 'Footer links',
    'This certificate reflects steps you marked complete. It is not independently assessed or an accredited qualification.',
    'English, French, German and Spanish. Use the language switcher in the header. Some lessons and downloads remain in English.'
  ]);
  for (const locale of locales) {
    const book = await readJson(`content/translations/ui-${locale}.json`);
    for (const phrase of phrases) {
      assert.ok(book[phrase] && book[phrase] !== phrase, `${locale}: missing translation for "${phrase}"`);
      assert.doesNotMatch(book[phrase], /\p{L}\?\p{L}|\uFFFD/u, `${locale}: corrupted characters in "${phrase}"`);
      const placeholders = (value) => [...value.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort();
      assert.deepEqual(placeholders(book[phrase]), placeholders(phrase), `${locale}: placeholders in "${phrase}"`);
    }
  }
  assert.match(component, /nothing is uploaded or overwritten/i);
  assert.match(component, /window\.confirm/);
  assert.doesNotMatch(component, /fetch\(|supabase|upload.*\(/i);
  const tutorial = await readWeb('components/tutorial-steps.tsx');
  assert.match(tutorial, /not independently assessed or an accredited qualification/);
  assert.match(tutorial, /aria-label=\{tr\('Tutorial progress'\)\}/);
});

test('tool directory has a link-based fallback while interactive filters load', async () => {
  const page = await readWeb('app/tools/page.tsx');
  assert.match(page, /<Suspense fallback=\{[\s\S]*tools\.map\([\s\S]*<Link href=\{`\/tools\//);
  assert.match(page, /tool-fallback/);
  assert.match(page, /Search and comparison require JavaScript/);
});
