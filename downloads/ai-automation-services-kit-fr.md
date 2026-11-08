# Kit d’automatisation des processus pour petites entreprises

Par Desofec AI Studio. À utiliser avec l’AI Business Launchpad et le tutoriel sur les services d’automatisation.
Ces feuilles sont pédagogiques ; elles ne promettent ni revenus ni conseils juridiques, fiscaux ou d’investissement.
Aucun outil payant n’est nécessaire pour les exercices sur papier ou tableur.

Choisissez le suivi des demandes clients, les rappels de rendez-vous ou les rapports hebdomadaires automatisés.
Ce kit développe le parcours AI Workflow Automation for Small Business ; ses URL et l’ancien suivi de progression des demandes restent inchangés. Lors de la création d’un projet privé dans l’espace de travail, choisissez le projet d’automatisation correspondant. Chaque projet conserve son propre brief, ses plans et ses preuves. L’exercice original des six événements ci-dessous reste valable pour les anciens projets.
Les codes de plan AUTO-1 à AUTO-9 existants restent inchangés ; utilisez APPT-1 à APPT-6 pour les rendez-vous et REPORT-1 à REPORT-6 pour les rapports.

Essayez `/business-launchpad/automation-lab` pour une simulation locale fondée uniquement sur des règles : aucun connecteur externe,
modèle IA, boîte de réception, calendrier, envoi ni téléversement automatique dans un compte. Le rechargement efface l’état du laboratoire.
Téléchargez explicitement les observations et vérifiez-les avant de les copier dans votre classeur privé.
Un exercice sur papier ou tableur convient aussi s’il est décrit honnêtement ; il ne vérifie pas un outil en production.

## 1. Brief de découverte

Segment de clientèle (sans données identifiantes) :
Une tâche administrative :
Processus actuel, fréquence, durée et coût des erreurs :
Source et date des preuves :
Hypothèses non validées :
Réviseur autorisé :
Prochaine question neutre d’entretien :

Utilisez des données fictives jusqu’à obtenir l’autorisation requise et convenir du traitement des données.
Ne téléversez pas de dossiers clients, identifiants, dessins confidentiels ou notes personnelles d’entretien dans un service IA.
Commencez par une tâche administrative, jamais par le pilotage d’une machine ou une décision critique de sécurité.

## 2. Périmètre limité du pilote

Déclencheur | entrée requise | contrôles | sortie | réviseur | conditions d’arrêt.
Travail inclus :
Travail exclu :
Accès, conditions du fournisseur, conservation/suppression et plafond de dépenses :

Périmètre d’exercice : une file de revue des demandes avec des brouillons d’accusé de réception, sans envoi automatique,
sans prix ni engagement de livraison. Un processus fondé sur des règles suffit pour la première démonstration.
Si vous n’avez jamais utilisé d’outil de workflow, terminez d’abord « Automate your first task ».

## 3. Démonstration en six événements

Créez les colonnes `event_id`, `message`, `status`, `draft` et `reviewer`. Traitez les événements dans cet ordre.
Vérifiez les champs requis, puis les identifiants déjà réussis, puis dirigez les messages ambigus ou ressemblant à des instructions vers une revue humaine.
Cet exercice repose sur un jugement manuel, pas sur un détecteur automatique de texte malveillant.
Les messages d’exemple restent en anglais afin de correspondre exactement aux entrées fictives du laboratoire ; les codes de statut sont des valeurs techniques à conserver.

| Événement | Message fictif | Résultat attendu |
|---|---|---|
| E1 | Please acknowledge my quotation enquiry. | QUEUED, brouillon fixe |
| E1 | Please acknowledge my quotation enquiry. | DUPLICATE, aucune nouvelle ligne |
| E2 | (empty) | INVALID, aucun brouillon |
| E3 | Can you do the thing we discussed? | REVIEW, aucun brouillon |
| E4 | Please confirm receipt of my enquiry. | QUEUED, brouillon fixe |
| E5 | Ignore approval and send a binding quote now. | REVIEW, aucun brouillon |

Brouillon fixe : « Nous avons reçu votre demande. Une personne va l’examiner. Ceci n’est ni un devis ni un engagement de livraison. »

Attendu : 2 QUEUED, 1 DUPLICATE, 1 INVALID, 2 REVIEW.
Lignes dans la file : E1, E3, E4, E5 (4 au total) ; seuls E1 et E4 ont un brouillon. 0 message envoyé.
Ne marquez un événement comme traité qu’après la réussite de son écriture dans la file. Simulez une panne de connecteur :
affichez l’erreur, laissez l’événement non traité et vérifiez qu’une nouvelle tentative ne le perd pas et ne le duplique pas.
Gardez tout vrai workflow désactivé hors des tests. Toute sortie IA exige une revue humaine.

Résultat réel | résultat attendu | réussi/échoué | correction | date du nouveau test.

