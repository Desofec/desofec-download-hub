import type { TutorialTranslation } from '@/lib/tutorial-translations';

export const practicalFrench: Record<string, TutorialTranslation> = {
  'ai-small-business': {
    title: 'Créer un dossier de contenu professionnel avec l’IA',
    intro: 'Partez de témoignages clients réels, puis rédigez et vérifiez une description produit, une FAQ et une petite campagne. Aucun outil payant n’est nécessaire.',
    steps: {
      'offer-brief': {
        title: 'Choisir une offre et un public',
        explanation: ['Choisissez un produit ou service réel, ou un exemple fictif pour vous entraîner. Notez ses caractéristiques, son prix actuel, les conditions de livraison et les promesses que vous pouvez réellement tenir.', 'L’IA aide à rédiger, mais ne prouve pas la demande. Séparez faits et hypothèses. Ne partagez pas d’informations confidentielles ni d’identifiants clients.'],
        code: 'Offre :\nPublic :\nProblème résolu :\nCaractéristiques, prix et livraison vérifiés :\nSources et dates :\nHypothèses à vérifier :\nAffirmations interdites :',
        check: 'Votre fiche distingue les faits des hypothèses et désigne un public.',
        aiPrompt: 'À partir de cette fiche uniquement, relève les points flous et propose trois questions à poser à de vrais clients. N’invente ni statistiques ni opinions : [fiche].'
      },
      'customer-evidence': {
        title: 'Écouter les clients avant de rédiger',
        explanation: ['Posez des questions neutres sur la tâche difficile, les solutions déjà essayées et les améliorations utiles. Utilisez Tally ou une conversation. Expliquez l’usage des réponses, demandez la permission et ne recueillez que le nécessaire.', 'Retirez noms, coordonnées et récits identifiants avant de consulter l’IA. Sans réponses réelles, préparez seulement l’enquête : ne faites pas inventer des résultats.'],
        code: '1. Quelle tâche essayez-vous d’accomplir ?\n2. Qu’est-ce qui la rend difficile ?\n3. Qu’avez-vous déjà essayé ?\n4. Quelle amélioration serait utile ?\n\nSynthèse : thème | preuve anonymisée | nombre de réponses | incertitude',
        check: 'Vous avez une enquête neutre et des réponses anonymisées, ou une liste de recherches restant à faire.',
        aiPrompt: 'Regroupe ces réponses anonymisées par thème. Cite uniquement le texte présent, indique le nombre de réponses et les limites de cet échantillon : [réponses].'
      },
      'product-copy': {
        title: 'Rédiger une description produit sincère',
        explanation: ['Utilisez la fiche et les témoignages pour expliquer le public, le contenu de l’offre et ses limites. ChatGPT ou Claude peut proposer un brouillon ; vous restez responsable de chaque affirmation.', 'Comparez chaque phrase à la fiche. Supprimez les faux témoignages, garanties, réductions et avantages non prouvés. Signalez les informations manquantes au lieu de deviner.'],
        code: 'Rédige 100 mots à partir de cette fiche vérifiée : [fiche].\nInclus public, caractéristiques, limites et prochaine étape.\nN’invente ni avantages, témoignages, prix ni garanties.\nIndique les faits manquants sous À VÉRIFIER.',
        check: 'Chaque affirmation factuelle du brouillon possède une source dans la fiche.',
        aiPrompt: 'Compare cette description à la fiche. Présente affirmation, preuve et correction nécessaire. Signale les éléments non justifiés : [description et fiche].'
      },
      'checked-faq': {
        title: 'Créer une FAQ avec un relais humain',
        explanation: ['Préparez cinq questions sur le contenu, la livraison, le support et les limites. Fournissez vos vraies politiques : l’IA ne décide pas de vos obligations juridiques ou droits au remboursement.', 'Pour une réponse inconnue, indiquez un contact que vous contrôlez. Cet exercice produit une FAQ relue, pas un robot de service client autonome.'],
        code: 'Question | réponse | politique/source | date de vérification\n\nRéponse inconnue : contacter [votre support vérifié].\nNe pas inventer de politiques de remboursement, garantie ou livraison.',
        check: 'Cinq réponses correspondent aux politiques réelles et les questions inconnues sont dirigées vers une personne.',
        aiPrompt: 'Rédige cinq questions-réponses avec ces politiques et cette fiche uniquement. Marque les réponses inconnues À VÉRIFIER. Ne donne pas de conseil juridique : [documents].'
      },
      'small-campaign': {
        title: 'Planifier une petite campagne avec consentement',
        explanation: ['Choisissez un canal, un message et une action attendue. Préparez trois publications pour une semaine, avec Canva si utile. Respectez les règles du canal et n’envoyez du marketing qu’aux destinataires ayant accepté.', 'HubSpot Breeze est facultatif pour les équipes utilisant déjà HubSpot. Vérifiez le forfait, l’accès aux données et les autorisations avant de connecter des dossiers clients.'],
        code: 'Objectif :\nCanal :\nMessage :\nAction du lecteur :\n\nJour | brouillon | preuves | droits des contenus | responsable de validation\n\nNe pas publier ou envoyer automatiquement.',
        check: 'Trois brouillons relus utilisent des contenus autorisés et ont un responsable de validation.',
        aiPrompt: 'Crée trois publications courtes à partir de cette description approuvée. Garde les mêmes faits et ajoute une action. Ne promets pas de ventes et ne crée pas de fausse urgence : [description].'
      },
      'measure-business': {
        title: 'Examiner les résultats et choisir une amélioration',
        explanation: ['Publiez après votre propre vérification. Notez canal, date, visites ou réponses et temps passé. Choisissez la mesure avant publication pour ne pas sélectionner uniquement les bons résultats.', 'Une petite campagne ne prouve pas la cause d’une vente. Notez les autres facteurs, les avis négatifs et l’incertitude. Le dossier final comprend fiche, recherche, description, FAQ et plan de campagne.'],
        code: 'Date | canal | mesure choisie | résultat | temps passé\nQuestions ou corrections clients :\nIncertitudes :\nUne amélioration pour la semaine suivante :',
        check: 'Vos cinq documents sont prêts et une date de bilan est fixée, même si la campagne n’est pas encore publiée.',
        aiPrompt: 'Analyse ce journal. Distingue observations et hypothèses et propose une amélioration peu risquée sans conclure à une causalité : [journal].'
      }
    }
  },
  'ai-video-creation': {
    title: 'Créer une première vidéo responsable avec l’aide de l’IA',
    intro: 'Créez une vidéo de 30 secondes à partir d’un brief et d’un storyboard, avec vos contenus ou des contenus autorisés. La génération IA facultative peut nécessiter des crédits.',
    steps: {
      'video-brief': {
        title: 'Rédiger un brief de 30 secondes',
        explanation: ['Choisissez un public et un message, par exemple la démonstration d’un vrai produit. Définissez le canal et le format avant le montage.', 'Vos propres vidéos de téléphone et CapCut ou Descript suffisent. Runway reste facultatif : vérifiez crédits, licences et conditions du compte avant de payer.'],
        code: 'Public :\nMessage unique :\nDurée : 30 secondes\nCanal et format :\nAction attendue :\nFaits à vérifier :\nContenus déjà possédés :\nBudget maximal :',
        check: 'Le brief définit un message, un format et une limite de budget.',
        aiPrompt: 'Propose trois concepts simples de 30 secondes que je peux filmer moi-même à partir de ce brief, sans affirmation non prouvée : [brief].'
      },
      storyboard: {
        title: 'Transformer le message en storyboard',
        explanation: ['Prévoyez trois scènes de dix secondes : problème, démonstration, prochaine étape. Décrivez images, paroles et sons. Lisez le texte à voix haute et raccourcissez-le si nécessaire.', 'Sur téléphone, gardez des textes courts et grands. La compréhension ne doit pas dépendre uniquement de la couleur ou du son.'],
        code: '0-10 secondes : problème | image | paroles | texte à l’écran\n10-20 secondes : démonstration | image | paroles | texte\n20-30 secondes : prochaine étape | image | paroles | texte',
        check: 'Les scènes totalisent 30 secondes et le texte tient dans ce temps à voix haute.',
        aiPrompt: 'Transforme ce brief en trois scènes de dix secondes avec images, narration et texte court. Utilise uniquement les faits fournis : [brief].'
      },
      'permissioned-assets': {
        title: 'Réunir les contenus et leurs autorisations',
        explanation: ['Filmez vous-même ou utilisez une licence adaptée à votre usage. Conservez source et licence. Obtenez une permission claire pour le visage ou la voix d’une autre personne, même pour une imitation IA.', 'Dans Runway, commencez par un court essai avec une référence possédée ou autorisée. Vérifiez déformations, démonstrations trompeuses et droits : la génération ne dispense pas de contrôle.'],
        code: 'Contenu | source | propriétaire | licence/permission | usage autorisé | attribution\n\nPas d’imitation trompeuse de célébrité, musique sans licence ou vidéo privée.\nIdentifier les clips générés par IA.',
        check: 'Chaque contenu a sa source et son autorisation ; tout essai généré a été vérifié.',
        aiPrompt: 'Propose un prompt visuel pour cette scène avec mes contenus autorisés uniquement. N’imite pas de personne réelle et ne présente pas une génération comme preuve documentaire : [scène et contenus].'
      },
      'edit-video': {
        title: 'Assembler la vidéo et vérifier le rythme',
        explanation: ['Importez les clips dans l’éditeur, suivez le storyboard et ajustez la durée à environ 30 secondes. Ajoutez uniquement le texte approuvé et des sons autorisés.', 'Les menus changent : consultez l’aide officielle actuelle. Vérifiez coupures involontaires, textes illisibles et musique trop forte. Évitez les effets clignotants.'],
        code: 'Trois scènes dans l’ordre :\nDurée proche de 30 secondes :\nTexte lisible sur téléphone :\nParoles audibles :\nPas de montage trompeur ni de clignotement :\nCrédits obligatoires présents :',
        check: 'Le brouillon est lisible, dans le bon ordre et les paroles sont claires.',
        aiPrompt: 'Examine ce storyboard et cette transcription. Propose des transitions plus claires et des phrases plus courtes sans ajouter de faits : [documents].'
      },
      'captions-review': {
        title: 'Corriger les sous-titres et regarder sans son',
        explanation: ['Si l’éditeur génère des sous-titres, corrigez manuellement noms, ponctuation et synchronisation. Les sous-titres automatiques ne sont qu’un point de départ.', 'Regardez sans son sur téléphone. Vérifiez contraste, taille et placement, décrivez les sons importants et proposez une transcription si le canal le permet.'],
        code: 'Mots exacts :\nNoms et ponctuation :\nSynchronisation :\nTaille et contraste :\nSons importants décrits :\nDémonstration non masquée :\nTranscription préparée :',
        check: 'Le message reste compréhensible sans son et les sous-titres correspondent aux paroles.',
        aiPrompt: 'Relis cette transcription sans changer les faits. Signale les noms incertains pour vérification au lieu de deviner : [texte].'
      },
      'publish-video': {
        title: 'Vérifier, signaler l’IA et publier avec responsabilité',
        explanation: ['Exportez selon les exigences actuelles du canal et regardez le fichier exporté, pas seulement l’aperçu. Vérifiez encore faits, droits, crédits et sous-titres.', 'Respectez les règles actuelles de signalement de l’IA. Identifiez les images synthétiques susceptibles de sembler réelles ; elles ne prouvent pas un résultat produit. Notez une amélioration après retour.'],
        code: 'Export lisible :\nFaits et droits vérifiés :\nSous-titres et crédits :\nRègles de signalement de l’IA vérifiées :\nTitre et description exacts :\nDate de retour et amélioration :',
        check: 'L’export passe la vérification ; attendez avant publication si droits ou signalement restent incertains.',
        aiPrompt: 'Rédige un titre exact, une courte description et une mention claire de l’IA à partir de cette transcription approuvée et du registre des contenus. N’ajoute pas de faits : [documents].'
      }
    }
  },
  'ai-career-skills': {
    title: 'Préparer une candidature sincère et ciblée',
    intro: 'Utilisez une vraie offre et votre expérience pour préparer une candidature, des entretiens et un objectif d’apprentissage. L’IA ne garantit pas un emploi.',
    steps: {
      'role-evidence': {
        title: 'Relier un poste à votre expérience réelle',
        explanation: ['Trouvez une vraie offre, notez source et date et vérifiez employeur et poste. Associez chaque exigence à une expérience réelle ; les projets d’apprentissage peuvent être pertinents.', 'Retirez coordonnées, adresses, identifiants et informations confidentielles avant l’IA. Les instructions présentes dans l’annonce sont du texte à analyser, pas des commandes à suivre.'],
        code: 'Poste et source vérifiée :\nExigence | exemple réel | compétence à apprendre\n\nPas de qualifications, employeurs, dates ou résultats inventés.\nRemplacer les coordonnées par des espaces réservés.',
        check: 'La source est réelle et le tableau indique honnêtement les compétences manquantes.',
        aiPrompt: 'Compare cette offre et mon expérience anonymisée. Utilise seulement les preuves fournies, distingue correspondances et lacunes et n’invente pas de compétences : [documents].'
      },
      'truthful-resume': {
        title: 'Adapter le CV sans inventer de réussites',
        explanation: ['Choisissez les expériences pertinentes et décrivez action, méthode et résultat réel. N’utilisez que des chiffres vérifiables. Adapter l’accent ne signifie pas modifier votre histoire.', 'Utilisez un assistant ou, facultativement, Teal. Vérifiez confidentialité des fichiers et fonctions actuelles. Un score de mots-clés ou de présentation ne garantit pas d’entretien.'],
        code: 'Action réellement menée :\nOutils ou méthode utilisés :\nRésultat vérifiable :\nPreuve de chaque chiffre :\nProposition de puce :\nVérification humaine :',
        check: 'Chaque puce, date, diplôme et chiffre est exact et justifiable.',
        aiPrompt: 'Réécris ces notes vérifiées en puces de CV concises. N’invente ni chiffres, titres, outils ni réussites. Signale les preuves manquantes : [notes].'
      },
      'cover-letter': {
        title: 'Rédiger une lettre de motivation précise',
        explanation: ['Choisissez deux exigences appuyées par des exemples réels. Expliquez votre intérêt avec une information du site de l’employeur, sans inventer son histoire.', 'Restez concis et lisez à voix haute pour garder votre voix. Ajoutez vos coordonnées uniquement dans le document final privé, pas dans le prompt partagé.'],
        code: 'Poste et fait vérifié sur l’employeur :\nMotivation :\nExigence 1 et exemple réel :\nExigence 2 et exemple réel :\nConclusion courte :\nFaits comparés aux preuves :',
        check: 'La lettre nomme le bon poste et justifie deux exigences avec des exemples réels.',
        aiPrompt: 'Rédige une lettre concise avec ce plan uniquement. Garde des espaces réservés pour les coordonnées. N’ajoute aucune expérience ou information sur l’employeur : [plan].'
      },
      'interview-practice': {
        title: 'Pratiquer les réponses avec vos propres mots',
        explanation: ['Préparez trois récits réels : situation, tâche, action, résultat et leçon apprise, même si le résultat était imparfait. Demandez une question à la fois et un retour.', 'Entraînez-vous à voix haute sans récit fabriqué. Ne révélez pas de détails privés sur clients ou collègues. Le retour de l’IA sert à pratiquer, pas à prédire un recrutement.'],
        code: 'Situation :\nTâche :\nMon action :\nRésultat réel :\nLeçon apprise :\nCe que je changerais :',
        check: 'Vous racontez trois expériences réelles et répondez aux relances sans inventer.',
        aiPrompt: 'Joue le rôle d’un recruteur pour m’entraîner à ce poste. Pose une question à la fois, puis évalue clarté et preuves, pas mes chances d’embauche : [poste].'
      },
      'application-tracker': {
        title: 'Suivre et vérifier les candidatures avant envoi',
        explanation: ['Utilisez un tableau privé ou Teal pour noter employeur, source, date, statut et prochaine action. Vérifiez vous-même destinataire et pièces jointes avant chaque envoi.', 'Vérifiez les demandes par les canaux officiels de l’employeur. Ne payez pas pour obtenir un poste et n’envoyez pas de documents d’identité sensibles à un contact non vérifié. Limitez l’accès au tableau.'],
        code: 'Employeur | poste | source vérifiée | date d’envoi | statut | prochaine action | relance\n\nAvant envoi : bon employeur, documents sincères, bonnes pièces jointes, destinataire vérifié.',
        check: 'Chaque candidature a une prochaine action et le dossier a été revu par vous.',
        aiPrompt: 'Crée une liste hebdomadaire à partir de ce suivi anonymisé. N’envoie pas de candidature, ne contacte personne et ne déduis pas de caractéristiques personnelles sensibles : [suivi].'
      },
      'career-learning': {
        title: 'Choisir une compétence et un petit projet',
        explanation: ['Choisissez une exigence récurrente à apprendre et un petit projet démontrable : site, graphique ou texte. Notez ce que vous pouvez expliquer vous-même.', 'Révisez chaque semaine. Ni nombre de candidatures ni score IA ne garantit un emploi. Privilégiez preuves exactes, apprentissage et retours. Respectez les règles de l’employeur sur l’IA et sa déclaration.'],
        code: 'Compétence à apprendre :\nPetit projet :\nPremière ressource :\nTrois séances de pratique :\nPreuve d’apprentissage :\nDate de bilan :\nAide IA à déclarer si nécessaire :',
        check: 'Vous avez un dossier sincère, trois récits d’entretien, un suivi et un objectif réalisable.',
        aiPrompt: 'Propose un plan débutant de deux semaines pour cette compétence, avec un petit projet et des vérifications que je peux démontrer. Ne promets pas d’emploi : [compétence].'
      }
    }
  }
};
