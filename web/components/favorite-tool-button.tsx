'use client';

import { useState } from 'react';
import { useFavoriteToolIds, updateFavoriteTool } from '@/lib/favorites';
import { hasToolFavorite } from '@/lib/tool-identities';
import { useTr } from '@/components/tr';

export function FavoriteToolButton({ toolId }: { toolId: string }) {
  const tr = useTr();
  const favorites = useFavoriteToolIds();
  const isFavorite = hasToolFavorite(favorites, toolId);
  const [storageError, setStorageError] = useState(false);

  function toggle() {
    try {
      updateFavoriteTool(toolId, !isFavorite);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  return (
    <span className="favorite-control">
      <button
        className={`btn btn-favorite${isFavorite ? ' is-favorite' : ''}`}
        type="button"
        aria-pressed={isFavorite}
        aria-label={isFavorite ? tr('Remove from saved tools') : tr('Save tool')}
        onClick={toggle}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        {isFavorite ? tr('Saved') : tr('Save tool')}
      </button>
      {storageError && <span className="favorite-error" role="status">{tr('Could not save this tool in this browser.')}</span>}
    </span>
  );
}
