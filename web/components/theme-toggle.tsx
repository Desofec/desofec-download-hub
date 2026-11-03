'use client';

import { useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';

const STORAGE_KEY = 'desofec:theme';
const EVENT_NAME = 'desofec-theme-change';

type Theme = 'dark' | 'light';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function ThemeToggle() {
  const tr = useTr();
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={tr(next === 'light' ? 'Switch to light theme' : 'Switch to dark theme')}
      title={tr(next === 'light' ? 'Switch to light theme' : 'Switch to dark theme')}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
