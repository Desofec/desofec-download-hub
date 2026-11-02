'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { useProgressSync } from '@/components/progress-sync';
import { useTr } from '@/components/tr';

const STORAGE_ERROR = 'storage-unavailable';

export function PackChecklist({ packId, steps }: { packId: string; steps: string[] }) {
  const tr = useTr();
  const storageKey = `desofec-pack-progress:${packId}`;
  const eventName = `desofec-pack-progress:${packId}`;
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      window.addEventListener(eventName, callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(eventName, callback);
      };
    },
    [eventName]
  );
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? '';
    } catch {
      return STORAGE_ERROR;
    }
  }, [storageKey]);
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const [fallbackSaved, setFallbackSaved] = useState<string | null>(null);
  const ready = saved !== null;
  const currentSaved = fallbackSaved ?? saved ?? '';
  const storageUnavailable = currentSaved === STORAGE_ERROR || fallbackSaved !== null;
  const completedSteps = currentSaved
    .split(',')
    .filter(Boolean)
    .map(Number)
    .filter((index) => Number.isInteger(index) && index >= 0 && index < steps.length);
  const checked = steps.map((_, index) => completedSteps.includes(index));
  const completed = checked.filter(Boolean).length;

  const saveProgress = useCallback((indices: number[]) => {
    const value = indices.join(',');
    try {
      window.localStorage.setItem(storageKey, value);
      window.localStorage.setItem(`desofec:activity:pack:${packId}`, String(Date.now()));
      setFallbackSaved(null);
      window.dispatchEvent(new Event(eventName));
      window.dispatchEvent(new Event('desofec-progress-change'));
    } catch {
      setFallbackSaved(value);
    }
  }, [eventName, packId, storageKey]);

  const sync = useProgressSync({
    type: 'pack',
    id: packId,
    stepsCount: steps.length,
    completed: completedSteps,
    ready,
    applyProgress: saveProgress
  });

  const toggleStep = (index: number, isChecked: boolean) => {
    const indices = new Set(completedSteps);
    if (isChecked) indices.add(index);
    else indices.delete(index);
    saveProgress([...indices]);
  };

  const resetProgress = () => saveProgress([]);

  return (
    <div className="pack-checklist">
      <div className="checklist-progress">
        <p>
          {tr('{done} of {total} steps complete', { done: completed, total: steps.length })}
        </p>
        <progress value={completed} max={steps.length} aria-label={tr('Checklist progress')} />
      </div>
      {sync.signedIn && (
        <p className="sync-status" role="status">
          {sync.status === 'syncing'
            ? tr('Syncing your progress…')
            : sync.status === 'error'
              ? tr('Progress sync failed. Your device copy is still saved.')
              : tr('Progress synced to your account.')}
        </p>
      )}
      <ol className="checklist-steps">
        {steps.map((step, index) => (
          <li key={step}>
            <label>
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={(event) => toggleStep(index, event.target.checked)}
              />
              <span className="step-marker" aria-hidden="true" />
              <span className="step-text">{tr(step)}</span>
            </label>
          </li>
        ))}
      </ol>
      <div className="checklist-footer">
        {storageUnavailable && <p role="status">{tr('Progress cannot be saved in this browser right now.')}</p>}
        <button className="btn btn-secondary" type="button" onClick={resetProgress} disabled={completed === 0}>
          {tr('Reset checklist')}
        </button>
      </div>
    </div>
  );
}
