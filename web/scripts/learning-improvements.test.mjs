import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function contentUrl(relativePath, imports = {}) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  });
  for (const [specifier, dependency] of Object.entries({ '@/lib/pilot-numbers': '../lib/pilot-numbers.ts', ...imports })) {
    if (outputText.includes(`'${specifier}'`)) {
      outputText = outputText.replaceAll(`'${specifier}'`, JSON.stringify(await contentUrl(dependency, imports)));
    }
  }
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

async function loadContent(relativePath, imports = {}) {
  return import(await contentUrl(relativePath, imports));
}

const projectImports = {
  '@/lib/commerce-pilot-plan': '../lib/commerce-pilot-plan.ts',
  '@/lib/commerce-pilot-review': '../lib/commerce-pilot-review.ts',
  '@/lib/commerce-readiness': '../lib/commerce-readiness.ts',
  '@/lib/client-discovery': '../lib/client-discovery.ts',
  '@/lib/case-study': '../lib/case-study.ts',
  '@/lib/automation-projects': '../lib/automation-projects.ts',
  '@/lib/project-review': '../lib/project-review.ts',
  '@/lib/evidence-workbook': '../lib/evidence-workbook.ts',
  '@/lib/pilot-proposal': '../lib/pilot-proposal.ts',
  '@/lib/pilot-results': '../lib/pilot-results.ts'
};
function memoryStorage() {
  const data = new Map();
  return {
    get length() { return data.size; },
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    key: (index) => [...data.keys()][index] ?? null
  };
}
const projectId = '11111111-1111-4111-8111-111111111111';
const translationImports = {
  ...Object.fromEntries(['coding', 'ml-design', 'task-tracker', 'web-nocode', 'practical-fr',
    'practical-de', 'practical-es', 'content-services', 'automation-services',
    'commerce-services', 'cad-services', 'micro-saas', 'education-services',
    'video-business'].map(name =>
    [`@/lib/translations/${name}`, `../lib/translations/${name}.ts`])),
  '@/lib/search-visibility-tutorial': '../lib/search-visibility-tutorial.ts'
};

