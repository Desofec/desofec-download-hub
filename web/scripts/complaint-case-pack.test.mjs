import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../lib/complaint-case-pack.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
});
const {
  buildComplaintCasePack,
  canAddComplaintContact,
  canDownloadComplaintPractice,
  complaintContactChannels,
  complaintEvidenceOptions,
  complaintOutcomeOptions,
  complaintPracticeReducer,
  initialComplaintPractice,
  complaintPracticeFields,
  missingComplaintPracticeFields
} = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

async function complaintInterfacePhrases() {
  const phrases = new Set();
  const files = [
    '../components/complaint-case-pack.tsx',
    '../app/business-launchpad/complaint-case-pack/page.tsx'
  ];
  for (const path of files) {
    const text = await readFile(new URL(path, import.meta.url), 'utf8');
    const sourceFile = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function collect(node) {
      if (ts.isCallExpression(node) && node.expression.getText(sourceFile) === 'tr') {
        const argument = node.arguments[0];
        if (argument && ts.isStringLiteral(argument)) phrases.add(argument.text);
      }
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sourceFile) === 'ComplaintTr') {
        const content = node.children
          .filter(ts.isJsxText)
          .map((child) => child.text.replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(' ')
          .replaceAll('&apos;', "'")
          .replaceAll('&amp;', '&');
        if (content) phrases.add(content);
      }
      if (ts.isPropertyAssignment(node) && ['title', 'description'].includes(node.name.getText(sourceFile))
        && ts.isStringLiteral(node.initializer)) phrases.add(node.initializer.text);
      if (ts.isCallExpression(node) && ['setError', 'setNotice', 'setContactError'].includes(node.expression.getText(sourceFile))) {
        const argument = node.arguments[0];
        if (argument && ts.isStringLiteral(argument) && argument.text) phrases.add(argument.text);
      }
      if (ts.isReturnStatement(node) && node.expression && ts.isStringLiteral(node.expression)) {
        phrases.add(node.expression.text);
      }
      ts.forEachChild(node, collect);
    }
    collect(sourceFile);
  }
  for (const field of complaintPracticeFields) {
    phrases.add(field.label);
    phrases.add(field.hint);
    phrases.add(field.missing);
  }
  for (const option of [...complaintEvidenceOptions, ...complaintContactChannels, ...complaintOutcomeOptions]) {
    phrases.add(option.label);
  }
  return phrases;
}

