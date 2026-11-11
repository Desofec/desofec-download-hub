# Kit IA : confidentialité et vérification des faits

Par Desofec AI Studio. Gardez les données privées hors des requêtes IA et vérifiez chaque affirmation de l’IA à l’aide de vraies sources. Ce kit est un exercice d’apprentissage, pas un avis juridique, et aucune vérification n’est une garantie.

## 1. Avant la requête : contrôle de confidentialité
Classez chaque détail de votre texte comme **PRIVÉ** ou **UTILISABLE** avant de coller quoi que ce soit dans un outil d’IA.
- Noms de personnes réelles, adresses e-mail, numéros de téléphone et adresses postales : PRIVÉ.
- Informations de santé, financières, de compte, mots de passe, numéros d’identité et questions juridiques : PRIVÉ.
- Dossiers de clients, d’élèves, de patients ou de salariés et informations commerciales confidentielles : PRIVÉ.
- Uniquement les faits dont la tâche a réellement besoin : UTILISABLE.
- Vérifiez vous-même les paramètres de confidentialité et les conditions actuels de l’outil d’IA, comme l’historique des conversations ou l’entraînement des modèles. Ne supposez pas qu’ils sont sûrs.

## 2. Repères de masquage
Remplacez les données privées par des repères neutres et gardez l’original privé.
- Personne : [PERSONNE A], [PERSONNE B]
- Coordonnées : [E-MAIL], [TÉLÉPHONE], [ADRESSE]
- Organisation ou compte : [ORGANISATION], [COMPTE]
- Santé ou autres informations sensibles : supprimez-les entièrement si la tâche n’en a pas besoin ; n’y faites pas allusion.
- Avant d’envoyer une requête, relisez-la et comptez les éléments privés restants. L’objectif est 0.

Exemple d’entraînement (fictif) : « Alex Example (alex@example.test, +00 0000 0000) indique que la réunion des bénévoles a lieu le 2030-03-14 à 18:00 en salle B. En retard à cause d’un rendez-vous médical. » devient « [PERSONNE A] ([E-MAIL], [TÉLÉPHONE]) indique que la réunion des bénévoles a lieu le 2030-03-14 à 18:00 en salle B. »

## 3. Fiche de vérification des affirmations
Découpez une réponse d’IA en une affirmation par ligne, puis comparez chacune uniquement avec vos sources.

| ID | Affirmation | Preuve tirée de votre source | Verdict |
|----|-------------|------------------------------|---------|
| C1 | | | CONFIRMÉE / CONTREDITE / SOURCE REQUISE |
| C2 | | | |
| C3 | | | |
| S1 | Source citée | Présente dans vos sources ? | TROUVÉE / CITATION INTROUVABLE |

Exercice fictif Riverside Library : la fiche source indique lundi-vendredi 09:00-18:00, samedi 10:00-14:00, fermée le dimanche, inscription gratuite pour les habitants et 12 ordinateurs portables prêtés pour 2 heures. Le résumé de l’IA affirmait une ouverture 7 jours sur 7 et 50 ordinateurs portables (CONTREDITE), le samedi 10:00-14:00 et l’inscription gratuite (CONFIRMÉE), une fondation en 1952 (SOURCE REQUISE) et citait « City Library Report 2029 » (CITATION INTROUVABLE). Résultat : 2 CONFIRMÉES, 2 CONTREDITES, 1 SOURCE REQUISE.

## 4. Modèles de requêtes sûres
- **Catégories uniquement** : « Quels types de détails d’un message sont généralement personnels ou sensibles ? Donne uniquement des catégories. »
- **Tâche masquée** : « À partir de ce seul texte masqué, rédige [TÂCHE]. Garde les repères et ne devine pas qui ils désignent : [TEXTE MASQUÉ] »
- **Découper les affirmations** : « Découpe ce texte en affirmations factuelles distinctes, une par ligne. N’ajoute, ne juge et ne corrige rien : [TEXTE] »
- **Vérification limitée à la source** : « Compare chaque affirmation uniquement avec cette source. Cite la preuve ou indique "absent de la source". N’invente aucune citation : [AFFIRMATIONS] [SOURCE] »
- **Formulation uniquement** : « Améliore la formulation sans ajouter, retirer ni modifier aucun fait, nombre ou source : [TEXTE CORRIGÉ] »

## 5. Relecture honnête et limites
- Corrigez les affirmations contredites avec la formulation de la source, et retirez les affirmations non vérifiées ou marquez-les NON VÉRIFIÉE.
- N’inventez, ne devinez et ne « complétez » jamais une source ou une citation. Retirez les citations introuvables.
- Revérifiez toute réécriture de l’IA à l’aide de vos sources avant de l’utiliser.
- Gardez l’exercice fictif Riverside Library privé : l’approbation reste BLOQUÉE, car il n’existe aucun rédacteur réel, et les retours comme les résultats restent NON RECUEILLIS.
- Pour un vrai travail, suivez les règles de votre organisation, obtenez une approbation réelle et consultez une personne qualifiée pour les questions juridiques ou de sécurité.
