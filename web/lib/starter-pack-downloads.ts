import type { LanguageCode } from '@/lib/i18n';

const localizedStarterPacks = new Set([
  'ai-content-services-kit',
  'ai-automation-services-kit',
  'ai-spreadsheets-kit'
]);

export function starterPackDownloadFile(packId: string, file: string, language: LanguageCode) {
  if (language === 'en' || !localizedStarterPacks.has(packId)) return file;
  return file.replace(/\.md$/, `-${language}.md`);
}