test('only translated starter kits resolve to localized static downloads', async () => {
  const { starterPackDownloadFile } = await loadContent('../lib/starter-pack-downloads.ts');
  for (const locale of ['en', 'fr', 'de', 'es']) {
    for (const kit of [
      'ai-content-services-kit',
      'ai-automation-services-kit',
      'ai-spreadsheets-kit',
      'ai-commerce-services-kit',
      'ai-video-business-kit',
      'ai-video-creation-kit'
    ]) {
      const file = `downloads/${kit}.md`;
      const expected = locale === 'en' ? file : `downloads/${kit}-${locale}.md`;
      assert.equal(starterPackDownloadFile(kit, file, locale), expected);
    }
  }
  for (const unchanged of ['../../private', '/tmp/file.md', 'image.png']) {
    assert.equal(starterPackDownloadFile('other-kit', unchanged, 'fr'), unchanged);
  }
  const component = await readFile(new URL('../components/starter-pack-download.tsx', import.meta.url), 'utf8');
  const page = await readFile(new URL('../app/starter-packs/[id]/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /<StarterPackDownload packId=\{pack\.id\} file=\{pack\.file\} \/>/);
  assert.match(component, /useLanguage\(\)/);
  assert.match(component, /The downloadable worksheet follows your selected language/);
});

test('commerce tutorials resolve localized titles, intros and lesson content', async () => {
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  for (const tutorialId of ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services']) {
    assert.equal(getTutorialTranslation(tutorialId, 'en'), undefined);
    for (const locale of ['fr', 'de', 'es']) {
      const translation = getTutorialTranslation(tutorialId, locale);
      assert.ok(translation.title.trim());
      assert.ok(translation.intro.trim());
      assert.equal(Object.keys(translation.steps).length, 6);
      assert.ok(Object.values(translation.steps).every(step =>
        step.title && step.explanation.length && step.file && step.code && step.check && step.aiPrompt
      ));
    }
  }
});

test('business-video tutorial resolves complete localized lessons with stable progress IDs', async () => {
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const { videoBusinessSteps } = await loadContent('../lib/video-business-tutorial.ts');
  const ids = videoBusinessSteps.map(({ id }) => id);
  assert.equal(getTutorialTranslation('ai-video-business', 'en'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('ai-video-business', locale);
    assert.ok(translation.title.trim());
    assert.ok(translation.intro.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    for (const source of videoBusinessSteps) {
      const step = translation.steps[source.id];
      assert.equal(step.explanation.length, source.explanation.length);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}/${source.id}.${field}`);
        assert.notEqual(step[field], source[field], `${locale}/${source.id}.${field}`);
      }
      assert.equal('id' in step, false, `${locale}/${source.id}: progress IDs remain unchanged`);
    }
  }
});

test('content-service course translates every field and preserves stable six-step IDs', async () => {
  const { contentServicesSteps } = await loadContent('../lib/business-services-tutorials.ts');
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const ids = ['brief', 'draft', 'quality', 'revisions', 'offer', 'handoff']
    .map(name => `content-service-${name}`);
  assert.deepEqual(contentServicesSteps.map(step => step.id), ids);
  assert.equal(getTutorialTranslation('ai-content-services', 'en'), undefined);
  assert.equal(getTutorialTranslation('not-a-course', 'fr'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('ai-content-services', locale);
    assert.deepEqual(Object.keys(translation.steps), ids);
    assert.match(translation.intro, /90/);
    assert.doesNotMatch(translation.intro, /anglais|Englisch|inglés/);
    for (const sourceStep of contentServicesSteps) {
      const step = translation.steps[sourceStep.id];
      assert.equal(step.explanation.length, sourceStep.explanation.length);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}: ${sourceStep.id}.${field}`);
        assert.notEqual(step[field], sourceStep[field], `${locale}: ${sourceStep.id}.${field}`);
      }
      step.explanation.forEach((paragraph, index) => {
        assert.ok(paragraph.trim());
        assert.notEqual(paragraph, sourceStep.explanation[index]);
      });
      assert.equal('id' in step, false, 'translations must not replace progress IDs');
    }
    const steps = translation.steps;
    assert.match(steps[ids[0]].code, /Cedar Bakery/);
    assert.match(steps[ids[0]].code, /08:00-14:00/);
    assert.match(steps[ids[0]].code, /40-60/);
    assert.match(steps[ids[1]].code, /40-60/);
    assert.match(steps[ids[3]].code, /40-60/);
    assert.match(steps[ids[4]].code, /\(1 \+ 2 \+ 1 \+ 1\) x 20 EUR = 100 EUR/);
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const intro = 'Create three posts and four FAQ answers for a fictional bakery, verify claims and assets, manage revisions and plan an honest service offer. AI drafting is optional. Allow about 90 minutes plus feedback time.';
    assert.equal(translation.intro, book[intro]);
  }
});

test('content-service translations preserve privacy, fact, rights, cost and approval boundaries', async () => {
  const { contentServicesTranslations } = await loadContent('../lib/translations/content-services.ts');
  const safeguards = {
    fr: {
      brief: /ni coordonnées ni informations commerciales confidentielles/,
      allergens: /Ne devinez pas les informations de sécurité/,
      reject: /Ouvert dimanche.*SUPPRIMER\nLivraison disponible.*SUPPRIMER/,
      rights: /sans autorisation/,
      price: /prix non confirmé doit rester en attente/,
      costs: /ni un tarif de marché, ni une recommandation de prix, ni un bénéfice/,
      blocked: /BLOQUÉ, pas RÉUSSI/,
      approval: /Un vrai client doit autoriser la publication séparément/
    },
    de: {
      brief: /keine Kontaktdaten oder vertraulichen Geschäftsinformationen/,
      allergens: /Rate keine Sicherheitsinformationen/,
      reject: /Sonntags geöffnet.*ENTFERNEN\nLieferung verfügbar.*ENTFERNEN/,
      rights: /ohne Genehmigung/,
      price: /unbestätigten Preis bleibt offen/,
      costs: /kein Marktpreis, keine Preisempfehlung und kein Gewinn/,
      blocked: /BLOCKIERT, nicht BESTANDEN/,
      approval: /Ein echter Kunde muss die Veröffentlichung separat freigeben/
    },
    es: {
      brief: /No subas datos de contacto ni información comercial confidencial/,
      allergens: /No adivines información de seguridad/,
      reject: /Abierto el domingo.*ELIMINAR\nEntrega disponible.*ELIMINAR/,
      rights: /sin permiso/,
      price: /precio sin confirmar debe quedar pendiente/,
      costs: /No es una tarifa de mercado, recomendación de precio ni beneficio/,
      blocked: /BLOQUEADO, no APROBADO/,
      approval: /Un cliente real debe aprobar la publicación por separado/
    }
  };
  for (const [locale, expected] of Object.entries(safeguards)) {
    const steps = contentServicesTranslations['ai-content-services'][locale].steps;
    const prose = name => steps[`content-service-${name}`].explanation.join(' ');
    assert.match(prose('brief'), expected.brief);
    assert.match(prose('draft'), expected.allergens);
    assert.match(steps['content-service-quality'].code, expected.reject);
    assert.match(prose('quality'), expected.rights);
    assert.match(prose('revisions'), expected.price);
    assert.match(prose('offer'), expected.costs);
    assert.match(steps['content-service-handoff'].code, expected.blocked);
    assert.match(prose('handoff'), expected.approval);
  }
});

test('CAD concept course translates every field while preserving dimensions and no-manufacture safeguards', async () => {
  const { cadServicesSteps } = await loadContent('../lib/business-services-tutorials.ts');
  const { cadServicesTranslations } = await loadContent('../lib/translations/cad-services.ts');
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const ids = ['cad-service-boundaries', 'cad-service-sketch', 'cad-service-model',
    'cad-service-review', 'cad-service-offer', 'cad-service-handoff'];
  assert.deepEqual(cadServicesSteps.map(step => step.id), ids);
  assert.equal(getTutorialTranslation('ai-cad-services', 'en'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('ai-cad-services', locale);
    assert.ok(translation.title.trim());
    assert.ok(translation.intro.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    for (const sourceStep of cadServicesSteps) {
      const step = translation.steps[sourceStep.id];
      assert.equal(step.explanation.length, sourceStep.explanation.length);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}/${sourceStep.id}.${field}`);
        assert.notEqual(step[field], sourceStep[field], `${locale}/${sourceStep.id}.${field}`);
      }
      step.explanation.forEach((text, index) => {
        assert.ok(text.trim());
        assert.notEqual(text, sourceStep.explanation[index]);
      });
      assert.equal('id' in step, false);
    }

    const steps = translation.steps;
    assert.match(steps[ids[0]].code, /80.*40.*3/);
    assert.match(steps[ids[0]].code, /CONCEPT ONLY - NOT FOR MANUFACTURE/);
    assert.match(steps[ids[1]].code, /80 x 40 mm[\s\S]*3 x 40 mm[\s\S]*80 x 3 mm/);
    assert.match(steps[ids[1]].code, /9600 mm\^3/);
    assert.match(steps[ids[2]].code, /80 x 40/);
    assert.match(steps[ids[2]].code, /extrud|extrusion|extrusión/i);
    assert.match(steps[ids[2]].code, /3/);
    assert.match(steps[ids[3]].code, /v1\s*:\s*80 x 40 x 3 mm\s*;\s*(?:volume|volumen) 9600 mm\^3/i);
    assert.match(steps[ids[3]].code, /v2\s*:\s*90 x 40 x 3 mm\s*;\s*(?:volume|volumen) 10800 mm\^3/i);
    assert.match(steps[ids[3]].code, /2\.25:1/);
    assert.match(steps[ids[4]].explanation.join(' '), /qualified professional|professionnel qualifié|qualifizierten Fachperson|profesional cualificada/);
    assert.match(steps[ids[5]].code, /CONCEPT ONLY - NOT FOR MANUFACTURE/);
  }
  assert.deepEqual(
    Object.keys(cadServicesTranslations['ai-cad-services']),
    ['fr', 'de', 'es']
  );
});

test('micro-SaaS course translations preserve prototype behavior and security boundaries', async () => {
  const { microSaasSteps } = await loadContent('../lib/business-services-tutorials.ts');
  const { microSaasTranslations } = await loadContent('../lib/translations/micro-saas.ts');
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const ids = ['saas-problem-evidence', 'saas-scope', 'saas-local-prototype',
    'saas-test-costs', 'saas-user-validation', 'saas-decision'];
  assert.deepEqual(microSaasSteps.map(step => step.id), ids);
  assert.equal(getTutorialTranslation('micro-saas-validation', 'en'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('micro-saas-validation', locale);
    assert.ok(translation.title.trim());
    assert.ok(translation.intro.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    for (const sourceStep of microSaasSteps) {
      const step = translation.steps[sourceStep.id];
      assert.equal(step.explanation.length, sourceStep.explanation.length);
      assert.ok(step.file.trim());
      if (sourceStep.id === 'saas-local-prototype') {
        assert.equal(step.file, sourceStep.file);
      } else {
        assert.notEqual(step.file, sourceStep.file);
      }
      for (const field of ['title', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}/${sourceStep.id}.${field}`);
        assert.notEqual(step[field], sourceStep[field], `${locale}/${sourceStep.id}.${field}`);
      }
      step.explanation.forEach((text, index) => {
        assert.ok(text.trim());
        assert.notEqual(text, sourceStep.explanation[index]);
      });
      assert.equal('id' in step, false);
    }

    const prototype = translation.steps['saas-local-prototype'].code;
    assert.match(prototype, new RegExp(`<html lang="${locale}">`));
    assert.match(prototype, /maxlength="40"/);
    assert.match(prototype, /option value="Draft"/);
    assert.match(prototype, /option value="Review"/);
    assert.match(prototype, /textContent/);
    assert.match(prototype, /`Project: \$\{name\}\\nStatus: \$\{status\}`/);
    assert.doesNotMatch(prototype, /innerHTML|fetch\(|localStorage|https?:\/\//);
    assert.match(translation.steps['saas-scope'].code, /1-40/);
    assert.match(translation.steps['saas-test-costs'].code, /40 characters|40 caractères|40 Zeichen|40 caracteres/);
    assert.match(translation.steps['saas-user-validation'].code, /UNVALIDATED/);
    assert.match(translation.steps['saas-decision'].code, /NOT BUILT/);
  }
  assert.deepEqual(Object.keys(microSaasTranslations['micro-saas-validation']), ['fr', 'de', 'es']);
});

test('AI education course translates every lesson while preserving evidence and learner safeguards', async () => {
  const { educationServicesSteps } = await loadContent('../lib/business-services-tutorials.ts');
  const { educationServicesTranslations } = await loadContent('../lib/translations/education-services.ts');
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const ids = ['education-service-audience', 'education-service-materials',
    'education-service-answer-key', 'education-service-trial', 'education-service-offer',
    'education-service-review'];
  assert.deepEqual(educationServicesSteps.map(step => step.id), ids);
  assert.equal(getTutorialTranslation('ai-education-services', 'en'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('ai-education-services', locale);
    assert.ok(translation.title.trim());
    assert.ok(translation.intro.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    for (const sourceStep of educationServicesSteps) {
      const step = translation.steps[sourceStep.id];
      assert.equal(step.explanation.length, sourceStep.explanation.length);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}/${sourceStep.id}.${field}`);
        assert.notEqual(step[field], sourceStep[field], `${locale}/${sourceStep.id}.${field}`);
      }
      step.explanation.forEach((text, index) => {
        assert.ok(text.trim());
        assert.notEqual(text, sourceStep.explanation[index]);
      });
      assert.equal('id' in step, false);
    }

    const steps = translation.steps;
    assert.match(steps[ids[0]].code, /15/);
    assert.match(steps[ids[1]].code, /10:00[\s\S]*30[\s\S]*12/);
    assert.match(steps[ids[1]].code, /3 min[\s\S]*5 min[\s\S]*4 min[\s\S]*3 min|3 Min[\s\S]*5 Min[\s\S]*4 Min[\s\S]*3 Min/);
    assert.match(steps[ids[2]].code, /60[\s\S]*30/);
    assert.match(steps[ids[2]].code, /0-4/);
    assert.match(steps[ids[3]].code, /NOT RUN/);
    assert.match(steps[ids[3]].code, /No learner names|Aucun nom|Keine Namen|No se guardan nombres/);
    assert.match(steps[ids[4]].explanation.join(' '), /accréditation|Akkreditierung|acreditación/);
    assert.match(steps[ids[5]].explanation.join(' '), /0-4/);
  }
  assert.deepEqual(Object.keys(educationServicesTranslations['ai-education-services']), ['fr', 'de', 'es']);
});

test('automation course translates every lesson field with stable progress IDs and matching directory descriptions', async () => {
  const { automationServicesSteps } = await loadContent('../lib/automation-services-tutorial.ts');
  const { getTutorialTranslation } = await loadContent('../lib/tutorial-translations.ts', translationImports);
  const ids = ['validate-one-problem', 'define-safe-pilot', 'build-test-demo',
    'calculate-pilot-cost', 'prepare-honest-offer', 'handover-review-pilot'];
  assert.deepEqual(automationServicesSteps.map(step => step.id), ids);
  assert.equal(getTutorialTranslation('ai-automation-services', 'en'), undefined);
  for (const locale of ['fr', 'de', 'es']) {
    const translation = getTutorialTranslation('ai-automation-services', locale);
    assert.ok(translation.title.trim());
    assert.deepEqual(Object.keys(translation.steps), ids);
    assert.doesNotMatch(translation.intro, /anglais|Englisch|inglés/);
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const intro = 'Choose customer enquiry tracking, appointment reminder automation or automated weekly business reports. Practise with fictional data, calculate costs and prepare a bounded offer. Allow about two hours for one project; discovery and external tool setup take additional time. No paid AI or live sending.';
    assert.equal(translation.intro, book[intro]);
    for (const sourceStep of automationServicesSteps) {
      const step = translation.steps[sourceStep.id];
      assert.equal(step.explanation.length, sourceStep.explanation.length, `${locale}/${sourceStep.id}`);
      for (const field of ['title', 'file', 'code', 'check', 'aiPrompt']) {
        assert.ok(step[field]?.trim(), `${locale}/${sourceStep.id}/${field}`);
        assert.notEqual(step[field], sourceStep[field], `${locale}/${sourceStep.id}/${field}`);
      }
      step.explanation.forEach((text, index) => {
        assert.ok(text.trim());
        assert.notEqual(text, sourceStep.explanation[index]);
      });
      assert.equal('id' in step, false);
    }
  }
});

test('automation translated examples keep exact identifiers, event outcomes, UTC boundaries and cost arithmetic', async () => {
  const { automationServicesTranslations } = await loadContent('../lib/translations/automation-services.ts');
  const { processEnquiry, reminderClock, reconcileWeek, reportRows } = await loadContent('../lib/automation-practice.ts');
  assert.equal(reminderClock, '2030-01-07T09:00:00.000Z');
  assert.equal(reconcileWeek(reportRows).knownCents, 2100);
  assert.equal(reconcileWeek(reportRows).unresolved, 1);
  assert.equal(reconcileWeek(reportRows.map(row => row.id === 'O5' ? { ...row, quantity: 2 } : row)).knownCents, 2900);
  for (const [locale, translation] of Object.entries(automationServicesTranslations['ai-automation-services'])) {
    const steps = translation.steps;
    const scope = steps['define-safe-pilot'];
    assert.match(scope.code, /event_id, message/);
    assert.match(scope.explanation[0], /2030-01-07 09:00 UTC/);
    assert.match(scope.explanation[0], /2030-01-07.*2030-01-13/);
    assert.match(scope.explanation[0], /0.*24/);
    const demo = steps['build-test-demo'];
    const eventLines = demo.code.split('\n').filter(line => /^E\d \|/.test(line));
    const events = eventLines.map(line => {
      const [id, message, outcome] = line.split(' | ');
      return [id, message, outcome.split(';')[0].trim()];
    });
    assert.equal(events.length, 6, locale);
    assert.deepEqual(events.map(([id, , status]) => [id, status]), [
      ['E1', 'QUEUED'], ['E1', 'DUPLICATE'], ['E2', 'INVALID'],
      ['E3', 'REVIEW'], ['E4', 'QUEUED'], ['E5', 'REVIEW']
    ], locale);
    assert.equal(events[0][1], events[1][1], 'duplicate text stays identical');
    let rows = [];
    for (const [id, message, status] of events) {
      const previousLength = rows.length;
      const result = processEnquiry(rows, {
        id, message: status === 'INVALID' ? '' : message,
        decision: status === 'REVIEW' ? 'review' : 'draft'
      }, { enabled: true, failWrite: false });
      rows = result.rows;
      if (status === 'INVALID' || status === 'DUPLICATE') assert.equal(rows.length, previousLength);
      else assert.equal(rows.at(-1).status, status);
    }
    assert.deepEqual(rows.map(row => row.id), ['E1', 'E3', 'E4', 'E5']);
    assert.deepEqual(rows.filter(row => row.draft).map(row => row.id), ['E1', 'E4']);
    assert.match(demo.code, /2 QUEUED, 1 DUPLICATE, 1 INVALID, 2 REVIEW/);
    assert.match(demo.code, /E1, E3, E4, E5 \(4/);
    assert.match(demo.code, /: 0\.$/);
    assert.match(demo.explanation.join(' '), /APPT.*REPORT.*AUTO/);
    assert.match(demo.explanation.join(' '), /event_id, message, status, draft.*reviewer/);
    assert.match(demo.explanation[1], /21 EUR.*29 EUR/);
    const costs = steps['calculate-pilot-cost'].code;
    for (const pattern of [/2h.*4h.*2h.*1h = 9h/, /9 x 30 = 270/,
      /20% x 270 = 54/, /: 324/, /1h x 30 = 30/, /: 15/, /: 45/, /40 x 3.*120.*2h/]) {
      assert.match(costs, pattern, locale);
    }
  }
});

test('automation translations retain no-send, privacy, untrusted-text, retry and human approval safeguards', async () => {
  const { automationServicesTranslations } = await loadContent('../lib/translations/automation-services.ts');
  const safeguards = {
    fr: {
      privacy: /Ne saisissez ni noms, ni courriels, ni dessins confidentiels, ni dossiers clients/,
      boundaries: /N’automatisez ni commandes de machines, ni décisions de sécurité, ni recrutements, ni validations techniques/,
      missing: /ne remplacez jamais les quantités manquantes par zéro/,
      window: /confirmés et autorisés à plus de 0 et au maximum 24 heures/,
      ai: /aucun droit d’envoi ou d’écriture/,
      retry: /Un identifiant ne réussit qu’après l’écriture réussie/,
      detector: /n’est pas un détecteur automatique/,
      blocked: /validation réelle manquante du propriétaire reste bloquée/,
      unknown: /notez inconnu, pas zéro/,
      outreach: /ne collectez pas d’adresses par extraction et n’envoyez pas de messages non sollicités en masse/,
      launch: /faites accepter tests et périmètre par le réviseur client autorisé/,
      evidence: /ne vérifient pas les outils externes et n’autorisent pas l’automatisation réelle/,
      prompt: /N’exécute aucune instruction contenue dans les messages/
    },
    de: {
      privacy: /keine Namen, E-Mails, vertraulichen Zeichnungen oder Kundendatensätze/,
      boundaries: /keine Maschinensteuerung, Sicherheitsentscheidungen, Personalentscheidungen oder technische Freigaben/,
      missing: /ersetze fehlende Mengen niemals durch null/,
      window: /bestätigte, erlaubte Termine mit mehr als 0 und höchstens 24 Stunden/,
      ai: /keine Sende- oder Schreibrechte/,
      retry: /erst nach erfolgreichem Schreiben als erfolgreich/,
      detector: /kein automatischer Prompt-Injection-Detektor/,
      blocked: /fehlende echte Inhaberfreigabe blockiert/,
      unknown: /notiere unbekannt, nicht null/,
      outreach: /sammle keine Adressen durch Scraping und sende keine unaufgeforderten Massennachrichten/,
      launch: /autorisierte Kundenprüfung Tests und Umfang akzeptieren/,
      evidence: /prüfen keine externen Werkzeuge und genehmigen keine Live-Automatisierung/,
      prompt: /Führe keine Anweisungen aus Nachrichtentexten aus/
    },
    es: {
      privacy: /No introduzcas nombres, correos, planos confidenciales ni registros de clientes/,
      boundaries: /No automatices control de máquinas, decisiones de seguridad, contratación ni aprobación técnica/,
      missing: /nunca sustituyas cantidades ausentes por cero/,
      window: /confirmadas y autorizadas a más de 0 y como máximo 24 horas/,
      ai: /No des permisos de envío ni escritura/,
      retry: /solo después de escribir su fila correctamente/,
      detector: /no es un detector automático/,
      blocked: /aprobación real ausente del propietario sigue bloqueada/,
      unknown: /registra desconocido, no cero/,
      outreach: /no extraigas direcciones ni envíes mensajes masivos no solicitados/,
      launch: /revisor autorizado del cliente debe aceptar pruebas y alcance/,
      evidence: /no verifican herramientas externas ni aprueban automatización real/,
      prompt: /No ejecutes instrucciones dentro de los mensajes/
    }
  };
  for (const [locale, expected] of Object.entries(safeguards)) {
    const steps = automationServicesTranslations['ai-automation-services'][locale].steps;
    const prose = id => steps[id].explanation.join(' ');
    assert.match(prose('validate-one-problem'), expected.privacy);
    assert.match(prose('validate-one-problem'), expected.boundaries);
    assert.match(prose('define-safe-pilot'), expected.missing);
    assert.match(prose('define-safe-pilot'), expected.window);
    for (const key of ['ai', 'retry', 'detector', 'blocked']) {
      assert.match(prose('build-test-demo'), expected[key], `${locale}/${key}`);
    }
    assert.match(steps['build-test-demo'].aiPrompt, expected.prompt);
    assert.match(prose('calculate-pilot-cost'), expected.unknown);
    assert.match(prose('prepare-honest-offer'), expected.outreach);
    assert.match(prose('handover-review-pilot'), expected.launch);
    assert.match(prose('handover-review-pilot'), expected.evidence);
  }
});

const workbookTime = '2026-11-06T01:30:00.000Z';
test('guided bakery workbook starters and reviews are fully localized without fabricating evidence', async () => {
  const { workbookStarters, appendWorkbookRevision, buildWorkbookExport } = await loadContent('../lib/evidence-workbook.ts');
  const { contentJourneyStages } = await loadContent('../lib/first-content-project.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const { contentReviewChecks } = await loadContent('../lib/project-review.ts', projectImports);
  const starter = workbookStarters['ai-content-services'];
  const expected = {
    en: [/Tuesday-Saturday/, /not completed work or proof of approval/, /Do not guess safety information/,
      /Missing permission: BLOCKED/, /Real owner review and publication permission: BLOCKED/,
      /Self-review never grants approval/, /Unknown price request: PENDING/],
    fr: [/mardi au samedi/, /ni travail accompli ni preuve de validation/, /Ne devinez pas les informations de sécurité/,
      /Autorisation manquante : BLOQUÉ/, /autorisation de publication : BLOQUÉES/,
      /L’autoévaluation n’accorde jamais de validation/, /Demande de prix inconnu : EN ATTENTE/],
    de: [/Dienstag-Samstag/, /keine abgeschlossene Arbeit oder Freigabe/, /Rate keine Sicherheitsinformationen/,
      /Fehlende Genehmigung: BLOCKIERT/, /Veröffentlichungsfreigabe: BLOCKIERT/,
      /Selbstprüfung erteilt niemals Freigabe/, /Unbekannter Preis angefragt: OFFEN/],
    es: [/martes-sábado/, /no es trabajo terminado ni prueba de aprobación/, /No adivines información de seguridad/,
      /Permiso ausente: BLOQUEADO/, /permiso de publicación: BLOQUEADOS/,
      /La autorrevisión nunca concede aprobación/, /Petición de precio desconocido: PENDIENTE/]
  };
  const notes = [
    'Bakery guidance, starter worksheets and review checks follow your language. Saved titles, drafts, evidence and earlier revisions remain exactly as you wrote them. Choose Use this service text starter to load a blank worksheet in the current language; confirm replacement and save explicitly. Nothing is translated or overwritten automatically.',
    'Bakery review instructions follow your language; saved drafts, observations and correction evidence are not automatically translated. Missing real owner approval stays blocked. A self-checked item is not permission to publish.'
  ];
  for (const locale of ['en', 'fr', 'de', 'es']) {
    const book = locale === 'en' ? {} : {
      ...JSON.parse(await readFile(new URL(`../content/translations/catalog-${locale}.json`, import.meta.url), 'utf8')),
      ...JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'))
    };
    const tr = text => locale === 'en' ? text : book[text] ?? text;
    const body = tr(starter.text);
    assert.ok(body.length <= 8000);
    for (const pattern of expected[locale]) assert.match(body, pattern, locale);
    assert.match(body, /08:00-14:00/);
    assert.equal((body.match(/40-60/g) ?? []).length, 4);
    assert.deepEqual([...body.matchAll(/FAQ ([1-4])/g)].map(match => match[1]), ['1', '2', '3', '4']);
    assert.match(body, /v1.*v2/);
    const workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Original evidence', 'UNCHANGED_USER_EVIDENCE', workbookTime);
    const next = appendWorkbookRevision(workbook, 'item-1', tr(starter.title), body, workbookTime);
    assert.equal(next.items[0].revisions[0].body, 'UNCHANGED_USER_EVIDENCE');
    assert.equal(workbook.items[0].revisions.length, 1);
    assert.equal(next.items[0].links.length, 0);
    const exported = buildWorkbookExport(next, 'Unchanged project title', [], tr);
    assert.ok(exported.includes(body));
    assert.ok(exported.includes('UNCHANGED_USER_EVIDENCE'));
    if (locale === 'en') continue;
    for (const text of [starter.title, starter.text, ...notes,
      ...contentJourneyStages.flatMap(stage => [stage.title, stage.instruction, stage.action, stage.link]),
      ...contentReviewChecks.flatMap(check => [check.label, check.instruction])]) {
      assert.ok(book[text]?.trim(), `${locale}: ${text}`);
      assert.notEqual(book[text], text);
    }
    assert.ok(tr(notes[0]).includes(tr('Use this service text starter')));
  }
});

test('discovery fit never grants acceptance and requires every check, complete brief and evidence', async () => {
  const { emptyDiscovery, readDiscovery, discoveryFit, discoveryFields, fitChecks, buildDiscoveryReport } = await loadContent('../lib/client-discovery.ts', projectImports);
  const draft = emptyDiscovery();
  assert.equal(discoveryFit(draft).missing, 6);
  assert.equal(discoveryFit(draft).ready, false);
  for (const { id } of fitChecks) draft.fit[id] = 'yes';
  assert.equal(discoveryFit(draft).ready, false);
  for (const { key } of discoveryFields) draft.brief[key] = `Fictional ${key}`;
  assert.equal(discoveryFit(draft).ready, false, 'Yes without evidence is not ready');
  draft.fitEvidence = 'Self-recorded bounded sample evidence';
  assert.equal(discoveryFit(draft).ready, true);
  for (const { id } of fitChecks) {
    for (const status of ['no', 'unknown']) {
      draft.fit[id] = status;
      assert.equal(discoveryFit(draft).ready, false, `${id}: ${status}`);
    }
    draft.fit[id] = 'yes';
  }
  for (const { key } of discoveryFields) {
    const text = draft.brief[key];
    draft.brief[key] = ' ';
    assert.equal(discoveryFit(draft).ready, false, key);
    draft.brief[key] = text;
  }
  const report = buildDiscoveryReport(draft, (s) => s);
  assert.match(report, /Continue scoping, not approval/);
  assert.match(report, /PROPOSED CHANGE - NOT ACCEPTED/);
  assert.match(report, /\[TO CONFIRM\]/);
  assert.deepEqual(readDiscovery(draft), draft);
  for (const invalid of [null, [], {}, { ...draft, version: 2 }, { ...draft, brief: null },
    { ...draft, fit: { ...draft.fit, skill: 'approved' } }, { ...draft, fitEvidence: 2 },
    { ...draft, fitEvidence: 'x'.repeat(2001) }, { ...draft, change: [] },
    { ...draft, brief: { ...draft.brief, problem: 'x'.repeat(2001) } },
    { ...draft, change: { ...draft.change, request: 'x'.repeat(2001) } }]) {
    assert.throws(() => readDiscovery(invalid), /Invalid saved discovery/);
  }
});

test('discovery persistence is optional, conflict-safe and isolated from other project parts', async () => {
  const { newPilotProject, saveProject, loadProject, saveProjectPart, readPilotProject, deleteProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { emptyDiscovery } = await loadContent('../lib/client-discovery.ts', projectImports);
  const storage = memoryStorage();
  const project = newPilotProject(projectId, 'ai-spreadsheets', 'Fictional scoping');
  assert.equal('discovery' in readPilotProject(JSON.stringify(project)), false);
  saveProject(storage, project, 0);
  const draft = emptyDiscovery();
  draft.brief.problem = 'Fictional source';
  let saved = saveProjectPart(storage, projectId, 'discovery', draft, 'null');
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)).discovery, draft);
  assert.deepEqual(saved.project.completed, []);
  assert.equal(saved.project.proposal, null);
  assert.equal(saved.project.results, null);
  assert.throws(() => saveProjectPart(storage, projectId, 'discovery', draft, 'null'), /draft changed/);
  saved = saveProject(storage, { ...saved.project, title: 'Concurrent brief edit' }, saved.revision);
  const next = { ...draft, fitEvidence: 'Missing permission' };
  saved = saveProjectPart(storage, projectId, 'discovery', next, JSON.stringify(draft));
  assert.equal(saved.project.title, 'Concurrent brief edit');
  saved = saveProjectPart(storage, projectId, 'discovery', undefined, JSON.stringify(next));
  assert.equal('discovery' in saved.project, false);
  deleteProject(storage, projectId, saved.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'discovery', draft, 'null'), /not found/);
  assert.throws(() => loadProject(storage, projectId), /not found/);
});

test('discovery proposal starter imports only original scope without money, changes or generated claims', async () => {
  const { emptyDiscovery, discoveryProposalSeed, buildDiscoveryReport } = await loadContent('../lib/client-discovery.ts', projectImports);
  const { proposalCostFields, readProposalDraft } = await loadContent('../lib/pilot-proposal.ts');
  const draft = emptyDiscovery();
  draft.brief.problem = 'Fictional five orders';
  draft.brief.scope = 'One CSV';
  draft.brief.unknowns = 'UNKNOWN_RECORD';
  draft.change.request = 'CHANGE_NOT_ACCEPTED';
  draft.change.impact = 'Costs UNKNOWN';
  draft.fitEvidence = 'FIT_RECORD';
  const before = JSON.stringify(draft);
  const proposal = discoveryProposalSeed(draft, 'Sample');
  assert.equal(proposal.inputs.scope, 'One CSV');
  assert.equal(proposal.inputs.problem, 'Fictional five orders');
  assert.equal(proposal.document, '');
  assert.equal(proposal.source, '');
  for (const { key } of proposalCostFields) assert.equal(proposal.inputs[key], '');
  assert.doesNotMatch(JSON.stringify(proposal), /CHANGE_NOT_ACCEPTED|UNKNOWN_RECORD|FIT_RECORD/);
  assert.deepEqual(readProposalDraft(JSON.stringify(proposal)), proposal);
  assert.equal(JSON.stringify(draft), before);
  const report = buildDiscoveryReport(draft, (s) => s);
  assert.match(report, /UNKNOWN_RECORD/);
  assert.match(report, /CHANGE_NOT_ACCEPTED/);
  assert.match(report, /Pause:/);
});

test('discovery simulator, interface, consent, report and proposal import have complete translations', async () => {
  const { discoveryFields, fitChecks, fitStatuses, changeFields, discoveryQuestions, emptyDiscovery, buildDiscoveryReport } =
    await loadContent('../lib/client-discovery.ts', projectImports);
  const files = ['../components/client-discovery-builder.tsx',
    '../app/business-launchpad/client-discovery/page.tsx', '../app/business-launchpad/client-discovery-lab/page.tsx'];
  const strings = new Set([
    ...discoveryFields.map((f) => f.label), ...fitChecks.map((f) => f.label),
    ...fitStatuses.map((f) => f.label), ...changeFields.map((f) => f.label),
    ...discoveryQuestions.flatMap((f) => [f.question, f.answer]),
    'Reload before editing. Save explicitly to this device project; account snapshots include discovery only after separate consent and upload.',
    'This public lab keeps edits in page memory only. Reloading clears them. To retain discovery, open an existing service project in the workspace.',
    'Continue scoping, not approval to accept work.', 'Pause: resolve missing evidence, fit concerns and unknowns before accepting work.',
    'Discovery edits are not saved.', 'Invalid saved discovery draft.',
    'Open client discovery and scoping', 'Start from saved discovery',
    'Save discovery in this project before importing it.',
    'Replace this proposal form with saved discovery? Fees, costs and generated text will be cleared. Unknowns, fit decisions and proposed changes stay in discovery; review both records. Nothing is saved automatically.',
    'Saved discovery copied into the proposal form. Review, regenerate and save explicitly; no approval or money was filled in.',
    'Saved discovery briefs, fit evidence and proposed changes are also included in account upload consent. Review these texts before uploading.',
    'I agree to upload this saved project, including costs, test evidence, workbook revisions, reviews, copied review text, case studies and discovery drafts, to my private account when I press Upload.'
  ]);
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const match of source.matchAll(/(?:tr\(|new Error\(|setNotice\()'([^']+)'|<Tr>([^<{]+)<\/Tr>|<Tr>\{'([^']+)'\}<\/Tr>/g)) {
      strings.add(match[1] ?? match[2] ?? match[3]);
    }
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing discovery phrase "${text}"`);
    buildDiscoveryReport(emptyDiscovery(), (text) => {
      assert.ok(book[text], `${locale}: missing report "${text}"`); return book[text];
    });
  }
  const privatePage = await readFile(new URL(files[1], import.meta.url), 'utf8');
  assert.match(privatePage, /index: false/);
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  assert.match(sitemap, /client-discovery-lab/);
  assert.doesNotMatch(sitemap, /['"]\/business-launchpad\/client-discovery['"]/);
});

test('discovery lessons and multilingual intent use stable progress IDs', async () => {
  const { clientDiscoverySteps } = await loadContent('../lib/client-discovery-tutorial.ts');
  assert.deepEqual(clientDiscoverySteps.map((step) => step.id), [
    'ask-before-offering', 'define-small-scope', 'check-project-fit',
    'confirm-access-review', 'control-scope-changes', 'prepare-proposal-handoff'
  ]);
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const idea of ['client discovery project scoping', 'découverte client cadrage de projet',
    'kundengespräch projektumfang', 'descubrimiento de clientes alcance del proyecto']) {
    assert.equal(matchGoals(idea)[0].goalId, 'scope-freelance-project', idea);
  }
});
test('case study validation, brief starter and part persistence preserve private project parts', async () => {
  const { emptyCaseStudy, readCaseStudy, caseStudyFromBrief } = await loadContent('../lib/case-study.ts', projectImports);
  const { newPilotProject, readPilotProject, saveProject, loadProject, saveProjectPart, deleteProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const storage = memoryStorage();
  const project = newPilotProject(projectId, 'ai-spreadsheets', 'Spreadsheet practice');
  project.brief = { objective: 'Fictional source', scope: 'Compare cells', review: 'Pending review' };
  assert.equal('caseStudy' in readPilotProject(JSON.stringify(project)), false, 'legacy projects stay unchanged');
  const draft = caseStudyFromBrief(project);
  assert.equal(draft.text.outcome, '');
  assert.deepEqual(draft.testIds, []);
  assert.equal(draft.text.problem, project.brief.objective);
  saveProject(storage, project, 0);
  let saved = saveProjectPart(storage, projectId, 'caseStudy', draft, 'null');
  assert.deepEqual(saved.project.brief, project.brief);
  assert.deepEqual(saved.project.caseStudy, draft);
  assert.throws(() => saveProjectPart(storage, projectId, 'caseStudy', draft, 'null'), /draft changed/);
  saved = saveProject(storage, { ...saved.project, title: 'Updated project' }, saved.revision);
  const changed = { ...draft, text: { ...draft.text, outcome: 'One correction recorded' } };
  saved = saveProjectPart(storage, projectId, 'caseStudy', changed, JSON.stringify(draft));
  assert.equal(saved.project.title, 'Updated project', 'part save preserves concurrent brief edits');
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)).caseStudy, changed, 'account document round-trip');
  saved = saveProjectPart(storage, projectId, 'caseStudy', undefined, JSON.stringify(changed));
  assert.equal('caseStudy' in saved.project, false);
  assert.deepEqual(saved.project.brief, project.brief);
  deleteProject(storage, projectId, saved.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'caseStudy', changed, 'null'), /not found/);
  assert.throws(() => loadProject(storage, projectId), /not found/);
  for (const invalid of [null, [], {}, { ...draft, version: 2 }, { ...draft, testIds: ['test-1', 'test-1'] },
    { ...draft, testIds: ['test-21'] }, { ...draft, testIds: [1] }, { ...draft, text: { ...draft.text, title: 'x'.repeat(121) } },
    { ...draft, text: { ...draft.text, outcome: 2 } }, { ...draft, text: { ...draft.text, learning: 'x'.repeat(2001) } }]) {
    assert.throws(() => readCaseStudy(invalid), /Invalid saved case study/);
  }
  assert.deepEqual(readCaseStudy(emptyCaseStudy()), emptyCaseStudy());
});

test('case study exports retain gaps and honest outcomes without copying unselected private records', async () => {
  const { caseStudyFromBrief, buildCaseStudy, caseStudyText } = await loadContent('../lib/case-study.ts', projectImports);
  const { newPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { emptyPilotResults, emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const project = newPilotProject(projectId, 'ai-spreadsheets', '<script>alert(1)</script>');
  project.caseStudy = caseStudyFromBrief(project);
  project.caseStudy.testIds = ['test-1', 'test-3'];
  project.results = emptyPilotResults();
  project.results.decision = 'stop';
  project.results.metrics.cost = '97531';
  project.results.tests = [
    { ...emptyPilotTest('test-1'), name: 'Selected test', status: 'pass', actual: 'SELECTED_EVIDENCE', retestStatus: 'pass' },
    { ...emptyPilotTest('test-2'), name: 'SECRET_UNSELECTED', actual: 'SECRET_RAW', status: 'fail' }
  ];
  project.proposal = { version: 1, inputs: {}, document: 'SECRET_PROPOSAL', source: '' };
  project.workbook = { version: 1, items: [{ body: 'SECRET_WORKBOOK' }] };
  project.reviewCentre = { version: 1, reviews: [{ checks: [{ status: 'needs-work', notes: 'SECRET_REVIEW', done: true }] }] };
  const text = caseStudyText(buildCaseStudy(project, [{ code: 'SHEET-1', recorded: false }], false, 'Practice only', (s) => s));
  assert.match(text, /FICTIONAL PRACTICE CASE STUDY/);
  assert.match(text, /Incomplete practice draft/);
  assert.match(text, /SELECTED_EVIDENCE/);
  assert.match(text, /Current evidenced outcome: Not run/);
  assert.match(text, /Fail: 1/);
  assert.match(text, /Recorded decision: Stop/);
  assert.match(text, /Saved review checks not self-checked: 1/);
  assert.match(text, /\[SHEET-1\]/);
  assert.match(text, /Selected test no longer exists/);
  assert.doesNotMatch(text, /SECRET_|97531/);
  project.caseStudy.testIds = [];
  const unselected = caseStudyText(buildCaseStudy(project, [], false, 'Practice only', (s) => s));
  assert.match(unselected, /No test evidence selected/);
  assert.match(unselected, /Fail: 1/);
  assert.doesNotMatch(unselected, /SELECTED_EVIDENCE/);
});

test('case study routes, narrative fields, boundaries, errors and notices have three translations', async () => {
  const files = [
    '../lib/case-study.ts', '../components/project-case-study.tsx',
    '../app/business-launchpad/case-study-builder/page.tsx', '../app/business-launchpad/freelance-portfolio/page.tsx'
  ];
  const strings = new Set([
    'Build a freelance case study',
    'I agree to upload this saved project, including costs, test evidence, workbook revisions, reviews, copied review text and case study drafts, to my private account when I press Upload.',
    'If saved, the case study narrative and selected test identifiers are also included in account upload consent. Delete sensitive case study text before uploading.',
    'Case study edits are not saved. The preview uses saved text only.',
    'Fictional content practice only. No publication or client approval is implied.',
    'Saved review checks not self-checked:', 'No saved self-reviews.'
  ]);
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const match of source.matchAll(/(?:tr\(|label: |heading: |body: |new Error\(|setNotice\()'([^']+)'|<Tr>([^<{]+)<\/Tr>|<Tr>\{'([^']+)'\}<\/Tr>/g)) {
      if (match[1] || match[2] || match[3]) strings.add(match[1] ?? match[2] ?? match[3]);
    }
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing case study phrase "${text}"`);
  }
  const privatePage = await readFile(new URL(files[2], import.meta.url), 'utf8');
  assert.match(privatePage, /index: false/);
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  assert.match(sitemap, /freelance-portfolio/);
  assert.doesNotMatch(sitemap, /case-study-builder/);
});
test('spreadsheet cleaning preserves raw rows, flags unresolved dates/quantities and rejects conflicting IDs', async () => {
  const { cleanSpreadsheet, messySpreadsheet, spreadsheetSource } = await loadContent('../lib/spreadsheet-practice.ts');
  const before = JSON.stringify(messySpreadsheet);
  const clean = cleanSpreadsheet(messySpreadsheet);
  assert.equal(clean.rawCount, 7);
  assert.equal(clean.rows.length, 6);
  assert.equal(clean.duplicates, 1);
  assert.deepEqual(clean.issues, [{ id: 'A5', field: 'quantity' }, { id: 'A6', field: 'date' }]);
  assert.deepEqual(clean.rows.slice(0, 5), spreadsheetSource);
  assert.equal(clean.rows[5].date, '01/02/2030', 'no guessed locale');
  assert.equal(clean.rows[3].quantity, '0', 'known zero retained');
  assert.equal(clean.rows[4].quantity, '', 'unknown not filled');
  assert.equal(JSON.stringify(messySpreadsheet), before);
  assert.throws(() => cleanSpreadsheet([...spreadsheetSource, { ...spreadsheetSource[0], quantity: '99' }]), /Conflicting order ID/);
  assert.throws(() => cleanSpreadsheet([{ ...spreadsheetSource[0], id: '=formula' }]), /Invalid practice/);
  for (const [field, value] of [['quantity', '-1'], ['quantity', '1.5'], ['price', '1.234'], ['price', 'NaN'], ['date', '2030-02-30']]) {
    assert.equal(cleanSpreadsheet([{ ...spreadsheetSource[0], [field]: value }]).issues.length, 1, value);
  }
  clean.rows[0].quantity = '99';
  assert.equal(messySpreadsheet[0].quantity, '2', 'working copies do not mutate raw input');
});

test('PDF practice compares every source cell, keeps a blank distinct from zero and requires a complete source', async () => {
  const { comparePdfRows, extractedPdfRows, spreadsheetSource } = await loadContent('../lib/spreadsheet-practice.ts');
  assert.deepEqual(comparePdfRows(extractedPdfRows), [
    { row: 2, id: 'A2', field: 'quantity' }, { row: 5, id: 'A5', field: 'quantity' }
  ]);
  assert.deepEqual(comparePdfRows(spreadsheetSource), []);
  assert.throws(() => comparePdfRows(spreadsheetSource.slice(1)), /exactly five/);
  const wrong = spreadsheetSource.map((row) => ({ ...row }));
  wrong[0].item = 'Pen';
  wrong[1].id = 'A1';
  wrong[2].date = '2030-01-10';
  wrong[3].price = '7';
  assert.equal(comparePdfRows(wrong).length, 4, 'matching subtotal alone is insufficient');
});

test('spreadsheet report reconciles exact cents, inclusive dates and unknowns without fabricated complete totals', async () => {
  const { spreadsheetReport, spreadsheetSource, messySpreadsheet } = await loadContent('../lib/spreadsheet-practice.ts');
  const result = spreadsheetReport(spreadsheetSource);
  assert.equal(result.knownCents, 2100);
  assert.equal(result.unresolved, 1);
  assert.equal(result.excluded, 0);
  assert.deepEqual(result.groups, {
    Notebook: { knownCents: 1500, unresolved: 0 },
    Pen: { knownCents: 600, unresolved: 0 }, Folder: { knownCents: 0, unresolved: 1 }
  });
  assert.equal(spreadsheetReport(messySpreadsheet).unresolved, 2);
  const outside = [...spreadsheetSource, { ...spreadsheetSource[0], id: 'A6', date: '2030-01-14' }];
  assert.equal(spreadsheetReport(outside).excluded, 1);
  assert.equal(spreadsheetReport(outside).knownCents, 2100);
  const invalid = [{ ...spreadsheetSource[0], quantity: 'x' }];
  assert.equal(spreadsheetReport(invalid).unresolved, 1);
  assert.equal(spreadsheetReport(invalid).knownCents, 0);
  assert.throws(() => spreadsheetReport([{ ...spreadsheetSource[0], quantity: String(Number.MAX_SAFE_INTEGER) }]), /safe calculation/);
});

test('spreadsheet CSV exports preserve blanks/quotes and neutralise formula-like text; PDF bytes have valid offsets', async () => {
  const { spreadsheetCsv, spreadsheetSource, practicePdf } = await loadContent('../lib/spreadsheet-practice.ts');
  const csv = spreadsheetCsv(spreadsheetSource);
  assert.match(csv, /"A4","Pen","2030-01-13","0","2"/);
  assert.match(csv, /"A5","Folder","2030-01-13","","4"/);
  assert.ok(csv.endsWith('\r\n'));
  for (const value of ['=1+1', '+1', '-1', '@SUM(A1)', '  =1', '\t=1', '\r=1']) {
    assert.ok(spreadsheetCsv([{ ...spreadsheetSource[0], item: value }]).includes(`"'${value}"`), value);
  }
  assert.match(spreadsheetCsv([{ ...spreadsheetSource[0], item: 'A,"B"\nC' }]), /"A,""B""\nC"/);
  const pdf = practicePdf();
  assert.equal(Buffer.byteLength(pdf), pdf.length, 'ASCII offsets are byte offsets');
  assert.ok(pdf.startsWith('%PDF-1.4'));
  const offset = Number(pdf.match(/startxref\n(\d+)/)[1]);
  assert.equal(pdf.slice(offset, offset + 4), 'xref');
  const entries = pdf.slice(offset).match(/\d{10} 00000 n/g);
  entries.forEach((entry, index) => assert.ok(pdf.slice(Number(entry.slice(0, 10))).startsWith(`${index + 1} 0 obj`)));
  const stream = pdf.match(/\/Length (\d+) >>\nstream\n([\s\S]*?)\nendstream/);
  assert.equal(Number(stream[1]), stream[2].length);
  assert.match(pdf, /A5 quantity is BLANK, not zero/);
});

test('spreadsheet lessons retain stable progress and new lab controls have translated interface', async () => {
  const { spreadsheetSteps } = await loadContent('../lib/spreadsheets-tutorial.ts');
  assert.deepEqual(spreadsheetSteps.map((step) => step.id), [
    'import-sample', 'check-cells', 'verified-formula', 'reconcile-summary', 'chart-honestly', 'spreadsheet-handoff'
  ]);
  assert.match(spreadsheetSteps[0].code, /A5,Folder,,4/);
  const source = await readFile(new URL('../components/spreadsheet-practice-lab.tsx', import.meta.url), 'utf8');
  const ast = ts.createSourceFile('lab.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const strings = new Set();
  for (const label of ['Order', 'Item', 'Quantity', 'Date UTC', 'Unit price (EUR)']) strings.add(label);
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'tr') {
      const gather = (child) => {
        if (ts.isStringLiteral(child) && /^[A-Z]/.test(child.text)) strings.add(child.text);
        else ts.forEachChild(child, gather);
      };
      node.arguments.forEach(gather);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing spreadsheet lab phrase "${text}"`);
  }
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const text of ['excel data cleaning', 'PDF-to-Excel', 'nettoyage excel', 'pdf zu excel', 'pdf a excel']) {
    assert.equal(matchGoals(text)[0]?.goalId, 'analyze-data', text);
  }
});

test('enquiry simulation preserves the original six events, supplied human review, atomic failures and off switch', async () => {
  const { enquiryExamples, processEnquiry } = await loadContent('../lib/automation-practice.ts');
  const controls = { enabled: true, failWrite: false };
  let rows = [];
  assert.throws(() => processEnquiry(rows, enquiryExamples[0], { ...controls, failWrite: true }), /write failed/);
  assert.deepEqual(rows, []);
  assert.deepEqual(processEnquiry(rows, enquiryExamples[0], { ...controls, enabled: false }).rows, []);
  for (const event of enquiryExamples) rows = processEnquiry(rows, event, controls).rows;
  assert.deepEqual(rows.map((row) => row.id), ['E1', 'E3', 'E4', 'E5']);
  assert.equal(rows.filter((row) => row.draft).length, 2);
  assert.equal(rows.filter((row) => row.status === 'REVIEW').length, 2);
  assert.deepEqual(processEnquiry(rows, enquiryExamples[0], controls).rows, rows);
  assert.equal(JSON.stringify(rows).includes('sent":'), false);
});

test('appointment practice enforces exact UTC bounds, permission, cancellation versions and atomic recovery', async () => {
  const { reminderExamples, processReminder, reminderClock } = await loadContent('../lib/automation-practice.ts');
  const controls = { enabled: true, failWrite: false };
  let state = { drafts: [], latest: {} };
  const event = reminderExamples[0];
  for (const patch of [
    { id: '' }, { version: 0 }, { version: 1.5 }, { at: '2030-02-30T09:00:00.000Z' },
    { at: '2030-01-08T10:00:00+01:00' }, { at: '' }, { permission: 'yes' }, { status: 'pending' }
  ]) assert.throws(() => processReminder(state, { ...event, ...patch }, controls), /Invalid appointment/);
  assert.throws(() => processReminder(state, event, { ...controls, failWrite: true }), /write failed/);
  assert.deepEqual(state, { drafts: [], latest: {} });
  assert.deepEqual(processReminder(state, event, { ...controls, enabled: false }).state, state);
  for (const [milliseconds, count] of [[0, 0], [1, 1], [86400000, 1], [86400001, 0]]) {
    const result = processReminder(state, { ...event, at: new Date(Date.parse(reminderClock) + milliseconds).toISOString() }, controls);
    assert.equal(result.state.drafts.length, count);
  }
  state = processReminder(state, event, controls).state;
  const before = JSON.stringify(state);
  assert.throws(() => processReminder(state, reminderExamples[5], { ...controls, failWrite: true }), /write failed/);
  assert.equal(JSON.stringify(state), before);
  assert.throws(() => processReminder(state, { ...event, permission: false }, controls), /new version/);
  const revoked = processReminder(state, { ...event, version: 2, permission: false }, controls).state;
  assert.equal(revoked.drafts.filter((draft) => !draft.cancelled).length, 0);
  assert.equal(processReminder(revoked, event, controls).state, revoked, 'stale version cannot restore permission');
  state = { drafts: [], latest: {} };
  for (const sample of reminderExamples) state = processReminder(state, sample, controls).state;
  assert.deepEqual(state.drafts.map(({ version, cancelled }) => ({ version, cancelled })), [
    { version: 1, cancelled: true }, { version: 2, cancelled: false }
  ]);
  assert.equal(processReminder(state, event, controls).state, state);
  assert.equal(processReminder(state, reminderExamples[7], controls).state, state);
});

test('weekly report practice reconciles exact cents, keeps incomplete totals explicit and preserves revisions on safe retry', async () => {
  const { reportRows, reconcileWeek, writeWeeklyReport } = await loadContent('../lib/automation-practice.ts');
  const controls = { enabled: true, failWrite: false };
  const original = JSON.stringify(reportRows);
  assert.deepEqual(reconcileWeek(reportRows), { knownCents: 2100, unresolved: 1, unique: 5, duplicates: 1, excluded: 1 });
  for (const patch of [
    { id: '' }, { date: '2030-02-30' }, { date: '2030-01-07T00:00:00Z' },
    { quantity: -1 }, { quantity: 0.1 }, { quantity: undefined }, { priceCents: NaN }, { priceCents: -1 }
  ]) assert.throws(() => reconcileWeek([{ ...reportRows[0], ...patch }]), /Invalid report row/);
  assert.throws(() => reconcileWeek([{ ...reportRows[0], quantity: Number.MAX_SAFE_INTEGER }]), /safe calculation/);
  assert.throws(() => reconcileWeek([...reportRows, { ...reportRows[0], quantity: 99 }]), /Conflicting duplicate/);
  assert.throws(() => writeWeeklyReport([], 1, reportRows, { ...controls, failWrite: true }), /write failed/);
  assert.deepEqual(writeWeeklyReport([], 1, reportRows, { ...controls, enabled: false }).reports, []);
  for (const invalid of [0, -1, 1.5, NaN]) assert.throws(() => writeWeeklyReport([], invalid, reportRows, controls), /Invalid report revision/);
  const first = writeWeeklyReport([], 1, reportRows, controls).reports;
  assert.equal(first.length, 1);
  assert.equal(writeWeeklyReport(first, 1, reportRows, controls).reports, first);
  const corrected = reportRows.map((row) => ({ ...row, ...(row.id === 'O5' ? { quantity: 2 } : {}) }));
  assert.throws(() => writeWeeklyReport(first, 1, corrected, controls), /new revision/);
  assert.throws(() => writeWeeklyReport(first, 2, corrected, { ...controls, failWrite: true }), /write failed/);
  const second = writeWeeklyReport(first, 2, corrected, controls).reports;
  assert.deepEqual(second.map(({ knownCents, unresolved }) => ({ knownCents, unresolved })), [
    { knownCents: 2100, unresolved: 1 }, { knownCents: 2900, unresolved: 0 }
  ]);
  assert.deepEqual(first[0].sourceRows, reportRows);
  corrected[0].quantity = 99;
  assert.equal(second[1].sourceRows[0].quantity, 2, 'report keeps its own source snapshot');
  assert.equal(JSON.stringify(reportRows), original);
});

test('automation scenario metadata survives part saves and snapshot parsing while old projects retain their original plans', async () => {
  const { newPilotProject, readPilotProject, saveProject, saveProjectPart, loadProject, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { serviceJourneyTests, serviceJourneyCoverage, serviceProjectJourney, buildServicePortfolio } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { checksForService } = await loadContent('../lib/project-review.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  const legacy = newPilotProject(projectId, 'ai-automation-services', 'Original enquiry');
  assert.equal('automationScenario' in readPilotProject(JSON.stringify(legacy)), false);
  assert.equal(serviceJourneyTests(legacy.pathId, (text) => text).length, 9);
  assert.deepEqual(serviceJourneyTests(legacy.pathId, (text) => text), serviceJourneyTests(legacy.pathId, (text) => text, 'enquiries'));
  for (const invalid of [null, '', 'other', 3, {}]) {
    assert.throws(() => readPilotProject(JSON.stringify({ ...legacy, automationScenario: invalid })), /Invalid automation/);
  }
  assert.throws(() => readPilotProject(JSON.stringify({ ...legacy, pathId: 'ai-video-business', automationScenario: 'appointments' })), /Invalid automation/);
  for (const [scenario, code] of [['appointments', 'APPT'], ['weekly-report', 'REPORT']]) {
    const project = newPilotProject(projectId, legacy.pathId, 'Fictional ' + scenario, scenario);
    const storage = memoryStorage();
    saveProject(storage, project, 0);
    const results = projectResultsSeed(project);
    results.tests = serviceJourneyTests(project.pathId, (text) => text, scenario);
    assert.equal(results.tests.length, 6);
    assert.ok(results.tests.every((test, at) => test.name.startsWith(`[${code}-${at + 1}]`) && !test.actual && test.status === 'pending'));
    saveProjectPart(storage, projectId, 'results', results, 'null');
    const loaded = loadProject(storage, projectId);
    assert.equal(loaded.project.automationScenario, scenario);
    assert.deepEqual(readPilotProject(JSON.stringify(loaded.project)), loaded.project, 'account serialization retains the choice');
    assert.throws(() => saveProject(storage, { ...loaded.project, automationScenario: 'enquiries' }, loaded.revision), /cannot change/);
    assert.equal(serviceJourneyCoverage(loaded.project).filter((check) => check.recorded).length, 0);
    const fixture = await contentProjectFixture();
    Object.assign(fixture, { pathId: project.pathId, automationScenario: scenario });
    fixture.proposal.inputs.dataHandling = 'Fictional data, human review and no sending.';
    fixture.proposal.source = proposalSource(fixture.proposal.inputs, 'en');
    fixture.results.tests = results.tests.map((test, at) => ({
      ...test, actual: at === 5 ? 'Real owner review unavailable.' : 'Observed fictional lab result.',
      status: at === 5 ? 'blocked' : 'pass'
    }));
    assert.equal(serviceProjectJourney(fixture).ready, true);
    assert.match(buildServicePortfolio(fixture, (text) => text), new RegExp(`\\[${code}-6\\]`));
    fixture.results.tests = serviceJourneyTests(project.pathId, (text) => text).map((test) => ({ ...test, actual: 'Old enquiry evidence', status: 'pass' }));
    assert.equal(serviceJourneyCoverage(fixture).filter((check) => check.recorded).length, 0, 'old enquiry cases cannot satisfy a different workflow');
    assert.equal(serviceProjectJourney(fixture).next.id, 'test');
    assert.equal(checksForService(project.pathId, scenario).length, 6);
    assert.notEqual(checksForService(project.pathId, scenario)[1].instruction, checksForService(project.pathId)[1].instruction);
  }
});

test('automation project plans, workbook starters and interactive controls have complete translations', async () => {
  const { automationProjects, automationScenarioLabels } = await loadContent('../lib/automation-projects.ts');
  const strings = new Set(Object.values(automationScenarioLabels));
  const gather = (value) => {
    if (typeof value === 'string' && !/^(APPT|REPORT)-\d$/.test(value)) strings.add(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(gather);
  };
  gather(automationProjects);
  for (const file of ['../components/automation-practice-lab.tsx', '../app/business-launchpad/automation-lab/page.tsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === 'tr') {
        const find = (child) => {
          if (ts.isStringLiteral(child) && /^[A-Z]/.test(child.text)) strings.add(child.text);
          else ts.forEachChild(child, find);
        };
        node.arguments.forEach(find);
      }
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  strings.delete('');
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing automation phrase ${text}`);
  }
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const text of ['small business automation', 'appointment reminder', 'weekly business report', 'rappel de rendez-vous', 'terminerinnerung', 'informe semanal']) {
    assert.equal(matchGoals(text)[0]?.goalId, 'start-ai-business', text);
  }
});

test('content reviews strictly validate checks, copied source identity, limits and evidence without changing milestones', async () => {
  const { saveTextReview, readProjectReviewCentre, emptyReviewChecks, checksForService, textReviewState } = await loadContent('../lib/project-review.ts', projectImports);
  const { newPilotProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const project = newPilotProject(projectId, 'ai-content-services', 'Private review');
  assert.equal('reviewCentre' in readPilotProject(JSON.stringify(project)), false);
  project.workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'v1', 'REVIEW_SOURCE_ONE', workbookTime);
  const source = project.workbook.items[0].revisions[0];
  const before = JSON.stringify(project);
  const checks = emptyReviewChecks();
  checks[0] = { ...checks[0], status: 'needs-work', notes: 'An unsupported claim remains', task: 'Remove the invented price' };
  checks[4] = { ...checks[4], status: 'blocked', notes: 'Owner approval unavailable' };
  const centre = saveTextReview(project, 'item-1', source, checks, workbookTime);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks.map((check, index) => index === 0 ? { ...check, notes: ' ' } : check), workbookTime), /Add observations/);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks.map((check, index) => index === 0 ? { ...check, task: ' ' } : check), workbookTime), /Add a correction task/);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks.map((check, index) => index === 0 ? { ...check, done: true } : check), workbookTime), /task and correction evidence/);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks.map((check, index) => index === 1 ? { ...check, resolution: 'Evidence without task' } : check), workbookTime), /Add a correction task before/);
  assert.equal(JSON.stringify(project), before);
  project.reviewCentre = centre;
  assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  assert.deepEqual(project.completed, []);
  assert.equal(project.results, null);
  assert.match(textReviewState(project, centre.reviews[0]), /current saved text/);
  for (const mutate of [
    (copy) => { copy.version = 2; },
    (copy) => { copy.reviews = null; },
    (copy) => { copy.reviews.push(structuredClone(copy.reviews[0])); },
    (copy) => { copy.reviews[0].itemId = 'item-9'; },
    (copy) => { copy.reviews[0].source.number = 6; },
    (copy) => { copy.reviews[0].source.savedAt = '2026-02-30T01:30:00.000Z'; },
    (copy) => { copy.reviews[0].source.body = 'x'.repeat(8001); },
    (copy) => { copy.reviews[0].savedAt = '2026-02-30T01:30:00.000Z'; },
    (copy) => { copy.reviews[0].checks.pop(); },
    (copy) => { copy.reviews[0].checks[0].id = 'access'; },
    (copy) => { copy.reviews[0].checks[0].status = 'approved'; },
    (copy) => { copy.reviews[0].checks[0].notes = ' '; },
    (copy) => { copy.reviews[0].checks[0].notes = 'x'.repeat(2001); },
    (copy) => { copy.reviews[0].checks[0].task = ''; },
    (copy) => { copy.reviews[0].checks[0].done = true; },
    (copy) => { copy.reviews[0].checks[1].resolution = 'Evidence without a task'; },
    (copy) => { copy.reviews[0].checks[1].done = 'yes'; }
  ]) {
    const copy = structuredClone(centre);
    mutate(copy);
    assert.throws(() => readProjectReviewCentre(copy), /Invalid saved/);
  }
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, reviewCentre: null })), /Invalid saved/);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, pathId: 'ai-cad-services' })), /Invalid saved project review/);
  assert.throws(() => saveTextReview({ ...project, pathId: 'ai-cad-services' }, 'item-1', source, checks, workbookTime), /Invalid saved project review/);
  project.workbook = appendWorkbookRevision(project.workbook, 'item-1', 'v2', 'REVIEW_SOURCE_TWO', workbookTime);
  assert.match(textReviewState(project, centre.reviews[0]), /Newer text/);
  assert.equal(centre.reviews[0].checks[0].done, false);
  assert.deepEqual(emptyReviewChecks().map((check) => check.status), Array(5).fill('pending'));
  project.workbook.items = [];
  assert.match(textReviewState(project, centre.reviews[0]), /removed or replaced/);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks, workbookTime), /changed or was removed/);
  project.workbook = appendWorkbookRevision(project.workbook, null, source.title, source.body, workbookTime, ['item-1']);
  assert.equal(project.workbook.items[0].id, 'item-2', 'archived feedback reserves the old item identifier');
  assert.match(textReviewState(project, centre.reviews[0]), /removed or replaced/);
  assert.equal(centre.reviews[0].source.body, 'REVIEW_SOURCE_ONE');
  assert.throws(() => appendWorkbookRevision(project.workbook, null, 'No free ID', 'Text', workbookTime,
    ['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8']), /identifiers are retained/);
  assert.throws(() => saveTextReview(project, 'item-1', source, checks, workbookTime), /changed or was removed/);
  checks[0] = { ...checks[0], done: true, resolution: 'Price removed in a separately saved draft; review pending' };
  const replaced = saveTextReview(project, 'item-2', project.workbook.items[0].revisions[0], checks, workbookTime);
  assert.equal(replaced.reviews.length, 2);
  assert.equal(replaced.reviews[1].itemId, 'item-2');
  assert.equal(replaced.reviews[1].checks[0].status, 'needs-work');
  for (const pathId of ['ai-content-services', 'ai-automation-services', 'ai-cad-services', 'micro-saas-validation', 'ai-education-services', 'ai-video-business', 'ai-spreadsheets']) {
    const serviceProject = newPilotProject(projectId, pathId, pathId);
    serviceProject.workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Service draft', 'SELF_REVIEW_SERVICE_CANARY', workbookTime);
    const serviceChecks = emptyReviewChecks(pathId);
    const serviceReview = saveTextReview(serviceProject, 'item-1', serviceProject.workbook.items[0].revisions[0], serviceChecks, workbookTime);
    serviceProject.reviewCentre = serviceReview;
    assert.deepEqual(serviceReview.reviews[0].checks.map((check) => check.id), checksForService(pathId).map((check) => check.id));
    assert.deepEqual(readPilotProject(JSON.stringify(serviceProject)), serviceProject);
    const { buildReviewHandover } = await loadContent('../lib/project-review.ts', projectImports);
    assert.match(buildReviewHandover(serviceProject, ['item-1'], (text) => text), /SELF_REVIEW_SERVICE_CANARY/);
  }
});

test('review saves merge their own part, retain copied text in snapshots and reject stale or deleted-project writes', async () => {
  const { newPilotProject, saveProject, saveProjectPart, loadProject, deleteProject, projectResultsSeed } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const { saveTextReview, emptyReviewChecks } = await loadContent('../lib/project-review.ts', projectImports);
  const project = newPilotProject(projectId, 'ai-content-services', 'CAS review');
  project.workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Source', 'COPY_RETENTION', workbookTime);
  const centre = saveTextReview(project, 'item-1', project.workbook.items[0].revisions[0], emptyReviewChecks(), workbookTime);
  const storage = memoryStorage();
  saveProject(storage, project, 0, { userId: projectId, version: 1 });
  saveProjectPart(storage, projectId, 'results', projectResultsSeed(project), 'null');
  const saved = saveProjectPart(storage, projectId, 'reviewCentre', centre, 'null');
  assert.deepEqual(saved.project.results, projectResultsSeed(project));
  assert.deepEqual(saved.cloud, { userId: projectId, version: 1 });
  assert.throws(() => saveProjectPart(storage, projectId, 'reviewCentre', centre, 'null'), /draft changed/);
  saveProjectPart(storage, projectId, 'workbook', { version: 1, items: [] }, JSON.stringify(project.workbook));
  assert.equal(loadProject(storage, projectId).project.reviewCentre.reviews[0].source.body, 'COPY_RETENTION');
  const current = loadProject(storage, projectId);
  deleteProject(storage, projectId, current.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'reviewCentre', centre, JSON.stringify(centre)), /not found/);
});

test('review count and combined UTF-8 size limits are enforced without silently removing copies', async () => {
  const { newPilotProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyReviewChecks, readProjectReviewCentre, saveTextReview } = await loadContent('../lib/project-review.ts', projectImports);
  const project = newPilotProject(projectId, 'ai-content-services', 'Review limits');
  project.workbook = { version: 1, items: [] };
  for (let index = 1; index <= 8; index++) {
    project.workbook = appendWorkbookRevision(project.workbook, null, `Text ${index}`, 'x'.repeat(8000), workbookTime);
    const checks = emptyReviewChecks().map((check) => ({
      ...check, status: 'needs-work', notes: 'N'.repeat(2000), task: 'T'.repeat(2000), resolution: 'R'.repeat(2000)
    }));
    project.reviewCentre = saveTextReview(project, `item-${index}`, project.workbook.items[index - 1].revisions[0], checks, workbookTime);
  }
  assert.equal(readPilotProject(JSON.stringify(project)).reviewCentre.reviews.length, 8);
  assert.throws(() => readProjectReviewCentre({
    version: 1, reviews: [...project.reviewCentre.reviews, project.reviewCentre.reviews[0]]
  }), /Invalid saved/);
  const original = JSON.stringify(project.reviewCentre);
  for (let index = 1; index <= 8; index++) {
    for (let number = 2; number <= 5; number++) {
      project.workbook = appendWorkbookRevision(project.workbook, `item-${index}`, `Text ${index} v${number}`, '界'.repeat(8000), workbookTime);
    }
  }
  assert.throws(() => readPilotProject(JSON.stringify(project)), /storage limit/);
  assert.equal(JSON.stringify(project.reviewCentre), original);
});

test('private review handovers include only selected saved copies, honest pending outcomes and unresolved feedback in four languages', async () => {
  const { buildReviewHandover, saveTextReview, emptyReviewChecks } = await loadContent('../lib/project-review.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const { buildProjectSummary } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildServicePortfolio } = await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const project = await contentProjectFixture();
  project.workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Reviewed', 'SELECTED_REVIEW_COPY', workbookTime);
  project.workbook = appendWorkbookRevision(project.workbook, null, 'Excluded', 'UNSELECTED_REVIEW_COPY', workbookTime);
  project.workbook = appendWorkbookRevision(project.workbook, null, 'Unreviewed', 'UNREVIEWED_WORKBOOK_COPY', workbookTime);
  const checks = emptyReviewChecks();
  checks[0] = { ...checks[0], status: 'needs-work', notes: 'REVIEW_FEEDBACK_CANARY', task: 'Unresolved correction' };
  project.reviewCentre = saveTextReview(project, 'item-1', project.workbook.items[0].revisions[0], checks, workbookTime);
  project.reviewCentre = saveTextReview(project, 'item-2', project.workbook.items[1].revisions[0], emptyReviewChecks(), workbookTime);
  project.results.tests[0] = { ...project.results.tests[0], actual: '', status: 'pass' };
  const before = JSON.stringify(project);
  const report = buildReviewHandover(project, ['item-1'], (text) => text);
  assert.equal(JSON.stringify(project), before);
  assert.match(report, /SELECTED_REVIEW_COPY|REVIEW_FEEDBACK_CANARY/);
  assert.match(report, /Unresolved correction/);
  assert.match(report, /Not run or missing evidence/);
  assert.doesNotMatch(report, /UNSELECTED_REVIEW_COPY|UNREVIEWED_WORKBOOK_COPY|RAW_TEST_|PRIVATE_PROPOSAL_CANARY|98765|87654/);
  assert.doesNotMatch(buildProjectSummary(project, (text) => text), /REVIEW_FEEDBACK_CANARY|SELECTED_REVIEW_COPY/);
  assert.doesNotMatch(buildServicePortfolio(project, (text) => text), /REVIEW_FEEDBACK_CANARY|SELECTED_REVIEW_COPY/);
  assert.throws(() => buildReviewHandover(project, [], (text) => text), /Select saved/);
  assert.throws(() => buildReviewHandover(project, ['item-1', 'item-1'], (text) => text), /Select saved/);
  assert.throws(() => buildReviewHandover(project, ['item-8'], (text) => text), /no longer exists/);
  project.workbook.items = [];
  assert.match(buildReviewHandover(project, ['item-1'], (text) => text), /archived/);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const tr = (text) => { assert.ok(book[text], `${locale}: missing review phrase "${text}"`); return book[text]; };
    assert.ok(buildReviewHandover(project, ['item-1'], tr).startsWith(book['PRIVATE CONTENT PRACTICE HANDOVER - SELF-REVIEW, NOT CLIENT APPROVAL']));
  }
});

test('review instructions, statuses, errors, consent and private route have complete translations', async () => {
  const strings = new Set();
  for (const file of ['../lib/project-review.ts', '../components/project-review-centre.tsx', '../app/business-launchpad/review-centre/page.tsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isPropertyAssignment(node) && ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services'].includes(node.name.text)) return;
      if (ts.isStringLiteral(node) && /^[A-Z]/.test(node.text)) strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of strings) assert.ok(book[phrase], `${locale}: missing review phrase "${phrase}"`);
  }
});

test('workbook validation preserves bounded title/text revisions and rejects corrupted archives and references', async () => {
  const { appendWorkbookRevision, readEvidenceWorkbook, setWorkbookTestLink, workbookTextLimit } =
    await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const initial = { version: 1, items: [] };
  const first = appendWorkbookRevision(initial, null, ' First title ', 'Draft v1 <script>not executable</script>', workbookTime);
  const second = appendWorkbookRevision(first, 'item-1', 'Renamed v2', 'Corrected text', workbookTime);
  assert.deepEqual(initial, { version: 1, items: [] });
  assert.deepEqual(first.items[0].revisions, [{ number: 1, title: 'First title', body: 'Draft v1 <script>not executable</script>', savedAt: workbookTime }]);
  assert.deepEqual(second.items[0].revisions[0], first.items[0].revisions[0]);
  assert.equal(second.items[0].revisions[1].number, 2);
  const test = { ...emptyPilotTest('test-1'), name: 'Claim facts', input: 'Review saved text', expected: 'Unknown claims flagged' };
  const linked = setWorkbookTestLink(second, 'item-1', 1, test);
  assert.equal(second.items[0].links.length, 0);
  assert.deepEqual(linked.items[0].links, [{ testId: 'test-1', revision: 1, name: test.name, input: test.input, expected: test.expected }]);
  const relinked = setWorkbookTestLink(linked, 'item-1', 2, test);
  assert.equal(relinked.items[0].links.length, 1);
  assert.equal(relinked.items[0].links[0].revision, 2);
  assert.deepEqual(readEvidenceWorkbook(JSON.parse(JSON.stringify(relinked))), relinked);
  for (const mutate of [
    (copy) => { copy.version = 2; },
    (copy) => { copy.items = null; },
    (copy) => { copy.items.push(structuredClone(copy.items[0])); },
    (copy) => { copy.items[0].id = '../bad'; },
    (copy) => { copy.items[0].revisions = []; },
    (copy) => { copy.items[0].revisions[0].number = 2; },
    (copy) => { copy.items[0].revisions[0].title = ''; },
    (copy) => { copy.items[0].revisions[0].title = 'x'.repeat(121); },
    (copy) => { copy.items[0].revisions[0].body = ' '; },
    (copy) => { copy.items[0].revisions[0].body = 'x'.repeat(8001); },
    (copy) => { copy.items[0].revisions[0].body = 5; },
    (copy) => { copy.items[0].revisions[0].savedAt = '2026-02-30T00:00:00.000Z'; },
    (copy) => { copy.items[0].revisions[0].savedAt = 'not-a-date'; },
    (copy) => { copy.items[0].links[0].revision = 3; },
    (copy) => { copy.items[0].links[0].revision = 1.5; },
    (copy) => { copy.items[0].links[0].testId = 'test-21'; },
    (copy) => { copy.items[0].links[0].name = ' '; },
    (copy) => { copy.items[0].links[0].input = 'x'.repeat(2001); },
    (copy) => { copy.items[0].links[0].expected = null; },
    (copy) => { copy.items[0].links.push({ ...copy.items[0].links[0] }); }
  ]) {
    const copy = structuredClone(relinked);
    mutate(copy);
    assert.throws(() => readEvidenceWorkbook(copy), /Invalid saved evidence workbook/);
  }
  assert.equal(appendWorkbookRevision(initial, null, 'At limit', 'x'.repeat(workbookTextLimit), workbookTime).items[0].revisions[0].body.length, 8000);
  assert.throws(() => appendWorkbookRevision(initial, null, 'Too long', 'x'.repeat(8001), workbookTime), /limit/);
  assert.throws(() => appendWorkbookRevision(initial, null, ' ', 'Text', workbookTime), /title and practice text/);
  assert.throws(() => appendWorkbookRevision(second, 'item-1', 'Renamed v2', 'Corrected text', workbookTime), /unchanged/);
  assert.throws(() => appendWorkbookRevision(second, 'item-8', 'Missing', 'Text', workbookTime), /no longer exists/);
  assert.throws(() => setWorkbookTestLink(second, 'item-1', 1, { ...test, expected: '' }), /Save a test name/);
  assert.throws(() => setWorkbookTestLink(second, 'item-1', 0, test), /Invalid/);
});

test('workbook limits are exact, never prune history and remain subject to the whole-project byte cap', async () => {
  const { appendWorkbookRevision, readEvidenceWorkbook, setWorkbookTestLink } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const { newPilotProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  let workbook = { version: 1, items: [] };
  for (let index = 1; index <= 8; index++) {
    workbook = appendWorkbookRevision(workbook, null, `Item ${index}`, 'x'.repeat(8000), workbookTime);
    for (let number = 2; number <= 5; number++) {
      workbook = appendWorkbookRevision(workbook, `item-${index}`, `Item ${index} r${number}`, 'y'.repeat(8000), workbookTime);
    }
  }
  assert.equal(workbook.items.length, 8);
  assert.ok(workbook.items.every((item) => item.revisions.length === 5));
  assert.throws(() => appendWorkbookRevision(workbook, null, 'Ninth', 'Text', workbookTime), /item limit/);
  assert.throws(() => appendWorkbookRevision(workbook, 'item-1', 'Sixth', 'Text', workbookTime), /Revision limit/);
  const original = JSON.stringify(workbook);
  const project = newPilotProject(projectId, 'ai-cad-services', 'Full text archive');
  project.workbook = workbook;
  assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  assert.equal(JSON.stringify(workbook), original);
  for (let index = 1; index <= 8; index++) {
    for (let testNumber = 1; testNumber <= 20; testNumber++) {
      workbook = setWorkbookTestLink(workbook, `item-${index}`, 1, {
        ...emptyPilotTest(`test-${testNumber}`), name: 'N'.repeat(2000), input: 'I'.repeat(2000), expected: 'E'.repeat(2000)
      });
    }
  }
  assert.deepEqual(readEvidenceWorkbook(workbook), workbook);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook })), /storage limit/);
});

test('workbook links pin saved definitions and revisions without changing results or completing milestones', async () => {
  const { appendWorkbookRevision, setWorkbookTestLink, workbookLinkState } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const test = { ...emptyPilotTest('test-1'), name: 'Required scenario', input: 'Fictional input', expected: 'Expected behavior' };
  const before = JSON.stringify(test);
  let workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Draft', 'Actual practice text', workbookTime);
  workbook = setWorkbookTestLink(workbook, 'item-1', 1, test);
  const item = workbook.items[0];
  const link = item.links[0];
  assert.match(workbookLinkState(item, link, [test]), /current saved revision and test definition/);
  assert.match(workbookLinkState(item, link, []), /removed/);
  for (const field of ['name', 'input', 'expected']) {
    assert.match(workbookLinkState(item, link, [{ ...test, [field]: 'Definition changed' }]), /definition changed/);
  }
  assert.match(workbookLinkState(item, link, [{ ...test, actual: 'New outcome', status: 'fail' }]), /current saved revision/);
  workbook = appendWorkbookRevision(workbook, 'item-1', 'Draft', 'Actual revised text', workbookTime);
  assert.match(workbookLinkState(workbook.items[0], link, [test]), /older saved revision/);
  assert.equal(JSON.stringify(test), before);
});

test('optional workbook round-trips legacy/account projects, merges only its own part and blocks stale/deleted saves', async () => {
  const { newPilotProject, readPilotProject, saveProject, loadProject, saveProjectPart, deleteProject, projectResultsSeed, projectProposalSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const project = newPilotProject(projectId, 'ai-content-services', 'Legacy practice');
  assert.equal('workbook' in readPilotProject(JSON.stringify(project)), false);
  assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook: null })), /workbook/);
  assert.throws(() => readPilotProject(JSON.stringify({ ...project, workbook: { version: 2, items: [] } })), /workbook/);
  const storage = memoryStorage();
  storage.setItem('desofec:pilot-proposal:v1', 'STANDALONE_PROPOSAL_CANARY');
  storage.setItem('desofec:pilot-results:v1', 'STANDALONE_RESULTS_CANARY');
  saveProject(storage, project, 0, { userId: projectId, version: 2 });
  const workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Saved title', 'Saved body', workbookTime);
  saveProjectPart(storage, projectId, 'results', projectResultsSeed(project), 'null');
  saveProjectPart(storage, projectId, 'proposal', projectProposalSeed(project), 'null');
  const saved = saveProjectPart(storage, projectId, 'workbook', workbook, 'null');
  assert.deepEqual(saved.project.results, projectResultsSeed(project));
  assert.deepEqual(saved.project.proposal, projectProposalSeed(project));
  assert.deepEqual(saved.project.completed, []);
  assert.deepEqual(saved.cloud, { userId: projectId, version: 2 });
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project, 'account snapshots preserve workbook');
  saveProjectPart(storage, projectId, 'results', { ...projectResultsSeed(project), decision: 'stop' }, JSON.stringify(saved.project.results));
  assert.deepEqual(loadProject(storage, projectId).project.workbook, workbook, 'results save preserves workbook');
  assert.throws(() => saveProjectPart(storage, projectId, 'workbook', workbook, 'null'), /draft changed/);
  const copy = loadProject(storage, projectId);
  deleteProject(storage, projectId, copy.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'workbook', workbook, JSON.stringify(workbook)), /not found/);
  assert.equal(storage.getItem('desofec:pilot-proposal:v1'), 'STANDALONE_PROPOSAL_CANARY');
  assert.equal(storage.getItem('desofec:pilot-results:v1'), 'STANDALONE_RESULTS_CANARY');
});

test('workbook export includes only saved revisions while summaries and portfolios never include draft bodies or financial fields', async () => {
  const { appendWorkbookRevision, buildWorkbookExport, setWorkbookTestLink } = await loadContent('../lib/evidence-workbook.ts');
  const { buildProjectSummary, saveProject, loadProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildServicePortfolio } = await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const project = await contentProjectFixture();
  const first = appendWorkbookRevision({ version: 1, items: [] }, null, 'Draft one', 'PRIVATE_WORKBOOK_V1_CANARY', workbookTime);
  project.workbook = appendWorkbookRevision(first, 'item-1', 'Draft two', 'PRIVATE_WORKBOOK_V2_CANARY', workbookTime);
  project.workbook = setWorkbookTestLink(project.workbook, 'item-1', 1, project.results.tests[0]);
  const storage = memoryStorage();
  saveProject(storage, project, 0);
  const saved = loadProject(storage, projectId);
  project.workbook.items[0].revisions[1].body = 'UNSAVED_WORKBOOK_CANARY';
  const report = buildWorkbookExport(saved.project.workbook, saved.project.title, saved.project.results.tests, (text) => text);
  assert.match(report, /PRIVATE_WORKBOOK_V1_CANARY/);
  assert.match(report, /PRIVATE_WORKBOOK_V2_CANARY/);
  assert.match(report, /older saved revision/);
  assert.doesNotMatch(report, /UNSAVED_WORKBOOK_CANARY|98765|87654|PRIVATE_PROPOSAL_CANARY|RAW_TEST_/);
  assert.doesNotMatch(buildProjectSummary(saved.project, (text) => text), /PRIVATE_WORKBOOK/);
  assert.doesNotMatch(buildServicePortfolio(saved.project, (text) => text), /PRIVATE_WORKBOOK/);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const tr = (text) => { assert.ok(book[text], `${locale}: missing workbook phrase "${text}"`); return book[text]; };
    assert.ok(buildWorkbookExport(saved.project.workbook, saved.project.title, saved.project.results.tests, tr).startsWith(book['PRIVATE EVIDENCE WORKBOOK - SELF-RECORDED PRACTICE, NOT VERIFIED CLIENT WORK']));
  }
});

test('workbook interface, starters, errors and privacy consent have three translations', async () => {
  const strings = new Set();
  for (const file of ['../lib/evidence-workbook.ts', '../components/project-evidence-workbook.tsx',
    '../app/business-launchpad/evidence-workbook/page.tsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isPropertyAssignment(node) && ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services'].includes(node.name.text)) return;
      if (ts.isStringLiteral(node) && /^[A-Z]/.test(node.text)) strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing workbook phrase "${text}"`);
  }
});

const journeyImports = {
  ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts',
  '@/lib/first-content-project': '../lib/first-content-project.ts'
};
async function contentProjectFixture() {
  const { newPilotProject, projectProposalSeed, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  const { emptyPilotTest } = await loadContent('../lib/pilot-results.ts');
  const project = newPilotProject(projectId, 'ai-content-services', 'Cedar Bakery fictional practice');
  project.brief = {
    objective: 'Separate known bakery hours from unknown delivery and allergens.',
    scope: 'Three posts, four FAQ answers; no publication or invented prices.',
    review: 'Owner approval unavailable in fictional practice; keep blocked.'
  };
  project.completed = ['brief', 'scope', 'evidence', 'review', 'handover'];
  project.proposal = projectProposalSeed(project);
  for (const key of ['exclusions', 'acceptance', 'reviewer', 'handover']) project.proposal.inputs[key] = `Practice ${key}`;
  project.proposal.inputs.setupRate = '98765.43';
  project.proposal.document = 'PRIVATE_PROPOSAL_CANARY';
  project.proposal.source = proposalSource(project.proposal.inputs, 'en');
  project.results = projectResultsSeed(project);
  project.results.metrics.cost = '87654.32';
  project.results.tests = ['Brief facts', 'Post word counts', 'Asset permissions', 'Owner approval'].map((name, index) => ({
    ...emptyPilotTest(`test-${index + 1}`), name,
    input: 'RAW_TEST_INPUT_CANARY', expected: 'RAW_TEST_EXPECTED_CANARY',
    actual: 'RAW_TEST_ACTUAL_CANARY', correction: 'RAW_CORRECTION_CANARY',
    status: index === 3 ? 'blocked' : 'pass'
  }));
  project.results.decision = 'revise';
  Object.assign(project.results.notes, {
    rationale: 'Revise the copy; live approval is unavailable.',
    uncertainty: 'Permissions and owner approval remain unverified.',
    nextSteps: 'Keep publication paused and preserve versioned files.'
  });
  return project;
}

test('completion dashboard reuses sequential project milestones and never converts recorded gaps into approval', async () => {
  const { projectCompletion } = await loadContent('../lib/project-completion.ts', {
    ...journeyImports, '@/lib/service-project-journeys': '../lib/service-project-journeys.ts'
  });
  const { newPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const project = await contentProjectFixture();
  const before = JSON.stringify(project);
  const result = projectCompletion(project);
  assert.equal(result.recorded, 6);
  assert.equal(result.total, 6);
  assert.equal(result.ready, true);
  assert.equal(result.summary.blocked, 1);
  assert.equal(result.decision, 'revise');
  assert.equal(result.caseStudyStatus, 'No saved case study.');
  assert.equal(result.nextHref, `/business-launchpad/case-study-builder?project=${project.id}`);
  assert.equal(JSON.stringify(project), before);
  project.completed = project.completed.filter((id) => id !== 'handover');
  assert.equal(projectCompletion(project).recorded, 5);
  assert.equal(projectCompletion(project).nextHref, `/business-launchpad/projects?project=${project.id}#project-brief-form`);
  project.proposal = null;
  assert.equal(projectCompletion(project).recorded, 2);
  assert.equal(projectCompletion(project).nextHref, `/business-launchpad/proposal-builder?project=${project.id}`);
  const empty = newPilotProject(projectId, 'ai-spreadsheets', 'Sample');
  assert.equal(projectCompletion(empty).recorded, 0);
  assert.equal(projectCompletion(empty).nextHref, '/tutorials/ai-spreadsheets');
  for (const decision of ['continue', 'revise', 'stop']) {
    const full = await contentProjectFixture();
    full.results.decision = decision;
    assert.equal(projectCompletion(full).decision, decision);
    assert.equal(projectCompletion(full).summary.open, 1);
  }
});

test('completion case study status distinguishes absent text and missing references without claiming verification', async () => {
  const { projectCompletion } = await loadContent('../lib/project-completion.ts', {
    ...journeyImports, '@/lib/service-project-journeys': '../lib/service-project-journeys.ts'
  });
  const { emptyCaseStudy, caseStudyFields } = await loadContent('../lib/case-study.ts', projectImports);
  const project = await contentProjectFixture();
  project.caseStudy = emptyCaseStudy();
  assert.equal(projectCompletion(project).caseStudyStatus, 'Saved case study needs text or updated test references.');
  for (const { key } of caseStudyFields) project.caseStudy.text[key] = 'Fictional practice';
  project.caseStudy.testIds = ['test-20'];
  assert.equal(projectCompletion(project).caseStudyStatus, 'Saved case study needs text or updated test references.');
  project.caseStudy.testIds = ['test-1'];
  assert.equal(projectCompletion(project).caseStudyStatus, 'Case study text saved; evidence and sharing still need review.');
});

test('start here and dashboard have translated states, safe routes and no new project storage', async () => {
  const files = ['../app/start-here/page.tsx', '../components/project-completion-dashboard.tsx', '../lib/project-completion.ts'];
  const strings = new Set([
    'Practical learning for beginners',
    'Follow a clear route from beginner lessons to a fictional work sample, recorded evidence and a private case study. No client or income promises.'
  ]);
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'metadata') return;
      if (ts.isStringLiteral(node) && /^[A-Z]/.test(node.text)) strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.doesNotMatch(source, /localStorage\.(setItem|removeItem)|saveProject\(/);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing start-here phrase "${text}"`);
  }
  const home = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const header = await readFile(new URL('../components/site-header.tsx', import.meta.url), 'utf8');
  assert.match(home, /href="\/start-here"/);
  assert.match(header, /href: '\/start-here'/);
});

test('guided content milestones are sequential, saved-data derived and accept documented blocked outcomes without approval', async () => {
  const { contentJourney, projectJourneyHref, buildContentPortfolio } =
    await loadContent('../lib/first-content-project.ts', journeyImports);
  const project = await contentProjectFixture();
  const before = JSON.stringify(project);
  assert.equal(contentJourney(project).ready, true);
  assert.equal(contentJourney(project).summary.blocked, 1);
  for (const decision of ['continue', 'revise', 'stop']) {
    const copy = structuredClone(project);
    copy.results.decision = decision;
    const report = buildContentPortfolio(copy, (text) => text);
    assert.match(report, new RegExp(`Recorded decision: ${decision[0].toUpperCase() + decision.slice(1)}`));
    assert.match(report, /FICTIONAL CONTENT SERVICE, NOT CLIENT WORK/);
    assert.match(report, /Practice record assembled - self-recorded, not independently verified/);
    assert.match(report, /Blocked: 1/);
    assert.match(report, /No client approval, publication permission/);
    assert.doesNotMatch(report, /98765|87654|PRIVATE_PROPOSAL_CANARY|RAW_TEST_|RAW_CORRECTION_CANARY/);
  }
  assert.equal(JSON.stringify(project), before);
  assert.equal(projectJourneyHref(project, 'proposal'), `/business-launchpad/proposal-builder?project=${project.id}`);
  assert.equal(projectJourneyHref(project, 'results'), `/business-launchpad/results-tracker?project=${project.id}`);
  assert.equal(projectJourneyHref(project, 'tutorial'), '/tutorials/ai-content-services');
  assert.equal(projectJourneyHref(project, 'kit'), '/starter-packs/ai-content-services-kit');
  assert.equal(projectJourneyHref(project, 'brief'), '#project-brief-form');
  for (const [milestone, next] of [['brief', 'learn'], ['scope', 'practise'], ['evidence', 'test'], ['review', 'review'], ['handover', 'handover']]) {
    const copy = structuredClone(project);
    copy.completed = copy.completed.filter((item) => item !== milestone);
    const result = contentJourney(copy);
    assert.equal(result.next.id, next);
    assert.equal(result.ready, false);
    assert.ok(result.stages.slice(result.stages.findIndex((stage) => stage.id === next)).every((stage) => !stage.complete));
    assert.match(buildContentPortfolio(copy, (text) => text), /Incomplete practice draft/);
  }
  for (const field of ['objective', 'scope', 'review']) {
    const copy = structuredClone(project);
    copy.brief[field] = ' ';
    assert.equal(contentJourney(copy).next.id, field === 'objective' ? 'learn' : 'practise');
  }
  assert.throws(() => buildContentPortfolio({ ...project, pathId: 'ai-cad-services' }, (text) => text), /only/);
});

test('guided proposal and test milestones reject missing, stale, unsupported and duplicate evidence', async () => {
  const { contentJourney } = await loadContent('../lib/first-content-project.ts', journeyImports);
  const project = await contentProjectFixture();
  for (const mutate of [
    (copy) => { copy.proposal = null; },
    (copy) => { copy.proposal.document = ''; },
    (copy) => { copy.proposal.source = '{'; },
    (copy) => { copy.proposal.inputs.scope = 'Stale form'; },
    (copy) => { copy.proposal.inputs.acceptance = ''; }
  ]) {
    const copy = structuredClone(project);
    mutate(copy);
    assert.equal(contentJourney(copy).next.id, 'draft');
  }
  for (const mutate of [
    (copy) => { copy.results = null; },
    (copy) => { copy.results.tests.pop(); },
    (copy) => { copy.results.tests[3].name = '  BRIEF FACTS  '; },
    (copy) => { copy.results.tests[3].actual = ' '; },
    (copy) => { copy.results.tests[0].actual = ''; },
    (copy) => { copy.results.tests[0].retestStatus = 'pass'; copy.results.tests[0].retest = ''; },
    (copy) => { copy.results.tests[0].status = 'pending'; }
  ]) {
    const copy = structuredClone(project);
    mutate(copy);
    assert.equal(contentJourney(copy).next.id, 'test');
  }
  const retested = structuredClone(project);
  retested.results.tests[0].status = 'fail';
  retested.results.tests[0].retestStatus = 'pass';
  retested.results.tests[0].retest = 'Rechecked the source facts; corrected hours now match.';
  assert.equal(contentJourney(retested).ready, true);
  const failed = structuredClone(project);
  failed.results.tests[0].status = 'fail';
  assert.equal(contentJourney(failed).ready, true, 'recorded failure is evidence, not an approved outcome');
  for (const key of ['rationale', 'uncertainty', 'nextSteps']) {
    const copy = structuredClone(project);
    copy.results.notes[key] = ' ';
    assert.equal(contentJourney(copy).next.id, 'review');
  }
  const undecided = structuredClone(project);
  undecided.results.decision = '';
  assert.equal(contentJourney(undecided).next.id, 'review');
});

test('guided portfolio uses unchanged project serialization and has translated interface and exports', async () => {
  const { contentJourney, buildContentPortfolio } = await loadContent('../lib/first-content-project.ts', journeyImports);
  const { saveProject, loadProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const project = await contentProjectFixture();
  const storage = memoryStorage();
  saveProject(storage, project, 0, { userId: projectId, version: 1 });
  project.brief.objective = 'UNSAVED_CANARY';
  const saved = loadProject(storage, projectId);
  assert.doesNotMatch(buildContentPortfolio(saved.project, (text) => text), /UNSAVED_CANARY/);
  assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project);
  assert.equal(contentJourney(saved.project).ready, true);
  const strings = new Set(['Find a guided first project']);
  const files = ['../lib/first-content-project.ts', '../components/first-project-chooser.tsx',
    '../components/service-project-journey.tsx', '../app/business-launchpad/first-project/page.tsx'];
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node) => {
      if (ts.isStringLiteral(node) && /^(?:[A-Z]|[1-6]\.)/.test(node.text) && node.text !== 'AI Content Services') strings.add(node.text);
      if (ts.isJsxText(node) && node.parent.openingElement?.tagName.getText(ast) === 'Tr' && node.text.trim()) strings.add(node.text.trim());
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    const catalog = JSON.parse(await readFile(new URL(`../content/translations/catalog-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text] || catalog[text], `${locale}: missing guided phrase "${text}"`);
    const report = buildContentPortfolio(saved.project, (text) => book[text] ?? text);
    assert.ok(report.startsWith(book['PRACTICE PORTFOLIO - FICTIONAL CONTENT SERVICE, NOT CLIENT WORK']));
    assert.doesNotMatch(report, /Recorded decision:|Practice record assembled - self-recorded/);
  }
});

test('service journeys define distinct required plans without invented evidence or changed schemas', async () => {
  const { serviceJourneys, serviceJourneyTests, serviceProjectJourney, serviceJourneyCoverage } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const counts = { 'ai-automation-services': 9, 'ai-cad-services': 5, 'micro-saas-validation': 8, 'ai-education-services': 5, 'ai-video-business': 7, 'ai-spreadsheets': 7,
    'ai-online-retail': 5, 'ai-marketplace-model': 5, 'ai-logistics-services': 5 };
  const allCodes = new Set();
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    const original = JSON.stringify(project);
    const plans = serviceJourneyTests(pathId, (text) => text);
    assert.equal(plans.length, counts[pathId]);
    assert.deepEqual(plans.map((test) => test.id), plans.map((_, index) => `test-${index + 1}`));
    for (const [index, plan] of plans.entries()) {
      const { code, label } = definition.checks[index];
      assert.equal(allCodes.has(code), false);
      allCodes.add(code);
      assert.equal(plan.name, `[${code}] ${label}`);
      assert.ok(plan.input.trim() && plan.expected.trim());
      assert.equal(plan.status, 'pending');
      assert.equal(plan.retestStatus, 'pending');
      for (const field of ['actual', 'correction', 'retest']) assert.equal(plan[field], '');
    }
    assert.equal(JSON.stringify(project), original);
    project.results.tests = plans;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    assert.equal(serviceProjectJourney(project).next.id, 'test');
    assert.ok(serviceJourneyCoverage(project).every((check) => !check.recorded));
    assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
  }
  assert.throws(() => serviceJourneyTests('ai-content-services', (text) => text), /content-service checks/);
});

test('required service evidence cannot be replaced by arbitrary counts, duplicates or unsupported passes and retests', async () => {
  const { serviceJourneys, serviceJourneyTests, serviceProjectJourney, serviceJourneyCoverage } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    project.results.tests = serviceJourneyTests(pathId, (text) => text).map((test, index) => ({
      ...test, actual: index === definition.checks.length - 1 ? 'Required external review unavailable; documented blocked.' : 'Observed fictional result in my practice files.',
      status: index === definition.checks.length - 1 ? 'blocked' : 'pass'
    }));
    assert.equal(serviceProjectJourney(project).ready, true);
    const renamed = structuredClone(project);
    renamed.results.tests.forEach((test) => { test.name = test.name.split(']')[0] + '] Titre traduit'; });
    assert.equal(serviceProjectJourney(renamed).ready, true, 'stable codes survive translated names');
    for (const mutate of [
      (copy) => { copy.results.tests.pop(); },
      (copy) => { copy.results.tests[0].name = '[UNRELATED-1] arbitrary test'; },
      (copy) => { copy.results.tests[0].actual = ' '; },
      (copy) => { copy.results.tests[0].input = ''; },
      (copy) => { copy.results.tests[0].expected = ''; },
      (copy) => { copy.results.tests[0].status = 'pending'; },
      (copy) => { copy.results.tests[0].retestStatus = 'pass'; copy.results.tests[0].retest = ''; },
      (copy) => { copy.results.tests.push({ ...copy.results.tests[0], id: 'test-20' }); },
      (copy) => { copy.results.tests[1].name = copy.results.tests[0].name; },
      (copy) => { copy.results.tests[0].name = '[AUTO-10] wrong code'; }
    ]) {
      const copy = structuredClone(project);
      mutate(copy);
      assert.equal(serviceProjectJourney(copy).next.id, 'test', pathId);
      assert.ok(serviceJourneyCoverage(copy).some((check) => !check.recorded));
    }
    for (const status of ['fail', 'blocked']) {
      const copy = structuredClone(project);
      copy.results.tests[0].status = status;
      assert.equal(serviceProjectJourney(copy).ready, true, 'documented learning is not a success claim');
    }
    const retested = structuredClone(project);
    Object.assign(retested.results.tests[0], { status: 'fail', retestStatus: 'pass', retest: 'Dated recheck after correction in fictional exercise.' });
    assert.equal(serviceProjectJourney(retested).ready, true);
    for (const [flag, expected] of [['brief', 'learn'], ['scope', 'practise'], ['evidence', 'test'], ['review', 'review'], ['handover', 'handover']]) {
      const copy = structuredClone(project);
      copy.completed = copy.completed.filter((item) => item !== flag);
      const journey = serviceProjectJourney(copy);
      assert.equal(journey.next.id, expected);
      assert.equal(journey.stages.at(-1).complete, false);
    }
    for (const field of definition.proposalFields) {
      const copy = structuredClone(project);
      copy.proposal.inputs[field] = '';
      copy.proposal.source = proposalSource(copy.proposal.inputs, 'en');
      assert.equal(serviceProjectJourney(copy).next.id, 'draft', pathId + ': ' + field);
    }
    const stale = structuredClone(project);
    stale.proposal.inputs.scope = 'New unsynchronised proposal input';
    assert.equal(serviceProjectJourney(stale).next.id, 'draft');
    for (const field of ['rationale', 'uncertainty', 'nextSteps']) {
      const copy = structuredClone(project);
      copy.results.notes[field] = '';
      assert.equal(serviceProjectJourney(copy).next.id, 'review');
    }
    const undecided = structuredClone(project);
    undecided.results.decision = '';
    assert.equal(serviceProjectJourney(undecided).next.id, 'review');
  }
});

