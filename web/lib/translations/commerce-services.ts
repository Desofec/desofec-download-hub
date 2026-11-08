import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const commerceServicesTranslations: Record<string, {
  fr: TutorialTranslation; de: TutorialTranslation; es: TutorialTranslation;
}> = {
  'ai-online-retail': {
    fr: {
      title: 'Commerce de détail en ligne avec l’IA',
      intro: 'Explorez un modèle de vente indépendant des plateformes : fiches produits factuelles, coûts vérifiés, stocks et assistance client. Utilisez des données fictives et une IA facultative ; aucune boutique, aucun paiement ni achat réel.',
      steps: {
        'retail-model-and-brief': {
          title: 'Choisir un petit modèle de vente en ligne',
          explanation: [
            'Un détaillant en ligne vend des produits et reste responsable de son offre, de l’exécution des commandes et du support client. Il se distingue d’une marketplace reliant des vendeurs indépendants et d’un prestataire logistique qui gère les biens d’autres entreprises. Entraînez-vous avec Cedar Stationery fictive : une fiche de carnet, deux lignes de stock et un rapport hebdomadaire. Aucun achat, compte vendeur ni outil IA payant.',
            'Avant tout travail réel, posez à des clients potentiels consentants des questions neutres sur leurs besoins, leurs solutions actuelles et leurs attentes de livraison. Séparez les preuves des suppositions ; sans entretien, la demande reste UNVALIDATED. Vérifiez pays, catégorie produit, fournisseur et canal de vente ainsi que sécurité, taxes, droits des consommateurs et règles de plateforme auprès de sources et conseillers appropriés.',
            'Pour une future boutique, comparez solutions hébergées, marketplaces et site sur mesure selon les coûts totaux, les exports, l’accessibilité et l’assistance. Le propriétaire s’inscrit et vérifie directement le service choisi. Commencez par un brouillon/test, des faits approuvés, un plan d’exécution et une politique de retours ; ne publiez ni n’acceptez de paiements avant revue. Ne mettez jamais mots de passe, pièces d’identité ou dossiers clients dans un chat IA.'
          ],
          file: 'Brief de vente fictif',
          code: 'Entreprise : Cedar Stationery (fictive)\nSKU NB-A : lot de 2 carnets ; A5 ; 80 pages lignées chacun ; couverture papier\nInconnus : fournisseur, marque, certifications, identifiant produit, demande réelle\nPays / canal / exigences vérifiées : TO CONFIRM\nLivrables : brouillon de fiche + feuille de stock + rapport hebdomadaire\nRéviseur : rôle du propriétaire ; approbation réelle NOT AVAILABLE\nExclus : publication, paiements, achats, publicité et conseil juridique/fiscal',
          check: 'Votre brief distingue vente, marketplace et logistique ; demande, fournisseur et exigences restent non validés sans preuve.',
          aiPrompt: 'Aide-moi à cadrer ce détaillant fictif. Rédige cinq questions neutres de découverte client et compare boutique hébergée, marketplace et site sur mesure sans inventer demande, prix ou éligibilité. Indique les éléments à revoir par le propriétaire ou un spécialiste. Ne demande aucun identifiant : [brief].'
        },
        'retail-cost-and-fulfillment': {
          title: 'Comparer l’exécution et calculer la contribution',
          explanation: [
            'Comparez le stockage et l’expédition par vous-même, un prestataire d’exécution et l’expédition directe par le fournisseur. Vérifiez fiabilité, autorisations, visibilité du stock, qualité, promesses de livraison et responsabilités de retour ; externaliser ne supprime pas les obligations du détaillant. L’IA peut organiser les questions, pas certifier un fournisseur ni garantir une livraison.',
            'Exemple USD inventé : prix 20, produit 6, canal/paiement 3, emballage/livraison 4, approvisionnement 1 et retours 1. Contribution : 20 - 6 - 3 - 4 - 1 - 1 = USD 5 par unité, soit 25 % du prix. Ce n’est pas un bénéfice net : stockage, publicité, frais généraux et taxes sont exclus. Ces montants ne sont pas des devis.',
            'Comparez chaque option d’exécution avec des coûts provenant de sources indépendantes pour un prix et une quantité identiques. Consignez source/date et laissez les inconnues TO CONFIRM, pas zéro. Utilisez un tableur et vérifiez à la main avant de demander à l’IA d’expliquer les compromis. Ne commandez pas de stock et ne modifiez pas automatiquement les promesses de livraison.'
          ],
          file: 'Feuille de coûts illustrative (USD)',
          code: 'A1 Price | B1 20\nA2 Product | B2 6\nA3 Channel/payment allowance | B3 3\nA4 Packing/delivery allowance | B4 4\nA5 Inbound allowance | B5 1\nA6 Returns allowance | B6 1\nA7 Contribution | B7 =B1-SUM(B2:B6)\nA8 Contribution / price | B8 =B7/B1 (percent)\nAttendu : USD 5 ; 25%\nMontants inventés, pas des devis.\nExclus/inconnus : stockage, publicité, frais généraux, taxes\nCoût réel | source | date de vérification | éléments non résolus :',
          check: 'Vous retrouvez USD 5 et 25 %, identifiez les coûts exclus et distinguez contribution et bénéfice net.',
          aiPrompt: 'Vérifie cette feuille fictive en USD et montre soustraction et ratio. Compare les options comme des possibilités, pas des recommandations. Les coûts manquants restent non résolus ; n’invente ni vérification fournisseur ni frais : [feuille].'
        },
        'retail-listing-and-ai': {
          title: 'Rédiger avec l’IA une fiche produit factuelle',
          explanation: [
            'Rédigez un titre de travail, trois puces et une courte description avec les seuls faits NB-A. Exemple : A5 Ruled Notebooks, 80 Pages Each, Pack of 2. Gardez le texte dans un document privé ou une boutique en brouillon. Le propriétaire doit confirmer identifiants, images, disponibilité, livraison et règles du canal.',
            'Demandez à l’IA de signaler les faits manquants, pas de les compléter. Rejetez les affirmations « imperméable », « recyclé », « écologique » et « productivité garantie », non étayées par le brief. Ne copiez pas de concurrents, n’inventez pas d’avis et n’utilisez pas d’image sans licence. Les images doivent représenter fidèlement le produit ; une illustration générée ne prouve aucune caractéristique.',
            'Créez un registre affirmation/preuve/décision et conservez v1/v2 après une révision contrôlée. Vérifiez lisibilité, texte alternatif, affirmations étayées et règles actuelles du canal. Un texte clair ne garantit ni classement, ni ventes, ni conformité ; la publication exige l’accord du propriétaire.'
          ],
          file: 'Fiche et registre des affirmations',
          code: 'Titre : A5 Ruled Notebooks, 80 Pages Each, Pack of 2\nTrois puces : quantité / taille / pages lignées et couverture\nDescription : résumé factuel seulement\nAffirmation | preuve | décision\n2 carnets | quantité approuvée du lot | KEEP\n80 pages lignées chacun | brief | KEEP\nImperméable | aucune preuve | REMOVE\nPapier recyclé | aucune preuve | REMOVE\nMarque / identifiant | inconnu | TO CONFIRM\nv1 -> v2 : avancer la quantité ; préserver les faits\nStatut : DRAFT - OWNER REVIEW REQUIRED',
          check: 'Titre, trois puces et description utilisent des faits étayés ; le registre rejette imperméabilité et papier recyclé.',
          aiPrompt: 'Rédige un titre, trois puces factuelles et une courte description à partir de ce brief fictif. Rends un registre affirmation/preuve/décision. Marque les inconnus TO CONFIRM ; rejette les affirmations non étayées, le texte copié et les avis inventés. Ne promets ni ventes ni conformité : [brief].'
        },
        'retail-inventory-planning': {
          title: 'Vérifier les seuils de stock avant réapprovisionnement',
          explanation: [
            'Créez les colonnes SKU, unités vendues en 14 jours, stock utilisable, arrivages confirmés, délai en jours et réserve. NB-A : 28, 18, 0, 10, 6 ; PN-B : 14, 30, 0, 7, 4. Ce sont des chiffres agrégés fictifs, pas des données clients. Gardez les lignes sources intactes.',
            'Moyenne quotidienne = ventes/14 ; seuil = moyenne x délai + réserve ; position simplifiée = stock utilisable + arrivages confirmés. NB-A : 2/jour, seuil 26, position 18 : REVIEW ; PN-B : 1/jour, seuil 11, position 30 : HOLD. Couverture NB-A = 18/2 = 9 jours. REVIEW n’est ni une quantité de commande ni une autorisation d’achat.',
            'Validez les entrées avant les formules : délai manquant = TO CONFIRM, pas zéro/HOLD. La planification réelle exige aussi réservations, saisonnalité, minimums de commande, trésorerie et prise en compte de l’incertitude. Une moyenne sur 14 jours n’est pas une prévision fiable. L’IA peut expliquer les indicateurs et preuves manquantes ; le propriétaire autorise le réapprovisionnement.'
          ],
          file: 'Feuille de stock',
          code: 'SKU | sold_14d | usable_stock | confirmed_inbound | lead_days | buffer\nNB-A | 28 | 18 | 0 | 10 | 6\nPN-B | 14 | 30 | 0 | 7 | 4\nColonnes A:F ; ligne 2 :\nG2 =B2/14\nH2 =G2*E2+F2\nI2 =C2+D2\nJ2 =IF(I2<=H2,"REVIEW","HOLD")\nAttendu NB-A : 2 | 26 | 18 | REVIEW\nAttendu PN-B : 1 | 11 | 30 | HOLD\nCouverture NB-A : 9 jours\nNe copier les formules qu’après vérification d’entrées numériques non négatives.\nDélai manquant : TO CONFIRM. Les séparateurs varient selon la langue.',
          check: 'Vous retrouvez les deux seuils et indicateurs ainsi que 9 jours ; le délai manquant reste non résolu.',
          aiPrompt: 'Vérifie ces lignes fictives : moyenne = ventes/14, seuil = moyenne x délai + réserve, position = stock + arrivages. Montre les calculs. Signale valeurs manquantes, négatives ou non numériques sans les remplacer par zéro. Explique pourquoi REVIEW n’est pas une instruction d’achat : [lignes].'
        },
        'retail-report-and-support': {
          title: 'Créer un rapport vérifié et un brouillon de support',
          explanation: [
            'Pour la période distincte de sept jours du 2030-01-07 au 2030-01-13 inclus : NB-A, 10 ventes à USD 20 avec USD 20 remboursés ; PN-B, 5 ventes à USD 10 sans remboursement. Montant brut = USD 250, remboursements = USD 20, après remboursements = USD 230. Frais, taxes et autres ajustements sont exclus : ce n’est ni bénéfice ni argent encaissé.',
            'Demandez à l’IA un rapport de cinq phrases avec dates, chiffres rapprochés, indicateurs de stock étiquetés séparément, limites et questions suivantes. Recalculez chaque nombre. Sans données de la période précédente, croissance/tendances = UNKNOWN ; un remboursement ne prouve pas la satisfaction.',
            'Rédigez un accusé poli pour un colis fictif manquant et demandez au propriétaire d’enquêter dans le workflow approuvé. Ne promettez ni date de livraison ni remboursement, ne demandez pas de données privées au chat IA et n’envoyez rien automatiquement. Avant de répondre, le propriétaire vérifie commande, droits des consommateurs et politique.'
          ],
          file: 'Rapport hebdomadaire fictif',
          code: 'Période : 2030-01-07 au 2030-01-13 inclus ; USD\nSKU | units | price | refund amount\nNB-A | 10 | 20 | 20\nPN-B | 5 | 10 | 0\nBrut : 10*20 + 5*10 = 250\nRemboursements : 20\nAprès remboursements : 230\nBénéfice / argent reçu / croissance : UNKNOWN\nStock : échantillon distinct de 14 jours ; NB-A REVIEW, PN-B HOLD\nSupport : colis non reçu ; résultat UNKNOWN\nStatut rapport/message : OWNER REVIEW REQUIRED',
          check: 'Votre rapport rapproche 250/20/230 sans prétendre au bénéfice ou à la croissance ; le brouillon n’invente pas de résultat.',
          aiPrompt: 'Rédige cinq phrases avec ces chiffres hebdomadaires fictifs. Distingue brut/après remboursement du bénéfice/argent encaissé. Sépare la période de stock ; n’invente pas de croissance. Rédige un accusé colis manquant sans promesse, demande de données privées ou envoi automatique : [données].'
        },
        'retail-service-handover': {
          title: 'Livrer un ensemble d’entraînement au support de vente limité',
          explanation: [
            'Rassemblez le brief, les textes v1/v2, le registre d’affirmations, hypothèses de coûts, lignes sources de stock, formules vérifiées, rapport et brouillon de support. Rouvrez les fichiers et consignez les contrôles réellement effectués. Un CSV ne contient pas les formules ni plusieurs feuilles d’un classeur. Étiquetez tout FICTIONAL PRACTICE.',
            'Limitez le service initial à un brouillon de fiche, une revue de stock de deux SKU et un rapport, avec une révision. Séparez temps/coûts internes et honoraires proposés. Excluez publication, achats, paiements, publicité, garanties et certification juridique/fiscale. Avant un travail réel, convenez des données autorisées, accès limité, conservation/suppression, réviseur et transmission.',
            'L’approbation réelle du propriétaire est indisponible : BLOCKED, jamais PASS. Décidez de pratiquer, réviser, arrêter ou chercher une découverte consentie fondée sur des preuves réelles. L’IA aide aux brouillons et explications, pas à la propriété ni à l’approbation. Continuer ne lance pas une boutique réelle.'
          ],
          file: 'Transmission vente',
          code: 'Brief | fiche v1/v2 | registre des affirmations | sources des coûts\nStock brut/travail/contrôles | rapport | brouillon support | journal des versions\nContrôles : 5/25% ; 26/11 ; 250/20/230 ; fichiers rouverts\nApprobation réelle du propriétaire : BLOCKED - fictional practice\nPérimètre/exclusions, temps réel, coûts internes, honoraires proposés séparément :\nDonnées/accès autorisés, conservation/suppression, réviseur :\nDécision et preuves requises :',
          check: 'Votre portfolio étiqueté est traçable, exclut les actions réelles et garde l’approbation réelle bloquée.',
          aiPrompt: 'Examine cette transmission fictive : preuves manquantes, périmètre flou, risques d’accès/données et promesses non étayées. Sépare coûts internes et honoraires. N’invente ni approbation, revenu ni conformité : [ensemble].'
        }
      }
    },
    de: {
      title: 'KI-gestützten Onlinehandel planen',
      intro: 'Erkunde ein plattformneutrales Handelsmodell mit sachlichen Produktentwürfen, geprüften Kosten, Bestandsplanung und Kundenservice. Nutze fiktive Daten und optional KI; Shop, Zahlungen und Einkäufe werden nicht aktiviert.',
      steps: {
        'retail-model-and-brief': {
          title: 'Ein kleines Onlinehandelsmodell wählen',
          explanation: [
            'Ein Onlinehändler verkauft Produkte und bleibt für Angebot, Auftragsabwicklung und Kundenservice verantwortlich. Das unterscheidet ihn von einem Marktplatz, der unabhängige Verkäufer verbindet, und einem Logistikdienstleister, der Waren für andere Unternehmen handhabt. Übe mit dem fiktiven Cedar Stationery: ein Notizbuchangebot, zwei Bestandszeilen und ein Wochenbericht. Keine Einkäufe, Verkäuferkonten oder kostenpflichtige KI nötig.',
            'Frage vor echter Arbeit einwilligende potenzielle Kunden neutral nach Bedarf, bestehenden Alternativen und Liefererwartungen. Trenne Belege von Vermutungen; ohne Interviews bleibt Nachfrage UNVALIDATED. Prüfe Land, Produktkategorie, Lieferant und Vertriebskanal sowie Sicherheit, Steuern, Verbraucherrechte und Plattformregeln mit geeigneten Quellen/Fachleuten.',
            'Vergleiche für einen künftigen Shop gehostete Shops, Marktplätze und Eigenentwicklungen nach Gesamtkosten, Exporten, Barrierefreiheit und Support. Der Eigentümer registriert und verifiziert den Dienst direkt. Beginne mit Entwurf/Test, freigegebenen Produktfakten, Fulfillment- und Retourenplan; nicht veröffentlichen und keine Zahlung annehmen, bevor die Prüfung abgeschlossen ist. Niemals Passwörter, Ausweise oder Kundendaten in KI-Chats eingeben.'
          ],
          file: 'Fiktives Handelsbriefing',
          code: 'Unternehmen: Cedar Stationery (fiktiv)\nSKU NB-A: Packung mit 2 Notizbüchern; A5; je 80 linierte Seiten; Papierumschlag\nUnbekannt: Lieferant, Marke, Zertifizierungen, Produktkennung, echte Nachfrage\nLand / Kanal / geprüfte Anforderungen: TO CONFIRM\nErgebnisse: Angebotsentwurf + Bestandsblatt + Wochenbericht\nPrüfer: Rolle des Eigentümers; echte Freigabe NOT AVAILABLE\nAusgeschlossen: Veröffentlichung, Zahlungen, Einkäufe, Werbung und Rechts-/Steuerberatung',
          check: 'Das Briefing unterscheidet Handel, Marktplatz und Logistik; Nachfrage, Lieferant und Anforderungen bleiben ohne Beleg unvalidiert.',
          aiPrompt: 'Hilf mir, diesen fiktiven Onlinehändler abzugrenzen. Schreibe fünf neutrale Kundenfragen und vergleiche gehosteten Shop, Marktplatz und Eigenentwicklung ohne Nachfrage, Preise oder Zulassung zu erfinden. Nenne Punkte für Eigentümer/Fachprüfung. Keine Zugangsdaten erfragen: [Briefing].'
        },
        'retail-cost-and-fulfillment': {
          title: 'Auftragsabwicklung vergleichen und Deckungsbeitrag berechnen',
          explanation: [
            'Vergleiche eigene Lagerung und Versand, einen Fulfillment-Anbieter und Direktversand durch den Lieferanten. Prüfe Zuverlässigkeit, Berechtigungen, Bestandsübersicht, Produktqualität, Lieferzusagen und Retourenverantwortung; Auslagerung hebt die Händlerpflichten nicht auf. KI kann Fragen ordnen, aber keine Lieferanten zertifizieren oder Zustellung garantieren.',
            'Erfundenes USD-Beispiel: Verkaufspreis 20, Produkt 6, Kanal/Zahlung 3, Verpackung/Lieferung 4, Wareneingang 1 und Retouren 1. Deckungsbeitrag: 20 - 6 - 3 - 4 - 1 - 1 = USD 5 je Stück bzw. 25 % des Preises. Kein Nettogewinn: Lager, Werbung, Gemeinkosten und Steuern fehlen. Keine Anbieterangebote.',
            'Vergleiche Optionen anhand unabhängig belegter Kosten für denselben Preis und dieselbe Menge. Quelle/Datum erfassen und Unbekanntes TO CONFIRM statt null lassen. Tabellenkalkulation verwenden und manuell prüfen, bevor KI Abwägungen erklärt. Keine Bestände bestellen und keine Lieferzusagen automatisch ändern.'
          ],
          file: 'Beispiel-Kostenblatt (USD)',
          code: 'A1 Price | B1 20\nA2 Product | B2 6\nA3 Channel/payment allowance | B3 3\nA4 Packing/delivery allowance | B4 4\nA5 Inbound allowance | B5 1\nA6 Returns allowance | B6 1\nA7 Contribution | B7 =B1-SUM(B2:B6)\nA8 Contribution / price | B8 =B7/B1 (percent)\nErwartet: USD 5; 25%\nBeträge erfunden, keine Preisangebote.\nAusgeschlossen/unbekannt: Lager, Werbung, Gemeinkosten, Steuern\nTatsächliche Kosten | Quelle | Prüfdatum | offene Punkte:',
          check: 'Du erhältst USD 5 und 25 %, nennst ausgeschlossene Kosten und unterscheidest Deckungsbeitrag vom Nettogewinn.',
          aiPrompt: 'Prüfe dieses fiktive USD-Kostenblatt und zeige Subtraktion und Verhältnis. Vergleiche Fulfillment-Optionen als Möglichkeiten, nicht Empfehlungen. Fehlende Kosten bleiben offen; keine Lieferantenprüfung oder Gebühren erfinden: [Blatt].'
        },
        'retail-listing-and-ai': {
          title: 'Mit KI sachliche Produkttexte entwerfen',
          explanation: [
            'Entwirf Arbeitstitel, drei Stichpunkte und kurze Beschreibung nur mit NB-A-Fakten. Beispiel: A5 Ruled Notebooks, 80 Pages Each, Pack of 2. Bewahre den Text in einem privaten Dokument oder Shop-Entwurf auf. Der Eigentümer muss Kennungen, Bilder, Verfügbarkeit, Lieferbedingungen und Kanalregeln bestätigen.',
            'Bitte die KI, fehlende Fakten zu markieren, nicht zu ergänzen. Unbelegte Aussagen wie wasserfest, recycelt, umweltfreundlich oder garantierte Produktivität ablehnen. Keine Wettbewerbertexte kopieren, Rezensionen erfinden oder unlizenzierte Bilder verwenden. Produktbilder müssen die Ware korrekt zeigen; KI-Illustrationen sind kein Beleg für Produkteigenschaften.',
            'Führe ein Behauptungs-/Beleg-/Entscheidungsregister und speichere v1/v2 nach einer kontrollierten Überarbeitung. Prüfe Lesbarkeit, Alternativtexte, Belege und aktuelle Kanalregeln selbst. Klarer Text garantiert weder Ranking, Umsatz noch Compliance; Veröffentlichung braucht Eigentümerfreigabe.'
          ],
          file: 'Angebot und Behauptungsregister',
          code: 'Titel: A5 Ruled Notebooks, 80 Pages Each, Pack of 2\nDrei Stichpunkte: Menge / Größe / linierte Seiten und Umschlag\nBeschreibung: nur sachliche Zusammenfassung\nBehauptung | Beleg | Entscheidung\n2 Notizbücher | genehmigte Packungsmenge | KEEP\nJe 80 linierte Seiten | Briefing | KEEP\nWasserfest | kein Beleg | REMOVE\nRecyclingpapier | kein Beleg | REMOVE\nMarke / Kennung | unbekannt | TO CONFIRM\nv1 -> v2: Menge nach vorne; Fakten bewahren\nStatus: DRAFT - OWNER REVIEW REQUIRED',
          check: 'Titel, drei Stichpunkte und Beschreibung nutzen belegte Fakten; das Register lehnt wasserfest und Recyclingpapier ab.',
          aiPrompt: 'Entwirf Titel, drei sachliche Stichpunkte und kurze Beschreibung aus diesem fiktiven Briefing. Erstelle ein Behauptungs-/Beleg-/Entscheidungsregister. Unbekanntes als TO CONFIRM markieren; unbelegte Aussagen, kopierte Texte und erfundene Rezensionen ablehnen. Keine Umsatz- oder Compliance-Zusagen: [Briefing].'
        },
        'retail-inventory-planning': {
          title: 'Bestandsschwellen vor Nachbestellung prüfen',
          explanation: [
            'Erstelle Spalten für SKU, verkaufte Einheiten in 14 Tagen, verwendbarer Bestand, bestätigter Zugang, Lieferzeit in Tagen und Puffer. NB-A: 28, 18, 0, 10, 6; PN-B: 14, 30, 0, 7, 4. Das sind fiktive Summenwerte, keine Kundendaten. Originalzeilen unverändert lassen.',
            'Tagesdurchschnitt = Verkauf/14; Schwelle = Durchschnitt x Lieferzeit + Puffer; vereinfachte Position = verwendbarer Bestand + bestätigter Zugang. NB-A: 2/Tag, Schwelle 26, Position 18: REVIEW; PN-B: 1/Tag, Schwelle 11, Position 30: HOLD. NB-A-Reichweite = 18/2 = 9 Tage. REVIEW ist weder Bestellmenge noch Kaufgenehmigung.',
            'Eingaben vor Formeln prüfen: fehlende Lieferzeit = TO CONFIRM, nicht null/HOLD. Echte Planung braucht Reservierungen, Saisonalität, Mindestmengen, Liquidität und Unsicherheitsbehandlung. Ein 14-Tage-Durchschnitt ist keine zuverlässige Prognose. KI kann Kennzeichen/offene Belege erklären; Nachbestellung genehmigt der Eigentümer.'
          ],
          file: 'Bestandsblatt',
          code: 'SKU | sold_14d | usable_stock | confirmed_inbound | lead_days | buffer\nNB-A | 28 | 18 | 0 | 10 | 6\nPN-B | 14 | 30 | 0 | 7 | 4\nSpalten A:F; Zeile 2:\nG2 =B2/14\nH2 =G2*E2+F2\nI2 =C2+D2\nJ2 =IF(I2<=H2,"REVIEW","HOLD")\nErwartet NB-A: 2 | 26 | 18 | REVIEW\nErwartet PN-B: 1 | 11 | 30 | HOLD\nNB-A-Reichweite: 9 Tage\nFormeln erst nach Prüfung nicht-negativer Zahlen kopieren.\nFehlende Lieferzeit: TO CONFIRM. Trennzeichen unterscheiden sich regional.',
          check: 'Du erhältst beide Schwellen/Kennzeichen und 9 Tage Reichweite; fehlende Lieferzeit bleibt ungeklärt.',
          aiPrompt: 'Prüfe diese fiktiven Zeilen mit Tageswert = Verkauf/14, Schwelle = Tageswert x Lieferzeit + Puffer und Position = Bestand + Zugang. Zeige beide Rechnungen. Fehlende, negative oder nicht numerische Werte ohne Null-Ersatz markieren. Erkläre, warum REVIEW keine Kaufanweisung ist: [Zeilen].'
        },
        'retail-report-and-support': {
          title: 'Geprüften Bericht und Supportentwurf erstellen',
          explanation: [
            'Für den separaten Zeitraum 2030-01-07 bis einschließlich 2030-01-13: NB-A 10 Stück zu USD 20 mit USD 20 Erstattung; PN-B 5 Stück zu USD 10 ohne Erstattung. Bruttowarenwert = USD 250, Erstattungen = USD 20, nach Erstattung = USD 230. Gebühren, Steuern und weitere Anpassungen fehlen: kein Gewinn und kein Zahlungseingang.',
            'Bitte die KI um einen Fünf-Satz-Bericht mit Zeitraum, abgeglichenen Zahlen, getrennt gekennzeichneten Bestandsindikatoren, Grenzen und Folgefragen. Jede Zahl nachrechnen. Ohne Vorperiodendaten sind Wachstum/Trends UNKNOWN; eine Erstattung belegt keine Kundenzufriedenheit.',
            'Entwirf eine höfliche Eingangsbestätigung zu einem fiktiv vermissten Paket und bitte den Eigentümer, im freigegebenen Supportablauf zu prüfen. Keine Lieferzeit/Erstattung versprechen, keine privaten Daten im KI-Chat erfragen und nichts automatisch senden. Vor einer Antwort prüft der Eigentümer Auftrag, Verbraucherrechte und Richtlinie.'
          ],
          file: 'Fiktiver Wochenbericht',
          code: 'Zeitraum: 2030-01-07 bis 2030-01-13 einschließlich; USD\nSKU | units | price | refund amount\nNB-A | 10 | 20 | 20\nPN-B | 5 | 10 | 0\nBrutto: 10*20 + 5*10 = 250\nErstattungen: 20\nNach Erstattungen: 230\nGewinn / Zahlungseingang / Wachstum: UNKNOWN\nBestand: separater 14-Tage-Auszug; NB-A REVIEW, PN-B HOLD\nSupport: Paket nicht erhalten; Ausgang UNKNOWN\nBericht/Nachricht: OWNER REVIEW REQUIRED',
          check: 'Der Bericht gleicht 250/20/230 ab, ohne Gewinn/Wachstum zu behaupten; der Supportentwurf erfindet keinen Ausgang.',
          aiPrompt: 'Schreibe fünf Sätze zu diesen fiktiven Wochenzahlen. Brutto/nach Erstattung von Gewinn/Zahlungseingang trennen. Bestandszeitraum separat kennzeichnen; Wachstum nicht erfinden. Bestätigung für vermisstes Paket ohne Erstattungszusage, private Daten oder automatischen Versand entwerfen: [Daten].'
        },
        'retail-service-handover': {
          title: 'Begrenztes Handels-Supportpaket übergeben',
          explanation: [
            'Bündele Briefing, Texte v1/v2, Behauptungsregister, Kostenannahmen, ursprüngliche Bestandszeilen, geprüfte Formeln, Bericht und Supportentwurf. Öffne Dateien erneut und dokumentiere tatsächlich ausgeführte Prüfungen. CSV enthält Daten, aber weder Formeln noch mehrere Tabellenblätter. Alles als FICTIONAL PRACTICE kennzeichnen.',
            'Begrenze den ersten Service auf einen Angebotsentwurf, Bestandsprüfung für zwei SKUs und einen Bericht mit einer Überarbeitung. Interne Zeit/Kosten und vorgeschlagene Gebühr trennen. Veröffentlichung, Einkäufe, Zahlungen, Werbung, Garantien und Rechts-/Steuerzertifizierung ausschließen. Vor echter Arbeit freigegebene Daten, begrenzten Zugriff, Aufbewahrung/Löschung, Prüfer und Übergabe vereinbaren.',
            'Echte Eigentümerfreigabe ist in dieser Übung nicht verfügbar: BLOCKED, niemals PASS. Entscheide anhand echter Belege: weiter üben, überarbeiten, stoppen oder zustimmungsbasierte Discovery suchen. KI unterstützt Entwürfe/Erklärungen, nicht Eigentümerschaft oder Freigabe. Fortsetzen startet keinen Live-Shop.'
          ],
          file: 'Handelsübergabe',
          code: 'Briefing | Angebot v1/v2 | Behauptungsregister | Kostenquellen\nBestand roh/Arbeitskopie/Prüfungen | Bericht | Supportentwurf | Änderungsprotokoll\nPrüfungen: 5/25%; 26/11; 250/20/230; Dateien erneut geöffnet\nEchte Eigentümerfreigabe: BLOCKED - fictional practice\nUmfang/Ausschlüsse, tatsächliche Zeit, interne Kosten, separate Angebotsgebühr:\nFreigegebene Daten/Zugriff, Aufbewahrung/Löschung, Prüfer:\nEntscheidung und benötigte Belege:',
          check: 'Das gekennzeichnete Portfolio ist nachvollziehbar, vermeidet Live-Aktionen und lässt echte Freigabe blockiert.',
          aiPrompt: 'Prüfe diese fiktive Übergabe auf fehlende Belege, unklaren Umfang, Daten-/Zugriffsrisiken und unbelegte Zusagen. Interne Kosten von Gebühren trennen. Keine Freigabe, Einnahmen oder Compliance erfinden: [Paket].'
        }
      }
    },
    es: {
      title: 'Comercio en línea con apoyo de IA',
      intro: 'Explora un modelo de comercio independiente de plataformas con borradores de producto basados en hechos, costes comprobados, planificación de inventario y atención al cliente. Usa datos ficticios e IA opcional; no se activan tienda, pagos ni compras.',
      steps: {
        'retail-model-and-brief': {
          title: 'Elegir un pequeño modelo de comercio en línea',
          explanation: [
            'Un comerciante en línea vende productos y sigue siendo responsable de su oferta, preparación de pedidos y atención al cliente. Se diferencia de un mercado que conecta vendedores independientes y de un proveedor logístico que gestiona bienes de otras empresas. Practica con Cedar Stationery ficticia: una ficha de cuaderno, dos filas de inventario y un informe semanal. No hacen falta compras, cuenta de vendedor ni IA de pago.',
            'Antes de trabajar en la realidad, pregunta de forma neutral a posibles clientes que acepten participar sobre necesidades, alternativas actuales y expectativas de entrega. Separa la evidencia de las suposiciones; sin entrevistas, la demanda queda UNVALIDATED. Verifica país, categoría de producto, proveedor y canal, además de seguridad, impuestos, derechos del consumidor y reglas de la plataforma, con fuentes y asesores adecuados.',
            'Para una futura tienda, compara tiendas alojadas, mercados y sitios a medida por coste total, exportaciones, accesibilidad y soporte. El propietario registra y verifica directamente el servicio elegido. Empieza con un borrador/prueba, datos aprobados, plan de preparación y política de devoluciones; no publiques ni aceptes pagos antes de revisión. Nunca pongas contraseñas, documentos de identidad ni registros de clientes en un chat de IA.'
          ],
          file: 'Brief ficticio de comercio',
          code: 'Empresa: Cedar Stationery (ficticia)\nSKU NB-A: paquete de 2 cuadernos; A5; 80 páginas rayadas cada uno; cubierta de papel\nDesconocido: proveedor, marca, certificaciones, identificador de producto, demanda real\nPaís / canal / requisitos verificados: TO CONFIRM\nEntregables: borrador de ficha + hoja de inventario + informe semanal\nRevisor: función del propietario; aprobación real NOT AVAILABLE\nExcluye: publicación, pagos, compras, anuncios y asesoría legal/fiscal',
          check: 'El brief distingue comercio, mercado y logística; demanda, proveedor y requisitos siguen sin validar hasta tener evidencia.',
          aiPrompt: 'Ayúdame a definir el alcance de este comerciante ficticio. Escribe cinco preguntas neutrales para descubrir necesidades y compara tienda alojada, mercado y sitio a medida sin inventar demanda, precios ni elegibilidad. Señala qué requiere revisión del propietario o un especialista. No pidas credenciales: [brief].'
        },
        'retail-cost-and-fulfillment': {
          title: 'Comparar la preparación de pedidos y calcular contribución',
          explanation: [
            'Compara almacenar y enviar por cuenta propia, usar un proveedor de preparación de pedidos y el envío directo del proveedor. Verifica fiabilidad, permisos, visibilidad de existencias, calidad, promesas de envío y responsabilidades de devolución; externalizar no elimina las obligaciones del comerciante. La IA puede ordenar preguntas, no certificar proveedores ni garantizar entregas.',
            'Ejemplo inventado en USD: precio 20, producto 6, canal/pago 3, embalaje/entrega 4, entrada 1 y devoluciones 1. Contribución: 20 - 6 - 3 - 4 - 1 - 1 = USD 5 por unidad, o el 25% del precio. No es beneficio neto: se excluyen almacenamiento, anuncios, gastos generales e impuestos. No son cotizaciones de proveedores.',
            'Compara cada opción con costes obtenidos de fuentes independientes para igual precio y cantidad. Registra fuente/fecha y deja lo desconocido como TO CONFIRM, no cero. Usa una hoja y verifica a mano antes de pedir a la IA que explique las ventajas y desventajas. No pidas inventario ni cambies promesas de entrega automáticamente.'
          ],
          file: 'Hoja de costes ilustrativa (USD)',
          code: 'A1 Price | B1 20\nA2 Product | B2 6\nA3 Channel/payment allowance | B3 3\nA4 Packing/delivery allowance | B4 4\nA5 Inbound allowance | B5 1\nA6 Returns allowance | B6 1\nA7 Contribution | B7 =B1-SUM(B2:B6)\nA8 Contribution / price | B8 =B7/B1 (percent)\nEsperado: USD 5; 25%\nImportes inventados, no cotizaciones.\nExcluido/desconocido: almacenamiento, anuncios, gastos generales, impuestos\nCoste real | fuente | fecha de revisión | asuntos sin resolver:',
          check: 'Reproduces USD 5 y 25%, identificas costes excluidos y distingues contribución de beneficio neto.',
          aiPrompt: 'Audita esta hoja ficticia de costes en USD y muestra resta y proporción. Compara opciones como posibilidades, no recomendaciones. Mantén los costes ausentes sin resolver; no inventes verificación ni tarifas de proveedores: [hoja].'
        },
        'retail-listing-and-ai': {
          title: 'Redactar con IA una ficha de producto basada en hechos',
          explanation: [
            'Redacta un título provisional, tres viñetas y una descripción corta usando solo los hechos de NB-A. Ejemplo: A5 Ruled Notebooks, 80 Pages Each, Pack of 2. Guarda el texto en un documento privado o tienda en borrador. El propietario debe confirmar identificadores, imágenes, disponibilidad, condiciones de entrega y requisitos del canal.',
            'Pide a la IA que marque datos ausentes, no que los complete. Rechaza afirmaciones de impermeabilidad, reciclaje, sostenibilidad y productividad garantizada: el brief no las respalda. No copies textos de competidores, inventes reseñas ni uses imágenes sin licencia. Las imágenes deben representar el producto real; una ilustración generada no prueba sus características.',
            'Crea un registro de afirmaciones/evidencia/decisión y guarda v1/v2 tras una revisión controlada. Comprueba legibilidad, texto alternativo, afirmaciones respaldadas y reglas actuales del canal. Un texto claro no garantiza posicionamiento, ventas ni cumplimiento; la publicación requiere aprobación del propietario.'
          ],
          file: 'Ficha y registro de afirmaciones',
          code: 'Título: A5 Ruled Notebooks, 80 Pages Each, Pack of 2\nTres viñetas: cantidad / tamaño / páginas rayadas y cubierta\nDescripción: solo resumen factual\nAfirmación | evidencia | decisión\n2 cuadernos | cantidad aprobada del paquete | KEEP\n80 páginas rayadas cada uno | brief | KEEP\nImpermeable | sin evidencia | REMOVE\nPapel reciclado | sin evidencia | REMOVE\nMarca / identificador | desconocido | TO CONFIRM\nv1 -> v2: adelantar cantidad; conservar hechos\nEstado: DRAFT - OWNER REVIEW REQUIRED',
          check: 'El título, las tres viñetas y la descripción usan hechos respaldados; el registro rechaza impermeabilidad y papel reciclado.',
          aiPrompt: 'Redacta título, tres viñetas factuales y una breve descripción a partir de este brief ficticio. Devuelve un registro de afirmaciones/evidencia/decisión. Marca incógnitas TO CONFIRM y rechaza afirmaciones sin respaldo, texto copiado y reseñas inventadas. No prometas ventas ni cumplimiento: [brief].'
        },
        'retail-inventory-planning': {
          title: 'Comprobar umbrales de inventario antes de reponer',
          explanation: [
            'Crea columnas para SKU, unidades vendidas en 14 días, existencias utilizables, entrada confirmada, plazo en días y reserva. NB-A: 28, 18, 0, 10, 6; PN-B: 14, 30, 0, 7, 4. Son cifras agregadas ficticias, no datos de clientes. Conserva intactas las filas originales.',
            'Promedio diario = ventas/14; umbral = promedio x plazo + reserva; posición simplificada = existencias utilizables + entrada confirmada. NB-A da 2/día, umbral 26, posición 18: REVIEW; PN-B da 1/día, umbral 11, posición 30: HOLD. Cobertura NB-A = 18/2 = 9 días. REVIEW no es cantidad de pedido ni permiso de compra.',
            'Valida entradas antes de usar fórmulas: falta el plazo = TO CONFIRM, no cero/HOLD. La planificación real también requiere reservas, estacionalidad, pedidos mínimos, efectivo e incertidumbre. Un promedio de 14 días no es una previsión fiable. La IA puede explicar indicadores y evidencia ausente; el propietario aprueba la reposición.'
          ],
          file: 'Hoja de inventario',
          code: 'SKU | sold_14d | usable_stock | confirmed_inbound | lead_days | buffer\nNB-A | 28 | 18 | 0 | 10 | 6\nPN-B | 14 | 30 | 0 | 7 | 4\nColumnas A:F; fila 2:\nG2 =B2/14\nH2 =G2*E2+F2\nI2 =C2+D2\nJ2 =IF(I2<=H2,"REVIEW","HOLD")\nEsperado NB-A: 2 | 26 | 18 | REVIEW\nEsperado PN-B: 1 | 11 | 30 | HOLD\nCobertura NB-A: 9 días\nCopia fórmulas solo tras comprobar entradas numéricas no negativas.\nPlazo ausente: TO CONFIRM. Los separadores varían por configuración regional.',
          check: 'Reproduces ambos umbrales e indicadores y los 9 días; el plazo ausente sigue sin resolver.',
          aiPrompt: 'Audita estas filas ficticias con diario = ventas/14, umbral = diario x plazo + reserva y posición = existencias + entrada. Muestra los cálculos. Señala datos ausentes, negativos o no numéricos sin reemplazarlos por cero. Explica por qué REVIEW no es una orden de compra: [filas].'
        },
        'retail-report-and-support': {
          title: 'Crear un informe comprobado y borrador de atención',
          explanation: [
            'Para el período separado de siete días del 2030-01-07 al 2030-01-13 inclusive: NB-A vendió 10 a USD 20 con USD 20 reembolsados; PN-B vendió 5 a USD 10 sin reembolsos. Importe bruto = USD 250, reembolsos = USD 20, tras reembolsos = USD 230. Se excluyen tarifas, impuestos y otros ajustes: no es beneficio ni efectivo recibido.',
            'Pide a la IA un informe de cinco frases con fechas, cifras conciliadas, indicadores de inventario etiquetados aparte, limitaciones y preguntas siguientes. Recalcula cada cifra. Sin datos del período anterior, crecimiento/tendencias = UNKNOWN; un reembolso no demuestra satisfacción.',
            'Redacta un acuse amable por un paquete ficticio extraviado y pide al propietario que investigue por el flujo aprobado. No prometas fecha de entrega ni reembolso, no pidas datos privados en el chat de IA y no envíes automáticamente. Antes de responder, el propietario verifica pedido, derechos del consumidor y política.'
          ],
          file: 'Informe semanal ficticio',
          code: 'Período: 2030-01-07 a 2030-01-13 inclusive; USD\nSKU | units | price | refund amount\nNB-A | 10 | 20 | 20\nPN-B | 5 | 10 | 0\nBruto: 10*20 + 5*10 = 250\nReembolsos: 20\nTras reembolsos: 230\nBeneficio / efectivo recibido / crecimiento: UNKNOWN\nInventario: muestra separada de 14 días; NB-A REVIEW, PN-B HOLD\nAtención: paquete no recibido; resultado UNKNOWN\nEstado de informe/mensaje: OWNER REVIEW REQUIRED',
          check: 'El informe concilia 250/20/230 sin afirmar beneficio/crecimiento y la respuesta no inventa un resultado.',
          aiPrompt: 'Escribe cinco frases con estas cifras semanales ficticias. Distingue bruto/tras reembolso de beneficio/efectivo. Etiqueta aparte el período de inventario; no inventes crecimiento. Redacta acuse por paquete extraviado sin promesa de reembolso, solicitud de datos privados ni envío automático: [datos].'
        },
        'retail-service-handover': {
          title: 'Entregar un paquete acotado de práctica de comercio',
          explanation: [
            'Reúne brief, textos v1/v2, registro de afirmaciones, supuestos de costes, filas originales de inventario, fórmulas comprobadas, informe y borrador de atención. Reabre los archivos y registra las comprobaciones reales. CSV son datos, no un libro con fórmulas ni varias hojas. Marca todo FICTIONAL PRACTICE.',
            'Limita el servicio inicial a un borrador de ficha, revisión de inventario de dos SKU e informe, con una ronda de revisión. Separa tiempo/costes internos de la tarifa propuesta. Excluye publicación, compras, pagos, anuncios, garantías y certificación legal/fiscal. Antes de trabajar en serio, acuerda datos aprobados, acceso limitado, conservación/eliminación, revisor y entrega.',
            'La aprobación real del propietario no está disponible en este ejercicio: BLOCKED, nunca PASS. Decide practicar más, revisar, parar o buscar descubrimiento consentido con evidencia real. La IA ayuda a redactar y explicar, no sustituye al propietario ni aprueba. Continuar no activa una tienda real.'
          ],
          file: 'Entrega de comercio',
          code: 'Brief | ficha v1/v2 | registro de afirmaciones | fuentes de costes\nInventario original/trabajo/comprobaciones | informe | borrador de atención | historial de versiones\nComprobaciones: 5/25%; 26/11; 250/20/230; archivos reabiertos\nAprobación real del propietario: BLOCKED - fictional practice\nAlcance/exclusiones, tiempo real, costes internos, tarifa propuesta por separado:\nDatos/acceso aprobados, conservación/eliminación, revisor:\nDecisión y evidencia necesaria:',
          check: 'El portafolio etiquetado es trazable, excluye acciones en vivo y mantiene bloqueada la aprobación real.',
          aiPrompt: 'Revisa esta entrega ficticia para detectar evidencia ausente, alcance confuso, riesgos de datos/acceso y promesas sin respaldo. Separa costes internos de tarifas. No inventes aprobación, ingresos ni cumplimiento: [paquete].'
        }
      }
    }
  },
  'ai-marketplace-model': {
    fr: {
      title: 'Modèle de marketplace avec l’IA',
      intro: 'Pratiquez un modèle multivendeur avec intégration des vendeurs, revue du catalogue, rapprochement des commissions et assistance modérée. Prototype sur tableur/papier uniquement, sans marketplace ni système de paiement réel.',
      steps: {
        'marketplace-model': {
          title: 'Définir une marketplace, pas un détaillant',
          explanation: [
            'Une marketplace multivendeur met en relation vendeurs indépendants et acheteurs, et peut facturer une commission ou d’autres frais convenus. Un détaillant vend sa propre offre ; un prestataire logistique exécute les commandes des clients. L’opérateur doit définir qui vend, fixe les prix, détient les biens, gère les retours et reçoit les paiements. Une commission ne supprime pas automatiquement les responsabilités juridiques ou envers les clients.',
            'Entraînez-vous dans un tableur avec une marketplace fictive de papeterie, deux vendeurs et trois commandes. Interrogez séparément des acheteurs et vendeurs consentants ; consignez des preuves réelles, pas des utilisateurs ou une demande inventés. Frais illustratifs et dossiers privés uniquement. Aucun site réel, paiement ou intégration réelle de compte.'
          ],
          file: 'Hypothèse de marketplace',
          code: 'Opérateur fictif : Cedar Market\nVendeur S1 : carnets ; vendeur S2 : stylos\nHypothèse de valeur : catalogue clair et état coordonné des commandes\nHypothèse de revenu : commission sur le montant conservé des marchandises\nEntretiens réels acheteurs/vendeurs : NONE - demand UNVALIDATED\nQui vend / exécute / rembourse / paie les taxes : TO CONFIRM avant lancement\nExclus : intégration réelle, paiements, publication et garanties',
          check: 'Vous identifiez opérateur, vendeurs et acheteurs, et laissez demande et responsabilités non validées.',
          aiPrompt: 'Explique ce modèle de marketplace par rapport au commerce en ligne et à la logistique. Rédige cinq questions neutres pour acheteurs et cinq pour vendeurs. Signale les rôles manquants sans inventer demande, utilisateurs ou admissibilité juridique : [hypothèse].'
        },
        'marketplace-onboarding': {
          title: 'Concevoir l’intégration vendeur et une plateforme brouillon',
          explanation: [
            'Préparez une liste de contrôle vendeur : identité/entreprise vérifiée par le service autorisé choisi, produits permis, faits produit/droits des images, mises à jour du stock, frais, exécution, retours et assistance. La vérification réelle passe par des workflows sécurisés autorisés, jamais par un chat IA. Sans preuve, l’intégration reste en attente.',
            'Comparez une plateforme de marketplace hébergée, une boutique avec fonctions multivendeurs et une création sur mesure. Vérifiez le support multivendeur, les exports, contrôles d’accès, accessibilité, maintenance et compatibilité des paiements dans votre pays. Prototypez d’abord sur papier ou dans un environnement brouillon/test. Une maquette n’est pas une marketplace fonctionnelle.',
            'Avant tout paiement réel, faites examiner contrats, droits des consommateurs, confidentialité, taxes et responsabilités de paiement/versement. Utilisez un prestataire de paiement admissible et son mode test ; ne recueillez jamais vous-même les cartes et ne supposez pas pouvoir détenir les fonds. L’IA peut rédiger questions et listes, pas certifier vendeurs, contrats ou conformité de paiement.'
          ],
          file: 'Liste d’intégration vendeur',
          code: 'ID vendeur | produits approuvés | preuve faits/images | exécution | retours | statut\nS1 | carnets | brief fictif seulement | rôle vendeur | TO CONFIRM | PRACTICE ONLY\nS2 | stylos | brief fictif seulement | rôle vendeur | TO CONFIRM | PRACTICE ONLY\nCapacité plateforme/source/date :\nPrestataire de paiement/pays admissible : TO CONFIRM\nAccès : moindre privilège ; aucun mot de passe propriétaire ni carte\nApprobation réelle : BLOCKED',
          check: 'Votre liste attribue les responsabilités et garde vérification/paiement réels hors de l’IA et bloqués sans preuve.',
          aiPrompt: 'Examine cette liste d’intégration fictive. Repère les responsabilités manquantes de vendeur, retours, données et paiements. Compare les plateformes sans deviner fonctions/frais actuels. Ne demande pas de secrets de connexion ou de carte et ne certifie pas contrats/vendeurs : [liste].'
        },
        'marketplace-catalog': {
          title: 'Normaliser le catalogue avec l’IA sans inventer de faits',
          explanation: [
            'Conservez les faits fournis par les vendeurs et leurs identifiants vendeur/SKU dans une feuille source immuable. S1 fournit N1 : deux carnets A5 lignés de 80 pages chacun ; S2 fournit P1 : trois stylos à encre noire. Marque, certifications et délais sont inconnus. L’IA peut uniformiser un catalogue de faits approuvés, sans fusionner vendeurs ni ajouter d’attributs.',
            'Créez un registre d’affirmations et une file de revue. Rejetez les carnets recyclés et stylos rechargeables, sans preuve. Identifiant, permission d’image ou information de sécurité manquants signifient « en attente », pas publication. Pas de faux avis, manipulation d’avis rémunérés, texte copié ou notes vendeur inventées.',
            'Testez manuellement deux requêtes : « carnets A5 » doit afficher S1/N1 ; « stylos noirs » S2/P1. « Carnet imperméable » doit renvoyer NO VERIFIED MATCH. Il s’agit d’une classification d’exercice, pas d’une confirmation de stock, recommandation vendeur ou conseil d’achat.'
          ],
          file: 'Exercice de catalogue',
          code: 'seller_id | sku | approved facts | status\nS1 | N1 | 2 carnets A5 lignés ; 80 pages chacun | DRAFT\nS2 | P1 | 3 stylos à encre noire | DRAFT\nRequêtes : carnets A5 -> S1/N1 ; stylos noirs -> S2/P1\nCarnet imperméable -> NO VERIFIED MATCH\nMarque/images/certifications inconnues -> REVIEW\nRegistre : affirmation | fait source | garder/corriger/supprimer',
          check: 'Vous préservez l’identité vendeur/SKU, reproduisez trois résultats de requête et rejetez les attributs non étayés.',
          aiPrompt: 'Normalise ces deux annonces fictives à partir des seuls faits approuvés. Préserve identifiants vendeur/SKU. Rends un registre et les trois résultats. Une preuve absente signifie REVIEW ou NO VERIFIED MATCH, pas attribut ou note inventés : [catalogue et requêtes].'
        },
        'marketplace-orders-and-commission': {
          title: 'Rapprocher commandes, remboursements et commissions',
          explanation: [
            'Utilisez trois commandes fictives en USD : O1/S1 brut 100, remboursement 0 ; O2/S2 brut 80, remboursement 20 ; O3/S1 brut 50, remboursement 50. Pour cet exercice seulement, commission convenue de 10 % sur les marchandises après remboursements. Les contrats réels peuvent utiliser une autre base ; ce n’est pas un devis de frais.',
            'Montants conservés : 100, 60, 0 ; commissions opérateur : 10, 6, 0 ; allocations vendeur avant autres coûts : 90, 54, 0. Totaux : brut 230 - remboursements 70 = conservé 160 = commission 16 + allocations 144. Allocation S1 : 90 ; S2 : 54. Ce sont des allocations sur feuille, pas des versements réels ni le bénéfice de l’opérateur.',
            'Préservez chaque identifiant de commande et rejetez un O2 répété au lieu de le compter deux fois. Les remboursements inconnus restent non résolus. L’IA peut expliquer le registre et repérer des incohérences ; formules déterministes et vérifications manuelles établissent l’arithmétique. Frais, taxes, rétrofacturations, délais et réserves sont exclus ; aucun paiement n’est envoyé.'
          ],
          file: 'Feuille de commissions',
          code: 'order | seller | gross | refund | retained | 10% commission | seller allocation\nO1 | S1 | 100 | 0 | 100 | 10 | 90\nO2 | S2 | 80 | 20 | 60 | 6 | 54\nO3 | S1 | 50 | 50 | 0 | 0 | 0\nTotaux : 230 | 70 | 160 | 16 | 144\nContrôles : 230-70=160 ; 16+144=160\nO2 répété -> ERROR/REVIEW, pas une vente supplémentaire\nRemboursement manquant -> UNRESOLVED, pas zéro\nPas des versements/bénéfices réels ; aucun mouvement d’argent.',
          check: 'Vous rapprochez 230/70/160/16/144, allocations 90/54 et rejetez le double comptage.',
          aiPrompt: 'Vérifie ce registre fictif avec une commission de 10 % après remboursement. Montre les calculs par commande, vendeur et total. Signale doublons et remboursements manquants sans choisir silencieusement. Ne présente pas allocations comme payées ni commission comme bénéfice : [registre].'
        },
        'marketplace-support': {
          title: 'Préparer un support modéré et la gestion des litiges',
          explanation: [
            'Décrivez le workflow d’une commande : brouillon, acceptation vendeur, emballage, expédition, preuve de livraison reçue, clôture ; les dossiers non résolus nécessitent une revue. Un message de statut ne prouve pas une livraison. Attribuez les étapes et preuves à une personne au lieu de laisser l’IA approuver la clôture.',
            'Entraînez-vous sur une plainte fictive de colis endommagé, sans résultat connu. L’IA peut résumer et rédiger un accusé neutre. Transmettez au réviseur opérateur/vendeur autorisé ; ne blâmez personne, ne promettez pas de compensation, ne remboursez pas et n’envoyez aucun message automatiquement. Vérifiez les droits et délais d’escalade locaux/plateforme.',
            'Gardez des règles de modération pour produits/affirmations interdits, annonces en double et avis suspects. Consignez motifs et voie d’appel humaine. Ne déduisez pas une fraude ni ne pénalisez un vendeur sur la seule classification IA ; protégez les données personnelles et limitez l’accès aux dossiers.'
          ],
          file: 'Procédure d’assistance et d’escalade',
          code: 'Cas M1 : colis endommagé signalé ; résultat UNKNOWN\nPreuve requise : référence de commande approuvée et dossiers autorisés\nResponsable : réviseur opérateur/vendeur autorisé\nBrouillon : accuser réception ; expliquer la revue ; aucune échéance/remboursement inventé\nStatut : REVIEW REQUIRED\nModération : motif, preuve, réviseur, voie d’appel\nAucun envoi, pénalité, paiement ou remboursement automatique.',
          check: 'Votre brouillon conserve l’incertitude et la procédure exige preuves, réviseur et voie d’appel.',
          aiPrompt: 'Résume cette plainte fictive et rédige un accusé neutre. Liste preuves et questions d’escalade sans collecter de données privées, désigner un responsable ou promettre remboursement/délai. Vérifie la voie de revue et d’appel : [cas].'
        },
        'marketplace-handover': {
          title: 'Remettre un prototype d’opérations marketplace',
          explanation: [
            'Livrez un canevas de modèle fictif étiqueté, liste vendeur, catalogue/registre d’affirmations, feuille de trois commandes, procédure support et comparaison de plateformes. Rouvrez les fichiers et consignez les contrôles. Maquettes papier et tableur démontrent un apprentissage de workflow, pas un logiciel multivendeur réel ni l’aptitude aux paiements.',
            'Limitez le service à deux profils vendeurs, deux brouillons catalogue, rapprochement de trois commandes et un cas support, avec une révision. Séparez coûts/temps internes et honoraires proposés. Excluez approbation d’intégration, gestion d’argent, certification juridique, modération automatique et garanties.',
            'Approbation réelle vendeur/opérateur et demande restent BLOCKED/UNVALIDATED sans preuve. Continuer signifie découverte ou conception supervisée en mode test, pas commerce réel. Notez documentation plateforme et revue professionnelle nécessaires avant lancement.'
          ],
          file: 'Transmission marketplace',
          code: 'Modèle | liste vendeurs | catalogue | registre | registre commandes | procédure support\nContrôles : identité vendeur conservée ; trois requêtes ; 230/70/160/16/144\nMéthode : prototype tableur/papier, pas une marketplace réelle\nApprobation réelle : BLOCKED ; demande UNVALIDATED\nPérimètre, exclusions, une révision, coûts internes, honoraires proposés séparément :\nProchaine preuve / réviseur / décision :',
          check: 'Votre prototype contient des résultats contrôlés sans prétendre à une marketplace réelle, des paiements ou des vendeurs approuvés.',
          aiPrompt: 'Examine cette transmission fictive : preuves manquantes, rôles flous, risques de paiement/données et promesses non étayées. Garde approbation bloquée et limites du prototype explicites. N’invente ni utilisateurs, revenus ni disponibilité au lancement : [ensemble].'
        }
      }
    },
    de: {
      title: 'KI-gestütztes Multi-Vendor-Marktplatzmodell',
      intro: 'Übe ein Multi-Vendor-Modell mit Verkäufer-Onboarding, Katalogprüfung, Provisionsabgleich und moderiertem Support. Nur Tabellen-/Papierprototyp, kein echter Marktplatz oder Zahlungssystem.',
      steps: {
        'marketplace-model': {
          title: 'Marktplatz statt Händler definieren',
          explanation: [
            'Ein Multi-Vendor-Marktplatz verbindet unabhängige Verkäufer mit Käufern und kann Provisionen oder vereinbarte Gebühren berechnen. Ein Händler verkauft sein eigenes Angebot; ein Logistiker erfüllt Kundenaufträge. Der Betreiber muss definieren, wer verkauft, Preise setzt, Waren hält, Retouren bearbeitet und Zahlungen erhält. Ein Provisionsmodell beseitigt rechtliche oder Kundenpflichten nicht automatisch.',
            'Übe mit einer fiktiven Schreibwarenplattform, zwei Verkäufern und drei Aufträgen in einer Tabelle. Befrage einwilligende Käufer und Verkäufer getrennt; dokumentiere echte Belege, keine erfundenen Nutzer oder Nachfrage. Gebühren bleiben beispielhaft und Auftragsdaten privat. Keine Live-Website, Zahlungen oder echte Kontoanmeldung.'
          ],
          file: 'Marktplatzhypothese',
          code: 'Fiktiver Betreiber: Cedar Market\nVerkäufer S1: Notizbücher; Verkäufer S2: Stifte\nWertannahme: klarer Katalog und koordinierter Bestellstatus\nUmsatzannahme: Provision auf einbehaltenen Warenwert\nEchte Käufer-/Verkäuferinterviews: NONE - demand UNVALIDATED\nWer verkauft / erfüllt / erstattet / Steuern zahlt: TO CONFIRM vor Start\nAusgeschlossen: echtes Onboarding, Zahlungen, Veröffentlichung und Garantien',
          check: 'Du benennst Betreiber, Verkäufer und Käufer und lässt Nachfrage sowie rechtliche Rollen unvalidiert.',
          aiPrompt: 'Erkläre dieses Marktplatzmodell im Vergleich zu Onlinehandel und Logistik. Schreibe je fünf neutrale Fragen für Käufer und Verkäufer. Markiere Rollenlücken, ohne Nachfrage, Nutzer oder rechtliche Zulassung zu erfinden: [Hypothese].'
        },
        'marketplace-onboarding': {
          title: 'Verkäufer-Onboarding und Plattformentwurf planen',
          explanation: [
            'Erstelle eine Verkäufer-Checkliste: Identitäts-/Unternehmensprüfung über den autorisierten Dienst, erlaubte Produkte, Produktfakten/Bildrechte, Bestandsaktualisierung, Gebühren, Erfüllung, Retouren und Supportverantwortung. Echte Prüfung erfolgt sicher in freigegebenen Abläufen, nie im KI-Chat. Fehlende Belege halten das Onboarding offen.',
            'Vergleiche gehosteten Marktplatz, Shop mit Multi-Vendor-Funktionen und Eigenentwicklung. Prüfe aktuelle Multi-Seller-Unterstützung, Exporte, Zugriffskontrollen, Barrierefreiheit, Wartung und Zahlungsanbieter-Eignung im Land. Prototyp zuerst auf Papier oder in einer Testumgebung. Ein Mock-up ist kein funktionierender Marktplatz.',
            'Vor Live-Zahlungen Verträge, Verbraucherrechte, Datenschutz, Steuern und Zahlungs-/Auszahlungsrollen fachgerecht prüfen lassen. Geeigneten Zahlungsanbieter und Testmodus nutzen; niemals Kartendaten selbst sammeln oder Geldverwahrung unterstellen. KI kann Fragen/Checklisten entwerfen, aber Verkäufer, Verträge oder Zahlungskonformität nicht zertifizieren.'
          ],
          file: 'Verkäufer-Onboarding-Checkliste',
          code: 'Verkäufer-ID | genehmigte Produkte | Fakten-/Bildbeleg | Erfüllung | Retouren | Status\nS1 | Notizbücher | nur fiktives Briefing | Verkäuferrolle | TO CONFIRM | PRACTICE ONLY\nS2 | Stifte | nur fiktives Briefing | Verkäuferrolle | TO CONFIRM | PRACTICE ONLY\nPlattformfunktion/Quelle/Datum:\nZahlungsanbieter/Länderzulassung: TO CONFIRM\nZugriff: Least Privilege; keine Eigentümerpasswörter oder Kartendaten\nLive-Freigabe: BLOCKED',
          check: 'Die Checkliste weist Rollen zu und hält echte Verifizierung/Zahlungsfreigabe außerhalb von KI und bis zum Beleg blockiert.',
          aiPrompt: 'Prüfe diese fiktive Onboarding-Liste. Finde fehlende Verkäufer-, Retouren-, Daten- und Zahlungsrollen. Vergleiche Plattformansätze ohne aktuelle Gebühren/Funktionen zu raten. Keine Zugangsdaten/Kartendaten erfragen und Verträge/Verkäufer nicht zertifizieren: [Liste].'
        },
        'marketplace-catalog': {
          title: 'Katalog mit KI vereinheitlichen, ohne Fakten zu erfinden',
          explanation: [
            'Bewahre Verkäuferangaben und Verkäufer-/SKU-Kennungen in einem unveränderlichen Quellblatt. S1 liefert N1: zwei linierte A5-Notizbücher mit je 80 Seiten; S2 liefert P1: drei Stifte mit schwarzer Tinte. Marke, Zertifikate und Lieferzeit sind unbekannt. KI darf freigegebene Fakten vereinheitlichen, aber weder Verkäufer zusammenführen noch Merkmale ergänzen.',
            'Führe Behauptungsregister und Prüfwarteschlange. Recycling-Notizbücher und nachfüllbare Stifte mangels Beleg ablehnen. Fehlende Kennung, Bildrechte oder Sicherheitsinfo bedeutet Prüfung offen, nicht Veröffentlichung. Keine Fake-Rezensionen, gekauften Bewertungen, kopierten Wettbewerbertexte oder erfundenen Verkäuferbewertungen.',
            'Teste zwei Suchanfragen manuell: A5-Notizbücher -> S1/N1; schwarze Tintenstifte -> S2/P1. Wasserfestes Notizbuch muss NO VERIFIED MATCH ergeben. Das ist Übungsklassifikation, keine Bestandsbestätigung, Verkäuferempfehlung oder Kaufempfehlung.'
          ],
          file: 'Katalogübung',
          code: 'seller_id | sku | approved facts | status\nS1 | N1 | 2 linierte A5-Notizbücher; je 80 Seiten | DRAFT\nS2 | P1 | 3 Stifte mit schwarzer Tinte | DRAFT\nSuchanfragen: A5-Notizbücher -> S1/N1; schwarze Stifte -> S2/P1\nWasserfestes Notizbuch -> NO VERIFIED MATCH\nUnbekannte Marke/Bilder/Zertifikate -> REVIEW\nRegister: Behauptung | Quellfakt | behalten/korrigieren/entfernen',
          check: 'Du erhältst Verkäufer-/SKU-Identität, drei Suchergebnisse und lehnst unbelegte Merkmale ab.',
          aiPrompt: 'Vereinheitliche diese zwei fiktiven Angebote nur mit freigegebenen Fakten. Verkäufer-IDs/SKUs erhalten. Erstelle Register und drei Suchergebnisse. Fehlender Beleg heißt REVIEW oder NO VERIFIED MATCH, nicht erfundenes Merkmal/Bewertung: [Katalog und Anfragen].'
        },
        'marketplace-orders-and-commission': {
          title: 'Bestellungen, Erstattungen und Provision abgleichen',
          explanation: [
            'Nutze drei fiktive USD-Bestellungen: O1/S1 brutto 100, Erstattung 0; O2/S2 brutto 80, Erstattung 20; O3/S1 brutto 50, Erstattung 50. Nur für diese Übung gilt 10 % Provision auf Warenwert nach Erstattungen. Echte Verträge können andere Grundlagen und Erstattungsregeln haben; dies ist kein Gebührenangebot.',
            'Einbehaltene Warenwerte: 100, 60, 0; Betreiberprovisionen: 10, 6, 0; Verkäuferzuweisungen vor weiteren Kosten: 90, 54, 0. Summen: brutto 230 - Erstattungen 70 = einbehalten 160 = Provision 16 + Zuweisungen 144. S1 erhält rechnerisch 90, S2 54. Keine echten Auszahlungen oder Betreibergewinne.',
            'Jede Bestell-ID bewahren und wiederholtes O2 ablehnen, statt doppelt zu zählen. Unbekannte Erstattungen bleiben ungeklärt. KI darf erklären und Widersprüche finden; deterministische Formeln und manuelle Prüfungen belegen die Rechnung. Anbietergebühren, Steuern, Rückbuchungen, Zeitabläufe und Rücklagen fehlen; keine Zahlung wird ausgelöst.'
          ],
          file: 'Provisionsblatt',
          code: 'order | seller | gross | refund | retained | 10% commission | seller allocation\nO1 | S1 | 100 | 0 | 100 | 10 | 90\nO2 | S2 | 80 | 20 | 60 | 6 | 54\nO3 | S1 | 50 | 50 | 0 | 0 | 0\nSummen: 230 | 70 | 160 | 16 | 144\nPrüfungen: 230-70=160; 16+144=160\nDoppeltes O2 -> ERROR/REVIEW, kein weiterer Verkauf\nFehlende Erstattung -> UNRESOLVED, nicht null\nKeine echten Auszahlungen/Gewinne; kein Geldtransfer.',
          check: 'Du gleichst 230/70/160/16/144 und Verkäuferanteile 90/54 ab und weist doppelte Bestellungen zurück.',
          aiPrompt: 'Prüfe dieses fiktive Buch mit 10 % Provision nach Erstattungen. Zeige Rechnung je Auftrag, Verkäufer und gesamt. Markiere doppelte IDs und fehlende Erstattungen, ohne Werte stillschweigend festzulegen. Zuweisungen nicht als bezahlt und Provision nicht als Gewinn bezeichnen: [Buch].'
        },
        'marketplace-support': {
          title: 'Moderierten Support und Streitfälle planen',
          explanation: [
            'Skizziere einen Bestellablauf: Entwurf, Verkäuferannahme, verpackt, versandt, Lieferbeleg erhalten, abgeschlossen; offene Fälle brauchen Prüfung. Eine Statusnachricht ist kein Lieferbeweis. Weise Stufen und nötige Belege einer Person zu, statt KI den Abschluss genehmigen zu lassen.',
            'Übe mit einer fiktiven Beschwerde über beschädigtes Paket ohne bekannten Ausgang. KI kann zusammenfassen und neutrale Eingangsbestätigung entwerfen. An autorisierte Betreiber-/Verkäuferprüfung weiterleiten; niemanden beschuldigen, Entschädigung versprechen, erstatten oder automatisch senden. Aktuelle lokale/Plattformrechte und Eskalationsfristen prüfen.',
            'Moderationsregeln für verbotene Behauptungen/Produkte, doppelte Angebote und verdächtige Rezensionen pflegen. Gründe und menschlichen Einspruchsweg dokumentieren. Betrug nicht allein aus KI-Klassifikation ableiten und Verkäufer nicht allein deshalb bestrafen; personenbezogene Daten schützen und Aktenzugriff begrenzen.'
          ],
          file: 'Support- und Eskalationshandbuch',
          code: 'Fall M1: beschädigtes Paket gemeldet; Ausgang UNKNOWN\nBenötigter Beleg: freigegebener Auftragsverweis und zulässige Prüfdaten\nVerantwortlich: autorisierte Betreiber-/Verkäuferprüfung\nEntwurf: bestätigen; Prüfung erklären; keine erfundene Erstattung/Frist\nStatus: REVIEW REQUIRED\nModeration: Grund, Beleg, Prüfer, Einspruchsweg\nKein automatisches Senden, Bestrafen, Auszahlen oder Erstatten.',
          check: 'Der Entwurf bewahrt Ungewissheit; das Handbuch verlangt Belege, Prüfer und Einspruchsweg.',
          aiPrompt: 'Fasse diese fiktive Beschwerde zusammen und entwirf eine neutrale Bestätigung. Liste Belege/Eskalationsfragen ohne private Daten, Schuldzuweisung oder Erstattungs-/Fristzusage. Prüfe menschliche Moderations- und Einspruchswege: [Fall].'
        },
        'marketplace-handover': {
          title: 'Marktplatz-Betriebsprototyp übergeben',
          explanation: [
            'Liefere ein als fiktiv markiertes Geschäftsmodell, Verkäuferliste, Katalog/Behauptungsregister, Drei-Auftrags-Blatt, Supporthandbuch und Plattformvergleich. Dateien erneut öffnen und Prüfungen dokumentieren. Papieransichten und Tabellenkalkulation zeigen Workflow-Lernen, keine Live-Multi-Vendor-Software oder Zahlungsbereitschaft.',
            'Begrenze das Servicepaket auf zwei Verkäuferprofile, zwei Katalogentwürfe, Abgleich von drei Aufträgen und einen Supportfall mit einer Überarbeitung. Interne Zeit/Kosten und Angebotsgebühr trennen. Keine Onboarding-Freigabe, Geldverwaltung, Rechtszertifizierung, automatische Moderation oder Garantien.',
            'Echte Verkäufer-/Betreiberfreigabe und Nachfrage bleiben ohne Beleg BLOCKED/UNVALIDATED. Fortfahren heißt mehr Discovery oder beaufsichtigter Testmodus, kein Live-Handel. Vor dem Start benötigte Plattformunterlagen und qualifizierte Prüfung festhalten.'
          ],
          file: 'Marktplatz-Übergabe',
          code: 'Modell | Verkäuferliste | Katalog | Register | Auftragsbuch | Supporthandbuch\nPrüfungen: Verkäuferidentität erhalten; drei Suchergebnisse; 230/70/160/16/144\nMethode: Tabellen-/Papierprototyp, kein Live-Marktplatz\nEchte Freigabe: BLOCKED; Nachfrage UNVALIDATED\nUmfang, Ausschlüsse, eine Überarbeitung, interne Kosten, separate Angebotsgebühr:\nNächster Beleg / Prüfer / Entscheidung:',
          check: 'Der Prototyp enthält geprüfte Ergebnisse ohne Behauptung eines Live-Marktplatzes, Auszahlungen oder zugelassener Verkäufer.',
          aiPrompt: 'Prüfe diese fiktive Übergabe auf fehlende Belege, unklare Rollen, Zahlungs-/Datenrisiken und unbelegte Zusagen. Freigabe blockiert und Prototypgrenzen klar lassen. Keine Nutzer, Einnahmen oder Startreife erfinden: [Paket].'
        }
      }
    },
    es: {
      title: 'Modelo de mercado multivendedor con IA',
      intro: 'Practica un modelo multivendedor con incorporación de vendedores, revisión del catálogo, conciliación de comisiones y atención moderada. Solo prototipo en hoja/papel; no es un mercado ni sistema de pagos activo.',
      steps: {
        'marketplace-model': {
          title: 'Definir un mercado, no un comerciante',
          explanation: [
            'Un mercado multivendedor conecta vendedores independientes con compradores y puede cobrar comisión u otras tarifas acordadas. Un comerciante vende su propia oferta; un proveedor logístico prepara bienes de clientes. El operador debe definir quién vende, fija precios, conserva bienes, gestiona devoluciones y recibe pagos. Un modelo de comisión no elimina por sí solo responsabilidades legales o con clientes.',
            'Practica en una hoja con un mercado ficticio de papelería, dos vendedores y tres pedidos. Entrevista por separado a compradores y vendedores que acepten participar; registra evidencia real, no usuarios ni demanda inventados. Mantén tarifas ilustrativas y registros privados. No hace falta sitio activo, pagos ni incorporación de cuentas reales.'
          ],
          file: 'Hipótesis de mercado',
          code: 'Operador ficticio: Cedar Market\nVendedor S1: cuadernos; vendedor S2: bolígrafos\nHipótesis de valor: catálogo claro y estado coordinado de pedidos\nHipótesis de ingresos: comisión sobre el importe de mercancía retenido\nEntrevistas reales de compradores/vendedores: NONE - demand UNVALIDATED\nQuién vende / prepara / reembolsa / paga impuestos: TO CONFIRM antes del lanzamiento\nExcluye: incorporación real, pagos, publicación y garantías',
          check: 'Identificas operador, vendedores y compradores y dejas sin validar demanda y responsabilidades legales.',
          aiPrompt: 'Explica este modelo de mercado frente al comercio minorista y la logística. Escribe cinco preguntas neutrales para compradores y cinco para vendedores. Señala funciones/responsabilidades ausentes sin inventar demanda, usuarios ni elegibilidad legal: [hipótesis].'
        },
        'marketplace-onboarding': {
          title: 'Diseñar la incorporación de vendedores y la plataforma',
          explanation: [
            'Prepara una lista de vendedores: verificación de identidad/empresa mediante el servicio autorizado, productos permitidos, hechos del producto/permisos de imágenes, actualizaciones de existencias, tarifas, preparación, devoluciones y atención. La verificación real se hace en flujos seguros autorizados, nunca en un chat de IA. Sin evidencia, la incorporación queda pendiente.',
            'Compara un mercado alojado, una tienda con funciones multivendedor y un desarrollo propio. Comprueba soporte actual, exportaciones, controles de acceso, accesibilidad, mantenimiento y adecuación del proveedor de pagos en tu país. Primero prototipa en papel o en un espacio de prueba. Una maqueta no es un mercado funcional.',
            'Antes de pagos reales, solicita revisión adecuada de contratos, derechos del consumidor, privacidad, impuestos y responsabilidades de pago/liquidación. Usa un proveedor elegible y su modo de prueba; nunca recojas datos de tarjetas ni supongas permiso para custodiar fondos. La IA puede redactar preguntas/listas, no certificar vendedores, contratos o cumplimiento de pagos.'
          ],
          file: 'Lista de incorporación de vendedores',
          code: 'ID vendedor | productos aprobados | evidencia de hechos/imágenes | preparación | devoluciones | estado\nS1 | cuadernos | solo brief ficticio | función del vendedor | TO CONFIRM | PRACTICE ONLY\nS2 | bolígrafos | solo brief ficticio | función del vendedor | TO CONFIRM | PRACTICE ONLY\nCapacidad de plataforma/fuente/fecha:\nProveedor de pagos/elegibilidad del país: TO CONFIRM\nAcceso: mínimo privilegio; sin contraseñas de propietario ni tarjetas\nAprobación en vivo: BLOCKED',
          check: 'La lista asigna responsabilidades y mantiene la verificación/pagos reales fuera de la IA y bloqueados sin evidencia.',
          aiPrompt: 'Audita esta lista ficticia de incorporación. Identifica responsabilidades ausentes sobre vendedor, devoluciones, datos y pagos. Compara plataformas sin adivinar funciones/tarifas actuales. No pidas credenciales/datos de tarjeta ni certifiques contratos o vendedores: [lista].'
        },
        'marketplace-catalog': {
          title: 'Normalizar el catálogo con IA sin inventar datos',
          explanation: [
            'Conserva los datos aportados por vendedores y sus identificadores vendedor/SKU en una hoja de origen inmutable. S1 aporta N1: dos cuadernos A5 rayados de 80 páginas cada uno; S2 aporta P1: tres bolígrafos de tinta negra. Marca, certificaciones y plazo de entrega son desconocidos. La IA puede uniformar hechos aprobados, no mezclar vendedores ni añadir características.',
            'Crea un registro de afirmaciones y una cola de revisión. Rechaza cuadernos reciclados y bolígrafos recargables porque no hay evidencia. Si falta identificador, permiso de imagen o información de seguridad, queda pendiente, no publicado. No uses reseñas falsas, manipulación de reseñas pagadas, textos copiados ni valoraciones inventadas.',
            'Prueba manualmente dos búsquedas: cuadernos A5 debe mostrar S1/N1; bolígrafos negros, S2/P1. Cuaderno impermeable debe devolver NO VERIFIED MATCH. Es clasificación de práctica, no confirmación de inventario, aval de vendedor ni recomendación de compra.'
          ],
          file: 'Práctica de catálogo',
          code: 'seller_id | sku | approved facts | status\nS1 | N1 | 2 cuadernos A5 rayados; 80 páginas cada uno | DRAFT\nS2 | P1 | 3 bolígrafos de tinta negra | DRAFT\nConsultas: cuadernos A5 -> S1/N1; bolígrafos negros -> S2/P1\nCuaderno impermeable -> NO VERIFIED MATCH\nMarca/imágenes/certificaciones desconocidas -> REVIEW\nRegistro: afirmación | dato de origen | conservar/corregir/eliminar',
          check: 'Conservas identidad vendedor/SKU, reproduces tres resultados y rechazas características sin respaldo.',
          aiPrompt: 'Normaliza estos dos anuncios ficticios usando solo datos aprobados. Conserva IDs vendedor/SKU. Devuelve registro y tres resultados. Falta de evidencia significa REVIEW o NO VERIFIED MATCH, no características ni valoraciones inventadas: [catálogo y consultas].'
        },
        'marketplace-orders-and-commission': {
          title: 'Conciliar pedidos, reembolsos y comisiones',
          explanation: [
            'Usa tres pedidos ficticios en USD: O1/S1 bruto 100, reembolso 0; O2/S2 bruto 80, reembolso 20; O3/S1 bruto 50, reembolso 50. Solo en este ejercicio, la comisión acordada es 10% de mercancía tras reembolsos. Los contratos reales pueden usar otra base; no es una cotización de tarifas.',
            'Importes retenidos: 100, 60, 0; comisiones del operador: 10, 6, 0; asignaciones a vendedores antes de otros costes: 90, 54, 0. Totales: bruto 230 - reembolsos 70 = retenido 160 = comisión 16 + asignaciones 144. Asignación S1: 90; S2: 54. Son asignaciones de hoja, no pagos reales ni beneficio del operador.',
            'Conserva cada ID de pedido y rechaza repetir O2 en vez de contarlo dos veces. Reembolsos desconocidos quedan sin resolver. La IA puede explicar el registro y señalar incoherencias; las fórmulas deterministas y la comprobación manual establecen la aritmética. Se excluyen tarifas, impuestos, contracargos, plazos y reservas; no se envía ningún pago.'
          ],
          file: 'Hoja de comisiones',
          code: 'order | seller | gross | refund | retained | 10% commission | seller allocation\nO1 | S1 | 100 | 0 | 100 | 10 | 90\nO2 | S2 | 80 | 20 | 60 | 6 | 54\nO3 | S1 | 50 | 50 | 0 | 0 | 0\nTotales: 230 | 70 | 160 | 16 | 144\nComprobaciones: 230-70=160; 16+144=160\nO2 duplicado -> ERROR/REVIEW, no otra venta\nReembolso ausente -> UNRESOLVED, no cero\nNo son pagos/beneficios reales; no se mueve dinero.',
          check: 'Concilias 230/70/160/16/144 y asignaciones 90/54 y rechazas el doble conteo.',
          aiPrompt: 'Audita este registro ficticio con comisión del 10% tras reembolsos. Muestra cálculos por pedido, vendedor y total. Señala IDs duplicados y reembolsos ausentes sin elegir valores en silencio. No llames pagos a las asignaciones ni beneficio a la comisión: [registro].'
        },
        'marketplace-support': {
          title: 'Planificar atención moderada y disputas',
          explanation: [
            'Define un flujo de pedido: borrador, aceptado por vendedor, embalado, enviado, evidencia de entrega recibida, cerrado; los casos no resueltos requieren revisión. Un mensaje de estado no demuestra entrega. Asigna cada etapa y evidencia a una persona, sin que la IA apruebe el cierre.',
            'Practica con una queja ficticia por paquete dañado y resultado desconocido. La IA puede resumir y redactar acuse neutral. Deriva al revisor autorizado del operador/vendedor; no culpes, prometas compensación, reembolses ni envíes mensajes automáticamente. Comprueba derechos y plazos de escalado locales/de plataforma vigentes.',
            'Mantén reglas de moderación para productos/afirmaciones prohibidos, anuncios duplicados y reseñas sospechosas. Registra motivos y una vía de apelación humana. No infieras fraude ni sanciones a partir solo de una clasificación de IA; protege datos personales y limita el acceso a los casos.'
          ],
          file: 'Guía de atención y escalado',
          code: 'Caso M1: paquete dañado comunicado; resultado UNKNOWN\nEvidencia necesaria: referencia de pedido aprobada y registros permitidos\nResponsable: revisor autorizado del operador/vendedor\nBorrador: acusar recibo; explicar revisión; sin reembolso/plazo inventado\nEstado: REVIEW REQUIRED\nModeración: motivo, evidencia, revisor, vía de apelación\nSin envío, sanción, pago ni reembolso automático.',
          check: 'El borrador conserva la incertidumbre y la guía requiere evidencia, revisor y vía de apelación.',
          aiPrompt: 'Resume esta queja ficticia y redacta un acuse neutral. Enumera evidencia y preguntas de escalado sin recoger datos privados, culpar a nadie ni prometer reembolsos/plazos. Revisa la ruta humana de moderación/apelación: [caso].'
        },
        'marketplace-handover': {
          title: 'Entregar un prototipo de operaciones de mercado',
          explanation: [
            'Entrega un modelo ficticio claramente etiquetado, lista de vendedores, catálogo/registro de afirmaciones, hoja de tres pedidos, guía de atención y comparación de plataformas. Reabre archivos y registra comprobaciones. Pantallas en papel y hojas demuestran aprendizaje del flujo, no software multivendedor activo ni preparación de pagos.',
            'Limita el servicio a dos perfiles de vendedor, dos borradores de catálogo, conciliación de tres pedidos y un caso de atención, con una ronda de revisión. Separa tiempo/costes internos de tarifa propuesta. Excluye aprobación de vendedores, gestión de dinero, certificación legal, moderación automática y garantías.',
            'La aprobación real del vendedor/operador y la demanda quedan BLOCKED/UNVALIDATED sin evidencia real. Continuar significa investigar más o diseñar pruebas supervisadas, no comerciar en vivo. Registra la documentación de plataforma y revisión cualificada necesarias antes del lanzamiento.'
          ],
          file: 'Entrega de mercado',
          code: 'Modelo | lista de vendedores | catálogo | registro | pedidos | guía de atención\nComprobaciones: identidad conservada; tres búsquedas; 230/70/160/16/144\nMétodo: prototipo en hoja/papel, no mercado activo\nAprobación real: BLOCKED; demanda UNVALIDATED\nAlcance, exclusiones, una revisión, costes internos, tarifa propuesta por separado:\nPróxima evidencia / revisor / decisión:',
          check: 'El prototipo contiene resultados comprobados y no afirma ser un mercado activo, pagos ni vendedores aprobados.',
          aiPrompt: 'Revisa esta entrega ficticia para detectar evidencia ausente, roles confusos, riesgos de pago/datos y promesas sin respaldo. Mantén aprobación bloqueada y límites explícitos. No inventes usuarios, ingresos ni preparación para lanzar: [paquete].'
        }
      }
    }
  },
  'ai-logistics-services': {
    fr: {
      title: 'Services logistiques avec l’IA',
      intro: 'Explorez stockage et exécution à partir de réceptions, réservations, expéditions/retours et coûts fictifs. L’IA aide à expliquer et rédiger ; aucune marchandise, adresse ni expédition réelle n’est traitée.',
      steps: {
        'logistics-model-and-scope': {
          title: 'Définir les services logistiques pour le commerce en ligne',
          explanation: [
            'Un prestataire logistique peut recevoir, stocker, prélever, emballer, expédier et gérer les retours pour des détaillants ou vendeurs de marketplace. Il ne possède pas automatiquement ces biens. Définissez garde, propriété du stock, pertes/dommages, assurance et responsabilités de revue. Ce cours porte uniquement sur de la papeterie fictive ordinaire ; aucun produit dangereux, réglementé, thermosensible ou critique pour la sécurité.',
            'Interrogez des entreprises consentantes sur volume de commandes, erreurs, délais attendus et processus actuel. La demande reste non validée sans preuve. Comparez stockage interne, prestataire d’exécution et transporteurs selon exigences et conditions locales actuelles, pas des tarifs supposés. Installations, sécurité du personnel, manutention et assurance réelles exigent un examen approprié.',
            'Commencez par un tableur et une procédure écrite, pas des expéditions réelles. Pour de futurs logiciels, comparez identités SKU, pistes d’audit, autorisations, exports et intégrations. Utilisez brouillons/tests et données fictives ; ne téléversez jamais d’adresses clients, codes d’accès ou stocks confidentiels dans un chat IA.'
          ],
          file: 'Brief logistique fictif',
          code: 'Le client C1 possède des carnets et stylos ordinaires\nHypothèse de service : recevoir, stocker, prélever/emballer et préparer les registres d’expédition\nExercice : 2 lignes de stock, 3 commandes, 1 retour, 1 feuille de coûts\nExclus : expéditions réelles, contrôle d’itinéraire, marchandises réglementées, conseil juridique/responsabilité\nPays, installation, sécurité/assurance : TO CONFIRM\nDemande UNVALIDATED ; approbation client réelle BLOCKED',
          check: 'Vous séparez la garde logistique de la propriété commerciale et excluez expéditions réelles et biens réglementés.',
          aiPrompt: 'Cadre ce service logistique fictif. Rédige des questions neutres de découverte et les contrôles de responsabilités, installation, sécurité, assurance et données à revoir avec un spécialiste. Compare les logiciels sans inventer tarifs ni certification : [brief].'
        },
        'logistics-receiving-and-stock': {
          title: 'Vérifier la réception et les écarts de stock',
          explanation: [
            'Conservez séparément source, unités comptées, emplacement, état et réviseur. Réception fictive attendue : NB-A 30, PN-B 20. Comptage : NB-A 28 utilisables plus 2 endommagées/en quarantaine ; PN-B 20 utilisables. Rapprochez NB-A : total 30 = 28 utilisables + 2 en quarantaine, sans inclure les unités endommagées dans le disponible.',
            'Attribuez les emplacements d’exercice A1 et B1 et gardez le registre d’écarts. Quantité ou état inconnus signifient revue, pas disponibilité. L’IA peut résumer et préparer des questions ; elle ne peut inspecter les biens, approuver une réclamation de dommage ni remplacer un comptage physique.',
            'Pour une réception réelle, suivez la procédure autorisée et la formation appropriée. Une simulation sur tableur ne prouve ni sécurité de l’entrepôt, ni limite de charge, ni méthode de manutention. Les biens en quarantaine nécessitent une décision de disposition autorisée avant toute libération.'
          ],
          file: 'Feuille de réception',
          code: 'SKU | expected | usable | quarantined | total | location\nNB-A | 30 | 28 | 2 | 30 | A1\nPN-B | 20 | 20 | 0 | 20 | B1\nÉcart NB-A : 2 endommagés ; REVIEW, non disponibles\nPreuve : comptage fictif seulement ; aucune inspection réelle\nÉtat/compte inconnu -> REVIEW\nLibération/disposition : décision du propriétaire autorisé requise',
          check: 'Vous rapprochez les réceptions totales 30 et 20, avec seulement 28 et 20 unités utilisables.',
          aiPrompt: 'Rapproche cette réception fictive et distingue stock utilisable et en quarantaine. Rédige un écart sans prétendre à une inspection physique ni décider compensation/disposition. Comptages manquants non résolus : [lignes].'
        },
        'logistics-pick-and-pack': {
          title: 'Simuler le prélèvement avec contrôles de stock et doublon',
          explanation: [
            'Traitez les commandes fictives dans l’ordre : L1 demande NB-A 5 et PN-B 3 ; L2 demande NB-A 25 ; L3 demande PN-B 4. Stock utilisable initial : NB-A 28, PN-B 20. Réservez L1 : reste NB-A 23 et PN-B 17. L2 ne peut pas être exécutée intégralement : HOLD, pénurie de 2 ; aucune réservation dans cet exercice. Réservez L3 : PN-B 13.',
            'Stock disponible final : NB-A 23 et PN-B 13 ; réservations : NB-A 5 et PN-B 7. Les unités en quarantaine restent exclues. Une répétition de L1 doit être signalée en doublon, sans nouveau prélèvement. L’exercice suppose des réservations intégrales ; le client doit définir les règles réelles de reliquat ou de livraison partielle.',
            'Créez une liste de prélèvement/contrôle/emballage avec SKU, quantité, état et réviseur. Une réservation n’est ni un prélèvement physique ni une expédition. L’IA peut expliquer les pénuries et organiser la liste ; elle ne doit pas remplacer les comptes ni certifier l’emballage.'
          ],
          file: 'Simulation de commandes',
          code: 'Stock utilisable initial : NB-A 28 ; PN-B 20\nL1: NB-A 5, PN-B 3 -> RESERVED\nL2: NB-A 25 -> HOLD, pénurie 2 ; aucune réservation\nL3: PN-B 4 -> RESERVED\nDisponible final : NB-A 23 ; PN-B 13\nRéservé : NB-A 5 ; PN-B 7\nL1 répété -> DUPLICATE/REVIEW\nPreuve de prélèvement/emballage : NOT PERFORMED - simulation only',
          check: 'Vous retrouvez disponible 23/13 et réservé 5/7, bloquez L2 et rejetez le doublon L1.',
          aiPrompt: 'Déroule ces commandes fictives dans l’ordre, avec réservations intégrales et stock utilisable uniquement. Montre soldes, pénurie et doublons. N’utilise pas le stock en quarantaine et ne présente pas les réservations comme emballées/expédiées : [commandes].'
        },
        'logistics-dispatch-and-returns': {
          title: 'Planifier les preuves d’expédition et les retours contrôlés',
          explanation: [
            'Rédigez une liste d’expédition : commande approuvée, contrôles prélèvement/emballage terminés, destination vérifiée dans le système autorisé, admissibilité du transporteur/service, conditions convenues et preuve d’acceptation du transporteur. Un numéro de suivi généré ou collecte prévue ne prouve pas l’expédition/livraison. Aucun envoi ni aucune adresse n’est traité ici.',
            'Demandez à l’IA de rédiger un statut indiquant que la commande est en cours de vérification, pas livrée. Un humain consulte les dossiers réels du transporteur avant de changer le statut ou répondre. Les outils d’itinéraire peuvent aider, mais routes, accès et sécurité des conducteurs exigent une revue réelle ; ce cours ne fournit pas d’instructions opérationnelles d’itinéraire.',
            'Simulez le retour R1 : une unité NB-A est signalée comme retournée d’une commande antérieure terminée, hors de cet exercice de réservation. Gardez-la en quarantaine en attente d’inspection ; ne l’ajoutez pas au stock disponible et ne changez pas les soldes 23/13. Disposition et remboursement sont des décisions autorisées distinctes, pas des sorties IA.'
          ],
          file: 'Registre expédition et retour',
          code: 'Commande | preuve prélèvement/emballage | acceptation transporteur | statut\nL1 | NOT PERFORMED | NONE | RESERVED ONLY\nL3 | NOT PERFORMED | NONE | RESERVED ONLY\nR1 : 1 NB-A d’une commande antérieure ; quarantaine avant inspection\nDisponible après R1 : NB-A 23 ; PN-B 13 (inchangé)\nApprobation retour / remboursement : UNKNOWN, aucune action automatique\nAucune adresse, expédition ou preuve de livraison générée',
          check: 'Vous distinguez réservation, expédition et preuve de livraison, et gardez R1 hors stock avant inspection.',
          aiPrompt: 'Examine ce registre fictif d’expédition/retour. Repère les preuves manquantes et rédige un statut de vérification honnête. Garde R1 en quarantaine et soldes inchangés. N’invente ni suivi, inspection, livraison ni approbation de remboursement : [registre].'
        },
        'logistics-cost-and-report': {
          title: 'Calculer la contribution de service et rapporter les exceptions',
          explanation: [
            'Exemple de planification USD inventé : frais de service 8 par commande traitée, allocation de travail 3, emballage 1 et frais généraux 2. Contribution = 8 - 3 - 1 - 2 = USD 2/commande, soit 25 % des frais. Pour 10 commandes hypothétiques : frais 80, allocations 60, contribution 20. Ce ne sont ni tarifs de marché ni revenus réels ; expédition, assurance, taxes et autres coûts sont exclus/inconnus.',
            'Séparez ce scénario de coûts à 10 commandes de l’exercice de réservation à trois commandes. Rapportez les résultats observés : deux réservées, une bloquée, zéro prélèvement/expédition physiques, un doublon de test rejeté et un retour en attente d’inspection. Ne prétendez ni livraison réussie ni économies.',
            'Demandez à l’IA un rapport d’exceptions en cinq phrases, puis vérifiez chaque nombre/statut avec la source. Avant une offre réelle, consignez temps, volumes, tarifs fournisseurs, exceptions et payeur des frais transport/retour. Les coûts inconnus empêchent l’estimation complète du bénéfice.'
          ],
          file: 'Rapport de coûts et exceptions',
          code: 'USD illustratifs : 8 - 3 - 1 - 2 = 2/commande ; 25%\n10 commandes hypothétiques : 80 - 60 = 20\nExclus/inconnus : expédition, assurance, taxes, autres coûts\nSimulation distincte : 2 réservées ; 1 bloquée ; 0 expédition physique\nTest doublon : 1 rejeté ; retour : 1 unité en quarantaine avant inspection\nÉconomies, revenus et livraison réels : NOT ESTABLISHED',
          check: 'Vous calculez 2/25 % et 80/60/20 sans confondre coûts hypothétiques et résultats de simulation.',
          aiPrompt: 'Vérifie ces calculs fictifs et rédige cinq phrases sur les exceptions. Sépare scénario à 10 commandes et simulation à trois commandes. Ne prétends ni expéditions, économies, bénéfices réels ni coûts complets : [chiffres].'
        },
        'logistics-handover': {
          title: 'Livrer un prototype logistique traçable',
          explanation: [
            'Rassemblez périmètre, registre réception/état, lignes sources conservées, feuille de réservation, contrôles doublons/pénuries, procédure expédition/retour et rapport coûts/exceptions. Rouvrez les fichiers et notez les contrôles réellement faits. Indiquez clairement qu’il s’agit d’une simulation, pas d’un entrepôt, d’une inspection de stock ou d’une intégration transporteur.',
            'Limitez le premier engagement à la correction des registres de stock et aux rapports d’état de commande vérifiés, pas à une logistique physique hors compétence. Définissez stock appartenant au client, limites d’accès, transmission, conservation/suppression, réviseur, une révision et exclusions. Installations, manutention, assurance et contrats réels nécessitent une approbation distincte appropriée.',
            'Gardez approbation client réelle BLOCKED et demande UNVALIDATED sans preuve. Séparez temps/coûts internes et honoraires proposés. Continuer signifie découverte ou pratique supervisée, jamais expédition, libération de stock, remboursement ou certification opérationnelle automatiques.'
          ],
          file: 'Transmission logistique',
          code: 'Périmètre | registre réception | stock brut/travail | réservations | exceptions\nProcédure expédition/retour | coûts | rapport | journal des versions\nContrôles : utilisables 28/20 ; disponible 23/13 ; réservé 5/7 ; L2 bloquée\nR1 en quarantaine ; 0 expédition réelle ; 2/25% ; 80/60/20 hypothétiques\nApprobation réelle BLOCKED ; opérations physiques NOT PERFORMED\nDonnées/accès, conservation/suppression, réviseur, honoraires proposés, exclusions :\nProchaine preuve et décision :',
          check: 'Le prototype contient des registres vérifiés sans prétendre à exécution physique, approbation réelle ou bénéfice complet.',
          aiPrompt: 'Examine cette transmission logistique fictive : preuves manquantes, garde floue, risques d’accès/données et promesses opérationnelles non étayées. Sépare simulation et opérations réelles. N’invente ni approbation, inspection, assurance ni revenu : [ensemble].'
        }
      }
    },
    de: {
      title: 'KI-gestützte Logistikdienstleistungen',
      intro: 'Erkunde Lagerung und Fulfillment anhand fiktiver Wareneingänge, Reservierungen, Versand-/Retourenprotokolle und Kostenberichte. KI hilft beim Erklären und Entwerfen; Waren, Adressen und echte Sendungen werden nicht verarbeitet.',
      steps: {
        'logistics-model-and-scope': {
          title: 'Logistikleistungen für Online-Unternehmen abgrenzen',
          explanation: [
            'Ein Logistiker kann Waren für Händler/Marktplatzverkäufer annehmen, lagern, kommissionieren, verpacken, versenden und Retouren bearbeiten. Er besitzt die Waren dadurch nicht automatisch. Definiere Verwahrung, Bestandseigentum, Verlust-/Schadensbehandlung, Versicherung und Prüferrollen. Dieser Kurs übt nur mit gewöhnlicher fiktiver Schreibware, nicht mit gefährlichen, regulierten, temperaturgeführten oder sicherheitskritischen Gütern.',
            'Befrage einwilligende Unternehmen zu Bestellvolumen, Fehlern, Liefererwartungen und aktuellem Ablauf. Nachfrage bleibt ohne Beleg unvalidiert. Vergleiche eigene Lagerung, Fulfillment-Dienstleister und Spediteur anhand aktueller lokaler Anforderungen/Bedingungen, nicht geschätzter Preise. Echte Anlagen, Arbeitsschutz, Warenhandhabung und Versicherung benötigen angemessene Prüfung.',
            'Beginne mit Tabelle und schriftlichem Handbuch statt Live-Sendungen. Vergleiche künftige Software nach SKU-Identität, Audit-Trail, Berechtigungen, Exporten und Integrationen. Nur Entwurf/Test und fiktive Daten; niemals Kundenadressen, Zugangscodes oder vertrauliche Bestandsdaten in KI-Chats laden.'
          ],
          file: 'Fiktives Logistikbriefing',
          code: 'Kunde C1 besitzt gewöhnliche Notizbücher und Stifte\nServiceannahme: Wareneingang, Lagerung, Kommissionierung/Packen und Versandaufzeichnungen vorbereiten\nÜbung: 2 Bestandszeilen, 3 Aufträge, 1 Retoure, 1 Kostenblatt\nAusgeschlossen: echte Sendungen, Routensteuerung, regulierte Güter, Haftungs-/Rechtsberatung\nLand, Anlage, Sicherheits-/Versicherungsanforderungen: TO CONFIRM\nNachfrage UNVALIDATED; echte Kundenfreigabe BLOCKED',
          check: 'Du trennst logistische Verwahrung von Händlereigentum und schließt Live-Sendungen sowie regulierte Güter aus.',
          aiPrompt: 'Grenze diese fiktive Logistikleistung ab. Formuliere neutrale Discovery-Fragen und Prüfungen zu Rollen, Anlage, Sicherheit, Versicherung und Daten für Fachleute. Vergleiche Software ohne Preise/Zertifizierung zu erfinden: [Briefing].'
        },
        'logistics-receiving-and-stock': {
          title: 'Wareneingang und Bestandsabweichungen prüfen',
          explanation: [
            'Quelle, gezählte Einheiten, Standort, Zustand und Prüfer getrennt halten. Fiktiver erwarteter Eingang: NB-A 30, PN-B 20. Gezählt: NB-A 28 verwendbar plus 2 beschädigt/in Quarantäne; PN-B 20 verwendbar. NB-A abgleichen: gesamt 30 = 28 verwendbar + 2 Quarantäne, beschädigte Ware nicht als verfügbar zählen.',
            'Übungsstandorte A1 und B1 zuweisen und Abweichungsprotokoll erhalten. Unbekannte Menge/Zustand bedeutet Prüfung, nicht verfügbar. KI kann zusammenfassen und Fragen entwerfen, aber Ware nicht inspizieren, Schadenersatz genehmigen oder Zählung ersetzen.',
            'Echten Wareneingang nach autorisiertem Verfahren und passender Schulung durchführen. Eine Tabellenübung belegt weder sicheres Lagerlayout noch Lastgrenzen oder Handhabungsmethode. Quarantäneware braucht eine autorisierte Dispositionsentscheidung vor Freigabe.'
          ],
          file: 'Wareneingangsblatt',
          code: 'SKU | expected | usable | quarantined | total | location\nNB-A | 30 | 28 | 2 | 30 | A1\nPN-B | 20 | 20 | 0 | 20 | B1\nNB-A-Abweichung: 2 beschädigt; REVIEW, nicht verfügbar\nBeleg: nur fiktive Zählung; keine echte Inspektion\nUnbekannter Zustand/Zählung -> REVIEW\nFreigabe/Entsorgung: autorisierte Eigentümerentscheidung nötig',
          check: 'Du gleichst Gesamtzugang 30 und 20 ab und hältst nur 28 und 20 Einheiten für verwendbar.',
          aiPrompt: 'Gleiche diesen fiktiven Eingang ab und unterscheide verwendbaren Bestand von Quarantäne. Formuliere eine Abweichungsnotiz ohne physische Prüfung oder Entscheidung zu Ersatz/Entsorgung zu behaupten. Fehlende Zählungen bleiben offen: [Zeilen].'
        },
        'logistics-pick-and-pack': {
          title: 'Kommissionierung mit Bestands- und Duplikatprüfung simulieren',
          explanation: [
            'Bearbeite fiktive Aufträge der Reihe nach: L1 benötigt NB-A 5 und PN-B 3; L2 benötigt NB-A 25; L3 benötigt PN-B 4. Anfangs verwendbar: NB-A 28, PN-B 20. L1 reservieren: verfügbar NB-A 23, PN-B 17. L2 ist nicht vollständig erfüllbar: HOLD, Fehlmenge 2; in dieser Übung nichts für L2 reservieren. L3 reservieren: PN-B 13.',
            'Endbestand verfügbar NB-A 23 und PN-B 13; reserviert NB-A 5 und PN-B 7. Quarantäneeinheiten ausgeschlossen. Erneutes L1 als Duplikat markieren, nicht erneut kommissionieren. Die Übung nimmt vollständige Reservierung an; reale Teilfüllungs-/Rückstandsregeln muss der Kunde festlegen.',
            'Erstelle Kommissionier-/Kontroll-/Packliste mit SKU, Menge, Zustand und Prüfer. Reservierung ist keine physische Kommissionierung oder Sendung. KI darf Fehlmengen erklären und Listen ordnen, aber Zählungen nicht überschreiben oder Verpackung zertifizieren.'
          ],
          file: 'Auftragssimulation',
          code: 'Start verwendbar: NB-A 28; PN-B 20\nL1: NB-A 5, PN-B 3 -> RESERVED\nL2: NB-A 25 -> HOLD, Fehlmenge 2; keine Reservierung\nL3: PN-B 4 -> RESERVED\nEndbestand verfügbar: NB-A 23; PN-B 13\nReserviert: NB-A 5; PN-B 7\nL1 wiederholt -> DUPLICATE/REVIEW\nKommissionier-/Packbeleg: NOT PERFORMED - simulation only',
          check: 'Du erhältst 23/13 verfügbar und 5/7 reserviert, hältst L2 an und weist doppeltes L1 zurück.',
          aiPrompt: 'Führe diese fiktiven Aufträge der Reihe nach mit vollständigen Reservierungen und nur verfügbarem Bestand durch. Zeige Salden, Fehlmenge und Duplikate. Quarantänebestand nicht nutzen und Reservierungen nicht als verpackt/versandt bezeichnen: [Aufträge].'
        },
        'logistics-dispatch-and-returns': {
          title: 'Versandbelege und kontrollierte Retouren planen',
          explanation: [
            'Erstelle Versandcheckliste: genehmigter Auftrag, abgeschlossene Kommissionier-/Packkontrollen, verifizierter Zielort im autorisierten System, Eignung von Spediteur/Dienst, vereinbarte Lieferbedingungen und Annahmebeleg des Spediteurs. Eine generierte Trackingnummer oder geplante Abholung beweist keinen Versand/keine Zustellung. Diese Übung verarbeitet keine Sendungen oder Adressen.',
            'KI soll eine Statusnachricht entwerfen, dass ein Auftrag geprüft wird, nicht zugestellt wurde. Vor Statusänderung/Antwort prüft ein Mensch echte Speditionsdaten. Routen-Tools können Planung unterstützen, aber Routen, Zufahrtsbeschränkungen und Fahrersicherheit erfordern reale Prüfung; dieser Kurs enthält keine operativen Routenanweisungen.',
            'R1 simulieren: eine NB-A-Einheit wurde aus einer früher abgeschlossenen Bestellung außerhalb der Reservierungsübung zurückgesendet. Bis zur Prüfung quarantänisieren; nicht verfügbar buchen oder Salden 23/13 ändern. Disposition und Erstattung sind getrennte autorisierte Entscheidungen, keine KI-Ausgaben.'
          ],
          file: 'Versand- und Retourenprotokoll',
          code: 'Auftrag | Kommissionier-/Packbeleg | Speditionsannahme | Status\nL1 | NOT PERFORMED | NONE | RESERVED ONLY\nL3 | NOT PERFORMED | NONE | RESERVED ONLY\nR1: 1 NB-A aus früherem Auftrag; Quarantäne bis Prüfung\nVerfügbar nach R1: NB-A 23; PN-B 13 (unverändert)\nRetourenfreigabe / Erstattung: UNKNOWN, keine automatische Aktion\nKeine Adressdaten, Sendungen oder generierten Lieferbelege',
          check: 'Du unterscheidest Reservierung, Versand- und Zustellbeleg und hältst R1 bis zur Prüfung aus verfügbarem Bestand.',
          aiPrompt: 'Prüfe dieses fiktive Versand-/Retourenprotokoll. Benenne fehlende Belege und entwirf eine wahrheitsgemäße Statusmeldung. R1 quarantänisiert lassen und Salden unverändert. Kein Tracking, Inspektion, Zustellung oder Erstattungsfreigabe erfinden: [Protokoll].'
        },
        'logistics-cost-and-report': {
          title: 'Service-Deckungsbeitrag berechnen und Ausnahmen berichten',
          explanation: [
            'Erfundenes USD-Planungsbeispiel: Servicegebühr 8 je bearbeitetem Auftrag, Arbeitskostenansatz 3, Verpackung 1 und Gemeinkostenansatz 2. Deckungsbeitrag = 8 - 3 - 1 - 2 = USD 2/Auftrag bzw. 25 % der Gebühr. Für 10 hypothetische Aufträge: Gebühren 80, Ansätze 60, Beitrag 20. Keine Marktpreise oder echten Umsätze; Versand, Versicherung, Steuern und weitere Kosten fehlen/offen.',
            'Das 10-Aufträge-Kostenszenario getrennt von der Drei-Aufträge-Reservierungsübung halten. Beobachtete Übungsergebnisse berichten: zwei reserviert, einer angehalten, null physisch kommissioniert/versandt, ein Duplikattest abgelehnt, eine Retoure wartet auf Prüfung. Keine erfolgreiche Zustellung oder Einsparung behaupten.',
            'KI um Fünf-Satz-Ausnahmebericht bitten; jede Zahl und jeden Status mit Quelle prüfen. Vor echtem Angebot tatsächliche Zeit, Volumen, Anbieterkosten, Ausnahmen und Kostenträger für Spediteur/Retouren dokumentieren. Unbekannte Kosten verhindern eine vollständige Gewinnschätzung.'
          ],
          file: 'Kosten- und Ausnahmebericht',
          code: 'Beispiel USD: 8 - 3 - 1 - 2 = 2/Auftrag; 25%\n10 hypothetisch bearbeitete Aufträge: 80 - 60 = 20\nAusgeschlossen/unbekannt: Versand, Versicherung, Steuern, weitere Kosten\nSeparate Auftragssimulation: 2 reserviert; 1 angehalten; 0 physische Sendungen\nDuplikattest: 1 abgelehnt; Retoure: 1 Einheit bis Prüfung quarantänisiert\nEchte Einsparungen, Umsätze und Zustellung: NOT ESTABLISHED',
          check: 'Du berechnest 2/25 % und 80/60/20, ohne hypothetische Kosten mit Simulationsergebnissen zu vermischen.',
          aiPrompt: 'Prüfe diese fiktiven Kosten und verfasse einen Fünf-Satz-Ausnahmebericht. 10-Aufträge-Szenario vom Drei-Aufträge-Test trennen. Keine echten Sendungen, Einsparungen, Gewinne oder vollständige Kosten behaupten: [Werte].'
        },
        'logistics-handover': {
          title: 'Nachvollziehbaren Logistikprototyp übergeben',
          explanation: [
            'Bündele Umfang, Wareneingangs-/Zustandsprotokoll, erhaltene Quellzeilen, Reservierungsblatt, Duplikat-/Fehlmengenkontrollen, Versand-/Retourenhandbuch und Kosten-/Ausnahmebericht. Dateien erneut öffnen und tatsächlich ausgeführte Prüfungen dokumentieren. Tabellenübung klar benennen: kein Lagerbetrieb, keine Bestandsinspektion und keine Speditionsintegration.',
            'Begrenze ersten Support auf Bestandsdatenbereinigung und geprüfte Auftragsstatusberichte, nicht auf Logistik außerhalb der eigenen Kompetenz. Kundenbestand, Zugriff, Übergabe, Aufbewahrung/Löschung, Prüfer, eine Überarbeitung und Ausschlüsse definieren. Echte Anlagen/Handhabung, Versicherung und Verträge benötigen separate Freigabe.',
            'Echte Kundenfreigabe BLOCKED und Nachfrage ohne Belege UNVALIDATED lassen. Interne Zeit/Kosten und vorgeschlagene Gebühr trennen. Fortfahren bedeutet Discovery oder beaufsichtigte Übung, nie automatische Sendung, Bestandsfreigabe, Erstattung oder Betriebszertifizierung.'
          ],
          file: 'Logistikübergabe',
          code: 'Umfang | Eingangsprotokoll | Bestand roh/Arbeitskopie | Reservierungen | Ausnahmen\nVersand-/Retourenhandbuch | Kosten | Bericht | Änderungsprotokoll\nPrüfungen: verwendbar 28/20; verfügbar 23/13; reserviert 5/7; L2 angehalten\nR1 Quarantäne; 0 echte Sendungen; 2/25%; hypothetische 80/60/20\nEchte Freigabe BLOCKED; physische Vorgänge NOT PERFORMED\nDaten/Zugriff, Aufbewahrung/Löschung, Prüfer, Gebühr, Ausschlüsse:\nNächster Beleg und Entscheidung:',
          check: 'Der Prototyp enthält geprüfte Aufzeichnungen ohne Behauptungen zu physischer Erfüllung, echter Freigabe oder Gesamtgewinn.',
          aiPrompt: 'Prüfe diese fiktive Logistikübergabe auf fehlende Belege, unklare Verwahrung, Zugriffs-/Datenrisiken und unbelegte Betriebszusagen. Simulation und Realbetrieb trennen. Keine Freigabe, Inspektion, Versicherung oder Einnahmen erfinden: [Paket].'
        }
      }
    },
    es: {
      title: 'Servicios logísticos con IA',
      intro: 'Explora almacenamiento y preparación mediante recepciones, reservas, registros de envío/devolución e informes de costes ficticios. La IA ayuda a explicar y redactar; no se procesan bienes, direcciones ni envíos reales.',
      steps: {
        'logistics-model-and-scope': {
          title: 'Definir servicios logísticos para negocios en línea',
          explanation: [
            'Un proveedor logístico puede recibir, almacenar, recoger, embalar, enviar y gestionar devoluciones para comercios o vendedores de mercados. Eso no significa que sea propietario de los bienes. Define custodia, propiedad del inventario, pérdidas/daños, seguro y responsabilidades de revisión. Este curso practica solo con papelería ficticia común; excluye bienes peligrosos, regulados, con temperatura controlada o críticos para la seguridad.',
            'Entrevista a empresas que acepten participar sobre volumen de pedidos, errores, expectativas de entrega y proceso actual. La demanda sigue sin validar hasta tener evidencia. Compara almacenamiento propio, proveedor de preparación y transportistas con requisitos y condiciones locales actuales, no tarifas supuestas. Las instalaciones, seguridad laboral, manipulación y seguro reales requieren revisión adecuada.',
            'Empieza con una hoja y un procedimiento escrito, no envíos activos. Para futuro software, compara identidad SKU, auditoría, permisos, exportaciones e integración. Usa borradores/pruebas y datos ficticios; nunca subas direcciones de clientes, códigos de acceso ni registros confidenciales a un chat de IA.'
          ],
          file: 'Brief logístico ficticio',
          code: 'El cliente C1 posee cuadernos y bolígrafos comunes\nHipótesis de servicio: recibir, almacenar, recoger/embalar y preparar registros de envío\nPráctica: 2 filas de inventario, 3 pedidos, 1 devolución, 1 hoja de costes\nExcluye: envíos reales, control de rutas, bienes regulados, asesoría legal/responsabilidad\nPaís, instalaciones, requisitos de seguridad/seguro: TO CONFIRM\nDemanda UNVALIDATED; aprobación real del cliente BLOCKED',
          check: 'Separas custodia logística de propiedad comercial y excluyes envíos reales y bienes regulados.',
          aiPrompt: 'Define el alcance de este servicio logístico ficticio. Escribe preguntas neutrales y revisiones de responsabilidades, instalaciones, seguridad, seguros y datos que requieran asesoría. Compara software sin inventar tarifas ni certificaciones: [brief].'
        },
        'logistics-receiving-and-stock': {
          title: 'Comprobar recepción y discrepancias de existencias',
          explanation: [
            'Mantén separados origen, unidades contadas, ubicación, estado y revisor. Recepción ficticia esperada: NB-A 30, PN-B 20. Contado: NB-A 28 utilizables más 2 dañadas/en cuarentena; PN-B 20 utilizables. Concilia NB-A: total 30 = 28 utilizables + 2 en cuarentena, sin incluir dañadas en existencias disponibles.',
            'Asigna ubicaciones de práctica A1 y B1 y conserva el registro de discrepancias. Cantidad o estado desconocidos requieren revisión, no disponibilidad. La IA puede resumir y redactar preguntas; no inspecciona bienes, aprueba reclamaciones de daños ni sustituye un recuento físico.',
            'Para recepción real, sigue el procedimiento autorizado y la formación adecuada. Una simulación en hoja no demuestra seguridad del almacén, límite de carga ni método de manipulación. Los bienes en cuarentena necesitan decisión autorizada de disposición antes de liberarse.'
          ],
          file: 'Hoja de recepción',
          code: 'SKU | expected | usable | quarantined | total | location\nNB-A | 30 | 28 | 2 | 30 | A1\nPN-B | 20 | 20 | 0 | 20 | B1\nDiscrepancia NB-A: 2 dañadas; REVIEW, no disponibles\nEvidencia: solo recuento ficticio; sin inspección real\nEstado/recuento desconocido -> REVIEW\nLiberación/disposición: requiere decisión del propietario autorizado',
          check: 'Concilias recepciones totales de 30 y 20, manteniendo solo 28 y 20 unidades utilizables.',
          aiPrompt: 'Concilia esta recepción ficticia y distingue inventario utilizable del que está en cuarentena. Redacta la discrepancia sin afirmar inspección física ni decidir compensación/disposición. Recuentos ausentes sin resolver: [filas].'
        },
        'logistics-pick-and-pack': {
          title: 'Simular preparación con controles de inventario y duplicados',
          explanation: [
            'Procesa pedidos ficticios en orden: L1 necesita NB-A 5 y PN-B 3; L2 necesita NB-A 25; L3 necesita PN-B 4. Empieza con NB-A 28 y PN-B 20 utilizables. Reserva L1: quedan NB-A 23 y PN-B 17. L2 no puede completarse: HOLD, faltan 2; en este ejercicio no reserves nada para L2. Reserva L3: PN-B 13.',
            'Existencias finales disponibles: NB-A 23 y PN-B 13; reservadas: NB-A 5 y PN-B 7. Se excluyen unidades en cuarentena. Marca repetir L1 como duplicado, no lo prepares de nuevo. El ejercicio supone reservas completas; el cliente debe definir las reglas reales de preparación parcial/pedidos pendientes.',
            'Crea una lista de recogida/comprobación/embalaje con SKU, cantidad, estado y revisor. Una reserva no es recogida física ni envío. La IA puede explicar faltantes y organizar una lista; no debe sustituir recuentos ni certificar el embalaje.'
          ],
          file: 'Simulación de pedidos',
          code: 'Inicio utilizable: NB-A 28; PN-B 20\nL1: NB-A 5, PN-B 3 -> RESERVED\nL2: NB-A 25 -> HOLD, faltan 2; sin reserva\nL3: PN-B 4 -> RESERVED\nDisponibles finales: NB-A 23; PN-B 13\nReservado: NB-A 5; PN-B 7\nRepetir L1 -> DUPLICATE/REVIEW\nEvidencia de recogida/embalaje: NOT PERFORMED - simulation only',
          check: 'Reproduces 23/13 disponibles y 5/7 reservados, retienes L2 y rechazas L1 duplicado.',
          aiPrompt: 'Procesa estos pedidos ficticios secuencialmente con reservas completas y solo existencias utilizables. Muestra saldos, faltantes y duplicados. No uses cuarentena ni llames enviado/embalado a lo reservado: [pedidos].'
        },
        'logistics-dispatch-and-returns': {
          title: 'Planificar evidencia de envío y devoluciones controladas',
          explanation: [
            'Redacta una lista de envío: pedido aprobado, controles de recogida/embalaje completados, destino verificado en sistema autorizado, elegibilidad del transportista/servicio, condiciones acordadas y prueba de aceptación del transportista. Un número de seguimiento generado o recogida planificada no demuestra envío/entrega. Este ejercicio no envía nada ni guarda direcciones.',
            'Pide a la IA redactar un estado que indique que el pedido está en revisión, no entregado. Una persona comprueba registros reales del transportista antes de cambiar estado o responder. Las herramientas de rutas pueden ayudar a planificar, pero rutas, restricciones de acceso y seguridad de conductores requieren revisión real; este curso no da instrucciones operativas de rutas.',
            'Simula devolución R1: se informa de una unidad NB-A devuelta de un pedido anterior completado, fuera de esta reserva. Mantenla en cuarentena pendiente de inspección; no la añadas a existencias ni cambies saldos 23/13. Disposición y reembolso son decisiones autorizadas aparte, no resultados de IA.'
          ],
          file: 'Registro de envíos y devoluciones',
          code: 'Pedido | evidencia de recogida/embalaje | aceptación del transportista | estado\nL1 | NOT PERFORMED | NONE | RESERVED ONLY\nL3 | NOT PERFORMED | NONE | RESERVED ONLY\nR1: 1 NB-A de pedido anterior; cuarentena hasta inspección\nDisponibles tras R1: NB-A 23; PN-B 13 (sin cambios)\nAprobación de devolución / reembolso: UNKNOWN, sin acción automática\nSin direcciones, envíos ni pruebas de entrega generadas',
          check: 'Distingues reserva, envío y evidencia de entrega y mantienes R1 fuera de existencias hasta inspección.',
          aiPrompt: 'Audita este registro ficticio de envío/devolución. Señala evidencia ausente y redacta un estado veraz de revisión. Conserva R1 en cuarentena y saldos sin cambios. No inventes seguimiento, inspección, entrega ni aprobación de reembolso: [registro].'
        },
        'logistics-cost-and-report': {
          title: 'Calcular contribución del servicio e informar excepciones',
          explanation: [
            'Ejemplo inventado de planificación en USD: tarifa de servicio 8 por pedido procesado, asignación laboral 3, embalaje 1 y gastos generales 2. Contribución = 8 - 3 - 1 - 2 = USD 2/pedido, o 25% de la tarifa. Para 10 pedidos hipotéticos: tarifas 80, asignaciones 60, contribución 20. No son tarifas de mercado ni ingresos reales; envío, seguro, impuestos y otros costes se excluyen/desconocen.',
            'Mantén separado este escenario de costes de 10 pedidos del ejercicio de reserva de tres pedidos. Informa resultados observados: dos reservados, uno retenido, cero recogidas/envíos físicos, una prueba duplicada rechazada y una unidad devuelta pendiente de inspección. No afirmes entregas exitosas ni ahorros.',
            'Pide a la IA un informe de excepciones de cinco frases y luego comprueba cada cifra/estado con la fuente. Antes de una oferta real, registra tiempo, volúmenes, tarifas de proveedores, excepciones y quién paga el transporte/devoluciones. Los costes desconocidos impiden estimar beneficio completo.'
          ],
          file: 'Informe de costes y excepciones',
          code: 'USD ilustrativos: 8 - 3 - 1 - 2 = 2/pedido; 25%\n10 pedidos hipotéticamente procesados: 80 - 60 = 20\nExcluido/desconocido: envío, seguro, impuestos, otros costes\nSimulación separada: 2 reservados; 1 retenido; 0 envíos físicos\nPrueba duplicada: 1 rechazada; devolución: 1 unidad en cuarentena hasta inspección\nAhorros, ingresos y entrega reales: NOT ESTABLISHED',
          check: 'Calculas 2/25% y 80/60/20 sin mezclar costes hipotéticos con resultados simulados.',
          aiPrompt: 'Audita estos cálculos ficticios y redacta un informe de excepciones de cinco frases. Separa el escenario de 10 pedidos de la simulación de tres. No afirmes envíos, ahorros, beneficio ni costes completos: [cifras].'
        },
        'logistics-handover': {
          title: 'Entregar un prototipo logístico trazable',
          explanation: [
            'Reúne alcance, registro de recepción/estado, filas de origen conservadas, hoja de reservas, controles de duplicados/faltantes, guía de envío/devolución e informe de costes/excepciones. Reabre archivos y registra comprobaciones reales. Aclara que es simulación en hoja, no operación de almacén, inspección de inventario ni integración con transportista.',
            'Limita el primer servicio a limpiar registros de inventario e informar estados de pedidos revisados, no a logística física fuera de tu competencia. Define inventario propiedad del cliente, límites de acceso, entrega, conservación/eliminación, revisor, una revisión y exclusiones. Instalaciones/manipulación reales, seguro y contratos requieren aprobación adecuada aparte.',
            'Mantén aprobación real del cliente BLOCKED y demanda UNVALIDATED sin evidencia. Separa tiempo/costes internos de tarifa propuesta. Continuar significa investigar o practicar con supervisión, nunca envío automático, liberación de inventario, reembolsos ni certificación operativa.'
          ],
          file: 'Entrega logística',
          code: 'Alcance | registro de recepción | inventario original/trabajo | reservas | excepciones\nGuía de envío/devolución | costes | informe | historial de versiones\nComprobaciones: utilizables 28/20; disponibles 23/13; reservados 5/7; L2 retenido\nR1 en cuarentena; 0 envíos reales; 2/25%; 80/60/20 hipotéticos\nAprobación real BLOCKED; operaciones físicas NOT PERFORMED\nDatos/acceso, conservación/eliminación, revisor, tarifa, exclusiones:\nPróxima evidencia y decisión:',
          check: 'El prototipo contiene registros comprobados sin afirmar preparación física, aprobación real ni beneficio completo.',
          aiPrompt: 'Revisa esta entrega logística ficticia para detectar evidencia ausente, custodia confusa, riesgos de datos/acceso y promesas operativas sin respaldo. Separa simulación y operación real. No inventes aprobación, inspección, seguro ni ingresos: [paquete].'
        }
      }
    }
  }
};
