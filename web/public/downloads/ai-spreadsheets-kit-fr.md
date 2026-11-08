# Kit Excel : nettoyer des données et vérifier une conversion PDF vers Excel

Par Desofec AI Studio. Utilisez Excel ou Google Sheets ; les fonctions IA payantes sont facultatives.

Les six identifiants de leçon et l’exercice original de cinq commandes ci-dessous restent inchangés.
Après les bases, réalisez les trois exercices de service dans l’ordre. Utilisez uniquement des données fictives.
Le laboratoire est à `/business-launchpad/spreadsheet-lab` ; choisissez `ai-spreadsheets` dans l’espace de travail privé.
Aucun téléversement, OCR automatique, modèle IA, conseil financier en direct ni enregistrement automatique au compte.
Les téléchargements CSV sont des données compatibles avec Excel, pas des fichiers XLSX avec feuilles ou formules.

## Importer dans A1

Importez les données séparées par des virgules dans quatre colonnes. Conservez Raw et travaillez sur une copie.

```csv
Order,Item,Quantity,UnitPrice
A1,Notebook,2,5
A2,Pen,3,2
A3,Notebook,1,5
A4,Pen,0,2
A5,Folder,,4
```

Les en-têtes et données CSV restent en anglais pour correspondre au laboratoire ; conservez-les tels quels.

## Calculer

Placez `Total` en E1. Dans E2, recopiez la formule jusqu’à E6 :

```text
=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")
```

Résultat attendu : 10, 6, 5, 0, REVIEW.
Les noms de fonctions et virgules sont ceux de la version anglaise ; adaptez noms de fonctions et séparateurs à vos paramètres régionaux sans changer les résultats.

## Rapprocher

- `=SUM(E2:E6)` doit donner 21 : un sous-total connu, pas un total complet.
- `=COUNTIF(E2:E6,"REVIEW")` doit donner 1.
- Valeur connue de Notebook : 15. Pen : 6. Folder : non résolu, pas zéro.
- Représentez graphiquement les valeurs connues avec une base zéro, des unités monétaires d’exercice et la note « A5 Folder unresolved ».

## Transmission

Enregistrez Raw, Working, Summary et Notes. Consignez source, paramètres régionaux des formules, contrôles et ligne non résolue. Rouvrez le fichier et vérifiez les résultats.
Utilisez uniquement des données fictives ou autorisées. Vérifiez vous-même les suggestions de l’IA.

## Projet de service 1 : nettoyage de données Excel

Conservez ce tableau Raw de sept lignes ; dupliquez-le en Working avant toute modification.

```csv
Order,Item,DateUTC,Quantity,UnitPriceEUR
 A1 , Notebook ,2030/01/07,2,5
A2,Pen,2030-01-08,3,2
A3,Notebook,2030-01-09,1,5
A4,Pen,2030-01-13,0,2
A5,Folder,2030-01-13,,4
A1,Notebook,2030-01-07,2,5
A6,Folder,01/02/2030,1,4
```

Supprimez les espaces et convertissez la date non ambiguë `YYYY/MM/DD` en `YYYY-MM-DD`. Comparez tous les
champs avant de supprimer un identifiant répété à l’identique. Attendu : sept lignes brutes, six lignes de travail
uniques, un doublon supprimé. Un doublon contradictoire doit bloquer le nettoyage jusqu’à clarification de la source,
pas être écarté silencieusement.

Conservez deux exceptions : quantité A5 manquante et date A6 ambiguë. Ne déduisez pas l’ordre jour/mois à partir
des paramètres régionaux de votre ordinateur, ne remplissez pas la valeur manquante et ne traitez pas l’inconnu comme zéro.
A4 égal à zéro est valide. Pour chaque changement, consignez ancienne valeur, nouvelle valeur, raison et exception restante.
Rouvrez le CSV exporté dans Excel/Sheets et vérifiez six lignes, types numériques et cellules vides.
Le CSV ne contient ni formules ni plusieurs feuilles ; enregistrez séparément votre vrai classeur.

## Projet de service 2 : contrôles de conversion PDF vers Excel

