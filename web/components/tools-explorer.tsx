'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ToolCard } from '@/components/cards';
import type { Tool } from '@/lib/types';
import { Tr, useTr } from '@/components/tr';

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const tr = useTr();
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

  const comparedIds = useMemo(() => {
    const ids = searchParams.get('compare')?.split(',') ?? [];
    return [...new Set(ids)].filter((id) => tools.some((tool) => tool.id === id)).slice(0, 3);
  }, [searchParams, tools]);

  function updateUrl(next: { q?: string; category?: string; skill?: string; compare?: string[] }) {
    const values = { q: query, category, skill, compare: comparedIds, ...next };
    const params = new URLSearchParams();
    if (values.q.trim()) params.set('q', values.q.trim());
    if (values.category !== 'All') params.set('category', values.category);
    if (values.skill !== 'All') params.set('skill', values.skill);
    if (values.compare.length) params.set('compare', values.compare.join(','));
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setQuery('');
    updateUrl({ q: '', category: 'All', skill: 'All' });
  }

  function toggleComparison(toolId: string) {
    const next = comparedIds.includes(toolId)
      ? comparedIds.filter((id) => id !== toolId)
      : [...comparedIds, toolId];
    if (next.length > 3) return;
    updateUrl({ compare: next });
  }

  const comparedTools = comparedIds.flatMap((id) => {
    const tool = tools.find((entry) => entry.id === id);
    return tool ? [tool] : [];
  });

  const needle = query.trim().toLowerCase();
  const visible = tools.filter(
    (tool) =>
      (category === 'All' || tool.category === category) &&
      (skill === 'All' || tool.skill === skill) &&
      (!needle || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(needle))
  );

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
          placeholder={tr('Search tools')}
          aria-label={tr('Search tools')}
        />
        <div className="filter-group">
          <span className="filter-label"><Tr>Category</Tr></span>
          <div className="filter-chips" role="group" aria-label={tr('Filter by category')}>
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                className={name === category ? 'chip active' : 'chip'}
                aria-pressed={name === category}
                onClick={() => updateUrl({ category: name })}
              >
                <Tr>{name}</Tr>
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label"><Tr>Skill level</Tr></span>
          <div className="filter-chips" role="group" aria-label={tr('Filter by skill level')}>
            {skills.map((name) => (
              <button
                key={name}
                type="button"
                className={name === skill ? 'chip active' : 'chip'}
                aria-pressed={name === skill}
                onClick={() => updateUrl({ skill: name })}
              >
                <Tr>{name}</Tr>
              </button>
            ))}
          </div>
        </div>
        <div className="filter-summary">
          <p role="status">
            <Tr values={{ shown: visible.length, total: tools.length }}>{'Showing {shown} of {total} tools'}</Tr>
          </p>
          {filtersActive && (
            <button className="chip" type="button" onClick={clearFilters}>
              <Tr>Clear filters</Tr>
            </button>
          )}
        </div>
      </div>
      {comparedTools.length > 0 && (
        <section className="tool-comparison" aria-labelledby="tool-comparison-title">
          <div className="comparison-heading">
            <div>
              <span className="eyebrow"><Tr>Choose with confidence</Tr></span>
              <h2 id="tool-comparison-title"><Tr>Compare selected tools</Tr></h2>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => updateUrl({ compare: [] })}>
              <Tr>Clear comparison</Tr>
            </button>
          </div>
          <div className="comparison-scroll" tabIndex={0} role="region" aria-label={tr('Tool comparison table')}>
            <table>
              <thead>
                <tr>
                  <th scope="col"><Tr>Comparison</Tr></th>
                  {comparedTools.map((tool) => (
                    <th scope="col" key={tool.id}>
                      {tool.name}
                      <button
                        type="button"
                        className="comparison-remove"
                        aria-label={tr('Remove {name} from comparison', { name: tool.name })}
                        onClick={() => toggleComparison(tool.id)}
                      >
                        ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"><Tr>Category</Tr></th>
                  {comparedTools.map((tool) => <td key={tool.id}><Tr>{tool.category}</Tr></td>)}
                </tr>
                <tr>
                  <th scope="row"><Tr>Skill level</Tr></th>
                  {comparedTools.map((tool) => <td key={tool.id}><Tr>{tool.skill}</Tr></td>)}
                </tr>
                <tr>
                  <th scope="row"><Tr>Best for</Tr></th>
                  {comparedTools.map((tool) => <td key={tool.id}><Tr>{tool.description}</Tr></td>)}
                </tr>
                <tr>
                  <th scope="row"><Tr>Highlights</Tr></th>
                  {comparedTools.map((tool) => <td key={tool.id}><Tr>{tool.badge}</Tr></td>)}
                </tr>
                <tr>
                  <th scope="row"><Tr>Visit</Tr></th>
                  {comparedTools.map((tool) => (
                    <td key={tool.id}>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <Tr>Open tool</Tr>
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="comparison-note"><Tr>The comparison is saved in this page URL, so you can share it.</Tr></p>
        </section>
      )}
      {visible.length ? (
        <div className="tool-directory">
          {visible.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              comparison={{
                selected: comparedIds.includes(tool.id),
                disabled: comparedIds.length >= 3 && !comparedIds.includes(tool.id),
                onToggle: () => toggleComparison(tool.id)
              }}
            />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          <Tr>No tools match your filters. Try another keyword or clear the filters.</Tr>
        </p>
      )}
    </>
  );
}
