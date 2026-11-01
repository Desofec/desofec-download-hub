'use client';

import { useState } from 'react';
import { useFavoriteToolIds, updateFavoriteTool } from '@/lib/favorites';

export function FavoriteToolButton({ toolId }: { toolId: string }) {
  const favorites = useFavoriteToolIds();
  const isFavorite = favorites.includes(toolId);
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
        aria-label={isFavorite ? 'Remove from saved tools' : 'Save tool'}
        onClick={toggle}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        {isFavorite ? 'Saved' : 'Save tool'}
      </button>
      {storageError && <span className="favorite-error" role="status">Could not save this tool in this browser.</span>}
    </span>
  );
}
