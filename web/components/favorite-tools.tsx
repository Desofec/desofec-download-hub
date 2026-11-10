'use client';

import Link from 'next/link';
import { useFavoriteToolIds } from '@/lib/favorites';
import type { Tool } from '@/lib/types';
import { distinctTools, hasToolFavorite } from '@/lib/tool-identities';
import { ToolCard } from '@/components/cards';
import { Tr } from '@/components/tr';

export function FavoriteTools({ tools }: { tools: Tool[] }) {
  const favoriteIds = useFavoriteToolIds();
  const favorites = distinctTools(tools).filter((tool) => hasToolFavorite(favoriteIds, tool.id));

  return (
    <section className="progress-section">
      <div className="section-head split-head">
        <div>
          <span className="eyebrow"><Tr>Saved for later</Tr></span>
          <h2><Tr>Favorite tools</Tr></h2>
        </div>
        <Link className="text-link" href="/tools">
          <Tr>Explore all tools</Tr>
        </Link>
      </div>
      {favorites.length ? (
        <div className="progress-grid">
          {favorites.map((tool) => <ToolCard key={tool.id} tool={tool} cta="none" />)}
        </div>
      ) : (
        <p className="empty-state">
          <Tr>No favorites yet. Save a tool from the</Tr> <Link href="/tools"><Tr>tool library</Tr></Link>{' '}
          <Tr>and it will appear here.</Tr>
        </p>
      )}
    </section>
  );
}