test('translated practice exports preserve entered facts, statuses and safeguards', async () => {
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/complaint-pack-${locale}.json`, import.meta.url), 'utf8'));
    const seen = new Set();
    const translate = (text) => {
      seen.add(text);
      assert.ok(book[text]?.trim(), `${locale}: missing ${text}`);
      return book[text];
    };
    const initial = initialComplaintPractice();
    const blank = {
      ...initial,
      nextAction: '',
      inputs: { business: '', issue: '', timeline: '', contact: '', outcome: '' }
    };
    const blankPack = buildComplaintCasePack(blank, translate);
    assert.ok(blankPack.startsWith(book['FICTIONAL PRACTICE CASE PACK - DO NOT SEND']));
    assert.ok(blankPack.includes(book['This exercise is not legal advice. No documents have been uploaded or verified.']));
    assert.ok(blankPack.includes(book['This date is not a legal deadline. No reminder or contact will be sent.']));

    const state = {
      ...initial,
      inputs: { business: 'EXAMPLE-TEST', issue: 'ISSUE-TEST', timeline: 'TIMELINE-TEST', contact: 'CONTACT-TEST', outcome: 'REQUEST-TEST' },
      evidence: { order: true, payment: false, delivery: true, messages: false },
      contacts: complaintContactChannels.map((channel, index) => ({
        id: index + 1, date: `2026-06-0${index + 1}`, channel: channel.value, summary: `NOTE-${index}`
      })),
      reviewDate: '2026-06-19',
      nextAction: 'NEXT-TEST'
    };
    const before = JSON.stringify(state);
    for (const status of complaintOutcomeOptions) {
      const pack = buildComplaintCasePack({ ...state, outcome: status.value }, translate);
      for (const fact of [...Object.values(state.inputs), state.reviewDate, state.nextAction]) {
        assert.ok(pack.includes(fact), `${locale}: ${fact}`);
      }
      assert.ok(pack.includes(book[status.label]), `${locale}: selected status`);
      assert.ok(pack.includes(book['Selections are not attachments, proof of possession or legal requirements.']));
    }
    buildComplaintCasePack({
      ...state, evidence: { order: true, payment: true, delivery: true, messages: true }
    }, translate);
    assert.equal(JSON.stringify(state), before);
    assert.ok(seen.size > 40, `${locale}: exercise all pack phrases`);
  }
});

test('all complaint interface, example, error and metadata phrases have French, German and Spanish translations', async () => {
  const phrases = await complaintInterfacePhrases();
  for (const locale of ['fr', 'de', 'es']) {
    const raw = await readFile(new URL(`../content/translations/complaint-pack-${locale}.json`, import.meta.url), 'utf8');
    const keys = [...raw.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:/gm)].map((match) => JSON.parse(`"${match[1]}"`));
    assert.equal(new Set(keys).size, keys.length, `${locale}: duplicate translation keys`);
    const book = JSON.parse(raw);
    for (const phrase of phrases) assert.ok(book[phrase]?.trim(), `${locale}: missing ${phrase}`);
  }
});

test('language changes localize only untouched sample text and preserve learner evidence and IDs', async () => {
  const initial = initialComplaintPractice();
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/complaint-pack-${locale}.json`, import.meta.url), 'utf8'));
    const translated = {
      ...initial,
      inputs: {
        ...initial.inputs,
        issue: book[initial.inputs.issue],
        timeline: book[initial.inputs.timeline],
        outcome: book[initial.inputs.outcome]
      },
      nextAction: book[initial.nextAction]
    };
    assert.ok(translated.inputs.issue && translated.inputs.timeline && translated.inputs.outcome && translated.nextAction, locale);
    let learnerState = {
      ...initial,
      inputs: { ...initial.inputs, issue: 'USER-ENTERED-FACT', contact: 'CONTACT-FACT' },
      evidence: { ...initial.evidence, payment: true },
      contacts: [{ id: 8, date: '2026-06-08', channel: 'email', summary: 'TIMELINE-FACT' }],
      nextContactId: 9,
      outcome: 'action-promised',
      reviewed: true
    };
    learnerState = complaintPracticeReducer(learnerState, {
      type: 'localize-sample',
      previous: initial,
      next: translated
    });
    assert.equal(learnerState.inputs.issue, 'USER-ENTERED-FACT');
    assert.equal(learnerState.inputs.contact, 'CONTACT-FACT');
    assert.equal(learnerState.inputs.timeline, translated.inputs.timeline);
    assert.equal(learnerState.inputs.outcome, translated.inputs.outcome);
    assert.equal(learnerState.nextAction, translated.nextAction);
    assert.equal(learnerState.outcome, 'action-promised');
    assert.deepEqual(learnerState.evidence, { order: false, payment: true, delivery: false, messages: false });
    assert.deepEqual(learnerState.contacts, [{ id: 8, date: '2026-06-08', channel: 'email', summary: 'TIMELINE-FACT' }]);
    assert.equal(learnerState.nextContactId, 9);
    assert.equal(learnerState.reviewed, false);
  }
});

test('changing language preserves edited sample fields even when their text matches the original', () => {
  const initial = initialComplaintPractice();
  const french = {
    ...initial,
    inputs: { ...initial.inputs, issue: 'FR issue', timeline: 'FR timeline', outcome: 'FR outcome' },
    nextAction: 'FR next action'
  };
  let state = complaintPracticeReducer(initial, { type: 'edit', field: 'issue', value: 'A different issue' });
  state = complaintPracticeReducer(state, { type: 'edit', field: 'issue', value: initial.inputs.issue });
  state = complaintPracticeReducer(state, { type: 'follow-up', field: 'nextAction', value: initial.nextAction });
  state = complaintPracticeReducer(state, { type: 'edit', field: 'contact', value: 'No previous contact.' });
  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  state = complaintPracticeReducer(state, { type: 'localize-sample', previous: initial, next: french });
  assert.equal(state.inputs.issue, initial.inputs.issue);
  assert.equal(state.nextAction, initial.nextAction);
  assert.equal(state.inputs.timeline, french.inputs.timeline);
  assert.equal(state.inputs.outcome, french.inputs.outcome);
  assert.equal(state.reviewed, false);

  state = complaintPracticeReducer(state, { type: 'localize-sample', previous: french, next: initial });
  assert.equal(state.inputs.issue, initial.inputs.issue);
  assert.equal(state.inputs.timeline, initial.inputs.timeline);
  assert.equal(state.nextAction, initial.nextAction);

  state = complaintPracticeReducer(state, { type: 'reset', practice: french });
  state = complaintPracticeReducer(state, { type: 'localize-sample', previous: french, next: initial });
  assert.equal(state.inputs.issue, initial.inputs.issue);
  assert.equal(state.nextAction, initial.nextAction);
  assert.deepEqual(state.editedSampleFields, {});
});

