'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useT } from '@/components/language';
import { useProgressSync } from '@/components/progress-sync';
import type { TutorialStep } from '@/lib/task-tracker-tutorial';

const EVENT_NAME = 'desofec-tutorial-change';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readSaved(storageKey: string) {
  try {
    return localStorage.getItem(storageKey) ?? '[]';
  } catch {
    return '[]';
  }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => setCopied(false)
    );
  };

  return (
    <button type="button" className="btn btn-secondary tutorial-copy" onClick={copy}>
      {copied ? t('tutorial.copied') : label}
    </button>
  );
}

export function TutorialSteps({ steps, storageKey, syncId }: { steps: TutorialStep[]; storageKey: string; syncId: string }) {
  const t = useT();
  const raw = useSyncExternalStore(subscribe, () => readSaved(storageKey), () => null);
  const ready = raw !== null;

  const done = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(raw ?? '[]');
      return Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === 'string' && steps.some((step) => step.id === id))
        : [];
    } catch {
      return [];
    }
  }, [raw, steps]);

  const persist = useCallback((next: string[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      localStorage.setItem(`${storageKey}:activity`, String(Date.now()));
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
  }, [storageKey]);

  const completedIndices = useMemo(
    () => done.map((id) => steps.findIndex((step) => step.id === id)).filter((index) => index >= 0),
    [done, steps]
  );
  const applyProgress = useCallback(
    (indices: number[]) => persist(indices.flatMap((index) => steps[index]?.id ?? [])),
    [persist, steps]
  );
  const sync = useProgressSync({
    type: 'tutorial',
    id: syncId,
    stepsCount: steps.length,
    completed: completedIndices,
    ready,
    applyProgress
  });

  const toggle = (id: string) => persist(done.includes(id) ? done.filter((entry) => entry !== id) : [...done, id]);

  return (
    <div>
      <p className="tutorial-lang-note">{t('tutorial.englishNote')}</p>
      <p className="path-progress" aria-live="polite">
        {ready ? t('tutorial.stepsDone', { done: done.length, total: steps.length }) : ' '}
      </p>
      {sync.signedIn && (
        <p className="sync-status" role="status">
          {sync.status === 'syncing' ? t('tutorial.syncing') : sync.status === 'error' ? t('tutorial.syncError') : t('tutorial.synced')}
        </p>
      )}
      <progress className="progress-bar" value={done.length} max={steps.length} aria-label="Tutorial progress" />
      <ol className="tutorial-steps">
        {steps.map((step, index) => (
          <li className={`tutorial-step${done.includes(step.id) ? ' step-done' : ''}`} key={step.id}>
            <h2>
              <span className="first-app-step">{index + 1}</span> {step.title}
            </h2>
            {step.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {step.code && (
              <div className="tutorial-code">
                <div className="tutorial-code-head">
                  <span>
                    {step.replaceAll ? `${t('tutorial.replace')} ` : `${t('tutorial.putIn')} `}
                    <code>{step.file}</code>
                    {step.replaceAll ? ` ${t('tutorial.replaceWith')}` : ':'}
                  </span>
                  <CopyButton text={step.code} label={t('tutorial.copyCode')} />
                </div>
                <pre>
                  <code>{step.code}</code>
                </pre>
              </div>
            )}
            <p className="tutorial-check">
              <strong>{t('tutorial.check')}</strong> {step.check}
            </p>
            <details className="tutorial-ai">
              <summary>{t('tutorial.stuck')}</summary>
              <p>{step.aiPrompt}</p>
              <CopyButton text={step.aiPrompt} label={t('tutorial.copyPrompt')} />
            </details>
            <label className="step-check">
              <input type="checkbox" checked={done.includes(step.id)} disabled={!ready} onChange={() => toggle(step.id)} />{' '}
              {t('tutorial.markDone')}
            </label>
          </li>
        ))}
      </ol>
      {ready && done.length > 0 && (
        <button type="button" className="btn btn-secondary" onClick={() => persist([])}>
          {t('tutorial.reset')}
        </button>
      )}
    </div>
  );
}