test('service portfolios preserve decisions, missing coverage, privacy and optional account serialization in four languages', async () => {
  const { serviceJourneys, serviceJourneyTests, buildServicePortfolio, serviceProjectJourney } =
    await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { saveProject, loadProject, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  for (const [pathId, definition] of Object.entries(serviceJourneys)) {
    const project = await contentProjectFixture();
    project.pathId = pathId;
    for (const key of definition.proposalFields) project.proposal.inputs[key] = `Practice ${key}`;
    project.proposal.source = proposalSource(project.proposal.inputs, 'en');
    project.results.tests = serviceJourneyTests(pathId, (text) => text).map((test) => ({
      ...test, actual: 'RAW_PRIVATE_EVIDENCE_CANARY', status: 'blocked'
    }));
    const before = JSON.stringify(project);
    for (const decision of ['continue', 'revise', 'stop']) {
      const copy = structuredClone(project);
      copy.results.decision = decision;
      const report = buildServicePortfolio(copy, (text) => text);
      assert.ok(report.startsWith(definition.heading));
      assert.ok(report.includes(definition.boundary));
      assert.match(report, new RegExp(`Recorded decision: ${decision[0].toUpperCase() + decision.slice(1)}`));
      assert.match(report, /Practice record assembled - self-recorded/);
      assert.match(report, /not a passing grade or independent verification/);
      assert.doesNotMatch(report, /98765|87654|RAW_PRIVATE_EVIDENCE_CANARY|PRIVATE_PROPOSAL_CANARY/);
    }
    assert.equal(JSON.stringify(project), before);
    const storage = memoryStorage();
    saveProject(storage, project, 0, { userId: projectId, version: 3 });
    project.brief.objective = 'UNSAVED_CANARY';
    const saved = loadProject(storage, projectId);
    assert.deepEqual(readPilotProject(JSON.stringify(saved.project)), saved.project);
    assert.equal(serviceProjectJourney(saved.project).ready, true);
    assert.doesNotMatch(buildServicePortfolio(saved.project, (text) => text), /UNSAVED_CANARY/);
    const partial = structuredClone(saved.project);
    partial.results.tests[0].actual = '';
    const report = buildServicePortfolio(partial, (text) => text);
    assert.match(report, /Incomplete practice draft/);
    assert.ok(report.includes(`[ ] [${definition.checks[0].code}]`));
    for (const locale of ['fr', 'de', 'es']) {
      if (['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services'].includes(pathId)) continue;
      const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
      const tr = (text) => { assert.ok(book[text], `${locale}: missing service phrase "${text}"`); return book[text]; };
      for (const field of ['title', 'heading', 'exercise', 'boundary', 'practiceTitle', 'learn', 'practise', 'draft', 'handover']) tr(definition[field]);
      const plans = serviceJourneyTests(pathId, tr);
      assert.deepEqual(plans.map((test) => test.name.match(/^\[[^\]]+\]/)[0]), definition.checks.map((check) => `[${check.code}]`));
      assert.ok(plans.every((test) => test.actual === '' && test.status === 'pending'));
      assert.ok(buildServicePortfolio(saved.project, tr).startsWith(book[definition.heading]));
    }
  }
  const content = await contentProjectFixture();
  const { buildContentPortfolio, contentJourney } = await loadContent('../lib/first-content-project.ts', journeyImports);
  assert.equal(buildServicePortfolio(content, (text) => text), buildContentPortfolio(content, (text) => text));
  assert.deepEqual(serviceProjectJourney(content), contentJourney(content), 'existing content behavior is unchanged');
});

