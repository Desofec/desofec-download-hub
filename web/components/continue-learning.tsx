'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useAuth } from '@/components/auth-provider';
import type { LearningPath, StarterPack } from '@/lib/types';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useTr } from '@/components/tr';
import { useLanguage } from '@/components/language';
import { getTutorialTranslation } from '@/lib/tutorial-translations';

export type ContinueTutorial = { id: string; title: string; href: string; stepIds: string[]; storageKey: string };

type Props = {
  tutorials?: ContinueTutorial[];
  paths: LearningPath[];
  packs: StarterPack[];
  checklists: Record<string, string[]>;
};

type SavedProgress = {
  completed: number[];
  lastActivity: number;
};

type RemoteProgress = {
  item_type: 'path' | 'pack' | 'tutorial';
  item_id: string;
  completed_steps: number[];
  updated_at: string;
};

type Candidate = {
  key: string;
  kind: 'path' | 'pack' | 'tutorial';
  title: string;
  href: string;
  total: number;
  completed: number;
  lastActivity: number;
};

const EMPTY_REMOTE_ROWS: RemoteProgress[] = [];

function readProgress(
  paths: LearningPath[],
  packs: StarterPack[],
  checklists: Record<string, string[]>,
  tutorials: ContinueTutorial[]
) {
  const saved: Record<string, SavedProgress> = {};
  try {
    for (const tutorial of tutorials) {
      const done = JSON.parse(localStorage.getItem(tutorial.storageKey) ?? '[]');
      const timestamp = Number(localStorage.getItem(`${tutorial.storageKey}:activity`) ?? 0);
      const ids = Array.isArray(done) ? done.filter((id) => tutorial.stepIds.includes(id)) : [];
      saved[`tutorial:${tutorial.id}`] = {
        completed: [...new Set(ids.map((id) => tutorial.stepIds.indexOf(id)))],
        lastActivity: Number.isFinite(timestamp) ? timestamp : 0
      };
    }

    for (const path of paths) {
      const progressKey = `desofec:progress:${path.id}`;
      const completed = JSON.parse(localStorage.getItem(progressKey) ?? '[]');
      const timestamp = Number(localStorage.getItem(`desofec:activity:path:${path.id}`) ?? 0);
      saved[`path:${path.id}`] = {
        completed: Array.isArray(completed)
          ? completed.filter((index) => Number.isInteger(index) && index >= 0 && index < path.steps.length)
          : [],
        lastActivity: Number.isFinite(timestamp) ? timestamp : 0
      };
    }

    for (const pack of packs) {
      const completed = (localStorage.getItem(`desofec-pack-progress:${pack.id}`) ?? '')
        .split(',')
        .filter(Boolean)
        .map(Number);
      const timestamp = Number(localStorage.getItem(`desofec:activity:pack:${pack.id}`) ?? 0);
      const count = checklists[pack.id]?.length ?? 0;
      saved[`pack:${pack.id}`] = {
        completed: completed.filter((index) => Number.isInteger(index) && index >= 0 && index < count),
        lastActivity: Number.isFinite(timestamp) ? timestamp : 0
      };
    }
  } catch {
    return {};
  }
  return saved;
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

export function ContinueLearning({ paths, packs, checklists, tutorials = NO_TUTORIALS }: Props) {
  const tr = useTr();
  const language = useLanguage();
  const { session, ready: authReady } = useAuth();
  const userId = session?.user.id;
  const getSnapshot = useCallback(
    () => JSON.stringify(readProgress(paths, packs, checklists, tutorials)),
    [checklists, packs, paths, tutorials]
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const localProgress = useMemo(() => {
    try {
      return JSON.parse(snapshot ?? '{}') as Record<string, SavedProgress>;
    } catch {
      return {};
    }
  }, [snapshot]);
  const [remoteState, setRemoteState] = useState<{ ownerId: string; rows: RemoteProgress[] } | null>(null);

  useEffect(() => {
    if (!authReady || !userId) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;

    let active = true;
    client
      .from('user_progress')
      .select('item_type, item_id, completed_steps, updated_at')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (!active || error) return;
        const rows = (data ?? []).filter(
          (row): row is RemoteProgress =>
            (row.item_type === 'path' || row.item_type === 'pack' || row.item_type === 'tutorial') &&
            Array.isArray(row.completed_steps) &&
            typeof row.updated_at === 'string'
        );
        setRemoteState({ ownerId: userId, rows });
      }, () => {});

    return () => {
      active = false;
    };
  }, [authReady, userId]);

  const remoteRows = remoteState && remoteState.ownerId === userId ? remoteState.rows : EMPTY_REMOTE_ROWS;
  const candidates = useMemo(() => {
    const remoteByKey = new Map(remoteRows.map((row) => [`${row.item_type}:${row.item_id}`, row]));
    const all: Candidate[] = [
      ...paths.map((path) => ({
        key: `path:${path.id}`,
        kind: 'path' as const,
        title: path.title,
        href: `/paths/${encodeURIComponent(path.id)}`,
        total: path.steps.length
      })),
      ...packs.map((pack) => ({
        key: `pack:${pack.id}`,
        kind: 'pack' as const,
        title: pack.title,
        href: `/starter-packs/${encodeURIComponent(pack.id)}`,
        total: checklists[pack.id]?.length ?? 0
      })),
      ...tutorials.map((tutorial) => ({
        key: `tutorial:${tutorial.id}`,
        kind: 'tutorial' as const,
        title: tutorial.title,
        href: tutorial.href,
        total: tutorial.stepIds.length
      }))
    ].flatMap((item) => {
      const local = localProgress[item.key] ?? { completed: [], lastActivity: 0 };
      const remote = userId ? remoteByKey.get(item.key) : undefined;
      const remoteSteps = (remote?.completed_steps ?? []).filter(
        (index) => Number.isInteger(index) && index >= 0 && index < item.total
      );
      let completed = local.completed;
      if (remote) {
        const metaKey = `desofec:progress-sync:${userId}:${item.kind}:${item.key.slice(item.kind.length + 1)}`;
        let localSyncTime = 0;
        try {
          localSyncTime = Number(localStorage.getItem(metaKey) ?? 0);
        } catch {
          localSyncTime = 0;
        }
        const remoteTime = Date.parse(remote.updated_at);
        if (localSyncTime > remoteTime) {
          completed = local.completed;
        } else if (localSyncTime === 0) {
          completed = [...new Set([...local.completed, ...remoteSteps])];
        } else {
          completed = remoteSteps;
        }
      }

      const lastActivity = Math.max(
        local.lastActivity,
        remote ? Date.parse(remote.updated_at) || 0 : 0
      );
      if (completed.length === 0 || lastActivity === 0) return [];
      return [{ ...item, completed: Math.min(completed.length, item.total), lastActivity }];
    });

    // Unfinished work comes first; a finished item only appears when nothing else is in progress.
    return all.sort(
      (a, b) => Number(a.completed >= a.total) - Number(b.completed >= b.total) || b.lastActivity - a.lastActivity
    );
  }, [checklists, localProgress, packs, paths, remoteRows, tutorials, userId]);

  if (!authReady || snapshot === null) return null;

  const item = candidates[0];
  const finished = Boolean(item && item.completed >= item.total);
  const percent = item ? Math.round((item.completed / item.total) * 100) : 0;
  const itemTitle = item
    ? item.kind === 'tutorial'
      ? tr('Tutorial: {title}', { title: getTutorialTranslation(item.key.slice('tutorial:'.length), language)?.title ?? item.title })
      : tr(item.title)
    : '';

  return (
    <section className="section continue-section">
      <div className="container">
        <div className="continue-card">
          <div className="continue-copy">
            <span className="eyebrow">{finished ? tr('Completed') : item ? tr('Pick up where you left off') : tr('Your next step')}</span>
            <h2>{item ? itemTitle : tr('Ready to start learning?')}</h2>
            <p>
              {finished
                ? tr('You finished every step. Be proud of what you built.')
                : item
                ? tr('{done} of {total} steps complete · {percent}%', { done: item.completed, total: item.total, percent })
                : userId
                  ? tr('Choose a learning path or starter pack and your progress will sync to your account.')
                  : tr('Choose a learning path or starter pack. Your progress saves on this device.')}
            </p>
            {item && <progress value={item.completed} max={item.total} aria-label={tr('{title} progress', { title: itemTitle })} />}
            {!userId && !item && <Link href="/account">{tr('Sign in to sync progress across devices')}</Link>}
          </div>
          <div className="continue-action">
            <Link className="btn btn-primary" href={finished ? '/paths' : item?.href ?? '/paths'}>
              {finished ? tr('Explore learning paths') : item ? tr('Continue learning') : tr('Explore learning paths')}
            </Link>
            {finished && item && <Link className="text-link" href={item.href}>
                {tr('Review')}
              </Link>}
            {item && <Link className="text-link" href="/my-progress">
                {tr('View all progress')}
              </Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
