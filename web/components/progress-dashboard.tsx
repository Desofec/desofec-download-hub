'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useSyncExternalStore, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import type { ContinueTutorial } from '@/components/continue-learning';
import type { LearningPath, StarterPack } from '@/lib/types';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useTr } from '@/components/tr';
import { useLanguage } from '@/components/language';
import { TutorialLink } from '@/components/tutorial-link';
import { getTutorialTranslation } from '@/lib/tutorial-translations';

type Props = {
  tutorials?: ContinueTutorial[];
  paths: LearningPath[];
  packs: StarterPack[];
  checklists: Record<string, string[]>;
};

type ProgressRow = {
  item_type: 'path' | 'pack' | 'tutorial';
  item_id: string;
  completed_steps: number[];
  updated_at: string;
};

type ProgressItem = {
  id: string;
  title: string;
  kind: 'path' | 'pack' | 'tutorial';
  href: string;
  completed: number;
  total: number;
};

const EMPTY_PROGRESS: Record<string, ProgressRow> = {};

function readLocalProgress(
  paths: LearningPath[],
  packs: StarterPack[],
  checklists: Record<string, string[]>,
  tutorials: ContinueTutorial[]
) {
  const result: Record<string, number[]> = {};
  try {
    for (const tutorial of tutorials) {
      const saved = JSON.parse(localStorage.getItem(tutorial.storageKey) ?? '[]');
      result[`tutorial:${tutorial.id}`] = Array.isArray(saved)
        ? saved.map((id) => tutorial.stepIds.indexOf(id)).filter((index) => index >= 0)
        : [];
    }
    for (const path of paths) {
      const saved = JSON.parse(localStorage.getItem(`desofec:progress:${path.id}`) ?? '[]');
      result[`path:${path.id}`] = Array.isArray(saved)
        ? saved.filter((index) => Number.isInteger(index) && index >= 0 && index < path.steps.length)
        : [];
    }
    for (const pack of packs) {
      const saved = localStorage.getItem(`desofec-pack-progress:${pack.id}`) ?? '';
      const steps = checklists[pack.id] ?? [];
      result[`pack:${pack.id}`] = saved
        .split(',')
        .filter(Boolean)
        .map(Number)
        .filter((index) => Number.isInteger(index) && index >= 0 && index < steps.length);
    }
  } catch {
    return {};
  }
  return result;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('desofec-progress-change', callback);
  window.addEventListener('desofec-tutorial-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('desofec-progress-change', callback);
    window.removeEventListener('desofec-tutorial-change', callback);
  };
}

const NO_TUTORIALS: ContinueTutorial[] = [];