test('commerce projects share safe persistence, kit routing, workbook and review surfaces', async () => {
  const { newPilotProject, saveProject, loadProject, saveProjectPart, projectKitId, commerceProjectTrack } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { projectJourneyHref } = await loadContent('../lib/first-content-project.ts', journeyImports);
  const { workbookStarters, appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyReviewChecks, saveTextReview } = await loadContent('../lib/project-review.ts', projectImports);
  const { serviceJourneyTests, serviceProjectJourney, buildServicePortfolio } = await loadContent('../lib/service-project-journeys.ts', journeyImports);
  for (const [path, track] of [['ai-online-retail', 'retail'], ['ai-marketplace-model', 'marketplace'], ['ai-logistics-services', 'logistics']]) {
    const storage = memoryStorage();
    const project = newPilotProject(projectId, path, `Fictional ${track}`);
    saveProject(storage, project, 0);
    assert.equal(projectKitId(path), 'ai-commerce-services-kit');
    assert.equal(commerceProjectTrack(path), track);
    assert.equal(projectJourneyHref(project, 'kit'), '/starter-packs/ai-commerce-services-kit');
    const starter = workbookStarters[path];
    assert.match(starter.text, /FICTIONAL/);
    const workbook = appendWorkbookRevision({ version: 1, items: [] }, null, starter.title, starter.text, workbookTime);
    let saved = saveProjectPart(storage, projectId, 'workbook', workbook, 'null');
    assert.deepEqual(saved.project.completed, []);
    assert.equal(saved.project.results, null);
    assert.throws(() => saveProjectPart(storage, projectId, 'workbook', workbook, 'null'), /draft changed/);
    const checks = emptyReviewChecks(path);
    assert.equal(checks.length, 4);
    assert.ok(checks.some((check) => check.id === 'approval'));
    const review = saveTextReview(saved.project, 'item-1', workbook.items[0].revisions[0], checks, workbookTime);
    saved = saveProjectPart(storage, projectId, 'reviewCentre', review, 'null');
    assert.deepEqual(loadProject(storage, projectId).project.reviewCentre, review);
    assert.equal(serviceJourneyTests(path, (s) => s).length, 5);
    assert.equal(serviceProjectJourney(saved.project).ready, false);
    const portfolio = buildServicePortfolio(saved.project, (s) => s);
    assert.match(portfolio, /FICTIONAL/);
    assert.match(portfolio, /Incomplete practice draft/);
    assert.match(portfolio, /No client approval/);
    assert.match(workbook.items[0].revisions[0].body, /blocked|BLOCKED/);
  }
  assert.equal(projectKitId('ai-content-services'), 'ai-content-services-kit');
});

