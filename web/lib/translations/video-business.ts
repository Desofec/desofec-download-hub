import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const videoBusinessTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-video-business': {
    fr: {
      title: 'Créer des vidéos courtes avec l’IA pour une entreprise',
      intro: 'Créez trois vidéos professionnelles de 15 à 30 secondes avec scripts, storyboards, sous-titres corrigés et registre des autorisations. Suivez six leçons jusqu’à un projet privé de pratique, une proposition, des contrôles de preuves et une transmission. Prévoyez deux heures pour la planification ; le montage et les retours demandent du temps supplémentaire. La génération par IA est facultative.',
      steps: {
        'video-business-brief': {
          title: 'Planifier des vidéos professionnelles courtes',
          explanation: [
            'Créez un dossier d’exercice pour Cedar Bakery, une entreprise fictive : trois vidéos verticales sur la visite, le pain et les pâtisseries, puis le retrait au comptoir. Chaque vidéo terminée doit durer de 15 à 30 secondes et mesurer 1080 x 1920 pixels (9:16). Ce sont des exigences de l’exercice, pas des règles universelles des plateformes sociales.',
            'Utilisez uniquement les faits fictifs fournis. Les prix, la livraison, les allergènes et les résultats commerciaux sont inconnus. Aucun vrai client, aucune publication automatique ni IA payante n’est nécessaire. Choisissez un éditeur accessible ; des diapositives textuelles originales peuvent constituer une vidéo valable. Un storyboard seul n’est pas une vidéo terminée.'
          ],
          file: 'Brief vidéo',
          code: 'PRATIQUE FICTIVE - NON APPROUVÉE POUR PUBLICATION\nCedar Bakery : mardi-samedi, 08:00-14:00 ; pain et pâtisseries ; retrait au comptoir\nInconnus : prix, livraison, allergènes, résultats des ventes\nVidéos : visit / products / collection\nChaque export : 15-30 secondes incluses ; 1080 x 1920 ; 9:16\nInclus : scripts, storyboards, sous-titres, trois exports, un cycle de révision\nExclus : publication, publicités, vues ou ventes garanties, clonage de voix et de ressemblance',
          check: 'Votre brief nomme les trois vidéos, la durée et la résolution, les faits étayés, les inconnues et la personne chargée de la revue.',
          aiPrompt: 'Planifie trois vidéos courtes distinctes à partir de ce brief fictif uniquement. Sépare les faits des inconnues. N’invente ni prix, ni témoignage, ni vente, ni approbation : [brief].'
        },
        'video-business-scripts': {
          title: 'Écrire des scripts et storyboards vidéo avec l’IA',
          explanation: [
            'Donnez à chaque vidéo un message et une prochaine étape. Utilisez un plan de trois scènes sur 20 secondes : ouverture 0-4 secondes, message principal 4-14, prochaine étape 14-20. Rédigez vous-même ou utilisez facultativement un assistant IA. Lisez la narration à voix haute et mesurez sa durée réelle ; le nombre de mots ne suffit pas à établir la durée.',
            'Ajoutez une liste des éléments visuels au storyboard. Utilisez des graphiques originaux ou des ressources autorisées. Une image de boulangerie générée par IA est une illustration, pas une photo d’une vraie entreprise ou de ses produits. N’imitez pas une personne identifiable, n’inventez pas de témoignages clients et ne clonez pas de voix.'
          ],
          file: 'Feuille de script et storyboard',
          code: 'Vidéo 1 - Visit (plan de 20 secondes)\n0-4 : Une visite à la boulangerie en vue ? | carton-titre original\n4-14 : Cedar Bakery fictive est ouverte du mardi au samedi, 08:00-14:00. | horaires lisibles\n14-20 : Vérifiez les horaires avant votre visite. | carton de prochaine étape\n\nVidéo 2 : pain et pâtisseries ; aucune affirmation sur les prix ou les régimes\nVidéo 3 : retrait au comptoir ; aucune promesse de livraison\nPour chaque vidéo : durée de scène / narration ou texte à l’écran / ressource / sous-titres\nDurée réelle de lecture à voix haute : mesurer, ne pas deviner\nMention : pratique fictive ; identifier toute illustration générée par IA',
          check: 'Vous avez trois scripts distincts avec des scènes minutées et une liste des affirmations et ressources ; aucun détail commercial inconnu n’est transformé en fait.',
          aiPrompt: 'Rédige trois scripts de 20 secondes avec scènes minutées, texte à l’écran et sous-titres. Utilise uniquement les faits fournis ; identifie les visuels générés comme des illustrations. La durée doit être vérifiée par moi : [brief].'
        },
        'video-business-edit': {
          title: 'Monter des vidéos assistées par IA et leurs sous-titres',
          explanation: [
            'Dans l’éditeur choisi, créez un projet vertical de 1080 x 1920. Réalisez les trois vidéos à partir du storyboard avec des diapositives originales, des séquences autorisées ou des clips générés facultatifs. Vérifiez les conditions actuelles d’exportation, de filigrane, de crédits et d’usage commercial avant de payer. Ne supposez jamais qu’une offre gratuite permet un export particulier.',
            'Corrigez les sous-titres automatiques mot à mot à partir de la narration réelle, y compris les noms et horaires. Gardez le texte essentiel lisible et à l’écart des éléments d’interface ; prévisualisez sur un téléphone. Regardez sans son et vérifiez qu’un texte reprend tout contenu audio important. Pour des diapositives silencieuses, indiquez qu’il n’y a pas de narration et vérifiez le message intégral à l’écran.'
          ],
          file: 'Registre de montage et de sous-titrage',
          code: 'Vidéo / éditeur et version / méthode : diapositives, séquences ou assistance IA\nDimensions de la timeline : 1080 x 1920\nDurée / résolution réelles de l’export :\nCorrection des sous-titres / narration source / horodatage :\nVersion silencieuse : sans narration ; texte complet lisible vérifié\nPrévisualisation téléphone / constat sans son / correction :\nDéfauts des ressources générées et autorisations manquantes :\nStoryboard seul : contrôles d’exportation BLOCKED, pas PASS',
          check: 'La durée mesurée et la résolution sont consignées pour chaque export réel ; les sous-titres ou tout le texte de la vidéo silencieuse sont vérifiés, pas seulement générés.',
          aiPrompt: 'Compare ce texte de sous-titres à mon script et signale les différences de formulation. Propose des corrections en langage simple sans prétendre avoir regardé ma vidéo externe : [script et sous-titres].'
        },
        'video-business-review': {
          title: 'Vérifier la qualité, les autorisations et les révisions vidéo',
          explanation: [
            'Regardez chaque fichier exporté du début à la fin. Vérifiez la durée de 15 à 30 secondes incluses et la résolution 1080 x 1920 ; ne vous fiez pas uniquement aux réglages de la timeline. Examinez le texte, la narration, les défauts visuels, les licences musicales, les attributions et toute information IA exigée par la plateforme visée. Il n’existe pas de règle universelle d’autorisation ou de déclaration.',
            'Conservez la version 1. Pour un cycle de révision contrôlé, avancez les horaires d’ouverture dans la vidéo Visit et améliorez la lisibilité des sous-titres. Tenez un journal des changements, puis rouvrez tous les exports de la version 2 et répétez les contrôles. Une demande fictive d’ajout de prix reste en attente jusqu’à ce qu’une source réelle autorisée le fournisse ; l’exercice ne fournit aucun prix.'
          ],
          file: 'Registre des versions et des autorisations',
          code: 'Ressource / créateur / source / usage autorisé / attribution / date de vérification\nAucune preuve d’autorisation : remplacer par une création originale ou BLOCK\nVersion / demande / changement / contrôle répété / écart restant\nv1 -> v2 : horaires avancés ; sous-titres plus lisibles ; revérifier durée et faits\nEn attente : ajouter un prix - inconnu, ne pas inclure\nExports : rouvrir les trois fichiers v2 ; mesurer chacun\nApprobation réelle du propriétaire : indisponible dans cet exercice fictif, BLOCKED',
          check: 'Votre registre conserve les deux versions, rejette le prix inconnu et consigne les contrôles réels des exports et les autorisations manquantes.',
          aiPrompt: 'Vérifie ce registre des affirmations vidéo et des autorisations par rapport au brief fictif. Signale les lacunes sans inventer de licences, de règles de plateforme ou d’approbation du propriétaire : [registre].'
        },
        'video-business-offer': {
          title: 'Définir et chiffrer un service vidéo professionnel',
          explanation: [
            'Utilisez le générateur de proposition de projet pour trois vidéos, les scripts, les sous-titres, les formats convenus et un cycle de révision. Précisez la personne chargée de la revue, le calendrier, les autorisations des ressources et le traitement des données. Excluez la publication, la gestion publicitaire, les révisions illimitées et les garanties de vues ou de ventes. Un parcours d’apprentissage ne prouve pas que des clients paieront.',
            'Consignez séparément le temps réel et les crédits fournisseurs du tarif proposé. Exemple de planification interne uniquement : 1 h de brief + 2 de scripts/montage + 1 de contrôles + 1 de révision/transmission = 5 heures ; à 20 EUR/h, cela fait 100 EUR avant outils, taxes et frais généraux. Ce n’est ni un tarif du marché, ni un prix recommandé, ni un bénéfice. Les coûts inconnus restent inconnus.'
          ],
          file: 'Offre de service vidéo',
          code: 'Inclus : trois vidéos de 15-30 secondes en 1080 x 1920, scripts, sous-titres, une révision\nExclus : publication, publicités, garanties, ressources sans licence, clonage de voix\nRéviseur / calendrier / formats / déclaration IA et ressources :\nDonnées : fictives uniquement ; aucune information confidentielle ou personnelle dans les prompts IA\nExemple interne : (1 + 2 + 1 + 1) x EUR 20 = EUR 100\nTemps réel / crédits fournisseurs / licences / taxes / frais généraux :\nTarif proposé : distinct et non validé\nPublication : uniquement après les autorisations et permissions réelles requises',
          check: 'Votre proposition distingue livrables, coûts internes et tarif proposé, avec des limites de revue, de calendrier et de données.',
          aiPrompt: 'Examine cette offre de service vidéo : périmètre, limites de révision, calcul et promesses non étayées. N’invente ni demande, ni prix, ni revenus : [offre].'
        },
        'video-business-handover': {
          title: 'Préparer une transmission privée du service vidéo',
          explanation: [
            'Conservez les scripts, textes de sous-titres, exports versionnés, brief, registre des autorisations et journal des changements dans votre propre stockage. Enregistrez les dossiers texte dans le classeur privé du projet ; Desofec ne téléverse, ne rend, ne génère ni n’inspecte les fichiers vidéo. Ne mettez pas d’identifiants ni de documents clients confidentiels dans ces dossiers.',
            'Rechargez le brouillon des résultats du projet et chargez explicitement les sept plans de test VIDEO. Enregistrez des preuves réelles et des résultats honnêtes. Un dossier contenant uniquement des storyboards ne peut pas réussir les contrôles d’exportation ; l’absence d’approbation réelle du propriétaire reste bloquée. Examinez le texte enregistré dans le centre de revue, consignez une décision et téléchargez un portfolio privé de pratique uniquement après l’avoir vérifié. Continuer signifie s’entraîner ou faire une découverte, pas obtenir l’autorisation de publier.'
          ],
          file: 'Liste de contrôle de transmission vidéo',
          code: '01-brief-fictif\n02-scripts-storyboards-sous-titres\n03-exports-v1-et-v2 (ou storyboard seul explicitement indiqué)\n04-ressources-autorisations-et-déclaration\n05-journal-des-révisions\n06-contrôles-mesurés-et-questions-ouvertes\n\nVIDEO-1 faits ; VIDEO-2 exports ; VIDEO-3 sous-titres ; VIDEO-4 autorisations\nVIDEO-5 révisions ; VIDEO-6 coûts et limites ; VIDEO-7 approbation du propriétaire\nDécision : continuer la pratique / réviser / arrêter\nLa pratique fictive n’est ni un travail client vérifié ni une autorisation de publier.',
          check: 'Votre transmission distingue les vidéos réelles des plans, conserve les contrôles non résolus et n’invente jamais l’approbation du propriétaire.',
          aiPrompt: 'Vérifie cette transmission privée de pratique : scripts, sous-titres, versions, preuves d’autorisation et approbation bloquée manquants. Ne prétends pas inspecter des fichiers externes : [liste].'
        }
      }
    },
    de: {
      title: 'Kurze Geschäftsvideos mit KI erstellen',
      intro: 'Erstelle drei 15- bis 30-sekündige Geschäftsvideos mit Skripten, Storyboards, korrigierten Untertiteln und Berechtigungsnachweisen. Sechs Lektionen führen zu einem privaten Übungsprojekt, Angebot, Nachweisprüfungen und einer Übergabe. Plane zwei Stunden für die Vorbereitung ein; Schnitt und Feedback benötigen zusätzliche Zeit. KI-Generierung ist optional.',
      steps: {
        'video-business-brief': {
          title: 'Kurze Geschäftsvideos planen',
          explanation: [
            'Erstelle ein Übungspaket für die fiktive Cedar Bakery: drei Hochkantvideos über einen Besuch, Brot und Gebäck sowie Abholung am Tresen. Jedes fertige Video muss 15-30 Sekunden lang und 1080 x 1920 Pixel groß sein (9:16). Das sind Anforderungen dieser Übung, keine allgemeinen Regeln sozialer Plattformen.',
            'Verwende nur die vorgegebenen fiktiven Fakten. Preise, Lieferung, Allergene und Geschäftsergebnisse sind unbekannt. Es braucht keinen echten Kunden, keine automatische Veröffentlichung und keine kostenpflichtige KI. Wähle einen zugänglichen Editor; eigene Textfolien sind eine gültige Videoalternative. Ein Storyboard allein ist kein fertiges Video.'
          ],
          file: 'Videobriefing',
          code: 'FIKTIVE ÜBUNG - NICHT ZUR VERÖFFENTLICHUNG FREIGEGEBEN\nCedar Bakery: Dienstag-Samstag, 08:00-14:00; Brot und Gebäck; Abholung am Tresen\nUnbekannt: Preise, Lieferung, Allergene, Verkaufsergebnisse\nVideos: visit / products / collection\nJeder Export: 15-30 Sekunden inklusive; 1080 x 1920; 9:16\nEnthalten: Skripte, Storyboards, Untertitel, drei Exporte, eine Überarbeitungsrunde\nAusgeschlossen: Beiträge, Werbung, garantierte Aufrufe oder Verkäufe, Stimmen- und Personenimitation',
          check: 'Dein Briefing nennt alle drei Videos, Dauer und Auflösung, belegte Fakten, Unbekanntes und die prüfverantwortliche Person.',
          aiPrompt: 'Plane drei unterschiedliche Kurzvideos ausschließlich anhand dieses fiktiven Briefings. Trenne Fakten von Unbekanntem. Erfinde keine Preise, Erfahrungsberichte, Verkäufe oder Freigaben: [Briefing].'
        },
        'video-business-scripts': {
          title: 'KI-Videoskripte und Storyboards schreiben',
          explanation: [
            'Gib jedem Video eine Botschaft und einen nächsten Schritt. Nutze einen Drei-Szenen-Plan von 20 Sekunden: Einstieg 0-4 Sekunden, Hauptbotschaft 4-14, nächster Schritt 14-20. Schreibe selbst oder nutze optional eine KI. Lies den Sprechertext laut und miss die tatsächliche Dauer; die Wortzahl allein belegt keine Laufzeit.',
            'Führe neben dem Storyboard eine Materialliste. Verwende eigene Grafiken oder ausdrücklich erlaubte Materialien. Ein KI-generiertes Bäckereibild ist eine Illustration, kein Foto eines echten Betriebs oder seiner Produkte. Imitiere keine identifizierbaren Personen, erfinde keine Kundenempfehlungen und klone keine Stimme.'
          ],
          file: 'Skript- und Storyboard-Arbeitsblatt',
          code: 'Video 1 - Visit (20-Sekunden-Plan)\n0-4: Planst du einen Bäckereibesuch? | eigene Titelkarte\n4-14: Die fiktive Cedar Bakery ist Dienstag-Samstag, 08:00-14:00 geöffnet. | lesbare Öffnungszeiten\n14-20: Prüfe vor deinem Besuch die Öffnungszeiten. | Karte mit nächstem Schritt\n\nVideo 2: Brot und Gebäck; keine Aussagen zu Preis oder Ernährung\nVideo 3: Abholung am Tresen; keine Lieferzusage\nJe Video: Szenendauer / Sprechertext oder Bildschirmtext / Material / Untertitel\nTatsächliche Vorlesedauer: messen, nicht schätzen\nKennzeichnung: fiktive Übung; KI-generierte Illustrationen benennen',
          check: 'Du hast drei unterschiedliche Skripte mit zeitlich geplanten Szenen und einer Liste zu Aussagen und Materialien; Unbekanntes wird nicht als Tatsache dargestellt.',
          aiPrompt: 'Entwirf drei 20-Sekunden-Skripte mit zeitlich geplanten Szenen, Bildschirmtext und Untertiteln. Verwende nur die vorgegebenen Fakten; kennzeichne generierte Bilder als Illustrationen. Ich prüfe die Laufzeit selbst: [Briefing].'
        },
        'video-business-edit': {
          title: 'KI-unterstützte Videos schneiden und untertiteln',
          explanation: [
            'Erstelle im gewählten Editor ein Hochkantprojekt in 1080 x 1920. Setze die drei Videos anhand des Storyboards mit eigenen Folien, lizenziertem Material oder optional generierten Clips um. Prüfe vor dem Bezahlen die aktuellen Bedingungen für Export, Wasserzeichen, Credits und kommerzielle Nutzung. Gehe nie davon aus, dass ein kostenloser Tarif einen bestimmten Export erlaubt.',
            'Korrigiere automatische Untertitel Wort für Wort anhand der tatsächlichen Sprache, auch Namen und Öffnungszeiten. Halte wichtige Texte lesbar und außerhalb von Bedienelementen; prüfe die Vorschau auf einem Smartphone. Sieh das Video ohne Ton an und prüfe eine Textalternative für wichtige Audioinhalte. Bei stillen Textfolien notiere keine Sprache und prüfe die vollständige Bildschirmbotschaft.'
          ],
          file: 'Schnitt- und Untertitelprotokoll',
          code: 'Video / Editor und Version / Methode: Folien, Material oder KI-unterstützt\nTimeline-Größe: 1080 x 1920\nTatsächliche Exportdauer / Auflösung:\nUntertitelkorrektur / Originalsprechertext / Zeitstempel:\nStumme Version: keine Sprache; vollständigen lesbaren Text geprüft\nSmartphone-Vorschau / Beobachtung ohne Ton / Korrektur:\nFehler generierter Materialien und fehlende Berechtigungen:\nNur Storyboard: Exportprüfungen BLOCKED, nicht PASS',
          check: 'Für jeden tatsächlichen Export sind gemessene Dauer und Auflösung erfasst; Untertitel oder der vollständige Text des stummen Videos wurden geprüft und nicht nur generiert.',
          aiPrompt: 'Vergleiche diesen Untertiteltext mit meinem Skript und markiere Formulierungsabweichungen. Schlage verständliche Korrekturen vor, ohne zu behaupten, mein externes Video angesehen zu haben: [Skript und Untertitel].'
        },
        'video-business-review': {
          title: 'Videoqualität, Berechtigungen und Überarbeitungen prüfen',
          explanation: [
            'Sieh jede exportierte Datei vollständig an. Prüfe jeweils 15-30 Sekunden inklusive und 1080 x 1920; verlasse dich nicht nur auf Timeline-Einstellungen. Prüfe Text, Sprache, Bildfehler, Musiklizenzen, Namensnennung und erforderliche KI-Hinweise der geplanten Plattform. Es gibt keine allgemeingültige Berechtigungs- oder Offenlegungsregel.',
            'Bewahre Version 1 auf. Verschiebe in einer kontrollierten Überarbeitung die Öffnungszeiten im Video Visit nach vorn und verbessere die Untertitel-Lesbarkeit. Führe ein Änderungsprotokoll, öffne alle Exporte von Version 2 erneut und wiederhole die Prüfungen. Eine fiktive Bitte um einen Preis bleibt offen, bis eine echte autorisierte Quelle ihn bestätigt; in der Übung ist kein Preis angegeben.'
          ],
          file: 'Versions- und Berechtigungsprotokoll',
          code: 'Material / Ersteller / Quelle / zulässige Nutzung / Namensnennung / Prüfdatum\nKein Berechtigungsnachweis: durch eigene Arbeit ersetzen oder BLOCK\nVersion / Anfrage / Änderung / erneute Prüfung / offene Lücke\nv1 -> v2: Öffnungszeiten nach vorn; Untertitel besser lesbar; Dauer und Fakten erneut prüfen\nOffen: Preis ergänzen - unbekannt, nicht aufnehmen\nExporte: alle drei v2-Dateien erneut öffnen und messen\nEchte Eigentümerfreigabe: in der fiktiven Übung nicht verfügbar, BLOCKED',
          check: 'Dein Protokoll erhält beide Versionen, weist den unbekannten Preis zurück und erfasst tatsächliche Exportprüfungen sowie fehlende Berechtigungsnachweise.',
          aiPrompt: 'Prüfe dieses Videoaussagen- und Berechtigungsprotokoll anhand des fiktiven Briefings. Nenne Lücken, ohne Lizenzen, Plattformregeln oder eine Eigentümerfreigabe zu erfinden: [Protokoll].'
        },
        'video-business-offer': {
          title: 'Ein Geschäftsvideo-Angebot abgrenzen und kalkulieren',
          explanation: [
            'Nutze den Projektangebots-Assistenten für drei Videos, Skripte, Untertitel, vereinbarte Dateiformate und eine Überarbeitungsrunde. Nenne prüfverantwortliche Person, Zeitplan, Materialrechte und Datenverarbeitung. Schließe Veröffentlichung, Anzeigenverwaltung, unbegrenzte Änderungen und garantierte Aufrufe oder Verkäufe aus. Ein Lernpaket ist kein Beleg dafür, dass Kunden zahlen werden.',
            'Erfasse tatsächliche Arbeitszeit und Anbieterkosten getrennt vom vorgeschlagenen Honorar. Nur eine interne Planungsillustration: 1 Stunde Briefing + 2 Skripte/Schnitt + 1 Prüfung + 1 Überarbeitung/Übergabe = 5 Stunden; bei EUR 20/Stunde sind das EUR 100 vor Werkzeugkosten, Steuern und Gemeinkosten. Das ist weder Marktpreis noch Preisempfehlung oder Gewinn. Unbekannte Kosten bleiben unbekannt.'
          ],
          file: 'Video-Serviceangebot',
          code: 'Enthalten: drei 15-30 Sekunden lange Videos in 1080 x 1920, Skripte, Untertitel, eine Überarbeitung\nAusgeschlossen: Veröffentlichung, Anzeigen, Garantien, unlizenzierte Materialien, Stimmenklonen\nPrüfer / Zeitplan / Formate / KI- und Materialhinweise:\nDaten: nur fiktiv; keine vertraulichen Dateien oder persönlichen Angaben in KI-Prompts\nInternes Beispiel: (1 + 2 + 1 + 1) x EUR 20 = EUR 100\nTatsächliche Zeit / Anbieterkosten / Lizenzen / Steuern / Gemeinkosten:\nVorgeschlagenes Honorar: separat und nicht validiert\nVeröffentlichung: erst nach erforderlicher echter Freigabe und Berechtigungsprüfung',
          check: 'Dein Angebot trennt Lieferumfang, interne Kosten und Honorarvorschlag und nennt Prüfung, Zeitplan und Datengrenzen.',
          aiPrompt: 'Prüfe dieses Geschäftsvideo-Angebot auf Umfang, Überarbeitungslimits, Rechenweg und unbelegte Versprechen. Erfinde keine Nachfrage, Preise oder Einnahmen: [Angebot].'
        },
        'video-business-handover': {
          title: 'Eine private Übergabe für den Videodienst vorbereiten',
          explanation: [
            'Bewahre Skripte, Untertiteltexte, versionierte Exporte, Briefing, Berechtigungsprotokoll und Änderungslog im eigenen Speicher auf. Speichere Textnachweise im privaten Projektarbeitsbuch; Desofec lädt keine Videodateien hoch, rendert, generiert oder prüft sie. Füge keine Zugangsdaten oder vertraulichen Kundenunterlagen ein.',
            'Lade den Ergebnisentwurf des Projekts neu und lade ausdrücklich die sieben VIDEO-Testpläne. Erfasse tatsächliche Belege und ehrliche Ergebnisse. Ein Paket nur mit Storyboards kann Exportprüfungen nicht bestehen; fehlende echte Eigentümerfreigabe bleibt blockiert. Prüfe gespeicherten Text im Review Centre, erfasse eine Entscheidung und lade ein privates Übungsportfolio erst nach eigener Prüfung herunter. Fortfahren bedeutet weiteres Üben oder Nachfragen, nicht Veröffentlichungsgenehmigung.'
          ],
          file: 'Video-Übergabecheckliste',
          code: '01-fiktives-briefing\n02-skripte-storyboards-untertitel\n03-v1-und-v2-exporte (oder ausdrücklich nur Storyboard)\n04-materialien-berechtigungen-und-hinweise\n05-überarbeitungsprotokoll\n06-gemessene-prüfungen-und-offene-punkte\n\nVIDEO-1 Fakten; VIDEO-2 Exporte; VIDEO-3 Untertitel; VIDEO-4 Berechtigungen\nVIDEO-5 Überarbeitungen; VIDEO-6 Kosten und Grenzen; VIDEO-7 Eigentümerfreigabe\nEntscheidung: weiter üben / überarbeiten / stoppen\nFiktive Übung ist weder geprüfte Kundenarbeit noch eine Veröffentlichungserlaubnis.',
          check: 'Deine Übergabe unterscheidet tatsächliche Videos von Plänen, hält offene Prüfungen fest und erfindet keine Eigentümerfreigabe.',
          aiPrompt: 'Prüfe diese private Übungsübergabe auf fehlende Skripte, Untertitel, Versionen, Berechtigungsnachweise und blockierte Freigabe. Behaupte nicht, externe Dateien geprüft zu haben: [Checkliste].'
        }
      }
    },
    es: {
      title: 'Crear vídeos cortos para empresas con IA',
      intro: 'Crea tres vídeos empresariales de 15 a 30 segundos con guiones, storyboards, subtítulos corregidos y registros de permisos. Seis lecciones conducen a un proyecto de práctica privado, una propuesta, comprobaciones de evidencias y una entrega. Reserva dos horas para planificar; la edición y los comentarios requieren tiempo adicional. La generación con IA es opcional.',
      steps: {
        'video-business-brief': {
          title: 'Planificar vídeos empresariales cortos',
          explanation: [
            'Prepara un paquete de práctica para Cedar Bakery, un negocio ficticio: tres vídeos verticales sobre la visita, el pan y la bollería, y la recogida en mostrador. Cada vídeo terminado debe durar entre 15 y 30 segundos y tener 1080 x 1920 píxeles (9:16). Son requisitos del ejercicio, no reglas universales de las plataformas sociales.',
            'Utiliza únicamente los datos ficticios proporcionados. Se desconocen los precios, la entrega, los alérgenos y los resultados comerciales. No hace falta un cliente real, publicación automática ni IA de pago. Elige un editor accesible; las diapositivas de texto originales son una alternativa válida de vídeo. Un storyboard por sí solo no es un vídeo terminado.'
          ],
          file: 'Brief del vídeo',
          code: 'PRÁCTICA FICTICIA - NO APROBADA PARA PUBLICAR\nCedar Bakery: martes-sábado, 08:00-14:00; pan y bollería; recogida en mostrador\nDesconocido: precios, entrega, alérgenos, resultados de ventas\nVídeos: visit / products / collection\nCada exportación: 15-30 segundos inclusive; 1080 x 1920; 9:16\nIncluye: guiones, storyboards, subtítulos, tres exportaciones, una ronda de revisión\nExcluye: publicaciones, anuncios, visualizaciones o ventas garantizadas, clonación de voz e imagen',
          check: 'El brief nombra los tres vídeos, duración y resolución, los hechos respaldados, los datos desconocidos y quién revisa.',
          aiPrompt: 'Planifica tres vídeos cortos distintos usando solo este brief ficticio. Separa los hechos de lo desconocido. No inventes precios, testimonios, ventas ni aprobación: [brief].'
        },
        'video-business-scripts': {
          title: 'Escribir guiones y storyboards de vídeo con IA',
          explanation: [
            'Asigna a cada vídeo un mensaje y un siguiente paso. Usa un plan de tres escenas de 20 segundos: apertura 0-4 segundos, mensaje principal 4-14, siguiente paso 14-20. Redacta manualmente o usa IA de forma opcional. Lee la narración en voz alta y mide la duración real; el número de palabras no demuestra la duración.',
            'Añade una lista de recursos junto al storyboard. Utiliza gráficos originales o recursos autorizados. Una imagen de panadería generada por IA es una ilustración, no una fotografía de un negocio o sus productos reales. No imites a una persona identificable, inventes recomendaciones de clientes ni clones voces.'
          ],
          file: 'Hoja de guion y storyboard',
          code: 'Vídeo 1 - Visit (plan de 20 segundos)\n0-4: ¿Planeas visitar una panadería? | tarjeta de título original\n4-14: Cedar Bakery ficticia abre de martes a sábado, 08:00-14:00. | horario legible\n14-20: Comprueba el horario antes de tu visita. | tarjeta con siguiente paso\n\nVídeo 2: pan y bollería; sin afirmaciones sobre precios o dietas\nVídeo 3: recogida en mostrador; sin afirmar que hay entrega\nPara cada uno: tiempo de escena / narración o texto en pantalla / recurso / subtítulos\nDuración real de lectura: medir, no adivinar\nEtiqueta: práctica ficticia; identificar cualquier ilustración generada con IA',
          check: 'Tienes tres guiones distintos con escenas cronometradas y una lista de afirmaciones y recursos; ningún dato comercial desconocido se convierte en un hecho.',
          aiPrompt: 'Redacta tres guiones de 20 segundos con escenas cronometradas, texto en pantalla y subtítulos. Usa solo los hechos proporcionados; etiqueta los elementos visuales generados como ilustraciones. Yo comprobaré la duración real: [brief].'
        },
        'video-business-edit': {
          title: 'Editar vídeos con IA y sus subtítulos',
          explanation: [
            'En el editor elegido, crea un proyecto vertical de 1080 x 1920. Elabora los tres vídeos siguiendo el storyboard con diapositivas originales, imágenes autorizadas o clips generados opcionales. Comprueba las condiciones actuales de exportación, marca de agua, créditos y uso comercial antes de pagar. No supongas que un plan gratuito permite una exportación concreta.',
            'Corrige los subtítulos automáticos palabra por palabra comparándolos con la narración real, incluidos nombres y horarios. Mantén el texto esencial legible y lejos de los controles; previsualízalo en un teléfono. Mira el vídeo sin sonido y comprueba que el audio importante tenga una alternativa textual. Para diapositivas de texto sin voz, indica que no hay narración y verifica el mensaje completo en pantalla.'
          ],
          file: 'Registro de edición y subtítulos',
          code: 'Vídeo / editor y versión / método: diapositivas, imágenes o asistencia de IA\nTamaño de la línea de tiempo: 1080 x 1920\nDuración / resolución reales de la exportación:\nCorrección de subtítulos / narración original / marca de tiempo:\nVersión silenciosa: sin narración; texto completo legible comprobado\nVista previa en teléfono / observación sin sonido / corrección:\nDefectos del recurso generado y permisos pendientes:\nSolo storyboard: comprobaciones de exportación BLOCKED, no PASS',
          check: 'Cada exportación real tiene duración y resolución medidas; se comprueban los subtítulos o todo el texto del vídeo silencioso, no solo se generan automáticamente.',
          aiPrompt: 'Compara este texto de subtítulos con mi guion y señala diferencias de redacción. Sugiere correcciones claras sin afirmar que has visto mi vídeo externo: [guion y subtítulos].'
        },
        'video-business-review': {
          title: 'Comprobar la calidad, los permisos y las revisiones',
          explanation: [
            'Ve cada archivo exportado de principio a fin. Comprueba que dure entre 15 y 30 segundos inclusive y tenga 1080 x 1920; no te fíes solo de los ajustes de la línea de tiempo. Revisa texto, narración, defectos de imagen, licencias musicales, atribución y cualquier aviso sobre IA que requiera la plataforma prevista. No existe una regla universal de permisos o divulgación.',
            'Conserva la versión 1. En una ronda de revisión controlada, adelanta el horario de apertura en el vídeo Visit y mejora la legibilidad de los subtítulos. Registra los cambios, vuelve a abrir las tres exportaciones de la versión 2 y repite las comprobaciones. Una petición ficticia para añadir un precio queda pendiente hasta que una fuente real autorizada lo confirme; el ejercicio no proporciona ningún precio.'
          ],
          file: 'Registro de versiones y permisos',
          code: 'Recurso / creador / fuente / uso permitido / atribución / fecha de comprobación\nSin pruebas de permiso: sustituir por trabajo original o BLOCK\nVersión / petición / cambio / comprobación repetida / pendiente\nv1 -> v2: horario adelantado; subtítulos más legibles; volver a comprobar duración y hechos\nPendiente: añadir precio - desconocido, no incluir\nExportaciones: volver a abrir los tres archivos v2 y medir cada uno\nAprobación real del propietario: no disponible en el ejercicio ficticio, BLOCKED',
          check: 'El registro conserva ambas versiones, rechaza el precio desconocido y documenta las comprobaciones reales de exportación y los permisos pendientes.',
          aiPrompt: 'Audita este registro de afirmaciones y permisos de vídeo frente al brief ficticio. Señala carencias sin inventar licencias, reglas de plataformas ni aprobación del propietario: [registro].'
        },
        'video-business-offer': {
          title: 'Definir y calcular el coste de un servicio de vídeo',
          explanation: [
            'Utiliza el generador de propuestas de proyecto para tres vídeos, guiones, subtítulos, formatos acordados y una ronda de revisión. Indica quién revisa, el plazo, los permisos de los recursos y el tratamiento de datos. Excluye la publicación, la gestión de anuncios, las revisiones ilimitadas y las garantías de visualizaciones o ventas. Un paquete de aprendizaje no demuestra que los clientes vayan a pagar.',
            'Registra por separado el tiempo real y los créditos del proveedor frente a la tarifa propuesta. Solo como ejemplo de planificación interna: 1 hora de brief + 2 de guiones/edición + 1 de comprobaciones + 1 de revisión/entrega = 5 horas; a EUR 20/hora son EUR 100 antes de herramientas, impuestos y gastos generales. No es una tarifa de mercado, un precio recomendado ni un beneficio. Los costes desconocidos siguen siendo desconocidos.'
          ],
          file: 'Oferta del servicio de vídeo',
          code: 'Incluye: tres vídeos de 15-30 segundos en 1080 x 1920, guiones, subtítulos, una revisión\nExcluye: publicación, anuncios, garantías, recursos sin licencia, clonación de voz\nRevisor / plazo / formatos / divulgación de IA y recursos:\nDatos: solo ficticios; no incluir archivos confidenciales ni datos personales en prompts de IA\nEjemplo interno: (1 + 2 + 1 + 1) x EUR 20 = EUR 100\nTiempo real / créditos del proveedor / licencias / impuestos / gastos generales:\nTarifa propuesta: separada y no validada\nPublicación: solo tras los permisos y la aprobación real necesarios',
          check: 'La propuesta separa entregables, costes internos y tarifa propuesta, y define revisión, plazo y límites de datos.',
          aiPrompt: 'Revisa esta oferta de vídeo empresarial: alcance, límites de revisiones, cálculos y promesas sin respaldo. No inventes demanda, precios ni ingresos: [oferta].'
        },
        'video-business-handover': {
          title: 'Preparar una entrega privada del servicio de vídeo',
          explanation: [
            'Guarda los guiones, textos de subtítulos, exportaciones versionadas, brief, registro de permisos y registro de cambios en tu propio almacenamiento. Guarda los registros de texto en el libro privado del proyecto; Desofec no sube, renderiza, genera ni inspecciona archivos de vídeo. No incluyas credenciales ni material confidencial de clientes.',
            'Vuelve a cargar el borrador de resultados del proyecto y carga explícitamente los siete planes de prueba VIDEO. Registra evidencias reales y resultados honestos. Un paquete con solo storyboards no puede superar las comprobaciones de exportación; la falta de aprobación real del propietario permanece bloqueada. Revisa el texto guardado en el Centro de revisión, registra una decisión y descarga un portfolio privado de práctica solo después de comprobarlo. Continuar significa practicar o investigar, no obtener permiso para publicar.'
          ],
          file: 'Lista de comprobación para la entrega de vídeo',
          code: '01-brief-ficticio\n02-guiones-storyboards-subtítulos\n03-exportaciones-v1-y-v2 (o indicar expresamente solo storyboard)\n04-recursos-permisos-y-divulgación\n05-registro-de-revisiones\n06-comprobaciones-medidas-y-puntos-pendientes\n\nVIDEO-1 hechos; VIDEO-2 exportaciones; VIDEO-3 subtítulos; VIDEO-4 permisos\nVIDEO-5 revisiones; VIDEO-6 costes y límites; VIDEO-7 aprobación del propietario\nDecisión: continuar practicando / revisar / detenerse\nLa práctica ficticia no es trabajo verificado de un cliente ni permiso para publicar.',
          check: 'La entrega distingue los vídeos reales de los planes, conserva las comprobaciones pendientes y nunca inventa la aprobación del propietario.',
          aiPrompt: 'Comprueba esta entrega privada de práctica para detectar guiones, subtítulos, versiones, permisos y aprobación bloqueada que falten. No afirmes que has inspeccionado archivos externos: [lista].'
        }
      }
    }
  }
};