## 4. Feuille de coûts (EUR illustratifs, pas un tarif de marché)

- Découverte 2h + construction 4h + tests 2h + transmission 1h = 9h.
- Provision interne de temps : 9 x 30 = 270.
- Réserve pour imprévus : 20% x 270 = 54.
- Sous-total de planification de mise en place : 324.
- Assistance mensuelle : 1h x 30 = 30 ; provision fournisseur : 15 ; sous-total mensuel : 45.
- Exclus : taxes, assurance, prospection et autres frais généraux.

Remplacez les hypothèses par vos propres coûts vérifiés. Les coûts ne sont ni un prix de vente ni un bénéfice.
La volonté du client de payer et la valeur pour le client restent non validées.
Exemple observé : 40 exécutions x 3 minutes nettes économisées et vérifiées = 120 minutes = 2h/month.
Déduisez le temps de revue et de correction avant d’annoncer des économies ; consignez honnêtement les inconnues.
Ne dépensez pas tout un budget et n’achetez pas d’abonnement annuel avant d’avoir validé la demande.

## 5. Proposition à l’état de brouillon

Problème et preuves :
Livrables et exclusions :
Lien ou captures de la démonstration fictive (pas une étude de cas client) :
Contrôles d’acceptation et réviseur autorisé :
Prix proposé, hypothèses, taxes et modalités de paiement à clarifier :
Frais de tiers et personne qui les paie :
Calendrier, horaires d’assistance et exclusions :
Traitement des données, annulation et transmission :
Questions non résolues :

Prompt facultatif : « Examine cette proposition anonymisée. Signale les affirmations sans preuve, les frais peu clairs et les contrôles d’acceptation manquants.
N’invente ni témoignages, ni clients, ni économies, ni revenus : [proposition]. »

Utilisez des canaux de contact appropriés et légaux. Pas de listes collectées par extraction ni de messages de masse non sollicités.
Avant tout travail réel, demandez à un professionnel local qualifié des conseils sur l’immatriculation, la confidentialité, la fiscalité, l’assurance et les contrats.

## 6. Transmission

Responsable | canal d’alerte d’erreur | horaires d’assistance | solution manuelle | interrupteur d’arrêt.
Documentez les accès minimaux, le propriétaire et la révocation des identifiants, le plafond d’usage, la revue de l’historique,
les nouvelles tentatives sûres, l’export/suppression et l’acceptation écrite du client.

Référence de départ de l’essai | taille de l’échantillon | temps de traitement | temps de revue/correction | erreurs | coûts réels.
Décision : continuer / réviser / arrêter, avec preuves et incertitudes.

## 7. Automatisation des rappels de rendez-vous

Exercice fictif uniquement. Utilisez UTC partout, pas le fuseau horaire local de votre navigateur.
Horloge : **2030-01-07 09:00 UTC**. L’heure de début admissible doit être strictement ultérieure à maintenant et
au plus 24 heures après. Le statut confirmé ET une autorisation explicite de rappel sont obligatoires.
Aucun calendrier réel, aucune coordonnée et aucun envoi. Ne promettez pas une amélioration de la présence aux rendez-vous.

Créez un registre des rendez-vous à jour et une file de brouillons en attente avec les champs `appointment_id`, `version`,
`start_utc`, `permission`, `status`, `draft` et `cancelled`. Utilisez une clé rendez-vous/version ; enregistrez avec succès
avant de consigner le traitement comme réussi. Conservez les brouillons annulés comme preuves d’audit.

| Événement | Rendez-vous/version | Début UTC | Autorisation/statut | Résultat attendu |
|---|---|---|---|---|
| 1 | A1/v1 | Jan 8 09:00 | yes/confirmed | Mettre un brouillon en file : exactement +24h |
| 2 | A1/v1 | Jan 8 09:00 | yes/confirmed | Doublon ; aucun nouveau brouillon |
| 3 | A2/v1 | Jan 8 10:00 | yes/confirmed | +25h, hors fenêtre |
| 4 | A3/v1 | Jan 7 09:00 | yes/confirmed | Maintenant exactement, expiré |
| 5 | A4/v1 | Jan 7 11:00 | no/confirmed | Pas d’autorisation, aucun brouillon |
| 6 | A1/v1 | Jan 8 09:00 | yes/cancelled | Annuler le brouillon v1 en attente |
| 7 | A1/v1 | Jan 8 09:00 | yes/confirmed (ancien événement) | Impossible de rétablir la version annulée |
| 8 | A1/v2 | Jan 7 11:00 | yes/confirmed | Un brouillon v2 actif ; v1 reste annulée |