test('commerce readiness distinguishes sourced observations, scenario costs and human decisions', async () => {
  const {
    emptyCommerceReadiness, readCommerceReadiness, commerceEconomics, commerceReadinessCoverage,
    buildCommerceReadinessReport, commerceResponsibilities
  } = await loadContent('../lib/commerce-readiness.ts');
  const { newPilotProject, saveProject, loadProject, saveProjectPart } = await loadContent('../lib/pilot-projects.ts', projectImports);
  for (const path of ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services']) {
    const readiness = emptyCommerceReadiness(path);
    assert.equal(commerceReadinessCoverage(readiness, path).demandRecorded, false);
    assert.equal(commerceReadinessCoverage(readiness, path).economicsCalculated, false);
    readiness.demand = {
      method: 'customer-conversations', date: '2030-01-02', sample: '3 fictional interviews',
      source: 'Permissioned notes, no personal data', finding: 'One requested an example',
      limitations: 'Small convenience sample; no purchase evidence', nextTest: 'Ask a broader sample'
    };
    for (const [index, slot] of ['option-1', 'option-2'].entries()) {
      readiness.options[slot] = {
        name: `Option ${index + 1}`, country: 'XX / USD eligibility to verify',
        source: 'Official provider fee page', checkedAt: '2030-01-02',
        eligibility: 'Not confirmed', fees: '3 USD/order, verify current terms', limitations: 'Country account not tested'
      };
    }
    readiness.economics = {
      currency: 'USD', price: '20', productCost: '6', platformFees: '3', fulfillment: '4',
      returnsSupport: '1', otherVariable: '1', fixedMonthly: '100', scenarioOrders: '40'
    };
    for (const id of commerceResponsibilities[path]) {
      readiness.responsibilities[id] = { owner: 'Operator role', status: 'proposed', evidence: 'Needs local confirmation' };
    }
    readiness.decision = { choice: 'continue-discovery', rationale: 'No verified demand or provider eligibility.', nextStep: 'Verify one assumption.' };
    const metrics = commerceEconomics(readiness);
    assert.equal(metrics.contribution, 500);
    assert.equal(metrics.breakEvenOrders, 20);
    assert.equal(metrics.scenarioBalance, 10000);
    const coverage = commerceReadinessCoverage(readiness, path);
    assert.deepEqual([
      coverage.demandRecorded, coverage.optionsCompared, coverage.economicsCalculated, coverage.responsibilitiesReviewed
    ], [true, true, true, true]);
    const report = buildCommerceReadinessReport(readiness, path, (text) => text);
    assert.match(report, /NOT LAUNCH APPROVAL/);
    assert.match(report, /Not confirmed/);
    assert.match(report, /Continue discovery only/);
    assert.match(report, /not a profit estimate/);
    assert.equal(readCommerceReadiness(readiness, path).decision.choice, 'continue-discovery');
    readiness.options['option-2'].name = 'Option 1';
    assert.equal(commerceReadinessCoverage(readiness, path).optionsCompared, false, 'duplicate options are not a comparison');
    assert.throws(() => readCommerceReadiness(readiness, 'ai-spreadsheets'), /Invalid commerce readiness/);
    assert.throws(() => readCommerceReadiness({ ...readiness, economics: { ...readiness.economics, price: '-1' } }, path), /Invalid commerce readiness/);
    assert.throws(() => readCommerceReadiness({ ...readiness, economics: { ...readiness.economics, currency: 'US' } }, path), /Invalid commerce readiness/);
    assert.throws(() => readCommerceReadiness({ ...readiness, options: { ...readiness.options, 'option-1': { ...readiness.options['option-1'], fees: 'x'.repeat(1201) } } }, path), /Invalid commerce readiness/);
    const storage = memoryStorage();
    const project = newPilotProject(projectId, path, 'Fictional readiness practice');
    saveProject(storage, project, 0);
    const saved = saveProjectPart(storage, projectId, 'commerceReadiness', readiness, 'null');
    assert.deepEqual(loadProject(storage, projectId).project.commerceReadiness, readiness);
    assert.equal(saved.project.brief.objective, '');
    assert.throws(() => saveProjectPart(storage, projectId, 'commerceReadiness', readiness, 'null'), /project draft changed/i);
    const latest = loadProject(storage, projectId);
    const unrelated = saveProject(storage, { ...latest.project, brief: { objective: 'Changed', scope: '', review: '' } }, latest.revision);
    assert.deepEqual(unrelated.project.commerceReadiness, readiness);
  }
  const invalid = emptyCommerceReadiness('ai-online-retail');
  invalid.economics = { ...invalid.economics, price: '9999999' };
  assert.equal(commerceEconomics(invalid), null);
  assert.throws(() => readCommerceReadiness(invalid, 'ai-online-retail'), /Invalid commerce readiness/);
});

