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
];
