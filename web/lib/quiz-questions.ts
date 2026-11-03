import type { LanguageCode } from '@/lib/i18n';

type Text = Record<LanguageCode, string>;

export type QuizQuestion = {
  question: Text;
  options: Text[];
  answer: number;
  why: Text;
};

const t = (en: string, fr: string, de: string, es: string): Text => ({ en, fr, de, es });

export const quizQuestions: QuizQuestion[] = [
  {
    question: t('What is a prompt?', "Qu'est-ce qu'un prompt ?", 'Was ist ein Prompt?', '¿Qué es un prompt?'),
    options: [
      t('The instruction you give an AI', "L'instruction que vous donnez à une IA", 'Die Anweisung, die du einer KI gibst', 'La instrucción que le das a una IA'),
      t('A computer virus', 'Un virus informatique', 'Ein Computervirus', 'Un virus informático'),
      t('A type of screen', "Un type d'écran", 'Ein Bildschirmtyp', 'Un tipo de pantalla'),
    ],
    answer: 0,
    why: t('A prompt is the text you write to tell an AI what you want.', "Un prompt est le texte que vous écrivez pour dire à l'IA ce que vous voulez.", 'Ein Prompt ist der Text, mit dem du der KI sagst, was du willst.', 'Un prompt es el texto que escribes para decirle a la IA lo que quieres.'),
  },
  {
    question: t('Which prompt usually gets the better answer?', 'Quel prompt donne en général la meilleure réponse ?', 'Welcher Prompt liefert meist die bessere Antwort?', '¿Qué prompt suele dar la mejor respuesta?'),
    options: [
      t('"Write something"', '« Écris quelque chose »', '„Schreib etwas“', '"Escribe algo"'),
      t('"Write a friendly 3-line email asking to reschedule"', '« Écris un e-mail amical de 3 lignes pour reporter un rendez-vous »', '„Schreibe eine freundliche 3-zeilige E-Mail, um einen Termin zu verschieben“', '"Escribe un correo amable de 3 líneas para cambiar una cita"'),
      t('"Email"', '« E-mail »', '„E-Mail“', '"Correo"'),
    ],
    answer: 1,
    why: t('Clear goals, tone and length help the AI give what you need.', "Un objectif, un ton et une longueur clairs aident l'IA à répondre précisément.", 'Klares Ziel, Ton und Länge helfen der KI, genau zu liefern.', 'Un objetivo, tono y longitud claros ayudan a la IA a responder bien.'),
  },
  {
    question: t('An AI chatbot can sometimes be wrong. What should you do?', 'Un chatbot IA peut se tromper. Que faire ?', 'Ein KI-Chatbot kann sich irren. Was tust du?', 'Un chatbot de IA puede equivocarse. ¿Qué haces?'),
    options: [
      t('Check important facts', 'Vérifier les faits importants', 'Wichtige Fakten prüfen', 'Comprobar los datos importantes'),
      t('Always trust it', 'Toujours lui faire confiance', 'Immer vertrauen', 'Confiar siempre'),
      t('Never use AI again', "Ne plus jamais utiliser l'IA", 'Nie wieder KI nutzen', 'No volver a usar IA'),
    ],
    answer: 0,
    why: t('AI can sound sure and still be wrong, so verify what matters.', "L'IA peut sembler sûre d'elle et se tromper : vérifiez ce qui compte.", 'KI klingt oft sicher und liegt trotzdem falsch, prüfe also Wichtiges.', 'La IA puede sonar segura y aun así equivocarse; verifica lo importante.'),
  },
  {
    question: t('Which is safe to paste into a public AI tool?', 'Que peut-on coller sans risque dans un outil IA public ?', 'Was kannst du bedenkenlos in ein öffentliches KI-Tool einfügen?', '¿Qué es seguro pegar en una herramienta de IA pública?'),
    options: [
      t('Your passwords', 'Vos mots de passe', 'Deine Passwörter', 'Tus contraseñas'),
      t('A general question about cooking', 'Une question générale de cuisine', 'Eine allgemeine Frage zum Kochen', 'Una pregunta general de cocina'),
      t('Your private ID number', "Votre numéro d'identité", 'Deine Ausweisnummer', 'Tu número de identificación'),
    ],
    answer: 1,
    why: t('Never share passwords or private data with AI tools.', "Ne partagez jamais mots de passe ou données privées avec des outils d'IA.", 'Teile nie Passwörter oder private Daten mit KI-Tools.', 'Nunca compartas contraseñas ni datos privados con herramientas de IA.'),
  },
  {
    question: t('What does "AI" stand for?', 'Que signifie « IA » ?', 'Wofür steht „KI“?', '¿Qué significa "IA"?'),
    options: [
      t('Artificial intelligence', 'Intelligence artificielle', 'Künstliche Intelligenz', 'Inteligencia artificial'),
      t('Automatic internet', 'Internet automatique', 'Automatisches Internet', 'Internet automático'),
      t('Advanced input', 'Entrée avancée', 'Erweiterte Eingabe', 'Entrada avanzada'),
    ],
    answer: 0,
    why: t('AI means machines doing tasks that usually need human thinking.', "L'IA désigne des machines qui font des tâches demandant d'ordinaire de la réflexion humaine.", 'KI bedeutet, dass Maschinen Aufgaben lösen, die sonst menschliches Denken brauchen.', 'La IA son máquinas que hacen tareas que suelen requerir pensamiento humano.'),
  },
  {
    question: t('If the first answer is not what you wanted, what helps most?', "Si la première réponse ne convient pas, qu'est-ce qui aide le plus ?", 'Wenn die erste Antwort nicht passt, was hilft am meisten?', 'Si la primera respuesta no es lo que querías, ¿qué ayuda más?'),
    options: [
      t('Give up', 'Abandonner', 'Aufgeben', 'Rendirse'),
      t('Add details and ask again', 'Ajouter des détails et redemander', 'Details ergänzen und nochmal fragen', 'Añadir detalles y volver a preguntar'),
      t('Shout at the screen', "Crier sur l'écran", 'Den Bildschirm anschreien', 'Gritarle a la pantalla'),
    ],
    answer: 1,
    why: t('Improving your prompt step by step is the core AI skill.', "Améliorer son prompt pas à pas est la compétence clé.", 'Den Prompt Schritt für Schritt zu verbessern ist die wichtigste Fähigkeit.', 'Mejorar tu prompt paso a paso es la habilidad clave.'),
  },
  {
    question: t('Which of these can AI tools help you with?', "Pour quoi les outils d'IA peuvent-ils vous aider ?", 'Wobei können dir KI-Tools helfen?', '¿En qué pueden ayudarte las herramientas de IA?'),
    options: [
      t('Drafting, summarising and brainstorming', 'Rédiger, résumer et trouver des idées', 'Entwerfen, Zusammenfassen und Ideen sammeln', 'Redactar, resumir y generar ideas'),
      t('Replacing your own judgement', 'Remplacer votre propre jugement', 'Dein eigenes Urteil ersetzen', 'Reemplazar tu propio criterio'),
      t('Guaranteeing perfect facts', 'Garantir des faits parfaits', 'Perfekte Fakten garantieren', 'Garantizar datos perfectos'),
    ],
    answer: 0,
    why: t('AI is a helper for first drafts and ideas; you stay in charge.', "L'IA aide pour les premières versions et les idées ; vous restez aux commandes.", 'KI hilft bei ersten Entwürfen und Ideen; du behältst die Kontrolle.', 'La IA ayuda con borradores e ideas; tú sigues al mando.'),
  },
  {
    question: t('Why compare two AI tools before choosing?', 'Pourquoi comparer deux outils IA avant de choisir ?', 'Warum zwei KI-Tools vor der Wahl vergleichen?', '¿Por qué comparar dos herramientas de IA antes de elegir?'),
    options: [
      t('Each has different strengths, limits and prices', 'Chacun a des forces, limites et prix différents', 'Jedes hat andere Stärken, Grenzen und Preise', 'Cada una tiene fortalezas, límites y precios distintos'),
      t('They are all identical', 'Ils sont tous identiques', 'Sie sind alle identisch', 'Todas son idénticas'),
      t('Comparing is not allowed', "Comparer n'est pas autorisé", 'Vergleichen ist nicht erlaubt', 'Comparar no está permitido'),
    ],
    answer: 0,
    why: t('Picking the right tool for your goal saves time and money.', 'Choisir le bon outil pour votre objectif fait gagner du temps et de l’argent.', 'Das passende Tool für dein Ziel spart Zeit und Geld.', 'Elegir la herramienta adecuada para tu meta ahorra tiempo y dinero.'),
  },
  {
    question: t('What is an AI hallucination?', 'Qu\'est-ce qu\'une hallucination de l\'IA ?', 'Was ist eine KI-Halluzination?', '¿Qué es una alucinación de la IA?'),
    options: [
      t('A confident answer that is made up or wrong', 'Une réponse assurée mais inventée ou fausse', 'Eine selbstsichere, aber erfundene oder falsche Antwort', 'Una respuesta segura pero inventada o errónea'),
      t('A computer dream', 'Un rêve d\'ordinateur', 'Ein Computertraum', 'Un sueño del ordenador'),
      t('A slow internet connection', 'Une connexion lente', 'Eine langsame Internetverbindung', 'Una conexión lenta'),
    ],
    answer: 0,
    why: t('Hallucinations sound believable, so always check key facts.', 'Les hallucinations semblent crédibles : vérifiez toujours les faits clés.', 'Halluzinationen klingen glaubwürdig, prüfe also wichtige Fakten.', 'Las alucinaciones suenan creíbles; comprueba siempre los datos clave.'),
  },
  {
    question: t('What does giving an AI an example usually do?', 'Que fait en général un exemple donné à l\'IA ?', 'Was bewirkt ein Beispiel für die KI meistens?', '¿Qué suele lograr dar un ejemplo a la IA?'),
    options: [
      t('Makes the answer match your style better', 'Rapproche la réponse de votre style', 'Die Antwort passt besser zu deinem Stil', 'La respuesta se parece más a tu estilo'),
      t('Breaks the AI', 'Casse l\'IA', 'Macht die KI kaputt', 'Rompe la IA'),
      t('Nothing at all', 'Rien du tout', 'Gar nichts', 'Nada en absoluto'),
    ],
    answer: 0,
    why: t('Examples show the AI the format and tone you want.', 'Les exemples montrent à l\'IA le format et le ton voulus.', 'Beispiele zeigen der KI Format und Ton, die du willst.', 'Los ejemplos muestran a la IA el formato y el tono que quieres.'),
  },
  {
    question: t('Which is a good first use of AI for a beginner?', 'Quel est un bon premier usage de l\'IA pour un débutant ?', 'Was ist ein guter erster KI-Einsatz für Einsteiger?', '¿Cuál es un buen primer uso de la IA para un principiante?'),
    options: [
      t('Summarising an article you will still read', 'Résumer un article que vous lirez quand même', 'Einen Artikel zusammenfassen, den du trotzdem liest', 'Resumir un artículo que aún así leerás'),
      t('Making a legal decision alone', 'Prendre seul une décision juridique', 'Allein eine rechtliche Entscheidung treffen', 'Tomar sola una decisión legal'),
      t('Sharing your bank details', 'Partager vos coordonnées bancaires', 'Deine Bankdaten teilen', 'Compartir tus datos bancarios'),
    ],
    answer: 0,
    why: t('Low-risk tasks you can check are the best way to learn.', 'Les tâches peu risquées que vous pouvez vérifier sont idéales pour apprendre.', 'Risikoarme Aufgaben, die du prüfen kannst, sind ideal zum Lernen.', 'Las tareas de bajo riesgo que puedes comprobar son ideales para aprender.'),
  },
  {
    question: t('What is a free plan usually good for?', 'À quoi sert en général un forfait gratuit ?', 'Wofür taugt ein kostenloser Tarif meist?', '¿Para qué suele servir un plan gratuito?'),
    options: [
      t('Trying a tool before paying', 'Essayer un outil avant de payer', 'Ein Tool vor dem Kauf testen', 'Probar una herramienta antes de pagar'),
      t('Unlimited use forever', 'Un usage illimité pour toujours', 'Unbegrenzte Nutzung für immer', 'Uso ilimitado para siempre'),
      t('Hiding your data', 'Cacher vos données', 'Deine Daten verstecken', 'Ocultar tus datos'),
    ],
    answer: 0,
    why: t('Free plans often have limits, so test first and read the terms.', 'Les forfaits gratuits ont souvent des limites : testez d\'abord et lisez les conditions.', 'Kostenlose Tarife haben oft Grenzen: erst testen und die Bedingungen lesen.', 'Los planes gratuitos suelen tener límites; prueba primero y lee las condiciones.'),
  },
  {
    question: t('What is no-code?', 'Qu\'est-ce que le sans code ?', 'Was ist No-Code?', '¿Qué es el no-code?'),
    options: [
      t('Building tools with visual blocks instead of writing code', 'Créer des outils avec des blocs visuels sans écrire de code', 'Tools mit visuellen Bausteinen statt Code bauen', 'Crear herramientas con bloques visuales sin escribir código'),
      t('Code that has no rules', 'Du code sans règles', 'Code ohne Regeln', 'Código sin reglas'),
      t('Deleting all code', 'Supprimer tout le code', 'Allen Code löschen', 'Borrar todo el código'),
    ],
    answer: 0,
    why: t('No-code tools let beginners build forms, automations and apps visually.', 'Les outils sans code permettent de créer formulaires, automatisations et applis visuellement.', 'No-Code-Tools lassen Einsteiger Formulare, Automatisierungen und Apps visuell bauen.', 'Las herramientas no-code permiten crear formularios, automatizaciones y apps de forma visual.'),
  },
  {
    question: t('What is automation?', 'Qu\'est-ce que l\'automatisation ?', 'Was ist Automatisierung?', '¿Qué es la automatización?'),
    options: [
      t('Letting a tool do a repeated task for you', 'Laisser un outil faire une tâche répétitive à votre place', 'Ein Tool eine wiederkehrende Aufgabe für dich erledigen lassen', 'Dejar que una herramienta haga una tarea repetida por ti'),
      t('Doing everything by hand', 'Tout faire à la main', 'Alles von Hand erledigen', 'Hacerlo todo a mano'),
      t('Turning off your computer', 'Éteindre votre ordinateur', 'Den Computer ausschalten', 'Apagar el ordenador'),
    ],
    answer: 0,
    why: t('Good automations start with a trigger, an action and a test run.', 'Une bonne automatisation commence par un déclencheur, une action et un test.', 'Gute Automatisierungen beginnen mit Auslöser, Aktion und Testlauf.', 'Una buena automatización empieza con un disparador, una acción y una prueba.'),
  },
  {
    question: t('Before turning on a new automation, what should you do?', 'Avant d\'activer une nouvelle automatisation, que faire ?', 'Was tust du, bevor du eine neue Automatisierung aktivierst?', 'Antes de activar una nueva automatización, ¿qué haces?'),
    options: [
      t('Test it with sample data', 'La tester avec des données d\'exemple', 'Mit Beispieldaten testen', 'Probarla con datos de ejemplo'),
      t('Skip testing', 'Ne pas tester', 'Das Testen überspringen', 'Saltarte la prueba'),
      t('Use real customer data first', 'Utiliser d\'abord de vraies données clients', 'Zuerst echte Kundendaten nutzen', 'Usar primero datos reales de clientes'),
    ],
    answer: 0,
    why: t('Testing with sample data avoids mistakes with real people.', 'Tester avec des données d\'exemple évite les erreurs avec de vraies personnes.', 'Tests mit Beispieldaten vermeiden Fehler bei echten Menschen.', 'Probar con datos de ejemplo evita errores con personas reales.'),
  },
  {
    question: t('What is machine learning?', 'Qu\'est-ce que l\'apprentissage automatique ?', 'Was ist maschinelles Lernen?', '¿Qué es el aprendizaje automático?'),
    options: [
      t('Computers learning patterns from data', 'Des ordinateurs qui apprennent des motifs dans des données', 'Computer lernen Muster aus Daten', 'Ordenadores que aprenden patrones de los datos'),
      t('Machines going to school', 'Des machines qui vont à l\'école', 'Maschinen gehen zur Schule', 'Máquinas yendo a la escuela'),
      t('A kind of keyboard', 'Un type de clavier', 'Eine Tastaturart', 'Un tipo de teclado'),
    ],
    answer: 0,
    why: t('Machine learning finds patterns in examples to make predictions.', 'L\'apprentissage automatique trouve des motifs dans des exemples pour prédire.', 'Maschinelles Lernen findet Muster in Beispielen, um Vorhersagen zu treffen.', 'El aprendizaje automático encuentra patrones en ejemplos para predecir.'),
  },
  {
    question: t('Why is good data important for AI?', 'Pourquoi des données de qualité comptent-elles pour l\'IA ?', 'Warum sind gute Daten für KI wichtig?', '¿Por qué son importantes los buenos datos para la IA?'),
    options: [
      t('Poor data leads to poor results', 'De mauvaises données donnent de mauvais résultats', 'Schlechte Daten führen zu schlechten Ergebnissen', 'Los malos datos dan malos resultados'),
      t('Data does not matter', 'Les données n\'ont pas d\'importance', 'Daten sind egal', 'Los datos no importan'),
      t('AI only needs colors', 'L\'IA n\'a besoin que de couleurs', 'KI braucht nur Farben', 'La IA solo necesita colores'),
    ],
    answer: 0,
    why: t('Garbage in, garbage out: check your data before trusting results.', 'Données douteuses, résultats douteux : vérifiez vos données.', 'Müll rein, Müll raus: prüfe deine Daten, bevor du Ergebnissen traust.', 'Datos basura, resultados basura: revisa tus datos antes de confiar.'),
  },
  {
    question: t('What helps when AI writes code for you?', 'Qu\'est-ce qui aide quand l\'IA écrit du code pour vous ?', 'Was hilft, wenn die KI Code für dich schreibt?', '¿Qué ayuda cuando la IA escribe código por ti?'),
    options: [
      t('Run it, read it and test it', 'L\'exécuter, le lire et le tester', 'Ausführen, lesen und testen', 'Ejecutarlo, leerlo y probarlo'),
      t('Paste it without looking', 'Le coller sans le regarder', 'Ungesehen einfügen', 'Pegarlo sin mirarlo'),
      t('Never run it', 'Ne jamais l\'exécuter', 'Nie ausführen', 'No ejecutarlo nunca'),
    ],
    answer: 0,
    why: t('AI code can have bugs, so understand and test it before using it.', 'Le code de l\'IA peut contenir des bugs : comprenez-le et testez-le.', 'KI-Code kann Fehler haben: verstehe und teste ihn vor dem Einsatz.', 'El código de la IA puede tener errores; entiéndelo y pruébalo antes de usarlo.'),
  },
  {
    question: t('Which habit makes you a better AI user?', 'Quelle habitude fait de vous un meilleur utilisateur de l\'IA ?', 'Welche Gewohnheit macht dich zum besseren KI-Nutzer?', '¿Qué hábito te convierte en mejor usuario de la IA?'),
    options: [
      t('Saving prompts that worked', 'Garder les prompts qui ont bien marché', 'Prompts speichern, die funktioniert haben', 'Guardar los prompts que funcionaron'),
      t('Typing one word only', 'Taper un seul mot', 'Nur ein Wort tippen', 'Escribir una sola palabra'),
      t('Never reviewing results', 'Ne jamais relire les résultats', 'Ergebnisse nie prüfen', 'No revisar nunca los resultados'),
    ],
    answer: 0,
    why: t('A personal prompt library saves time and improves results.', 'Une bibliothèque personnelle de prompts fait gagner du temps et améliore les résultats.', 'Eine persönliche Prompt-Sammlung spart Zeit und verbessert Ergebnisse.', 'Una biblioteca personal de prompts ahorra tiempo y mejora resultados.'),
  },
  {
    question: t('When making content with AI, what is the honest thing to do?', 'En créant du contenu avec l\'IA, que faire d\'honnête ?', 'Was ist beim Erstellen von Inhalten mit KI ehrlich?', 'Al crear contenido con IA, ¿qué es lo honesto?'),
    options: [
      t('Edit it, check facts and say AI helped if expected', 'Le retoucher, vérifier les faits et dire que l\'IA a aidé si c\'est attendu', 'Bearbeiten, Fakten prüfen und KI-Hilfe angeben, wenn erwartet', 'Editarlo, comprobar datos y decir que la IA ayudó si se espera'),
      t('Copy another creator\'s work', 'Copier le travail d\'un autre créateur', 'Das Werk eines anderen kopieren', 'Copiar el trabajo de otro creador'),
      t('Fake someone\'s voice', 'Imiter la voix de quelqu\'un', 'Jemandes Stimme fälschen', 'Imitar la voz de alguien'),
    ],
    answer: 0,
    why: t('Be original, respect rights and be open about using AI.', 'Soyez original, respectez les droits et soyez transparent sur l\'usage de l\'IA.', 'Sei originell, achte Rechte und sei offen über KI-Nutzung.', 'Sé original, respeta los derechos y sé transparente sobre el uso de IA.'),
  },
  {
    question: t("What does it mean when an AI \"hallucinates\"?", "Que signifie « halluciner » pour une IA ?", "Was bedeutet es, wenn eine KI „halluziniert“?", "¿Qué significa que una IA «alucine»?"),
    options: [
      t("It confidently states something false", "Elle affirme avec assurance quelque chose de faux", "Sie behauptet selbstsicher etwas Falsches", "Afirma con seguridad algo falso"),
      t("It falls asleep", "Elle s'endort", "Sie schläft ein", "Se queda dormida"),
      t("It refuses to answer", "Elle refuse de répondre", "Sie verweigert die Antwort", "Se niega a responder"),
    ],
    answer: 0,
    why: t("Models can invent convincing but false details, so check important facts.", "Les modèles peuvent inventer des détails convaincants mais faux : vérifiez les faits importants.", "Modelle können überzeugende, aber falsche Details erfinden: prüfe wichtige Fakten.", "Los modelos pueden inventar detalles convincentes pero falsos; comprueba los datos importantes."),
  },
  {
    question: t("Which information should you NOT paste into a public AI chatbot?", "Quelles informations ne faut-il PAS coller dans un chatbot IA public ?", "Welche Informationen solltest du NICHT in einen öffentlichen KI-Chatbot einfügen?", "¿Qué información NO debes pegar en un chatbot de IA público?"),
    options: [
      t("A recipe idea", "Une idée de recette", "Eine Rezeptidee", "Una idea de receta"),
      t("Passwords and private customer data", "Mots de passe et données clients privées", "Passwörter und private Kundendaten", "Contraseñas y datos privados de clientes"),
      t("A question about history", "Une question d'histoire", "Eine Frage zur Geschichte", "Una pregunta de historia"),
    ],
    answer: 1,
    why: t("Treat chatbots like a public space: keep secrets and personal data out.", "Considérez un chatbot comme un lieu public : gardez secrets et données personnelles à l'écart.", "Behandle Chatbots wie einen öffentlichen Ort: Geheimnisse und persönliche Daten bleiben draußen.", "Trata a los chatbots como un lugar público: deja fuera secretos y datos personales."),
  },
  {
    question: t("What is a \"token\" in an AI language model?", "Qu'est-ce qu'un « token » dans un modèle de langage ?", "Was ist ein „Token“ in einem KI-Sprachmodell?", "¿Qué es un «token» en un modelo de lenguaje?"),
    options: [
      t("A password", "Un mot de passe", "Ein Passwort", "Una contraseña"),
      t("A small piece of text the model reads", "Un petit morceau de texte lu par le modèle", "Ein kleines Textstück, das das Modell liest", "Un trozo pequeño de texto que lee el modelo"),
      t("A payment coin", "Une pièce de paiement", "Eine Zahlungsmünze", "Una moneda de pago"),
    ],
    answer: 1,
    why: t("Text is split into tokens, which are roughly word pieces.", "Le texte est découpé en tokens, à peu près des morceaux de mots.", "Text wird in Tokens zerlegt, grob Wortstücke.", "El texto se divide en tokens, más o menos trozos de palabras."),
  },
  {
    question: t("What is a \"context window\"?", "Qu'est-ce qu'une « fenêtre de contexte » ?", "Was ist ein „Kontextfenster“?", "¿Qué es una «ventana de contexto»?"),
    options: [
      t("A pop-up on your screen", "Une fenêtre contextuelle à l'écran", "Ein Pop-up auf deinem Bildschirm", "Una ventana emergente en pantalla"),
      t("A browser setting", "Un réglage du navigateur", "Eine Browsereinstellung", "Un ajuste del navegador"),
      t("How much text the AI can keep in mind at once", "La quantité de texte que l'IA peut garder en tête", "Wie viel Text die KI gleichzeitig im Blick behalten kann", "Cuánto texto puede tener presente la IA a la vez"),
    ],
    answer: 2,
    why: t("Very long chats can push early details out of the window.", "Les très longues conversations peuvent faire sortir les premiers détails de la fenêtre.", "Sehr lange Chats können frühe Details aus dem Fenster schieben.", "Los chats muy largos pueden sacar los primeros detalles de la ventana."),
  },
  {
    question: t("Why can AI answers be biased?", "Pourquoi les réponses de l'IA peuvent-elles être biaisées ?", "Warum können KI-Antworten voreingenommen sein?", "¿Por qué las respuestas de la IA pueden estar sesgadas?"),
    options: [
      t("It learned from human-made data that has biases", "Elle a appris à partir de données humaines qui ont des biais", "Sie hat aus menschengemachten Daten mit Vorurteilen gelernt", "Aprendió de datos humanos que tienen sesgos"),
      t("It has personal opinions", "Elle a des opinions personnelles", "Sie hat persönliche Meinungen", "Tiene opiniones personales"),
      t("The internet is switched off", "Internet est coupé", "Das Internet ist abgeschaltet", "Internet está apagado"),
    ],
    answer: 0,
    why: t("Training data reflects people, so look at results critically.", "Les données d'entraînement reflètent les humains : gardez un regard critique.", "Trainingsdaten spiegeln Menschen wider: bewerte Ergebnisse kritisch.", "Los datos de entrenamiento reflejan a las personas; mira los resultados con ojo crítico."),
  },
  {
    question: t("What is an AI \"agent\"?", "Qu'est-ce qu'un « agent » IA ?", "Was ist ein KI-„Agent“?", "¿Qué es un «agente» de IA?"),
    options: [
      t("A human support worker", "Un employé du support", "Ein menschlicher Support-Mitarbeiter", "Un trabajador de soporte humano"),
      t("An AI that can take steps and use tools to reach a goal", "Une IA qui enchaîne des étapes et utilise des outils pour atteindre un objectif", "Eine KI, die Schritte ausführt und Werkzeuge nutzt, um ein Ziel zu erreichen", "Una IA que da pasos y usa herramientas para lograr un objetivo"),
      t("A browser extension", "Une extension de navigateur", "Eine Browser-Erweiterung", "Una extensión del navegador"),
    ],
    answer: 1,
    why: t("Agents plan and act, so review what they do before relying on it.", "Les agents planifient et agissent : relisez ce qu'ils font avant de vous y fier.", "Agenten planen und handeln: prüfe, was sie tun, bevor du dich darauf verlässt.", "Los agentes planifican y actúan; revisa lo que hacen antes de fiarte."),
  },
  {
    question: t("In an automation, what is a \"trigger\"?", "Dans une automatisation, qu'est-ce qu'un « déclencheur » ?", "Was ist in einer Automatisierung ein „Auslöser“?", "En una automatización, ¿qué es un «disparador»?"),
    options: [
      t("The final result", "Le résultat final", "Das Endergebnis", "El resultado final"),
      t("An error message", "Un message d'erreur", "Eine Fehlermeldung", "Un mensaje de error"),
      t("The event that starts it, like a new email", "L'événement qui la démarre, comme un nouvel e-mail", "Das Ereignis, das sie startet, z. B. eine neue E-Mail", "El evento que la inicia, como un correo nuevo"),
    ],
    answer: 2,
    why: t("A trigger starts the flow; actions are what happens next.", "Le déclencheur lance le flux ; les actions sont ce qui suit.", "Der Auslöser startet den Ablauf; Aktionen sind das, was danach passiert.", "El disparador inicia el flujo; las acciones son lo que ocurre después."),
  },
  {
    question: t("What does \"no-code\" mean?", "Que signifie « no-code » ?", "Was bedeutet „No-Code“?", "¿Qué significa «no-code»?"),
    options: [
      t("Building apps with visual tools instead of writing code", "Créer des apps avec des outils visuels sans écrire de code", "Apps mit visuellen Werkzeugen statt Code bauen", "Crear apps con herramientas visuales sin escribir código"),
      t("Code that has no bugs", "Du code sans bugs", "Code ohne Fehler", "Código sin errores"),
      t("A secret code", "Un code secret", "Ein Geheimcode", "Un código secreto"),
    ],
    answer: 0,
    why: t("No-code tools let beginners build real things with clicks and blocks.", "Les outils no-code permettent aux débutants de créer avec des clics et des blocs.", "No-Code-Tools lassen Einsteiger mit Klicks und Blöcken echte Dinge bauen.", "Las herramientas no-code permiten a principiantes crear con clics y bloques."),
  },
  {
    question: t("What is an API, in simple words?", "Qu'est-ce qu'une API, en termes simples ?", "Was ist eine API, einfach erklärt?", "¿Qué es una API, en palabras simples?"),
    options: [
      t("A type of computer", "Un type d'ordinateur", "Ein Computertyp", "Un tipo de ordenador"),
      t("A way for programs to talk to each other", "Une façon pour des programmes de se parler", "Eine Möglichkeit, wie Programme miteinander sprechen", "Una forma de que los programas hablen entre sí"),
      t("A programming mistake", "Une erreur de programmation", "Ein Programmierfehler", "Un error de programación"),
    ],
    answer: 1,
    why: t("Think of an API as a waiter carrying requests between two programs.", "Imaginez une API comme un serveur qui porte les demandes entre deux programmes.", "Stell dir eine API als Kellner vor, der Anfragen zwischen zwei Programmen trägt.", "Piensa en una API como un camarero que lleva peticiones entre dos programas."),
  },
  {
    question: t("Why keep an API key private?", "Pourquoi garder une clé d'API privée ?", "Warum sollte ein API-Schlüssel geheim bleiben?", "¿Por qué mantener privada una clave de API?"),
    options: [
      t("Others could use it and run up your bill", "D'autres pourraient l'utiliser et faire grimper votre facture", "Andere könnten ihn nutzen und deine Rechnung hochtreiben", "Otros podrían usarla y aumentar tu factura"),
      t("It makes the app slower", "Cela ralentit l'app", "Es macht die App langsamer", "Hace la app más lenta"),
      t("It expires every hour", "Elle expire chaque heure", "Er läuft stündlich ab", "Caduca cada hora"),
    ],
    answer: 0,
    why: t("Never paste keys into public code, chats or screenshots.", "Ne collez jamais de clés dans du code public, un chat ou une capture d'écran.", "Füge Schlüssel nie in öffentlichen Code, Chats oder Screenshots ein.", "Nunca pegues claves en código público, chats o capturas."),
  },
  {
    question: t("What is Git mainly used for?", "À quoi sert surtout Git ?", "Wofür wird Git hauptsächlich genutzt?", "¿Para qué se usa principalmente Git?"),
    options: [
      t("Editing photos", "Retoucher des photos", "Fotos bearbeiten", "Editar fotos"),
      t("Sending emails", "Envoyer des e-mails", "E-Mails senden", "Enviar correos"),
      t("Tracking changes to your code over time", "Suivre les changements de votre code dans le temps", "Änderungen an deinem Code über die Zeit festhalten", "Seguir los cambios de tu código con el tiempo"),
    ],
    answer: 2,
    why: t("Git keeps a history so you can undo mistakes and collaborate.", "Git garde un historique pour annuler des erreurs et collaborer.", "Git führt einen Verlauf, damit du Fehler rückgängig machen und zusammenarbeiten kannst.", "Git guarda un historial para deshacer errores y colaborar."),
  },
  {
    question: t("What is JSON?", "Qu'est-ce que le JSON ?", "Was ist JSON?", "¿Qué es JSON?"),
    options: [
      t("A text format for organized data", "Un format texte pour des données organisées", "Ein Textformat für strukturierte Daten", "Un formato de texto para datos organizados"),
      t("A programming language for games", "Un langage de programmation pour jeux", "Eine Programmiersprache für Spiele", "Un lenguaje de programación para juegos"),
      t("A type of image", "Un type d'image", "Ein Bildtyp", "Un tipo de imagen"),
    ],
    answer: 0,
    why: t("JSON stores data as labels and values, and many tools and APIs use it.", "Le JSON stocke des données en étiquettes et valeurs ; beaucoup d'outils et d'API l'utilisent.", "JSON speichert Daten als Bezeichnungen und Werte; viele Tools und APIs nutzen es.", "JSON guarda datos como etiquetas y valores, y muchas herramientas y APIs lo usan."),
  },
  {
    question: t("Why give an AI an example of the output you want?", "Pourquoi donner à l'IA un exemple du résultat voulu ?", "Warum gibt man der KI ein Beispiel für das gewünschte Ergebnis?", "¿Por qué darle a la IA un ejemplo del resultado deseado?"),
    options: [
      t("It makes the AI faster", "Cela accélère l'IA", "Es macht die KI schneller", "Hace la IA más rápida"),
      t("It shows the format and style to copy", "Cela montre le format et le style à reproduire", "Es zeigt Format und Stil zum Nachahmen", "Muestra el formato y estilo a imitar"),
      t("It is required by law", "C'est obligatoire légalement", "Es ist gesetzlich vorgeschrieben", "Es obligatorio por ley"),
    ],
    answer: 1,
    why: t("Examples (few-shot prompting) steer format and tone very well.", "Les exemples (few-shot) guident très bien le format et le ton.", "Beispiele (Few-Shot) steuern Format und Ton sehr gut.", "Los ejemplos (few-shot) guían muy bien el formato y el tono."),
  },
  {
    question: t("A good way to handle a big task with AI is to…", "Une bonne façon de traiter une grosse tâche avec l'IA est de…", "Eine gute Methode für eine große Aufgabe mit KI ist…", "Una buena forma de abordar una tarea grande con IA es…"),
    options: [
      t("Ask for everything in one giant prompt", "Tout demander dans un énorme prompt", "Alles in einem riesigen Prompt zu verlangen", "Pedirlo todo en un prompt gigante"),
      t("Give up", "Abandonner", "Aufzugeben", "Rendirse"),
      t("Break it into smaller steps", "La découper en petites étapes", "Sie in kleinere Schritte zu teilen", "Dividirla en pasos más pequeños"),
    ],
    answer: 2,
    why: t("Step by step prompts are easier to check and fix.", "Les prompts étape par étape sont plus faciles à vérifier et corriger.", "Schritt-für-Schritt-Prompts lassen sich leichter prüfen und korrigieren.", "Los prompts paso a paso son más fáciles de revisar y corregir."),
  },
  {
    question: t("What does \"open source\" software mean?", "Que signifie un logiciel « open source » ?", "Was bedeutet „Open Source“-Software?", "¿Qué significa software «de código abierto»?"),
    options: [
      t("Its code is public so people can read and often improve it", "Son code est public : on peut le lire et souvent l'améliorer", "Sein Code ist öffentlich und kann gelesen und oft verbessert werden", "Su código es público y se puede leer y a menudo mejorar"),
      t("It is always free of any rules", "Il n'a jamais aucune règle", "Es hat nie irgendwelche Regeln", "Nunca tiene reglas"),
      t("It only runs online", "Il ne fonctionne qu'en ligne", "Es läuft nur online", "Solo funciona en línea"),
    ],
    answer: 0,
    why: t("Open source can still have licenses, so read what you may do with it.", "L'open source a quand même des licences : lisez ce que vous pouvez en faire.", "Open Source hat trotzdem Lizenzen: lies, was du damit darfst.", "El código abierto sigue teniendo licencias; lee lo que puedes hacer con él."),
  },
  {
    question: t("What is an image-generation AI good at?", "En quoi une IA de génération d'images est-elle utile ?", "Wofür ist eine Bildgenerierungs-KI gut?", "¿Para qué sirve una IA que genera imágenes?"),
    options: [
      t("Doing your taxes", "Faire vos impôts", "Deine Steuererklärung machen", "Hacer tu declaración de impuestos"),
      t("Creating pictures from a text description", "Créer des images à partir d'une description", "Bilder aus einer Textbeschreibung erstellen", "Crear imágenes a partir de una descripción"),
      t("Fixing your Wi-Fi", "Réparer votre Wi-Fi", "Dein WLAN reparieren", "Arreglar tu wifi"),
    ],
    answer: 1,
    why: t("Describe subject, style and mood to get closer to what you imagine.", "Décrivez sujet, style et ambiance pour vous rapprocher de ce que vous imaginez.", "Beschreibe Motiv, Stil und Stimmung, um dem Gewünschten näherzukommen.", "Describe sujeto, estilo y ambiente para acercarte a lo que imaginas."),
  },
  {
    question: t("Before using AI-generated images commercially, you should…", "Avant d'utiliser commercialement des images générées par IA, il faut…", "Bevor du KI-Bilder kommerziell nutzt, solltest du…", "Antes de usar imágenes de IA con fines comerciales, debes…"),
    options: [
      t("Assume anything is allowed", "Supposer que tout est permis", "Annehmen, dass alles erlaubt ist", "Suponer que todo está permitido"),
      t("Check the tool's terms and usage rights", "Vérifier les conditions et droits d'usage de l'outil", "Die Nutzungsbedingungen und Rechte des Tools prüfen", "Revisar los términos y derechos de uso de la herramienta"),
      t("Remove the file name", "Supprimer le nom du fichier", "Den Dateinamen entfernen", "Quitar el nombre del archivo"),
    ],
    answer: 1,
    why: t("Each tool sets its own rules for commercial use.", "Chaque outil fixe ses propres règles pour l'usage commercial.", "Jedes Tool hat eigene Regeln für kommerzielle Nutzung.", "Cada herramienta fija sus propias reglas para uso comercial."),
  },
  {
    question: t("What is a good first project for a beginner?", "Quel est un bon premier projet pour un débutant ?", "Was ist ein gutes erstes Projekt für Einsteiger?", "¿Cuál es un buen primer proyecto para un principiante?"),
    options: [
      t("A huge app with many features", "Une énorme app pleine de fonctions", "Eine riesige App mit vielen Funktionen", "Una app enorme con muchas funciones"),
      t("Something small you can finish in a day", "Quelque chose de petit à finir en une journée", "Etwas Kleines, das du an einem Tag schaffst", "Algo pequeño que puedas terminar en un día"),
      t("Rebuilding a social network", "Refaire un réseau social", "Ein soziales Netzwerk nachbauen", "Reconstruir una red social"),
    ],
    answer: 1,
    why: t("Small wins build skill and motivation; grow the project later.", "De petites victoires créent compétence et motivation ; agrandissez ensuite.", "Kleine Erfolge bauen Können und Motivation auf; erweitere das Projekt später.", "Las pequeñas victorias crean habilidad y motivación; amplía después."),
  },
  {
    question: t("An AI tells you something surprising. What is the best next step?", "Une IA vous dit quelque chose de surprenant. Que faire ensuite ?", "Eine KI sagt etwas Überraschendes. Was ist der beste nächste Schritt?", "Una IA te dice algo sorprendente. ¿Cuál es el mejor siguiente paso?"),
    options: [
      t("Ask it to cite sources, then verify them yourself", "Lui demander ses sources, puis les vérifier vous-même", "Nach Quellen fragen und sie selbst prüfen", "Pedirle fuentes y verificarlas tú mismo"),
      t("Share it right away", "Le partager tout de suite", "Es sofort teilen", "Compartirlo de inmediato"),
      t("Believe it because it sounded sure", "Le croire car elle semblait sûre", "Es glauben, weil es sicher klang", "Creerlo porque sonó seguro"),
    ],
    answer: 0,
    why: t("Sources can be invented too, so open them and confirm.", "Les sources peuvent aussi être inventées : ouvrez-les et confirmez.", "Auch Quellen können erfunden sein: öffne sie und bestätige.", "Las fuentes también pueden ser inventadas; ábrelas y confírmalo."),
  },
  {
    question: t("What does \"fine-tuning\" a model mean?", "Que signifie « affiner » (fine-tuner) un modèle ?", "Was bedeutet „Fine-Tuning“ eines Modells?", "¿Qué significa «afinar» (fine-tuning) un modelo?"),
    options: [
      t("Changing the volume", "Changer le volume", "Die Lautstärke ändern", "Cambiar el volumen"),
      t("Deleting old chats", "Supprimer d'anciennes conversations", "Alte Chats löschen", "Borrar chats antiguos"),
      t("Training it further on your own examples", "L'entraîner davantage avec vos propres exemples", "Es mit eigenen Beispielen weiter zu trainieren", "Entrenarlo más con tus propios ejemplos"),
    ],
    answer: 2,
    why: t("Fine-tuning adapts a model to a task; good prompts often work first.", "L'affinage adapte un modèle à une tâche ; de bons prompts suffisent souvent.", "Fine-Tuning passt ein Modell an eine Aufgabe an; gute Prompts reichen oft zuerst.", "El fine-tuning adapta un modelo a una tarea; a menudo bastan buenos prompts."),
  },
  {
    question: t("Which is the safest way to try a new AI tool?", "Quelle est la façon la plus sûre d'essayer un nouvel outil IA ?", "Wie probierst du ein neues KI-Tool am sichersten aus?", "¿Cuál es la forma más segura de probar una nueva herramienta de IA?"),
    options: [
      t("Start with harmless sample data", "Commencer avec des données d'exemple sans risque", "Mit harmlosen Beispieldaten beginnen", "Empezar con datos de ejemplo inofensivos"),
      t("Upload your private files first", "Téléverser d'abord vos fichiers privés", "Zuerst private Dateien hochladen", "Subir primero tus archivos privados"),
      t("Enter your bank details", "Saisir vos coordonnées bancaires", "Deine Bankdaten eingeben", "Introducir tus datos bancarios"),
    ],
    answer: 0,
    why: t("Test with sample data until you trust how the tool handles it.", "Testez avec des données d'exemple jusqu'à avoir confiance.", "Teste mit Beispieldaten, bis du dem Umgang des Tools vertraust.", "Prueba con datos de ejemplo hasta confiar en cómo los maneja."),
  },
];