test('missing practice facts stay visible instead of becoming invented facts', () => {
  const state = initialComplaintPractice();
  assert.deepEqual(missingComplaintPracticeFields(state.inputs).map((field) => field.key), ['contact']);
  const pack = buildComplaintCasePack(state);
  assert.match(pack, /FICTIONAL PRACTICE CASE PACK - DO NOT SEND/);
  assert.match(pack, /\[Add previous contact or say there has been none\]/);
  assert.doesNotMatch(pack, /I have contacted you twice|you must refund|you are entitled/i);

  const blank = {
    ...state,
    inputs: { business: ' \t ', issue: '', timeline: '\n', contact: '  ', outcome: '' }
  };
  assert.equal(missingComplaintPracticeFields(blank.inputs).length, 5);
  const blankPack = buildComplaintCasePack(blank);
  assert.match(blankPack, /\[Add a fictional business name\]/);
  assert.match(blankPack, /\[Describe the fictional problem\]/);
  assert.doesNotMatch(blankPack, /Example Home Store|shelving order|6 May/);
});

test('case pack uses entered facts and separates marked from unmarked evidence', () => {
  const state = initialComplaintPractice();
  const inputs = {
    business: 'Fictional Example Shop',
    issue: 'The fictional item arrived damaged.',
    timeline: '1 June: ordered.\n8 June: arrived.',
    contact: 'No previous contact.',
    outcome: 'Please explain the available options.'
  };
  const pack = buildComplaintCasePack({
    ...state,
    inputs,
    evidence: { ...state.evidence, order: true, messages: true }
  });
  for (const value of Object.values(inputs)) assert.ok(pack.includes(value), value);
  assert.match(pack, /Marked in this exercise: Order confirmation or receipt; Previous messages with the business/);
  assert.match(pack, /Not marked in this exercise: Proof of payment; Promised delivery details/);
  assert.match(pack, /Selections are not attachments, proof of possession or legal requirements/);
  assert.doesNotMatch(pack, /I have attached|you must refund|ready to escalate/i);
});

test('download requires a current human review and changes invalidate it', () => {
  let state = initialComplaintPractice();
  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  assert.equal(state.reviewed, false);
  assert.equal(canDownloadComplaintPractice(state), false);

  state = complaintPracticeReducer(state, { type: 'edit', field: 'contact', value: 'No previous contact.' });
  assert.equal(canDownloadComplaintPractice(state), false);
  const beforeReview = state;
  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  assert.equal(canDownloadComplaintPractice(state), true);
  assert.equal(beforeReview.reviewed, false);

  state = complaintPracticeReducer(state, { type: 'evidence', id: 'order', checked: true });
  assert.equal(state.reviewed, false);
  assert.equal(canDownloadComplaintPractice(state), false);
  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  state = complaintPracticeReducer(state, { type: 'edit', field: 'outcome', value: 'Please provide an update.' });
  assert.equal(state.reviewed, false);
  assert.equal(canDownloadComplaintPractice(state), false);

  state = complaintPracticeReducer(state, { type: 'reset' });
  assert.deepEqual(state, initialComplaintPractice());
  assert.equal(canDownloadComplaintPractice(state), false);
  assert.equal(canDownloadComplaintPractice({ ...state, reviewed: true }), false);
});

