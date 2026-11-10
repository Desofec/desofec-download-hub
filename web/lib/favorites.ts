'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { favoriteIdsAfterToggle } from '@/lib/tool-identities';

const STORAGE_KEY = 'desofec:favorites:tools';
const EVENT_NAME = 'desofec-favorites-change';
export const FAVORITES_EVENT = EVENT_NAME;

export function readFavoriteIds() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) && saved.every((id) => typeof id === 'string')
      ? [...new Set(saved)].sort()
      : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

export function useFavoriteToolIds() {
  const getSnapshot = useCallback(() => JSON.stringify(readFavoriteIds()), []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '[]');
  try {
    return JSON.parse(snapshot) as string[];
  } catch {
    return [];
  }
}

export function updateFavoriteTool(toolId: string, favorite: boolean) {
  const next = favoriteIdsAfterToggle(readFavoriteIds(), toolId, favorite);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function replaceFavoriteTools(toolIds: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(toolIds)]));
  window.dispatchEvent(new Event(EVENT_NAME));
}
