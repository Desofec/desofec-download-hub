'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

const STORAGE_ERROR = 'storage-unavailable';

export function PackChecklist({ packId, steps }: { packId: string; steps: string[] }) {
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
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => '');
  const [fallbackSaved, setFallbackSaved] = useState<string | null>(null);
  const currentSaved = fallbackSaved ?? saved;
  const storageUnavailable = currentSaved === STORAGE_ERROR || fallbackSaved !== null;
  const completedSteps = currentSaved
    .split(',')
    .filter(Boolean)
    .map(Number)
    .filter((index) => Number.isInteger(index) && index >= 0 && index < steps.length);
  const checked = steps.map((_, index) => completedSteps.includes(index));
  const completed = checked.filter(Boolean).length;

  function saveProgress(indices: number[]) {
    const value = indices.join(',');
    try {
      window.localStorage.setItem(storageKey, value);
      setFallbackSaved(null);
      window.dispatchEvent(new Event(eventName));
    } catch {
      setFallbackSaved(value);
    }
  }

  function toggleStep(index: number, isChecked: boolean) {
    const indices = new Set(completedSteps);
    if (isChecked) indices.add(index);
    else indices.delete(index);
    saveProgress([...indices]);
  }

  function resetProgress() {
    try {
      window.localStorage.removeItem(storageKey);
      setFallbackSaved(null);
      window.dispatchEvent(new Event(eventName));
    } catch {
      setFallbackSaved('');
    }
  }

  return (
    <div className="pack-checklist">
      <div className="checklist-progress">
        <p>
          {completed} of {steps.length} steps complete
        </p>
        <progress value={completed} max={steps.length} aria-label="Checklist progress" />
      </div>
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
              <span className="step-text">{step}</span>
            </label>
          </li>
        ))}
      </ol>
      <div className="checklist-footer">
        {storageUnavailable && <p role="status">Progress cannot be saved in this browser right now.</p>}
        <button className="btn btn-secondary" type="button" onClick={resetProgress} disabled={completed === 0}>
          Reset checklist
        </button>
      </div>
    </div>
  );
}
