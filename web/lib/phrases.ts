import type { LanguageCode } from '@/lib/i18n';
import catalogFr from '@/content/translations/catalog-fr.json';
import catalogDe from '@/content/translations/catalog-de.json';
import catalogEs from '@/content/translations/catalog-es.json';
import uiFr from '@/content/translations/ui-fr.json';
import uiDe from '@/content/translations/ui-de.json';
import uiEs from '@/content/translations/ui-es.json';

// Phrase books are keyed by the English text itself, so components only wrap their existing English strings.
const books: Record<Exclude<LanguageCode, 'en'>, Record<string, string>> = {
  fr: { ...catalogFr, ...uiFr },
  de: { ...catalogDe, ...uiDe },
  es: { ...catalogEs, ...uiEs }
};

export function translatePhrase(text: string, language: LanguageCode, values?: Record<string, string | number>) {
  let result = language === 'en' ? text : (books[language][text] ?? text);
  for (const [name, value] of Object.entries(values ?? {})) result = result.replaceAll(`{${name}}`, String(value));
  return result;
}
