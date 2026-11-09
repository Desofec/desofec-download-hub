'use client';

import { useRouter } from 'next/navigation';
import { setLanguage, useLanguage, useT } from '@/components/language';
import { isLanguageCode, languages, tutorialLanguageDestination } from '@/lib/i18n';

export function LanguageSwitcher() {
  const language = useLanguage();
  const t = useT();
  const router = useRouter();

  return (
    <select
      className="language-select"
      aria-label={t('nav.language')}
      value={language}
      onChange={(event) => {
        const selected = event.target.value;
        if (!isLanguageCode(selected)) return;
        const alternates = document.querySelectorAll<HTMLAnchorElement>(
          `.tutorial-language-links a[hreflang="${selected}"]`
        );
        const availablePaths = Array.from(alternates, (anchor) => new URL(anchor.href))
          .filter((url) => url.origin === window.location.origin)
          .map((url) => url.pathname);
        const targetPath = tutorialLanguageDestination(window.location.pathname, selected, availablePaths);
        setLanguage(selected);
        if (targetPath && targetPath !== window.location.pathname) {
          router.push(`${targetPath}${window.location.search}${window.location.hash}`, { scroll: false });
        }
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
