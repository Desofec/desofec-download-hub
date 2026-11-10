import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { loadWebModules } from './load-web-modules.mjs';

const [downloads] = loadWebModules(['lib/starter-pack-downloads.ts']);
const languages = ['en', 'fr', 'de', 'es'];
const checks = {
  'ai-cad-services-kit': {
    invariants: [
      'CONCEPT ONLY - NOT FOR MANUFACTURE', '80 x 40 mm', '80 x 3', '3 x 40',
      '2:1', '80 x 40 x 3 = 9600 mm^3', '1:2', '40 x 20 mm', '80 x 40 x 3 mm',
      '90 mm', '10800 mm^3', '2.25:1'
    ],
    safeguards: {
      en: [/not a CAD deliverable/i, /Missing approval stays blocked/i, /No invented tolerances/i, /No fabrication/i, /do not certify geometry or safety/i, /change only width to 90 mm/i],
      fr: [/n’est pas un livrable CAO/i, /approbation manquante reste bloquée/i, /n’inventez aucune tolérance/i, /pas de fabrication/i, /ne certifient ni la géométrie ni la sécurité/i, /modifiez uniquement la largeur à 90 mm/i],
      de: [/kein CAD-Liefergegenstand/i, /fehlende Freigabe bleibt blockiert/i, /keine Toleranzen erfinden/i, /keine Fertigung/i, /zertifizieren weder Geometrie noch Sicherheit/i, /nur die Breite auf 90 mm ändern/i],
      es: [/no es un entregable CAD/i, /aprobación ausente permanece bloqueada/i, /no inventes tolerancias/i, /no fabriques/i, /no certifican la geometría ni la seguridad/i, /cambia únicamente el ancho a 90 mm/i]
    }
  },
  'micro-saas-validation-kit': {
    invariants: [
      '1-40', 'Draft', 'Review', 'Project: Atlas\nStatus: Review', '/tutorials/micro-saas-validation',
      'formatter.html', 'textContent', '`<b>Atlas</b>`', 'UNVALIDATED', 'TO CONFIRM'
    ],
    safeguards: {
      en: [/manual exercise cannot prove browser checks passed/i, /Collect no payments or personal records/i, /not production-ready/i, /Do not invent traction, paying users or compliance/i],
      fr: [/exercice manuel ne prouve pas la réussite des tests navigateur/i, /ne collectez aucun paiement ni dossier personnel/i, /pas prêt pour la production/i, /n’invente ni traction, ni utilisateurs payants, ni conformité/i],
      de: [/manuelle Übung beweist keine bestandenen Browserprüfungen/i, /keine Zahlungen oder persönlichen Datensätze erfassen/i, /nicht produktionsreif/i, /Erfinde weder Nachfrageerfolg noch zahlende Nutzer oder Konformität/i],
      es: [/ejercicio manual no demuestra que las pruebas del navegador hayan pasado/i, /no recojas pagos ni registros personales/i, /no está listo para producción/i, /no inventes tracción, usuarios de pago ni cumplimiento/i]
    }
  },
  'ai-education-services-kit': {
    invariants: ['15', '10:00', '30', '12', '60', '0-4', 'NOT RUN'],
    safeguards: {
      en: [/consenting adult/i, /Do not collect names, scores, recordings or personal learning records/i, /not a qualification/i, /Independent review stays pending until someone actually reviews/i],
      fr: [/adultes débutants consentants/i, /ne recueillez ni noms, ni scores, ni enregistrements, ni dossiers personnels/i, /n’est ni une qualification/i, /revue indépendante reste en attente/i],
      de: [/einwilligende erwachsene Anfänger/i, /keine Namen, Punktzahlen, Aufnahmen oder persönlichen Lernaufzeichnungen erfassen/i, /weder eine Qualifikation/i, /unabhängige Prüfung bleibt ausstehend/i],
      es: [/adultos principiantes que consienten/i, /no recojas nombres, puntuaciones, grabaciones ni registros personales/i, /no es una cualificación/i, /revisión independiente sigue pendiente/i]
    }
  }
};
const prototypeTests = {
  en: [/Atlas \+ Review: exact two-line output/i, /Blank name: visible error/i, /40 characters: accepted/i,
    /41 characters.*visible error/i, /literal text, no bold element/i],
  fr: [/Atlas \+ Review : sortie exacte sur deux lignes/i, /Nom vide : erreur visible/i, /40 caractères : acceptés/i,
    /41 caractères forcés.*erreur visible/i, /texte littéral, sans élément en gras/i],
  de: [/Atlas \+ Review: exakt zwei Ausgabezeilen/i, /Leerer Name: sichtbarer Fehler/i, /40 Zeichen: akzeptiert/i,
    /41 Zeichen: sichtbarer Fehler/i, /literaler Text, kein Fettdruck-Element/i],
  es: [/Atlas \+ Review: salida exacta de dos líneas/i, /Nombre vacío: error visible/i, /40 caracteres: aceptados/i,
    /41 caracteres forzados.*error visible/i, /texto literal, sin elemento en negrita/i]
};
const unknownCertificate = {
  en: /certificate for everyone.*unknown/i,
  fr: /certificat pour tout le monde.*inconnu/i,
  de: /Zertifikat für alle.*unbekannt/i,
  es: /certificado para todos.*desconocido/i
};