test('commerce pilot plans enforce bounded dates, budgets, roles and measurable stop rules', async () => {
  const {
    emptyCommercePilotPlan, readCommercePilotPlan, commercePilotPlanCoverage, buildCommercePilotPlanReport,
    commercePilotRoles
  } = await loadContent('../lib/commerce-pilot-plan.ts', projectImports);
  const { newPilotProject, saveProject, loadProject, saveProjectPart, readPilotProject } = await loadContent('../lib/pilot-projects.ts', projectImports);
  for (const path of ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services']) {
    const plan = emptyCommercePilotPlan(path);
    assert.deepEqual(Object.keys(plan.roles), commercePilotRoles[path]);
    Object.assign(plan, {
      question: 'Does a bounded product-interest page collect five qualified requests?',
      hypothesis: 'At least five of twenty permitted participants request details; no purchase conversion is assumed.',
      audience: 'Adults already consenting to a fictional product survey; exclude minors and sensitive data.',
      sampleTarget: '20', method: 'Show a private mock listing, ask for a non-binding preference and stop at 20 responses.',
      startDate: '2030-01-03', reviewDate: '2030-01-10', budgetCurrency: 'USD', budgetCap: '50',
      success: { metric: 'Qualified non-binding requests out of 20 (survey count)', operator: 'at-least', threshold: '5' },
      stop: { metric: 'Privacy concern, withdrawal or complaint count', operator: 'at-least', threshold: '1' },
      status: 'review-required', exclusions: 'No live listing, sale, payment, stock, seller recruitment or shipment.'
    });
    for (const role of commercePilotRoles[path]) plan.roles[role] = {
      owner: 'Authorized role', evidence: 'Written permission and review evidence before any activity'
    };
    const coverage = commercePilotPlanCoverage(plan, path);
    assert.deepEqual(Object.values(coverage), [true, true, true, true, true, true, true]);
    plan.stop = { ...plan.success };
    assert.equal(commercePilotPlanCoverage(plan, path).thresholdsSet, false, 'success and stop rules cannot be identical');
    plan.stop = { metric: 'Privacy concern, withdrawal or complaint count', operator: 'at-least', threshold: '1' };
    const report = buildCommercePilotPlanReport(plan, path, (text) => text, 'continue-discovery');
    assert.match(report, /NOT AUTHORIZATION TO EXECUTE/);
    assert.match(report, /USD 50/);
    assert.match(report, /At least 5/);
    assert.match(report, /Continue discovery only/);
    assert.match(report, /not execution approval/);
    assert.match(report, /No participants are contacted/);
    assert.equal(readCommercePilotPlan(plan, path).status, 'review-required');

    const storage = memoryStorage();
    saveProject(storage, newPilotProject(projectId, path, 'Fictional bounded experiment'), 0);
    const saved = saveProjectPart(storage, projectId, 'commercePilotPlan', plan, 'null');
    assert.deepEqual(loadProject(storage, projectId).project.commercePilotPlan, plan);
    assert.equal(saved.project.commerceReadiness, undefined);
    assert.throws(() => saveProjectPart(storage, projectId, 'commercePilotPlan', plan, 'null'), /project draft changed/i);

    assert.throws(() => readCommercePilotPlan({ ...plan, reviewDate: '2030-01-02' }, path), /review date/i);
    assert.throws(() => readCommercePilotPlan({ ...plan, budgetCurrency: 'US' }, path), /Invalid commerce pilot plan/i);
    assert.throws(() => readCommercePilotPlan({ ...plan, budgetCap: '-1' }, path), /Invalid commerce pilot plan/i);
    assert.throws(() => readCommercePilotPlan({ ...plan, sampleTarget: '1000000' }, path), /Invalid commerce pilot plan/i);
    assert.throws(() => readCommercePilotPlan({ ...plan, success: { ...plan.success, threshold: '1.234' } }, path), /Invalid commerce pilot plan/i);
    assert.throws(() => readCommercePilotPlan({ ...plan, roles: { ...plan.roles, [commercePilotRoles[path][0]]: null } }, path), /Invalid commerce pilot plan/i);
    assert.throws(() => readPilotProject(JSON.stringify({
      ...newPilotProject(projectId, 'ai-spreadsheets', 'Non-commerce'),
      commercePilotPlan: plan
    })), /only valid for commerce projects/i);
  }
  const blank = emptyCommercePilotPlan('ai-online-retail');
  assert.ok(Object.values(commercePilotPlanCoverage(blank, 'ai-online-retail')).every((complete) => complete === false));
  blank.startDate = '2030-02-31';
  assert.throws(() => readCommercePilotPlan(blank, 'ai-online-retail'), /review date/i);
});

test('commerce pilot reviews compare aggregate outcomes without choosing a decision', async () => {
  const { emptyCommercePilotPlan } = await loadContent('../lib/commerce-pilot-plan.ts', projectImports);
  const {
    emptyCommercePilotReview, readCommercePilotReview, commercePilotReviewMatchesPlan,
    commercePilotReviewSummary, buildCommercePilotReviewReport
  } = await loadContent('../lib/commerce-pilot-review.ts', projectImports);
  const { newPilotProject, saveProject, loadProject, saveProjectPart, readPilotProject } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  for (const path of ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services']) {
    const plan = emptyCommercePilotPlan(path);
    Object.assign(plan, {
      question: 'Does the offline mock receive five qualified non-binding requests?',
      audience: 'Adults using an approved fictional survey', sampleTarget: '20',
      method: 'Review aggregate opt-in counts only.', budgetCurrency: 'USD', budgetCap: '50',
      success: { metric: 'Qualified requests', operator: 'at-least', threshold: '5' },
      stop: { metric: 'Privacy concern count', operator: 'at-least', threshold: '1' },
      startDate: '2030-01-03', reviewDate: '2030-01-10'
    });
    const review = emptyCommercePilotReview(plan);
    assert.equal(commercePilotReviewSummary(review).successMet, null);
    assert.equal(review.decision, 'not-decided', 'threshold comparisons never choose a decision');
    Object.assign(review, {
      reviewDate: '2030-01-11', sampleCompleted: '20', successObserved: '5', stopObserved: '0',
      actualSpend: '49', evidenceSummary: 'Aggregate counts from the approved offline survey; no individual records retained.',
      unexpectedFindings: 'None recorded.', learning: 'The result needs a broader eligible sample.',
      decision: 'explore', rationale: 'Human reviewer recommends a separate discovery question.',
      nextQuestion: 'Would a different category produce the same aggregate interest?'
    });
    const summary = commercePilotReviewSummary(review);
    assert.deepEqual([
      summary.successMet, summary.stopTriggered, summary.sampleWithinPlan,
      summary.budgetWithinPlan, summary.decisionReasoned
    ], [true, false, true, true, true]);
    const report = buildCommercePilotReviewReport(review, path, (text) => text);
    assert.match(report, /NOT AUTHORIZATION/);
    assert.match(report, /Success threshold met/);
    assert.match(report, /Stop threshold not triggered/);
    assert.match(report, /USD 49 \/ 50/);
    assert.match(report, /Explore further/);
    assert.match(report, /aggregate observations only/);
    assert.deepEqual(readCommercePilotReview(review, path), review);

    review.successObserved = '4';
    review.stopObserved = '1';
    review.sampleCompleted = '21';
    review.actualSpend = '51';
    const overrun = commercePilotReviewSummary(review);
    assert.deepEqual([
      overrun.successMet, overrun.stopTriggered, overrun.sampleWithinPlan, overrun.budgetWithinPlan
    ], [false, true, false, false]);
    assert.equal(commercePilotReviewMatchesPlan(review, { ...plan, budgetCap: '49' }), false);

    const storage = memoryStorage();
    saveProject(storage, newPilotProject(projectId, path, 'Fictional results review'), 0);
    saveProjectPart(storage, projectId, 'commercePilotPlan', plan, 'null');
    const saved = saveProjectPart(storage, projectId, 'commercePilotReview', review, 'null');
    assert.deepEqual(loadProject(storage, projectId).project.commercePilotReview, review);
    assert.deepEqual(saved.project.commercePilotPlan, plan);
    assert.throws(() => saveProjectPart(storage, projectId, 'commercePilotReview', review, 'null'), /project draft changed/i);
    assert.throws(() => readPilotProject(JSON.stringify({
      ...newPilotProject(projectId, 'ai-spreadsheets', 'Non-commerce'),
      commercePilotReview: review
    })), /only valid for commerce projects/i);
    assert.throws(() => readCommercePilotReview({ ...review, reviewDate: '2030-02-31' }, path), /Review date/i);
    assert.throws(() => readCommercePilotReview({ ...review, actualSpend: '-1' }, path), /Invalid commerce pilot review/i);
    assert.throws(() => readCommercePilotReview({ ...review, decision: 'approved' }, path), /Invalid commerce pilot review/i);
    assert.throws(() => readCommercePilotReview({ ...review, evidenceSummary: 'x'.repeat(1601) }, path), /Invalid commerce pilot review/i);
  }
});

test('commerce English-only project content has translated notices on every editing surface', async () => {
  const notice = 'Commerce project instructions, workbook starters and required checks are English. Navigation follows your language. Save selected fictional lab observations manually; no files are uploaded or evidence automatically approved.';
  for (const file of ['first-project-chooser', 'service-project-journey', 'project-evidence-workbook', 'project-review-centre', 'pilot-project-tool']) {
    const source = await readFile(new URL(`../components/${file}.tsx`, import.meta.url), 'utf8');
    assert.ok(source.includes(`tr('${notice}')`), file);
    if (file !== 'commerce-readiness-builder') assert.match(source, /commerceProjectTrack/);
  }
  const readinessNotice = 'Commerce readiness form labels, validation messages and report text are in English. Navigation follows your language.';
  const readinessComponent = await readFile(new URL('../components/commerce-readiness-builder.tsx', import.meta.url), 'utf8');
  const readinessPage = await readFile(new URL('../app/business-launchpad/commerce-readiness/page.tsx', import.meta.url), 'utf8');
  assert.ok(readinessComponent.includes(`tr('${readinessNotice}')`));
  assert.ok(readinessPage.includes(`<Tr>${readinessNotice}</Tr>`));
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    assert.ok(book[notice]);
    assert.ok(book[readinessNotice]);
    assert.ok(book['Commerce account upload failed. Check your connection and apply migration 0014 after 0013. If this project exists or changed on another device, refresh the account list and load its latest copy first.']);
    assert.ok(book['Commerce readiness snapshots also include customer evidence notes, provider comparisons, cost scenarios and operational role assignments. Review them before consenting to upload.']);
      assert.ok(book['Commerce pilot plan snapshots also include the proposed sample, budget cap, success and stop criteria, role assignments, evidence requirements and exclusions. Review them before consenting to upload.']);
      assert.ok(book['Commerce pilot results reviews also include aggregate observations, actual spend, learning notes and a human-recorded decision. Review them for personal data before consenting to upload.']);
      assert.ok(book['I agree to upload this saved project, including costs, test evidence, workbook revisions, reviews, copied review text, case studies, discovery drafts, commerce readiness evidence, pilot planning and aggregate results reviews, to my private account when I press Upload.']);
      assert.ok(book['A bounded pilot plan is saved for this project. Review its cap, criteria, roles and review date separately; it never authorizes activity.']);
      assert.ok(book['Review saved pilot results and learning']);
      assert.ok(book['Record pilot results and learning']);
      assert.ok(book['Commerce Pilot Results & Learning Review']);
      assert.ok(book['Results review labels, validation messages and report text are in English. Navigation follows your language.']);
      assert.ok(book['I confirm this review contains aggregate observations only and no participant-level or personal data.']);
      assert.ok(book['Commerce pilot plans are only valid for commerce projects.']);
      assert.ok(book['Commerce validation and launch readiness']);
    assert.ok(book['Commerce Validation & Readiness']);
    assert.ok(book['Open a saved retail, marketplace or logistics project in the workspace before recording readiness.']);
    assert.ok(book['Commerce Pilot Planner']);
    assert.ok(book['Pilot planner labels, validation messages and report text are in English. Navigation follows your language.']);
  }
  const migration = await readFile(new URL('../../supabase/migrations/0014_commerce_projects.sql', import.meta.url), 'utf8');
  for (const path of ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services']) assert.ok(migration.includes(path));
  assert.match(migration, /Unexpected save_pilot_project definition/);
  assert.match(migration, /from public, anon/);
});

test('project schema supports all service tracks, validates all nested drafts and rejects malformed data', async () => {
  const { newPilotProject, readPilotProject, servicePathIds } = await loadContent('../lib/pilot-projects.ts', projectImports);
  for (const id of servicePathIds) {
    const project = newPilotProject(projectId, id, ' Fictional pilot ');
    assert.equal(project.title, 'Fictional pilot');
    assert.deepEqual(readPilotProject(JSON.stringify(project)), project);
    for (const bad of [
      { version: 2 }, { id: '../bad' }, { pathId: 'made-up' }, { title: '' }, { title: 'a'.repeat(121) },
      { brief: { ...project.brief, scope: 42 } }, { completed: ['review', 'review'] },
      { completed: ['approved'] }, { proposal: {} }, { results: {} }, { proposal: undefined }
    ]) assert.throws(() => readPilotProject(JSON.stringify({ ...project, ...bad })));
    assert.throws(() => readPilotProject(JSON.stringify({ ...project, brief: { ...project.brief, scope: 'a'.repeat(2001) } })));
    assert.throws(() => readPilotProject(JSON.stringify({ ...project, extra: '😀'.repeat(300000) })), /storage limit/);
  }
});

