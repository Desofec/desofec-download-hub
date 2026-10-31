'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ToolCard } from '@/components/cards';
import type { Tool } from '@/lib/types';

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = useMemo(() => ['All', ...new Set(tools.map((tool) => tool.category))], [tools]);
  const skills = useMemo(() => ['All', ...new Set(tools.map((tool) => tool.skill))], [tools]);

  const requestedCategory = searchParams.get('category') ?? 'All';
  const requestedSkill = searchParams.get('skill') ?? 'All';
  const category = categories.includes(requestedCategory) ? requestedCategory : 'All';
  const skill = skills.includes(requestedSkill) ? requestedSkill : 'All';
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  function updateUrl(next: { q?: string; category?: string; skill?: string }) {
    const values = { q: query, category, skill, ...next };
    const params = new URLSearchParams();
    if (values.q.trim()) params.set('q', values.q.trim());
    if (values.category !== 'All') params.set('category', values.category);
    if (values.skill !== 'All') params.set('skill', values.skill);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setQuery('');
    router.replace(pathname, { scroll: false });
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tools.filter(
      (tool) =>
        (category === 'All' || tool.category === category) &&
        (skill === 'All' || tool.skill === skill) &&
        (!needle || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(needle))
    );
  }, [tools, query, category, skill]);

  const filtersActive = Boolean(query.trim()) || category !== 'All' || skill !== 'All';

  return (
    <>
      <div className="tool-filters">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            updateUrl({ q: event.target.value });
          }}
          placeholder="Search tools"
          aria-label="Search tools"
        />
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="filter-chips" role="group" aria-label="Filter by category">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                className={name === category ? 'chip active' : 'chip'}
                aria-pressed={name === category}
                onClick={() => updateUrl({ category: name })}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Skill level</span>
          <div className="filter-chips" role="group" aria-label="Filter by skill level">
            {skills.map((name) => (
              <button
                key={name}
                type="button"
                className={name === skill ? 'chip active' : 'chip'}
                aria-pressed={name === skill}
                onClick={() => updateUrl({ skill: name })}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-summary">
          <p role="status">
            Showing {visible.length} of {tools.length} tools
          </p>
          {filtersActive && (
            <button className="chip" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>
      {visible.length ? (
        <div className="tool-directory">
          {visible.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No tools match your filters. Try another keyword or clear the filters.</p>
      )}
    </>
  );
}