test('follow-up timeline records dated contacts without inferring the outcome', () => {
  let state = initialComplaintPractice();
  state = complaintPracticeReducer(state, {
    type: 'edit',
    field: 'contact',
    value: 'No earlier contact before starting this tracker.'
  });
  const invalidDate = { date: '2026-02-30', channel: 'email', summary: 'Fictional note.' };
  assert.equal(canAddComplaintContact(invalidDate), false);
  assert.equal(canAddComplaintContact({ ...invalidDate, date: '2026-02-28', summary: '  ' }), false);

  const later = { date: '2026-06-12', channel: 'phone', summary: 'The fictional seller said they would check delivery.' };
  const earlier = { date: '2026-06-08', channel: 'email', summary: 'Asked the fictional seller for an update.' };
  assert.equal(canAddComplaintContact(later), true);
  state = complaintPracticeReducer(state, { type: 'add-contact', contact: later });
  state = complaintPracticeReducer(state, { type: 'add-contact', contact: earlier });
  assert.deepEqual(state.contacts.map(({ id }) => id), [1, 2]);
  assert.equal(state.outcome, 'unresolved', 'a response or promise never auto-marks the issue resolved');

  state = complaintPracticeReducer(state, { type: 'outcome', value: 'action-promised' });
  state = complaintPracticeReducer(state, { type: 'follow-up', field: 'nextAction', value: 'Ask for a delivery update.' });
  state = complaintPracticeReducer(state, { type: 'follow-up', field: 'reviewDate', value: '2026-06-19' });
  const pack = buildComplaintCasePack(state);
  assert.ok(pack.indexOf('2026-06-08 | Email') < pack.indexOf('2026-06-12 | Phone'), 'contacts export in date order');
  assert.match(pack, /Current status selected by the user: Action promised; not confirmed complete/);
  assert.match(pack, /Next action chosen by the user: Ask for a delivery update\./);
  assert.match(pack, /Personal review date chosen by the user: 2026-06-19/);
  assert.match(pack, /This date is not a legal deadline\. No reminder or contact will be sent\./);
  assert.doesNotMatch(pack, /Issue resolved automatically|Legal deadline: 2026-06-19/);

  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  assert.equal(canDownloadComplaintPractice(state), true);
  state = complaintPracticeReducer(state, { type: 'outcome', value: 'reply-received' });
  assert.equal(state.reviewed, false, 'changing the outcome invalidates a previous review');
  state = complaintPracticeReducer(state, { type: 'review', checked: true });
  state = complaintPracticeReducer(state, { type: 'remove-contact', id: 1 });
  assert.equal(state.reviewed, false, 'changing the timeline invalidates a previous review');
  assert.deepEqual(state.contacts.map(({ id }) => id), [2]);
});

test('prototype remains fictional, noindex and reachable with language notices', async () => {
  const component = await readFile(new URL('../components/complaint-case-pack.tsx', import.meta.url), 'utf8');
  const logic = await readFile(new URL('../lib/complaint-case-pack.ts', import.meta.url), 'utf8');
  const page = await readFile(new URL('../app/business-launchpad/complaint-case-pack/page.tsx', import.meta.url), 'utf8');
  const hub = await readFile(new URL('../app/business-launchpad/page.tsx', import.meta.url), 'utf8');
  assert.match(component, /Do not enter real names/);
  assert.match(component, /does not upload documents, send messages, use AI/);
  assert.match(component, /cleared on reload/);
  assert.doesNotMatch(component, /localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest|sendBeacon|dangerouslySetInnerHTML/);
  assert.match(component, /Personal review date \(optional\)/);
  assert.match(component, /A reply is not the same as a completed action or a resolved problem/);
  assert.match(component, /type: 'localize-sample'/);
  assert.match(component, /setReviewedLanguage\(null\)/);
  assert.match(logic, /No reminder or contact will be sent/);
  assert.match(logic, /This date is not a legal deadline/);
  assert.match(page, /index: false/);
  assert.match(page, /example is set in Ireland, not the United Kingdom/);
  assert.match(page, /does not explain UK consumer rights/);
  assert.doesNotMatch(page, /business-launchpad\/complaint-cases/);
  assert.match(page, /does not assess eligibility/);
  assert.match(hub, /business-launchpad\/complaint-case-pack/);
  for (const locale of ['fr', 'de', 'es']) {
    const translations = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    assert.ok(translations['Try the fictional complaint case-pack'], locale);
  }
});