test('project persistence preserves standalone drafts, enforces quota and rejects stale revisions', async () => {
  const { newPilotProject, loadProject, listProjects, saveProject, deleteProject, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const storage = memoryStorage();
  storage.setItem('desofec:pilot-proposal:v1', 'legacy proposal');
  storage.setItem('desofec:pilot-results:v1', 'legacy results');
  const project = newPilotProject(projectId, 'ai-content-services', 'Bakery practice');
  const first = saveProject(storage, project, 0);
  assert.equal(first.revision, 1);
  const second = saveProject(storage, { ...project, title: 'Reviewed brief' }, 1);
  assert.equal(second.revision, 2);
  assert.throws(() => saveProject(storage, project, 1), /another tab/);
  assert.throws(() => deleteProject(storage, projectId, 1), /another tab/);
  assert.equal(loadProject(storage, projectId).project.title, 'Reviewed brief');
  for (let index = 2; index <= 10; index++) {
    const id = `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`;
    saveProject(storage, newPilotProject(id, 'ai-education-services', `Workshop ${index}`), 0);
  }
  assert.equal(listProjects(storage).length, 10);
  assert.throws(() => saveProject(storage, newPilotProject('11111111-1111-4111-8111-000000000011', 'ai-cad-services', 'Too many'), 0), /limit reached/);
  deleteProject(storage, projectId, 2);
  assert.equal(listProjects(storage).length, 9);
  assert.equal(storage.getItem('desofec:pilot-proposal:v1'), 'legacy proposal');
  assert.equal(storage.getItem('desofec:pilot-results:v1'), 'legacy results');
  assert.throws(() => loadProject(storage, projectId), /not found/);
  storage.setItem(projectStoragePrefix + projectId, '{');
  assert.throws(() => listProjects(storage));
  assert.throws(() => loadProject(storage, 'invalid'), /Invalid project link/);
});

test('project backups preserve saved evidence and restore independent device copies', async () => {
  const { newPilotProject, saveProject, loadProject, listProjects, projectProposalSeed, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildProjectBackup, readProjectBackup, restoreProjectBackup } = await loadContent('../lib/project-backup.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const storage = memoryStorage();
  storage.setItem('desofec:pilot-proposal:v1', 'standalone draft');
  const project = newPilotProject(projectId, 'ai-content-services', 'Fictional practice');
  project.brief = { objective: 'Saved brief', scope: 'No publication', review: 'Owner approval blocked' };
  project.completed = ['brief', 'evidence'];
  project.proposal = projectProposalSeed(project);
  project.proposal.inputs.setupRate = '123.45';
  project.proposal.document = 'Private saved proposal';
  project.results = projectResultsSeed(project);
  project.results.decision = 'stop';
  Object.assign(project.results.tests[0], {
    status: 'fail', retestStatus: 'blocked', actual: 'Failure evidence', retest: 'Waiting for review'
  });
  project.workbook = {
    version: 1,
    items: [{ id: 'item-1', revisions: [
      { number: 1, title: 'First draft', body: 'Original evidence', savedAt: '2026-01-01T10:00:00.000Z' },
      { number: 2, title: 'Second draft', body: 'Revised evidence', savedAt: '2026-01-02T10:00:00.000Z' }
    ], links: [] }]
  };
  const accountId = '22222222-2222-4222-8222-222222222222';
  const saved = saveProject(storage, project, 0, { userId: accountId, version: 3 });
  const backup = buildProjectBackup(storage);
  assert.ok(backup.includes('Private saved proposal'));
  assert.ok(backup.includes('123.45'));
  assert.ok(backup.includes('Original evidence'));
  assert.ok(!backup.includes(accountId), 'account identifiers and sync metadata are not exported');
  assert.deepEqual(readProjectBackup(backup), [saved.project]);

  const copyId = '33333333-3333-4333-8333-333333333333';
  assert.deepEqual(restoreProjectBackup(storage, readProjectBackup(backup), () => copyId), [copyId]);
  const copy = loadProject(storage, copyId);
  assert.deepEqual(copy.project, { ...saved.project, id: copyId });
  assert.equal(copy.cloud, null, 'restored copies are not linked to an account');
  assert.equal(copy.revision, 1);
  assert.deepEqual(loadProject(storage, projectId), saved, 'existing project and account metadata are unchanged');
  assert.equal(listProjects(storage).length, 2);
  assert.equal(storage.getItem('desofec:pilot-proposal:v1'), 'standalone draft');
});

test('project backups reject malformed, incompatible or lossy imports before saving', async () => {
  const { newPilotProject, saveProject, listProjects } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildProjectBackup, readProjectBackup, restoreProjectBackup, projectBackupByteLimit } =
    await loadContent('../lib/project-backup.ts', {
      ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
    });
  const storage = memoryStorage();
  assert.throws(() => buildProjectBackup(storage), /No device projects/);
  const project = newPilotProject(projectId, 'ai-content-services', 'Saved project');
  saveProject(storage, project, 0);
  const backup = JSON.parse(buildProjectBackup(storage));
  for (const bad of [
    '{',
    JSON.stringify({ ...backup, version: 2 }),
    JSON.stringify({ ...backup, futureEvidence: 'do not discard' }),
    JSON.stringify({ ...backup, projects: [] }),
    JSON.stringify({ ...backup, projects: [project, project] }),
    JSON.stringify({ ...backup, projects: [{ ...project, futureEvidence: 'do not discard' }] }),
    JSON.stringify({ ...backup, projects: [{ ...project, brief: { ...project.brief, futureField: 'do not discard' } }] }),
    JSON.stringify({ ...backup, projects: [{ ...project, completed: ['approved'] }] }),
    ' '.repeat(projectBackupByteLimit + 1)
  ]) assert.throws(() => readProjectBackup(bad));
  assert.throws(() => restoreProjectBackup(storage, [project], () => projectId), /separate project copies/);
  assert.throws(() => restoreProjectBackup(memoryStorage(), [project], () => projectId), /separate project copies/);
  assert.equal(listProjects(storage).length, 1);

  const other = newPilotProject('11111111-1111-4111-8111-000000000002', 'ai-cad-services', 'Second');
  for (let index = 3; index <= 10; index++) {
    const id = `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`;
    saveProject(storage, newPilotProject(id, 'ai-education-services', `Project ${index}`), 0);
  }
  assert.throws(() => restoreProjectBackup(storage, [project, other], () => '33333333-3333-4333-8333-333333333333'), /Not enough/);
  assert.equal(listProjects(storage).length, 9);
});

test('project backup refuses to omit unsupported saved evidence', async () => {
  const { newPilotProject, saveProject, projectStoragePrefix } = await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildProjectBackup } = await loadContent('../lib/project-backup.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const storage = memoryStorage();
  saveProject(storage, newPilotProject(projectId, 'ai-content-services', 'Saved project'), 0);
  const key = projectStoragePrefix + projectId;
  const saved = JSON.parse(storage.getItem(key));
  for (const modified of [
    { ...saved, futureMetadata: 'do not discard' },
    { ...saved, project: { ...saved.project, futureEvidence: 'do not discard' } },
    { ...saved, project: { ...saved.project, brief: { ...saved.project.brief, futureField: 'do not discard' } } }
  ]) {
    const original = JSON.stringify(modified);
    storage.setItem(key, original);
    assert.throws(() => buildProjectBackup(storage), /unsupported or incompatible data/);
    assert.equal(storage.getItem(key), original, 'the saved project is never changed');
  }
});

test('a complete ten-project backup round-trips every service track and optional saved section', async () => {
  const { newPilotProject, saveProject, listProjects, servicePathIds, commerceProjectTrack } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { buildProjectBackup, readProjectBackup, restoreProjectBackup } = await loadContent('../lib/project-backup.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const { emptyCaseStudy } = await loadContent('../lib/case-study.ts', projectImports);
  const { emptyDiscovery } = await loadContent('../lib/client-discovery.ts', projectImports);
  const { emptyCommerceReadiness } = await loadContent('../lib/commerce-readiness.ts', projectImports);
  const { emptyCommercePilotPlan } = await loadContent('../lib/commerce-pilot-plan.ts', projectImports);
  const { emptyCommercePilotReview } = await loadContent('../lib/commerce-pilot-review.ts', projectImports);
  const { appendWorkbookRevision } = await loadContent('../lib/evidence-workbook.ts');
  const { emptyReviewChecks, saveTextReview } = await loadContent('../lib/project-review.ts', projectImports);
  const source = memoryStorage();
  for (const [index, path] of servicePathIds.entries()) {
    const id = `11111111-1111-4111-8111-${String(index + 1).padStart(12, '0')}`;
    const project = newPilotProject(id, path, `Fictional practice ${index + 1}`);
    project.caseStudy = emptyCaseStudy();
    project.discovery = emptyDiscovery();
    project.workbook = appendWorkbookRevision({ version: 1, items: [] }, null, 'Draft', 'Private text', '2026-01-01T10:00:00.000Z');
    project.reviewCentre = saveTextReview(project, 'item-1', project.workbook.items[0].revisions[0], emptyReviewChecks(path), '2026-01-01T10:00:00.000Z');
    if (commerceProjectTrack(path)) {
      project.commerceReadiness = emptyCommerceReadiness(path);
      project.commercePilotPlan = emptyCommercePilotPlan(path);
      project.commercePilotReview = emptyCommercePilotReview(project.commercePilotPlan);
    }
    saveProject(source, project, 0);
  }
  const savedProjects = listProjects(source).map(({ project }) => project);
  const backup = readProjectBackup(buildProjectBackup(source));
  assert.deepEqual(backup, savedProjects);
  const destination = memoryStorage();
  let next = 0;
  const ids = restoreProjectBackup(destination, backup, () =>
    `22222222-2222-4222-8222-${String(++next).padStart(12, '0')}`);
  assert.equal(ids.length, 10);
  const copies = listProjects(destination);
  for (const [index, project] of backup.entries()) {
    assert.deepEqual(copies.find((entry) => entry.project.id === ids[index]).project, { ...project, id: ids[index] });
  }
});

test('a failed multi-project restore removes its new copies without touching existing projects', async () => {
  const { newPilotProject, saveProject, loadProject, listProjects, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { restoreProjectBackup } = await loadContent('../lib/project-backup.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const storage = memoryStorage();
  const existing = newPilotProject(projectId, 'ai-content-services', 'Existing project');
  const saved = saveProject(storage, existing, 0);
  const other = newPilotProject('11111111-1111-4111-8111-000000000002', 'ai-cad-services', 'Other project');
  const firstCopy = '33333333-3333-4333-8333-333333333333';
  const secondCopy = '44444444-4444-4444-8444-444444444444';
  const originalSet = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === projectStoragePrefix + secondCopy) throw new Error('Storage quota reached');
    originalSet(key, value);
  };
  const ids = [firstCopy, secondCopy];
  assert.throws(() => restoreProjectBackup(storage, [existing, other], () => ids.shift()), /No new copies were kept/);
  assert.deepEqual(loadProject(storage, projectId), saved);
  assert.equal(listProjects(storage).length, 1);
  assert.equal(storage.getItem(projectStoragePrefix + firstCopy), null);
});

test('a restore reports when storage failure prevents cleanup of a new copy', async () => {
  const { newPilotProject, saveProject, loadProject, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { restoreProjectBackup } = await loadContent('../lib/project-backup.ts', {
    ...projectImports, '@/lib/pilot-projects': '../lib/pilot-projects.ts'
  });
  const storage = memoryStorage();
  const existing = newPilotProject(projectId, 'ai-content-services', 'Existing project');
  const saved = saveProject(storage, existing, 0);
  const other = newPilotProject('11111111-1111-4111-8111-000000000002', 'ai-cad-services', 'Other project');
  const firstCopy = '33333333-3333-4333-8333-333333333333';
  const secondCopy = '44444444-4444-4444-8444-444444444444';
  const originalSet = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === projectStoragePrefix + secondCopy) throw new Error('Storage quota reached');
    originalSet(key, value);
  };
  storage.removeItem = () => { throw new Error('Storage unavailable'); };
  const ids = [firstCopy, secondCopy];
  assert.throws(() => restoreProjectBackup(storage, [existing, other], () => ids.shift()), /some new copies could not be removed/);
  assert.deepEqual(loadProject(storage, projectId), saved);
  assert.ok(storage.getItem(projectStoragePrefix + firstCopy), 'partial copy remains visible for manual review');
});

test('project tool saves merge only their own field and block stale replacement or resurrection', async () => {
  const { newPilotProject, loadProject, saveProject, saveProjectPart, deleteProject, projectProposalSeed, projectResultsSeed } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const storage = memoryStorage();
  const project = newPilotProject(projectId, 'micro-saas-validation', 'Formatter');
  saveProject(storage, project, 0);
  const proposal = projectProposalSeed(project);
  saveProjectPart(storage, projectId, 'proposal', proposal, 'null');
  const withResults = saveProjectPart(storage, projectId, 'results', projectResultsSeed(project), 'null');
  assert.deepEqual(withResults.project.proposal, proposal);
  assert.throws(() => saveProjectPart(storage, projectId, 'proposal', proposal, 'null'), /draft changed/);
  const newer = saveProject(storage, { ...withResults.project, brief: { ...project.brief, scope: 'New scope' } }, withResults.revision);
  const updated = saveProjectPart(storage, projectId, 'proposal', { ...proposal, document: 'Manual edits' }, JSON.stringify(proposal));
  assert.equal(updated.project.brief.scope, 'New scope');
  assert.equal(updated.revision, newer.revision + 1);
  deleteProject(storage, projectId, updated.revision);
  assert.throws(() => saveProjectPart(storage, projectId, 'proposal', proposal, JSON.stringify(proposal)), /not found/);
  assert.throws(() => saveProject(storage, loadProject(storage, projectId).project, 1));
});

test('project seeds copy only context; summaries omit internal costs and respect decisions and missing evidence', async () => {
  const { newPilotProject, projectProposalSeed, projectResultsSeed, projectNextAction, projectProposalReady, buildProjectSummary } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const { proposalSource } = await loadContent('../lib/pilot-proposal.ts');
  const project = newPilotProject(projectId, 'ai-cad-services', 'Concept practice');
  assert.match(projectNextAction(project), /brief/);
  project.brief = { objective: 'Fictional concept', scope: 'Not for manufacture', review: 'Review pending' };
  project.proposal = projectProposalSeed(project);
  assert.equal(project.proposal.inputs.setupFee, '');
  assert.equal(project.proposal.document, '');
  project.results = projectResultsSeed(project);
  assert.equal(project.results.tests[0].status, 'pending');
  assert.equal(project.results.decision, '');
  assert.match(projectNextAction(project), /proposal/);
  project.proposal.inputs.setupRate = '12345.67';
  project.proposal.document = 'INTERNAL_COST_CANARY';
  project.proposal.source = proposalSource(project.proposal.inputs, 'en');
  assert.equal(projectProposalReady(project), true);
  assert.match(projectNextAction(project), /results tracker/);
  project.results.decision = 'continue';
  Object.assign(project.results.notes, { rationale: 'Recorded reason', nextSteps: 'Review again', uncertainty: 'Not approved' });
  assert.match(projectNextAction(project), /unresolved tests/);
  project.results.decision = 'stop';
  assert.match(projectNextAction(project), /Stop recorded/);
  project.results.decision = 'revise';
  assert.match(projectNextAction(project), /Revision recorded/);
  const report = buildProjectSummary(project, (text) => text);
  assert.doesNotMatch(report, /12345.67|INTERNAL_COST_CANARY/);
  assert.match(report, /NOT CLIENT APPROVAL/);
  assert.match(report, /Recorded reason/);
  project.proposal.inputs.scope = 'Changed form';
  assert.equal(projectProposalReady(project), false);
  project.proposal.source = '{';
  assert.equal(projectProposalReady(project), false);
});

test('project saving reports unavailable storage and validates account metadata', async () => {
  const { newPilotProject, saveProject, loadProject, projectStoragePrefix } =
    await loadContent('../lib/pilot-projects.ts', projectImports);
  const project = newPilotProject(projectId, 'ai-automation-services', 'Queue practice');
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error('Storage full'); };
  assert.throws(() => saveProject(storage, project, 0), /Storage full/);
  const good = memoryStorage();
  const saved = saveProject(good, project, 0, { userId: projectId, version: 2 });
  assert.deepEqual(loadProject(good, projectId).cloud, { userId: projectId, version: 2 });
  good.setItem(projectStoragePrefix + projectId, JSON.stringify({ ...saved, cloud: { userId: projectId, version: -1 } }));
  assert.throws(() => loadProject(good, projectId));
});

test('workspace interface, project checklist, next actions and errors have three translations', async () => {
  const files = [
    '../components/pilot-project-workspace.tsx', '../components/pilot-project-tool.tsx',
    '../components/pilot-project-account.tsx', '../lib/pilot-projects.ts',
    '../app/business-launchpad/projects/page.tsx'
  ];
  const strings = new Set([
    'Open the Pilot Project Workspace', 'Working...', 'Saved draft; review before sharing.',
    'Missing or needs regeneration.', 'Load the project draft before editing.',
    'Project draft saved on this device only. Account copies are unchanged.',
    'Saved project draft removed from this device. Current work, account copies and downloads remain.',
    'Brief copied into the form. Review it and save explicitly; no outcomes or approvals were filled in.',
    'Project draft loaded.'
  ]);
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    for (const match of source.matchAll(/(?:tr\(|new Error\(|label: |return |setNotice\()'([^']+)'|<Tr>([^<{]+)<\/Tr>/g)) {
      strings.add(match[1] ?? match[2]);
    }
  }
  assert.ok(strings.size >= 100);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of strings) assert.ok(book[text], `${locale}: missing project phrase "${text}"`);
  }
});

test('four service curricula each provide six complete and independently keyed lessons', async () => {
  const curricula = await loadContent('../lib/business-services-tutorials.ts');
  const allIds = new Set();
  for (const steps of Object.values(curricula)) {
    assert.equal(steps.length, 6);
    for (const step of steps) {
      assert.match(step.id, /^[a-z]+(?:-[a-z]+)+$/);
      assert.ok(!allIds.has(step.id));
      allIds.add(step.id);
      assert.ok(step.title && step.file && step.code && step.check && step.aiPrompt);
      assert.equal(step.explanation.length, 2);
      assert.ok(step.explanation.every((text) => text.length > 100));
    }
  }
  assert.equal(allIds.size, 24);
});

test('service worksheets retain independently verified scope, arithmetic and approval boundaries', async () => {
  const { contentServicesSteps, cadServicesSteps, microSaasSteps, educationServicesSteps } =
    await loadContent('../lib/business-services-tutorials.ts');
  const copy = (steps) => JSON.stringify(steps);
  assert.match(contentServicesSteps[0].code, /3 posts \(40-60 words each\), 4 FAQ answers/);
  assert.match(contentServicesSteps[2].code, /Open Sunday.*REMOVE/);
  assert.match(contentServicesSteps[2].code, /Delivery available.*REMOVE/);
  assert.match(contentServicesSteps[4].code, new RegExp(`EUR ${(1 + 2 + 1 + 1) * 20}`));
  assert.match(contentServicesSteps[5].code, /BLOCKED, not PASS/);
  assert.match(cadServicesSteps[1].code, new RegExp(`${80 * 40 * 3} mm\\^3`));
  assert.match(cadServicesSteps[1].code, /Front: 80 x 40 mm[\s\S]*Side: 3 x 40 mm[\s\S]*Top: 80 x 3 mm/);
  assert.match(cadServicesSteps[1].code, /front drawn 40 x 20 mm/);
  assert.match(cadServicesSteps[3].code, new RegExp(`${90 * 40 * 3} mm\\^3`));
  assert.match(cadServicesSteps[3].code, new RegExp(`${90 / 40}:1`));
  assert.match(copy(cadServicesSteps), /CONCEPT ONLY - NOT FOR MANUFACTURE/);
  assert.match(copy(cadServicesSteps), /personal-use CAD license may exclude paid client projects/);
  assert.match(microSaasSteps[2].code, /output\.textContent/);
  assert.doesNotMatch(microSaasSteps[2].code, /fetch\(|localStorage|innerHTML|https?:\/\//);
  assert.match(microSaasSteps[3].code, /41 characters.*visible error/);
  assert.match(educationServicesSteps[1].code, /3 min[\s\S]*5 min[\s\S]*4 min[\s\S]*3 min/);
  assert.equal(3 + 5 + 4 + 3, 15);
  assert.match(educationServicesSteps[2].code, /30/);
  assert.match(copy(educationServicesSteps), /0-4|0–4/);
  assert.match(copy(educationServicesSteps), /NOT RUN|not run/);
});

test('service intents select their distinct recommendations in four languages', async () => {
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const [goal, ideas] of [
    ['offer-content-services', ['content agency', 'agence de contenu', 'content-agentur', 'agencia de contenido']],
    ['create-business-videos', ['AI video editing', 'vidéo entreprise', 'ki-video', 'video empresarial']],
    ['offer-cad-services', ['cad service', 'service cao', 'cad-dienstleistung', 'servicio cad']],
    ['validate-micro-saas', ['validate micro-saas', 'valider saas', 'saas validieren', 'validar saas']],
    ['offer-education-services', ['adult workshop', 'atelier pour adultes', 'ki-schulung', 'taller para adultos']]
  ]) {
    for (const idea of ideas) assert.equal(matchGoals(idea)[0]?.goalId, goal, idea);
  }
  assert.equal(matchGoals('automation agency')[0]?.goalId, 'start-ai-business');
});

test('business video lessons and evidence plans keep measurable exports, honest alternatives and publication boundaries', async () => {
  const { videoBusinessSteps } = await loadContent('../lib/video-business-tutorial.ts');
  const { workbookStarters } = await loadContent('../lib/evidence-workbook.ts');
  const { serviceJourneys, serviceJourneyTests } = await loadContent('../lib/service-project-journeys.ts', journeyImports);
  const { checksForService } = await loadContent('../lib/project-review.ts', projectImports);
  assert.equal(videoBusinessSteps.length, 6);
  assert.equal(new Set(videoBusinessSteps.map((step) => step.id)).size, 6);
  for (const step of videoBusinessSteps) {
    assert.ok(step.id.startsWith('video-business-'));
    assert.ok(step.title && step.file && step.code && step.check && step.aiPrompt);
    assert.equal(step.explanation.length, 2);
  }
  const copy = JSON.stringify(videoBusinessSteps);
  assert.match(copy, /15-30 seconds inclusive/);
  assert.match(copy, /1080 x 1920/);
  assert.match(copy, /storyboard alone is not a finished video/i);
  assert.match(copy, /EUR 100/);
  assert.match(copy, /not a market rate/i);
  assert.match(copy, /caption[s]? word by word/);
  assert.match(copy, /owner approval stays blocked/);
  const plans = serviceJourneyTests('ai-video-business', (text) => text);
  assert.deepEqual(plans.map((test) => test.name.match(/\[(.*?)\]/)[1]),
    Array.from({ length: 7 }, (_, index) => `VIDEO-${index + 1}`));
  assert.match(plans[1].expected, /15-30 seconds inclusive and 1080 x 1920/);
  assert.match(plans[1].expected, /cannot establish an export pass/);
  assert.match(plans[6].expected, /blocked, never assumed passed/);
  assert.deepEqual(serviceJourneys['ai-video-business'].proposalFields, ['dataHandling', 'timeline']);
  assert.equal(checksForService('ai-video-business').length, 7);
  assert.match(workbookStarters['ai-video-business'].text, /Storyboards are not finished videos/);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const text of Object.values(workbookStarters['ai-video-business'])) assert.ok(book[text], `${locale}: missing video starter`);
    for (const { label, instruction } of checksForService('ai-video-business')) {
      assert.ok(book[label] && book[instruction], `${locale}: missing video review ${label}`);
    }
  }
});

