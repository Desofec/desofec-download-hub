'use client';

import { useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';

const STORAGE_KEY = 'desofec:rainbow';
const EVENT_NAME = 'desofec-rainbow-change';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readRainbow() {
  return document.documentElement.dataset.rainbow === 'on';
}

export function RainbowSwitch() {
  const tr = useTr();
  const on = useSyncExternalStore(subscribe, readRainbow, () => false);

  function toggle() {
    const next = !on;
    if (next) document.documentElement.dataset.rainbow = 'on';
    else delete document.documentElement.dataset.rainbow;
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
  }

  return (
    <button
      className="rainbow-switch"
      type="button"
      aria-pressed={on}
      aria-label={tr('Rainbow')}
      title={tr('Rainbow')}
      onClick={toggle}
    >
      <span aria-hidden="true">🌈</span>
    </button>
  );
}
