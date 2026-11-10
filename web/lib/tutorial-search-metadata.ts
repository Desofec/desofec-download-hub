import type { LanguageCode } from '@/lib/i18n';

type SearchText = { title: string; description: string };

const overrides: Record<string, Partial<Record<LanguageCode, Partial<SearchText>>>> = {
  'content-creation': {
    en: { description: 'Practise a short post for a fictional bakery. Check facts, rights and accessibility in private; do not publish the exercise.' },
    fr: { description: 'Rédigez une publication pour une boulangerie fictive. Vérifiez faits, droits et accessibilité en privé, sans publier l’exercice.' },
    de: {
      title: 'Verantwortungsvollen KI-Beitrag erstellen',
      description: 'Übe einen Beitrag für eine fiktive Bäckerei. Prüfe Fakten, Rechte und Barrierefreiheit privat; veröffentliche die Übung nicht.'
    },
    es: { description: 'Practica una publicación para una panadería ficticia. Revisa datos, derechos y accesibilidad en privado; no publiques el ejercicio.' }
  },
  'ai-online-retail': {
    en: { description: 'Explore online retail with fictional data, checked costs and stock planning. No live store, payments or purchases.' },
    fr: { description: 'Explorez la vente en ligne avec des données fictives, coûts et stocks vérifiés, sans boutique, paiement ni achat réel.' },
    de: { description: 'Erkunde Onlinehandel mit fiktiven Daten, geprüften Kosten und Beständen. Kein echter Shop, keine Zahlungen oder Käufe.' },
    es: { description: 'Explora comercio en línea con datos ficticios, costes y existencias comprobados. Sin tienda, pagos ni compras reales.' }
  },
  'ai-marketplace-model': {
    en: { description: 'Practise seller onboarding, catalog review and commissions in a paper or spreadsheet prototype, not a live marketplace or payment system.' },
    fr: { description: 'Pratiquez vendeurs, catalogue et commissions sur papier ou tableur, sans marketplace ni système de paiement réel.' },
    de: { description: 'Übe Verkäufer-Onboarding, Katalog und Provisionen auf Papier oder in Tabellen, ohne echten Marktplatz oder Zahlungsverkehr.' },
    es: { description: 'Practica vendedores, catálogo y comisiones en papel u hoja de cálculo, sin mercado ni sistema de pagos activo.' }
  },
  'ai-logistics-services': {
    en: { description: 'Explore storage and fulfillment with fictional stock and costs. No goods, addresses or real shipments are processed.' },
    fr: { description: 'Explorez stockage et expéditions avec stocks et coûts fictifs, sans traiter de marchandises, d’adresses ni d’envois réels.' },
    de: { description: 'Erkunde Lagerung und Versand mit fiktiven Beständen und Kosten. Keine echten Waren, Adressen oder Sendungen werden verarbeitet.' },
    es: { description: 'Explora almacenamiento y envíos con existencias y costes ficticios. No se procesan bienes, direcciones ni envíos reales.' }
  },
  'search-visibility': {
    en: { description: 'Choose a canonical website address, check your sitemap and review indexing in Google Search Console and Bing Webmaster Tools.' },
    fr: { description: 'Choisissez une adresse canonique, vérifiez votre sitemap et consultez l’indexation dans Google Search Console et Bing Webmaster Tools.' },
    de: { description: 'Wähle eine kanonische Website-Adresse, prüfe die Sitemap und kontrolliere die Indexierung in Google Search Console und Bing Webmaster Tools.' },
    es: { description: 'Elige una dirección canónica, comprueba el sitemap y revisa la indexación en Google Search Console y Bing Webmaster Tools.' }
  },
  'ai-video-business': {
    en: { description: 'Plan three 15-30-second videos for a fictional bakery. Practise scripts, storyboards, captions and permissions privately; do not publish.' },
    fr: {
      title: 'Vidéos courtes pour entreprises avec l’IA',
      description: 'Planifiez trois vidéos de 15 à 30 secondes pour une boulangerie fictive : scripts, storyboards, sous-titres et autorisations, en privé, sans publication.'
    },
    de: { description: 'Plane privat drei 15- bis 30-sekündige Videos für eine fiktive Bäckerei. Prüfe Skripte, Storyboards, Untertitel und Rechte; nicht veröffentlichen.' },
    es: { description: 'Planifica tres vídeos de 15 a 30 segundos para una panadería ficticia: guiones, storyboards, subtítulos y permisos, en privado, sin publicar.' }
  },
  'ai-automation-services': {
    en: { description: 'Practise enquiry tracking, appointment reminders or reports with fictional data. No live sending or paid AI.' },
    fr: {
      title: 'Automatiser les flux d’une PME avec l’IA',
      description: 'Pratiquez demandes, rappels ou rapports avec des données fictives, sans envoi réel ni IA payante.'
    },
    de: {
      title: 'KI-Automatisierung für kleine Unternehmen',
      description: 'Übe Anfragen, Terminerinnerungen oder Berichte mit fiktiven Daten, ohne echten Versand oder kostenpflichtige KI.'
    },
    es: {
      title: 'Automatizar flujos con IA para pequeñas empresas',
      description: 'Practica consultas, recordatorios o informes con datos ficticios, sin envíos reales ni IA de pago.'
    }
  },
  'ai-small-business': {
    fr: { title: 'Créer du contenu professionnel avec l’IA' },
    de: { title: 'Geprüfte Unternehmensinhalte mit KI' },
    es: {
      title: 'Crear contenido para tu negocio con IA',
      description: 'Usa opiniones reales de clientes para redactar y verificar una descripción, preguntas frecuentes y una campaña breve, sin herramientas de pago.'
    }
  },
  'ai-video-creation': {
    fr: {
      title: 'Créer une vidéo responsable avec l’IA',
      description: 'Créez une vidéo de 30 secondes avec un brief, un storyboard et des contenus autorisés. La génération IA est facultative et peut nécessiter des crédits.'
    },
    de: { title: 'Ein verantwortungsvolles KI-Video erstellen' }
  },
  'first-app': {
    fr: { description: 'Créez un suivi de tâches pas à pas avec un compte Replit gratuit et un navigateur, sans expérience préalable.' },
    de: { description: 'Baue eine Aufgabenliste Schritt für Schritt mit einem kostenlosen Replit-Konto und Browser, ohne Vorkenntnisse.' },
    es: { description: 'Crea un gestor de tareas paso a paso con una cuenta gratuita de Replit y un navegador, sin experiencia previa.' }
  },
  'coding-foundations': {
    fr: { description: 'Apprenez les bases de Python, utilisez Git et créez un petit jeu en installant les outils pas à pas.' },
    de: { description: 'Lerne die Grundlagen von Python und Git, installiere die Werkzeuge und erstelle ein kleines Spiel.' },
    es: { description: 'Aprende los fundamentos de Python, usa Git y crea un pequeño juego instalando las herramientas paso a paso.' }
  },
  'ai-assisted-coding': {
    fr: { description: 'Écrivez, lisez, testez et améliorez une petite fonction Python avec Copilot ou Codex, en gardant le contrôle.' },
    de: { description: 'Schreibe, lies, teste und verbessere eine kleine Python-Funktion mit Copilot oder Codex und behalte die Kontrolle.' },
    es: { description: 'Escribe, lee, prueba y mejora una función pequeña de Python con Copilot o Codex, manteniendo el control.' }
  },
  'ai-beginner': {
    fr: { description: 'Découvrez les assistants IA, écrivez de bonnes requêtes et créez une routine avec un compte gratuit.' },
    de: { description: 'Lerne KI-Assistenten kennen, formuliere gute Prompts und erstelle eine Routine mit einem kostenlosen Konto.' },
    es: { description: 'Descubre los asistentes de IA, escribe buenos prompts y crea una rutina con una cuenta gratuita.' }
  },
  'ai-productivity': {
    fr: {
      title: 'Créer son système de productivité avec l’IA',
      description: 'Repérez les tâches où l’IA aide, créez des requêtes réutilisables et mesurez les résultats de vos routines hebdomadaires.'
    },
    de: { description: 'Finde Aufgaben für KI, erstelle wiederverwendbare Prompts und miss die Ergebnisse deiner wöchentlichen Routinen.' },
    es: { description: 'Identifica tareas para la IA, crea prompts reutilizables y mide los resultados de tus rutinas semanales.' }
  },
  'ai-content-services': {
    en: { description: 'Create three posts and four FAQ answers for a fictional bakery. Verify claims and plan an honest service offer.' },
    fr: {
      title: 'Préparer des contenus IA avec vérification',
      description: 'Créez trois publications et quatre réponses FAQ pour une boulangerie fictive. Vérifiez les affirmations et préparez une offre honnête.'
    },
    de: { description: 'Erstelle drei Beiträge und vier FAQ-Antworten für eine fiktive Bäckerei. Prüfe Aussagen und plane ein ehrliches Angebot.' },
    es: {
      title: 'Preparar servicios de contenido IA con revisión',
      description: 'Crea tres publicaciones y cuatro respuestas FAQ para una panadería ficticia. Verifica afirmaciones y prepara una oferta honesta.'
    }
  },
  'ai-cad-services': {
    en: { description: 'Design and review a non-functional display-card concept with consistent dimensions. No manufacturing or engineering approval.' },
    fr: {
      title: 'Préparer un service de concepts CAO avec IA',
      description: 'Créez un concept non fonctionnel de carte-présentoir aux dimensions cohérentes. Sans fabrication ni approbation d’ingénierie.'
    },
    de: { description: 'Erstelle ein nicht funktionsfähiges Displaykartenkonzept mit stimmigen Maßen. Keine Fertigung oder technische Freigabe.' },
    es: {
      title: 'Servicio de conceptos CAD con apoyo de IA',
      description: 'Crea un concepto no funcional de tarjeta expositora con medidas coherentes. Sin fabricación ni aprobación de ingeniería.'
    }
  },
  'micro-saas-validation': {
    en: {
      title: 'Validate a micro-SaaS idea before subscriptions',
      description: 'Gather problem evidence and test a local-only project-update formatter. No paid AI, billing or production launch required.'
    },
    fr: {
      title: 'Valider une idée de micro-SaaS',
      description: 'Recueillez des preuves et testez un outil local de mise en forme des mises à jour. Pas d’IA payante, de facturation ni de lancement en production.'
    },
    de: {
      title: 'Micro-SaaS-Idee vor Abonnements prüfen',
      description: 'Sammle Belege und teste einen lokalen Projektstatus-Formatierer. Keine kostenpflichtige KI, Abrechnung oder Produktionsfreigabe.'
    },
    es: {
      title: 'Validar una idea de micro-SaaS',
      description: 'Recopila evidencias y prueba un formateador local de actualizaciones. Sin IA de pago, facturación ni lanzamiento en producción.'
    }
  },
  'ai-education-services': {
    en: { description: 'Create a 15-minute claim-checking workshop with original materials. No accreditation or guaranteed learning outcome.' },
    fr: {
      title: 'Préparer un atelier IA pour adultes',
      description: 'Créez un atelier de 15 minutes pour vérifier des affirmations. Aucune accréditation ni aucun apprentissage garanti.'
    },
    de: {
      title: 'KI-Workshop für Erwachsene vorbereiten',
      description: 'Entwickle einen 15-minütigen Workshop zur Prüfung von Aussagen. Keine Akkreditierung und kein garantierter Lernerfolg.'
    },
    es: {
      title: 'Preparar un taller de IA para adultos',
      description: 'Diseña un taller de 15 minutos para verificar afirmaciones. Sin acreditación ni resultados de aprendizaje garantizados.'
    }
  },
  'design-basics': {
    fr: { title: 'Du croquis à la CAO et à l’IA : prototypage' },
    de: { title: 'Prototypen: von der Skizze zu CAD und KI' }
  },
  'ml-foundations': {
    fr: { title: 'Entraîner son premier modèle de machine learning' }
  },
  'web-starter': {
    de: { title: 'Erste Webseite erstellen und veröffentlichen' }
  },
  'looker-studio-guide': {
    en: { title: 'Looker Studio: reconciled report practice' }
  },
  'advanced-web-dev-ai': {
    en: { title: 'Build and ship a web app with AI assistance' }
  },
  'zoho-inventory-guide': {
    en: { description: 'Compare inventory tools using fictional stock and review shortages. A spreadsheet alternative avoids live inventory changes.' }
  },
  'freelance-client-discovery': {
    en: { description: 'Practise client discovery, evidence-backed scope and proposed changes with a fictional client. No live outreach or acceptance guarantees.' }
  },
  'ai-spreadsheets': {
    en: { description: 'Practise formulas, cleaning and PDF transcription with fictional orders in a private project. AI and paid tools are optional.' }
  },
  'origin-data-analysis': {
    en: { description: 'Practise plotting sensor and scanner data, assessing pump stability and mapping scans with safe sample data and AI prompts.' }
  },
  'auto-data-analysis': {
    en: { description: 'Use short scripts in a free Colab notebook to analyse sample pump logs and scanner maps, process files and check results with AI.' }
  }
};

export function tutorialSearchText(pathId: string, language: LanguageCode, source: SearchText): SearchText {
  const override = overrides[pathId]?.[language];
  return {
    title: override?.title ?? source.title,
    description: override?.description ?? source.description
  };
}
