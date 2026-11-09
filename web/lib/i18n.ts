export const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' }
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export const defaultLanguage: LanguageCode = 'en';

const en = {
  'nav.home': 'Home',
  'nav.start': 'Start here',
  'nav.tools': 'Tools',
  'nav.paths': 'Paths',
  'nav.tutorials': 'Tutorials',
  'nav.packs': 'Starter Packs',
  'nav.progress': 'My Progress',
  'nav.signin': 'Sign in',
  'nav.account': 'Account',
  'nav.cta': 'Start my path',
  'nav.language': 'Language',
  'footer.copy': '© 2026 Desofec AI Studio',
  'footer.tagline': 'Learn the right tools. Build with confidence.',
  'tutorial.stepsDone': '{done} of {total} steps done',
  'tutorial.markDone': 'Mark this step as done',
  'tutorial.check': 'Check it works:',
  'tutorial.stuck': 'Stuck? Ask an AI assistant',
  'tutorial.copyCode': 'Copy code',
  'tutorial.copyPrompt': 'Copy prompt',
  'tutorial.copied': 'Copied!',
  'tutorial.reset': 'Reset tutorial progress',
  'tutorial.replace': 'Replace everything in',
  'tutorial.replaceWith': 'with:',
  'tutorial.putIn': 'Put this in',
  'tutorial.syncing': "Syncing your progress…",
  'tutorial.syncError': "Progress sync failed. Your device copy is still saved.",
  'tutorial.synced': "Progress synced to your account.",
  'tutorial.backLab': "Back to the app lab",
  'tutorial.eyebrow': "Step-by-step tutorial · about {minutes} minutes",
  'tutorial.back': "Back to the path",
  'tutorial.aiNote': "Translated with AI help. Corrections are welcome.",
  'tutorial.englishNote': 'Tutorial lessons are currently available in English.'
};

export type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  'nav.home': 'Accueil',
  'nav.start': 'Commencer ici',
  'nav.tools': 'Outils',
  'nav.paths': 'Parcours',
  'nav.tutorials': 'Tutoriels',
  'nav.packs': 'Kits de démarrage',
  'nav.progress': 'Ma progression',
  'nav.signin': 'Se connecter',
  'nav.account': 'Compte',
  'nav.cta': 'Commencer mon parcours',
  'nav.language': 'Langue',
  'footer.copy': '© 2026 Desofec AI Studio',
  'footer.tagline': 'Choisissez les bons outils. Créez en toute confiance.',
  'tutorial.stepsDone': '{done} étapes sur {total} terminées',
  'tutorial.markDone': 'Marquer cette étape comme terminée',
  'tutorial.check': 'Vérifiez que ça marche :',
  'tutorial.stuck': 'Bloqué ? Demandez à un assistant IA',
  'tutorial.copyCode': 'Copier le code',
  'tutorial.copyPrompt': 'Copier la requête',
  'tutorial.copied': 'Copié !',
  'tutorial.reset': 'Réinitialiser la progression',
  'tutorial.replace': 'Remplacez tout le contenu de',
  'tutorial.replaceWith': 'par :',
  'tutorial.putIn': 'Placez ceci dans',
  'tutorial.syncing': "Synchronisation de votre progression…",
  'tutorial.syncError': "Échec de la synchronisation. Votre copie sur cet appareil est conservée.",
  'tutorial.synced': "Progression synchronisée avec votre compte.",
  'tutorial.backLab': "Retour au labo de l’application",
  'tutorial.eyebrow': "Tutoriel pas à pas · environ {minutes} minutes",
  'tutorial.back': "Retour au parcours",
  'tutorial.aiNote': "Traduit avec l’aide de l’IA. Les corrections sont les bienvenues.",
  'tutorial.englishNote': 'Les leçons des tutoriels sont pour le moment disponibles en anglais.'
};

