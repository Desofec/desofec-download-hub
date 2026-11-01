'use client';

import { setLanguage, useLanguage, useT } from '@/components/language';
import { isLanguageCode, languages } from '@/lib/i18n';

export function LanguageSwitcher() {
  const language = useLanguage();
  const t = useT();

  return (
    <select
      className="language-select"
      aria-label={t('nav.language')}
      value={language}
      onChange={(event) => {
        if (isLanguageCode(event.target.value)) setLanguage(event.target.value);
      }}
    >
      {languages.map((entry) => (
        <option key={entry.code} value={entry.code}>
          {entry.label}
        </option>
      ))}
    </select>
  );
}