test('all three practical tutorials have complete translations without changing progress IDs', async () => {
  const { smallBusinessSteps, videoCreationSteps, careerSkillsSteps } = await loadContent('../lib/practical-ai-tutorials.ts');
  const tutorials = {
    'ai-small-business': smallBusinessSteps,
    'ai-video-creation': videoCreationSteps,
    'ai-career-skills': careerSkillsSteps
  };
  for (const language of ['fr', 'de', 'es']) {
    const loaded = await loadContent(`../lib/translations/practical-${language}.ts`);
    const translations = Object.values(loaded)[0];
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(tutorials).sort());
    for (const [id, steps] of Object.entries(tutorials)) {
      const translation = translations[id];
      assert.ok(translation.title && translation.intro);
      assert.deepEqual(Object.keys(translation.steps).sort(), steps.map((step) => step.id).sort());
      for (const step of steps) {
        const text = translation.steps[step.id];
        assert.ok(text.title && text.check && text.aiPrompt);
        assert.ok(text.explanation.length >= 1);
        assert.ok(text.explanation.every((paragraph) => paragraph.length > 0));
        if (step.code) assert.ok(text.code, `${language}/${id}/${step.id}: worksheet untranslated`);
      }
    }
  }
});

test('study board data validation rejects malformed responses instead of showing an empty board', async () => {
  const { studyRows, isStudyPost, isStudyRequest } = await loadContent('../lib/study-board-data.ts');
  const post = {
    id: 'post', goal_id: 'learn-ai', display_name: 'Learner', note: '', created_at: '2026-11-05',
    mine: false, my_request_status: null, joined_workspace_id: null
  };
  assert.deepEqual(studyRows([post], isStudyPost), [post]);
  assert.deepEqual(studyRows([], isStudyPost), []);
  for (const data of [null, {}, [{ ...post, mine: 'true' }], [{ ...post, my_request_status: 'invalid' }]]) {
    assert.throws(() => studyRows(data, isStudyPost), /Invalid study board response/);
  }
  const request = { id: 'request', post_id: 'post', goal_id: 'learn-ai', display_name: 'Learner', message: '' };
  assert.deepEqual(studyRows([request], isStudyRequest), [request]);
  assert.throws(() => studyRows([{ ...request, message: null }], isStudyRequest), /Invalid study board response/);
});

test('feedback response parsing preserves false votes and rejects malformed data', async () => {
  const { readLessonVote } = await loadContent('../lib/lesson-feedback.ts');
  assert.equal(readLessonVote(null), null);
  assert.equal(readLessonVote({ helpful: true }), true);
  assert.equal(readLessonVote({ helpful: false }), false);
  for (const invalid of [{}, [], { helpful: 'false' }, undefined]) {
    assert.throws(() => readLessonVote(invalid), /Invalid lesson feedback response/);
  }
});

test('review metadata only attaches to the exact reviewed description and URL', async () => {
  const { withToolReviews } = await loadContent('../lib/tool-review.ts');
  const tool = { id: 'tool', name: 'Tool', description: 'Reviewed', url: 'https://example.com' };
  const reviews = {
    tool: { reviewedOn: '2026-11-05', sourceUrl: 'https://example.com/help', toolUrl: tool.url, description: tool.description }
  };
  assert.equal(withToolReviews([tool], reviews)[0].review.reviewedOn, '2026-11-05');
  assert.equal(withToolReviews([{ ...tool, description: 'Changed' }], reviews)[0].review, undefined);
  assert.equal(withToolReviews([{ ...tool, url: 'https://different.example' }], reviews)[0].review, undefined);
  assert.equal(withToolReviews([{ ...tool, id: 'other' }], reviews)[0].review, undefined);
});

test('website challenge has seven ordered tasks with independent progress and a final review', async () => {
  const { websiteChallengeId, websiteChallengeSteps } = await loadContent('../lib/website-challenge.ts', {
    '@/lib/ai-website-tutorial': '../lib/ai-website-tutorial.ts'
  });
  assert.equal(websiteChallengeId, 'first-website-challenge');
  assert.equal(websiteChallengeSteps.length, 7);
  assert.equal(new Set(websiteChallengeSteps.map((step) => step.id)).size, 7);
  for (const [index, step] of websiteChallengeSteps.entries()) {
    assert.ok(step.title.startsWith(`Day ${index + 1}:`));
    assert.ok(step.check && step.aiPrompt && step.code && step.explanation.length);
  }
  assert.equal(websiteChallengeSteps[6].id, 'final-project-review');
  assert.ok(websiteChallengeSteps[4].explanation.join(' ').includes('commercial'));
});

test('automation services lessons keep six stable tasks, reproducible demo checks and honest costs', async () => {
  const { automationServicesSteps: steps } = await loadContent('../lib/automation-services-tutorial.ts');
  assert.deepEqual(steps.map((step) => step.id), [
    'validate-one-problem', 'define-safe-pilot', 'build-test-demo',
    'calculate-pilot-cost', 'prepare-honest-offer', 'handover-review-pilot'
  ]);
  for (const step of steps) {
    assert.ok(step.title && step.file && step.code && step.check && step.aiPrompt);
    assert.ok(step.explanation.length >= 2 && step.explanation.every(Boolean));
  }
  const cases = steps[2].code.split('\n').filter((line) => /^E\d \|/.test(line));
  assert.equal(cases.length, 6);
  for (const [status, count] of [['QUEUED', 2], ['DUPLICATE', 1], ['INVALID', 1], ['REVIEW', 2]]) {
    assert.equal(cases.filter((line) => line.split(' | ')[2].startsWith(status)).length, count);
  }
  assert.ok(steps[2].code.includes('External messages sent: 0'));
  assert.ok(steps[2].explanation.join(' ').includes('Only mark an ID successful after its queue write succeeds'));
  assert.ok(steps[3].code.includes('Setup planning subtotal: 324'));
  assert.ok(steps[3].code.includes('Monthly planning subtotal: 45'));
  assert.ok(steps[3].code.includes('NOT VALIDATED'));
  assert.ok(steps[5].code.includes('continue / revise / stop'));
});

test('business launch intent matches the new goal in all four languages', async () => {
  const { matchGoals } = await loadContent('../lib/idea-planner.ts');
  for (const idea of [
    'I want to start an automation agency',
    'Je veux lancer une agence automatisation',
    'Ich starte eine Automatisierungsagentur',
    'Quiero crear una agencia de automatización'
  ]) {
    assert.equal(matchGoals(idea)[0]?.goalId, 'start-ai-business', idea);
  }
});

test('proposal costs distinguish unknown from zero and keep costs separate from prices', async () => {
  const { emptyProposalInputs, proposalCalculations } = await loadContent('../lib/pilot-proposal.ts');
  const blank = emptyProposalInputs();
  assert.deepEqual(proposalCalculations(blank), { setup: null, monthly: null, setupFee: null, monthlyFee: null, errors: [] });
  const inputs = {
    ...blank, setupHours: '9', setupRate: '30', contingency: '20', setupExpenses: '0',
    monthlyHours: '1', monthlyRate: '30', monthlyExpenses: '15', setupFee: '500', monthlyFee: '75'
  };
  assert.deepEqual(proposalCalculations(inputs), { setup: 32400, monthly: 4500, setupFee: 50000, monthlyFee: 7500, errors: [] });
  assert.equal(proposalCalculations({ ...inputs, setupExpenses: '' }).setup, null);
  assert.equal(proposalCalculations({ ...inputs, setupRate: '0' }).setup, 0);
  assert.equal(proposalCalculations({ ...inputs, setupFee: '0' }).setupFee, 0);
  assert.equal(proposalCalculations({ ...inputs, setupHours: '1,25', setupRate: '10.10', contingency: '10', setupExpenses: '0.01' }).setup, 1263 + 126 + 1);
  assert.equal(proposalCalculations({ ...inputs, setupHours: '0.01', setupRate: '0.50', contingency: '50' }).setup, 2);
});

test('proposal numeric validation rejects malformed and excessive values without inventing totals', async () => {
  const { emptyProposalInputs, proposalCalculations, proposalCostFields, buildPilotProposal } = await loadContent('../lib/pilot-proposal.ts');
  for (const field of proposalCostFields) {
    for (const number of ['-1', 'NaN', 'Infinity', '1e3', '1,000', '1.234', '1 000', '.50', '1.', String(field.max + 0.01)]) {
      const inputs = { ...emptyProposalInputs(), [field.key]: number };
      assert.deepEqual(proposalCalculations(inputs).errors, [field.key], `${field.key}: ${number}`);
      assert.throws(() => buildPilotProposal(inputs, 'en', (text) => text), /Invalid proposal number/);
    }
    assert.deepEqual(proposalCalculations({ ...emptyProposalInputs(), [field.key]: String(field.max) }).errors, []);
  }
});

test('proposal generation preserves user text, marks unknowns and never exports internal costs', async () => {
  const { emptyProposalInputs, buildPilotProposal } = await loadContent('../lib/pilot-proposal.ts');
  const inputs = {
    ...emptyProposalInputs(), title: '<script>alert("fictional")</script>',
    scope: 'CUSTOM SCOPE\nSecond line', setupHours: '9', setupRate: '30',
    contingency: '20', setupExpenses: '0', monthlyHours: '1', monthlyRate: '30', monthlyExpenses: '15',
    setupFee: '500', monthlyFee: '75'
  };
  const document = buildPilotProposal(inputs, 'en', (text) => text);
  assert.ok(document.startsWith('DRAFT PILOT PROPOSAL - NOT AN AGREEMENT'));
  assert.ok(document.includes(inputs.title) && document.includes(inputs.scope));
  assert.ok(document.includes('[TO CONFIRM]'));
  assert.ok(document.includes('€500.00') && document.includes('€75.00'));
  assert.ok(!document.includes('324.00') && !document.includes('45.00'));
  const french = JSON.parse(await readFile(new URL('../content/translations/ui-fr.json', import.meta.url), 'utf8'));
  const translated = buildPilotProposal(inputs, 'fr', (text) => french[text] ?? text);
  assert.ok(translated.includes('[À CONFIRMER]'));
  assert.ok(translated.includes(inputs.scope));
  assert.ok(!translated.includes('DRAFT PILOT PROPOSAL'));
});

test('saved proposal validation round-trips editable text and rejects damaged or incompatible drafts', async () => {
  const { emptyProposalInputs, readProposalDraft, proposalSource, proposalTextLimit } = await loadContent('../lib/pilot-proposal.ts');
  const inputs = { ...emptyProposalInputs(), title: 'Fictional pilot', setupFee: '0' };
  const draft = { version: 1, inputs, document: 'Manual edits\nRemain unchanged', source: proposalSource(inputs, 'en') };
  assert.deepEqual(readProposalDraft(JSON.stringify(draft)), draft);
  const longInputs = { ...inputs, scope: '\n'.repeat(proposalTextLimit) };
  const longDraft = { ...draft, inputs: longInputs, source: proposalSource(longInputs, 'en') };
  assert.deepEqual(readProposalDraft(JSON.stringify(longDraft)), longDraft);
  for (const invalid of [
    'broken JSON', 'null', '[]', '{}', JSON.stringify({ ...draft, version: 2 }),
    JSON.stringify({ ...draft, document: 0 }), JSON.stringify({ ...draft, source: null }),
    JSON.stringify({ ...draft, inputs: { ...inputs, setupFee: '-1' } }),
    JSON.stringify({ ...draft, inputs: { title: 'missing fields' } }),
    JSON.stringify({ ...draft, inputs: { ...inputs, title: 'a'.repeat(proposalTextLimit + 1) } }),
    JSON.stringify({ ...draft, document: 'a'.repeat(40001) })
  ]) {
    assert.throws(() => readProposalDraft(invalid));
  }
});

test('proposal builder UI, notices and templates have all three translations', async () => {
  const sources = await Promise.all([
    '../lib/pilot-proposal.ts',
    '../components/pilot-proposal-builder.tsx',
    '../app/business-launchpad/proposal-builder/page.tsx'
  ].map((file) => readFile(new URL(file, import.meta.url), 'utf8')));
  const text = sources.join('\n');
  const phrases = [
    ...text.matchAll(/\btr\('([^']+)'\)/g),
    ...text.matchAll(/\blabel: '([^']+)'/g),
    ...text.matchAll(/\bset(?:Notice|Error)\('([^']+)'\)/g),
    ...text.matchAll(/<Tr>([^<{]+)<\/Tr>/g)
  ].map((match) => match[1]);
  // Both branches of these conditional labels are intentionally translated.
  phrases.push('Rebuild proposal from form', 'Generate editable proposal',
    'Changes are not saved on this device.', 'No automatic saving. Save explicitly if you want to return later.');
  assert.ok(phrases.length > 65);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of phrases) assert.ok(book[phrase], `${locale}: missing "${phrase}"`);
  }
});

test('pilot results metrics retain unknowns, measured zero and negative net time', async () => {
  const { emptyPilotResults, resultMetrics } = await loadContent('../lib/pilot-results.ts');
  const blank = emptyPilotResults().metrics;
  assert.deepEqual(resultMetrics(blank), {
    errors: [], values: { runs: null, baseline: null, processing: null, review: null, cost: null },
    net: null, netPerRun: null, costPerRun: null
  });
  const sample = { runs: '40', baseline: '240', processing: '80', review: '40', cost: '12' };
  assert.deepEqual(resultMetrics(sample), {
    errors: [], values: { runs: 4000, baseline: 24000, processing: 8000, review: 4000, cost: 1200 },
    net: 12000, netPerRun: 3, costPerRun: 30
  });
  assert.equal(resultMetrics({ ...sample, baseline: '100' }).net, -2000);
  assert.equal(resultMetrics({ ...sample, baseline: '100' }).netPerRun, -0.5);
  assert.equal(resultMetrics({ ...sample, review: '' }).net, null);
  assert.equal(resultMetrics({ ...sample, runs: '' }).net, 12000);
  assert.equal(resultMetrics({ ...sample, runs: '' }).netPerRun, null);
  assert.equal(resultMetrics({ ...sample, runs: '' }).costPerRun, null);
  assert.equal(resultMetrics({ ...sample, review: '0' }).net, 16000);
  assert.equal(resultMetrics({ ...sample, cost: '0' }).costPerRun, 0);
  assert.equal(resultMetrics({ ...sample, baseline: '240,25', review: '40.10' }).net, 12015);
});

test('pilot metrics reject zero/fractional runs, malformed numbers and displayed limit violations', async () => {
  const { emptyPilotResults, resultMetrics, resultMetricFields, buildPilotResultsReport } = await loadContent('../lib/pilot-results.ts');
  const blank = emptyPilotResults();
  for (const field of resultMetricFields) {
    const invalid = ['-1', 'Infinity', '1e3', '1,000', '1.000', '1 000', '.2', '1.', String(field.max + 1)];
    if (field.key === 'runs') invalid.push('0', '0.00', '1.5', '1,5', '1.00');
    for (const value of invalid) {
      const data = { ...blank, metrics: { ...blank.metrics, [field.key]: value } };
      assert.deepEqual(resultMetrics(data.metrics).errors, [field.key], `${field.key}: ${value}`);
      assert.throws(() => buildPilotResultsReport(data, 'en', (text) => text), /Invalid pilot metrics/);
    }
    assert.deepEqual(resultMetrics({ ...blank.metrics, [field.key]: String(field.max) }).errors, []);
  }
});

test('test summaries never turn unrun plans or unsupported passes into successful evidence', async () => {
  const { emptyPilotTest, starterPilotTests, resultTestSummary, effectiveTestStatus } = await loadContent('../lib/pilot-results.ts');
  const examples = starterPilotTests((text) => text);
  assert.equal(examples.length, 7);
  assert.equal(new Set(examples.map((test) => test.id)).size, 7);
  assert.ok(examples[6].name.includes('failure'));
  assert.ok(examples.every((test) => test.status === 'pending' && test.retestStatus === 'pending' && !test.actual));
  assert.deepEqual(resultTestSummary(examples), { pending: 7, pass: 0, fail: 0, blocked: 0, total: 7, open: 7 });
  const unsupported = { ...emptyPilotTest('test-1'), status: 'pass' };
  assert.equal(effectiveTestStatus(unsupported), 'pending');
  const failed = { ...examples[0], actual: 'Two rows, failure screenshot recorded', status: 'fail', correction: 'Fix deduplication' };
  assert.equal(effectiveTestStatus(failed), 'fail');
  assert.equal(effectiveTestStatus({ ...failed, retestStatus: 'pass' }), 'pending');
  const retested = { ...failed, retestStatus: 'pass', retest: '2026-11-05: one row, screenshot checked' };
  assert.equal(effectiveTestStatus(retested), 'pass');
  assert.equal(retested.status, 'fail');
  assert.equal(effectiveTestStatus({ ...retested, retestStatus: 'blocked' }), 'blocked');
  assert.equal(effectiveTestStatus({ ...retested, retestStatus: 'fail' }), 'fail');
  assert.deepEqual(resultTestSummary([retested, { ...examples[1], status: 'blocked' }, unsupported]), {
    pending: 1, pass: 1, fail: 0, blocked: 1, total: 3, open: 2
  });
});

test('results reports include original failures, retests, actual costs, unknowns and explicit decisions', async () => {
  const { emptyPilotResults, starterPilotTests, buildPilotResultsReport } = await loadContent('../lib/pilot-results.ts');
  const data = emptyPilotResults();
  data.notes = {
    title: 'FICTIONAL TEST PILOT', objective: 'Manual approval only', period: '40 matched tasks, one week, manually timed',
    uncertainty: 'Small fictional sample, no production evidence', rationale: 'More representative tests needed',
    nextSteps: 'Workshop owner role: review next week'
  };
  data.metrics = { runs: '40', baseline: '240', processing: '80', review: '40', cost: '12' };
  data.tests = [{
    ...starterPilotTests((text) => text)[0], actual: 'Wrong output', status: 'fail',
    correction: 'Fixed the mapping', retestStatus: 'pass', retest: '2026-11-05: verified expected output'
  }];
  for (const decision of ['continue', 'revise', 'stop', '']) {
    data.decision = decision;
    const report = buildPilotResultsReport(data, 'en', (text) => text);
    assert.ok(report.includes('Original outcome: Fail'));
    assert.ok(report.includes('Retest outcome: Pass'));
    assert.ok(report.includes('Fixed the mapping'));
    assert.ok(report.includes('Net time saved (minutes): 120'));
    assert.ok(report.includes('Running cost per run (EUR): €0.30'));
    assert.ok(report.includes(`Recorded decision: ${decision ? decision[0].toUpperCase() + decision.slice(1) : 'Not decided'}`));
    assert.equal(report.includes('Evidence is incomplete or tests remain open.'), decision === '');
  }
  data.decision = 'continue';
  data.tests[0].retest = '';
  assert.ok(buildPilotResultsReport(data, 'en', (text) => text).includes('Evidence is incomplete or tests remain open.'));
  const blankReport = buildPilotResultsReport(emptyPilotResults(), 'en', (text) => text);
  assert.ok(blankReport.includes('[TO CONFIRM]'));
  assert.ok(blankReport.includes('Recorded decision: Not decided'));
});

test('results draft schema rejects damaged, oversized and incompatible drafts without accepting invalid metrics', async () => {
  const { emptyPilotResults, readPilotResults, starterPilotTests } = await loadContent('../lib/pilot-results.ts');
  const data = emptyPilotResults();
  data.tests = starterPilotTests((text) => text);
  assert.deepEqual(readPilotResults(JSON.stringify(data)), data);
  const twenty = { ...data, tests: Array.from({ length: 20 }, (_, i) => ({ ...data.tests[0], id: `test-${i + 1}` })) };
  assert.deepEqual(readPilotResults(JSON.stringify(twenty)), twenty);
  for (const invalid of [
    'broken', '{}', 'null', '[]',
    JSON.stringify({ ...data, version: 2 }), JSON.stringify({ ...data, decision: 'approve' }),
    JSON.stringify({ ...data, notes: { ...data.notes, title: 'a'.repeat(2001) } }),
    JSON.stringify({ ...data, metrics: { ...data.metrics, runs: '0' } }),
    JSON.stringify({ ...data, tests: [] }),
    JSON.stringify({ ...twenty, tests: [...twenty.tests, { ...data.tests[0], id: 'test-21' }] }),
    JSON.stringify({ ...data, tests: [data.tests[0], data.tests[0]] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], id: 'bad-id' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], actual: null }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], status: 'success' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], retestStatus: 'success' }] }),
    JSON.stringify({ ...data, tests: [{ ...data.tests[0], correction: 'a'.repeat(2001) }] })
  ]) assert.throws(() => readPilotResults(invalid));
});

test('tracker UI, report, statuses and workshop plans have French, German and Spanish translations', async () => {
  const { starterPilotTests, resultStatuses, pilotDecisions, resultTestFields, resultNoteFields, resultDecisionFields, resultMetricFields } = await loadContent('../lib/pilot-results.ts');
  const files = ['../lib/pilot-results.ts', '../components/pilot-results-tracker.tsx', '../app/business-launchpad/results-tracker/page.tsx'];
  const source = (await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');
  const phrases = [
    ...source.matchAll(/\btr\('([^']+)'\)/g),
    ...source.matchAll(/\bset(?:Notice|Error)\('([^']+)'\)/g),
    ...source.matchAll(/<Tr>([^<{]+)<\/Tr>/g)
  ].map((match) => match[1].replaceAll('&amp;', '&'));
  phrases.push(...[...resultStatuses, ...pilotDecisions, ...resultTestFields, ...resultNoteFields, ...resultDecisionFields, ...resultMetricFields].map((field) => field.label));
  for (const example of starterPilotTests((text) => text)) phrases.push(example.name, example.input, example.expected);
  for (const locale of ['fr', 'de', 'es']) {
    const book = JSON.parse(await readFile(new URL(`../content/translations/ui-${locale}.json`, import.meta.url), 'utf8'));
    for (const phrase of phrases) assert.ok(book[phrase], `${locale}: missing tracker phrase "${phrase}"`);
    const plans = starterPilotTests((text) => book[text] ?? text);
    assert.notEqual(plans[0].expected, starterPilotTests((text) => text)[0].expected);
    assert.ok(plans.every((plan) => !plan.actual && plan.status === 'pending'));
  }
});
