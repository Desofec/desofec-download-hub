'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import {
  defaultLanguage,
  dictionaries,
  isLanguageCode,
  languageFromPath,
  type LanguageCode,
  type TranslationKey
} from '@/lib/i18n';

const STORAGE_KEY = 'desofec:language';
const EVENT_NAME = 'desofec-language-change';
const RouteLanguageContext = createContext<LanguageCode | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readLanguage(): LanguageCode {
  const routeLanguage = languageFromPath(window.location.pathname);
  if (routeLanguage) return routeLanguage;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLanguageCode(saved) ? saved : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

export function setLanguage(code: LanguageCode) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
  refreshLanguageFromPath();
}

export function refreshLanguageFromPath() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useLanguage() {
  const routeLanguage = useContext(RouteLanguageContext);
  return useSyncExternalStore(
    subscribe,
    () => routeLanguage ?? readLanguage(),
    () => routeLanguage ?? defaultLanguage
  );
}

export function TutorialRouteLanguage({ language, children }: { language: LanguageCode; children: ReactNode }) {
  useEffect(() => {
    setLanguage(language);
  }, [language]);

  return <RouteLanguageContext.Provider value={language}>
    <div lang={language}>{children}</div>
  </RouteLanguageContext.Provider>;
}

export function useT() {
  const language = useLanguage();
  return useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => {
      let text: string = dictionaries[language][key] ?? dictionaries[defaultLanguage][key];
      for (const [name, value] of Object.entries(values ?? {})) text = text.replace(`{${name}}`, String(value));
      return text;
    },
    [language]
  );
}

// Keeps the <html lang> attribute in sync for screen readers and translation tools.
export function LanguageEffect({ children }: { children?: ReactNode }) {
  const language = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return <>{children}</>;
}
