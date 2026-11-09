import type { LanguageCode } from '@/lib/i18n';
import { languages } from '@/lib/i18n';
import { publicPageMetadata } from '@/lib/public-page-metadata';
import { getTutorialTranslation } from '@/lib/tutorial-translations';
import { tutorials, type TutorialInfo } from '@/lib/tutorials';

export const localizedTutorialLanguages = ['fr', 'de', 'es'] as const;
export type LocalizedTutorialLanguage = (typeof localizedTutorialLanguages)[number];

// Open Graph requires language_TERRITORY even though hreflang targets language only.
const socialLocales: Record<LanguageCode, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
  es: 'es_ES'
};

const legacyTutorialPaths = new Set([
  '/projects/first-app/build',
  '/projects/coding-foundations/build',
  '/projects/ai-assisted-coding/build'
]);

export function isLocalizedTutorialLanguage(value: string): value is LocalizedTutorialLanguage {
  return localizedTutorialLanguages.some((language) => language === value);
}

function hasCompleteTranslation(tutorial: TutorialInfo, language: LocalizedTutorialLanguage) {
  const translation = getTutorialTranslation(tutorial.pathId, language);
  if (!translation?.title.trim() || !translation.intro.trim()) return false;

  return tutorial.steps.every((step) => {
    const translated = translation.steps[step.id];
    return Boolean(
      translated?.title.trim() &&
      translated.check.trim() &&
      translated.aiPrompt.trim() &&
      translated.explanation.length === step.explanation.length &&
      translated.explanation.every((paragraph) => paragraph.trim())
    );
  });
}

export function hasLocalizedTutorialPages(tutorial: TutorialInfo) {
  const supportedPath = (
    /^[a-z0-9-]+$/.test(tutorial.pathId) && tutorial.href === `/tutorials/${tutorial.pathId}`
  ) || legacyTutorialPaths.has(tutorial.href);
  return supportedPath && localizedTutorialLanguages.every((language) => hasCompleteTranslation(tutorial, language));
}

export const localizedTutorials = tutorials.filter(hasLocalizedTutorialPages);

export function requireTutorial(pathId: string) {
  const tutorial = tutorials.find((entry) => entry.pathId === pathId);
  if (!tutorial) throw new Error(`Missing tutorial: ${pathId}`);
  return tutorial;
}

export function localizedTutorialPath(tutorial: TutorialInfo, language: LanguageCode) {
  return language === 'en' ? tutorial.href : `/${language}${tutorial.href}`;
}

export function tutorialLanguageVersions(tutorial: TutorialInfo) {
  if (!hasLocalizedTutorialPages(tutorial)) return [];
  return languages.map(({ code, label }) => ({
    code,
    label,
    href: localizedTutorialPath(tutorial, code)
  }));
}

export function tutorialSocialLocales(tutorial: TutorialInfo, language: LanguageCode) {
  const versions = tutorialLanguageVersions(tutorial);
  if (versions.length === 0) return undefined;
  return {
    locale: socialLocales[language],
    alternateLocale: versions.filter(({ code }) => code !== language).map(({ code }) => socialLocales[code])
  };
}

export function tutorialAlternates(tutorial: TutorialInfo, language: LanguageCode) {
  const versions = tutorialLanguageVersions(tutorial);
  if (language !== 'en' && versions.length === 0) {
    throw new Error(`Missing localized tutorial: ${tutorial.pathId}`);
  }
  return {
    canonical: localizedTutorialPath(tutorial, language),
    ...(versions.length > 0 && {
      languages: {
        ...Object.fromEntries(versions.map(({ code, href }) => [code, href])),
        'x-default': tutorial.href
      }
    })
  };
}

export function localizedTutorialMetadata(tutorial: TutorialInfo, language: LocalizedTutorialLanguage) {
  const translation = getTutorialTranslation(tutorial.pathId, language);
  if (!translation || !hasLocalizedTutorialPages(tutorial)) {
    throw new Error(`Missing ${language} tutorial translation: ${tutorial.pathId}`);
  }
  const pathname = localizedTutorialPath(tutorial, language);
  return {
    ...publicPageMetadata(pathname, {
      title: translation.title,
      description: translation.intro,
      socialLocales: tutorialSocialLocales(tutorial, language)
    }),
    alternates: tutorialAlternates(tutorial, language)
  };
}