const de: Record<TranslationKey, string> = {
  'nav.home': 'Startseite',
  'nav.start': 'Hier starten',
  'nav.tools': 'Tools',
  'nav.paths': 'Lernpfade',
  'nav.tutorials': 'Tutorials',
  'nav.packs': 'Starterpakete',
  'nav.progress': 'Mein Fortschritt',
  'nav.signin': 'Anmelden',
  'nav.account': 'Konto',
  'nav.cta': 'Meinen Pfad starten',
  'nav.language': 'Sprache',
  'footer.copy': '© 2026 Desofec AI Studio',
  'footer.tagline': 'Die richtigen Tools finden. Mit Zuversicht bauen.',
  'tutorial.stepsDone': '{done} von {total} Schritten erledigt',
  'tutorial.markDone': 'Diesen Schritt als erledigt markieren',
  'tutorial.check': 'Prüfen, ob es funktioniert:',
  'tutorial.stuck': 'Nicht weiter? Frag einen KI-Assistenten',
  'tutorial.copyCode': 'Code kopieren',
  'tutorial.copyPrompt': 'Prompt kopieren',
  'tutorial.copied': 'Kopiert!',
  'tutorial.reset': 'Fortschritt zurücksetzen',
  'tutorial.replace': 'Ersetze den gesamten Inhalt von',
  'tutorial.replaceWith': 'durch:',
  'tutorial.putIn': 'Füge dies ein in',
  'tutorial.syncing': "Dein Fortschritt wird synchronisiert …",
  'tutorial.syncError': "Synchronisierung fehlgeschlagen. Deine Kopie auf diesem Gerät bleibt gespeichert.",
  'tutorial.synced': "Fortschritt mit deinem Konto synchronisiert.",
  'tutorial.backLab': "Zurück zum App-Labor",
  'tutorial.eyebrow': "Schritt-für-Schritt-Tutorial · etwa {minutes} Minuten",
  'tutorial.back': "Zurück zum Lernpfad",
  'tutorial.aiNote': "Mit KI-Hilfe übersetzt. Korrekturen sind willkommen.",
  'tutorial.englishNote': 'Die Tutorial-Lektionen sind derzeit auf Englisch verfügbar.'
};

const es: Record<TranslationKey, string> = {
  'nav.home': 'Inicio',
  'nav.start': 'Empezar aquí',
  'nav.tools': 'Herramientas',
  'nav.paths': 'Rutas',
  'nav.tutorials': 'Tutoriales',
  'nav.packs': 'Kits de inicio',
  'nav.progress': 'Mi progreso',
  'nav.signin': 'Iniciar sesión',
  'nav.account': 'Cuenta',
  'nav.cta': 'Empezar mi ruta',
  'nav.language': 'Idioma',
  'footer.copy': '© 2026 Desofec AI Studio',
  'footer.tagline': 'Elige las herramientas correctas. Crea con confianza.',
  'tutorial.stepsDone': '{done} de {total} pasos completados',
  'tutorial.markDone': 'Marcar este paso como completado',
  'tutorial.check': 'Comprueba que funciona:',
  'tutorial.stuck': '¿Atascado? Pregunta a un asistente de IA',
  'tutorial.copyCode': 'Copiar código',
  'tutorial.copyPrompt': 'Copiar prompt',
  'tutorial.copied': '¡Copiado!',
  'tutorial.reset': 'Reiniciar progreso',
  'tutorial.replace': 'Reemplaza todo en',
  'tutorial.replaceWith': 'con:',
  'tutorial.putIn': 'Pon esto en',
  'tutorial.syncing': "Sincronizando tu progreso…",
  'tutorial.syncError': "Falló la sincronización. Tu copia en este dispositivo sigue guardada.",
  'tutorial.synced': "Progreso sincronizado con tu cuenta.",
  'tutorial.backLab': "Volver al laboratorio de la app",
  'tutorial.eyebrow': "Tutorial paso a paso · unos {minutes} minutos",
  'tutorial.back': "Volver a la ruta",
  'tutorial.aiNote': "Traducido con ayuda de IA. Las correcciones son bienvenidas.",
  'tutorial.englishNote': 'Las lecciones de los tutoriales están disponibles por ahora en inglés.'
};

export const dictionaries: Record<LanguageCode, Record<TranslationKey, string>> = { en, fr, de, es };

export function isLanguageCode(value: unknown): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function languageFromPath(pathname: string): LanguageCode | undefined {
  const prefix = pathname.split('/')[1];
  return prefix !== defaultLanguage && isLanguageCode(prefix) ? prefix : undefined;
}

export function withoutLanguagePrefix(pathname: string) {
  return languageFromPath(pathname) ? pathname.slice(3) || '/' : pathname;
}

export function tutorialLanguageDestination(
  pathname: string,
  language: LanguageCode,
  availablePaths: readonly string[]
) {
  const tutorialPath = withoutLanguagePrefix(pathname);
  const targetPath = language === defaultLanguage ? tutorialPath : `/${language}${tutorialPath}`;
  return availablePaths.includes(targetPath) ? targetPath : undefined;
}
