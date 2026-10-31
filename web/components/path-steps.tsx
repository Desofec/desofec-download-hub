'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? '[]';
  } catch {
    return '[]';
  }
}

export function PathSteps({ pathId, steps }: { pathId: string; steps: string[] }) {
  const key = `desofec:progress:${pathId}`;
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
  const ready = raw !== null;

  const done = useMemo<number[]>(() => {
    try {
      const saved = JSON.parse(raw ?? '[]');
      return Array.isArray(saved)
        ? saved.filter((n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < steps.length)
        : [];
    } catch {
      return [];
    }
  }, [raw, steps.length]);

  const persist = useCallback(
    (next: number[]) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((listener) => listener());
    },
    [key]
  );

  const toggle = (index: number) =>
    persist(done.includes(index) ? done.filter((n) => n !== index) : [...done, index]);

  const percent = Math.round((done.length / steps.length) * 100);

  return (
    <div>
      <p className="path-progress" aria-live="polite">
        {ready ? `${done.length} of ${steps.length} steps done (${percent}%)` : ' '}
      </p>
      <progress className="progress-bar" value={done.length} max={steps.length} aria-label="Path progress" />
      <div className="result-summary">
        {steps.map((step, index) => (
          <article className={`result-card${done.includes(index) ? ' step-done' : ''}`} key={step}>
            <h3>Step {index + 1}</h3>
            <p>{step}</p>
            <label className="step-check">
              <input
                type="checkbox"
                checked={done.includes(index)}
                disabled={!ready}
                onChange={() => toggle(index)}
              />{' '}
              Mark as done
            </label>
          </article>
        ))}
      </div>
      {ready && done.length > 0 && (
        <button type="button" className="btn btn-secondary" onClick={() => persist([])}>
          Reset progress
        </button>
      )}
    </div>
  );
}
