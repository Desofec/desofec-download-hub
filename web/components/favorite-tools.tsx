'use client';

import Link from 'next/link';
import { useFavoriteToolIds } from '@/lib/favorites';
import type { Tool } from '@/lib/types';
import { ToolCard } from '@/components/cards';

export function FavoriteTools({ tools }: { tools: Tool[] }) {
  const favoriteIds = useFavoriteToolIds();
  const favorites = tools.filter((tool) => favoriteIds.includes(tool.id));

  return (
    <section className="progress-section">
      <div className="section-head split-head">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h2>Favorite tools</h2>
        </div>
        <Link className="text-link" href="/tools">Explore all tools</Link>
      </div>
      {favorites.length ? (
        <div className="progress-grid">
          {favorites.map((tool) => <ToolCard key={tool.id} tool={tool} cta="none" />)}
        </div>
      ) : (
        <p className="empty-state">No favorites yet. Save a tool from the <Link href="/tools">tool library</Link> and it will appear here.</p>
      )}
    </section>
  );
}
