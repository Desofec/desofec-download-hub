'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
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
      {copied ? 'Copied!' : label}
    </button>
  );
}

export function TutorialSteps({ steps, storageKey }: { steps: TutorialStep[]; storageKey: string }) {
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
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
  }, [storageKey]);

  const toggle = (id: string) => persist(done.includes(id) ? done.filter((entry) => entry !== id) : [...done, id]);

  return (
    <div>
      <p className="path-progress" aria-live="polite">
        {ready ? `${done.length} of ${steps.length} steps done` : ' '}
      </p>
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
                    {step.replaceAll ? 'Replace everything in ' : 'Put this in '}
                    <code>{step.file}</code>
                    {step.replaceAll ? ' with:' : ':'}
                  </span>
                  <CopyButton text={step.code} label="Copy code" />
                </div>
                <pre>
                  <code>{step.code}</code>
                </pre>
              </div>
            )}
            <p className="tutorial-check">
              <strong>Check it works:</strong> {step.check}
            </p>
            <details className="tutorial-ai">
              <summary>Stuck? Ask an AI assistant</summary>
              <p>{step.aiPrompt}</p>
              <CopyButton text={step.aiPrompt} label="Copy prompt" />
            </details>
            <label className="step-check">
              <input type="checkbox" checked={done.includes(step.id)} disabled={!ready} onChange={() => toggle(step.id)} />{' '}
              Mark this step as done
            </label>
          </li>
        ))}
      </ol>
      {ready && done.length > 0 && (
        <button type="button" className="btn btn-secondary" onClick={() => persist([])}>
          Reset tutorial progress
        </button>
      )}
    </div>
  );
}
