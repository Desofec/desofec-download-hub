'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useProgressSync } from '@/components/progress-sync';
import { Tr, useTr } from '@/components/tr';

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
  const tr = useTr();
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
        localStorage.setItem(`desofec:activity:path:${pathId}`, String(Date.now()));
      } catch {}
      listeners.forEach((listener) => listener());
      window.dispatchEvent(new Event('desofec-progress-change'));
    },
    [key, pathId]
  );

  const sync = useProgressSync({
    type: 'path',
    id: pathId,
    stepsCount: steps.length,
    completed: done,
    ready,
    applyProgress: persist
  });
  const percent = Math.round((done.length / steps.length) * 100);
  const toggle = (index: number) =>
    persist(done.includes(index) ? done.filter((n) => n !== index) : [...done, index]);

  return (
    <div>
      <p className="path-progress" aria-live="polite">
        {ready ? tr('{done} of {total} steps done ({percent}%)', { done: done.length, total: steps.length, percent }) : ' '}
      </p>
      {sync.signedIn && (
        <p className="sync-status" role="status">
          {sync.status === 'syncing'
            ? tr('Syncing your progress…')
            : sync.status === 'error'
              ? tr('Progress sync failed. Your device copy is still saved.')
              : tr('Progress synced to your account.')}
        </p>
      )}
      <progress className="progress-bar" value={done.length} max={steps.length} aria-label={tr('Path progress')} />
      <div className="result-summary">
        {steps.map((step, index) => (
          <article className={`result-card${done.includes(index) ? ' step-done' : ''}`} key={step}>
            <h3>{tr('Step {number}', { number: index + 1 })}</h3>
            <p>{tr(step)}</p>
            <label className="step-check">
              <input
                type="checkbox"
                checked={done.includes(index)}
                disabled={!ready}
                onChange={() => toggle(index)}
              />{' '}
              <Tr>Mark as done</Tr>
            </label>
          </article>
        ))}
      </div>
      {ready && done.length > 0 && (
        <button type="button" className="btn btn-secondary" onClick={() => persist([])}>
          <Tr>Reset progress</Tr>
        </button>
      )}
    </div>
  );
}
