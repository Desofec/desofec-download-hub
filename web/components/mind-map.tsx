'use client';

import { useSyncExternalStore } from 'react';
import { useTr } from '@/components/tr';

type MapNode = { id: string; text: string; children: MapNode[] };

const STORAGE_KEY = 'desofec:mindmap';
const EVENT_NAME = 'desofec-mindmap-change';
const MAX_NODES = 40;
const MAX_DEPTH = 4;

const emptyMap: MapNode = { id: 'root', text: '', children: [] };

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function isNode(value: unknown): value is MapNode {
  if (!value || typeof value !== 'object') return false;
  const node = value as MapNode;
  return typeof node.id === 'string' && typeof node.text === 'string' && Array.isArray(node.children) && node.children.every(isNode);
}

function parse(raw: string): MapNode {
  try {
    const value: unknown = JSON.parse(raw);
    return isNode(value) ? value : emptyMap;
  } catch {
    return emptyMap;
  }
}

function save(tree: MapNode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch {}
  window.dispatchEvent(new Event(EVENT_NAME));
}

function count(node: MapNode): number {
  return 1 + node.children.reduce((total, child) => total + count(child), 0);
}

function edit(node: MapNode, id: string, change: (target: MapNode) => MapNode | null): MapNode | null {
  if (node.id === id) return change(node);
  return {
    ...node,
    children: node.children.flatMap((child) => {
      const next = edit(child, id, change);
      return next ? [next] : [];
    })
  };
}

export function MindMap() {
  const tr = useTr();
  const tree = parse(useSyncExternalStore(subscribe, readRaw, () => ''));
  const total = count(tree);

  function rename(id: string, text: string) {
    save(edit(tree, id, (node) => ({ ...node, text })) ?? tree);
  }

  function addBranch(id: string) {
    if (total >= MAX_NODES) return;
    const child: MapNode = { id: crypto.randomUUID(), text: '', children: [] };
    save(edit(tree, id, (node) => ({ ...node, children: [...node.children, child] })) ?? tree);
  }

  function remove(id: string) {
    save(edit(tree, id, () => null) ?? tree);
  }

  function renderNode(node: MapNode, depth: number) {
    const isRoot = depth === 0;
    return (
      <li key={node.id}>
        <div className="mind-node">
          <input
            aria-label={isRoot ? tr('Central idea') : tr('Branch')}
            placeholder={isRoot ? tr('Central idea, for example: My first app') : tr('Type an idea')}
            maxLength={80}
            value={node.text}
            onChange={(event) => rename(node.id, event.target.value)}
          />
          {depth < MAX_DEPTH && (
            <button
              className="btn btn-secondary"
              type="button"
              disabled={total >= MAX_NODES}
              onClick={() => addBranch(node.id)}
              aria-label={tr('Add branch')}
              title={tr('Add branch')}
            >
              +
            </button>
          )}
          {!isRoot && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => remove(node.id)}
              aria-label={tr('Remove')}
              title={tr('Remove')}
            >
              ×
            </button>
          )}
        </div>
        {node.children.length > 0 && <ul className="mind-children">{node.children.map((child) => renderNode(child, depth + 1))}</ul>}
      </li>
    );
  }

  return (
    <div className="break-card break-wide">
      <h2>{tr('Mind map')}</h2>
      <p>{tr('Put one idea in the middle, then branch out. Great for planning a project or summarising a lesson. Saved on this device.')}</p>
      <ul className="mind-root">{renderNode(tree, 0)}</ul>
      <div className="break-row">
        <button className="btn btn-secondary" type="button" onClick={() => save(emptyMap)}>
          {tr('Clear map')}
        </button>
        <span>{tr('{count} of {max} ideas', { count: total, max: MAX_NODES })}</span>
      </div>
    </div>
  );
}
