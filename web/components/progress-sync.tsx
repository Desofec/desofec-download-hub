'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

type ProgressType = 'path' | 'pack' | 'tutorial';
type SyncStatus = 'device' | 'syncing' | 'synced' | 'error';

export function useProgressSync({
  type,
  id,
  stepsCount,
  completed,
  ready,
  applyProgress
}: {
  type: ProgressType;
  id: string;
  stepsCount: number;
  completed: number[];
  ready: boolean;
  applyProgress: (indices: number[]) => void;
}) {
  const { session, ready: authReady } = useAuth();
  const userId = session?.user.id;
  const [status, setStatus] = useState<SyncStatus>('device');
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const loadingKey = useRef<string | null>(null);
  const value = useMemo(() => [...new Set(completed)].sort((a, b) => a - b).join(','), [completed]);
  const currentCompleted = useMemo(() => (value ? value.split(',').map(Number) : []), [value]);
  const progressRef = useRef({ completed: currentCompleted, applyProgress });
  const storageKey = type === 'path' ? `desofec:progress:${id}` : `desofec-pack-progress:${id}`;
  // Tutorials store step ids, so their component writes the local copy through applyProgress.
  const writesLocalCopy = type !== 'tutorial';
  const metadataKey = userId ? `desofec:progress-sync:${userId}:${type}:${id}` : '';
  const syncKey = userId ? `${userId}:${type}:${id}` : '';

  useEffect(() => {
    progressRef.current = { completed: currentCompleted, applyProgress };
  }, [applyProgress, currentCompleted]);

  useEffect(() => {
    if (!authReady || !ready) return;
    if (!userId) {
      loadingKey.current = null;
      return;
    }

    loadingKey.current = syncKey;
    const client = getSupabaseBrowserClient();
    if (!client) {
      const timer = window.setTimeout(() => setStatus('error'), 0);
      return () => window.clearTimeout(timer);
    }

    let active = true;
    client
      .from('user_progress')
      .select('completed_steps, updated_at')
      .eq('user_id', userId)
      .eq('item_type', type)
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setStatus('error');
          return;
        }

        const valid = (indices: number[]) =>
          [...new Set(indices)].filter((index) => Number.isInteger(index) && index >= 0 && index < stepsCount);
        const local = valid(progressRef.current.completed);
        const remote = valid(data?.completed_steps ?? []);
        let next = local;
        let syncedAt = new Date().toISOString();
        let shouldApply = false;

        if (data && metadataKey) {
          let localTimestamp = 0;
          try {
            localTimestamp = Number(localStorage.getItem(metadataKey) ?? 0);
          } catch {
            setStatus('error');
            return;
          }
          const remoteTimestamp = Date.parse(data.updated_at);
          if (localTimestamp > 0 && remoteTimestamp > localTimestamp) {
            next = remote;
            syncedAt = data.updated_at;
            shouldApply = true;
          } else if (!localTimestamp) {
            next = valid([...local, ...remote]);
            shouldApply = true;
          }
        } else if (data) {
          next = valid([...local, ...remote]);
          shouldApply = true;
        }

        if (shouldApply) {
          try {
            if (writesLocalCopy) localStorage.setItem(storageKey, type === 'path' ? JSON.stringify(next) : next.join(','));
            localStorage.setItem(metadataKey, String(Date.parse(syncedAt)));
          } catch {
            setStatus('error');
            return;
          }
          progressRef.current.applyProgress(next);
        } else if (metadataKey) {
          try {
            localStorage.setItem(metadataKey, String(Date.parse(syncedAt)));
          } catch {
            setStatus('error');
            return;
          }
        }

        loadingKey.current = null;
        setLoadedForUserId(userId);
        setStatus('synced');
      }, () => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [authReady, id, metadataKey, ready, stepsCount, storageKey, syncKey, type, userId, writesLocalCopy]);

  useEffect(() => {
    if (loadedForUserId !== userId || !userId || !metadataKey || loadingKey.current === syncKey) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;

    const timeout = window.setTimeout(async () => {
      const updatedAt = new Date().toISOString();
      const indices = value ? value.split(',').map(Number) : [];
      setStatus('syncing');
      try {
        const { error } = await client.from('user_progress').upsert(
          {
            user_id: userId,
            item_type: type,
            item_id: id,
            completed_steps: indices,
            updated_at: updatedAt
          },
          { onConflict: 'user_id,item_type,item_id' }
        );
        if (error) {
          setStatus('error');
          return;
        }
        localStorage.setItem(metadataKey, String(Date.parse(updatedAt)));
        setStatus('synced');
      } catch {
        setStatus('error');
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [id, loadedForUserId, metadataKey, syncKey, type, userId, value]);

  const visibleStatus = userId && status === 'device' ? 'syncing' : status;
  return { status: visibleStatus, signedIn: Boolean(userId) };
}
