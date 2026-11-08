'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useLanguage, useT } from '@/components/language';
import { Tr, useTr } from '@/components/tr';
import { getTutorialTranslation } from '@/lib/tutorial-translations';
import { useProgressSync } from '@/components/progress-sync';
import type { TutorialStep } from '@/lib/task-tracker-tutorial';
import { LessonFeedback } from '@/components/lesson-feedback';

const EVENT_NAME = 'desofec-tutorial-change';
const STORAGE_ERROR = 'storage-unavailable';

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
    return STORAGE_ERROR;
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

export function TutorialSteps({
  steps: sourceSteps,
  storageKey,
  syncId,
  title,
  feedbackEnabled = true
}: {
  steps: TutorialStep[];
  storageKey: string;
  syncId: string;
  title: string;
  feedbackEnabled?: boolean;
}) {
  const t = useT();
  const tr = useTr();
  const language = useLanguage();
  const translation = getTutorialTranslation(syncId, language);
  const steps = useMemo(
    () =>
      sourceSteps.map((step) => {
        const text = translation?.steps[step.id];
        return text ? { ...step, ...text, code: text.code ?? step.code } : step;
      }),
    [sourceSteps, translation]
  );
  const raw = useSyncExternalStore(subscribe, () => readSaved(storageKey), () => null);
  const [fallbackRaw, setFallbackRaw] = useState<string | null>(null);
  const ready = raw !== null;
  const currentRaw = fallbackRaw ?? raw;
  const storageUnavailable = raw === STORAGE_ERROR || fallbackRaw !== null;

  const done = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(currentRaw ?? '[]');
      return Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === 'string' && steps.some((step) => step.id === id))
        : [];
    } catch {
      return [];
    }
  }, [currentRaw, steps]);

  const persist = useCallback((next: string[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      localStorage.setItem(`${storageKey}:activity`, String(Date.now()));
      setFallbackRaw(null);
    } catch {
      setFallbackRaw(JSON.stringify(next));
    }
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
  const completedTutorial = ready && steps.length > 0 && steps.every((step) => done.includes(step.id));

  return (
    <div>
      {language !== 'en' && (
        <p className="tutorial-lang-note">{translation ? t('tutorial.aiNote') : t('tutorial.englishNote')}</p>
      )}
      <p className="path-progress" aria-live="polite">
        {ready ? t('tutorial.stepsDone', { done: done.length, total: steps.length }) : ' '}
      </p>
      {sync.signedIn && (
        <p className="sync-status" role="status">
          {sync.status === 'syncing' ? t('tutorial.syncing') : sync.status === 'error' ? t('tutorial.syncError') : t('tutorial.synced')}
        </p>
      )}
      <progress className="progress-bar" value={done.length} max={steps.length} aria-label={tr('Tutorial progress')} />
      {storageUnavailable && <p role="status"><Tr>Progress cannot be saved in this browser right now.</Tr></p>}
      <ol className="tutorial-steps">
        {steps.map((step, index) => (
          <li className={`tutorial-step${done.includes(step.id) ? ' step-done' : ''}`} key={step.id}>
            <h2>
              <span className="first-app-step">{index + 1}</span> {step.title}
            </h2>
            {step.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {step.resources && step.resources.length > 0 && <p className="tutorial-resources">
              <strong><Tr>Official guidance</Tr>:</strong>{' '}
              {step.resources.map((resource, resourceIndex) => <span key={resource.url}>
                {resourceIndex > 0 ? ' · ' : ''}
                <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.label}</a>
              </span>)}
            </p>}
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
                <pre tabIndex={0}>
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
      {completedTutorial && (
        <section className="completion-certificate" aria-labelledby="completion-title">
          <div className="certificate-content">
            <span className="eyebrow"><Tr>Learning achievement</Tr></span>
            <h2 id="completion-title"><Tr>Tutorial completed</Tr></h2>
            <p className="certificate-tutorial-title">{translation?.title ?? title}</p>
            <p><Tr>You finished every step. Be proud of what you built.</Tr></p>
            <p><Tr>This certificate reflects steps you marked complete. It is not independently assessed or an accredited qualification.</Tr></p>
            <button type="button" className="btn btn-primary no-print" onClick={() => window.print()}>
              <Tr>Print or save certificate</Tr>
            </button>
          </div>
        </section>
      )}
      {feedbackEnabled && <LessonFeedback lessonId={syncId} />}
    </div>
  );
}
