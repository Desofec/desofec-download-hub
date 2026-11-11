import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const multilingualWorkTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-multilingual-work': {
    fr: {
      title: 'Traduire et travailler entre les langues avec l’IA',
      intro: 'Traduisez une annonce fictive de l’anglais vers l’espagnol, vérifiez les faits et préparez une relecture privée. L’IA est facultative.',
      steps: {
        'translation-brief': {
          title: 'Définir le public et la traduction',
          explanation: [
            'Entraînez-vous avec Harbor Learning Centre, une organisation fictive. Traduisez son annonce d’atelier fictive de l’anglais vers l’espagnol pour un public général. Utilisez le même exercice même si le tutoriel est en français, allemand ou espagnol ; aucun texte ni contact réel n’est nécessaire.',
            'Définissez le public, la langue cible et l’objectif avant de rédiger. Pour un travail réel, interrogez le public visé sur la région, le ton et l’accessibilité ; prévoyez une relecture humaine qualifiée pour les contenus à forts enjeux. L’IA est facultative : un texte fluide ne prouve pas son exactitude.'
          ],
          file: 'Brief de traduction',
          code: `Entraînement uniquement : Harbor Learning Centre est fictif.
Langue source : anglais | langue cible : espagnol
Public : lecteurs généraux | objectif : comprendre une annonce d’atelier
Source originale en anglais :
M1: Harbor Learning Centre offers a free digital skills workshop.
M2: It takes place on 2030-06-14 from 14:00 to 15:00 UTC in Room B.
M3: Registration closes on 2030-06-12; there are 20 seats.
M4: Materials are provided.
Sens en français : atelier gratuit ; le 2030-06-14, 14:00-15:00 UTC, salle B ; inscriptions jusqu’au 2030-06-12 ; 20 places ; supports fournis.
Destinataire réel ou publication : aucun`,
          check: 'Votre brief indique l’anglais comme source, l’espagnol comme cible et le public visé, et garde l’annonce fictive privée.',
          aiPrompt: 'Aide-moi à préparer un brief de traduction pour un public hispanophone général. Liste les questions sur la région, le ton et l’accessibilité sans en deviner les réponses.'
        },
        'translation-prepare': {
          title: 'Préparer un texte autorisé et non sensible',
          explanation: [
            'Utilisez uniquement l’annonce fictive ci-dessus. Pour un travail réel, confirmez que vous avez le droit de traduire le document et retirez les noms, coordonnées et détails confidentiels ou sensibles inutiles à la tâche. Gardez l’original dans un lieu approuvé.',
            'Avant tout service externe d’IA ou de traduction, vérifiez vous-même sa disponibilité, ses coûts, son traitement des données et les règles de votre organisation. Ne présumez ni gratuité ni traitement privé. Si le texte ne peut pas être partagé, utilisez une solution approuvée ou travaillez hors ligne.'
          ],
          file: 'Vérification des droits et de la confidentialité',
          code: `Source : annonce fictive M1-M4
Autorisation de cet exercice fictif : texte d’entraînement fourni ici
Données personnelles ou confidentielles réelles dans le prompt : 0
Droits et autorisation d’une source réelle : à vérifier avant usage
Disponibilité, coût et traitement des données du service externe vérifiés : OUI / NON / NON UTILISÉ
Original et brouillon d’entraînement : privés`,
          check: 'Vous utilisez uniquement l’annonce fictive, excluez les données privées et vérifiez les droits et conditions du service avant tout usage réel.',
          aiPrompt: 'Donne-moi une liste pour décider si un document peut être traduit ou envoyé à un outil externe. Ne me demande pas de coller le document ni de secrets.'
        },
        'translation-glossary': {
          title: 'Créer un petit glossaire traçable',
          explanation: [
            'Créez un glossaire pour garder une terminologie cohérente. Dans cet exercice, utilisez « gratuito » pour gratuit, « inscripción » pour inscription et « plazas » pour places ; gardez le nom de l’organisation et UTC inchangés.',
            'Conservez les dates, heures, nombre de places et salle exacts de la source anglaise. Un glossaire aide à commencer mais ne remplace pas la vérification du sens en contexte. Notez les doutes régionaux ou terminologiques pour une relecture humaine au lieu d’inventer une réponse.'
          ],
          file: 'Glossaire et faits à conserver',
          code: `Anglais | espagnol | note
free | gratuito | sans frais
registration | inscripción | inscription, pas présence
seats | plazas | capacité, pas participants confirmés
Harbor Learning Centre | Harbor Learning Centre | garder le nom
UTC | UTC | garder le fuseau horaire
Faits à conserver : 2030-06-14 | 14:00-15:00 UTC | salle B | 2030-06-12 | 20 places
Préférence régionale : INCONNUE - demander à une personne chargée de la relecture`,
          check: 'Votre glossaire conserve le nom, UTC, les dates, heures, salle et 20 places ; il signale la préférence régionale inconnue.',
          aiPrompt: 'Propose un petit glossaire anglais-espagnol pour cette annonce fictive. Préserve noms, dates, heures, nombres et UTC ; signale les termes incertains sans deviner : [M1-M4].'
        },
        'translation-draft': {
          title: 'Rédiger une traduction par segment source',
          explanation: [
            'Traduisez un segment source numéroté à la fois pour repérer plus facilement les omissions et ajouts. Vous pouvez rédiger vous-même ou demander une suggestion à un outil d’IA approuvé ; aucune des deux méthodes ne remplace une vérification humaine du sens.',
            'Comparez chaque segment espagnol à M1-M4. L’exemple ci-dessous est un brouillon, pas un message approuvé. N’ajoutez pas de lieu, frais, heure limite, liste de participants ou promesse absents de la source.'
          ],
          file: 'Brouillon espagnol',
          code: `Brouillon en espagnol :
M1: Harbor Learning Centre ofrece un taller gratuito de competencias digitales.
M2: Se celebra el 2030-06-14 de 14:00 a 15:00 UTC en la sala B.
M3: La inscripción se cierra el 2030-06-12; hay 20 plazas.
M4: Se proporcionan los materiales.
Statut du brouillon : NON APPROUVÉ ; entraînement privé uniquement`,
          check: 'Vos quatre segments espagnols correspondent à M1-M4 et n’ajoutent ni frais, ni heure limite, ni autre détail non étayé.',
          aiPrompt: 'Traduis la source fictive M1-M4 en espagnol pour un public général. Garde un identifiant par segment, préserve tous les faits et UTC, et signale les ambiguïtés sans ajouter de détails : [M1-M4].'
        },
        'translation-check': {
          title: 'Repérer et corriger les faits modifiés',
          explanation: [
            'Une traduction assurée peut modifier des nombres ou omettre une condition. Comparez le texte proposé à la source, segment par segment. Il change à tort M2 en 15:00-16:00 UTC et M3 en 30 places ; corrigez en 14:00-15:00 UTC et 20 places.',
            'Vérifiez aussi la gratuité, la fermeture des inscriptions le 2030-06-12, la salle B et les supports fournis, et que la date n’est pas convertie dans un autre fuseau sans indication. Une retraduction peut aider à repérer des problèmes, mais ne prouve pas l’exactitude.'
          ],
          file: 'Comparaison et correction',
          code: `M2 proposé : 2030-06-14 | 15:00-16:00 UTC | sala B -> HEURE ERRONÉE
M2 corrigé : 2030-06-14 | 14:00-15:00 UTC | sala B
M3 proposé : 2030-06-12 | 30 plazas -> NOMBRE ERRONÉ
M3 corrigé : 2030-06-12 | 20 plazas
M1 : gratuito | M4 : materiales proporcionados
Questions ouvertes sur le public ou les termes : noter, ne pas deviner`,
          check: 'Vous repérez les deux faits modifiés et rétablissez 14:00-15:00 UTC et 20 places tout en contrôlant les autres détails.',
          aiPrompt: 'Compare ce texte proposé à M1-M4 uniquement. Liste les différences et cite la source de chacune ; ne corrige pas silencieusement et n’invente ni faits ni approbation humaine : [source et texte proposé].'
        },
        'translation-handover': {
          title: 'Consigner honnêtement la relecture et la remise',
          explanation: [
            'Conservez ensemble identifiants source, brouillon, glossaire et corrections. Demandez à une personne compétente dans la langue de vérifier le sens, le ton, l’accessibilité et l’adéquation au public réel. Pour un contenu juridique, médical ou à forts enjeux, faites appel à un professionnel qualifié et suivez les règles locales.',
            'Cet exercice n’a ni personne réelle pour relire ni destinataire. Notez l’approbation BLOQUÉE et les retours NON RECUEILLIS. Gardez le brouillon privé : ne pas envoyer ni publier. Un exercice vérifié n’est ni une traduction certifiée ni une garantie.'
          ],
          file: 'Remise privée',
          code: `Source : M1-M4 fictifs | cible : espagnol
Faits vérifiés : 2030-06-14 | 14:00-15:00 UTC | salle B | 2030-06-12 | 20 places
Atelier gratuit ; supports fournis
Approbation : BLOQUÉE - aucune personne réelle pour relire
Retours du public : NON RECUEILLIS
Statut : privé ; ne pas envoyer ni publier
Certification : non revendiquée`,
          check: 'Votre remise note les faits vérifiés, l’approbation BLOQUÉE et les retours NON RECUEILLIS, et garde l’exercice privé.',
          aiPrompt: 'Vérifie si des contrôles manquent à cette remise fictive. N’invente ni relecture, approbation, retour, certification ou permission de publier : [remise].'
        }
      }
    },
    de: {
      title: 'Mehrsprachig arbeiten und mit KI übersetzen',
      intro: 'Übersetzen Sie eine fiktive Mitteilung von Englisch nach Spanisch, prüfen Sie die Fakten und bereiten Sie eine private Überprüfung vor. KI ist optional.',
      steps: {
        'translation-brief': {
          title: 'Zielgruppe und Übersetzungsaufgabe festlegen',
          explanation: [
            'Üben Sie mit Harbor Learning Centre, einer fiktiven Organisation. Übersetzen Sie deren fiktive Workshop-Mitteilung aus dem Englischen ins Spanische für eine allgemeine Zielgruppe. Nutzen Sie dieselbe Übung auch bei französischer, deutscher oder spanischer Tutorialsprache; echte Texte oder Kontaktdaten sind nicht nötig.',
            'Bestimmen Sie vor dem Entwurf Zielgruppe, Zielsprache und Zweck. Fragen Sie bei echter Arbeit die Zielgruppe nach Region, Ton und Barrierefreiheit; organisieren Sie bei Inhalten mit hohen Risiken eine qualifizierte menschliche Prüfung. KI ist optional; flüssige Formulierungen beweisen keine Richtigkeit.'
          ],
          file: 'Übersetzungsbriefing',
          code: `Nur Übung: Harbor Learning Centre ist fiktiv.
Ausgangssprache: Englisch | Zielsprache: Spanisch
Zielgruppe: allgemeine Leserschaft | Zweck: eine Workshop-Mitteilung verstehen
Englischer Originaltext:
M1: Harbor Learning Centre offers a free digital skills workshop.
M2: It takes place on 2030-06-14 from 14:00 to 15:00 UTC in Room B.
M3: Registration closes on 2030-06-12; there are 20 seats.
M4: Materials are provided.
Bedeutung auf Deutsch: kostenloser Workshop; 2030-06-14, 14:00-15:00 UTC, Raum B; Anmeldeschluss 2030-06-12; 20 Plätze; Materialien werden bereitgestellt.
Echte Empfänger oder Veröffentlichung: keine`,
          check: 'Ihr Briefing nennt Englisch als Ausgangssprache, Spanisch als Zielsprache und die Zielgruppe und hält die fiktive Mitteilung privat.',
          aiPrompt: 'Hilf mir mit einem Übersetzungsbriefing für eine allgemeine spanischsprachige Zielgruppe. Liste Fragen zu Region, Ton und Barrierefreiheit auf, ohne Antworten zu erraten.'
        },
        'translation-prepare': {
          title: 'Nur erlaubten, unbedenklichen Text vorbereiten',
          explanation: [
            'Verwenden Sie nur die obige fiktive Mitteilung. Prüfen Sie bei echter Arbeit, ob Sie das Material übersetzen dürfen, und entfernen Sie für die Aufgabe unnötige Namen, Kontaktdaten sowie vertrauliche oder sensible Angaben. Bewahren Sie das Original an einem genehmigten Ort auf.',
            'Prüfen Sie vor der Nutzung eines externen KI- oder Übersetzungsdienstes selbst dessen aktuelle Verfügbarkeit, Kosten und Datenverarbeitung sowie die Regeln Ihrer Organisation. Gehen Sie weder von Gratisnutzung noch von privater Verarbeitung aus. Darf der Text nicht geteilt werden, nutzen Sie eine zugelassene Alternative oder arbeiten Sie offline.'
          ],
          file: 'Rechte- und Datenschutzprüfung',
          code: `Quelle: fiktive Workshop-Mitteilung M1-M4
Erlaubnis für diese fiktive Übung: hier bereitgestellter Übungstext
Echte persönliche oder vertrauliche Angaben im Prompt: 0
Rechte und Erlaubnis für echte Quelle: vor Nutzung prüfen
Verfügbarkeit, Kosten und Datenverarbeitung des externen Dienstes geprüft: JA / NEIN / NICHT GENUTZT
Original und Übungsentwurf: privat`,
          check: 'Sie verwenden nur die fiktive Mitteilung, lassen private Angaben weg und prüfen Rechte und Dienstbedingungen vor echter Nutzung.',
          aiPrompt: 'Gib mir eine Checkliste, um zu entscheiden, ob ein Dokument übersetzt oder an ein externes Tool gesendet werden darf. Bitte mich nicht um das Dokument oder Geheimnisse.'
        },
        'translation-glossary': {
          title: 'Ein kleines nachvollziehbares Glossar erstellen',
          explanation: [
            'Erstellen Sie ein Glossar für einheitliche Begriffe. Nutzen Sie in dieser Übung „gratuito“ für kostenlos, „inscripción“ für Anmeldung und „plazas“ für Plätze; lassen Sie Organisationsname und UTC unverändert.',
            'Übernehmen Sie die genauen Daten, Uhrzeiten, die Anzahl und den Raum aus der englischen Quelle. Ein Glossar ist ein Anfang, ersetzt aber keine Prüfung der Bedeutung im Kontext. Notieren Sie regionale oder terminologische Unsicherheit für eine menschliche Prüfung, statt eine Antwort zu erfinden.'
          ],
          file: 'Glossar und geschützte Fakten',
          code: `Englisch | Spanisch | Hinweis
free | gratuito | ohne Gebühr
registration | inscripción | Anmeldung, nicht Teilnahme
seats | plazas | Kapazität, nicht bestätigte Teilnehmende
Harbor Learning Centre | Harbor Learning Centre | Name bleibt
UTC | UTC | Zeitzone bleibt
Geschützte Fakten: 2030-06-14 | 14:00-15:00 UTC | Raum B | 2030-06-12 | 20 Plätze
Regionale Präferenz: UNBEKANNT - prüfende Person fragen`,
          check: 'Ihr Glossar erhält den Namen, UTC, Daten, Uhrzeiten, Raum und 20 Plätze und markiert unbekannte regionale Präferenzen.',
          aiPrompt: 'Schlage ein kleines Englisch-Spanisch-Glossar für diese fiktive Mitteilung vor. Erhalte Namen, Daten, Zeiten, Zahlen und UTC; markiere unsichere Begriffe, statt zu raten: [M1-M4].'
        },
        'translation-draft': {
          title: 'Abschnitt für Abschnitt übersetzen',
          explanation: [
            'Übersetzen Sie jeweils einen nummerierten Quellabschnitt. So lassen sich Auslassungen und Zusätze leichter finden. Sie können selbst formulieren oder ein zugelassenes KI-Tool um einen Vorschlag bitten; beides ersetzt keine menschliche Bedeutungsprüfung.',
            'Vergleichen Sie jeden spanischen Abschnitt mit M1-M4. Das Beispiel ist ein Entwurf, keine freigegebene Mitteilung. Ergänzen Sie keinen Ort, keine Gebühr, keine Uhrzeit für die Frist, keine Teilnehmerliste und kein Versprechen, das nicht in der Quelle steht.'
          ],
          file: 'Spanischer Entwurf',
          code: `Entwurf auf Spanisch:
M1: Harbor Learning Centre ofrece un taller gratuito de competencias digitales.
M2: Se celebra el 2030-06-14 de 14:00 a 15:00 UTC en la sala B.
M3: La inscripción se cierra el 2030-06-12; hay 20 plazas.
M4: Se proporcionan los materiales.
Entwurfsstatus: NICHT FREIGEGEBEN; nur private Übung`,
          check: 'Ihre vier spanischen Abschnitte entsprechen M1-M4 und fügen keine Gebühr, Fristuhrzeit oder anderen unbelegten Angaben hinzu.',
          aiPrompt: 'Übersetze die fiktive Quelle M1-M4 ins Spanische für eine allgemeine Leserschaft. Gib pro Abschnitt die passende ID aus, erhalte alle Fakten und UTC und markiere Unklarheiten ohne Zusätze: [M1-M4].'
        },
        'translation-check': {
          title: 'Veränderte Fakten finden und korrigieren',
          explanation: [
            'Eine überzeugende Übersetzung kann Zahlen verändern oder Bedingungen auslassen. Vergleichen Sie den Vorschlag Abschnitt für Abschnitt mit der Quelle. Er verändert M2 fälschlich zu 15:00-16:00 UTC und M3 zu 30 Plätzen; korrigieren Sie auf 14:00-15:00 UTC und 20 Plätze.',
            'Prüfen Sie auch die kostenlose Teilnahme, das Anmeldeende am 2030-06-12, Raum B und die bereitgestellten Materialien sowie, dass das Datum nicht stillschweigend in eine andere Zeitzone umgerechnet wurde. Rückübersetzen kann Fehler sichtbar machen, beweist aber keine Richtigkeit.'
          ],
          file: 'Vergleich und Korrektur',
          code: `Vorschlag M2: 2030-06-14 | 15:00-16:00 UTC | sala B -> FALSCHE ZEIT
Korrigiert M2: 2030-06-14 | 14:00-15:00 UTC | sala B
Vorschlag M3: 2030-06-12 | 30 plazas -> FALSCHE ANZAHL
Korrigiert M3: 2030-06-12 | 20 plazas
M1: gratuito | M4: materiales proporcionados
Offene Fragen zu Begriffen oder Zielgruppe: notieren, nicht raten`,
          check: 'Sie erkennen beide veränderten Fakten, stellen 14:00-15:00 UTC und 20 Plätze wieder her und prüfen die übrigen Angaben.',
          aiPrompt: 'Vergleiche diesen Vorschlag ausschließlich mit M1-M4. Liste Unterschiede auf und zitiere jeweils die Quelle; korrigiere nicht stillschweigend und erfinde weder Fakten noch menschliche Freigabe: [Quelle und Vorschlag].'
        },
        'translation-handover': {
          title: 'Prüfung und Übergabe ehrlich dokumentieren',
          explanation: [
            'Bewahren Sie Quell-IDs, Entwurf, Glossar und Korrekturen zusammen auf. Bitten Sie eine sprachlich kompetente Person, Bedeutung, Ton, Barrierefreiheit und Eignung für die tatsächliche Zielgruppe zu prüfen. Nutzen Sie für rechtliche, medizinische oder andere Inhalte mit hohen Risiken qualifizierte Fachleute und befolgen Sie lokale Regeln.',
            'Diese Übung hat weder eine echte prüfende Person noch Empfänger. Notieren Sie die Freigabe als BLOCKIERT und Rückmeldungen als NICHT ERHOBEN. Behalten Sie den Entwurf privat: nicht versenden oder veröffentlichen. Eine geprüfte Übung ist keine beglaubigte Übersetzung und keine Garantie.'
          ],
          file: 'Private Übergabe',
          code: `Quelle: fiktive M1-M4 | Ziel: Spanisch
Geprüfte Fakten: 2030-06-14 | 14:00-15:00 UTC | Raum B | 2030-06-12 | 20 Plätze
Kostenloser Workshop; Materialien werden bereitgestellt
Freigabe: BLOCKIERT - keine echte prüfende Person
Rückmeldungen der Zielgruppe: NICHT ERHOBEN
Status: privat; nicht versenden oder veröffentlichen
Beglaubigung: nicht behauptet`,
          check: 'Ihre Übergabe enthält die geprüften Fakten, BLOCKIERTE Freigabe und NICHT ERHOBENE Rückmeldungen und hält die Übung privat.',
          aiPrompt: 'Prüfe diese fiktive Übergabe auf fehlende Kontrollen. Erfinde keine prüfende Person, Freigabe, Rückmeldung, Beglaubigung oder Veröffentlichungserlaubnis: [Übergabe].'
        }
      }
    },
    es: {
      title: 'Trabajar entre idiomas y traducir con IA',
      intro: 'Traduce un aviso ficticio del inglés al español, comprueba los datos y prepara una revisión privada. La IA es opcional.',
      steps: {
        'translation-brief': {
          title: 'Definir el público y la tarea de traducción',
          explanation: [
            'Practica con Harbor Learning Centre, una organización ficticia. Traduce su aviso ficticio de un taller del inglés al español para un público general. Usa el mismo ejercicio si el tutorial está en francés, alemán o español; no necesitas avisos ni contactos reales.',
            'Define el público, el idioma de destino y el propósito antes de redactar. En trabajos reales, consulta al público previsto sobre región, tono y accesibilidad; para contenidos de alto riesgo, organiza una revisión humana cualificada. La IA es opcional y una respuesta fluida no demuestra exactitud.'
          ],
          file: 'Brief de traducción',
          code: `Solo práctica: Harbor Learning Centre es ficticio.
Idioma de origen: inglés | idioma de destino: español
Público: lectores generales | propósito: entender un aviso de taller
Fuente original en inglés:
M1: Harbor Learning Centre offers a free digital skills workshop.
M2: It takes place on 2030-06-14 from 14:00 to 15:00 UTC in Room B.
M3: Registration closes on 2030-06-12; there are 20 seats.
M4: Materials are provided.
Sentido en español: taller gratuito; 2030-06-14, 14:00-15:00 UTC, sala B; inscripción hasta el 2030-06-12; 20 plazas; materiales proporcionados.
Destinatario real o publicación: ninguno`,
          check: 'Tu brief identifica el inglés como origen, el español como destino y el público previsto, y mantiene privado el aviso ficticio.',
          aiPrompt: 'Ayúdame a preparar un brief de traducción para un público hispanohablante general. Enumera preguntas sobre región, tono y accesibilidad sin adivinar las respuestas.'
        },
        'translation-prepare': {
          title: 'Preparar solo texto permitido y no sensible',
          explanation: [
            'Usa únicamente el aviso ficticio anterior. En trabajos reales, confirma que tienes permiso para traducir el material y elimina nombres, contactos y datos confidenciales o sensibles que la tarea no necesite. Guarda el original en un lugar autorizado.',
            'Antes de utilizar un servicio externo de IA o traducción, comprueba su disponibilidad actual, costes, tratamiento de datos y normas de tu organización. No presupongas una tarifa gratuita ni un tratamiento privado. Si no puedes compartir el texto, usa una alternativa aprobada o trabaja sin conexión.'
          ],
          file: 'Comprobación de permisos y privacidad',
          code: `Fuente: aviso ficticio del taller M1-M4
Permiso para este ejercicio ficticio: texto de práctica proporcionado aquí
Datos personales o confidenciales reales en el prompt: 0
Derechos y permiso de una fuente real: comprobar antes de usar
Disponibilidad, coste y tratamiento de datos del servicio externo comprobados: SÍ / NO / NO SE USA
Original y borrador de práctica: privados`,
          check: 'Usas solo el aviso ficticio, excluyes datos privados y compruebas permisos y condiciones del servicio antes de un uso real.',
          aiPrompt: 'Dame una lista para decidir si un documento puede traducirse o enviarse a una herramienta externa. No me pidas que pegue el documento ni secretos.'
        },
        'translation-glossary': {
          title: 'Crear un pequeño glosario trazable',
          explanation: [
            'Prepara un glosario para mantener coherentes los términos importantes. En este ejercicio usa «gratuito» para free, «inscripción» para registration y «plazas» para seats; conserva el nombre de la organización y UTC sin cambios.',
            'Conserva las fechas, horas, cantidad y sala exactas de la fuente inglesa. Un glosario es un punto de partida, no sustituye la comprobación del significado en contexto. Anota cualquier duda regional o terminológica para una revisión humana en vez de inventar una respuesta.'
          ],
          file: 'Glosario y datos protegidos',
          code: `Inglés | español | nota
free | gratuito | sin coste
registration | inscripción | inscripción, no asistencia
seats | plazas | capacidad, no asistentes confirmados
Harbor Learning Centre | Harbor Learning Centre | conservar nombre
UTC | UTC | conservar zona horaria
Datos protegidos: 2030-06-14 | 14:00-15:00 UTC | sala B | 2030-06-12 | 20 plazas
Preferencia regional: DESCONOCIDA - preguntar a una persona revisora`,
          check: 'Tu glosario conserva el nombre, UTC, las fechas, horas, sala y 20 plazas, y señala la preferencia regional desconocida.',
          aiPrompt: 'Sugiere un pequeño glosario inglés-español para este aviso ficticio. Conserva nombres, fechas, horas, números y UTC; señala términos dudosos sin adivinar: [M1-M4].'
        },
        'translation-draft': {
          title: 'Redactar una traducción por segmento de origen',
          explanation: [
            'Traduce un segmento numerado cada vez para localizar mejor omisiones y añadidos. Puedes redactar tú o pedir sugerencias a una herramienta de IA aprobada; ninguno de los dos métodos sustituye una comprobación humana del significado.',
            'Compara cada segmento en español con M1-M4. El ejemplo es un borrador, no un mensaje aprobado. No añadas un lugar, tarifa, hora límite, lista de asistentes o promesa que no figure en la fuente.'
          ],
          file: 'Borrador en español',
          code: `Borrador en español:
M1: Harbor Learning Centre ofrece un taller gratuito de competencias digitales.
M2: Se celebra el 2030-06-14 de 14:00 a 15:00 UTC en la sala B.
M3: La inscripción se cierra el 2030-06-12; hay 20 plazas.
M4: Se proporcionan los materiales.
Estado del borrador: NO APROBADO; solo práctica privada`,
          check: 'Tus cuatro segmentos en español coinciden con M1-M4 y no añaden tarifas, hora límite ni otros datos sin respaldo.',
          aiPrompt: 'Traduce la fuente ficticia M1-M4 al español para lectores generales. Devuelve un ID por segmento, conserva todos los datos y UTC y señala ambigüedades sin añadir detalles: [M1-M4].'
        },
        'translation-check': {
          title: 'Detectar y corregir datos modificados',
          explanation: [
            'Una traducción convincente puede cambiar cifras u omitir condiciones. Compara la propuesta con la fuente, segmento por segmento. Cambia erróneamente M2 a 15:00-16:00 UTC y M3 a 30 plazas; corrige a 14:00-15:00 UTC y 20 plazas.',
            'Comprueba también la gratuidad, el cierre de inscripción el 2030-06-12, la sala B y los materiales proporcionados, y que no se convierta la fecha a otra zona horaria sin indicarlo. La retrotraducción puede ayudar a detectar problemas, pero no demuestra que la traducción sea correcta.'
          ],
          file: 'Comparación y corrección',
          code: `Propuesta M2: 2030-06-14 | 15:00-16:00 UTC | sala B -> HORA INCORRECTA
Corrección M2: 2030-06-14 | 14:00-15:00 UTC | sala B
Propuesta M3: 2030-06-12 | 30 plazas -> CANTIDAD INCORRECTA
Corrección M3: 2030-06-12 | 20 plazas
M1: gratuito | M4: materiales proporcionados
Preguntas abiertas sobre términos o público: anotar, no adivinar`,
          check: 'Detectas los dos datos modificados y recuperas 14:00-15:00 UTC y 20 plazas, además de comprobar los demás detalles.',
          aiPrompt: 'Compara esta propuesta solo con M1-M4. Enumera diferencias y cita la fuente para cada una; no corrijas en silencio ni inventes datos o aprobación humana: [fuente y propuesta].'
        },
        'translation-handover': {
          title: 'Registrar revisión y entrega con honestidad',
          explanation: [
            'Conserva juntos los ID de la fuente, borrador, glosario y notas de corrección. Pide a una persona competente en el idioma que revise significado, tono, accesibilidad y adecuación al público real. Para trabajos jurídicos, médicos u otros de alto riesgo, recurre a profesionales cualificados y sigue las normas locales.',
            'Este ejercicio no tiene una persona revisora ni destinatario reales. Registra la aprobación como BLOQUEADA y los comentarios como NO RECOPILADOS. Mantén privado el borrador: no enviar ni publicar. Un ejercicio comprobado no es una traducción certificada ni una garantía.'
          ],
          file: 'Entrega privada',
          code: `Fuente: M1-M4 ficticios | destino: español
Datos comprobados: 2030-06-14 | 14:00-15:00 UTC | sala B | 2030-06-12 | 20 plazas
Taller gratuito; materiales proporcionados
Aprobación: BLOQUEADA - no hay persona revisora real
Comentarios del público: NO RECOPILADOS
Estado: privado; no enviar ni publicar
Certificación: no declarada`,
          check: 'Tu entrega registra los datos comprobados, la aprobación BLOQUEADA y los comentarios NO RECOPILADOS, y mantiene privado el ejercicio.',
          aiPrompt: 'Revisa esta entrega ficticia para detectar controles ausentes. No inventes revisión, aprobación, comentarios, certificación ni permiso de publicación: [entrega].'
        }
      }
    }
  }
};