test('translated service kits preserve complete exercises and safety boundaries', async () => {
  for (const [id, rules] of Object.entries(checks)) {
    const english = await readFile(new URL(`../../downloads/${id}.md`, import.meta.url), 'utf8');
    for (const language of languages) {
      const suffix = language === 'en' ? '' : `-${language}`;
      const file = `${id}${suffix}.md`;
      const text = await readFile(new URL(`../../downloads/${file}`, import.meta.url), 'utf8');
      assert.equal(text, await readFile(new URL(`../public/downloads/${file}`, import.meta.url), 'utf8'),
        `${file}: public and source copies match`);
      assert.ok(text.length > 2000, `${file}: complete worksheet`);
      if (language !== 'en') assert.notEqual(text, english, `${file}: translated`);
      assert.doesNotMatch(text, /\uFFFD|\p{L}\?\p{L}/u, `${file}: intact encoding`);
      const normalized = text.replace(/\r\n/g, '\n');
      assert.equal((normalized.match(/^## [1-6]\./gm) ?? []).length, 6, `${file}: six sections`);
      for (const invariant of rules.invariants) {
        assert.ok(normalized.includes(invariant), `${file}: missing ${invariant}`);
      }
      for (const safeguard of rules.safeguards[language]) {
        assert.match(normalized, safeguard, `${file}: ${safeguard}`);
      }

      const sections = normalized.split(/^## /m).slice(1);
      if (id === 'ai-cad-services-kit') {
        assert.match(sections[3], /v1\s*:[^\n]*80 x 40 x 3 mm[^\n]*9600 mm\^3/i, file);
        assert.match(sections[3], /v2\s*:[^\n]*90 mm[^\n]*10800 mm\^3[^\n]*2\.25:1/i, file);
      } else if (id === 'micro-saas-validation-kit') {
        const testLines = sections[3].split('\n').slice(1).filter((line) => /^[1-5]\./.test(line));
        assert.equal(testLines.length, 5, `${file}: five tests`);
        assert.deepEqual(testLines.map((line) => line.slice(0, 2)), ['1.', '2.', '3.', '4.', '5.'], file);
        for (const [index, expected] of prototypeTests[language].entries()) {
          assert.match(testLines[index], expected, `${file}: test ${index + 1}`);
        }
      } else {
        const durations = [...sections[1].matchAll(/^- (3|5|4) (?:minutes|Minuten|minutos)/gm)].map((match) => match[1]);
        assert.deepEqual(durations, ['3', '5', '4', '3'], `${file}: 15-minute lesson sequence`);
        assert.match(sections[1], /10:00[^\n]*30[^\n]*12/, `${file}: fictional source facts`);
        assert.match(sections[1], /(?:Total|Gesamt)\s*:\s*15 (?:minutes|Minuten|minutos)/i, `${file}: total time`);
        assert.equal((sections[2].match(/^1 (?:point|Punkt|punto)/gim) ?? []).length, 4, `${file}: four-point rubric`);
        assert.match(sections[2], /60[^\n]*30/, `${file}: corrected duration`);
        assert.match(sections[2], unknownCertificate[language], `${file}: certificate remains unknown`);
      }
    }
  }
});

test('new service kits use the selected language without changing other download routes', () => {
  for (const language of languages) {
    const suffix = language === 'en' ? '' : `-${language}`;
    for (const id of Object.keys(checks)) {
      assert.ok(downloads.hasLocalizedStarterPack(id));
      assert.equal(downloads.starterPackDownloadFile(id, `downloads/${id}.md`, language), `downloads/${id}${suffix}.md`);
    }
    assert.equal(
      downloads.starterPackDownloadFile('ai-video-business-kit', 'downloads/ai-video-business-kit.md', language),
      `downloads/ai-video-business-kit${suffix}.md`
    );
    assert.equal(
      downloads.starterPackDownloadFile('freelance-client-discovery-kit', 'downloads/freelance-client-discovery-kit.md', language),
      'downloads/freelance-client-discovery-kit.md'
    );
  }
});
