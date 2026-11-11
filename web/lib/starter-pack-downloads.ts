import type { LanguageCode } from '@/lib/i18n';

const localizedStarterPacks = new Set([
  'ai-content-services-kit',
  'ai-automation-services-kit',
  'ai-spreadsheets-kit',
  'ai-commerce-services-kit',
  'ai-video-business-kit',
  'ai-video-creation-kit',
  'content-creator-kit',
  'ai-cad-services-kit',
  'micro-saas-validation-kit',
  'ai-education-services-kit',
  'ai-privacy-fact-checking-kit',
  'ai-multilingual-work-kit'
]);

export function hasLocalizedStarterPack(packId: string) {
  return localizedStarterPacks.has(packId);
}

export function starterPackDownloadFile(packId: string, file: string, language: LanguageCode) {
  if (language === 'en' || !localizedStarterPacks.has(packId)) return file;
  return file.replace(/\.md$/, `-${language}.md`);
}