export function ProgressDashboard({ paths, packs, checklists, tutorials = NO_TUTORIALS }: Props) {
  const tr = useTr();
  const { session, ready: authReady } = useAuth();
  const userId = session?.user.id;
  const getSnapshot = useCallback(
    () => JSON.stringify(readLocalProgress(paths, packs, checklists, tutorials)),
    [checklists, packs, paths, tutorials]
  );
  const localSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => '{}');
  const localProgress = useMemo(() => {
    try {
      return JSON.parse(localSnapshot) as Record<string, number[]>;
    } catch {
      return {};
    }
  }, [localSnapshot]);
  const [remoteState, setRemoteState] = useState<{ ownerId: string; rows: Record<string, ProgressRow> } | null>(null);
  const [errorUserId, setErrorUserId] = useState<string | null>(null);
  const remoteProgress = remoteState && remoteState.ownerId === userId ? remoteState.rows : EMPTY_PROGRESS;
  const loadError = errorUserId === userId && Boolean(userId);

  useEffect(() => {
    if (!authReady || !userId) return;
    const client = getSupabaseBrowserClient();
    if (!client) {
      const timer = window.setTimeout(() => setErrorUserId(userId), 0);
      return () => window.clearTimeout(timer);
    }
    let active = true;
    client
      .from('user_progress')
      .select('item_type, item_id, completed_steps, updated_at')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setErrorUserId(userId);
          return;
        }
        const rows: Record<string, ProgressRow> = {};
        for (const row of data ?? []) {
          if (row.item_type !== 'path' && row.item_type !== 'pack' && row.item_type !== 'tutorial') continue;
          rows[`${row.item_type}:${row.item_id}`] = row as ProgressRow;
        }
        setRemoteState({ ownerId: userId, rows });
        setErrorUserId(null);
      }, () => {
        if (active) setErrorUserId(userId);
      });

    return () => {
      active = false;
    };
  }, [authReady, userId]);

  const items = useMemo<ProgressItem[]>(() => {
    const allItems: ProgressItem[] = [
      ...paths.map((path) => ({
        id: path.id,
        title: path.title,
        kind: 'path' as const,
        href: `/paths/${encodeURIComponent(path.id)}`,
        total: path.steps.length
      })),
      ...packs.map((pack) => ({
        id: pack.id,
        title: pack.title,
        kind: 'pack' as const,
        href: `/starter-packs/${encodeURIComponent(pack.id)}`,
        total: checklists[pack.id]?.length ?? 0
      })),
      ...tutorials.map((tutorial) => ({
        id: tutorial.id,
        title: tutorial.title,
        kind: 'tutorial' as const,
        href: tutorial.href,
        total: tutorial.stepIds.length
      }))
    ].map((item) => {
      const key = `${item.kind}:${item.id}`;
      const local = localProgress[key] ?? [];
      const remote = remoteProgress[key];
      let completed = local;
      if (userId && remote) {
        const metaKey = `desofec:progress-sync:${userId}:${item.kind}:${item.id}`;
        let localTimestamp = 0;
        try {
          localTimestamp = Number(localStorage.getItem(metaKey) ?? 0);
        } catch {
          localTimestamp = 0;
        }
        const remoteTimestamp = Date.parse(remote.updated_at);
        if (localTimestamp > 0 && localTimestamp >= remoteTimestamp) {
          completed = local;
        } else if (localTimestamp === 0) {
          completed = [...new Set([...local, ...remote.completed_steps])];
        } else {
          completed = remote.completed_steps;
        }
      }
      completed = [...new Set(completed)].filter((step) => Number.isInteger(step) && step >= 0 && step < item.total);
      return { ...item, completed: completed.length };
    });
    return allItems.sort((a, b) => {
      const aStarted = a.completed > 0 ? 1 : 0;
      const bStarted = b.completed > 0 ? 1 : 0;
      return bStarted - aStarted || a.title.localeCompare(b.title);
    });
  }, [checklists, localProgress, packs, paths, remoteProgress, tutorials, userId]);

  const inProgress = items.filter((item) => item.completed > 0 && item.completed < item.total);
  const completed = items.filter((item) => item.total > 0 && item.completed === item.total);
  const notStarted = items.filter((item) => item.completed === 0);

  if (!authReady) return <p role="status">{tr('Loading your progress…')}</p>;

  return (
    <div className="progress-dashboard">
      {userId ? (
        <p className="progress-account">
          {tr('Signed in as')} <strong>{session?.user.email}</strong>. {tr('Progress syncs across devices.')}
        </p>
      ) : (
        <p className="progress-account">
          {tr('Progress is saved on this device.')} <Link href="/account">{tr('Sign in')}</Link>{' '}
          {tr('to sync it across devices.')}
        </p>
      )}
      {loadError && <p className="progress-error" role="status">{tr('Could not load synced progress. Your device progress is still shown.')}</p>}
      {inProgress.length > 0 && <ProgressSection title={tr('In progress')} items={inProgress} />}
      {completed.length > 0 && <ProgressSection title={tr('Completed')} items={completed} />}
      {notStarted.length > 0 && <ProgressSection title={tr('Not started')} items={notStarted} />}
      <div className="cta-row">
        <Link className="btn btn-primary" href="/paths">
          {tr('Explore learning paths')}
        </Link>
        <Link className="btn btn-secondary" href="/starter-packs">
          {tr('Browse starter packs')}
        </Link>
      </div>
    </div>
  );
}

function ProgressSection({ title, items }: { title: string; items: ProgressItem[] }) {
  const tr = useTr();
  const language = useLanguage();
  return (
    <section className="progress-section">
      <div className="section-head"><h2>{title}</h2></div>
      <div className="progress-grid">
        {items.map((item) => {
          const percent = item.total ? Math.round((item.completed / item.total) * 100) : 0;
          const title =
            item.kind === 'tutorial' ? (getTutorialTranslation(item.id, language)?.title ?? item.title) : tr(item.title);
          return (
            <article className="progress-card" key={`${item.kind}:${item.id}`}>
              <span className="eyebrow">{item.kind === 'path' ? tr('Learning path') : item.kind === 'pack' ? tr('Starter pack') : tr('Tutorial')}</span>
              <h3>{title}</h3>
              <p>{tr('{done} of {total} steps · {percent}%', { done: item.completed, total: item.total, percent })}</p>
              <progress value={item.completed} max={item.total || 1} aria-label={tr('{title} progress', { title })} />
              <TutorialLink className="btn btn-secondary" href={item.href}>
                {item.completed === item.total && item.total > 0 ? tr('Review') : item.completed > 0 ? tr('Continue') : tr('Start')}
              </TutorialLink>
            </article>
          );
        })}
      </div>
    </section>
  );
}
