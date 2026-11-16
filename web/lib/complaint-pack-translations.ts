import type { LanguageCode } from '@/lib/i18n';
import fr from '@/content/translations/complaint-pack-fr.json';
import de from '@/content/translations/complaint-pack-de.json';
import es from '@/content/translations/complaint-pack-es.json';

const books: Record<Exclude<LanguageCode, 'en'>, Record<string, string>> = { fr, de, es };

export function translateComplaintPack(text: string, language: LanguageCode, values?: Record<string, string | number>): string {
  let result = language === 'en' ? text : books[language][text] ?? text;
  for (const [name, value] of Object.entries(values ?? {})) {
    result = result.replaceAll(`{${name}}`, String(value));
  }
  return result;
}
