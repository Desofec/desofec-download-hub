import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const microSaasTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'micro-saas-validation': {
    fr: {
      title: 'Valider une idée de micro-SaaS avant de créer des abonnements',
      intro: 'Recueillez des preuves sur un problème, testez un formateur local de mises à jour de projet et décidez quoi examiner ensuite. Environ 90 minutes, plus les entretiens. Pas d’IA payante, de facturation ni de lancement en production.',
      steps: {
        'saas-problem-evidence': {
          title: 'Valider un problème récurrent et précis',
          explanation: [
            'Un micro-SaaS est un petit logiciel par abonnement ; ce parcours valide une idée avant tout service réel. L’idée d’exercice met en forme une courte mise à jour à partir d’un nom de projet et d’un statut. Elle n’analyse pas une entreprise et ne génère pas de conseil technique.',
            'Demandez à des adultes consentants comment ils préparent leurs mises à jour, à quelle fréquence et ce qui les gêne. Consignez preuves réelles et incertitudes. Sans entretien, marquez la demande UNVALIDATED. N’achetez pas d’hébergement, ne collectez pas de paiements et ne promettez pas de revenu récurrent sur la base de cet exercice.'
          ],
          file: 'Preuves du problème',
          code: 'Idée : formateur simple de mises à jour de projet\nUtilisateur cible et tâche récurrente :\nMéthode actuelle, fréquence et difficulté :\nSource/date de preuve (anonymisée) :\nHypothèses encore non validées :\nProchaine question neutre d’entretien :\nAucun entretien : demande UNVALIDATED',
          check: 'Votre brief distingue besoin observé et suppositions et ne prétend pas avoir des utilisateurs payants.',
          aiPrompt: 'Rédige cinq questions neutres de découverte pour ce problème précis. N’invente ni réponses d’entretien, ni abonnés, ni taille du marché : [brief].'
        },
        'saas-scope': {
          title: 'Définir d’abord un service manuel testable',
          explanation: [
            'Définissez deux champs : Project (1 à 40 caractères) et Status (Draft ou Review). La sortie est exactement Project: [name] sur la première ligne et Status: [choice] sur la deuxième. Un nom vide ou trop long est rejeté. Aucune IA n’est nécessaire pour mettre ces faits en forme.',
            'Testez le service manuellement dans un document avant de coder. Excluez connexion, paiements, téléversements clients, génération IA, stockage et intégrations. Si de vrais utilisateurs souhaitent un autre comportement, consignez-le comme nouvelle hypothèse au lieu d’élargir silencieusement le prototype.'
          ],
          file: 'Spécification du formateur',
          code: 'Entrée : nom de projet (supprimé des espaces, 1-40 caractères) ; statut Draft ou Review\nExemple de sortie :\nProject: Atlas\nStatus: Review\n\nRejet : nom vide ; plus de 40 caractères\nExclus : connexion, paiements, API IA, stockage, appels réseau\nObjectif : tester l’utilité de la sortie, pas lancer un abonnement',
          check: 'Votre prototype manuel produit exactement les deux lignes Atlas et applique clairement les règles de rejet.',
          aiPrompt: 'Examine cette spécification pour repérer les ambiguïtés et fonctions inutiles. Explique pourquoi un formatage déterministe n’a pas besoin d’une API IA : [spécification].'
        },
        'saas-local-prototype': {
          title: 'Construire un prototype jouet, uniquement local',
          explanation: [
            'Copiez tout le code HTML ci-dessous dans un fichier texte nommé formatter.html et ouvrez-le dans un navigateur. Utilisez uniquement des noms fictifs. Il n’effectue aucun appel réseau, aucune connexion et ne sauvegarde aucune donnée. La version manuelle reste possible si vous ne souhaitez pas modifier du HTML, mais indiquez que la version code n’a pas été testée.',
            'Modifiez Project et Status, puis cliquez sur Format update. La sortie utilise textContent, pas une insertion HTML ; le balisage saisi s’affiche comme texte. L’aide IA est facultative ; ne connectez aucune API et ne déployez aucun produit par abonnement dans cet exercice.'
          ],
          file: 'formatter.html',
          code: '<!doctype html>\n<html lang="fr">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Formateur fictif de mises à jour</title>\n<main>\n<h1>Formateur fictif de mises à jour</h1>\n<p>Exercice local uniquement. Aucun stockage ni appel réseau.</p>\n<form id="update-form" novalidate>\n<label for="project">Projet (1-40 caractères)</label>\n<input id="project" maxlength="40">\n<label for="status">Statut</label>\n<select id="status"><option value="Draft">Brouillon</option><option value="Review">À vérifier</option></select>\n<button>Formater la mise à jour</button>\n</form>\n<pre id="output" role="status"></pre>\n</main>\n<script>\nconst form = document.getElementById("update-form");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.getElementById("project").value.trim();\n  const status = document.getElementById("status").value;\n  const output = document.getElementById("output");\n  if (!name || name.length > 40 || !["Draft", "Review"].includes(status)) {\n    output.textContent = "Saisissez un nom de projet (1-40 caractères) et un statut valide.";\n    return;\n  }\n  output.textContent = `Project: ${name}\\nStatus: ${status}`;\n});\n</script>\n</html>',
          check: 'Le fichier s’ouvre localement et formate Atlas / Review en deux lignes sans envoyer ni stocker de données.',
          aiPrompt: 'Explique ce petit HTML section par section. Préserve textContent et les validations ; n’ajoute ni dépendance, appel réseau ni stockage : [code].'
        },
        'saas-test-costs': {
          title: 'Tester les limites et consigner honnêtement les coûts',
          explanation: [
            'Consignez cinq cas dans le suivi des résultats : Atlas/Review, nom vide, nom de 40 caractères, nom de 41 caractères forcé via les outils développeur du navigateur, et balisage saisi comme nom. Le dernier doit rester du texte littéral, pas devenir un élément. Notez les résultats réellement observés ; une version manuelle seule ne prouve pas les contrôles du navigateur.',
            'Ce jouet local n’a ni facture d’hébergement ni d’API, mais votre temps reste un coût. Pour un futur service, laissez hébergement, usage API, surveillance, support, paiements, taxes et frais généraux inconnus tant qu’ils ne sont pas vérifiés. Un abonnement n’est pas un bénéfice ; ne projetez pas de revenus à vie à partir d’un mini-test.'
          ],
          file: 'Contrôles du prototype',
          code: 'Atlas + Review -> Project: Atlas\\nStatus: Review\nNom vide -> erreur visible\n40 caractères -> accepté\n41 caractères forcés dans le champ -> erreur visible\n<b>Atlas</b> -> texte littéral, aucun élément gras\n\nRésultats/preuves réels :\nMéthode du prototype : navigateur / manuel\nFuturs coûts d’exploitation et de support : TO CONFIRM',
          check: 'Vous avez cinq cas documentés avec preuves, ou marquez explicitement non testés les cas navigateur, et listez les coûts futurs non vérifiés.',
          aiPrompt: 'Examine ces résultats de test et hypothèses de coûts. Signale les preuves manquantes ; n’invente aucun succès, tarif ou revenu futur : [registre].'
        },
        'saas-user-validation': {
          title: 'Observer l’usage et tester l’envie d’essayer',
          explanation: [
            'Invitez une personne consentante à essayer une mise à jour fictive et demandez ce qu’elle attendait, ce qui l’a déroutée et si cela résout un problème récurrent. Ne commencez pas par un prix et ne prétendez pas faire gagner du temps sans mesure. Un compliment n’est pas un engagement payant.',
            'N’utilisez le générateur de propositions que pour un pilote de découverte/prototype clairement délimité, pas une offre d’abonnement prête à acheter. Si un intérêt de paiement apparaît, consignez exactement l’accord sans collecter d’argent. Facturation réelle, confidentialité, contrôle d’accès, remboursements et maintenance exigent une conception et une revue distinctes.'
          ],
          file: 'Entretien de validation',
          code: 'Tâche tentée :\nComportement observé et confusion :\nAlternative actuelle :\nRéessaierait ? Réponse réelle :\nPreuve d’un besoin récurrent :\nVolonté de payer : UNVALIDATED sans preuve directe\nAucun abonnement, paiement ni donnée personnelle collectés.',
          check: 'Vous distinguez usage observé, intérêt exprimé et engagement réel sans inventer de clients payants.',
          aiPrompt: 'Résume uniquement ces observations anonymisées. Sépare comportements, opinions, suppositions et intérêt de paiement non validé : [notes].'
        },
        'saas-decision': {
          title: 'Décider avant de créer un micro-SaaS réel',
          explanation: [
            'Examinez les preuves du problème, cinq tests du prototype, retours, temps passé et coûts inconnus. Choisissez poursuivre la découverte, réviser l’idée ou arrêter. Continuer ne signifie pas que le produit est sécurisé, conforme ou prêt pour la production.',
            'Avant tout lancement réel, créez un plan distinct pour authentification, autorisations, conservation/suppression des données, facturation, support, revue de sécurité et reprise après incident. Le parcours de développement web avancé peut aider à pratiquer l’ingénierie ; il ne remplace pas l’examen professionnel requis.'
          ],
          file: 'Décision de validation',
          code: 'Preuves du problème :\nLacunes des tests du prototype :\nUtilité observée et incertitudes :\nCoûts et support inconnus :\nDécision : poursuivre la découverte / réviser / arrêter\nProchaine preuve requise, responsable et date de revue :\nFonctions de production délibérément NOT BUILT :',
          check: 'Votre décision repose sur des preuves et précise les écarts entre un jouet local et un vrai service par abonnement.',
          aiPrompt: 'Vérifie ma décision de validation pour repérer les affirmations non étayées sur demande et préparation. Liste les vérifications requises avant un produit réel, sans inventer de traction : [décision].'
        }
      }
    },
    de: {
      title: 'Micro-SaaS-Idee vor dem Aufbau von Abonnements validieren',
      intro: 'Sammle Belege für ein Problem, teste einen lokalen Projektstatus-Formatierer und entscheide, was als Nächstes untersucht wird. Etwa 90 Minuten plus Interviews. Keine kostenpflichtige KI, Abrechnung oder Produktionsfreigabe.',
      steps: {
        'saas-problem-evidence': {
          title: 'Ein eng umrissenes wiederkehrendes Problem validieren',
          explanation: [
            'Ein Micro-SaaS ist ein kleiner Abonnement-Softwaredienst; dieser Pfad prüft eine Idee vor einem Live-Service. Die Übung formatiert eine kurze Projektaktualisierung aus Projektname und Status. Sie analysiert kein Unternehmen und erstellt keine technische Beratung.',
            'Frage einwilligende Erwachsene, wie oft und wie sie Aktualisierungen erstellen und was daran frustriert. Tatsächliche Belege und Unsicherheit festhalten. Ohne Interview Nachfrage als UNVALIDATED kennzeichnen. Kein Hosting kaufen, keine Zahlungen einziehen und auf Grundlage der Übung keine wiederkehrenden Einnahmen versprechen.'
          ],
          file: 'Problembelege',
          code: 'Idee: einfacher Formatierer für Projektupdates\nZielnutzer und wiederkehrende Aufgabe:\nAktuelle Methode, Häufigkeit und Schwierigkeit:\nBelegquelle/-datum (anonymisiert):\nNoch unvalidierte Annahmen:\nNächste neutrale Interviewfrage:\nNoch kein Interview: Nachfrage UNVALIDATED',
          check: 'Das Problembriefing unterscheidet beobachteten Bedarf von Vermutungen und behauptet keine zahlenden Nutzer.',
          aiPrompt: 'Formuliere fünf neutrale Discovery-Fragen für dieses eng umrissene Problem. Keine Interviewantworten, Abonnenten oder Marktgröße erfinden: [Briefing].'
        },
        'saas-scope': {
          title: 'Zuerst einen testbaren manuellen Dienst definieren',
          explanation: [
            'Lege zwei Felder fest: Project (1-40 Zeichen) und Status (Draft oder Review). Die Ausgabe lautet exakt Project: [name] in Zeile eins und Status: [choice] in Zeile zwei. Leerer oder zu langer Name wird abgelehnt. Für diese Faktenformatierung ist keine KI nötig.',
            'Teste den Dienst vor dem Programmieren manuell in einem Dokument. Anmeldung, Zahlungen, Kunden-Uploads, KI-Erzeugung, Speicherung und Integrationen ausschließen. Wünschen echte Nutzer anderes Verhalten, als neue Hypothese erfassen statt den Prototyp stillschweigend zu erweitern.'
          ],
          file: 'Formatiererspezifikation',
          code: 'Eingabe: Projektname (getrimmt, 1-40 Zeichen); Status Draft oder Review\nAusgabebeispiel:\nProject: Atlas\nStatus: Review\n\nAbgelehnt: leerer Name; mehr als 40 Zeichen\nAusgeschlossen: Anmeldung, Zahlungen, KI-API, Speicherung, Netzaufrufe\nZiel: Nutzen der kleinen Ausgabe testen, kein Abonnement starten',
          check: 'Dein manueller Prototyp erzeugt exakt die zwei Atlas-Zeilen und hat klare Ablehnungsregeln.',
          aiPrompt: 'Prüfe diese Spezifikation auf Mehrdeutigkeit und unnötige Funktionen. Erkläre, warum deterministische Formatierung keine KI-API braucht: [Spezifikation].'
        },
        'saas-local-prototype': {
          title: 'Einen lokalen Spielzeugprototyp bauen',
          explanation: [
            'Kopiere den vollständigen HTML-Code in eine Textdatei namens formatter.html und öffne sie im Browser. Nur fiktive Namen verwenden. Es gibt keine Netzaufrufe, Anmeldung oder Datenspeicherung. Die manuelle Variante ist möglich, wenn du HTML nicht bearbeiten möchtest; dokumentiere dann, dass die Codevariante nicht getestet wurde.',
            'Ändere Project und Status und drücke Format update. Die Ausgabe verwendet textContent statt HTML-Einfügung, daher wird eingegebenes Markup als Text angezeigt. KI-Hilfe ist optional; für diese Übung weder API verbinden noch ein Abonnementprodukt bereitstellen.'
          ],
          file: 'formatter.html',
          code: '<!doctype html>\n<html lang="de">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Fiktiver Update-Formatierer</title>\n<main>\n<h1>Fiktiver Update-Formatierer</h1>\n<p>Nur lokale Übung. Keine Speicherung oder Netzaufrufe.</p>\n<form id="update-form" novalidate>\n<label for="project">Projekt (1-40 Zeichen)</label>\n<input id="project" maxlength="40">\n<label for="status">Status</label>\n<select id="status"><option value="Draft">Entwurf</option><option value="Review">Prüfung</option></select>\n<button>Update formatieren</button>\n</form>\n<pre id="output" role="status"></pre>\n</main>\n<script>\nconst form = document.getElementById("update-form");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.getElementById("project").value.trim();\n  const status = document.getElementById("status").value;\n  const output = document.getElementById("output");\n  if (!name || name.length > 40 || !["Draft", "Review"].includes(status)) {\n    output.textContent = "Projektname (1-40 Zeichen) und gültigen Status eingeben.";\n    return;\n  }\n  output.textContent = `Project: ${name}\\nStatus: ${status}`;\n});\n</script>\n</html>',
          check: 'Die Datei öffnet lokal und formatiert Atlas / Review in genau zwei Zeilen, ohne Daten zu senden oder zu speichern.',
          aiPrompt: 'Erkläre dieses HTML-Spielzeug Abschnitt für Abschnitt. textContent und Eingabeprüfungen erhalten; keine Abhängigkeiten, Netzaufrufe oder Speicherung ergänzen: [Code].'
        },
        'saas-test-costs': {
          title: 'Grenzfälle testen und Kosten ehrlich erfassen',
          explanation: [
            'Erfasse im Ergebnistracker fünf Fälle: Atlas/Review, leerer Name, Name mit 40 Zeichen, über Browser-Entwicklertools erzwungener Name mit 41 Zeichen und Markup als Name. Letzteres muss literaler Text bleiben, kein Element werden. Nur tatsächliche Ergebnisse notieren; die manuelle Variante allein beweist keine Browserprüfungen.',
            'Das lokale Spielzeug hat keine Hosting- oder API-Rechnung, kostet aber Zeit. Bei einem künftigen Dienst Hosting, API-Nutzung, Überwachung, Support, Zahlungsabwicklung, Steuern und Gemeinkosten bis zur Prüfung als unbekannt führen. Abonnementgebühr ist kein Gewinn; keine lebenslangen Einnahmen aus einem Minittest hochrechnen.'
          ],
          file: 'Prototypprüfungen',
          code: 'Atlas + Review -> Project: Atlas\\nStatus: Review\nLeerer Name -> sichtbarer Fehler\n40 Zeichen -> akzeptiert\n41 Zeichen ins Feld erzwungen -> sichtbarer Fehler\n<b>Atlas</b> -> literaler Text, kein Fettdruck-Element\n\nTatsächliche Ergebnisse/Belege:\nPrototypmethode: Browser / manuell\nKünftige Betriebskosten und Support: TO CONFIRM',
          check: 'Fünf Fälle sind mit Belegen dokumentiert oder Browserfälle offen als nicht ausgeführt markiert; ungeprüfte Zukunftskosten sind aufgeführt.',
          aiPrompt: 'Prüfe diese Testergebnisse und Kostenannahmen. Benenne fehlende Belege; keine bestandenen Tests, Preise oder künftige Einnahmen erfinden: [Protokoll].'
        },
        'saas-user-validation': {
          title: 'Nutzung beobachten und die Testbereitschaft prüfen',
          explanation: [
            'Lade eine einwilligende Testperson ein, ein fiktives Update auszuprobieren. Frage nach Erwartungen, Verwirrung und ob es ein wiederkehrendes Problem löst. Nicht mit einem Preis beginnen und keine Zeitersparnis behaupten, bevor sie gemessen wurde. Ein Kompliment ist keine Zahlungszusage.',
            'Nutze den Angebotsgenerator nur für einen klar begrenzten Discovery-/Prototyp-Pilot, nicht für ein verkaufsfertiges Abonnement. Bei Zahlungsinteresse exakt die Vereinbarung dokumentieren, ohne Geld einzuziehen. Echte Abrechnung, Datenschutz, Zugriffskontrolle, Erstattungen und Wartung benötigen separate Planung und Prüfung.'
          ],
          file: 'Validierungsinterview',
          code: 'Versuchte Aufgabe:\nBeobachtetes Verhalten und Verwirrung:\nAktuelle Alternative:\nWürde es erneut versuchen? Tatsächliche Antwort:\nBeleg für wiederkehrenden Bedarf:\nZahlungsbereitschaft: UNVALIDATED ohne direkten Beleg\nKeine Abos, Zahlungsdaten oder persönlichen Daten erfasst.',
          check: 'Du trennst beobachtete Nutzung, geäußertes Interesse und echte Zusage, ohne zahlende Kunden zu erfinden.',
          aiPrompt: 'Fasse nur diese anonymisierten Beobachtungen zusammen. Verhalten, Meinung, Annahmen und unvalidiertes Zahlungsinteresse trennen: [Notizen].'
        },
        'saas-decision': {
          title: 'Vor einem Live-Micro-SaaS entscheiden',
          explanation: [
            'Prüfe Problembelege, fünf Prototyptests, Feedback, Zeitaufwand und unbekannte Kosten. Wähle weitere Discovery, Ideenänderung oder Abbruch. Eine Fortsetzung bedeutet nicht, dass das Produkt sicher, konform oder produktionsreif ist.',
            'Vor einem echten Start einen separaten Plan für Authentifizierung, Berechtigungen, Datenspeicherung/-löschung, Abrechnung, Support, Sicherheitsprüfung und Fehlerwiederherstellung erstellen. Der fortgeschrittene Webentwicklungspfad kann beim Üben helfen, ersetzt aber keine erforderliche Fachprüfung.'
          ],
          file: 'Validierungsentscheidung',
          code: 'Problembelege:\nLücken der Prototyptests:\nBeobachteter Nutzen und Unsicherheit:\nUnbekannte Kosten und Support:\nEntscheidung: Discovery fortsetzen / ändern / stoppen\nNächster Beleg, Verantwortlicher und Prüftermin:\nProduktionsfunktionen bewusst NOT BUILT:',
          check: 'Die Entscheidung ist belegt und nennt die Lücken zwischen lokalem Spielzeug und echtem Abonnementdienst.',
          aiPrompt: 'Prüfe meine Validierungsentscheidung auf unbelegte Nachfrage-/Bereitschaftsbehauptungen. Liste Untersuchungen vor einem Live-Produkt auf, ohne Traktion zu erfinden: [Entscheidung].'
        }
      }
    },
    es: {
      title: 'Validar una idea de micro-SaaS antes de crear suscripciones',
      intro: 'Recopila evidencia del problema, prueba un formateador local de actualizaciones de proyecto y decide qué investigar después. Unos 90 minutos más entrevistas. Sin IA de pago, facturación ni lanzamiento en producción.',
      steps: {
        'saas-problem-evidence': {
          title: 'Validar un problema recurrente y concreto',
          explanation: [
            'Un micro-SaaS es un pequeño servicio de software por suscripción; esta ruta valida una idea antes de crear un servicio activo. La práctica da formato a una actualización breve a partir del nombre y estado de un proyecto. No analiza una empresa ni genera asesoramiento técnico.',
            'Pregunta a personas adultas que acepten participar cómo preparan actualizaciones, con qué frecuencia y qué les resulta frustrante. Registra evidencia real e incertidumbre. Si no has entrevistado a nadie, marca la demanda UNVALIDATED. No compres alojamiento, cobres pagos ni prometas ingresos recurrentes a partir del ejercicio.'
          ],
          file: 'Evidencia del problema',
          code: 'Idea: formateador sencillo de actualizaciones de proyectos\nUsuario objetivo y tarea recurrente:\nMétodo actual, frecuencia y dificultad:\nFuente/fecha de evidencia (anonimizada):\nSupuestos aún sin validar:\nPróxima pregunta neutral de entrevista:\nSin entrevista: demanda UNVALIDATED',
          check: 'El brief distingue necesidad observada de suposiciones y no afirma que haya usuarios de pago.',
          aiPrompt: 'Escribe cinco preguntas neutrales para descubrir necesidades sobre este problema concreto. No inventes respuestas, suscriptores ni tamaño de mercado: [brief].'
        },
        'saas-scope': {
          title: 'Definir primero un servicio manual comprobable',
          explanation: [
            'Especifica dos campos: Project (1-40 caracteres) y Status (Draft o Review). La salida es exactamente Project: [name] en la primera línea y Status: [choice] en la segunda. Se rechaza un nombre vacío o demasiado largo. No hace falta IA para dar formato a estos datos.',
            'Prueba el servicio manualmente en un documento antes de programar. Excluye inicio de sesión, pagos, cargas de clientes, generación con IA, almacenamiento e integraciones. Si usuarios reales desean otro comportamiento, regístralo como una hipótesis nueva en vez de ampliar el prototipo en silencio.'
          ],
          file: 'Especificación del formateador',
          code: 'Entrada: nombre de proyecto (sin espacios extremos, 1-40 caracteres); estado Draft o Review\nEjemplo de salida:\nProject: Atlas\nStatus: Review\n\nRechazado: nombre vacío; más de 40 caracteres\nExcluye: inicio de sesión, pagos, API de IA, almacenamiento, llamadas de red\nObjetivo: probar si sirve la salida pequeña, no lanzar una suscripción',
          check: 'El prototipo manual produce exactamente las dos líneas Atlas y tiene reglas claras de rechazo.',
          aiPrompt: 'Revisa esta especificación para detectar ambigüedades y funciones innecesarias. Explica por qué el formato determinista no necesita una API de IA: [especificación].'
        },
        'saas-local-prototype': {
          title: 'Crear un prototipo de juguete solo local',
          explanation: [
            'Copia todo el HTML en un archivo de texto sin formato llamado formatter.html y ábrelo en el navegador. Usa solo nombres ficticios. No realiza llamadas de red, inicio de sesión ni guarda datos. Puedes usar la versión manual si no quieres editar HTML, pero registra que no probaste la versión de código.',
            'Cambia Project y Status y pulsa Format update. La salida usa textContent, no inserción HTML, así que cualquier marcado escrito se muestra como texto. La ayuda de IA es opcional; no conectes una API ni despliegues un producto por suscripción en este ejercicio.'
          ],
          file: 'formatter.html',
          code: '<!doctype html>\n<html lang="es">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Formateador ficticio de actualizaciones</title>\n<main>\n<h1>Formateador ficticio de actualizaciones</h1>\n<p>Práctica solo local. Sin almacenamiento ni llamadas de red.</p>\n<form id="update-form" novalidate>\n<label for="project">Proyecto (1-40 caracteres)</label>\n<input id="project" maxlength="40">\n<label for="status">Estado</label>\n<select id="status"><option value="Draft">Borrador</option><option value="Review">Revisión</option></select>\n<button>Formatear actualización</button>\n</form>\n<pre id="output" role="status"></pre>\n</main>\n<script>\nconst form = document.getElementById("update-form");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.getElementById("project").value.trim();\n  const status = document.getElementById("status").value;\n  const output = document.getElementById("output");\n  if (!name || name.length > 40 || !["Draft", "Review"].includes(status)) {\n    output.textContent = "Introduce un nombre de proyecto (1-40 caracteres) y un estado válido.";\n    return;\n  }\n  output.textContent = `Project: ${name}\\nStatus: ${status}`;\n});\n</script>\n</html>',
          check: 'El archivo se abre localmente y formatea Atlas / Review en exactamente dos líneas sin enviar ni guardar datos.',
          aiPrompt: 'Explica este HTML de juguete sección por sección. Conserva textContent y las validaciones; no añadas dependencias, red ni almacenamiento: [código].'
        },
        'saas-test-costs': {
          title: 'Probar límites y registrar los costes con honestidad',
          explanation: [
            'Registra cinco casos en el seguimiento de resultados: Atlas/Review, nombre vacío, nombre de 40 caracteres, nombre de 41 caracteres forzado con las herramientas de desarrollo del navegador y marcado introducido como nombre. Este último debe seguir siendo texto literal, no convertirse en elemento. Registra resultados reales; la versión manual no demuestra que funcionen las comprobaciones del navegador.',
            'Este juguete local no genera factura de alojamiento ni API, pero sí requiere tu tiempo. Para un futuro servicio, deja alojamiento, uso de API, supervisión, soporte, procesamiento de pagos, impuestos y gastos generales como desconocidos hasta verificarlos. Una suscripción no es beneficio; no proyectes ingresos de por vida a partir de una prueba pequeña.'
          ],
          file: 'Comprobaciones del prototipo',
          code: 'Atlas + Review -> Project: Atlas\\nStatus: Review\nNombre vacío -> error visible\n40 caracteres -> aceptado\n41 caracteres forzados en el campo -> error visible\n<b>Atlas</b> -> texto literal, sin elemento en negrita\n\nResultados/evidencia reales:\nMétodo de prototipo: navegador / manual\nCostes futuros de operación y soporte: TO CONFIRM',
          check: 'Tienes cinco casos registrados con evidencia o marcas abiertamente como no ejecutados los casos de navegador, y enumeras costes futuros sin verificar.',
          aiPrompt: 'Revisa estos resultados y supuestos de costes. Señala evidencia ausente; no inventes pruebas aprobadas, precios ni ingresos futuros: [registro].'
        },
        'saas-user-validation': {
          title: 'Observar el uso y comprobar si alguien quiere probarlo',
          explanation: [
            'Invita a una persona que acepte participar a probar una actualización ficticia y pregunta qué esperaba, qué le confundió y si resuelve un problema recurrente. No empieces hablando de un precio ni afirmes que ahorra tiempo antes de medirlo. Un elogio no es un compromiso de pago.',
            'Usa el generador de propuestas solo para un piloto de descubrimiento/prototipo claramente delimitado, no para una suscripción lista para comprar. Si surge interés de pago, registra exactamente lo acordado sin cobrar dinero en este ejercicio. Facturación real, privacidad, control de acceso, reembolsos y mantenimiento requieren diseño y revisión aparte.'
          ],
          file: 'Entrevista de validación',
          code: 'Tarea probada:\nComportamiento observado y confusión:\nAlternativa actual:\n¿Lo probaría otra vez? Respuesta real:\nEvidencia de necesidad recurrente:\nDisposición a pagar: UNVALIDATED salvo evidencia directa\nSin suscripciones, datos de pago ni datos personales.',
          check: 'Distingues uso observado, interés expresado y compromiso real sin inventar clientes de pago.',
          aiPrompt: 'Resume solo estas observaciones anonimizadas. Separa comportamiento, opiniones, supuestos e interés de pago sin validar: [notas].'
        },
        'saas-decision': {
          title: 'Decidir antes de crear un micro-SaaS activo',
          explanation: [
            'Revisa evidencia del problema, cinco pruebas del prototipo, comentarios, tiempo invertido y costes desconocidos. Elige continuar investigando, revisar la idea o parar. Continuar no significa que el producto sea seguro, cumpla requisitos o esté listo para producción.',
            'Antes de un lanzamiento real, crea un plan separado para autenticación, permisos, conservación/eliminación de datos, facturación, soporte, revisión de seguridad y recuperación ante fallos. La ruta avanzada de desarrollo web ayuda a practicar ingeniería, pero no sustituye la revisión profesional cuando haga falta.'
          ],
          file: 'Decisión de validación',
          code: 'Evidencia del problema:\nBrechas de pruebas del prototipo:\nUtilidad observada e incertidumbre:\nCostes y soporte desconocidos:\nDecisión: continuar investigando / revisar / parar\nPróxima evidencia necesaria, responsable y fecha de revisión:\nFunciones de producción deliberadamente NOT BUILT:',
          check: 'Tu decisión se apoya en evidencia y declara la diferencia entre un juguete local y un servicio real por suscripción.',
          aiPrompt: 'Audita mi decisión de validación para detectar afirmaciones sin respaldo sobre demanda y preparación. Enumera lo que debe investigarse antes de un producto activo, sin inventar tracción: [decisión].'
        }
      }
    }
  }
};
