import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const educationServicesTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-education-services': {
    fr: {
      title: 'Préparer un atelier original pour adultes sur l’IA',
      intro: 'Créez un atelier de 15 minutes pour vérifier des affirmations, avec des supports originaux, un corrigé vérifié et une présentation accessible. Environ 75 minutes, plus un essai facultatif avec des adultes consentants. Aucune accréditation ni aucun résultat d’apprentissage garanti.',
      steps: {
        'education-service-audience': {
          title: 'Définir un service de formation pour adultes',
          explanation: [
            'Préparez un atelier d’introduction de 15 minutes pour adultes consentants, consacré à la vérification d’affirmations générées par l’IA. Ne commencez pas par des enfants, des dossiers personnels d’élèves, une notation automatisée ou une certification à enjeux élevés. Demandez ce que les participants savent déjà et quelle tâche ils veulent pratiquer.',
            'L’objectif est observable : à la fin, une personne distingue une affirmation étayée, une affirmation non étayée et une prochaine vérification sûre à partir de la fiche fournie. Cela ne promet ni emploi ni qualification professionnelle.'
          ],
          file: 'Brief de l’atelier',
          code: 'Public : adultes débutants consentants\nDurée : 15 minutes\nSujet : vérifier des affirmations avec une fiche fournie\nObjectif : repérer les éléments étayés, signaler les inconnues, proposer une vérification\nMatériel : fiche fictive, deux affirmations provisoires, corrigé\nExclus : accréditation, dossiers personnels, notation automatisée\nAnimation et rôle de revue :',
          check: 'Votre brief nomme un public adulte, un objectif mesurable et des exclusions claires.',
          aiPrompt: 'Évalue la clarté et la mesurabilité de cet objectif d’atelier pour adultes. N’invente ni besoins des participants, ni qualifications, ni résultats garantis : [brief].'
        },
        'education-service-materials': {
          title: 'Créer une courte leçon et des supports originaux',
          explanation: [
            'Utilisez cette fiche fictive pour un atelier communautaire : la séance commence à 10:00, dure 30 minutes et compte 12 places. Préparez une diapositive ou un document accessible et original. Ne copiez pas un cours payant, une évaluation sous licence ou le matériel d’un autre créateur sans autorisation.',
            'Prévoyez 3 minutes pour expliquer les preuves, 5 pour la pratique guidée, 4 pour la pratique individuelle et 3 pour la discussion : 15 minutes au total. L’IA peut proposer des formulations, mais vérifiez chaque affirmation avec la fiche. Préparez aussi une version imprimée ou en texte seul.'
          ],
          file: 'Plan de leçon',
          code: 'Fiche fictive : début 10:00 ; durée 30 minutes ; capacité 12 places\n3 min : expliquer les affirmations étayées ou non\n5 min : vérification guidée - « La séance commence à 10:00. »\n4 min : vérification individuelle - « Tout le monde reçoit un certificat. »\n3 min : comparer les raisonnements et vérifier les inconnues\nTotal : 15 minutes\nMatériel : document original + version texte lisible',
          check: 'Les durées totalisent 15 minutes et le document reprend la fiche sans inventer d’information sur un certificat.',
          aiPrompt: 'Rédige un document en langage clair à partir de cette fiche fictive et de ce plan de 15 minutes. N’ajoute ni prix, ni certificat, ni fait absent de la source. Distingue les faits des affirmations d’exercice : [plan].'
        },
        'education-service-answer-key': {
          title: 'Vérifier le corrigé et l’évaluation',
          explanation: [
            'Classez trois affirmations : le début à 10:00 est étayé ; une durée de 60 minutes contredit les 30 minutes de la fiche ; un certificat pour tout le monde est inconnu. Pour cette dernière, demandez à l’organisateur une règle vérifiée au lieu de laisser l’IA deviner.',
            'Utilisez une grille de pratique à quatre points : un point pour reconnaître 10:00, un pour corriger 60 en 30 minutes, un pour signaler le certificat comme inconnu et un pour proposer une vraie vérification. Notez manuellement et expliquez le raisonnement. Ce petit exercice ne prouve pas une compétence générale.'
          ],
          file: 'Corrigé et grille',
          code: 'Début 10:00 -> étayé (1 point)\nDurée 60 minutes -> contredite ; la fiche indique 30 (1 point)\nCertificat pour tout le monde -> inconnu (1 point)\nProchaine étape -> demander à l’organisateur / vérifier la règle officielle (1 point)\nTotal de pratique : 0-4, pas une qualification\nUne réponse blanche indique une preuve manquante, pas une incapacité.',
          check: 'Votre corrigé classe correctement les trois affirmations et comporte quatre critères de notation indépendants.',
          aiPrompt: 'Vérifie ce corrigé par rapport à la fiche fictive. Explique chaque classement et signale toute notation non étayée. Ne note pas de vrais participants et ne déduis pas leur capacité : [fiche et grille].'
        },
        'education-service-trial': {
          title: 'Faire un essai accessible avec consentement',
          explanation: [
            'Répétez d’abord seul, puis invitez éventuellement des adultes consentants. Expliquez le but, la durée et le caractère volontaire. Pour cet exercice, ne recueillez ni noms, ni enregistrements, ni données sensibles, ni dossiers personnels d’apprentissage. Sans participant, indiquez que l’essai apprenant n’a pas été réalisé.',
            'Proposez un texte lisible en grand, un langage simple et une option sans prise de parole. Vérifiez l’accès au clavier pour les supports numériques et ne vous fiez pas uniquement à la couleur. Notez seulement des observations non identifiantes, comme une consigne confuse ou une activité plus longue que prévu.'
          ],
          file: 'Observations de l’essai',
          code: 'Durée réelle de la répétition :\nEssai avec un adulte : NOT RUN / consentement confirmé\nVersion texte seule disponible :\nConsignes comprises ? Preuve sans identifiant :\nProblème d’accessibilité et correction :\nProblème de clarté de la grille :\nAucun nom, score ou enregistrement d’apprenant conservé.',
          check: 'Vous distinguez honnêtement une répétition d’un essai réel et notez les problèmes d’accès sans données personnelles.',
          aiPrompt: 'Examine ces observations anonymes sur les supports pour repérer les consignes confuses et les obstacles d’accessibilité. Ne déduis ni diagnostic ni capacité d’un participant : [notes].'
        },
        'education-service-offer': {
          title: 'Définir et chiffrer un petit atelier',
          explanation: [
            'Utilisez le générateur de propositions pour cadrer un atelier de 15 minutes pour adultes, un document original, un corrigé vérifié manuellement et une série de révisions du matériel. Indiquez les exclusions : accréditation, profilage des apprenants, traitement de vrais dossiers et résultats garantis.',
            'Comptabilisez préparation, répétition, animation, révision, dépenses de lieu ou d’outils et frais généraux pertinents. Indiquez séparément le tarif proposé ; aucune IA payante n’est nécessaire. Avant une offre réelle, vérifiez les autorisations, les règles du lieu et les exigences locales applicables.'
          ],
          file: 'Périmètre du service éducatif',
          code: 'Inclus : atelier adulte de 15 minutes, document original, corrigé, une révision du matériel\nFormat de livraison et besoins d’accès :\nTemps de préparation / répétition / animation / révision :\nDépenses, frais généraux et hypothèses fiscales :\nTarif proposé : distinct des coûts\nExclus : titres, profilage des apprenants, résultats garantis\nResponsable de revue et critères d’acceptation :',
          check: 'Votre offre énumère des livrables mesurables et des limites sans présenter la pratique comme un cours accrédité.',
          aiPrompt: 'Examine cette offre d’atelier pour repérer les affirmations éducatives non étayées, les modalités d’accès floues et les coûts de préparation manquants. N’invente ni accréditation ni demande : [périmètre].'
        },
        'education-service-review': {
          title: 'Livrer les supports et améliorer selon les preuves',
          explanation: [
            'Rassemblez le brief, le plan de leçon, la fiche, le document, le corrigé vérifié, les notes d’accessibilité et le journal des versions. Un second adulte peut vérifier les supports par rapport à la source ; si cette revue n’a pas eu lieu, indiquez qu’elle est en attente.',
            'Utilisez le suivi des résultats pour noter l’exactitude des faits, le timing, les options accessibles et la cohérence de la grille. Gardez les retours centrés sur les supports, pas sur les profils personnels. Décidez de continuer, réviser ou arrêter ; une grille de pratique de 0-4 ne justifie aucune affirmation sur l’apprentissage à long terme ou l’emploi.'
          ],
          file: 'Remise de l’atelier',
          code: 'Brief | plan de 15 minutes | document original | fiche | corrigé vérifié\nOptions d’accessibilité et version :\nContrôles : source / durée / accès / cohérence de la grille\nRevue indépendante : en attente, sauf si elle a réellement eu lieu\nRetours sur les supports et incertitudes :\nDécision et prochaine révision :',
          check: 'Votre dossier est reproductible et signale tout essai ou toute revue manquants sans recueillir de profils d’apprenants.',
          aiPrompt: 'Vérifie cette liste de remise pour repérer les sources, options d’accès et preuves de revue manquantes. N’invente ni progrès des apprenants ni accréditation : [liste].'
        }
      }
    },
    de: {
      title: 'Einen eigenen KI-Workshop für Erwachsene vorbereiten',
      intro: 'Entwickle einen 15-minütigen Workshop zum Prüfen von Aussagen mit eigenen Materialien, geprüftem Lösungsschlüssel und barrierearmer Durchführung. Etwa 75 Minuten plus optionaler Test mit einwilligenden Erwachsenen. Keine Akkreditierung und kein garantierter Lernerfolg.',
      steps: {
        'education-service-audience': {
          title: 'Ein Lernangebot für Erwachsene definieren',
          explanation: [
            'Übe einen 15-minütigen Einführungsworkshop für einwilligende Erwachsene zum Prüfen KI-generierter Aussagen. Beginne nicht mit Kindern, persönlichen Schülerdaten, automatischer Bewertung oder folgenreichen Zertifizierungen. Frage, was die Lernenden bereits wissen und welche Aufgabe sie üben möchten.',
            'Das Lernziel ist beobachtbar: Am Ende unterscheidet eine lernende Person anhand des Faktenblatts eine belegte Aussage, eine unbelegte Aussage und einen sicheren nächsten Prüfschritt. Das verspricht weder Beschäftigung noch eine berufliche Qualifikation.'
          ],
          file: 'Workshop-Briefing',
          code: 'Zielgruppe: einwilligende erwachsene Anfänger\nDauer: 15 Minuten\nThema: Aussagen anhand eines Faktenblatts prüfen\nZiel: Belege erkennen, Unbekanntes markieren, Prüfung vorschlagen\nMaterial: fiktives Faktenblatt, zwei Entwurfsbehauptungen, Lösungsschlüssel\nAusgeschlossen: Akkreditierung, persönliche Daten, automatische Bewertung\nModeration und Prüfrolle:',
          check: 'Das Briefing nennt Erwachsene, ein messbares Lernziel und klare Ausschlüsse.',
          aiPrompt: 'Prüfe dieses Lernziel für einen Erwachsenen-Workshop auf Klarheit und Messbarkeit. Erfinde keine Lernbedürfnisse, Qualifikationen oder garantierten Ergebnisse: [Briefing].'
        },
        'education-service-materials': {
          title: 'Eine kurze Lektion und eigene Materialien erstellen',
          explanation: [
            'Nutze dieses erfundene Faktenblatt für einen Community-Workshop: Beginn 10:00, Dauer 30 Minuten, 12 Plätze. Erstelle eigene barrierearme Folien oder ein Handout. Kopiere keinen kostenpflichtigen Kurs, keine lizenzierte Prüfung und keine Materialien anderer ohne Erlaubnis.',
            'Plane 3 Minuten für Belege, 5 für angeleitete Übung, 4 für selbstständige Übung und 3 für die Diskussion: insgesamt 15 Minuten. KI darf Formulierungen vorschlagen, aber prüfe jede Aussage am Faktenblatt. Halte auch gedruckte oder reine Textmaterialien bereit.'
          ],
          file: 'Lektionsplan',
          code: 'Fiktives Faktenblatt: Beginn 10:00; Dauer 30 Minuten; Kapazität 12 Plätze\n3 Min.: belegte und unbelegte Aussagen erklären\n5 Min.: angeleitete Prüfung - „Die Sitzung beginnt um 10:00.“\n4 Min.: eigene Prüfung - „Alle erhalten ein Zertifikat.“\n3 Min.: Begründungen vergleichen und Unbekanntes verifizieren\nGesamt: 15 Minuten\nMaterial: eigenes Handout + lesbare Textalternative',
          check: 'Die Zeiten ergeben 15 Minuten und das Handout enthält keine erfundenen Zertifikatsangaben.',
          aiPrompt: 'Erstelle ein leicht verständliches Handout aus diesem fiktiven Faktenblatt und dem 15-Minuten-Plan. Ergänze keine Preise, Zertifikate oder unbelegten Fakten. Trenne Quellenfakten von Beispielbehauptungen: [Plan].'
        },
        'education-service-answer-key': {
          title: 'Lösungsschlüssel und Bewertung prüfen',
          explanation: [
            'Ordne drei Aussagen ein: Beginn 10:00 ist belegt; 60 Minuten widerspricht den angegebenen 30 Minuten; ein Zertifikat für alle ist unbekannt. Bitte bei der letzten Aussage den Veranstalter um eine verifizierte Regel, statt die KI raten zu lassen.',
            'Nutze eine vier Punkte umfassende Übungsrubrik: je ein Punkt für 10:00 als belegt, die Korrektur von 60 auf 30 Minuten, das Markieren des Zertifikats als unbekannt und einen echten Prüfschritt. Bewerte manuell und erkläre die Begründung. Diese kleine Übung belegt keine umfassende Kompetenz.'
          ],
          file: 'Lösungsschlüssel und Rubrik',
          code: 'Beginn 10:00 -> belegt (1 Punkt)\nDauer 60 Minuten -> widersprochen; Faktenblatt nennt 30 (1 Punkt)\nZertifikat für alle -> unbekannt (1 Punkt)\nNächster Schritt -> Veranstalter fragen / bestätigte Regel prüfen (1 Punkt)\nÜbungssumme: 0-4, keine Qualifikation\nEine leere Antwort bedeutet fehlenden Beleg, nicht erwiesene Unfähigkeit.',
          check: 'Dein Lösungsschlüssel ordnet die drei Aussagen korrekt ein und hat vier unabhängige Bewertungskriterien.',
          aiPrompt: 'Prüfe diesen Lösungsschlüssel anhand des fiktiven Faktenblatts. Erkläre jede Einordnung und markiere unbelegte Bewertung. Bewerte keine echten Lernenden und leite keine Fähigkeit ab: [Blatt und Rubrik].'
        },
        'education-service-trial': {
          title: 'Einen einwilligungsbasierten Barrierefreiheitstest durchführen',
          explanation: [
            'Probiere es zuerst allein aus und lade anschließend optional einwilligende Erwachsene ein. Erkläre Zweck, Dauer und Freiwilligkeit. Sammle für diese Übung keine Namen, Aufnahmen, sensiblen Angaben oder persönlichen Lerndaten. Wenn niemand testet, kennzeichne den Lerntest als nicht durchgeführt.',
            'Biete gut lesbaren Großtext, einfache Sprache und eine Alternative zum lauten Sprechen an. Prüfe bei digitalen Materialien die Tastaturbedienung und verlasse dich nicht nur auf Farben. Notiere ausschließlich nicht identifizierende Beobachtungen, etwa unklare Anweisungen oder eine längere Aktivität.'
          ],
          file: 'Testbeobachtungen',
          code: 'Tatsächliche Dauer der Probe:\nErwachsenentest: NOT RUN / Einwilligung bestätigt\nTextalternative verfügbar:\nAnweisungen verstanden? Beleg ohne Kennungen:\nBarriere und Korrektur:\nUnklarheit der Rubrik:\nKeine Namen, Bewertungen oder Aufnahmen von Lernenden gespeichert.',
          check: 'Du unterscheidest ehrlich zwischen Probe und echtem Test und notierst Barrieren ohne persönliche Lerndaten.',
          aiPrompt: 'Prüfe diese anonymen Beobachtungen zu den Materialien auf unklare Anweisungen und Barrieren. Leite keine Diagnose oder Fähigkeit einer lernenden Person ab: [Notizen].'
        },
        'education-service-offer': {
          title: 'Ein kleines Workshop-Angebot kalkulieren',
          explanation: [
            'Nutze den Angebotsgenerator für einen klar begrenzten 15-minütigen Workshop für Erwachsene, ein eigenes Handout, einen manuell geprüften Lösungsschlüssel und eine Überarbeitungsrunde für Materialien. Nenne Ausschlüsse: Akkreditierung, Lernendenprofile, echte Datensätze und garantierte Ergebnisse.',
            'Erfasse Vorbereitungs-, Probe-, Durchführungs- und Überarbeitungszeit sowie Raum-/Werkzeugkosten und passende Gemeinkosten. Trenne das vorgeschlagene Honorar von den Kosten; kostenpflichtige KI ist nicht nötig. Prüfe vor einem echten Angebot Genehmigungen, Hausregeln und geltende lokale Anforderungen.'
          ],
          file: 'Leistungsumfang Bildung',
          code: 'Enthalten: 15-Minuten-Workshop für Erwachsene, eigenes Handout, Lösungsschlüssel, eine Materialrevision\nLieferformat und Zugangsbedarf:\nVorbereitung / Probe / Durchführung / Überarbeitung:\nAusgaben, Gemeinkosten und Steuerannahmen:\nVorgeschlagenes Honorar: getrennt von Kosten\nAusgeschlossen: Nachweise, Lernendenprofile, garantierte Ergebnisse\nPrüfrolle und Abnahmekriterien:',
          check: 'Das Angebot enthält messbare Leistungen und Grenzen, ohne die Übung als akkreditierten Kurs darzustellen.',
          aiPrompt: 'Prüfe dieses Workshop-Angebot auf unbelegte Bildungsversprechen, unklare Zugänge und fehlende Vorbereitungskosten. Erfinde weder Akkreditierung noch Nachfrage: [Umfang].'
        },
        'education-service-review': {
          title: 'Materialien übergeben und anhand von Belegen verbessern',
          explanation: [
            'Stelle Briefing, Lektionsplan, Faktenblatt, Handout, geprüften Lösungsschlüssel, Barrierefreiheitsnotizen und Versionsprotokoll zusammen. Eine zweite erwachsene Person kann die Materialien anhand der Quelle prüfen; falls das nicht geschehen ist, kennzeichne die Prüfung als ausstehend.',
            'Erfasse im Ergebnistracker Faktenrichtigkeit, Zeitplanung, barrierearme Alternativen und Konsistenz der Rubrik. Beziehe Feedback auf die Materialien, nicht auf persönliche Lernprofile. Entscheide: fortsetzen, überarbeiten oder stoppen. Eine Übungsrubrik von 0-4 belegt weder langfristiges Lernen noch Berufserfolg.'
          ],
          file: 'Workshop-Übergabe',
          code: 'Briefing | 15-Minuten-Plan | eigenes Handout | Faktenblatt | geprüfter Schlüssel\nBarrierefreie Alternativen und Version:\nPrüfungen: Quelle / Zeit / Zugang / Rubrik-Konsistenz\nUnabhängige Prüfung: ausstehend, sofern nicht tatsächlich erfolgt\nMaterialbezogenes Feedback und Unsicherheit:\nEntscheidung und nächste Überarbeitung:',
          check: 'Dein Paket ist nachvollziehbar und weist fehlende Tests oder Prüfungen ehrlich aus, ohne Lernendenprofile zu sammeln.',
          aiPrompt: 'Prüfe diese Übergabe-Checkliste auf fehlende Quellen, Zugangsoptionen und Prüfbelege. Erfinde keine Lernfortschritte oder Akkreditierung: [Checkliste].'
        }
      }
    },
    es: {
      title: 'Preparar un taller original de IA para personas adultas',
      intro: 'Diseña un taller de 15 minutos para verificar afirmaciones, con materiales originales, una clave de respuestas revisada y una impartición accesible. Unos 75 minutos, más una prueba opcional con personas adultas que den su consentimiento. Sin acreditación ni resultados de aprendizaje garantizados.',
      steps: {
        'education-service-audience': {
          title: 'Definir un servicio formativo para adultos',
          explanation: [
            'Practica un taller introductorio de 15 minutos para personas adultas que consientan, sobre cómo comprobar afirmaciones generadas por IA. No empieces con menores, expedientes personales de estudiantes, calificación automatizada ni certificaciones de alto impacto. Pregunta qué saben ya y qué tarea quieren practicar.',
            'El objetivo es observable: al final, una persona distingue una afirmación respaldada, otra sin respaldo y un siguiente paso seguro de verificación usando la ficha proporcionada. Esto no promete empleo ni una cualificación profesional.'
          ],
          file: 'Brief del taller',
          code: 'Público: adultos principiantes que consienten\nDuración: 15 minutos\nTema: comprobar afirmaciones con una ficha proporcionada\nObjetivo: identificar respaldo, señalar incógnitas y proponer una verificación\nMateriales: ficha ficticia, dos afirmaciones de ejemplo, clave de respuestas\nExcluye: acreditación, expedientes personales, calificación automatizada\nFacilitación y función de revisión:',
          check: 'El brief nombra a personas adultas, un objetivo medible y exclusiones claras.',
          aiPrompt: 'Revisa la claridad y la posibilidad de medir este objetivo para un taller de adultos. No inventes necesidades, credenciales ni resultados garantizados: [brief].'
        },
        'education-service-materials': {
          title: 'Crear una lección breve y materiales originales',
          explanation: [
            'Usa esta ficha ficticia para un taller comunitario: la sesión empieza a las 10:00, dura 30 minutos y tiene 12 plazas. Prepara una diapositiva o folleto original y accesible. No copies un curso de pago, una evaluación con licencia ni materiales de otra persona sin permiso.',
            'Planifica 3 minutos para explicar las pruebas, 5 para practicar con guía, 4 para practicar individualmente y 3 para debatir: 15 minutos en total. La IA puede sugerir redacción, pero verifica cada afirmación con la ficha. Prepara también materiales impresos o en texto sencillo.'
          ],
          file: 'Plan de lección',
          code: 'Ficha ficticia: inicio 10:00; duración 30 minutos; capacidad 12 plazas\n3 min: explicar afirmaciones respaldadas y no respaldadas\n5 min: comprobación guiada - «La sesión empieza a las 10:00».\n4 min: comprobación individual - «Todas las personas reciben un certificado».\n3 min: comparar razonamientos y verificar incógnitas\nTotal: 15 minutos\nMateriales: folleto original + alternativa de texto legible',
          check: 'Los tiempos suman 15 minutos y el folleto usa la ficha sin inventar datos sobre certificados.',
          aiPrompt: 'Redacta un folleto en lenguaje sencillo con esta ficha ficticia y el plan de 15 minutos. No añadas precios, certificados ni hechos no proporcionados. Separa los datos fuente de las afirmaciones de ejemplo: [plan].'
        },
        'education-service-answer-key': {
          title: 'Verificar la clave de respuestas y la evaluación',
          explanation: [
            'Clasifica tres afirmaciones: el inicio a las 10:00 está respaldado; una duración de 60 minutos contradice los 30 de la ficha; un certificado para todas las personas es desconocido. Para esta última, pide al organizador una política verificada en vez de dejar que la IA adivine.',
            'Usa una rúbrica de práctica de cuatro puntos: uno por reconocer que las 10:00 está respaldado, uno por corregir 60 a 30 minutos, uno por marcar el certificado como desconocido y uno por proponer una verificación real. Puntúa manualmente y explica el razonamiento. Este pequeño ejercicio no demuestra una competencia general.'
          ],
          file: 'Clave y rúbrica',
          code: 'Inicio 10:00 -> respaldado (1 punto)\nDuración 60 minutos -> contradicha; la ficha indica 30 (1 punto)\nCertificado para todas las personas -> desconocido (1 punto)\nSiguiente paso -> preguntar al organizador / comprobar la política verificada (1 punto)\nTotal de práctica: 0-4, no es una cualificación\nUna respuesta en blanco indica que falta evidencia, no incapacidad.',
          check: 'La clave clasifica correctamente las tres afirmaciones y tiene cuatro criterios independientes.',
          aiPrompt: 'Comprueba esta clave con la ficha ficticia. Explica cada clasificación y señala puntuaciones sin respaldo. No evalúes a estudiantes reales ni infieras capacidades: [ficha y rúbrica].'
        },
        'education-service-trial': {
          title: 'Probar la accesibilidad con consentimiento',
          explanation: [
            'Ensaya primero a solas y, después, invita opcionalmente a personas adultas que consientan. Explica el propósito, la duración y que participar es voluntario. Para este ejercicio no recopiles nombres, grabaciones, información sensible ni expedientes personales de aprendizaje. Si no hay participantes, indica que la prueba con estudiantes no se realizó.',
            'Ofrece texto grande y legible, lenguaje sencillo y una alternativa a hablar en voz alta. Comprueba el acceso por teclado en materiales digitales y no dependas solo del color. Registra únicamente observaciones no identificables, como instrucciones confusas o una actividad que duró más de lo previsto.'
          ],
          file: 'Observaciones de la prueba',
          code: 'Duración real del ensayo:\nPrueba con adulto: NOT RUN / consentimiento confirmado\nAlternativa de solo texto disponible:\n¿Se entendieron las instrucciones? Evidencia sin identificadores:\nProblema de accesibilidad y corrección:\nProblema de claridad de la rúbrica:\nNo se guardan nombres, puntuaciones ni grabaciones de estudiantes.',
          check: 'Distingues honestamente un ensayo de una prueba real y registras barreras sin datos personales del alumnado.',
          aiPrompt: 'Revisa estas observaciones anónimas sobre materiales para detectar instrucciones confusas y barreras de acceso. No infieras diagnósticos ni capacidades: [notas].'
        },
        'education-service-offer': {
          title: 'Definir y calcular el coste de un taller pequeño',
          explanation: [
            'Usa el generador de propuestas para delimitar un taller de 15 minutos para adultos, un folleto original, una clave de respuestas revisada manualmente y una ronda de revisión de materiales. Indica las exclusiones: acreditación, perfiles de estudiantes, procesamiento de expedientes reales y resultados garantizados.',
            'Registra el tiempo de preparación, ensayo, impartición y revisión, además de gastos del espacio o herramientas y costes indirectos pertinentes. Separa la tarifa propuesta de los costes; no hace falta IA de pago. Antes de ofrecer un servicio real, comprueba permisos, normas del espacio y requisitos locales aplicables.'
          ],
          file: 'Alcance del servicio educativo',
          code: 'Incluye: sesión de 15 min para adultos, folleto original, clave de respuestas, una revisión del material\nFormato de entrega y necesidades de acceso:\nTiempo de preparación / ensayo / impartición / revisión:\nGastos, costes indirectos e hipótesis fiscales:\nTarifa propuesta: separada de los costes\nExcluye: credenciales, perfiles de estudiantes, resultados garantizados\nResponsable de revisión y criterios de aceptación:',
          check: 'La oferta enumera entregables medibles y límites sin presentar la práctica como un curso acreditado.',
          aiPrompt: 'Revisa esta oferta de taller para encontrar afirmaciones educativas sin respaldo, acuerdos de acceso poco claros y costes de preparación ausentes. No inventes acreditación ni demanda: [alcance].'
        },
        'education-service-review': {
          title: 'Entregar materiales y mejorar con evidencia',
          explanation: [
            'Prepara el brief, plan de lección, ficha, folleto, clave revisada, notas de accesibilidad y registro de versiones. Una segunda persona adulta puede revisar los materiales frente a la fuente; si no lo ha hecho, indica que la revisión está pendiente.',
            'Usa el seguimiento de resultados para registrar exactitud, tiempos, alternativas accesibles y coherencia de la rúbrica. Mantén los comentarios centrados en los materiales, no en perfiles personales. Decide continuar, revisar o detenerte; una rúbrica de práctica de 0-4 no justifica afirmaciones sobre aprendizaje a largo plazo ni resultados laborales.'
          ],
          file: 'Entrega del taller',
          code: 'Brief | plan de 15 minutos | folleto original | ficha | clave revisada\nAlternativas de accesibilidad y versión:\nComprobaciones: fuente / tiempo / acceso / coherencia de rúbrica\nRevisión independiente: pendiente, salvo que se haya completado\nComentarios sobre materiales e incertidumbres:\nDecisión y próxima revisión:',
          check: 'El paquete se puede reproducir y declara pruebas o revisiones pendientes sin recopilar perfiles de estudiantes.',
          aiPrompt: 'Audita esta lista de entrega para detectar fuentes, alternativas de acceso y pruebas de revisión ausentes. No inventes mejoras del alumnado ni acreditación: [lista].'
        }
      }
    }
  }
};
