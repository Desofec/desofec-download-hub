'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { FAVORITES_EVENT, readFavoriteIds, replaceFavoriteTools } from '@/lib/favorites';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export function FavoritesSync() {
  const { session, ready } = useAuth();
  const userId = session?.user.id;

  useEffect(() => {
    if (!ready || !userId) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;

    let active = true;
    let known = new Set<string>();
    let loaded = false;

    const onChange = () => {
      if (!loaded) return;
      const current = new Set(readFavoriteIds());
      const added = [...current].filter((id) => !known.has(id));
      const removed = [...known].filter((id) => !current.has(id));
      known = current;
      if (added.length) {
        client
          .from('user_favorites')
          .upsert(added.map((tool_id) => ({ user_id: userId, tool_id })), { onConflict: 'user_id,tool_id' })
          .then(undefined, () => undefined);
      }
      if (removed.length) {
        client
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .in('tool_id', removed)
          .then(undefined, () => undefined);
      }
    };

    client
      .from('user_favorites')
      .select('tool_id')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (!active || error) return;
        const remote = new Set((data ?? []).map((row) => row.tool_id as string));
        const local = readFavoriteIds();
        const merged = new Set([...local, ...remote]);
        const missing = local.filter((id) => !remote.has(id));
        known = merged;
        loaded = true;
        if (merged.size !== local.length) replaceFavoriteTools([...merged]);
        if (missing.length) {
          client
            .from('user_favorites')
            .upsert(missing.map((tool_id) => ({ user_id: userId, tool_id })), { onConflict: 'user_id,tool_id' })
            .then(undefined, () => undefined);
        }
      }, () => undefined);

    window.addEventListener(FAVORITES_EVENT, onChange);
    return () => {
      active = false;
      window.removeEventListener(FAVORITES_EVENT, onChange);
    };
  }, [ready, userId]);

  return null;
}
