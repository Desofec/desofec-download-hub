'use client';

import { useMemo, useState } from 'react';
import { ToolCard } from '@/components/cards';
import type { Tool } from '@/lib/types';

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(tools.map((tool) => tool.category))], [tools]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tools.filter(
      (tool) =>
        (category === 'All' || tool.category === category) &&
        (!needle || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(needle))
    );
  }, [tools, query, category]);

  return (
    <>
      <div className="tool-filters">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools"
          aria-label="Search tools"
        />
        <div className="filter-chips" role="group" aria-label="Filter by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className={name === category ? 'chip active' : 'chip'}
              aria-pressed={name === category}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      {visible.length ? (
        <div className="tool-directory">
          {visible.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No tools match your search. Try another keyword or category.</p>
      )}
    </>
  );
}
