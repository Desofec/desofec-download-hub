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
];
