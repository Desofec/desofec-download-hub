import type { Tool } from '@/lib/types';

type ToolSearchFields = Pick<Tool, 'name' | 'description' | 'category' | 'skill' | 'badge'>;

// Matches both the original English text and the text shown in the visitor's language.
export function toolSearchText(tool: ToolSearchFields, translate: (text: string) => string) {
  const fields = [tool.description, tool.category, tool.skill, tool.badge];
  return [tool.name, ...fields, ...fields.map((field) => translate(field))].join(' ');
}

export function normalizeSearch(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function toolMatchesSearch(tool: ToolSearchFields, query: string, translate: (text: string) => string) {
  const needle = normalizeSearch(query.trim());
  return !needle || normalizeSearch(toolSearchText(tool, translate)).includes(needle);
}
