'use client';

import { useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';

const STORAGE_KEY = 'desofec:theme';
const EVENT_NAME = 'desofec-theme-change';

const themes = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'sky', label: 'Sky' },
  { id: 'sunrise', label: 'Sunrise' },
  { id: 'mint', label: 'Mint' }
] as const;

type Theme = (typeof themes)[number]['id'];

function isTheme(value: string | undefined): value is Theme {
  return themes.some((theme) => theme.id === value);
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : 'dark';
}

export function ThemeToggle() {
  const tr = useTr();
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark' as Theme);

  function choose(value: string) {
    if (!isTheme(value)) return;
    if (value === 'dark') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
  }

  return (
    <select
      className="theme-select"
      aria-label={tr('Theme')}
      value={theme}
      onChange={(event) => choose(event.target.value)}
    >
      {themes.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {tr(entry.label)}
        </option>
      ))}
    </select>
  );
}