Téléchargez `/business-launchpad/spreadsheet-lab/source.pdf`. C’est un vrai PDF d’une page, textuel,
des cinq commandes originales, avec dates et montants en EUR.
Le laboratoire fournit une transcription erronée : la quantité A2 vaut 8 au lieu de 3 et la cellule vide A5
est remplacée à tort par zéro. Comparez toutes les lignes et cellules, pas seulement le sous-total.
Corrigez A2 à 3 et effacez A5 ; le nombre de lignes source reste cinq et le zéro A4 est conservé.

Conservez le PDF source, les références de page, l’extraction non vérifiée, la transcription corrigée et le registre
des corrections. Décrivez honnêtement la méthode : démonstration fournie, saisie manuelle ou outil externe autorisé.
Cette application ne téléverse pas de PDF, ne lance pas d’OCR et ne promet pas une conversion parfaite.
Les pages numérisées, cellules fusionnées, lignes séparées et caractères ambigus exigent une vérification humaine distincte.
Les cellules réellement inconnues restent non résolues jusqu’à ce que le propriétaire de la source fournisse des preuves.

## Projet de service 3 : rapports d’activité Excel

Utilisez les cinq lignes sources originales, pas les six lignes nettoyées. La période UTC inclusive est
du 2030-01-07 au 2030-01-13. Appliquez le filtre de dates avant le calcul de la somme.
Rapprochez 10 + 6 + 5 + 0 = EUR 21 ; une quantité non résolue signifie que le total est incomplet.
Sous-total Notebook connu : EUR 15, Pen : EUR 6, Folder : inconnu. Ne représentez pas Folder comme zéro.

Créez les feuilles Raw, Working, Summary et Notes. Consignez la révision source, la période, la devise,
la langue/le séparateur des formules, les modifications et une ligne non résolue. Faites un graphique à base zéro
des valeurs connues, avec un tableau textuel accessible et une note visible sur la valeur manquante.
Si vous rapportez les six lignes nettoyées, la date ambiguë A6 constitue une deuxième exception non résolue :
ne l’excluez pas silencieusement et ne laissez pas croire que le rapport est complet. Rouvrez le classeur et vérifiez
à nouveau les formules. Cet exemple ne prouve ni tendance commerciale, ni revenus réels, ni exactitude fiscale, ni économies vérifiées.

## Proposition privée, revue et transmission

Créez un projet tableur dans `/business-launchpad/projects?path=ai-spreadsheets`.
Gardez les trois exercices dans son brief et son classeur. Définissez un périmètre limité : nettoyage des données,
vérification de la source, rapport et un cycle de correction. Précisez formats d’entrée, limites de lignes/pages,
exclusions, délais, autorisations de source, conservation/suppression, réviseur humain, coûts fournisseur et inconnues.
Aucune promesse d’OCR parfait, de revenus ou de certification financière.

Rechargez les résultats du projet et chargez explicitement SHEET-1 à SHEET-7. Ils commencent en attente ;
consignez vous-même les observations réelles. Enregistrez corrections et nouveaux tests ; toute validation réelle
indisponible du propriétaire est **bloquée**, pas réussie. La revue du Centre de revue porte sur le texte copié,
pas sur les fichiers externes. Une source fictive correspondante n’est pas une approbation client.

Transmission privée : Raw et Working, PDF original, CSV corrigé, vrai classeur, Summary, Notes,
registre d’exceptions/corrections, révision source, contrôles réels après réouverture et prochaine revue.
Utilisez des données fictives/anonymisées. Les copies de compte ne contiennent des preuves de projet saisies
qu’après consentement ; les PDF, CSV et XLSX ne sont pas téléversés automatiquement. Supprimez séparément les téléchargements.

## Références officielles des outils

- https://support.microsoft.com/en-gb/excel/copilot/get-started-with-copilot-in-excel
- https://workspace.google.com/products/sheets/
- https://workspace.google.com/resources/spreadsheet-ai/

Fonctions principales vérifiées à partir de la documentation officielle indexée le 2026-11-05.
La disponibilité de l’IA dépend de l’abonnement et des paramètres. Aucune fonction IA payante n’est nécessaire pour ces exercices.
