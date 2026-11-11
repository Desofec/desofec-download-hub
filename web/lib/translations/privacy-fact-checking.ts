import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const privacyFactCheckingTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-privacy-fact-checking': {
    fr: {
      title: 'Protéger la vie privée et vérifier les réponses de l’IA',
      intro: 'Retirez les données privées avant de solliciter l’IA, puis vérifiez chaque affirmation à l’aide d’une source. Entraînez-vous en privé avec une bibliothèque fictive ; l’IA est facultative.',
      steps: {
        'privacy-map': {
          title: 'Repérer les informations privées avant la requête',
          explanation: [
            'Entraînez-vous avec Riverside Library, une bibliothèque fictive, et le message fictif d’un bénévole. Tous les noms, adresses et numéros de cet exercice sont inventés ; n’utilisez ni vrais messages ni personnes réelles pendant l’entraînement.',
            'Avant de coller un texte dans un outil d’IA, classez chaque détail comme PRIVÉ ou UTILISABLE. Le message contient quatre éléments privés : un nom, une adresse e-mail, un numéro de téléphone et une information de santé. Seuls la date 2030-03-14, l’heure 18:00 et la salle B sont nécessaires à la tâche.'
          ],
          file: 'Carte de confidentialité',
          code: 'Message fictif (entraînement uniquement) :\n« Bonjour, ici Alex Example (alex@example.test, +00 0000 0000). La réunion des bénévoles a lieu le 2030-03-14 à 18:00 en salle B. Je serai peut-être en retard à cause d’un rendez-vous médical. »\n\nDétail | décision\nAlex Example | PRIVÉ - nom\nalex@example.test | PRIVÉ - e-mail\n+00 0000 0000 | PRIVÉ - téléphone\nRendez-vous médical | PRIVÉ - information de santé\n2030-03-14 | UTILISABLE\n18:00 | UTILISABLE\nSalle B | UTILISABLE\nTâche : rédiger un court rappel de réunion',
          check: 'Votre carte classe le nom, l’e-mail, le téléphone et l’information de santé comme PRIVÉS et ne garde que la date, l’heure et la salle pour la tâche.',
          aiPrompt: 'Ne colle pas encore le message. Demande plutôt : quels types de détails d’un message sont généralement personnels ou sensibles et doivent être retirés avant de demander de l’aide à un outil d’IA ? Donne uniquement des catégories.'
        },
        'privacy-redact': {
          title: 'Masquer les noms et les coordonnées',
          explanation: [
            'Remplacez chaque élément privé par un repère neutre avant la requête : [PERSONNE A], [E-MAIL] et [TÉLÉPHONE]. Supprimez entièrement l’information de santé au lieu d’y faire allusion, car le rappel n’en a pas besoin. Gardez le message original privé et ne le collez jamais dans l’outil.',
            'Relisez le texte masqué et vérifiez qu’aucun des quatre éléments privés n’y figure. Vérifiez vous-même les paramètres de confidentialité et les conditions actuels de l’outil, comme l’historique des conversations ou l’entraînement des modèles ; cette leçon ne vérifie les paramètres d’aucun outil et ne constitue pas un avis juridique.'
          ],
          file: 'Requête masquée',
          code: 'Texte masqué :\n« [PERSONNE A] ([E-MAIL], [TÉLÉPHONE]) indique que la réunion des bénévoles a lieu le 2030-03-14 à 18:00 en salle B. »\n\nSupprimé entièrement : information de santé\nÉléments privés restant dans le texte : 0 sur 4\nParamètres de confidentialité vérifiés par moi : OUI / NON\nMessage original : gardé privé, non collé',
          check: 'Votre texte masqué ne contient aucun des quatre éléments privés, conserve 2030-03-14, 18:00 et la salle B, et vous avez vérifié vous-même les paramètres de l’outil.',
          aiPrompt: 'À partir de ce seul texte masqué, rédige un rappel de réunion en deux phrases. Garde les repères tels quels et ne devine pas qui est [PERSONNE A] : [texte masqué].'
        },
        'claims-list': {
          title: 'Découper une réponse d’IA en affirmations vérifiables',
          explanation: [
            'Une réponse d’IA peut sembler assurée et pourtant être fausse. Entraînez-vous avec ce résumé fictif de Riverside Library produit par une IA : « Riverside Library est ouverte 7 jours sur 7, y compris le samedi de 10:00 à 14:00. L’inscription est gratuite pour les habitants. Elle prête 50 ordinateurs portables et a été fondée en 1952 (source : City Library Report 2029). »',
            'Découpez le résumé en affirmations distinctes, un fait par ligne, et donnez à chacune un identifiant de C1 à C5. Notez la source citée à part sous S1. Ne jugez encore rien : rendez d’abord chaque affirmation visible pour qu’aucune ne se cache dans une phrase fluide.'
          ],
          file: 'Liste des affirmations',
          code: 'C1 | Ouverte 7 jours sur 7\nC2 | Samedi 10:00-14:00\nC3 | Inscription gratuite pour les habitants\nC4 | Prête 50 ordinateurs portables\nC5 | Fondée en 1952\nS1 | Source citée : City Library Report 2029\nVerdicts : pas encore vérifiés',
          check: 'Votre liste comporte cinq affirmations, de C1 à C5, plus la source citée S1, avec un fait par ligne et aucun verdict pour l’instant.',
          aiPrompt: 'Découpe ce texte en une liste numérotée d’affirmations factuelles distinctes, un fait par ligne. N’ajoute, ne juge et ne corrige rien : [résumé de l’IA].'
        },
        'claims-sources': {
          title: 'Vérifier chaque affirmation à l’aide d’une vraie source',
          explanation: [
            'Comparez chaque affirmation uniquement avec la fiche source de l’exercice : lundi-vendredi 09:00-18:00 ; samedi 10:00-14:00 ; fermée le dimanche ; inscription gratuite pour les habitants ; 12 ordinateurs portables, prêts de 2 heures. Notez CONFIRMÉE, CONTREDITE ou SOURCE REQUISE, avec la preuve exacte.',
            'C2 et C3 sont confirmées. C1 est contredite, car la bibliothèque est fermée le dimanche, et C4 est contredite, car la fiche indique 12 ordinateurs portables. La fiche ne dit rien de 1952 : C5 exige donc une source. S1 ne figure pas dans vos sources : marquez-la CITATION INTROUVABLE et n’inventez ni ne « complétez » jamais une citation.'
          ],
          file: 'Vérification des sources',
          code: 'Fiche source (exercice fictif) :\nLundi-vendredi 09:00-18:00 | samedi 10:00-14:00 | fermée le dimanche\nInscription gratuite pour les habitants | 12 ordinateurs portables, prêts de 2 heures\n\nAffirmation | preuve | verdict\nC1 Ouverte 7 jours sur 7 | fermée le dimanche | CONTREDITE\nC2 Samedi 10:00-14:00 | indiqué | CONFIRMÉE\nC3 Gratuite pour les habitants | indiqué | CONFIRMÉE\nC4 50 ordinateurs portables | la fiche indique 12 | CONTREDITE\nC5 Fondée en 1952 | absent de la fiche | SOURCE REQUISE\nS1 City Library Report 2029 | absent des sources | CITATION INTROUVABLE',
          check: 'Votre vérification donne 2 CONFIRMÉES, 2 CONTREDITES et 1 SOURCE REQUISE, et S1 est marquée CITATION INTROUVABLE sans remplacement inventé.',
          aiPrompt: 'Compare chaque affirmation uniquement avec cette fiche source. Pour chacune, cite la preuve correspondante ou indique « absent de la source ». N’utilise aucune connaissance extérieure et n’invente aucune citation : [affirmations et fiche source].'
        },
        'claims-verdicts': {
          title: 'Corriger, signaler ou retirer les affirmations non étayées',
          explanation: [
            'Réécrivez le résumé en n’utilisant que ce que la source confirme. Corrigez les affirmations contredites avec la formulation de la source : fermée le dimanche, et 12 ordinateurs portables au lieu de 50. Retirez C5 ou gardez-la clairement marquée NON VÉRIFIÉE jusqu’à ce que vous trouviez une source fiable.',
            'Retirez la citation introuvable. Un résumé plus court et exact vaut mieux qu’un résumé qui semble complet. Ne demandez de l’aide à l’IA pour la formulation qu’une fois les faits établis, et vérifiez que sa réécriture ne réintroduit aucune affirmation retirée.'
          ],
          file: 'Résumé corrigé',
          code: 'Résumé corrigé :\n« Riverside Library est ouverte du lundi au vendredi de 09:00 à 18:00 et le samedi de 10:00 à 14:00 ; elle est fermée le dimanche. L’inscription est gratuite pour les habitants. Elle prête 12 ordinateurs portables pour des prêts de 2 heures. »\n\nC1 : corrigée | C2 : conservée | C3 : conservée | C4 : corrigée à 12\nC5 fondée en 1952 : NON VÉRIFIÉE - retirée\nCitation S1 : retirée - introuvable\nRéécriture revérifiée avec la source : OUI / NON',
          check: 'Votre résumé corrigé indique la fermeture le dimanche et 12 ordinateurs portables, omet 1952 ou la marque NON VÉRIFIÉE, et ne contient aucune citation introuvable.',
          aiPrompt: 'Améliore la formulation de ce résumé corrigé sans ajouter, retirer ni modifier aucun fait, nombre ou source : [résumé corrigé].'
        },
        'privacy-review': {
          title: 'Consigner honnêtement la relecture avant tout partage',
          explanation: [
            'Enregistrez ensemble la carte de confidentialité, la requête masquée, la liste des affirmations, la vérification des sources et le résumé corrigé comme dossier d’entraînement. Notez ce qui reste incertain. Ces vérifications réduisent les risques, mais elles restent un exercice d’apprentissage, sans garantie ni valeur d’avis juridique.',
            'Riverside Library est fictive : aucun rédacteur réel ne peut approuver un partage. Notez l’approbation comme BLOQUÉE, gardez l’exercice privé et ne l’envoyez ni ne le publiez. Laissez les retours des lecteurs et les résultats NON RECUEILLIS ; pour un vrai travail, suivez les règles de votre organisation et obtenez une approbation réelle.'
          ],
          file: 'Journal de relecture privé',
          code: 'Dossier d’entraînement : carte de confidentialité | requête masquée | liste des affirmations | vérification des sources | résumé corrigé\nÉléments privés dans les requêtes : 0\nAffirmations : 2 CONFIRMÉES | 2 CONTREDITES -> corrigées | 1 SOURCE REQUISE -> NON VÉRIFIÉE\nCitation S1 : introuvable - retirée\nApprobation du rédacteur fictif : BLOQUÉE - aucun rédacteur réel\nRetours des lecteurs : NON RECUEILLIS\nStatut de l’exercice : privé ; ne pas envoyer ni publier',
          check: 'Votre journal garde l’approbation BLOQUÉE, laisse les retours NON RECUEILLIS, liste ce qui reste incertain et garde l’exercice privé.',
          aiPrompt: 'Relis ce journal d’entraînement pour repérer les vérifications manquantes. N’invente ni approbation, ni source, ni retour, ni résultat, et ne donne aucun avis juridique : [journal d’entraînement].'
        }
      }
    },
    de: {
      title: 'Privatsphäre schützen und KI-Antworten prüfen',
      intro: 'Entfernen Sie private Angaben vor dem Prompt und prüfen Sie jede KI-Aussage anhand einer Quelle. Üben Sie privat mit einer fiktiven Bibliothek; KI ist optional.',
      steps: {
        'privacy-map': {
          title: 'Private Informationen vor dem Prompt erkennen',
          explanation: [
            'Üben Sie mit Riverside Library, einer fiktiven Bibliothek, und der fiktiven Nachricht einer ehrenamtlichen Person. Alle Namen, Adressen und Nummern in dieser Übung sind erfunden; verwenden Sie beim Üben keine echten Nachrichten und keine realen Personen.',
            'Bevor Sie Text in ein KI-Tool einfügen, markieren Sie jedes Detail als PRIVAT oder NUTZBAR. Die Nachricht enthält vier private Angaben: einen Namen, eine E-Mail-Adresse, eine Telefonnummer und eine Gesundheitsangabe. Für die Aufgabe werden nur das Datum 2030-03-14, die Uhrzeit 18:00 und Raum B benötigt.'
          ],
          file: 'Datenschutzübersicht',
          code: 'Fiktive Nachricht (nur zur Übung):\n„Hallo, hier ist Alex Example (alex@example.test, +00 0000 0000). Das Treffen der Ehrenamtlichen ist am 2030-03-14 um 18:00 in Raum B. Ich komme wegen eines Arzttermins vielleicht später.“\n\nDetail | Entscheidung\nAlex Example | PRIVAT - Name\nalex@example.test | PRIVAT - E-Mail\n+00 0000 0000 | PRIVAT - Telefon\nArzttermin | PRIVAT - Gesundheitsangabe\n2030-03-14 | NUTZBAR\n18:00 | NUTZBAR\nRaum B | NUTZBAR\nAufgabe: eine kurze Erinnerung an das Treffen schreiben',
          check: 'Ihre Übersicht markiert Name, E-Mail, Telefon und Gesundheitsangabe als PRIVAT und behält für die Aufgabe nur Datum, Uhrzeit und Raum.',
          aiPrompt: 'Füge die Nachricht noch nicht ein. Frage stattdessen: Welche Arten von Angaben in einer Nachricht sind normalerweise persönlich oder sensibel und sollten entfernt werden, bevor ich ein KI-Tool um Hilfe bitte? Nenne nur Kategorien.'
        },
        'privacy-redact': {
          title: 'Namen und Kontaktdaten schwärzen',
          explanation: [
            'Ersetzen Sie vor dem Prompt jede private Angabe durch einen neutralen Platzhalter: [PERSON A], [E-MAIL] und [TELEFON]. Entfernen Sie die Gesundheitsangabe vollständig, statt darauf anzuspielen, denn die Erinnerung braucht sie nicht. Behalten Sie die Originalnachricht privat und fügen Sie sie nie in das Tool ein.',
            'Lesen Sie den geschwärzten Text noch einmal und bestätigen Sie, dass keine der vier privaten Angaben übrig ist. Prüfen Sie die aktuellen Datenschutzeinstellungen und Bedingungen des Tools selbst, etwa Chatverlauf oder Trainingsoptionen; diese Lektion prüft die Einstellungen keines Tools und ist keine Rechtsberatung.'
          ],
          file: 'Geschwärzter Prompt',
          code: 'Geschwärzter Text:\n„[PERSON A] ([E-MAIL], [TELEFON]) hat mitgeteilt, dass das Treffen der Ehrenamtlichen am 2030-03-14 um 18:00 in Raum B stattfindet.“\n\nVollständig entfernt: Gesundheitsangabe\nPrivate Angaben im Text: 0 von 4\nDatenschutzeinstellungen des Tools selbst geprüft: JA / NEIN\nOriginalnachricht: privat behalten, nicht eingefügt',
          check: 'Ihr geschwärzter Text enthält keine der vier privaten Angaben, behält 2030-03-14, 18:00 und Raum B, und Sie haben die Einstellungen des Tools selbst geprüft.',
          aiPrompt: 'Schreibe nur anhand dieses geschwärzten Textes eine Erinnerung an das Treffen in zwei Sätzen. Lass die Platzhalter unverändert und rate nicht, wer [PERSON A] ist: [geschwärzter Text].'
        },
        'claims-list': {
          title: 'Eine KI-Antwort in prüfbare Aussagen zerlegen',
          explanation: [
            'KI-Antworten können überzeugt klingen und trotzdem falsch sein. Üben Sie mit dieser fiktiven KI-Zusammenfassung über Riverside Library: „Riverside Library ist 7 Tage die Woche geöffnet, auch samstags 10:00-14:00. Die Mitgliedschaft ist für Einwohner kostenlos. Sie verleiht 50 Laptops und wurde 1952 gegründet (Quelle: City Library Report 2029).“',
            'Zerlegen Sie die Zusammenfassung in einzelne Aussagen, eine Tatsache pro Zeile, und geben Sie jeder eine ID von C1 bis C5. Führen Sie die genannte Quelle getrennt als S1 auf. Bewerten Sie noch nichts; machen Sie zuerst jede Aussage sichtbar, damit sich keine in einem flüssigen Satz versteckt.'
          ],
          file: 'Aussagenliste',
          code: 'C1 | 7 Tage die Woche geöffnet\nC2 | Samstag 10:00-14:00\nC3 | Mitgliedschaft für Einwohner kostenlos\nC4 | Verleiht 50 Laptops\nC5 | Gegründet 1952\nS1 | Genannte Quelle: City Library Report 2029\nBewertungen: noch nicht geprüft',
          check: 'Ihre Liste enthält fünf Aussagen, C1 bis C5, sowie die genannte Quelle S1, mit einer Tatsache pro Zeile und noch ohne Bewertung.',
          aiPrompt: 'Zerlege diesen Text in eine nummerierte Liste einzelner Tatsachenaussagen, eine Tatsache pro Zeile. Füge nichts hinzu, bewerte und korrigiere nichts: [KI-Zusammenfassung].'
        },
        'claims-sources': {
          title: 'Jede Aussage anhand einer echten Quelle prüfen',
          explanation: [
            'Vergleichen Sie jede Aussage ausschließlich mit dem Quellenblatt der Übung: Montag-Freitag 09:00-18:00; Samstag 10:00-14:00; sonntags geschlossen; Mitgliedschaft für Einwohner kostenlos; 12 Laptops, Ausleihe für 2 Stunden. Notieren Sie BELEGT, WIDERLEGT oder QUELLE FEHLT und den genauen Nachweis.',
            'C2 und C3 sind belegt. C1 ist widerlegt, weil die Bibliothek sonntags geschlossen ist, und C4 ist widerlegt, weil das Blatt 12 Laptops nennt. Zu 1952 sagt das Blatt nichts, daher fehlt für C5 eine Quelle. S1 gehört nicht zu Ihren Quellen: Markieren Sie es als ZITAT NICHT GEFUNDEN und erfinden oder „ergänzen“ Sie niemals ein Zitat.'
          ],
          file: 'Quellenprüfung',
          code: 'Quellenblatt (fiktive Übung):\nMontag-Freitag 09:00-18:00 | Samstag 10:00-14:00 | sonntags geschlossen\nMitgliedschaft für Einwohner kostenlos | 12 Laptops, Ausleihe für 2 Stunden\n\nAussage | Nachweis | Bewertung\nC1 7 Tage geöffnet | sonntags geschlossen | WIDERLEGT\nC2 Samstag 10:00-14:00 | aufgeführt | BELEGT\nC3 Für Einwohner kostenlos | aufgeführt | BELEGT\nC4 50 Laptops | Blatt nennt 12 | WIDERLEGT\nC5 Gegründet 1952 | nicht im Blatt | QUELLE FEHLT\nS1 City Library Report 2029 | nicht in den Quellen | ZITAT NICHT GEFUNDEN',
          check: 'Ihre Prüfung ergibt 2 BELEGT, 2 WIDERLEGT und 1 QUELLE FEHLT, und S1 ist ohne erfundenen Ersatz als ZITAT NICHT GEFUNDEN markiert.',
          aiPrompt: 'Vergleiche jede Aussage nur mit diesem Quellenblatt. Zitiere jeweils den passenden Nachweis oder schreibe „nicht in der Quelle“. Nutze kein externes Wissen und erfinde keine Zitate: [Aussagen und Quellenblatt].'
        },
        'claims-verdicts': {
          title: 'Unbelegte Aussagen korrigieren, kennzeichnen oder entfernen',
          explanation: [
            'Schreiben Sie die Zusammenfassung nur mit dem neu, was die Quelle belegt. Korrigieren Sie widerlegte Aussagen mit dem Wortlaut der Quelle: sonntags geschlossen und 12 statt 50 Laptops. Entfernen Sie C5 oder kennzeichnen Sie die Aussage deutlich als UNBESTÄTIGT, bis Sie eine verlässliche Quelle finden.',
            'Entfernen Sie das Zitat, das nicht gefunden wurde. Eine kürzere, korrekte Zusammenfassung ist besser als eine, die vollständig klingt. Bitten Sie die KI erst um Hilfe bei der Formulierung, wenn die Fakten feststehen, und prüfen Sie, dass die Überarbeitung keine entfernte Aussage wieder einführt.'
          ],
          file: 'Korrigierte Zusammenfassung',
          code: 'Korrigierte Zusammenfassung:\n„Riverside Library ist montags bis freitags von 09:00 bis 18:00 und samstags von 10:00 bis 14:00 geöffnet; sonntags ist sie geschlossen. Die Mitgliedschaft ist für Einwohner kostenlos. Sie verleiht 12 Laptops für jeweils 2 Stunden.“\n\nC1: korrigiert | C2: behalten | C3: behalten | C4: auf 12 korrigiert\nC5 gegründet 1952: UNBESTÄTIGT - entfernt\nZitat S1: entfernt - nicht gefunden\nÜberarbeitung erneut mit der Quelle geprüft: JA / NEIN',
          check: 'Ihre korrigierte Zusammenfassung nennt sonntags geschlossen und 12 Laptops, lässt 1952 weg oder kennzeichnet es als UNBESTÄTIGT und enthält kein nicht gefundenes Zitat.',
          aiPrompt: 'Verbessere die Formulierung dieser korrigierten Zusammenfassung, ohne Fakten, Zahlen oder Quellen hinzuzufügen, zu entfernen oder zu ändern: [korrigierte Zusammenfassung].'
        },
        'privacy-review': {
          title: 'Prüfung vor dem Teilen ehrlich festhalten',
          explanation: [
            'Speichern Sie Datenschutzübersicht, geschwärzten Prompt, Aussagenliste, Quellenprüfung und korrigierte Zusammenfassung zusammen als Übungsnachweis. Notieren Sie, was unsicher bleibt. Diese Prüfungen verringern Risiken, sind aber Lernübung, keine Garantie und keine Rechtsberatung.',
            'Riverside Library ist fiktiv, daher gibt es keine echte Redaktion, die das Teilen freigeben kann. Halten Sie die Freigabe als BLOCKIERT fest, behalten Sie die Übung privat und versenden oder veröffentlichen Sie sie nicht. Lassen Sie Leserrückmeldungen und Ergebnisse auf NICHT ERHOBEN; folgen Sie bei echter Arbeit den Regeln Ihrer Organisation und holen Sie eine tatsächliche Freigabe ein.'
          ],
          file: 'Privates Prüfprotokoll',
          code: 'Übungsnachweis: Datenschutzübersicht | geschwärzter Prompt | Aussagenliste | Quellenprüfung | korrigierte Zusammenfassung\nPrivate Angaben in Prompts: 0\nAussagen: 2 BELEGT | 2 WIDERLEGT -> korrigiert | 1 QUELLE FEHLT -> UNBESTÄTIGT\nZitat S1: nicht gefunden - entfernt\nFreigabe der fiktiven Redaktion: BLOCKIERT - keine echte Redaktion\nLeserrückmeldungen: NICHT ERHOBEN\nStatus der Übung: privat; nicht versenden oder veröffentlichen',
          check: 'Ihr Protokoll lässt die Freigabe BLOCKIERT, Rückmeldungen NICHT ERHOBEN, nennt offene Unsicherheiten und hält die Übung privat.',
          aiPrompt: 'Prüfe dieses Übungsprotokoll auf fehlende Prüfungen. Erfinde keine Freigabe, Quellen, Rückmeldungen oder Ergebnisse und gib keine Rechtsberatung: [Übungsprotokoll].'
        }
      }
    },
    es: {
      title: 'Proteger la privacidad y verificar respuestas de IA',
      intro: 'Elimina los datos privados antes de pedir ayuda a la IA y verifica cada afirmación con una fuente. Practica en privado con una biblioteca ficticia; la IA es opcional.',
      steps: {
        'privacy-map': {
          title: 'Detectar información privada antes de escribir el prompt',
          explanation: [
            'Practica con Riverside Library, una biblioteca ficticia, y con la nota ficticia de una persona voluntaria. Todos los nombres, direcciones y números de este ejercicio son inventados; no uses mensajes reales ni personas reales mientras practicas.',
            'Antes de pegar texto en cualquier herramienta de IA, marca cada dato como PRIVADO o SE PUEDE USAR. La nota contiene cuatro datos privados: un nombre, un correo electrónico, un número de teléfono y un dato de salud. Para la tarea solo se necesitan la fecha 2030-03-14, la hora 18:00 y la sala B.'
          ],
          file: 'Mapa de privacidad',
          code: 'Nota ficticia (solo para practicar):\n«Hola, soy Alex Example (alex@example.test, +00 0000 0000). La reunión de voluntarios es el 2030-03-14 a las 18:00 en la sala B. Puede que llegue tarde por una cita médica.»\n\nDato | decisión\nAlex Example | PRIVADO - nombre\nalex@example.test | PRIVADO - correo\n+00 0000 0000 | PRIVADO - teléfono\nCita médica | PRIVADO - dato de salud\n2030-03-14 | SE PUEDE USAR\n18:00 | SE PUEDE USAR\nSala B | SE PUEDE USAR\nTarea: escribir un breve recordatorio de la reunión',
          check: 'Tu mapa marca el nombre, el correo, el teléfono y el dato de salud como PRIVADOS y conserva solo la fecha, la hora y la sala para la tarea.',
          aiPrompt: 'Todavía no pegues la nota. Pregunta en su lugar: ¿qué tipos de datos de un mensaje suelen ser personales o sensibles y deben eliminarse antes de pedir ayuda a una herramienta de IA? Indica solo categorías.'
        },
        'privacy-redact': {
          title: 'Ocultar nombres y datos de contacto',
          explanation: [
            'Antes de escribir el prompt, sustituye cada dato privado por un marcador neutro: [PERSONA A], [CORREO] y [TELÉFONO]. Elimina por completo el dato de salud en lugar de insinuarlo, porque el recordatorio no lo necesita. Mantén la nota original en privado y nunca la pegues en la herramienta.',
            'Vuelve a leer el texto anonimizado y confirma que no queda ninguno de los cuatro datos privados. Revisa tú mismo la configuración de privacidad y las condiciones actuales de la herramienta, como el historial de chats o las opciones de entrenamiento; esta lección no verifica la configuración de ninguna herramienta y no es asesoramiento jurídico.'
          ],
          file: 'Prompt anonimizado',
          code: 'Texto anonimizado:\n«[PERSONA A] ([CORREO], [TELÉFONO]) indicó que la reunión de voluntarios es el 2030-03-14 a las 18:00 en la sala B.»\n\nEliminado por completo: dato de salud\nDatos privados que quedan en el texto: 0 de 4\nConfiguración de privacidad revisada por mí: SÍ / NO\nNota original: guardada en privado, no pegada',
          check: 'Tu texto anonimizado no contiene ninguno de los cuatro datos privados, conserva 2030-03-14, 18:00 y la sala B, y revisaste tú mismo la configuración de la herramienta.',
          aiPrompt: 'Usando solo este texto anonimizado, escribe un recordatorio de la reunión en dos frases. Deja los marcadores tal como están y no adivines quién es [PERSONA A]: [texto anonimizado].'
        },
        'claims-list': {
          title: 'Dividir una respuesta de IA en afirmaciones comprobables',
          explanation: [
            'Las respuestas de IA pueden sonar seguras y aun así ser incorrectas. Practica con este resumen ficticio de Riverside Library generado por IA: «Riverside Library abre los 7 días de la semana, incluido el sábado de 10:00 a 14:00. La inscripción es gratuita para los residentes. Presta 50 portátiles y se fundó en 1952 (fuente: City Library Report 2029).»',
            'Divide el resumen en afirmaciones separadas, un hecho por línea, y asigna a cada una un identificador de C1 a C5. Anota la fuente citada aparte como S1. No juzgues nada todavía; primero haz visible cada afirmación para que ninguna se esconda dentro de una frase fluida.'
          ],
          file: 'Lista de afirmaciones',
          code: 'C1 | Abre los 7 días de la semana\nC2 | Sábado 10:00-14:00\nC3 | Inscripción gratuita para residentes\nC4 | Presta 50 portátiles\nC5 | Fundada en 1952\nS1 | Fuente citada: City Library Report 2029\nVeredictos: aún sin comprobar',
          check: 'Tu lista tiene cinco afirmaciones, de C1 a C5, más la fuente citada S1, con un hecho por línea y todavía sin veredictos.',
          aiPrompt: 'Divide este texto en una lista numerada de afirmaciones factuales separadas, un hecho por línea. No añadas, juzgues ni corrijas nada: [resumen de la IA].'
        },
        'claims-sources': {
          title: 'Comprobar cada afirmación con una fuente real',
          explanation: [
            'Compara cada afirmación solo con la hoja de fuentes del ejercicio: lunes-viernes 09:00-18:00; sábado 10:00-14:00; cerrado el domingo; inscripción gratuita para residentes; 12 portátiles, préstamos de 2 horas. Anota RESPALDADA, CONTRADICHA o FALTA FUENTE y la evidencia exacta.',
            'C2 y C3 están respaldadas. C1 está contradicha porque la biblioteca cierra el domingo, y C4 está contradicha porque la hoja indica 12 portátiles. La hoja no dice nada sobre 1952, así que a C5 le falta una fuente. S1 no está entre tus fuentes: márcala como CITA NO ENCONTRADA y nunca inventes ni «completes» una cita.'
          ],
          file: 'Comprobación de fuentes',
          code: 'Hoja de fuentes (ejercicio ficticio):\nLunes-viernes 09:00-18:00 | sábado 10:00-14:00 | cerrado el domingo\nInscripción gratuita para residentes | 12 portátiles, préstamos de 2 horas\n\nAfirmación | evidencia | veredicto\nC1 Abre 7 días | cerrado el domingo | CONTRADICHA\nC2 Sábado 10:00-14:00 | figura | RESPALDADA\nC3 Gratuita para residentes | figura | RESPALDADA\nC4 50 portátiles | la hoja indica 12 | CONTRADICHA\nC5 Fundada en 1952 | no figura en la hoja | FALTA FUENTE\nS1 City Library Report 2029 | no está entre las fuentes | CITA NO ENCONTRADA',
          check: 'Tu comprobación da 2 RESPALDADAS, 2 CONTRADICHAS y 1 FALTA FUENTE, y S1 está marcada como CITA NO ENCONTRADA sin un sustituto inventado.',
          aiPrompt: 'Compara cada afirmación solo con esta hoja de fuentes. Para cada una, cita la evidencia correspondiente o escribe «no figura en la fuente». No uses conocimiento externo ni inventes citas: [afirmaciones y hoja de fuentes].'
        },
        'claims-verdicts': {
          title: 'Corregir, marcar o eliminar afirmaciones sin respaldo',
          explanation: [
            'Reescribe el resumen usando solo lo que respalda la fuente. Corrige las afirmaciones contradichas con la redacción de la fuente: cerrado el domingo y 12 portátiles en lugar de 50. Elimina C5 o mantenla claramente marcada como NO VERIFICADA hasta que encuentres una fuente fiable.',
            'Elimina la cita que no se encontró. Un resumen más breve y exacto es mejor que uno que parece completo. Pide ayuda a la IA con la redacción solo cuando los hechos estén claros y comprueba que su reescritura no vuelve a introducir ninguna afirmación eliminada.'
          ],
          file: 'Resumen corregido',
          code: 'Resumen corregido:\n«Riverside Library abre de lunes a viernes de 09:00 a 18:00 y el sábado de 10:00 a 14:00; cierra el domingo. La inscripción es gratuita para los residentes. Presta 12 portátiles en préstamos de 2 horas.»\n\nC1: corregida | C2: conservada | C3: conservada | C4: corregida a 12\nC5 fundada en 1952: NO VERIFICADA - eliminada\nCita S1: eliminada - no encontrada\nReescritura comprobada de nuevo con la fuente: SÍ / NO',
          check: 'Tu resumen corregido indica que cierra el domingo y que hay 12 portátiles, omite 1952 o lo marca como NO VERIFICADA y no contiene ninguna cita no encontrada.',
          aiPrompt: 'Mejora la redacción de este resumen corregido sin añadir, eliminar ni cambiar ningún hecho, número o fuente: [resumen corregido].'
        },
        'privacy-review': {
          title: 'Registrar la revisión con honestidad antes de compartir',
          explanation: [
            'Guarda juntos el mapa de privacidad, el prompt anonimizado, la lista de afirmaciones, la comprobación de fuentes y el resumen corregido como registro de práctica. Anota lo que sigue siendo incierto. Estas comprobaciones reducen riesgos, pero son práctica de aprendizaje, no una garantía ni asesoramiento jurídico.',
            'Riverside Library es ficticia, así que no hay un editor real que pueda aprobar que se comparta. Registra la aprobación como BLOQUEADA, mantén el ejercicio en privado y no lo envíes ni lo publiques. Deja los comentarios de lectores y los resultados como NO RECOPILADOS; en un trabajo real, sigue las normas de tu organización y obtén una aprobación real.'
          ],
          file: 'Registro de revisión privado',
          code: 'Registro de práctica: mapa de privacidad | prompt anonimizado | lista de afirmaciones | comprobación de fuentes | resumen corregido\nDatos privados en los prompts: 0\nAfirmaciones: 2 RESPALDADAS | 2 CONTRADICHAS -> corregidas | 1 FALTA FUENTE -> NO VERIFICADA\nCita S1: no encontrada - eliminada\nAprobación del editor ficticio: BLOQUEADA - no hay editor real\nComentarios de lectores: NO RECOPILADOS\nEstado del ejercicio: privado; no enviar ni publicar',
          check: 'Tu registro mantiene la aprobación BLOQUEADA, deja los comentarios NO RECOPILADOS, enumera lo que sigue siendo incierto y mantiene el ejercicio en privado.',
          aiPrompt: 'Revisa este registro de práctica para detectar comprobaciones que falten. No inventes aprobaciones, fuentes, comentarios ni resultados, y no des asesoramiento jurídico: [registro de práctica].'
        }
      }
    }
  }
};
