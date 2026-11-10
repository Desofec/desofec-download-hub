# Kit de validation de micro-SaaS

Desofec AI Studio. Validation pédagogique, pas un service en production ni une promesse de revenus.
Aucune IA payante, coordonnée de paiement, souscription ni donnée de client réel n’est nécessaire.

## 1. Preuves du problème
Idée d’exercice : mettre en forme une courte mise à jour de projet à partir d’un nom et d’un statut.
Utilisateur/tâche/fréquence :
Solution actuelle :
Preuve réelle d’entretien anonymisée et date :
Hypothèses :
Pas d’entretien ? Marquez la demande UNVALIDATED (non validée). Un compliment n’est pas un engagement payant.

## 2. Spécification minimale
Projet : nom sans espaces en début et en fin, 1-40 caractères. Statut : Draft ou Review.
La sortie est exactement celle-ci, en anglais comme dans le prototype :

```text
Project: Atlas
Status: Review
```

Rejetez un nom vide ou trop long et un statut invalide.
Exclus : génération IA, stockage, appels réseau, connexion, facturation et intégrations.
Testez une version manuelle avant de coder.

## 3. Prototype local
Le tutoriel à /tutorials/micro-saas-validation contient le code complet de formatter.html.
Copiez-le dans un fichier HTML en texte brut, ouvrez-le localement et saisissez uniquement des noms fictifs.
Il utilise textContent, pas l’insertion HTML, et n’envoie ni ne stocke rien.
N’ajoutez pas d’API IA à un formateur déterministe.
Méthode du prototype : navigateur / manuelle uniquement. Un exercice manuel ne prouve pas la réussite des tests navigateur.

## 4. Cinq tests et hypothèses de coûts
Entrée | attendu | résultat réel | preuve | correction/nouveau test.
1. Atlas + Review : sortie exacte sur deux lignes.
2. Nom vide : erreur visible.
3. 40 caractères : acceptés.
4. 41 caractères forcés dans le champ via les outils développeur : erreur visible.
5. `<b>Atlas</b>` : texte littéral, sans élément en gras.

Facture d’hébergement/API du prototype local : aucune ; consignez votre temps réel.
Hébergement/API/support/surveillance/paiements/taxes/frais généraux futurs : TO CONFIRM (à confirmer).
Un prix d’abonnement n’est pas un bénéfice ; ne projetez pas de revenus à vie à partir de cet échantillon.

## 5. Observation avec consentement
Tâche tentée :
Confusion observée :
Alternative existante :
Réessaierait ? Réponse réelle :
Preuve d’un besoin récurrent :
Volonté de payer : UNVALIDATED sauf preuve directe.
Ne collectez aucun paiement ni dossier personnel dans cet exercice.
Utilisez le générateur de propositions pour cadrer la découverte ou le prototype, pas un abonnement prêt à vendre.

## 6. Décision
Preuves du problème / lacunes des tests / utilité observée / incertitudes / coûts inconnus.
Décision : poursuivre la découverte / réviser / arrêter.
Prochaine preuve, responsable et date de revue :

Avant tout lancement réel, planifiez séparément le contrôle d’accès, la confidentialité/conservation/suppression,
la facturation et les remboursements, la surveillance, le support, la revue de sécurité et la reprise après incident.
Un jouet local n’est pas prêt pour la production.

Prompt : « Examine uniquement ces observations et résultats de tests. Sépare les preuves des hypothèses.
N’invente ni traction, ni utilisateurs payants, ni conformité : [registre anonymisé]. »
