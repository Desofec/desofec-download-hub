import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const contentServicesTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-content-services': {
    fr: {
      title: 'Préparer un ensemble de services de contenu IA avec vérification',
      intro: 'Créez trois publications et quatre réponses aux questions fréquentes pour une boulangerie fictive, vérifiez les affirmations et ressources, gérez les révisions et préparez une offre honnête. La rédaction IA est facultative. Prévoyez environ 90 minutes, plus le temps des retours.',
      steps: {
        'content-service-brief': {
          title: 'Définir un brief de contenu limité',
          explanation: [
            'Entraînez-vous avec une boulangerie fictive, sans prétendre avoir un vrai client. Les livrables sont trois publications courtes et une FAQ de quatre questions, pas une campagne marketing complète. Demandez à une personne consentante ce que les clients ont besoin de savoir ; consignez les réponses réelles séparément des hypothèses.',
            'Utilisez cette fiche inventée pour l’exercice. Les horaires et l’offre sont des données fictives, pas des faits sur une vraie boutique. Laissez inconnus la livraison, les informations alimentaires et les prix. Ne transmettez ni coordonnées ni informations commerciales confidentielles à un outil IA.'
          ],
          file: 'Brief de contenu',
          code: 'Client fictif : Cedar Bakery\nPublic : clients locaux préparant une visite\nFaits autorisés pour l’exercice : ouvert du mardi au samedi, 08:00-14:00 ; pain et pâtisseries ; retrait au comptoir\nInconnus : prix, livraison, allergènes, régimes particuliers\nLivrables : 3 publications (40-60 mots chacune), 4 réponses FAQ\nTon : accueillant et simple\nResponsable de validation : rôle du propriétaire\nCritère de réussite : informations exactes, pas de ventes promises',
          check: 'Votre brief sépare trois faits autorisés des inconnus et précise les livrables et le responsable de revue.',
          aiPrompt: 'Utilise uniquement ce brief fictif. Liste les faits manquants et cinq questions de découverte neutres. N’invente ni réponses clients, ni prix, ni informations alimentaires, ni résultats marketing : [brief].'
        },
        'content-service-draft': {
          title: 'Rédiger un petit ensemble de contenus',
          explanation: [
            'Rédigez une publication sur la visite, une sur le pain et les pâtisseries, et une sur le retrait au comptoir. Chacune doit compter 40 à 60 mots et proposer une prochaine étape claire. Rédigez manuellement ou utilisez un assistant IA facultatif ; aucun outil payant n’est nécessaire.',
            'Rédigez quatre questions fréquentes : horaires, gamme de produits, retrait et allergènes. La réponse sur les allergènes doit préciser que l’information n’est pas confirmée et que le propriétaire doit fournir une réponse validée. Ne devinez pas les informations de sécurité. Conservez le brouillon dans votre propre document.'
          ],
          file: 'Ensemble de brouillons',
          code: 'Publication 1 : visite et horaires (40-60 mots)\nPublication 2 : pain et pâtisseries (40-60 mots)\nPublication 3 : retrait au comptoir (40-60 mots)\nChacune : une prochaine étape ; aucune affirmation non justifiée\n\nFAQ : Quand êtes-vous ouverts ? Que proposez-vous ? Comment fonctionne le retrait ? Où trouver les informations sur les allergènes ?\nRéponse sur les allergènes : À CONFIRMER avec le propriétaire avant publication.',
          check: 'Vous avez trois publications distinctes et quatre réponses FAQ ; les inconnus sont signalés, pas inventés.',
          aiPrompt: 'Rédige trois publications de 40 à 60 mots et quatre réponses FAQ concises à partir de ce brief fictif autorisé. Propose une prochaine étape par publication. Marque les détails non justifiés À CONFIRMER, notamment les allergènes. Ne promets pas de ventes : [brief].'
        },
        'content-service-quality': {
          title: 'Vérifier les faits, droits et accessibilité',
          explanation: [
            'Créez un registre des affirmations : phrase, fait du brief qui la justifie, décision et correction. Les affirmations sur les ingrédients bio, la fraîcheur garantie, la livraison, les prix ou la santé nécessitent des preuves absentes de cet exercice. Supprimez-les ou signalez-les pour revue par le propriétaire.',
            'Pour chaque image, consignez que vous l’avez créée ou disposez des droits ou de la licence nécessaires. Une composition originale avec du texte suffit. Ajoutez un texte alternatif pertinent, un contraste lisible et des sous-titres corrects pour les vidéos. N’inventez jamais de témoignages et n’utilisez ni image ni voix d’une personne sans autorisation.'
          ],
          file: 'Vérifications de qualité',
          code: 'Affirmation | preuve du brief | conserver / corriger / supprimer\nOuvert dimanche | le brief indique mardi-samedi | SUPPRIMER\nLivraison disponible | aucune preuve | SUPPRIMER\nPain et pâtisseries | fait autorisé pour l’exercice | CONSERVER\n\nRessource | créateur/licence | usage autorisé | texte alternatif\nAucune ressource autorisée ? Utilisez votre propre mise en page textuelle.',
          check: 'Votre registre rejette l’ouverture dominicale et la livraison, conserve la gamme justifiée et documente les droits des ressources.',
          aiPrompt: 'Vérifie mes publications et FAQ par rapport à ce brief fictif. Produis un registre des affirmations et signale celles qui ne sont pas justifiées. Examine les formulations d’accessibilité sans inventer des droits sur les images : [brief et brouillons].'
        },
        'content-service-revisions': {
          title: 'Gérer un cycle de révision limité',
          explanation: [
            'Conservez la version 1 et consignez une demande fictive du réviseur : placer les horaires dans la première phrase et rendre la publication sur le retrait plus concise. Vérifiez que la demande ne modifie pas les faits autorisés.',
            'Créez la version 2 avec un court journal des changements et répétez les vérifications des faits et du nombre de mots. Une demande d’ajout d’un prix non confirmé doit rester en attente, pas devenir un fait publié. Précisez dans la proposition les cycles de révision et livrables inclus ; n’acceptez pas silencieusement des changements illimités.'
          ],
          file: 'Journal des révisions',
          code: 'Version | demande | fait autorisé affecté ? | action | réviseur\nv1 -> v2 | horaires en premier | aucun changement | réordonner et vérifier | rôle du propriétaire\nv1 -> v2 | retrait plus concis | aucun changement | conserver 40-60 mots | rôle du propriétaire\nEn attente | ajouter un prix | prix inconnu | demander un prix vérifié | rôle du propriétaire\nRévisions incluses : un cycle pour cet exercice',
          check: 'Vous conservez les deux versions, consignez les modifications et excluez le prix inconnu du texte validé.',
          aiPrompt: 'Applique uniquement ces révisions autorisées. Conserve les faits et 40 à 60 mots par publication. Liste les changements et laisse la demande de prix en attente : [brief, v1, demandes].'
        },
        'content-service-offer': {
          title: 'Calculer et décrire le service honnêtement',
          explanation: [
            'Utilisez le générateur de propositions pour définir le périmètre, les exclusions, la validation du propriétaire et la livraison. Proposez des brouillons et un cycle de révision, pas une publication automatique ni un trafic garanti. Consignez le temps de rédaction, vérification, révision et transmission.',
            'Calcul illustratif : 1 heure de brief + 2 de rédaction + 1 de vérification + 1 de révision/transmission = 5 heures. Avec une provision de planification interne de 20 EUR/heure, le travail coûte 100 EUR avant dépenses, taxes et frais généraux. Ce n’est ni un tarif de marché, ni une recommandation de prix, ni un bénéfice. Saisissez séparément le prix proposé et vérifiez la volonté de payer.'
          ],
          file: 'Feuille de travail de l’offre',
          code: 'Périmètre : 3 publications + 4 réponses FAQ + un cycle de révision\nExclus : publication, dépenses publicitaires, garanties de ventes, affirmations non vérifiées\nPlanification interne : (1 + 2 + 1 + 1) x 20 EUR = 100 EUR\nFrais supplémentaires / taxes / frais généraux : À CONFIRMER\nPrix proposé : choisi séparément, pas le sous-total des coûts\nLivraison : seulement après validation des faits et ressources par le propriétaire',
          check: 'Votre offre précise le périmètre et les exclusions et distingue les 100 EUR de travail interne du prix de vente.',
          aiPrompt: 'Examine ce périmètre de service pour repérer les livrables flous, les limites de révision et les promesses non justifiées. Vérifie le calcul, mais n’invente ni prix de marché ni demande client : [feuille de travail].'
        },
        'content-service-handoff': {
          title: 'Transmettre un ensemble vérifié et apprendre des retours',
          explanation: [
            'Créez un dossier de livraison avec les textes finaux, le brief validé, le registre des droits, les textes alternatifs et le journal des révisions. Ouvrez chaque fichier et retirez les affirmations non résolues avant de le déclarer prêt. Un vrai client doit autoriser la publication séparément.',
            'Utilisez le suivi des résultats pour consigner quatre contrôles : faits conformes au brief, nombre de mots respecté, droits documentés et validation du propriétaire. Un exercice fictif n’a pas de validation réelle du propriétaire : marquez ce contrôle bloqué au lieu de l’inventer. Décidez de continuer, réviser ou arrêter selon les retours réels, pas selon des ventes prétendues.'
          ],
          file: 'Transmission',
          code: '01-brief-valide\n02-publications-et-faq-finales\n03-ressources-et-textes-alternatifs\n04-journal-des-revisions\n\nContrôles : faits / nombre de mots / droits / validation du propriétaire\nValidation inconnue : BLOQUÉ, pas RÉUSSI\nProchaine action et preuves nécessaires :\nDécision : continuer / réviser / arrêter',
          check: 'Votre dossier s’ouvre correctement, contient les traces de revue et ne présente pas des validations ou ventes fictives comme réelles.',
          aiPrompt: 'Vérifie ma liste de livraison anonymisée pour repérer les preuves manquantes et les affirmations non résolues. N’invente ni validation du propriétaire ni résultats de campagne : [liste].'
        }
      }
    },
    de: {
      title: 'Ein geprüftes KI-Content-Servicepaket vorbereiten',
      intro: 'Erstelle drei Beiträge und vier FAQ-Antworten für eine fiktive Bäckerei, prüfe Aussagen und Materialien, verwalte Überarbeitungen und plane ein ehrliches Angebot. KI-Entwürfe sind optional. Plane etwa 90 Minuten plus Feedbackzeit.',
      steps: {
        'content-service-brief': {
          title: 'Ein begrenztes Content-Briefing vereinbaren',
          explanation: [
            'Übe für eine fiktive Bäckerei und behaupte nicht, einen echten Kunden zu haben. Die Lieferung umfasst drei kurze Beiträge und vier FAQ-Fragen, keine vollständige Marketingkampagne. Frage eine einwilligende Kontaktperson, was Kunden wissen müssen; dokumentiere tatsächliche Antworten getrennt von Annahmen.',
            'Nutze dieses erfundene Faktenblatt für die Übung. Öffnungszeiten und Angebot sind fiktive Übungsdaten, keine Fakten über ein echtes Geschäft. Lieferung, Ernährungsangaben und Preise bleiben unbekannt. Lade keine Kontaktdaten oder vertraulichen Geschäftsinformationen in ein KI-Werkzeug hoch.'
          ],
          file: 'Content-Briefing',
          code: 'Fiktiver Kunde: Cedar Bakery\nZielgruppe: lokale Kunden, die einen Besuch planen\nFreigegebene Übungsfakten: Dienstag-Samstag, 08:00-14:00 geöffnet; Brot und Gebäck; Abholung am Tresen\nUnbekannt: Preise, Lieferung, Allergene, besondere Ernährungsformen\nLieferumfang: 3 Beiträge (je 40-60 Wörter), 4 FAQ-Antworten\nTon: freundlich und einfach\nFreigabeverantwortung: Rolle des Bäckereiinhabers\nErfolgskriterium: korrekte Informationen, keine versprochenen Verkäufe',
          check: 'Dein Briefing trennt drei freigegebene Fakten von Unbekanntem und benennt Lieferumfang und prüfende Rolle.',
          aiPrompt: 'Nutze nur dieses fiktive Briefing. Liste fehlende Fakten und fünf neutrale Recherchefragen auf. Erfinde keine Kundenantworten, Preise, Ernährungsangaben oder Marketingergebnisse: [Briefing].'
        },
        'content-service-draft': {
          title: 'Ein kleines Content-Paket entwerfen',
          explanation: [
            'Schreibe einen Beitrag über den Besuch, einen über Brot und Gebäck und einen über die Abholung am Tresen. Jeder muss 40 bis 60 Wörter und einen klaren nächsten Schritt enthalten. Schreibe selbst oder nutze optional einen KI-Assistenten; kostenpflichtige Werkzeuge sind nicht nötig.',
            'Schreibe vier FAQ-Fragen zu Öffnungszeiten, Sortiment, Abholung und Allergenen. Die Allergenantwort muss auf unbestätigte Informationen hinweisen und eine freigegebene Antwort des Inhabers verlangen. Rate keine Sicherheitsinformationen. Bewahre den Entwurf in deinem eigenen Dokument auf.'
          ],
          file: 'Entwurfspaket',
          code: 'Beitrag 1: Besuch und Öffnungszeiten (40-60 Wörter)\nBeitrag 2: Brot und Gebäck (40-60 Wörter)\nBeitrag 3: Abholung am Tresen (40-60 Wörter)\nJeweils: ein nächster Schritt; keine unbelegten Nutzenversprechen\n\nFAQ: Wann ist geöffnet? Was wird angeboten? Wie funktioniert die Abholung? Wo finde ich Allergeninformationen?\nAllergenantwort: VOR VERÖFFENTLICHUNG mit dem Inhaber KLÄREN.',
          check: 'Du hast drei unterschiedliche Beiträge und vier FAQ-Antworten; Unbekanntes ist markiert statt erfunden.',
          aiPrompt: 'Entwirf drei Beiträge mit je 40 bis 60 Wörtern und vier kurze FAQ-Antworten aus diesem freigegebenen fiktiven Briefing. Nutze einen nächsten Schritt pro Beitrag. Markiere unbelegte Details, besonders Allergene, mit ZU KLÄREN. Versprich keine Verkäufe: [Briefing].'
        },
        'content-service-quality': {
          title: 'Fakten, Rechte und Barrierefreiheit prüfen',
          explanation: [
            'Erstelle ein Aussagenregister: Satz, belegender Briefing-Fakt, Entscheidung und Korrektur. Aussagen über Biozutaten, garantierte Frische, Lieferung, Preise oder Gesundheit benötigen Belege, die diese Übung nicht liefert. Entferne sie oder markiere sie für die Prüfung durch den Inhaber.',
            'Dokumentiere für jedes Bild, dass du es selbst erstellt hast oder die nötige Genehmigung beziehungsweise Lizenz besitzt. Eine eigene einfache Textgrafik genügt. Ergänze aussagekräftigen Alternativtext, lesbaren Kontrast und korrekte Video-Untertitel. Erfinde keine Erfahrungsberichte und nutze weder Abbild noch Stimme einer Person ohne Genehmigung.'
          ],
          file: 'Qualitätsprüfungen',
          code: 'Aussage | Briefing-Beleg | behalten / korrigieren / entfernen\nSonntags geöffnet | Briefing sagt Dienstag-Samstag | ENTFERNEN\nLieferung verfügbar | kein Beleg | ENTFERNEN\nBrot und Gebäck | freigegebener Übungsfakt | BEHALTEN\n\nMaterial | Urheber/Lizenz | erlaubte Nutzung | Alternativtext\nKein freigegebenes Material? Nutze ein eigenes einfaches Textlayout.',
          check: 'Dein Register verwirft Sonntagsöffnung und Lieferung, behält das belegte Sortiment und dokumentiert Materialrechte.',
          aiPrompt: 'Prüfe meine Beiträge und FAQ anhand dieses fiktiven Briefings. Erstelle ein Aussagenregister und markiere unbelegte Aussagen. Prüfe Formulierungen zur Barrierefreiheit, ohne Bildrechte zu erfinden: [Briefing und Entwürfe].'
        },
        'content-service-revisions': {
          title: 'Eine begrenzte Überarbeitungsrunde durchführen',
          explanation: [
            'Bewahre Version 1 auf und dokumentiere eine fiktive Änderungsanfrage: Öffnungszeiten in den ersten Satz verschieben und den Abholbeitrag kürzen. Bestätige, dass die Anfrage die freigegebenen Fakten nicht verändert.',
            'Erstelle Version 2 mit kurzem Änderungsprotokoll und wiederhole Fakten- und Wortzahlprüfung. Eine Anfrage nach einem unbestätigten Preis bleibt offen und darf nicht als Fakt veröffentlicht werden. Vereinbare im Angebot die enthaltenen Überarbeitungsrunden und Lieferungen; akzeptiere nicht stillschweigend unbegrenzte Änderungen.'
          ],
          file: 'Überarbeitungsprotokoll',
          code: 'Version | Anfrage | freigegebener Fakt betroffen? | Aktion | prüfende Rolle\nv1 -> v2 | Öffnungszeiten zuerst | keine Änderung | umstellen und prüfen | Inhaberrolle\nv1 -> v2 | Abholung kürzer | keine Änderung | 40-60 Wörter behalten | Inhaberrolle\nOffen | Preis hinzufügen | Preis unbekannt | geprüften Preis erfragen | Inhaberrolle\nEnthaltene Überarbeitungen: eine Runde für dieses Übungspaket',
          check: 'Du bewahrst beide Versionen auf, protokollierst Änderungen und lässt den unbekannten Preis aus dem freigegebenen Text weg.',
          aiPrompt: 'Wende nur diese freigegebenen Änderungen an. Bewahre Fakten und 40 bis 60 Wörter je Beitrag. Liste Änderungen auf und lasse die Preisanfrage offen: [Briefing, v1, Anfragen].'
        },
        'content-service-offer': {
          title: 'Kosten berechnen und den Service ehrlich beschreiben',
          explanation: [
            'Nutze den Angebotsgenerator für Umfang, Ausschlüsse, Inhaberfreigabe und Lieferbedingungen. Biete Entwürfe und eine Überarbeitungsrunde an, keine automatische Veröffentlichung oder garantierten Traffic. Dokumentiere Zeit für Entwurf, Prüfung, Überarbeitung und Übergabe.',
            'Beispielrechnung: 1 Stunde Briefing + 2 Entwurf + 1 Prüfung + 1 Überarbeitung/Übergabe = 5 Stunden. Bei einem internen Planungsansatz von 20 EUR/Stunde ergeben sich 100 EUR Arbeitskosten vor Ausgaben, Steuern und Gemeinkosten. Dies ist kein Marktpreis, keine Preisempfehlung und kein Gewinn. Trage eine vorgeschlagene Gebühr separat ein und prüfe die Zahlungsbereitschaft.'
          ],
          file: 'Angebotsarbeitsblatt',
          code: 'Umfang: 3 Beiträge + 4 FAQ-Antworten + eine Überarbeitungsrunde\nAusgeschlossen: Veröffentlichung, Werbeausgaben, Verkaufsgarantien, ungeprüfte Aussagen\nInterne Planung: (1 + 2 + 1 + 1) x 20 EUR = 100 EUR\nWeitere Kosten / Steuern / Gemeinkosten: ZU KLÄREN\nVorgeschlagene Gebühr: separat gewählt, nicht die Kostenzwischensumme\nLieferung: erst nach Inhaberfreigabe von Fakten und Materialien',
          check: 'Dein Angebot benennt Umfang und Ausschlüsse und unterscheidet 100 EUR interne Arbeitskosten vom Verkaufspreis.',
          aiPrompt: 'Prüfe diesen Serviceumfang auf unklare Lieferungen, Überarbeitungsgrenzen und unbelegte Versprechen. Prüfe die Rechnung, aber erfinde keinen Marktpreis und keine Kundennachfrage: [Arbeitsblatt].'
        },
        'content-service-handoff': {
          title: 'Ein geprüftes Paket übergeben und aus Feedback lernen',
          explanation: [
            'Erstelle einen Lieferordner mit endgültigen Texten, freigegebenem Briefing, Rechteverzeichnis, Alternativtexten und Änderungsprotokoll. Öffne jede Datei und entferne ungeklärte Aussagen, bevor du sie als bereit markierst. Ein echter Kunde muss die Veröffentlichung separat freigeben.',
            'Dokumentiere im Ergebnistracker vier Prüfungen: Fakten entsprechen dem Briefing, Wortzahlen stimmen, Rechte sind dokumentiert und Inhaberfreigabe liegt vor. Eine fiktive Übung hat keine echte Inhaberfreigabe: Markiere diese Prüfung als blockiert statt sie zu erfinden. Entscheide anhand tatsächlichen Feedbacks über Fortsetzung, Überarbeitung oder Stopp, nicht anhand behaupteter Verkäufe.'
          ],
          file: 'Übergabe',
          code: '01-freigegebenes-briefing\n02-endgueltige-beitraege-und-faq\n03-materialien-und-alternativtexte\n04-aenderungsprotokoll\n\nPrüfungen: Fakten / Wortzahlen / Rechte / Inhaberfreigabe\nUnbekannte Freigabe: BLOCKIERT, nicht BESTANDEN\nNächste Aktion und benötigte Belege:\nEntscheidung: fortsetzen / überarbeiten / stoppen',
          check: 'Dein Paket lässt sich öffnen, enthält Prüfaufzeichnungen und stellt fiktive Freigaben oder Verkäufe nicht als echt dar.',
          aiPrompt: 'Prüfe meine anonymisierte Liefercheckliste auf fehlende Belege und ungeklärte Aussagen. Erfinde keine Inhaberfreigabe oder Kampagnenergebnisse: [Checkliste].'
        }
      }
    },
    es: {
      title: 'Preparar un paquete de servicios de contenido IA con revisión',
      intro: 'Crea tres publicaciones y cuatro respuestas a preguntas frecuentes para una panadería ficticia, verifica afirmaciones y recursos, gestiona revisiones y prepara una oferta honesta. Redactar con IA es opcional. Reserva unos 90 minutos más el tiempo de comentarios.',
      steps: {
        'content-service-brief': {
          title: 'Acordar un resumen de contenido limitado',
          explanation: [
            'Practica para una panadería ficticia, sin afirmar que tienes un cliente real. La entrega consiste en tres publicaciones cortas y cuatro preguntas frecuentes, no una campaña completa. Pregunta a una persona que dé su consentimiento qué necesitan saber los clientes; registra las respuestas reales separadas de las suposiciones.',
            'Usa esta ficha inventada para el ejercicio. Los horarios y la oferta son datos ficticios de práctica, no hechos sobre una tienda real. Deja desconocidos la entrega, las afirmaciones dietéticas y los precios. No subas datos de contacto ni información comercial confidencial a una herramienta de IA.'
          ],
          file: 'Resumen de contenido',
          code: 'Cliente ficticio: Cedar Bakery\nPúblico: clientes locales que preparan una visita\nHechos autorizados para la práctica: abierto martes-sábado, 08:00-14:00; pan y pasteles; recogida en el mostrador\nDesconocido: precios, entrega, alérgenos, dietas especiales\nEntregables: 3 publicaciones (40-60 palabras cada una), 4 respuestas FAQ\nTono: acogedor y sencillo\nResponsable de aprobación: rol del propietario\nCriterio de éxito: información exacta, no ventas prometidas',
          check: 'Tu resumen separa tres hechos autorizados de las incógnitas y nombra los entregables y la persona revisora.',
          aiPrompt: 'Usa solo este resumen ficticio. Enumera los hechos que faltan y cinco preguntas neutrales de descubrimiento. No inventes respuestas de clientes, precios, afirmaciones dietéticas ni resultados de marketing: [resumen].'
        },
        'content-service-draft': {
          title: 'Redactar un pequeño paquete de contenido',
          explanation: [
            'Escribe una publicación sobre visitar la tienda, otra sobre pan y pasteles y otra sobre recoger en el mostrador. Cada una debe tener entre 40 y 60 palabras y un siguiente paso claro. Redacta manualmente o usa un asistente IA opcional; no necesitas herramientas de pago.',
            'Escribe cuatro preguntas frecuentes: horarios, productos, recogida y alérgenos. La respuesta sobre alérgenos debe indicar que la información no está confirmada y que el propietario debe proporcionar una respuesta aprobada. No adivines información de seguridad. Conserva el borrador en tu propio documento.'
          ],
          file: 'Paquete de borradores',
          code: 'Publicación 1: visita y horarios (40-60 palabras)\nPublicación 2: pan y pasteles (40-60 palabras)\nPublicación 3: recogida en mostrador (40-60 palabras)\nCada una: un siguiente paso; ninguna ventaja sin respaldo\n\nFAQ: ¿Cuándo abren? ¿Qué ofrecen? ¿Cómo funciona la recogida? ¿Dónde encuentro información sobre alérgenos?\nRespuesta sobre alérgenos: POR CONFIRMAR con el propietario antes de publicar.',
          check: 'Tienes tres publicaciones distintas y cuatro respuestas FAQ; señalas lo desconocido en vez de inventarlo.',
          aiPrompt: 'Redacta tres publicaciones de 40 a 60 palabras y cuatro respuestas FAQ breves usando este resumen ficticio autorizado. Incluye un siguiente paso por publicación. Marca los detalles sin respaldo POR CONFIRMAR, especialmente los alérgenos. No prometas ventas: [resumen].'
        },
        'content-service-quality': {
          title: 'Verificar hechos, permisos y accesibilidad',
          explanation: [
            'Crea un registro de afirmaciones: frase, hecho del resumen que la respalda, decisión y corrección. Cualquier afirmación sobre ingredientes orgánicos, frescura garantizada, entrega, precio o salud necesita pruebas que este ejercicio no ofrece. Elimínala o márcala para revisión del propietario.',
            'Para cada imagen, registra que la creaste o tienes el permiso o licencia necesarios. Basta un diseño original sencillo con texto. Añade texto alternativo significativo, contraste legible y subtítulos correctos si usas video. Nunca inventes testimonios ni uses la imagen o voz de una persona sin permiso.'
          ],
          file: 'Controles de calidad',
          code: 'Afirmación | prueba del resumen | conservar / corregir / eliminar\nAbierto el domingo | el resumen dice martes-sábado | ELIMINAR\nEntrega disponible | sin pruebas | ELIMINAR\nPan y pasteles | hecho autorizado para la práctica | CONSERVAR\n\nRecurso | creador/licencia | uso permitido | texto alternativo\n¿Sin recurso autorizado? Usa tu propio diseño sencillo con texto.',
          check: 'Tu registro rechaza la apertura dominical y la entrega, conserva los productos respaldados y documenta los permisos de los recursos.',
          aiPrompt: 'Audita mis publicaciones y FAQ frente a este resumen ficticio. Devuelve un registro y señala las afirmaciones sin respaldo. Revisa la accesibilidad del texto sin inventar permisos de imágenes: [resumen y borradores].'
        },
        'content-service-revisions': {
          title: 'Gestionar una ronda limitada de revisiones',
          explanation: [
            'Conserva la versión 1 y registra una petición ficticia de revisión: poner los horarios en la primera frase y hacer más concisa la publicación sobre recogida. Confirma que la petición no cambia los hechos autorizados.',
            'Crea la versión 2 con un registro breve de cambios y repite los controles de hechos y palabras. Una petición de añadir un precio sin confirmar debe quedar pendiente, no convertirse en un hecho publicado. Acuerda en la propuesta cuántas rondas y entregables se incluyen; no aceptes cambios ilimitados de forma silenciosa.'
          ],
          file: 'Registro de revisiones',
          code: 'Versión | petición | ¿afecta un hecho autorizado? | acción | revisor\nv1 -> v2 | horarios primero | sin cambio | reordenar y comprobar | rol del propietario\nv1 -> v2 | recogida más concisa | sin cambio | conservar 40-60 palabras | rol del propietario\nPendiente | añadir precio | precio desconocido | pedir precio verificado | rol del propietario\nRevisiones incluidas: una ronda para este paquete de práctica',
          check: 'Conservas ambas versiones, registras los cambios y excluyes el precio desconocido del texto aprobado.',
          aiPrompt: 'Aplica solo estas revisiones autorizadas. Conserva los hechos y entre 40 y 60 palabras por publicación. Enumera los cambios y deja pendiente la petición del precio: [resumen, v1, peticiones].'
        },
        'content-service-offer': {
          title: 'Calcular y describir el servicio honestamente',
          explanation: [
            'Usa el generador de propuestas para definir alcance, exclusiones, aprobación del propietario y condiciones de entrega. Ofrece borradores y una ronda de revisión, no publicación automática ni tráfico garantizado. Registra el tiempo dedicado a redactar, verificar, revisar y entregar.',
            'Cálculo ilustrativo: 1 hora de resumen + 2 de redacción + 1 de comprobación + 1 de revisión/entrega = 5 horas. Con una asignación interna de planificación de 20 EUR/hora, el trabajo cuesta 100 EUR antes de gastos, impuestos y costes generales. No es una tarifa de mercado, recomendación de precio ni beneficio. Introduce por separado una tarifa propuesta y valida la disposición a pagar.'
          ],
          file: 'Hoja de trabajo de la oferta',
          code: 'Alcance: 3 publicaciones + 4 respuestas FAQ + una ronda de revisión\nExcluido: publicación, publicidad pagada, garantías de ventas, afirmaciones no verificadas\nPlanificación interna: (1 + 2 + 1 + 1) x 20 EUR = 100 EUR\nCostes adicionales / impuestos / costes generales: POR CONFIRMAR\nTarifa propuesta: elegida por separado, no el subtotal de costes\nEntrega: solo después de aprobar hechos y recursos el propietario',
          check: 'Tu oferta indica alcance y exclusiones y distingue los 100 EUR de trabajo interno del precio de venta.',
          aiPrompt: 'Revisa este alcance de servicio para detectar entregables poco claros, límites de revisión y promesas sin respaldo. Comprueba el cálculo, pero no inventes un precio de mercado ni demanda de clientes: [hoja de trabajo].'
        },
        'content-service-handoff': {
          title: 'Entregar un paquete revisado y aprender de los comentarios',
          explanation: [
            'Crea una carpeta de entrega con textos finales, resumen aprobado, registro de permisos, texto alternativo y registro de revisiones. Abre cada archivo y elimina afirmaciones sin resolver antes de marcarlo como listo. Un cliente real debe aprobar la publicación por separado.',
            'Usa el seguimiento de resultados para registrar cuatro controles: hechos acordes al resumen, palabras dentro del límite, permisos documentados y aprobación del propietario existente. Un ejercicio ficticio no tiene aprobación real del propietario: marca ese control como bloqueado en lugar de inventarlo. Decide continuar, revisar o parar a partir de comentarios reales, no ventas afirmadas.'
          ],
          file: 'Entrega',
          code: '01-resumen-aprobado\n02-publicaciones-y-faq-finales\n03-recursos-y-texto-alternativo\n04-registro-de-revisiones\n\nControles: hechos / número de palabras / permisos / aprobación del propietario\nAprobación desconocida: BLOQUEADO, no APROBADO\nSiguiente acción y pruebas necesarias:\nDecisión: continuar / revisar / parar',
          check: 'Tu paquete se abre correctamente, contiene registros de revisión y no presenta aprobaciones ni ventas ficticias como reales.',
          aiPrompt: 'Revisa mi lista de entrega anonimizada para detectar pruebas que faltan y afirmaciones sin resolver. No inventes aprobación del propietario ni resultados de campaña: [lista].'
        }
      }
    }
  }
};
