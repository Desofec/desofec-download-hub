import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'desofec:break';
const EVENT_NAME = 'desofec-break-change';

export const breakMinuteOptions = [25, 45, 60] as const;
export type BreakMinutes = (typeof breakMinuteOptions)[number];
export type BreakSettings = { enabled: boolean; minutes: BreakMinutes };

const defaults: BreakSettings = { enabled: true, minutes: 45 };

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

// The raw string is the snapshot so React sees a stable primitive value.
function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function parse(raw: string): BreakSettings {
  try {
    const value = JSON.parse(raw) as Partial<BreakSettings>;
    const minutes = breakMinuteOptions.find((option) => option === value.minutes) ?? defaults.minutes;
    return { enabled: value.enabled !== false, minutes };
  } catch {
    return defaults;
  }
}

export function useBreakSettings(): BreakSettings {
  return parse(useSyncExternalStore(subscribe, readRaw, () => ''));
}

export function saveBreakSettings(settings: BreakSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
  window.dispatchEvent(new Event(EVENT_NAME));
}
