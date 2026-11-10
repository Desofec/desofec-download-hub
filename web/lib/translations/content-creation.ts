import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const contentCreationTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'content-creation': {
    fr: {
      title: 'Créer une publication responsable avec l’IA',
      intro: 'Préparez une courte publication pour une boulangerie fictive, rédigez à votre façon et vérifiez les faits, les droits et l’accessibilité. Travaillez en privé ; l’IA est facultative.',
      steps: {
        'content-brief': {
          title: 'Choisir un public et un message',
          explanation: [
            'Entraînez-vous avec Cedar Bakery, une boulangerie fictive, et non un vrai client ou une annonce commerciale réelle. Données de l’exercice : ouverture du mardi au samedi, 08:00-14:00 ; pain et pâtisseries ; retrait au comptoir. Les prix, la livraison et les allergènes sont inconnus.',
            'Choisissez comme public des personnes du quartier qui préparent une visite, et faites des horaires votre message principal. Utilisez un document privé et ne transmettez ni données personnelles, ni fichiers clients, ni informations commerciales confidentielles dans les requêtes IA. Aucun outil payant n’est nécessaire.'
          ],
          file: 'Brief de contenu',
          code: 'Sujet d’entraînement : Cedar Bakery, boulangerie fictive\nPublic : personnes du quartier préparant une visite\nMessage : horaires d’ouverture\nDonnées de l’exercice : mardi-samedi, 08:00-14:00 ; pain et pâtisseries ; retrait au comptoir\nInconnus : prix, livraison, allergènes\nFormat : une courte publication\nProchaine étape : vérifier les horaires dans le brief de l’exercice\nPublication : entraînement privé uniquement',
          check: 'Votre brief précise un public et un message, sépare les données de l’exercice des inconnus et indique que la boulangerie est fictive.',
          aiPrompt: 'À partir de ce seul brief fictif, propose trois façons de transmettre son message. Liste séparément les informations manquantes. N’invente ni prix, ni livraison, ni informations sur les allergènes, ni avis clients : [brief].'
        },
        'content-draft': {
          title: 'Rédiger une courte publication à votre façon',
          explanation: [
            'Rédigez une publication de 40 à 60 mots vous-même ou demandez un brouillon à un assistant IA en lui fournissant uniquement les données de l’exercice. Ajoutez une prochaine étape claire et précisez que l’exemple est fictif. Gardez le brouillon privé.',
            'Lisez le brouillon à voix haute et modifiez-le pour qu’il sonne naturel. Les suggestions de l’IA ne sont pas des preuves : supprimez les offres, témoignages, garanties ou faits inventés. Notez ce que vous ne pouvez pas vérifier comme inconnu plutôt que de le deviner.'
          ],
          file: 'Brouillon de publication',
          code: 'Exemple d’entraînement fictif ; ne pas publier :\nCedar Bakery est une boulangerie fictive dans cet exercice. Elle ouvre du mardi au samedi, de 08:00 à 14:00, et propose du pain et des pâtisseries à retirer au comptoir. Vérifiez le brief de l’exercice avant de préparer une visite. Cet exemple ne décrit pas une entreprise réelle.\n\nVotre brouillon (40-60 mots) :\nUne prochaine étape :\nDétails non vérifiés à retirer ou à vérifier :',
          check: 'Votre brouillon privé compte 40 à 60 mots, propose une prochaine étape et ne contient ni faits ni témoignages inventés.',
          aiPrompt: 'Aide-moi à rédiger une publication de 40 à 60 mots à partir de ce brief fictif. Indique qu’il s’agit d’un exercice, utilise uniquement les données fournies, ajoute une prochaine étape et liste les inconnus séparément. N’invente ni affirmations ni témoignages : [brief].'
        },
        'content-visual': {
          title: 'Préparer un visuel accessible ou une courte vidéo',
          explanation: [
            'Créez un visuel textuel simple pour votre publication ou préparez une courte vidéo facultative. Un storyboard est un plan, pas un export vidéo terminé. Si vous préparez une vidéo, répartissez 30 secondes en trois scènes de 10 secondes chacune.',
            'Utilisez uniquement des contenus que vous avez créés ou pour lesquels vous disposez d’une autorisation et d’une licence adaptées. Notez la source, le propriétaire, l’usage autorisé et tout crédit requis ; demandez une autorisation avant d’utiliser l’image ou la voix d’une personne. Ajoutez un texte alternatif pertinent, un contraste lisible et, pour une vidéo, des sous-titres vérifiés et une transcription.'
          ],
          file: 'Fiche visuel et droits',
          code: 'Idée de visuel :\nTexte alternatif :\nRessource | source/propriétaire | autorisation ou licence | usage autorisé | crédit requis\nAutorisation non confirmée : À VÉRIFIER\n\nStoryboard vidéo facultatif (pas un export) :\n0-10 secondes | visuel | paroles\n10-20 secondes | visuel | paroles\n20-30 secondes | visuel | paroles\nPlan des sous-titres et de la transcription :',
          check: 'Votre visuel dispose d’un texte alternatif pertinent et d’un registre des droits ; tout plan vidéo comporte trois scènes de 10 secondes et un plan de sous-titres.',
          aiPrompt: 'Propose un visuel textuel accessible ou un storyboard de 30 secondes pour cette publication fictive. Utilise uniquement les faits et ressources fournis, signale les autorisations inconnues et n’imite aucune personne réelle : [publication et ressources].'
        },
        'content-check': {
          title: 'Vérifier les faits et corriger le brouillon',
          explanation: [
            'Comparez chaque affirmation factuelle au brief de l’exercice. Conservez les éléments justifiés, supprimez ceux qui sont faux et signalez les inconnus à vérifier. Le brief fictif ne confirme ni ouverture le dimanche, ni livraison, ni prix, ni allergènes.',
            'Vérifiez l’orthographe, la clarté et le contraste. Pour une vidéo, corrigez manuellement les sous-titres et vérifiez la transcription ; des sous-titres automatiques ne prouvent pas l’accessibilité. Si l’IA vous a aidé, relisez vous-même sa réponse et vérifiez les règles de divulgation actuelles du canal avant toute publication réelle.'
          ],
          file: 'Vérification des affirmations et de l’accessibilité',
          code: 'Affirmation | preuve | décision\nMardi-samedi, 08:00-14:00 | brief de l’exercice | CONSERVER\nOuvert le dimanche | contredit le brief | SUPPRIMER\nLivraison disponible | inconnue | SUPPRIMER OU VÉRIFIER\nInformations sur les allergènes | inconnues | NE PAS DEVINER\n\nOrthographe et clarté :\nContraste et texte alternatif du visuel :\nSi vidéo : sous-titres et transcription vérifiés :',
          check: 'Votre registre conserve les horaires justifiés, supprime l’ouverture dominicale et n’invente ni livraison ni informations sur les allergènes.',
          aiPrompt: 'Compare ce brouillon fictif au brief de l’exercice. Liste chaque affirmation, sa preuve fournie et la décision de conserver, supprimer ou vérifier. Ne devine pas les informations manquantes : [brief et brouillon].'
        },
        'content-review': {
          title: 'Consigner honnêtement la revue et les autorisations',
          explanation: [
            'Conservez ensemble votre brouillon corrigé, votre vérification des affirmations et votre registre des ressources. Si une personne volontaire relit votre travail, demandez un retour précis et notez uniquement ce qu’elle a réellement dit ; retirez les éléments permettant de l’identifier avant d’utiliser l’IA. N’envoyez pas l’exercice automatiquement.',
            'La boulangerie fictive n’a pas de vrai propriétaire pour autoriser la publication. Marquez son approbation comme BLOQUÉE, pas approuvée, et ne publiez pas l’exercice. Pour un projet réel, obtenez une autorisation réelle, vérifiez les droits et résolvez les affirmations en attente avant publication.'
          ],
          file: 'Journal de revue privé',
          code: 'Version du brouillon :\nFaits vérifiés par rapport au brief de l’exercice :\nDroits des ressources et accessibilité vérifiés :\nRetour reçu (uniquement s’il est réel et autorisé) :\nApprobation du propriétaire fictif : BLOQUÉE - aucun vrai propriétaire\nQuestions non résolues :\nStatut de l’exercice : privé ; ne pas publier',
          check: 'Votre journal ne contient que des retours réels, laisse l’approbation du propriétaire fictif bloquée et garde l’exercice privé.',
          aiPrompt: 'Vérifie cette liste d’entraînement anonymisée pour repérer les preuves ou autorisations manquantes. N’invente ni retour, ni approbation du propriétaire, ni publication : [liste].'
        },
        'content-next-steps': {
          title: 'Prévoir une suite honnête',
          explanation: [
            'Avant de publier une vraie publication, choisissez une mesure utile, par exemple le nombre de réponses authentiques, et ne notez la source et la date que lorsque des résultats réels existent. Une seule publication ne prouve pas qu’un changement a causé une vente et ne garantit pas une audience.',
            'Pour cet exercice fictif, il n’y a ni publication ni résultat d’une vraie audience : laissez les résultats NON RECUEILLIS. Gardez le brief, le brouillon, le plan visuel, la vérification des affirmations et le journal de revue comme dossier d’entraînement. Un projet réel est distinct et exige ses propres autorisations et sa propre revue.'
          ],
          file: 'Plan pour la suite',
          code: 'Dossier d’entraînement : brief | brouillon | plan visuel | vérification des affirmations | journal de revue\nPublication de l’exercice fictif : aucune\nMesure à envisager pour un projet réel :\nSource et date réelles : NON RECUEILLIES\nRésultat réel : NON RECUEILLI\nIncertitudes restantes :\nUne amélioration à essayer en privé :',
          check: 'Votre dossier d’entraînement est complet, les résultats non recueillis ne sont pas inventés et la publication fictive reste non publiée.',
          aiPrompt: 'Suggère une amélioration privée pour ce dossier d’entraînement. Sépare les preuves réelles des projets, n’invente pas de résultats et n’affirme pas qu’une publication a causé des ventes : [notes anonymisées].'
        }
      }
    },
    de: {
      title: 'Einen verantwortungsvollen Beitrag mit KI erstellen',
      intro: 'Plane einen kurzen Beitrag für eine fiktive Bäckerei, schreibe in deinem eigenen Stil und prüfe Fakten, Rechte und Barrierefreiheit. Übe privat; KI ist optional.',
      steps: {
        'content-brief': {
          title: 'Zielgruppe und eine Botschaft wählen',
          explanation: [
            'Übe mit Cedar Bakery, einer fiktiven Bäckerei, nicht mit einem echten Kunden oder einer tatsächlichen Geschäftsanzeige. Die Übungsfakten: Dienstag bis Samstag, 08:00-14:00 geöffnet; Brot und Gebäck; Abholung am Tresen. Preise, Lieferung und Allergeninformationen sind unbekannt.',
            'Wähle Menschen aus der Umgebung, die einen Besuch planen, als Zielgruppe und mache die Öffnungszeiten zu deiner Hauptbotschaft. Nutze ein privates Dokument und gib keine persönlichen Daten, Kundendaten oder vertraulichen Geschäftsinformationen in KI-Prompts ein. Kostenpflichtige Tools sind nicht erforderlich.'
          ],
          file: 'Content-Briefing',
          code: 'Übungsthema: fiktive Cedar Bakery\nZielgruppe: Menschen aus der Umgebung, die einen Besuch planen\nEine Botschaft: Öffnungszeiten\nÜbungsfakten: Dienstag-Samstag, 08:00-14:00; Brot und Gebäck; Abholung am Tresen\nUnbekannt: Preise, Lieferung, Allergene\nFormat: ein kurzer Beitrag\nNächster Schritt: Öffnungszeiten im Übungsbriefing prüfen\nVeröffentlichung: nur private Übung',
          check: 'Dein Briefing nennt eine Zielgruppe und eine Botschaft, trennt Übungsfakten von Unbekanntem und kennzeichnet die Bäckerei als fiktiv.',
          aiPrompt: 'Nutze nur dieses fiktive Briefing und schlage drei Möglichkeiten für seine Botschaft vor. Liste fehlende Fakten separat auf. Erfinde keine Preise, Lieferung, Allergeninformationen oder Kundenmeinungen: [Briefing].'
        },
        'content-draft': {
          title: 'Einen kurzen Beitrag in deinem eigenen Stil schreiben',
          explanation: [
            'Schreibe selbst einen Beitrag mit 40-60 Wörtern oder bitte einen KI-Assistenten um einen Entwurf ausschließlich anhand der Übungsfakten. Nenne einen klaren nächsten Schritt und kennzeichne das Beispiel ausdrücklich als fiktiv. Bewahre den Entwurf privat auf.',
            'Lies den Entwurf laut und überarbeite ihn, bis er natürlich klingt. KI-Vorschläge sind keine Belege: Entferne erfundene Angebote, Erfahrungsberichte, Garantien oder Fakten. Notiere nicht überprüfbare Angaben als unbekannt, statt zu raten.'
          ],
          file: 'Beitragsentwurf',
          code: 'Fiktives Übungsbeispiel; nicht veröffentlichen:\nCedar Bakery ist in dieser Übung eine fiktive Bäckerei. Sie ist Dienstag bis Samstag von 08:00 bis 14:00 geöffnet und bietet Brot und Gebäck zur Abholung am Tresen an. Prüfe das Übungsbriefing, bevor du einen Besuch planst. Dieses Beispiel beschreibt kein echtes Unternehmen.\n\nDein Entwurf (40-60 Wörter):\nEin nächster Schritt:\nUngeprüfte Angaben entfernen oder prüfen:',
          check: 'Dein privater Entwurf enthält 40-60 Wörter, einen nächsten Schritt und keine erfundenen Fakten oder Erfahrungsberichte.',
          aiPrompt: 'Hilf mir, einen Beitrag mit 40-60 Wörtern aus diesem fiktiven Briefing zu schreiben. Kennzeichne ihn als Übung, nutze nur die gelieferten Fakten, nenne einen nächsten Schritt und liste Unbekanntes separat auf. Erfinde keine Aussagen oder Erfahrungsberichte: [Briefing].'
        },
        'content-visual': {
          title: 'Ein barrierefreies Bild oder kurzes Video planen',
          explanation: [
            'Erstelle eine einfache Textgrafik für deinen Beitrag oder plane optional ein kurzes Video. Ein Storyboard ist ein Plan, kein fertig exportiertes Video. Teile ein geplantes Video von 30 Sekunden in drei Szenen zu je 10 Sekunden ein.',
            'Nutze nur selbst erstelltes Material oder Material mit Erlaubnis und passender Lizenz. Notiere Quelle, Rechteinhaber, erlaubte Nutzung und nötige Namensnennung; hole eine Erlaubnis ein, bevor du Bild oder Stimme einer Person verwendest. Ergänze aussagekräftigen Alternativtext, lesbaren Kontrast und bei Videos geprüfte Untertitel und ein Transkript.'
          ],
          file: 'Arbeitsblatt für Bild und Rechte',
          code: 'Bildidee:\nAlternativtext:\nMaterial | Quelle/Rechteinhaber | Erlaubnis oder Lizenz | erlaubte Nutzung | Namensnennung\nErlaubnis nicht bestätigt: ZU PRÜFEN\n\nOptionales Video-Storyboard (kein Export):\n0-10 Sekunden | Bild | Worte\n10-20 Sekunden | Bild | Worte\n20-30 Sekunden | Bild | Worte\nPlan für Untertitel und Transkript:',
          check: 'Dein Bild hat aussagekräftigen Alternativtext und einen Rechtenachweis; ein Video-Plan enthält drei Szenen zu je 10 Sekunden und einen Untertitelplan.',
          aiPrompt: 'Schlage eine barrierefreie Textgrafik oder ein 30-Sekunden-Storyboard für diesen fiktiven Beitrag vor. Nutze nur gelieferte Fakten und Materialien, markiere unbekannte Erlaubnisse und imitiere keine reale Person: [Beitrag und Materialliste].'
        },
        'content-check': {
          title: 'Fakten prüfen und den Entwurf überarbeiten',
          explanation: [
            'Vergleiche jede Tatsachenbehauptung mit dem Übungsbriefing. Behalte belegte Angaben, entferne falsche und markiere Unbekanntes zur Prüfung. Das fiktive Briefing belegt weder Sonntagsöffnung noch Lieferung, Preise oder Allergene.',
            'Prüfe Rechtschreibung, verständliche Sprache und lesbaren Kontrast. Korrigiere bei Videos die Untertitel von Hand und prüfe das Transkript; automatische Untertitel beweisen keine Barrierefreiheit. Prüfe KI-Ausgaben selbst und vor einer echten Veröffentlichung die aktuellen Kennzeichnungsregeln der Plattform.'
          ],
          file: 'Aussagen- und Barrierefreiheitsprüfung',
          code: 'Aussage | Beleg | Entscheidung\nDienstag-Samstag, 08:00-14:00 | Übungsbriefing | BEHALTEN\nSonntags geöffnet | widerspricht dem Briefing | ENTFERNEN\nLieferung verfügbar | unbekannt | ENTFERNEN ODER PRÜFEN\nAllergeninformationen | unbekannt | NICHT RATEN\n\nRechtschreibung und Klarheit:\nBildkontrast und Alternativtext:\nBei Video: Untertitel und Transkript geprüft:',
          check: 'Dein Aussagenregister behält die belegten Öffnungszeiten, entfernt die Sonntagsöffnung und erfindet weder Lieferung noch Allergeninformationen.',
          aiPrompt: 'Vergleiche diesen fiktiven Entwurf mit dem Übungsbriefing. Liste jede Aussage, ihren gelieferten Beleg und die Entscheidung behalten, entfernen oder prüfen auf. Rate fehlende Angaben nicht: [Briefing und Entwurf].'
        },
        'content-review': {
          title: 'Prüfung und Erlaubnisse ehrlich dokumentieren',
          explanation: [
            'Bewahre den überarbeiteten Entwurf, die Aussagenprüfung und den Materialnachweis zusammen auf. Wenn eine einwilligende Person deine Arbeit prüft, bitte um konkretes Feedback und notiere nur tatsächlich Gesagtes; entferne identifizierende Angaben vor der KI-Nutzung. Sende die Übung nicht automatisch.',
            'Die fiktive Bäckerei hat keinen echten Inhaber, der eine Veröffentlichung freigeben kann. Kennzeichne dessen Freigabe als BLOCKIERT, nicht als erteilt, und veröffentliche die Übung nicht. Hole für ein echtes Projekt eine tatsächliche Erlaubnis ein, prüfe Rechte und kläre offene Aussagen vor der Veröffentlichung.'
          ],
          file: 'Privates Prüfprotokoll',
          code: 'Entwurfsversion:\nFakten anhand des Übungsbriefings geprüft:\nMaterialrechte und Barrierefreiheit geprüft:\nErhaltenes Feedback (nur tatsächlich und mit Erlaubnis):\nFreigabe des fiktiven Inhabers: BLOCKIERT - kein echter Inhaber\nOffene Punkte:\nÜbungsstatus: privat; nicht veröffentlichen',
          check: 'Dein Protokoll enthält nur tatsächliches Feedback, lässt die Freigabe des fiktiven Inhabers blockiert und hält die Übung privat.',
          aiPrompt: 'Prüfe diese anonymisierte Übungsliste auf fehlende Belege oder Erlaubnisse. Erfinde kein Feedback, keine Inhaberfreigabe und keine Veröffentlichung: [Liste].'
        },
        'content-next-steps': {
          title: 'Einen ehrlichen nächsten Schritt planen',
          explanation: [
            'Wähle vor einer echten Veröffentlichung eine hilfreiche Messgröße, etwa die Anzahl echter Antworten, und notiere Quelle und Datum erst, wenn tatsächliche Ergebnisse vorliegen. Ein einzelner Beitrag beweist nicht, dass eine Änderung einen Verkauf verursacht hat, und garantiert keine Reichweite.',
            'Für diese fiktive Übung gibt es keine Veröffentlichung und keine echten Publikumsergebnisse: Belasse die Ergebnisse bei NICHT ERHOBEN. Bewahre Briefing, Entwurf, Bildplan, Aussagenprüfung und Prüfprotokoll als Übungspaket auf. Ein echtes Projekt ist getrennt und benötigt eigene Erlaubnisse und Prüfungen.'
          ],
          file: 'Plan für nächste Schritte',
          code: 'Übungspaket: Briefing | Entwurf | Bildplan | Aussagenprüfung | Prüfprotokoll\nVeröffentlichung der fiktiven Übung: keine\nMögliche Messgröße für ein echtes Projekt:\nTatsächliche Quelle und Datum: NICHT ERHOBEN\nTatsächliches Ergebnis: NICHT ERHOBEN\nWas bleibt ungewiss:\nEine Verbesserung privat ausprobieren:',
          check: 'Dein Übungspaket ist vollständig, nicht erhobene Ergebnisse werden nicht erfunden und der fiktive Beitrag bleibt unveröffentlicht.',
          aiPrompt: 'Schlage eine private Verbesserung für dieses Übungspaket vor. Trenne tatsächliche Belege von Plänen, erfinde keine Ergebnisse und behaupte nicht, ein Beitrag habe Verkäufe verursacht: [anonymisierte Notizen].'
        }
      }
    },
    es: {
      title: 'Crear una publicación responsable con IA',
      intro: 'Planifica una publicación breve para una panadería ficticia, redacta con tu propia voz y revisa datos, derechos y accesibilidad. Practica en privado; la IA es opcional.',
      steps: {
        'content-brief': {
          title: 'Elegir un público y un mensaje',
          explanation: [
            'Practica con Cedar Bakery, una panadería ficticia, no un cliente ni un anuncio comercial real. Datos del ejercicio: abre de martes a sábado, 08:00-14:00; pan y pasteles; recogida en mostrador. Los precios, la entrega y los alérgenos son desconocidos.',
            'Elige como público a personas de la zona que preparan una visita y usa el horario como mensaje principal. Trabaja en un documento privado y no incluyas datos personales, registros de clientes ni información comercial confidencial en instrucciones para la IA. No necesitas herramientas de pago.'
          ],
          file: 'Brief de contenido',
          code: 'Tema de práctica: Cedar Bakery ficticia\nPúblico: personas de la zona que preparan una visita\nUn mensaje: horario de apertura\nDatos del ejercicio: martes-sábado, 08:00-14:00; pan y pasteles; recogida en mostrador\nDesconocidos: precios, entrega, alérgenos\nFormato: una publicación breve\nSiguiente paso: comprobar el horario en el brief del ejercicio\nPublicación: solo práctica privada',
          check: 'Tu brief identifica un público y un mensaje, separa los datos del ejercicio de los desconocidos y señala que la panadería es ficticia.',
          aiPrompt: 'Usa solo este brief ficticio para sugerir tres formas de comunicar su mensaje. Enumera aparte los datos que faltan. No inventes precios, entrega, información sobre alérgenos ni opiniones de clientes: [brief].'
        },
        'content-draft': {
          title: 'Redactar una publicación breve con tu propia voz',
          explanation: [
            'Escribe una publicación de 40 a 60 palabras a mano o pide un borrador a un asistente de IA usando solo los datos del ejercicio. Incluye un siguiente paso claro e indica que el ejemplo es ficticio. Mantén el borrador privado.',
            'Lee el borrador en voz alta y edítalo para que suene natural. Las sugerencias de la IA no son pruebas: elimina ofertas, testimonios, garantías o datos inventados. Anota como desconocido lo que no puedas verificar en vez de adivinar.'
          ],
          file: 'Borrador de publicación',
          code: 'Ejemplo de práctica ficticio; no publicar:\nCedar Bakery es una panadería ficticia en este ejercicio. Abre de martes a sábado, de 08:00 a 14:00, y ofrece pan y pasteles para recoger en mostrador. Consulta el brief del ejercicio antes de planificar una visita. Este ejemplo no describe un negocio real.\n\nTu borrador (40-60 palabras):\nUn siguiente paso:\nDatos no verificados que hay que eliminar o comprobar:',
          check: 'Tu borrador privado tiene de 40 a 60 palabras, un siguiente paso y ningún dato ni testimonio inventado.',
          aiPrompt: 'Ayúdame a redactar una publicación de 40 a 60 palabras a partir de este brief ficticio. Indica que es práctica, usa solo los datos facilitados, incluye un siguiente paso y enumera los desconocidos aparte. No inventes afirmaciones ni testimonios: [brief].'
        },
        'content-visual': {
          title: 'Planificar una imagen accesible o un vídeo breve',
          explanation: [
            'Crea una imagen sencilla basada en texto para la publicación o planifica un vídeo breve opcional. Un storyboard es un plan, no un vídeo exportado y terminado. Si planificas un vídeo, divide 30 segundos en tres escenas de 10 segundos cada una.',
            'Usa solo materiales que hayas creado o para los que tengas permiso y una licencia adecuada. Anota fuente, propietario, uso permitido y créditos necesarios; pide permiso antes de usar la imagen o la voz de una persona. Añade texto alternativo descriptivo, contraste legible y, para vídeo, subtítulos revisados y una transcripción.'
          ],
          file: 'Ficha de imagen y derechos',
          code: 'Idea visual:\nTexto alternativo:\nMaterial | fuente/propietario | permiso o licencia | uso permitido | crédito necesario\nPermiso no confirmado: POR REVISAR\n\nStoryboard de vídeo opcional (no es un archivo exportado):\n0-10 segundos | imagen | palabras\n10-20 segundos | imagen | palabras\n20-30 segundos | imagen | palabras\nPlan de subtítulos y transcripción:',
          check: 'Tu imagen tiene texto alternativo descriptivo y un registro de derechos; cualquier plan de vídeo incluye tres escenas de 10 segundos y un plan de subtítulos.',
          aiPrompt: 'Sugiere una imagen de texto accesible o un storyboard de 30 segundos para esta publicación ficticia. Usa solo los datos y materiales facilitados, señala permisos desconocidos y no imites a una persona real: [publicación y materiales].'
        },
        'content-check': {
          title: 'Verificar los datos y revisar el borrador',
          explanation: [
            'Compara cada afirmación factual con el brief del ejercicio. Conserva los datos respaldados, elimina los falsos y marca los desconocidos para verificarlos. El brief ficticio no confirma apertura los domingos, entrega, precios ni alérgenos.',
            'Revisa ortografía, lenguaje claro y contraste legible. En un vídeo, corrige manualmente los subtítulos y comprueba la transcripción; los subtítulos automáticos no prueban la accesibilidad. Si usaste IA, revisa tú mismo el resultado y comprueba las normas actuales de divulgación del canal antes de cualquier publicación real.'
          ],
          file: 'Revisión de afirmaciones y accesibilidad',
          code: 'Afirmación | prueba | decisión\nMartes-sábado, 08:00-14:00 | brief del ejercicio | CONSERVAR\nAbre el domingo | contradice el brief | ELIMINAR\nEntrega disponible | desconocida | ELIMINAR O VERIFICAR\nInformación sobre alérgenos | desconocida | NO ADIVINAR\n\nOrtografía y claridad:\nContraste de la imagen y texto alternativo:\nSi hay vídeo: subtítulos y transcripción revisados:',
          check: 'Tu registro conserva el horario respaldado, elimina la apertura dominical y no inventa información sobre entrega ni alérgenos.',
          aiPrompt: 'Compara este borrador ficticio con el brief del ejercicio. Enumera cada afirmación, su prueba facilitada y si hay que conservarla, eliminarla o verificarla. No adivines datos ausentes: [brief y borrador].'
        },
        'content-review': {
          title: 'Registrar revisión y permisos con honestidad',
          explanation: [
            'Guarda juntos el borrador revisado, la comprobación de afirmaciones y el registro de materiales. Si una persona que acepta revisa tu trabajo, pide comentarios concretos y anota solo lo que realmente diga; elimina datos identificativos antes de usar IA. No envíes el ejercicio automáticamente.',
            'La panadería ficticia no tiene un propietario real que autorice la publicación. Registra la aprobación como BLOQUEADA, no aprobada, y no publiques el ejercicio. En un proyecto real, consigue autorización auténtica, verifica los derechos y resuelve las afirmaciones pendientes antes de publicar.'
          ],
          file: 'Registro de revisión privado',
          code: 'Versión del borrador:\nDatos revisados frente al brief del ejercicio:\nDerechos de materiales y accesibilidad revisados:\nComentarios recibidos (solo si son reales y autorizados):\nAprobación del propietario ficticio: BLOQUEADA - no hay propietario real\nCuestiones pendientes:\nEstado del ejercicio: privado; no publicar',
          check: 'Tu registro contiene solo comentarios reales, mantiene bloqueada la aprobación del propietario ficticio y conserva el ejercicio en privado.',
          aiPrompt: 'Revisa esta lista de práctica anonimizada para detectar pruebas o permisos que faltan. No inventes comentarios, aprobación del propietario ni publicación: [lista].'
        },
        'content-next-steps': {
          title: 'Planificar un siguiente paso honesto',
          explanation: [
            'Antes de publicar una publicación real, elige una medida útil, como el número de respuestas auténticas, y anota la fuente y la fecha solo cuando haya resultados reales. Una sola publicación no demuestra que un cambio haya causado una venta ni garantiza alcance.',
            'En este ejercicio ficticio no hay publicación ni resultados de una audiencia real: deja los resultados como NO RECOPILADOS. Conserva el brief, el borrador, el plan visual, la revisión de afirmaciones y el registro de revisión como paquete de práctica. Un proyecto real es independiente y necesita sus propios permisos y revisión.'
          ],
          file: 'Plan del siguiente paso',
          code: 'Paquete de práctica: brief | borrador | plan visual | revisión de afirmaciones | registro de revisión\nPublicación del ejercicio ficticio: ninguna\nMedida que considerar para un proyecto real:\nFuente y fecha reales: NO RECOPILADAS\nResultado real: NO RECOPILADO\nQué sigue siendo incierto:\nUna mejora para probar en privado:',
          check: 'Tu paquete de práctica está completo, los resultados no recopilados no se inventan y la publicación ficticia permanece sin publicar.',
          aiPrompt: 'Sugiere una mejora privada para este paquete de práctica. Separa las pruebas reales de los planes, no inventes resultados y no afirmes que una publicación causó ventas: [notas anonimizadas].'
        }
      }
    }
  }
};