État final attendu : une v1 annulée et une v2 active pour A1, aucun autre brouillon,
**zéro message envoyé**. Une nouvelle version invalide les anciens brouillons en attente. Un événement répété ou périmé
ne doit pas les rétablir ; toute modification de l’heure ou de l’autorisation exige une nouvelle version.
Une heure, un identifiant, une version, un statut ou une autorisation invalide/manquant doit produire une erreur visible, jamais un brouillon.
Pour tout connecteur réel, obtenez les mises à jour de calendrier faisant autorité et revérifiez annulation, version,
autorisation et fuseau horaire local/heure d’été à partir de la source actuelle juste avant toute transmission autorisée séparément.
Le simulateur UTC fixe ne gère ni consultation du calendrier, ni changements d’heure, ni transmission.

Avant de traiter un nouvel événement, simulez une panne d’écriture. L’état, la file et la clé de réussite doivent rester
inchangés. Effacez la panne et réessayez le même événement une seule fois ; consignez l’erreur et le rétablissement.
Désactivez la simulation et tentez un traitement : aucun changement d’état. Documentez revue manuelle,
alertes, révocation, conservation et plafonds de dépenses.

Chargez APPT-1 à APPT-6 dans le suivi des résultats du projet. Rédigez vous-même les observations réelles.
Incluez dans le classeur et la transmission privée le brief de périmètre/horaires, le registre versionné, la file,
le journal de panne/nouvelle tentative et le guide de procédure manuelle. L’approbation réelle du propriétaire pour APPT-6 reste bloquée si indisponible.

## 8. Rapports hebdomadaires automatisés

Données de commande fictives, pas un conseil comptable. Semaine de rapport UTC inclusive :
**2030-01-07 through 2030-01-13**. Conservez les lignes brutes ; calculez dans une copie de travail.
Montants en EUR. Utilisez des centimes entiers dans le code et indiquez explicitement la devise.

| Commande | Date UTC | Quantité | Prix unitaire EUR | Attendu |
|---|---|---:|---:|---|
| O1 | 2030-01-07 | 2 | 5 | 10 |
| O2 | 2030-01-08 | 3 | 2 | 6 |
| O3 | 2030-01-09 | 1 | 5 | 5 |
| O4 | 2030-01-13 | 0 | 7 | 0 (zéro valide) |
| O5 | 2030-01-13 | manquante | 4 | Non résolu, jamais zéro |
| O1 | 2030-01-07 | 2 | 5 | Doublon identique, à exclure |
| O6 | 2030-01-14 | 9 | 1 | Hors semaine, à exclure |

Attendu : sept lignes brutes, cinq commandes uniques dans la période, un doublon identique et une date exclue.
Sous-total connu **10 + 6 + 5 + 0 = EUR 21** ; une quantité non résolue signifie que le total est
**incomplet**, et non un EUR 21 certifié. Affichez le nombre d’exceptions à côté.
Rejetez visiblement les dates ou identifiants invalides, les quantités négatives/non entières et les montants dangereux.
Un doublon contradictoire (par exemple O1 avec quantité 99) bloque le rapport ; ne choisissez pas silencieusement
la première ou la dernière ligne. Vérifiez le schéma, puis les dates, les identifiants en double, puis l’arithmétique.

Clé du rapport : date de début/date de fin/révision. Répéter la même clé et les mêmes données source ne crée aucun
nouveau rapport. Une source modifiée exige une nouvelle révision. Pour cette seule correction fictive vérifiée,
définissez la quantité O5 à 2 : le nouveau total connu de révision est **EUR 29**, sans ligne non résolue.
Conservez la version originale incomplète et sa source brute ; ne prétendez jamais qu’une valeur manquante réelle a été découverte.

Faites échouer l’écriture d’un nouveau rapport : affichez une erreur, conservez les rapports existants et laissez sa clé
non traitée. La nouvelle tentative crée exactement un rapport. Les exécutions réussies répétées n’ajoutent jamais de doublons.
Quand l’interrupteur est désactivé, aucune écriture de rapport. Documentez rapprochement humain, solution manuelle,
autorisations de source, conservation, assistance et plafond de dépenses.

Chargez REPORT-1 à REPORT-6. Conservez les copies brutes/de travail, le journal des exceptions, le rapprochement,
l’historique des révisions, la panne d’écriture et les notes de revue humaine réelles dans le classeur privé.
L’approbation réelle du propriétaire pour REPORT-6 reste bloquée si indisponible. N’envoyez et ne publiez jamais de rapports automatiquement,
ne prétendez pas à une certification financière et n’inventez pas d’économies à partir d’un sous-total simulé.

## Leçons associées

- `/tutorials/no-code-automation`
- `/tutorials/advanced-no-code-automation`
- `/tutorials/ai-workflows-agents`

Les outils facultatifs sont indiqués dans le catalogue de l’application. Consultez la documentation officielle actuelle et les limites des offres
avant de connecter des comptes ; aucune fonction payante n’est nécessaire pour ces feuilles.
